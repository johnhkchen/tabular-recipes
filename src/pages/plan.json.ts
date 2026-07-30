/*
 * Everything /list/ needs, as one file fetched once.
 *
 * The plan itself is four or five slugs in this browser's localStorage — the page cannot
 * know at build time which recipes it will have to add up, so it gets all of them and picks
 * out the ones on the plan. Same arrangement as search.json: no page carries this until
 * somebody asks for it.
 *
 * Only what a shopping list uses is in here. Steps, the tree, timers, tags and cookware
 * stay behind, because none of them ends up on a list.
 */
import recipes from '../generated/recipes.json';
import staplesData from '../data/staples.json';
import type { RawRecipe } from '../lib/tree.ts';
import type { PlanIngredient, PlanRecipe } from '../lib/plan.ts';
import { matchesStaple } from '../lib/units.ts';

interface Staple {
  name: string;
  patterns: string[];
  except?: string[];
}

const staples = staplesData.staples as Staple[];

/*
 * The pantry test, exactly as src/data/staples.json defines it: a pattern matches whole
 * words, and `except` takes back the one or two names it would otherwise swallow (salt
 * pork is pork). Done here, once per build, so the page never ships the staples file.
 */
const isStaple = (name: string): boolean =>
  staples.some((s) => matchesStaple(name, s.patterns) && !matchesStaple(name, s.except ?? []));

// Names repeat hard across 249 recipes — 2378 rows, 534 distinct names — so cache the test.
const stapleByName = new Map<string, boolean>();
const stapleCached = (name: string): boolean => {
  let known = stapleByName.get(name);
  if (known === undefined) {
    known = isStaple(name);
    stapleByName.set(name, known);
  }
  return known;
};

export function GET() {
  const list: PlanRecipe[] = (recipes as unknown as RawRecipe[])
    .map((recipe) => {
      const ingredients: PlanIngredient[] = [];
      for (const step of recipe.steps) {
        for (const ing of step.ingredients) {
          /*
           * An ingredient used twice in one recipe stays two rows. They are two amounts of
           * the same thing and the list adds them up with combine(), the same way it adds
           * two recipes together — merging them here would just do it earlier and hide it.
           */
          const row: PlanIngredient = {
            name: ing.name,
            quantity: ing.quantity,
            amount: ing.amount,
          };
          if (stapleCached(ing.name)) row.staple = true;
          ingredients.push(row);
        }
      }

      return {
        slug: recipe.slug,
        title: recipe.title,
        counters: recipe.counters,
        servings: recipe.metadata.servings ?? null,
        ingredients,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return new Response(JSON.stringify(list), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
