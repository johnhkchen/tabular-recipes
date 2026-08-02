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
 * browser, or the build moved underneath the run) — in which case it prints how to check by
 * hand instead.
 *
 * Why a script and not a test: it needs a browser to measure real layout, and adding one to
 * package.json is both a dependency this project does not otherwise have and something a CI
 * container may not be able to run. So it uses the Chrome already on the machine, talks to it
 * over the DevTools protocol with node's built-in WebSocket, and stays out of `npm run verify`.
 * `npm run verify:mobile` is where it and its sibling live. Nothing here is imported by the
 * site; the build never sees this file.
 *
 * The serving and the browser talk live in scripts/browser.mjs, shared with check-touch.mjs.
 *
 * The rule it enforces, from S-004: no horizontal scroll on <body>, anywhere, at any width. A
 * surface that must scroll sideways does it inside its own container — the table already does,
 * via .table-scroll.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { BY_HAND, CHROME, ROOT, launch, open, pages, serve, viewport, watchBuild } from './browser.mjs';

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

const build = watchBuild(root);
const { server, port } = await serve(root);
let chrome;
let failures = 0;
let checked = 0;

try {
  chrome = await launch();
  const page = await open(chrome.wsUrl);

  if (shots) await mkdir(resolve(ROOT, shots), { recursive: true });
  const manifest = [];

  for (const width of widths) {
    const metrics = viewport(width);
    for (const route of routes) {
      /*
       * The viewport has to be re-asserted after the navigation and checked, or the page
       * measures itself at Chrome's 980px fallback and reads as an overflow that is not there.
       * page.go() does that and says whether it held.
       */
      if (!(await page.go(`http://127.0.0.1:${port}${route}`, metrics))) {
        console.error(`could not hold ${route} at ${width}px — skipped`);
        failures++;
        continue;
      }

      const seen = await page.evaluate(PROBE);
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
        const shot = await page.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
        });
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

/*
 * A build that changed underneath the sweep serves some pages with their stylesheet and some
 * without, and an unstyled page has no overflow-x: auto anywhere. Whatever this run found, it is
 * not evidence — in either direction. Two tickets in S-004 chased a page reported by exactly
 * this race, so it is named rather than left to be rediscovered a third time.
 */
if (build.moved()) {
  console.error(
    `\n${relative(ROOT, root)}/ changed while this was reading it — a build running alongside, ` +
      `most likely. Nothing above is evidence either way. Re-run against a build standing still.`,
  );
  process.exit(2);
}

const widthList = widths.join('px, ') + 'px';
console.log(
  failures === 0
    ? `\n${checked} page views at ${widthList} — nothing scrolls sideways.`
    : `\n${checked} page views at ${widthList} — ${failures} scroll sideways.`,
);
process.exit(failures === 0 ? 0 : 1);
