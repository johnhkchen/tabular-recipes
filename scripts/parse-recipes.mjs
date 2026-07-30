/*
 * Reads every recipes/**\/*.cook file and writes src/generated/recipes.json.
 *
 * A recipe's folder names its category unless the file says otherwise with `>> category:`.
 * Slugs are file basenames and must be unique across the whole collection, because that
 * is the URL.
 */
import fs from 'node:fs';
import path from 'node:path';
import { normalise } from './normalise.mjs';
import { findRecipes } from './find-recipes.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_FILE = path.join(ROOT, 'src/generated/recipes.json');

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

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(recipes, null, 2)}\n`);

const categories = new Set(recipes.map((r) => r.category));
console.log(
  `parsed ${recipes.length} recipe(s) in ${categories.size} categor${categories.size === 1 ? 'y' : 'ies'}` +
    ` -> ${path.relative(ROOT, OUT_FILE)}`,
);
