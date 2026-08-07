/*
 * The search index, as one file fetched on the first keystroke.
 *
 * It used to live in data- attributes on 241 cards, which put 47 KB of ingredient names into
 * every visit whether or not anyone searched. Now the pages carry none of it.
 *
 * It also carries the four numbers a tired cook sorts by — how long the dish takes, how much of
 * that you stand there, the longest stretch of that you cannot sit down in, and how many things
 * end up in the sink — plus one word saying whose the hands-on figure is. Four small numbers and
 * a word per recipe is cheap. A task list per recipe would not be, and is why nothing here
 * carries one: everything below is a summary, never the schedule it came from.
 *
 * The repeats came out of `find` to pay for it. It is built by concatenating six fields that
 * overlap heavily — a quarter of it was tokens already present — and the front page splits a
 * query on whitespace and asks `find.includes(word)` for each word on its own, so no query word
 * can contain a space and no result can depend on a token appearing twice. The endpoint came out
 * smaller than it went in.
 */
import recipes from '../generated/recipes.json';
import { buildSchedule, handsOnEvidence } from '../lib/schedule.ts';
import type { RawRecipe } from '../lib/tree.ts';

/** The same words, each kept once, in the order they were first written. */
const unique = (text: string) => [...new Set(text.split(/\s+/).filter(Boolean))].join(' ');

export function GET() {
  const index = (recipes as unknown as RawRecipe[])
    .map((recipe) => {
      const schedule = buildSchedule(recipe);
      return {
        slug: recipe.slug,
        title: recipe.title,
        counters: recipe.counters,
        // Everything the box looks through. `aka` is in here because people search for what
        // they ordered, not for what a cook would call it.
        find: unique(
          [
            recipe.title,
            recipe.category,
            ...recipe.counters,
            ...recipe.aka,
            ...recipe.tags,
            ...recipe.ingredientNames,
          ]
            .join(' ')
            .toLowerCase(),
        ),
        /*
         * Elapsed, not the sum: two parallel one-hour waits take one hour. Nothing is rounded
         * on the way out — the clock already rounded these, and rounding twice is two opinions
         * about one minute.
         */
        elapsedMinutes: schedule.totalMinutes,
        handsOnMinutes: schedule.handsOnMinutes,
        longestHandsOnMinutes: schedule.longestHandsOnMinutes,
        /*
         * The count, or null for a recipe that never declared one — which is most of them.
         * Absent and zero are different answers, and `?.` rather than a falsy test is what
         * keeps memphis-dry-rub's genuine nothing-to-wash from turning into silence.
         */
        washingUpCount: recipe.washingUp?.count ?? null,
        /*
         * Whether the hands-on figure above is the recipe's word, our reading, or nobody's.
         * Worked out in schedule.ts and shipped as its answer rather than as the two raw
         * numbers behind it, so that hiding an unannotated recipe takes writing a line that
         * says so. Left to the browser, the quiet default is the wrong one: 327 recipes pass
         * "under fifteen minutes standing" on no evidence at all.
         */
        evidence: handsOnEvidence(schedule),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
