/*
 * Reads the menu sections out of docs/gaps/*.md and folds them into src/data/counters.json.
 *
 *   node scripts/menu-sections.mjs          # report what it found, change nothing
 *   node scripts/menu-sections.mjs --write   # write them into counters.json
 *
 * A menu does not have sections called "Sauces & Gravies". It has Salsas, and Fillings, and
 * Arroz y Frijoles. The gap notes recorded those section names per counter while reading each
 * counter as a menu, in the shape
 *
 *     **Salsas and the table.** salsa-roja · guacamole · mole-poblano
 *
 * so they are extracted rather than retyped. Anything unparsed is reported, never guessed at.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GAPS = path.join(ROOT, 'docs/gaps');
const COUNTERS_FILE = path.join(ROOT, 'src/data/counters.json');
const RECIPES_FILE = path.join(ROOT, 'src/generated/recipes.json');

const write = process.argv.includes('--write');
const file = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8'));
const recipes = JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));
const slugs = new Set(recipes.map((r) => r.slug));

/** The "What it has" block only — later sections list things we do NOT have. */
function whatItHas(markdown) {
  const start = markdown.search(/^##\s+What it has\s*$/m);
  if (start < 0) return null;
  const rest = markdown.slice(start + 1);
  const end = rest.search(/^##\s/m);
  return end < 0 ? rest : rest.slice(0, end);
}

/*
 * A section line is a bold lead-in followed by slugs separated by middots. Parenthetical
 * asides after a slug are notes, not part of the name.
 */
function parseSections(block) {
  const sections = [];
  const unparsed = [];

  for (const raw of block.split(/\n(?=\*\*)/)) {
    const line = raw.replace(/\n+/g, ' ').trim();
    if (!line.startsWith('**')) continue;

    const match = line.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
    if (!match) {
      unparsed.push(line.slice(0, 80));
      continue;
    }

    const title = match[1].replace(/\s*[.—-]\s*$/, '').split(/\s+—\s+/)[0].replace(/\.$/, '').trim();
    /*
     * Take every slug-shaped token the piece contains rather than only the one it starts
     * with: some headings carry an aside first ("— the strongest section on the site.")
     * and the slug follows it. Prose cannot collide with this, because prose separates
     * words with spaces and a slug is hyphenated, and anything matched still has to be
     * shelved at this counter to survive the check below.
     */
    const found = [];
    for (const piece of match[2].split('·')) {
      const cleaned = piece.replace(/\([^)]*\)/g, '').trim();

      // Normally the piece IS the slug.
      const first = cleaned.match(/^[a-z0-9]+(?:-[a-z0-9]+)*/)?.[0];
      if (first && slugs.has(first)) {
        found.push(first);
        continue;
      }

      /*
       * Otherwise the heading carried an aside before its first item ("— the strongest
       * section on the site."). Scan for a slug, but only a hyphenated one: a bare word
       * like "flan" or "naan" appears in prose all the time and would be picked up from
       * a sentence that was only mentioning it.
       */
      const hits = (cleaned.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? []).filter((t) => slugs.has(t));
      if (hits.length) found.push(...hits);
      else if (cleaned) unparsed.push(`${title}: ${cleaned.slice(0, 60)}`);
    }

    if (found.length) sections.push({ title, items: found });
  }

  return { sections, unparsed };
}

let problems = 0;

for (const counter of file.counters) {
  const gapFile = path.join(GAPS, `${counter.slug}.md`);
  if (!fs.existsSync(gapFile)) {
    console.log(`  --   ${counter.name}: no gap note`);
    problems++;
    continue;
  }

  const block = whatItHas(fs.readFileSync(gapFile, 'utf8'));
  if (!block) {
    console.log(`  --   ${counter.name}: gap note has no "What it has" block`);
    problems++;
    continue;
  }

  const { sections, unparsed } = parseSections(block);
  const mine = recipes.filter((r) => r.counters.includes(counter.name)).map((r) => r.slug);
  const placed = new Set(sections.flatMap((s) => s.items));
  const missing = mine.filter((slug) => !placed.has(slug));
  const extra = [...placed].filter((slug) => !mine.includes(slug));

  console.log(
    `  ok   ${counter.name}: ${sections.length} sections, ${placed.size}/${mine.length} placed`,
  );
  for (const section of sections) console.log(`         ${section.title} (${section.items.length})`);
  if (missing.length) {
    console.log(`         unplaced -> ${missing.join(', ')}`);
    problems++;
  }
  if (extra.length) {
    console.log(`         listed but not shelved here -> ${extra.join(', ')}`);
    problems++;
  }
  for (const note of unparsed.slice(0, 4)) console.log(`         unparsed: ${note}`);

  // Anything the notes missed still has to appear on the menu.
  if (missing.length) sections.push({ title: 'Also', items: missing });
  counter.sections = sections;
}

if (write) {
  fs.writeFileSync(COUNTERS_FILE, `${JSON.stringify(file, null, 2)}\n`);
  console.log(`\nwrote sections into ${path.relative(ROOT, COUNTERS_FILE)}`);
} else {
  console.log('\ndry run — pass --write to fold these into counters.json');
}
console.log(problems ? `${problems} counter(s) need a look.` : 'every counter parsed cleanly.');
