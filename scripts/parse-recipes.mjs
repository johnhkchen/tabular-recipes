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

/* ---- slack, which is a controlled vocabulary like the counters ------------ */

for (const recipe of recipes) {
  if (recipe.slackProblem) {
    throw new Error(`${recipe.path}: ${recipe.slackProblem}`);
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
    recipe.variants = group
      .filter((r) => r.slug !== recipe.slug)
      .map((r) => ({ slug: r.slug, title: r.title, kit: r.kit }));
  }
}

for (const recipe of recipes) recipe.variants ??= [];

/* ---- write --------------------------------------------------------------- */

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(recipes, null, 2)}\n`);

const named = recipes.filter((r) => !r.countersInferred).length;
const withTimers = recipes.filter((r) => r.steps.some((s) => s.timers.length)).length;
console.log(
  `parsed ${recipes.length} recipe(s) in ${new Set(recipes.map((r) => r.category)).size} categories ` +
    `-> ${path.relative(ROOT, OUT_FILE)}`,
);
console.log(
  `  counters: ${named} named, ${recipes.length - named} inferred from category · ` +
    `timers in ${withTimers} · pairings ${recipes.reduce((n, r) => n + r.pairsWith.length, 0) / 2}`,
);
