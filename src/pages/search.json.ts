/*
 * The search index, as one file fetched on the first keystroke.
 *
 * It used to live in data- attributes on 241 cards, which put 47 KB of ingredient names into
 * every visit whether or not anyone searched. Now the pages carry none of it.
 */
import recipes from '../generated/recipes.json';
import type { RawRecipe } from '../lib/tree.ts';

export function GET() {
  const index = (recipes as unknown as RawRecipe[])
    .map((recipe) => ({
      slug: recipe.slug,
      title: recipe.title,
      counters: recipe.counters,
      // Everything the box looks through. `aka` is in here because people search for what
      // they ordered, not for what a cook would call it.
      find: [
        recipe.title,
        recipe.category,
        ...recipe.counters,
        ...recipe.aka,
        ...recipe.tags,
        ...recipe.ingredientNames,
      ]
        .join(' ')
        .toLowerCase(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
