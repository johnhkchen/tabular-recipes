/*
 * Counts how much a built recipe page actually says, and finds the pages that say the most.
 *
 *   npm run build
 *   node scripts/measure-pages.mjs                        # mean, median, max, wordiest ten
 *   node scripts/measure-pages.mjs --slug ching-bo-leung-soup   # one page
 *   node scripts/measure-pages.mjs --count "so both numbers are floors"  # pages carrying it
 *   node scripts/measure-pages.mjs --all                  # slug<TAB>count, one per line
 *   node scripts/measure-pages.mjs --root <dir>           # a build other than dist/
 *
 * Reads the built HTML, writes nothing, exits 0 unless it cannot find a build. It measures
 * and does not judge: `scripts/check-recipes.mjs` is what fails a build, and it works on the
 * source files rather than the pages. So this stays out of `npm run verify`.
 *
 * ---- the method, and why it is exactly this method --------------------------
 *
 * S-005 was written from a count of "visible characters" per page — stripping tags out of
 * the built HTML with the collapsed source block excluded. That count was made by hand and
 * lived nowhere; T-005-02, T-005-05 and T-005-06 each rebuilt it in a throwaway script, and
 * every figure any of them published came out of a different copy of it. This is that
 * method, written down once, so a later pass compares against S-005 rather than re-deriving.
 *
 * T-005-02's research.md §8 reconstructed it as: take <main>, drop <details class="source">,
 * <script>, <style> and comments, strip the remaining tags with no substitution, decode
 * entities, collapse whitespace. That is what this file does. Run against a build of the
 * tree as it stood at 1ae1165 — the commit before S-005 began — it says:
 *
 *     mean over 658 pages   3487  (story: 3487)
 *     median                3376  (story: 3379)
 *     max                   6219  (story: 6223, ching-bo-leung-soup, and it is the same page)
 *
 * The mean is exact and nothing is off by more than 4 characters in 6000. The wordiest ten
 * comes out as the Chinese soup shelf, which is what the story said it was. That agreement
 * is the only test this file has, and it is a good one: it pins the script against numbers
 * a person published before any of this code existed. If it ever stops reproducing them, it
 * has drifted from the baseline every S-005 figure is quoted against.
 *
 * The source block is excluded because it is the .cook file printed verbatim inside a
 * collapsed <details>. It is not prose a reader meets; counting it would measure the recipe
 * twice and swamp everything the story was about.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const root = path.resolve(ROOT, flag('root', 'dist'));

/*
 * The slugs are read off the parsed collection rather than off the directory listing,
 * because dist/ also holds the front door, the list, the plan, the 404 and twenty menu
 * pages, and none of those is a recipe page. 682 built, 658 measured.
 */
const generated = path.join(ROOT, 'src/generated/recipes.json');
if (!fs.existsSync(generated)) {
  console.error(`no ${path.relative(ROOT, generated)} — run: npm run recipes`);
  process.exit(2);
}
if (!fs.existsSync(root)) {
  console.error(`no build at ${path.relative(ROOT, root)} — run: npm run build`);
  process.exit(2);
}
const parsed = JSON.parse(fs.readFileSync(generated, 'utf8'));
const slugs = (parsed.recipes ?? parsed).map((r) => r.slug).sort();

/*
 * What a reader meets on the page, in characters.
 *
 * Every step here is load-bearing and the order matters:
 *
 *   <main>          the site bar, the skip link and the footer are chrome on all 682 pages;
 *                   counting them would add the same constant to every number.
 *   the source      <details class="source"> is the whole .cook file. See the header.
 *   script, style   never rendered as words.
 *   tags, then      stripped with NO substitution — not replaced by a space. Two adjacent
 *   entities        cells run together as one word, which is wrong by a handful of
 *                   characters per page and is what the story's own figures did.
 *   whitespace      HTML indentation is not something a reader reads.
 */
export function visible(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) return null;
  return main[1]
    .replace(/<details\b[^>]*class="[^"]*\bsource\b[^"]*"[\s\S]*?<\/details>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

const read = (slug) => {
  const file = path.join(root, slug, 'index.html');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
};

/* ---- one page ------------------------------------------------------------- */

const one = flag('slug');
if (one) {
  const html = read(one);
  if (!html) { console.error(`no page for ${one} in ${path.relative(ROOT, root)}`); process.exit(2); }
  const text = visible(html);
  console.log(`${text.length}\t${one}`);
  if (argv.includes('--text')) console.log(`\n${text}`);
  process.exit(0);
}

/* ---- a string across the collection ---------------------------------------- */

const needle = flag('count');
if (needle) {
  const hits = slugs.filter((slug) => {
    const html = read(slug);
    return html && visible(html).includes(needle);
  });
  console.log(`${hits.length}\t${needle}`);
  if (argv.includes('--list')) for (const slug of hits) console.log(`       ${slug}`);
  process.exit(0);
}

/* ---- the collection --------------------------------------------------------- */

const counts = [];
let missing = 0;
for (const slug of slugs) {
  const html = read(slug);
  if (!html) { missing++; continue; }
  counts.push({ slug, n: visible(html).length });
}

if (argv.includes('--all')) {
  for (const { slug, n } of counts) console.log(`${n}\t${slug}`);
  process.exit(0);
}

const sorted = [...counts].sort((a, b) => a.n - b.n);
const total = counts.reduce((sum, c) => sum + c.n, 0);
const mid = sorted.length >> 1;
const median = sorted.length % 2 ? sorted[mid].n : Math.round((sorted[mid - 1].n + sorted[mid].n) / 2);

console.log(`${counts.length} recipe page(s) in ${path.relative(ROOT, root) || '.'}` +
  (missing ? `  (${missing} not built)` : ''));
console.log(`  mean    ${Math.round(total / counts.length)}`);
console.log(`  median  ${median}`);
console.log(`  max     ${sorted.at(-1).n}  ${sorted.at(-1).slug}`);
console.log(`  min     ${sorted[0].n}  ${sorted[0].slug}`);
console.log(`  total   ${total.toLocaleString('en-US')}`);
console.log('\nthe wordiest ten:');
for (const { slug, n } of sorted.slice(-10).reverse()) console.log(`  ${String(n).padStart(5)}  ${slug}`);
