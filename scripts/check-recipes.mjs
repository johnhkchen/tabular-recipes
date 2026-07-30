/*
 * Checks .cook files one at a time and says exactly what is wrong with each.
 *
 *   node scripts/check-recipes.mjs recipes/braises/*.cook
 *   node scripts/check-recipes.mjs                 # everything
 *
 * Writes nothing, so any number of these can run at once. Exits non-zero if a file
 * would not draw a table.
 */
import fs from 'node:fs';
import path from 'node:path';
import { normalise } from './normalise.mjs';
import { findRecipes } from './find-recipes.mjs';
import { buildTree } from '../src/lib/tree.ts';
import { findTilingErrors, layout } from '../src/lib/layout.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const REQUIRED_META = ['title', 'category', 'tags', 'servings'];

// Counter names are validated here as well as in parse-recipes.mjs, so that someone
// classifying one folder finds their typo without building the whole collection.
const KNOWN_COUNTERS = new Set(
  JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/counters.json'), 'utf8')).counters.map(
    (c) => c.name,
  ),
);

// --labels prints the operation cell each step came out as, which is the only way to see
// whether a derived label reads like a cook's verb or like a mangled sentence fragment.
const args = process.argv.slice(2).filter((a) => a !== '--labels');
const showLabels = process.argv.includes('--labels');
const targets = args.length
  ? args.map((arg) => {
      const full = path.resolve(arg);
      return { full, slug: path.basename(full, '.cook'), folder: path.basename(path.dirname(full)) };
    })
  : findRecipes();

let failed = 0;

for (const target of targets) {
  const rel = path.relative(ROOT, target.full);
  const problems = [];
  const notes = [];

  try {
    const source = fs.readFileSync(target.full, 'utf8');

    const missing = REQUIRED_META.filter((key) => !new RegExp(`^>>\\s*${key}\\s*:`, 'mi').test(source));
    if (missing.length) problems.push(`missing metadata: ${missing.join(', ')}`);

    const recipe = normalise(source, { slug: target.slug, path: rel, folder: target.folder });
    for (const warning of recipe.warnings) notes.push(`cooklang: ${warning}`);

    for (const counter of recipe.counters) {
      if (!KNOWN_COUNTERS.has(counter)) {
        problems.push(
          `unknown counter "${counter}" — known: ${[...KNOWN_COUNTERS].join(', ')}`,
        );
      }
    }

    const grid = layout(buildTree(recipe));
    problems.push(...findTilingErrors(grid));

    if (grid.rowCount < 3) problems.push(`only ${grid.rowCount} ingredient row(s) — too thin to be a table`);
    if (grid.colCount < 3) problems.push('only one operation — nothing merges, so the table is a list');

    const unlabelled = grid.rows.flat().filter((c) => c.kind === 'op' && !c.text.trim());
    if (unlabelled.length) {
      problems.push(
        `${unlabelled.length} operation cell(s) came out with no label — reword the step, ` +
          `or set it with a >> step.N: line`,
      );
    }

    if (!problems.length) {
      console.log(`  ok   ${rel}  ${grid.rowCount} rows x ${grid.colCount} cols`);
      if (showLabels) {
        for (const text of grid.headers) console.log(`       [ ${text} ]`);
        for (const cell of grid.rows.flat().filter((c) => c.kind === 'op').sort((a, b) => a.col - b.col)) {
          console.log(`       ${'  '.repeat(cell.col - 2)}${cell.text}`);
        }
      }
      for (const note of notes) console.log(`       ${note}`);
      continue;
    }
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }

  failed++;
  console.log(`FAIL   ${rel}`);
  for (const problem of [...problems, ...notes]) console.log(`       - ${problem}`);
}

console.log(
  failed
    ? `\n${failed} of ${targets.length} file(s) would not draw a table.`
    : `\nall ${targets.length} file(s) draw a table.`,
);
process.exit(failed ? 1 : 0);
