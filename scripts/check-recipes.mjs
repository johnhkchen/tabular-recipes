/*
 * Checks .cook files one at a time and says exactly what is wrong with each.
 *
 *   node scripts/check-recipes.mjs recipes/braises/*.cook
 *   node scripts/check-recipes.mjs                 # everything
 *
 * Two jobs. The first is whether a file draws a table at all, and a file that does not
 * fails the build. The second is how much the file says: every place that carries words
 * has a cap, and anything over one is printed at the end, worst first. That half reports
 * and does not fail — see CAPS_FAIL_BUILD. docs/knowledge/voice.md is the reasoning.
 *
 * Writes nothing, so any number of these can run at once.
 */
import fs from 'node:fs';
import path from 'node:path';
import { normalise } from './normalise.mjs';
import { findRecipes } from './find-recipes.mjs';
import { cleanLabel } from '../src/lib/label.ts';
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

/*
 * How long each place that carries words is allowed to be, in characters of what a reader
 * actually meets — after the ingredient names come out and the punctuation is tidied.
 *
 * Every number was read off the collection as it stands, and the measurement is named
 * beside it. The rule behind all five: a cap sits where the field stops being one
 * sentence. docs/knowledge/voice.md says what each field is for.
 */
const CAPS = {
  // 3077 cells, mean 24, p95 46, max 70. The one surface that already works, so this is a
  // ratchet at the current ceiling rather than a cut: nothing is over it today.
  'operation cell': 70,
  // 2782 steps carry a >> step.N: line, and the words they wrote instead are rendered
  // nowhere. Half of those bodies are still one sentence at 125-149 chars; only a quarter
  // still are at 150-174. 150 is the crossing.
  'step body': 150,
  // Two humps with a hollow between them: prep lines end at 74, essays start at 125. And
  // this row is printed three times — in the table, in prep and in cook — so 120 is 360.
  'prose row': 120,
  // No hollow to find here: 65% of the reasons written so far sit between 225 and 299,
  // which is what a field written to a length looks like. 200 is the last point below
  // that pile. One breath is nearer 120, and voice.md asks for that.
  'slack reason': 200,
  // It shares a table cell with an amount and a name. p99 is 63; past 80 it is a paragraph.
  'ingredient note': 80,
};

/*
 * Reported, not enforced. T-005-04 through T-005-06 are the tickets that bring the
 * collection under these caps, and each of them runs `npm run verify` — which starts with
 * this script. A checker that failed the day the caps landed would block its own fix.
 *
 * T-005-07 flips this line to true once the collection is clean. It is the only change.
 */
const CAPS_FAIL_BUILD = false;

/*
 * Everything one file has to say, measured against the caps. Pure: takes the parsed recipe
 * and the tree it draws, hands back what is over. The tree decides which steps became
 * operations and which became full-width rows, so the checker cannot disagree with the page.
 */
function measure(rel, recipe, tree) {
  const over = [];
  const check = (field, length, where, text) => {
    const cap = CAPS[field];
    if (length > cap) over.push({ rel, field, length, cap, where, text });
  };

  // Mirrors isOpStep in src/lib/tree.ts: a step earns a column by using something.
  const isOp = (step) => step.ingredients.length > 0 || step.refs.length > 0;

  for (const step of recipe.steps) {
    const at = `step ${step.index + 1}`;

    if (isOp(step)) {
      const label = step.labelOverride ?? cleanLabel(step.rawLabel);
      check('operation cell', label.length, at, label);
    }

    // A >> step.N: line replaces the step's own words wherever the step lands — in a cell
    // or in a full-width row — and what it replaces is rendered nowhere at all.
    if (step.labelOverride) {
      const body = cleanLabel(step.rawLabel);
      check('step body', body.length, `${at}, written but not shown`, body);
    }

    for (const ing of step.ingredients) {
      if (ing.note) check('ingredient note', ing.note.length, `${at}, ${ing.name}`, ing.note);
    }
  }

  for (const row of tree.headers) check('prose row', row.length, 'row above the table', row);
  for (const row of tree.footers) check('prose row', row.length, 'row below the table', row);

  if (recipe.slack) check('slack reason', recipe.slack.reason.length, 'slack:', recipe.slack.reason);

  return over;
}

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
// Every over-cap field in the whole run. Ranking needs all of them, so it waits for the end.
const overCap = [];

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

    // A level nobody agreed on, or a level with no reason. The message names the legal
    // values, because the whole point of the field is that it can be read by a stranger.
    if (recipe.slackProblem) problems.push(recipe.slackProblem);

    const tree = buildTree(recipe);
    const grid = layout(tree);
    problems.push(...findTilingErrors(grid));

    // Measured whether or not the file draws a table, because a file being fixed for one
    // reason should show the other reason in the same run.
    overCap.push(...measure(rel, recipe, tree));

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

/* ---- how much it all says -------------------------------------------------- */

if (overCap.length) {
  // Worst first is worst by how far over, not by how long: a 90-char ingredient note is a
  // bigger problem than a 210-char slack reason, and the caps are what say so. Ties settle
  // on the file then the field, so two runs of the same collection diff cleanly.
  overCap.sort(
    (a, b) =>
      b.length - b.cap - (a.length - a.cap) ||
      a.rel.localeCompare(b.rel) ||
      a.field.localeCompare(b.field),
  );

  const totalOver = overCap.reduce((sum, item) => sum + item.length - item.cap, 0);
  const files = new Set(overCap.map((item) => item.rel)).size;

  console.log(`\n${'—'.repeat(78)}`);
  console.log(
    `${overCap.length} field(s) over cap in ${files} file(s) — ` +
      `${totalOver.toLocaleString('en-US')} characters over.\n`,
  );

  for (const item of overCap) {
    const excerpt = item.text.length > 66 ? `${item.text.slice(0, 66)}…` : item.text;
    console.log(
      `  +${String(item.length - item.cap).padStart(4)}  ${item.field.padEnd(15)}` +
        ` ${String(item.length).padStart(4)}/${item.cap}  ${item.rel}`,
    );
    console.log(`         ${item.where} — ${excerpt.replace(/\s+/g, ' ')}`);
  }

  // A tally per field, because three different tickets read three different lines of it.
  // Every field is listed even at zero: "operation cell 0" is a result, not an omission.
  const byField = Object.keys(CAPS).map(
    (field) => `${field} ${overCap.filter((item) => item.field === field).length}`,
  );
  console.log(`\nby field:  ${byField.join('  ·  ')}`);

  console.log(
    CAPS_FAIL_BUILD
      ? '\nCaps are enforced: this run fails.'
      : '\nCaps are reported, not enforced: this run exits 0.\n' +
          'Set CAPS_FAIL_BUILD = true in scripts/check-recipes.mjs once the collection is clean.',
  );
}

process.exit(failed || (CAPS_FAIL_BUILD && overCap.length) ? 1 : 0);
