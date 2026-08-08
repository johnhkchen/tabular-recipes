/*
 * Reads every recipes/**\/*.cook file and writes src/generated/recipes.json.
 *
 * A recipe's folder names its category unless the file says otherwise with `>> category:`.
 * Slugs are file basenames and must be unique across the whole collection, because that
 * is the URL.
 *
 * This is also where the cross-recipe facts get settled, because it is the only place that
 * sees the whole collection at once: which counters a recipe sits at, whether a
 * `>> pairs-with:` line points at something real, and which files are variants of one dish.
 */
import fs from 'node:fs';
import path from 'node:path';
import { normalise } from './normalise.mjs';
import { findRecipes } from './find-recipes.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_FILE = path.join(ROOT, 'src/generated/recipes.json');
const COUNTERS_FILE = path.join(ROOT, 'src/data/counters.json');

const { counters: COUNTERS } = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8'));
const counterNames = new Set(COUNTERS.map((c) => c.name));

/* ---- read every file ------------------------------------------------------ */

const files = findRecipes();
const bySlug = new Map();
const recipes = [];

for (const file of files) {
  const relPath = path.relative(ROOT, file.full);
  if (bySlug.has(file.slug)) {
    throw new Error(
      `two recipes share the slug "${file.slug}" — that is the URL, so it has to be unique:\n` +
        `  ${bySlug.get(file.slug)}\n  ${relPath}`,
    );
  }
  bySlug.set(file.slug, relPath);
  recipes.push(
    normalise(fs.readFileSync(file.full, 'utf8'), {
      slug: file.slug,
      path: relPath,
      folder: file.folder,
    }),
  );
}

const slugs = new Set(recipes.map((r) => r.slug));

/* ---- the authored fields, which are whole or absent and never halfway ----- */

for (const recipe of recipes) {
  for (const problem of [
    recipe.slackProblem,
    recipe.washingUpProblem,
    recipe.keepsProblem,
    recipe.capacityProblem,
    ...recipe.stepLabelProblems,
    ...recipe.stepRefProblems,
  ]) {
    if (problem) throw new Error(`${recipe.path}: ${problem}`);
  }
}

/* ---- counters ------------------------------------------------------------- */

for (const recipe of recipes) {
  for (const name of recipe.counters) {
    if (!counterNames.has(name)) {
      throw new Error(
        `${recipe.path} names the counter "${name}", which is not in src/data/counters.json.\n` +
          `  known counters: ${[...counterNames].join(', ')}`,
      );
    }
  }

  // Nothing is orphaned: a recipe that names no counter inherits its category's.
  if (recipe.counters.length === 0) {
    recipe.counters = COUNTERS.filter((c) => c.categories.includes(recipe.category)).map((c) => c.name);
    recipe.countersInferred = true;
  } else {
    recipe.countersInferred = false;
  }
}

const homeless = recipes.filter((r) => r.counters.length === 0);
if (homeless.length) {
  throw new Error(
    `${homeless.length} recipe(s) sit at no counter, and no counter claims their category.\n` +
      `Give them a >> counters: line, or add the category to a counter in src/data/counters.json:\n` +
      homeless.slice(0, 10).map((r) => `  ${r.path} (${r.category})`).join('\n'),
  );
}

/* ---- shelf talk on the menus ---------------------------------------------- */

/*
 * A menu note is one sentence, the same sentence that came off a recipe page, so it gets the
 * same ceiling: CAPS['prose row'] in scripts/check-recipes.mjs, written out in the caps table
 * in docs/knowledge/voice.md. Half of that number's reasoning does not carry over — a prose
 * row prints three times on a page and a note prints once — but the other half does, and it
 * is the half that matters: 120 is where a sentence stops being one.
 */
const NOTE_CAP = 120;

/*
 * Checked here rather than in check-recipes.mjs for the same reason the counters are checked
 * in both: this is the only place that sees the whole collection at once. check-recipes.mjs
 * runs on whichever files you name, so on a partial run it cannot answer the question that
 * matters — is the dish this note is about actually shelved at this counter. A note on a slug
 * the section lists but the shelf does not carry is the quiet failure: menuFor drops the item
 * (src/lib/counters.ts:81) and the note goes with it, silently.
 */
const shelvedAt = new Map(recipes.map((r) => [r.slug, r.counters]));

for (const counter of COUNTERS) {
  for (const section of counter.sections ?? []) {
    const at = `src/data/counters.json: ${counter.name} / "${section.title}"`;
    if (section.notes === undefined) continue;

    if (!Array.isArray(section.notes)) {
      throw new Error(`${at} has "notes" that is not a list. It is a list of { of?, note }.`);
    }

    for (const note of section.notes) {
      if (typeof note?.note !== 'string' || !note.note.trim()) {
        throw new Error(
          `${at} has a note with no "note" text: ${JSON.stringify(note)}\n` +
            `  a note is { "note": "one sentence" }, with an optional "of": "<slug>".`,
        );
      }

      if (note.note.length > NOTE_CAP) {
        throw new Error(
          `${at} has a note of ${note.note.length}/${NOTE_CAP} characters:\n` +
            `  ${note.note}\n` +
            `  Shelf talk is one sentence. docs/knowledge/voice.md says why.`,
        );
      }

      // No "of" is not a mistake: that note is about the section, and prints under its heading.
      if (note.of === undefined) continue;

      if (!section.items.includes(note.of)) {
        throw new Error(
          `${at} has a note on "${note.of}", which the section does not list.\n` +
            `  the section lists: ${section.items.join(', ') || '(nothing)'}`,
        );
      }

      const shelves = shelvedAt.get(note.of);
      if (!shelves) {
        throw new Error(`${at} has a note on "${note.of}", which is not a recipe here.`);
      }
      if (!shelves.includes(counter.name)) {
        throw new Error(
          `${at} has a note on "${note.of}", which is not shelved at this counter, so ` +
            `neither the item nor its note ever renders.\n` +
            `  ${note.of} is at: ${shelves.join(', ')}\n` +
            `  Give it a >> counters: line naming ${counter.name}, or move the note.`,
        );
      }
    }
  }
}

/* ---- pairings, which are mutual whether or not both files say so ---------- */

const pairs = new Map(recipes.map((r) => [r.slug, new Set(r.pairsWith)]));

for (const recipe of recipes) {
  for (const other of recipe.pairsWith) {
    if (!slugs.has(other)) {
      throw new Error(
        `${recipe.path} pairs with "${other}", which is not a recipe here.\n` +
          `  >> pairs-with: takes slugs (file basenames), comma separated.`,
      );
    }
    if (other === recipe.slug) {
      throw new Error(`${recipe.path} pairs with itself.`);
    }
    pairs.get(other).add(recipe.slug);
  }
}

for (const recipe of recipes) {
  recipe.pairsWith = [...pairs.get(recipe.slug)].sort();
}

/* ---- variants of one dish ------------------------------------------------- */

const byDish = new Map();
for (const recipe of recipes) {
  if (!byDish.has(recipe.dish)) byDish.set(recipe.dish, []);
  byDish.get(recipe.dish).push(recipe);
}

for (const [dish, group] of byDish) {
  if (group.length === 1) continue;

  const plain = group.filter((r) => !r.kit);
  if (plain.length > 1) {
    throw new Error(
      `dish "${dish}" has ${plain.length} files with no >> kit: line, so nothing says how they ` +
        `differ:\n${plain.map((r) => `  ${r.path}`).join('\n')}`,
    );
  }

  // Each variant knows its siblings, so a page can offer the switch.
  for (const recipe of group) {
    // The washing-up count travels with the variant, because the page where two ways of
    // cooking one dish sit side by side is where that number decides anything.
    recipe.variants = group
      .filter((r) => r.slug !== recipe.slug)
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        kit: r.kit,
        washingUpCount: r.washingUp?.count ?? null,
      }));
  }
}

for (const recipe of recipes) recipe.variants ??= [];

/* ---- write --------------------------------------------------------------- */

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(recipes, null, 2)}\n`);

const named = recipes.filter((r) => !r.countersInferred).length;
const withTimers = recipes.filter((r) => r.steps.some((s) => s.timers.length)).length;
const washed = recipes.filter((r) => r.washingUp).length;
console.log(
  `parsed ${recipes.length} recipe(s) in ${new Set(recipes.map((r) => r.category)).size} categories ` +
    `-> ${path.relative(ROOT, OUT_FILE)}`,
);
console.log(
  `  counters: ${named} named, ${recipes.length - named} inferred from category · ` +
    `timers in ${withTimers} · pairings ${recipes.reduce((n, r) => n + r.pairsWith.length, 0) / 2} · ` +
    `washing-up in ${washed}`,
);
