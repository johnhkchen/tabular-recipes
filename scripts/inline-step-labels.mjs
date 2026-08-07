/*
 * Moves a `>> step.N:` label out of the metadata block and onto the line above its step.
 *
 *   node scripts/inline-step-labels.mjs                  # what would move, per file
 *   node scripts/inline-step-labels.mjs --write          # move it
 *   node scripts/inline-step-labels.mjs --dump           # every label and its clock, to stdout
 *   node scripts/inline-step-labels.mjs recipes/soups/*.cook   # a subset, in any mode
 *
 * The numbered form addresses a step by counting to it, and the count is written somewhere the
 * step is not: insert an operation and every override below it labels the wrong row, silently.
 * `>> step:` on the line above its step has no number to get wrong. src/lib/step-labels.ts is
 * the reader; docs/active/stories/S-009 is the argument.
 *
 * The one rule this script exists to keep: NO LABEL CHANGES THE STEP IT NAMES. `step.N` counts
 * 1-based over every step block including prose ones — undocumented, recorded in
 * docs/gaps/README.md — and a label the build hands to the wrong step is moved to that same
 * wrong step, not to the step it reads like it wanted. Correcting one is a separate job done by
 * a person one file at a time.
 *
 * So the script never counts. normalise() says which step wears which label, readStepLabels()
 * says where the moved label binds, and a file is written only when those two agree. Guess the
 * position, verify the binding: a bug in the scan below becomes a file left alone with a printed
 * reason, never a page whose words moved.
 *
 * Idempotent: a migrated file has no `>> step.N:` line left, so a second run has nothing to do.
 */
import fs from 'node:fs';
import path from 'node:path';
import { normalise } from './normalise.mjs';
import { findRecipes } from './find-recipes.mjs';
import { readStepLabels } from '../src/lib/step-labels.ts';
import { cleanLabel } from '../src/lib/label.ts';

const ROOT = path.resolve(import.meta.dirname, '..');

/** `>> step.7: simmer 15 min`. Deliberately the shape src/lib/step-labels.ts:55 matches. */
const NUMBERED = /^>>[ \t]*step\.(\d+)[ \t]*:(.*)$/i;

/*
 * Any step line at all, either form, looser than either. Used only to take both forms out of
 * the before and after text so the rest can be compared byte for byte — so it errs wide on
 * purpose: a line it wrongly catches weakens the check, a line it misses breaks the build.
 */
const ANY_STEP_LINE = /^>>[ \t]*step[.: \t]/i;

/* ---- the local scan, which is a proposal and not an answer ----------------- */

/*
 * The line each step block starts on. This mirrors scanSteps() in src/lib/step-labels.ts:82 —
 * blank lines, metadata, section headers and text blocks close a block, a comment is
 * transparent, anything else opens one — and the two have to agree, but only one of them is the
 * build's. So nothing here is trusted: verify() below hands the result back to the build's own
 * reader and refuses the file if it lands anywhere else.
 */
function stepStarts(lines) {
  const starts = [];
  let open = false;
  for (const [i, line] of lines.entries()) {
    if (/^\s*--/.test(line)) continue;
    if (!line.trim() || /^>>/.test(line) || /^\s*=/.test(line) || /^\s*>(?!>)/.test(line)) {
      open = false;
      continue;
    }
    if (!open) {
      starts.push(i);
      open = true;
    }
  }
  return starts;
}

/* ---- what would change, and why not --------------------------------------- */

/**
 * @param {string} source
 * @param {ReturnType<typeof normalise>} recipe
 * @returns {{ moves: {n: number, text: string, from: number, to: number}[], refusal: string|null }}
 */
function plan(source, recipe) {
  const lines = source.split('\n');
  const no = (refusal) => ({ moves: [], refusal });

  const hits = [];
  for (const [i, line] of lines.entries()) {
    const match = line.match(NUMBERED);
    if (match) hits.push({ line: i, n: Number(match[1]), text: match[2].trim() });
  }
  if (!hits.length) return { moves: [], refusal: null };

  const starts = stepStarts(lines);
  if (starts.length !== recipe.steps.length) {
    return no(
      `this script found ${starts.length} step block(s) and the parser found ` +
        `${recipe.steps.length} — that is a bug in stepStarts(), not in this file`,
    );
  }

  const firstStep = starts[0];
  const seen = new Map();
  const moves = [];

  for (const hit of hits) {
    const at = `line ${hit.line + 1}`;
    if (!hit.text) {
      return no(`${at}: >> step.${hit.n}: says nothing — write the label after the colon`);
    }
    if (hit.n < 1 || hit.n > recipe.steps.length) {
      return no(
        `${at}: >> step.${hit.n}: names step ${hit.n} and this file has ${recipe.steps.length} ` +
          `step(s) — move it by hand, or fix the number`,
      );
    }
    if (seen.has(hit.n)) {
      return no(
        `${at}: >> step.${hit.n}: is written twice (also line ${seen.get(hit.n) + 1}) — only the ` +
          `last one reaches the page, so say which one you meant`,
      );
    }
    seen.set(hit.n, hit.line);
    if (firstStep !== undefined && hit.line > firstStep) {
      return no(
        `${at}: >> step.${hit.n}: sits below the first step, where this script cannot move it ` +
          `without changing the step it is inside`,
      );
    }
    moves.push({ n: hit.n, text: hit.text, from: hit.line, to: starts[hit.n - 1] });
  }

  /*
   * The label normalise() gives step N is the one that has to end up above step N. They can
   * differ from what is written on the line: a file writing both forms already resolves through
   * readStepLabels(), and that file is T-009-01's business to fail, not this script's to migrate.
   */
  for (const move of moves) {
    const written = recipe.steps[move.n - 1]?.labelOverride;
    if (written !== move.text) {
      return no(
        `>> step.${move.n}: reads "${move.text}" and the build gives step ${move.n} ` +
          `"${written ?? '(no label)'}" — something else in this file is deciding the label`,
      );
    }
  }

  return { moves, refusal: null };
}

/* ---- the edit -------------------------------------------------------------- */

/*
 * One walk, not successive splices, so no index drifts as lines move. A line that is a move's
 * source is dropped; a line that is a move's target gets its label emitted directly above it;
 * everything else — every blank line included — is emitted untouched.
 */
function apply(lines, moves) {
  const drop = new Set(moves.map((m) => m.from));
  const insert = new Map(moves.map((m) => [m.to, m.text]));
  const out = [];
  for (const [i, line] of lines.entries()) {
    if (drop.has(i)) continue;
    if (insert.has(i)) out.push(`>> step: ${insert.get(i)}`);
    out.push(line);
  }
  return out.join('\n');
}

/* ---- the three gates, before anything is written --------------------------- */

/** The reason to refuse this file, or null. */
function verify(source, migrated, recipe, moves) {
  // 1. The build's own reader has to put every label back on the step it came off.
  const wanted = new Map(
    recipe.steps.filter((s) => s.labelOverride !== null).map((s) => [s.index, s.labelOverride]),
  );
  const { labels: landed, problems } = readStepLabels(migrated);
  if (problems.length) {
    return `the migrated file would not read back: ${problems[0]}`;
  }
  if (landed.size !== wanted.size) {
    return `${wanted.size} label(s) went in and ${landed.size} bound to a step`;
  }
  for (const [index, text] of wanted) {
    if (landed.get(index) !== text) {
      return (
        `step ${index + 1}'s label would become ${JSON.stringify(landed.get(index) ?? null)} ` +
        `instead of ${JSON.stringify(text)}`
      );
    }
  }

  // 2. Nothing but step lines moved. Catches a lost blank line, a lost trailing newline, a
  //    reordered metadata block and a mangled step, in one comparison.
  const withoutStepLines = (text) =>
    text.split('\n').filter((line) => !ANY_STEP_LINE.test(line)).join('\n');
  if (withoutStepLines(source) !== withoutStepLines(migrated)) {
    return 'something other than a >> step line changed';
  }

  // 3. As many lines out as in.
  const count = (text, re) => text.split('\n').filter((line) => re.test(line)).length;
  const out = count(migrated, /^>>[ \t]*step[ \t]*:/i);
  if (out !== moves.length) return `${moves.length} label(s) to move and ${out} written`;
  if (count(migrated, NUMBERED) !== 0) return 'a >> step.N: line was left behind';

  return null;
}

/* ---- the dump: every label, and the clock that hangs off it ----------------- */

const round = (minutes) => Math.round(minutes * 100) / 100;

/*
 * One line per step of one recipe: slug, 1-based step, whether it is an operation, the step's
 * timed minutes and how they split, and the label exactly as the cell renders it.
 *
 * The clock is here because it is the same fact as the label seen from the other side:
 * src/lib/time.ts reads the operation label's own words to decide whether a timer is time you
 * spend or time you wait out, so a label that moved to another step would move a number in this
 * file. Same arithmetic as src/lib/schedule.ts:153-158, on the same readings normalise()
 * attached. A step with no timer is three zeroes, which is a value and not a blank.
 */
function dumpOf(recipe) {
  return recipe.steps.map((step) => {
    const isOp = step.ingredients.length > 0 || step.refs.length > 0;
    const timed = step.timers.filter((t) => t.minutes !== null && Number.isFinite(t.minutes));
    const total = round(timed.reduce((sum, t) => sum + t.minutes, 0));
    const hands = round(
      timed.filter((t) => t.attention !== 'unattended').reduce((sum, t) => sum + t.minutes, 0),
    );
    // Mirrors check-recipes.mjs:92 — the override, or the step's own words tidied.
    const label = step.labelOverride ?? cleanLabel(step.rawLabel);
    return [
      recipe.slug,
      step.index + 1,
      isOp ? 'op' : 'prose',
      total,
      hands,
      round(total - hands),
      label,
    ].join('\t');
  });
}

/* ---- run ------------------------------------------------------------------- */

const FLAGS = new Set(['--write', '--dump']);
const args = process.argv.slice(2);
const write = args.includes('--write');
const dump = args.includes('--dump');
const named = args.filter((arg) => !FLAGS.has(arg));

const targets = named.length
  ? named.map((arg) => {
      const full = path.resolve(arg);
      return { full, slug: path.basename(full, '.cook'), folder: path.basename(path.dirname(full)) };
    })
  : findRecipes();

let moved = 0;
let labels = 0;
let untouched = 0;
const skipped = [];

for (const target of targets) {
  const rel = path.relative(ROOT, target.full);
  const source = fs.readFileSync(target.full, 'utf8');

  let recipe;
  try {
    recipe = normalise(source, { slug: target.slug, path: rel, folder: target.folder });
  } catch (error) {
    skipped.push({ rel, reason: error instanceof Error ? error.message : String(error) });
    continue;
  }

  if (dump) {
    for (const line of dumpOf(recipe)) console.log(line);
    continue;
  }

  if (recipe.stepLabelProblems.length) {
    skipped.push({ rel, reason: recipe.stepLabelProblems[0] });
    continue;
  }

  const { moves, refusal } = plan(source, recipe);
  if (refusal) {
    skipped.push({ rel, reason: refusal });
    continue;
  }
  if (!moves.length) {
    untouched++;
    console.log(`  --   ${rel}  no >> step.N: line`);
    continue;
  }

  const migrated = apply(source.split('\n'), moves);
  const wrong = verify(source, migrated, recipe, moves);
  if (wrong) {
    skipped.push({ rel, reason: wrong });
    continue;
  }

  moved++;
  labels += moves.length;
  console.log(`  move ${rel}  ${moves.length} label(s)`);
  if (write) fs.writeFileSync(target.full, migrated);
}

if (dump) process.exit(0);

for (const skip of skipped) {
  console.log(`  SKIP ${skip.rel}`);
  console.log(`       - ${skip.reason}`);
}

console.log(
  `\n${moved} file(s) ${write ? 'moved' : 'would move'}, ${labels} label(s). ` +
    `${untouched} file(s) had none. ${skipped.length} file(s) skipped.`,
);

/*
 * Repeated at the end rather than left to be scraped out of 664 lines: this list is what the
 * ticket that removes the numbered form has to migrate by hand first.
 */
if (skipped.length) {
  console.log('\nleft on the numbered form — each of these needs a person:');
  for (const skip of skipped) console.log(`  ${skip.rel}\n    ${skip.reason}`);
}

if (!write) console.log('\ndry run — pass --write to move them');

process.exit(skipped.length ? 1 : 0);
