/*
 * Opens the built site in a real browser at a phone's width and says which pages scroll
 * sideways. Writes nothing.
 *
 *   npm run build
 *   node scripts/check-overflow.mjs                       # every page, at 375px
 *   node scripts/check-overflow.mjs --width 375,390,768    # three widths
 *   node scripts/check-overflow.mjs / /list/ /miso-ramen/  # a few pages
 *   node scripts/check-overflow.mjs --shots shots/before   # PNGs + hashes, for a before/after
 *
 * Exits 0 if nothing scrolls, 1 if something does, 2 if it could not look (no build, no
 * browser) — in which case it prints how to check by hand instead.
 *
 * Why a script and not a test: it needs a browser to measure real layout, and adding one to
 * package.json is both a dependency this project does not otherwise have and something a CI
 * container may not be able to run. So it uses the Chrome already on the machine, talks to it
 * over the DevTools protocol with node's built-in WebSocket, and stays out of `npm run verify`.
 * Nothing here is imported by the site; the build never sees this file.
 *
 * The rule it enforces, from S-004: no horizontal scroll on <body>, anywhere, at any width. A
 * surface that must scroll sideways does it inside its own container — the table already does,
 * via .table-scroll.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, existsSync } from 'node:fs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs/promises';

const ROOT = resolve(import.meta.dirname, '..');

const BY_HAND = `
To check by hand instead: build, serve dist/, open a page, and in the console run

  document.documentElement.scrollWidth <= document.documentElement.clientWidth

with the device toolbar at 375px. If that is false, this finds the culprit:

  [...document.querySelectorAll('body *')]
    .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5)
    .filter(el => !el.closest('.table-scroll'))

An element past the right edge is only a fault if no ancestor scrolls it — check the
computed overflow-x of its parents before believing it.
`;

/* ---- arguments ----------------------------------------------------------- */

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const root = resolve(ROOT, flag('root', 'dist'));
const widths = String(flag('width', '375')).split(',').map(Number);
const shots = flag('shots', null);
const only = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));

const CHROME =
  process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* ---- serving the build --------------------------------------------------- */

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

/*
 * astro.config.mjs builds with trailingSlash 'always' and format 'directory', so /list/ is
 * dist/list/index.html. Anything without an extension gets the same treatment.
 */
async function serve(dir) {
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = extname(path) ? join(dir, path) : join(dir, path, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { server, port: server.address().port };
}

function pages(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_astro') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) pages(path, found);
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

/* ---- talking to Chrome --------------------------------------------------- */

async function launch() {
  const profile = await mkdtemp(join(tmpdir(), 'overflow-'));
  const child = spawn(
    CHROME,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const wsUrl = await new Promise((ok, fail) => {
    let said = '';
    const giveUp = setTimeout(() => fail(new Error('Chrome never reported a debugging port')), 20000);
    child.stderr.on('data', (chunk) => {
      said += chunk;
      const found = said.match(/ws:\/\/\S+/);
      if (found) {
        clearTimeout(giveUp);
        ok(found[0]);
      }
    });
    child.on('error', fail);
    child.on('exit', (code) => fail(new Error(`Chrome exited ${code}: ${said.slice(0, 300)}`)));
  });
  return { child, wsUrl };
}

/* A DevTools client small enough to read: send by id, resolve by id, fan events out by method. */
class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.waiting = new Map();
    this.watchers = new Map();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id != null) {
        const pending = this.waiting.get(message.id);
        this.waiting.delete(message.id);
        if (!pending) return;
        if (message.error) pending.fail(new Error(JSON.stringify(message.error)));
        else pending.ok(message.result);
      } else {
        for (const watcher of this.watchers.get(message.method) ?? []) watcher(message.params);
      }
    });
  }
  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((ok, fail) => {
      socket.addEventListener('open', ok, { once: true });
      socket.addEventListener('error', fail, { once: true });
    });
    return new Cdp(socket);
  }
  on(method, watcher) {
    if (!this.watchers.has(method)) this.watchers.set(method, []);
    this.watchers.get(method).push(watcher);
  }
  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    return new Promise((ok, fail) => {
      this.waiting.set(id, { ok, fail });
      this.socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

/*
 * Everything one page has to say, in a single evaluate.
 *
 * Two distinctions the numbers are useless without:
 *
 *   - Left is not right. The skip link sits at left: -9999px on every page and creates no
 *     scrollable area in a left-to-right document. Counting it would fail all 682 pages.
 *   - Inside a scroller is not overflow. The table is deliberately wider than a phone and
 *     scrolls within .table-scroll; that is the pattern the whole story is built on, not a
 *     fault. So each escaping element is tagged with the nearest ancestor that scrolls it.
 */
const PROBE = `(() => {
  const root = document.documentElement;
  const width = root.clientWidth;
  const past = [];
  for (const el of document.querySelectorAll('body *')) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    if (box.right <= width + 0.5 && box.left >= -0.5) continue;
    let scroller = null;
    for (let up = el.parentElement; up; up = up.parentElement) {
      const overflow = getComputedStyle(up).overflowX;
      if (overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden') { scroller = up; break; }
    }
    const name = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
    past.push({
      tag: el.tagName.toLowerCase(),
      cls: String(name || '').trim(),
      left: Math.round(box.left),
      right: Math.round(box.right),
      held: scroller ? scroller.tagName.toLowerCase() + (scroller.className ? '.' + String(scroller.className).trim().split(/\\s+/).join('.') : '') : null,
    });
  }
  return {
    width,
    scrollWidth: root.scrollWidth,
    scrolls: root.scrollWidth > width,
    loose: past.filter((p) => p.right > width + 0.5 && !p.held),
    held: past.filter((p) => p.held).length,
    offLeft: past.filter((p) => p.left < -0.5 && p.right <= width + 0.5).length,
  };
})()`;

/* ---- the sweep ----------------------------------------------------------- */

if (!existsSync(root)) {
  console.error(`No build at ${relative(ROOT, root)}/. Run: npm run build`);
  console.error(BY_HAND);
  process.exit(2);
}
if (!existsSync(CHROME)) {
  console.error(`No browser at ${CHROME}. Set CHROME_BIN to one, or install Chrome.`);
  console.error(BY_HAND);
  process.exit(2);
}

const routes = only.length
  ? only
  : pages(root)
      .sort()
      .map((file) => '/' + relative(root, file).replace(/index\.html$/, ''));

const { server, port } = await serve(root);
let chrome;
let failures = 0;
let checked = 0;

try {
  chrome = await launch();
  const browser = await Cdp.connect(chrome.wsUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params) => browser.send(method, params, sessionId);
  await send('Page.enable');

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };

  if (shots) await mkdir(resolve(ROOT, shots), { recursive: true });
  const manifest = [];

  for (const width of widths) {
    const metrics = { width, height: 1200, deviceScaleFactor: 1, mobile: false };
    for (const route of routes) {
      await send('Emulation.setDeviceMetricsOverride', metrics);
      const loaded = new Promise((done) => {
        browser.on('Page.loadEventFired', () => done());
        setTimeout(done, 8000);
      });
      await send('Page.navigate', { url: `http://127.0.0.1:${port}${route}` });
      await loaded;

      /*
       * Re-assert the viewport after the navigation and check it took. An override set while a
       * navigation is in flight is quietly dropped, and the page then measures itself at
       * Chrome's 980px fallback — which reads as an overflow that is not there.
       */
      let settled = false;
      for (let tries = 0; tries < 5 && !settled; tries++) {
        await send('Emulation.setDeviceMetricsOverride', metrics);
        await new Promise((r) => setTimeout(r, 120));
        settled = (await evaluate('document.documentElement.clientWidth')) === width;
      }
      if (!settled) {
        console.error(`could not hold ${route} at ${width}px — skipped`);
        failures++;
        continue;
      }

      const seen = await evaluate(PROBE);
      checked++;
      if (seen.scrolls || seen.loose.length > 0) {
        failures++;
        console.log(
          `SCROLLS  ${width}px  ${route}  (${seen.scrollWidth}px of content in a ${seen.width}px window)`,
        );
        for (const one of seen.loose) {
          console.log(`           <${one.tag}${one.cls ? ` class="${one.cls}"` : ''}> reaches ${one.right}px`);
        }
      }

      if (shots) {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
        const name = `${width}${route.replace(/\//g, '_') || '_'}.png`;
        await writeFile(join(resolve(ROOT, shots), name), Buffer.from(shot.data, 'base64'));
        manifest.push(`${createHash('sha256').update(shot.data).digest('hex')}  ${name}`);
      }

      if (checked % 100 === 0) console.error(`  …${checked} pages`);
    }
  }

  if (shots) {
    await writeFile(join(resolve(ROOT, shots), 'hashes.txt'), manifest.join('\n') + '\n');
    console.log(`\n${manifest.length} shots and their hashes in ${shots}/`);
  }
} catch (problem) {
  console.error(`Could not finish: ${problem.message}`);
  console.error(BY_HAND);
  chrome?.child.kill();
  server.close();
  process.exit(2);
}

chrome.child.kill();
server.close();

const widthList = widths.join('px, ') + 'px';
console.log(
  failures === 0
    ? `\n${checked} page views at ${widthList} — nothing scrolls sideways.`
    : `\n${checked} page views at ${widthList} — ${failures} scroll sideways.`,
);
process.exit(failures === 0 ? 0 : 1);
