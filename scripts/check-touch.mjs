/*
 * Opens the built site in a real browser at a phone's width and says which pages have something
 * on them a thumb cannot hit — and whether the table's three narrow-width promises are being
 * kept. Writes nothing.
 *
 *   npm run build
 *   node scripts/check-touch.mjs                       # every page, at 375px and 390px
 *   node scripts/check-touch.mjs --width 375           # one width
 *   node scripts/check-touch.mjs / /list/ /miso-ramen/ # a few pages
 *
 * Exits 0 if everything is reachable, 1 if something is not, 2 if it could not look.
 *
 * Why this exists. Five tickets in S-004 raised tap targets to 44px, and every one of them
 * measured the result with a throwaway rig and then deleted it. Four of their reviews end with
 * the same sentence: nothing in the repository would notice if a later edit put a control back
 * to 24px. This is that notice. It is a sibling of check-overflow.mjs in every way — same
 * plumbing, same exit codes, no dependencies, deliberately outside `npm run verify` because it
 * needs a browser CI may not have. `npm run verify:mobile` runs both.
 *
 * ---- what it claims -------------------------------------------------------
 *
 *   1. every visible interactive element is at least 44px tall — a thumb, not a mouse
 *   2. the shortest drawn table cell is at least 44px — every cell is a button
 *   3. .table-well[data-more] is set exactly when .table-scroll actually overflows — the edge
 *      cue must not say a table continues when it does not, or stay silent when it does
 *   4. .cell--ingredient is `sticky` below 44rem and `static` above it — the pinned column is
 *      a narrow-width behaviour and must not leak onto a desktop
 *
 * Claim 4 needs a width on each side of the breakpoint, so it also runs once at 768px, where
 * the answer must be the opposite.
 *
 * ---- what it does not count, and why --------------------------------------
 *
 * An exemption list nobody can read is an exemption list that quietly grows. These two, and
 * nothing else:
 *
 *   - an element clipped to a 1×1 box (`clip-path: inset(50%)`) is hidden, not small. The skip
 *     link and the shopping list's long scale word are both reachable and both correct; the
 *     skip link measures 44px the moment it takes focus.
 *   - an element with no box, or inside [hidden], is not on the page. The table's "Clear the
 *     marks" button ships hidden and appears only once something is crossed off; its height
 *     comes from the .clay-button floor rather than from this run.
 *
 * A label and its control are one target, not two, and the first draft of this file got that
 * wrong in both directions. A tap on either activates the control, so what a thumb is aiming at
 * is the UNION of the two boxes — and the union is what gets measured, once, under the label.
 *
 *   CookModes' tick: an 18.4px checkbox inside a 44px row. The row is the target.
 *   The finder: a 19px inline <label> wrapped around a 50px input. The input is the target.
 *
 * Measuring either box alone reports a fault on one of those two and misses it on the other.
 * The union reports both correctly and needs no exemption at all.
 *
 * /list/ is empty until a plan is in localStorage, so this seeds one before loading it. A check
 * that silently skipped the busiest page on the site would be worse than no check.
 */
import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { BY_HAND, CHROME, ROOT, launch, open, pages, serve, viewport, watchBuild } from './browser.mjs';

/* ---- arguments ----------------------------------------------------------- */

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const root = resolve(ROOT, flag('root', 'dist'));
const widths = String(flag('width', '375,390')).split(',').map(Number);
const only = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));

/** The floor, in one place, because it is the number the whole story is written around. */
const THUMB = 44;

/** Above `snug` the pinned column must be gone. One width is enough to prove a negative here. */
const DESKTOP = 768;

/*
 * A plan, so /list/ draws its lines instead of its empty state. Seven recipes across the whole
 * aisle walk; the shape is src/lib/plan.ts's StoredPlan, version 1.
 */
const SEED_PLAN = `localStorage.setItem('tabular-recipes:plan', JSON.stringify({version:1,items:[
  {slug:'miso-ramen',multiplier:1},{slug:'biryani',multiplier:1},{slug:'conchas',multiplier:1},
  {slug:'tonkotsu-broth',multiplier:1},{slug:'boston-baked-beans',multiplier:2},
  {slug:'aioli',multiplier:1},{slug:'pastrami',multiplier:1}]}))`;

/* ---- the probe ----------------------------------------------------------- */

const PROBE = `(() => {
  const THUMB = ${THUMB};
  const round = (n) => Math.round(n * 10) / 10;

  /*
   * Everything a finger is meant to land on. Table cells are here because every one of them is
   * tap-to-cross-off; .cell--blank is not, it is a column an ingredient skips on its way in.
   */
  const INTERACTIVE = [
    'a[href]', 'button', 'summary', 'select', 'textarea', '[role="button"]',
    'input:not([type="hidden"])', 'label', 'td.cell:not(.cell--blank)',
  ].join(', ');

  /* The control a label speaks for, whether it wraps it or points at it by id. */
  const spokenFor = (label) => {
    const inside = label.querySelector('input, select, textarea, button');
    if (inside) return inside;
    return label.htmlFor ? document.getElementById(label.htmlFor) : null;
  };

  /* One target's box: its own, grown to hold whatever it is the label for. */
  const target = (el) => {
    const box = el.getBoundingClientRect();
    const mate = el.matches('label') ? spokenFor(el) : null;
    if (!mate) return { top: box.top, bottom: box.bottom };
    const other = mate.getBoundingClientRect();
    return { top: Math.min(box.top, other.top), bottom: Math.max(box.bottom, other.bottom) };
  };

  /* A control its own label already speaks for is counted there, under the union, not twice. */
  const spoken = new Set();
  for (const label of document.querySelectorAll('label')) {
    const mate = spokenFor(label);
    if (mate) spoken.add(mate);
  }

  const short = [];
  for (const el of document.querySelectorAll(INTERACTIVE)) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    if (el.closest('[hidden]')) continue;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    if (style.clipPath !== 'none') continue;
    if (spoken.has(el)) continue;
    const reach = target(el);
    if (reach.bottom - reach.top >= THUMB - 0.5) continue;
    const cls = String(el.className || '').trim().split(/\\s+/).filter(Boolean).join('.');
    short.push({
      what: el.tagName.toLowerCase() + (cls ? '.' + cls : ''),
      h: round(reach.bottom - reach.top),
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 32),
    });
  }

  /* One line per distinct control, shortest instance, so a 107-item menu cannot print 107 times. */
  const worst = new Map();
  for (const one of short) {
    const seen = worst.get(one.what);
    if (!seen || one.h < seen.h) worst.set(one.what, { ...one, n: (seen?.n ?? 0) + 1 });
    else worst.set(one.what, { ...seen, n: seen.n + 1 });
  }

  const out = { short: [...worst.values()].sort((a, b) => a.h - b.h) };

  const scroller = document.querySelector('.table-scroll');
  if (scroller) {
    const cells = [...document.querySelectorAll('td.cell')];
    const ingredient = document.querySelector('.cell--ingredient');
    out.table = {
      shortestCell: cells.length ? round(Math.min(...cells.map((c) => c.getBoundingClientRect().height))) : null,
      overflows: scroller.scrollWidth > scroller.clientWidth + 0.5,
      over: scroller.scrollWidth - scroller.clientWidth,
      says: document.querySelector('.table-well').hasAttribute('data-more'),
      pinned: ingredient ? getComputedStyle(ingredient).position === 'sticky' : null,
    };
  }
  return out;
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
let faults = 0;
let checked = 0;

/** Said once per distinct fault, not once per page: 658 identical lines teach nothing. */
const already = new Set();
const say = (key, line) => {
  faults++;
  if (already.has(key)) return;
  already.add(key);
  console.log(line);
};

try {
  chrome = await launch();
  const page = await open(chrome.wsUrl);
  const base = `http://127.0.0.1:${port}`;
  let seeded = false;

  for (const width of [...widths, DESKTOP]) {
    const narrow = width <= 704; /* `snug`, 44rem — where the pinned column lives */
    const metrics = viewport(width);
    for (const route of routes) {
      if (!(await page.go(`${base}${route}`, metrics))) {
        console.error(`could not hold ${route} at ${width}px — skipped`);
        faults++;
        continue;
      }
      /* The plan has to be in place before the page reads it, so seed and load again. */
      if (route.startsWith('/list')) {
        if (!seeded) {
          await page.evaluate(SEED_PLAN);
          seeded = true;
        }
        if (!(await page.go(`${base}${route}`, metrics))) continue;
        await page.evaluate('new Promise((r) => setTimeout(r, 0))');
      }

      const seen = await page.evaluate(PROBE);
      checked++;

      /* Above the breakpoint only claim 4 is being made; the rest is the desktop drawing. */
      if (width === DESKTOP) {
        if (seen.table?.pinned === true) {
          say(`leak`, `LEAKS    ${width}px  ${route}  the ingredient column is still pinned above 44rem`);
        }
        continue;
      }

      for (const one of seen.short) {
        say(
          `${one.what}@${width}`,
          `SHORT    ${width}px  ${route}  <${one.what}> is ${one.h}px, wants ${THUMB}` +
            (one.text ? `  "${one.text}"` : '') +
            (one.n > 1 ? `  (×${one.n} here)` : ''),
        );
      }

      if (seen.table) {
        if (seen.table.shortestCell !== null && seen.table.shortestCell < THUMB - 0.5) {
          say(
            `cell@${width}`,
            `SHORT    ${width}px  ${route}  the shortest table cell is ${seen.table.shortestCell}px, wants ${THUMB}`,
          );
        }
        if (seen.table.overflows !== seen.table.says) {
          say(
            `more@${width}`,
            `LIES     ${width}px  ${route}  the table ${seen.table.overflows ? 'scrolls' : 'fits'} ` +
              `(${seen.table.over}px past the edge) but data-more is ${seen.table.says ? 'set' : 'absent'}`,
          );
        }
        if (narrow && seen.table.pinned === false) {
          say(
            `unpinned@${width}`,
            `LOOSE    ${width}px  ${route}  the ingredient column is not pinned below 44rem`,
          );
        }
      }

      if (checked % 100 === 0) console.error(`  …${checked} pages`);
    }
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

if (build.moved()) {
  console.error(
    `\n${relative(ROOT, root)}/ changed while this was reading it — a build running alongside, ` +
      `most likely. Nothing above is evidence either way. Re-run against a build standing still.`,
  );
  process.exit(2);
}

const widthList = [...widths, DESKTOP].join('px, ') + 'px';
console.log(
  faults === 0
    ? `\n${checked} page views at ${widthList} — everything a thumb has to hit is ${THUMB}px, ` +
        `the table says when it continues, and the pinned column stays below 44rem.`
    : `\n${checked} page views at ${widthList} — ${faults} faults, ${already.size} distinct. ` +
        `Each is printed once, on the first page it was seen.`,
);
process.exit(faults === 0 ? 0 : 1);
