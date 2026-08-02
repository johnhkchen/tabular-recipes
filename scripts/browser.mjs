/*
 * Serving the build to a real browser, and talking to it.
 *
 * This is the plumbing scripts/check-overflow.mjs invented and scripts/check-touch.mjs needs
 * too: a static file server that understands the build's directory-index shape, a headless
 * Chrome on a throwaway profile, a DevTools client small enough to read, and the one piece of
 * hard-won knowledge in the whole arrangement — how to make a viewport override actually take.
 *
 * It knows about browsers and files. It knows nothing about overflow, tap targets, recipes or
 * this site; each checker keeps its own probe and its own opinions. Nothing here is imported by
 * the site, and `astro build` never sees this file.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs/promises';

export const ROOT = resolve(import.meta.dirname, '..');

export const CHROME =
  process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const BY_HAND = `
To check by hand instead: build, serve dist/, open a page, and in the console run

  document.documentElement.scrollWidth <= document.documentElement.clientWidth

with the device toolbar at 375px. If that is false, this finds the culprit:

  [...document.querySelectorAll('body *')]
    .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5)
    .filter(el => !el.closest('.table-scroll'))

An element past the right edge is only a fault if no ancestor scrolls it — check the
computed overflow-x of its parents before believing it.

For a tap target, the same by hand:

  [...document.querySelectorAll('a[href], button, summary, input, label')]
    .filter(el => el.getBoundingClientRect().height < 44)
`;

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
export async function serve(dir) {
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

/** Every built page under a directory, `_astro` skipped. */
export function pages(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_astro') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) pages(path, found);
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

/*
 * A sweep serves files straight off disk, so a build running underneath it swaps pages out
 * mid-run. What that looks like is one page loading without its stylesheet — and an unstyled
 * <pre> has no overflow-x: auto, so it reads as a fault that is not there. Two tickets in S-004
 * chased exactly that ghost.
 *
 * So the newest mtime under the root is taken before the run and compared after it. This cannot
 * prevent the race; it can say the result is not to be believed, which is the difference between
 * a confusing failure and an accurate one.
 */
export function watchBuild(dir) {
  const newest = (at) => {
    let latest = 0;
    for (const entry of readdirSync(at, { withFileTypes: true })) {
      const path = join(at, entry.name);
      latest = Math.max(latest, entry.isDirectory() ? newest(path) : statSync(path).mtimeMs);
    }
    return latest;
  };
  const before = newest(dir);
  return { moved: () => newest(dir) !== before };
}

/* ---- talking to Chrome --------------------------------------------------- */

export async function launch() {
  const profile = await mkdtemp(join(tmpdir(), 'b28-shot-'));
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
export class Cdp {
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

/**
 * One attached page, with the three verbs a checker needs.
 *
 * `go` carries the knowledge: an Emulation.setDeviceMetricsOverride issued while a navigation is
 * in flight is quietly dropped, and the page then measures itself at Chrome's 980px fallback —
 * which reads as an overflow that is not there. So the override is re-asserted after the load
 * and checked until it holds. `go` returns false when it never did; a caller that ignores that
 * is measuring a lie.
 */
export async function open(wsUrl) {
  const browser = await Cdp.connect(wsUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params) => browser.send(method, params, sessionId);
  await send('Page.enable');

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };

  const navigate = async (url) => {
    const loaded = new Promise((done) => {
      browser.on('Page.loadEventFired', () => done());
      setTimeout(done, 8000);
    });
    await send('Page.navigate', { url });
    await loaded;
  };

  const go = async (url, metrics) => {
    await send('Emulation.setDeviceMetricsOverride', metrics);
    await navigate(url);
    for (let tries = 0; tries < 5; tries++) {
      await send('Emulation.setDeviceMetricsOverride', metrics);
      await new Promise((r) => setTimeout(r, 120));
      if ((await evaluate('document.documentElement.clientWidth')) === metrics.width) return true;
    }
    return false;
  };

  return { send, evaluate, navigate, go, on: (m, w) => browser.on(m, w) };
}

/** The metrics object every checker wants: a width, a tall window, no device pretence. */
export const viewport = (width, height = 1200) => ({
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
});
