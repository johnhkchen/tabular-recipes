/*
 * Compares every section's slug list in src/data/counters.json against what the built site
 * actually prints, counter by counter.
 *
 *   npm run build && node scripts/check-menus.mjs
 *
 * Nine slugs were listed on two counters and printed on neither for two stories, and nothing
 * noticed, because the page agreed with itself the whole time: the same filter that dropped the
 * items also produced the number at the top. So this reads the built HTML rather than calling
 * menuFor — a checker that runs the code under test agrees with the bug.
 *
 * Three questions per counter, and the second is the one only a reader of the page can answer:
 *
 *   1. Does every listed slug print at all?
 *   2. Does it print under the heading it was listed under? A slug that slid into "Also" is
 *      still on the page and is still wrong — "Also" means the sections forgot it.
 *   3. Does the count in the header match the number of items below it?
 *
 * Writes nothing, so any number of these can run at once.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist/menu');
const COUNTERS_FILE = path.join(ROOT, 'src/data/counters.json');

const { counters } = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8'));

if (!fs.existsSync(DIST)) {
  console.error(`no ${path.relative(ROOT, DIST)} — run \`npm run build\` first.`);
  process.exit(1);
}

/*
 * The built menu is <section class="menu-section"><h2>Title</h2> … data-slug="…" … </section>,
 * one section per heading. Split on the section boundary rather than on <h2>, so an <h2> that
 * ever appears outside a section cannot silently annex the items after it.
 */
function readMenu(html) {
  const sections = [];
  for (const block of html.split('<section class="menu-section">').slice(1)) {
    const body = block.split('</section>')[0];
    const title = body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim();
    if (title === undefined) continue;
    sections.push({ title, slugs: [...body.matchAll(/data-slug="([^"]+)"/g)].map((m) => m[1]) });
  }
  const stated = html.match(/<p class="count">\s*([0-9]+)\s+recipes?/)?.[1];
  return { sections, stated: stated === undefined ? null : Number(stated) };
}

let failed = 0;
let listedTotal = 0;
let printedTotal = 0;

for (const counter of counters) {
  const rel = `dist/menu/${counter.slug}/index.html`;
  const page = path.join(DIST, counter.slug, 'index.html');
  const listed = (counter.sections ?? []).flatMap((s) => s.items);
  listedTotal += listed.length;

  if (!fs.existsSync(page)) {
    /*
     * A counter with nothing shelved at it renders no page, and that is not a fault — it is
     * what `menus()` does. A counter that lists slugs and renders no page is.
     */
    if (listed.length) {
      console.log(`  FAIL ${counter.name.padEnd(24)} lists ${listed.length}, renders no page`);
      console.log(`         expected ${rel}`);
      failed++;
    } else {
      console.log(`  --   ${counter.name.padEnd(24)} nothing shelved, no page`);
    }
    continue;
  }

  const { sections, stated } = readMenu(fs.readFileSync(page, 'utf8'));
  const printed = sections.flatMap((s) => s.slugs);
  printedTotal += printed.length;

  const under = new Map();
  for (const section of sections) {
    for (const slug of section.slugs) under.set(slug, section.title);
  }

  const notPrinted = listed.filter((slug) => !under.has(slug));
  const wrongHeading = (counter.sections ?? []).flatMap((section) =>
    section.items
      .filter((slug) => under.has(slug) && under.get(slug) !== section.title)
      .map((slug) => `${slug} listed under "${section.title}", printed under "${under.get(slug)}"`),
  );
  const countWrong = stated === null || stated !== printed.length;

  const bad = notPrinted.length || wrongHeading.length || countWrong;
  if (bad) failed++;

  console.log(
    `  ${bad ? 'FAIL' : 'ok  '} ${counter.name.padEnd(24)}` +
      ` ${String(sections.length).padStart(2)} sections,` +
      ` ${String(listed.length).padStart(3)} listed,` +
      ` ${String(printed.length).padStart(3)} printed,` +
      ` count ${stated === null ? '?' : stated}`,
  );

  if (notPrinted.length) console.log(`         listed but not printed: ${notPrinted.join(', ')}`);
  for (const note of wrongHeading) console.log(`         ${note}`);
  if (countWrong) {
    console.log(`         header says ${stated ?? 'nothing'}, the page prints ${printed.length}`);
  }
}

console.log(
  `\n${counters.length} counter(s): ${listedTotal} slug(s) listed, ${printedTotal} printed.`,
);
console.log(
  failed
    ? `${failed} counter(s) do not print what they list.\n` +
        'A section orders what a shelf already holds. Either add the counter to that\n' +
        "recipe's >> counters: line, or drop the slug from src/data/counters.json.\n" +
        'docs/knowledge/counters.md#sections says why.'
    : 'every listed slug prints under the heading it was listed under.',
);

process.exit(failed ? 1 : 0);
