/* Every .cook file under recipes/, with the folder it sits in (its default category). */
import fs from 'node:fs';
import path from 'node:path';

export const RECIPES_DIR = path.resolve(import.meta.dirname, '../recipes');

export function findRecipes(dir = RECIPES_DIR, folder = null) {
  const found = [];
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findRecipes(full, entry.name));
    else if (entry.name.endsWith('.cook')) {
      found.push({ full, folder, slug: path.basename(entry.name, '.cook') });
    }
  }
  return found;
}
