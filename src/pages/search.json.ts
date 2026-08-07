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
 *
 * It now also carries what it costs to cook MORE of the thing, which is the one place that rule
 * needed an exception and did not get one. The front page's situation can ask for eight different
 * sizes, so the two honest shapes were a figure per recipe per size — sixteen thousand numbers, a
 * third again on a file everybody downloads to type one letter — or the numbers the model needs
 * and a small table for the 46 recipes a vessel binds. This is the second. `waitMinutes` with
 * `handsOnMinutes` is scaling.md §2's whole model wherever no capacity is declared, and `scaled`
 * carries costOf()'s own answers where one is. **Nothing here computes a cost**; it asks
 * src/lib/scaling.ts and writes down what it said.
 */
import recipes from '../generated/recipes.json';
import { TARGETS } from '../components/situation.ts';
import { buildSchedule, handsOnEvidence } from '../lib/schedule.ts';
import { type Cost, costOf, servingsOf } from '../lib/scaling.ts';
import type { RawRecipe } from '../lib/tree.ts';

/** The same words, each kept once, in the order they were first written. */
const unique = (text: string) => [...new Set(text.split(/\s+/).filter(Boolean))].join(' ');

/** `A` = the one-cook clock less the work in it, to the two decimals costOf() keeps. */
const wait = (cost: Cost | null): number =>
  cost ? Math.round((cost.elapsed.written - cost.standing.written) * 100) / 100 : 0;

export function GET() {
  const index = (recipes as unknown as RawRecipe[])
    .map((recipe) => {
      const schedule = buildSchedule(recipe);
      /*
       * The recipe costed at its own size. `Growth.written` is the same figure whatever target is
       * asked for, so this one call is where `waitMinutes` comes from. The schedule is handed
       * over rather than rebuilt — costOf() takes one for exactly this reason.
       */
      const servings = servingsOf(recipe);
      const written = servings === null ? null : costOf(recipe, servings, schedule);
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
        /*
         * How much the recipe makes, which is the size every figure above was measured at. Null
         * on nothing in the collection today — `>> servings:` parses on all 685 files — and the
         * key is still here, because a page that scales a recipe with no baseline is the plan
         * page printing `serves 4 → 12` all over again.
         */
        writtenServings: servings,
        /*
         * scaling.md §2's `A`: unattended minutes ON THE CRITICAL PATH, which is not
         * `elapsedMinutes` above. `A + H` is the one-cook clock and sits at or above the timeline
         * the page draws, because the timeline runs some hands-on work on a second pair of hands
         * — gumbo is 102 against 94. Read off costOf()'s own written figures rather than summed
         * here, so the two cannot drift.
         */
        waitMinutes: wait(written),
        /*
         * The vessel, on the 46 files where one binds. The number and the author's own words for
         * it, because a capacity is a fact about a kitchen (§4.2) and a reader with a smaller pan
         * can do a correction no model can — but only if the page says which pan.
         */
        capacityServings: recipe.capacity?.servings,
        vessel: recipe.capacity?.vessel,
        /*
         * `[elapsed, standing, longest]` at each of the situation's sizes, clamped at the size
         * the recipe is written for. Only where a vessel binds: everywhere else the browser has
         * the whole model already in `waitMinutes` and `handsOnMinutes`, and 639 rows of numbers
         * that can be derived is 639 rows that can disagree.
         */
        scaled:
          recipe.capacity && servings !== null
            ? TARGETS.map((wanted) => {
                const cost = costOf(recipe, Math.max(wanted, servings), schedule)!;
                return [cost.elapsed.at, cost.standing.at, cost.longest.at];
              })
            : undefined,
        /*
         * Whether it is still good on Thursday, which is the half of "six people over three days"
         * that scaling cannot see. The span never travels without what the dish is like when you
         * get there: keeps.ts refuses a bare duration from an author because a duration on its
         * own is a shelf life, and a card printing one would ship the very form it refuses.
         */
        keepsText: recipe.keeps?.text,
        keepsCharacter: recipe.keeps?.character,
        /** Operations the recipe never timed. Every figure above is a floor by exactly this much. */
        untimedCount: schedule.untimedCount,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
