/*
 * What the multiplier costs, said out loud.
 *
 * `src/lib/scaling.ts` works out what cooking more of a thing costs and deliberately returns no
 * string a page could print — its header says so. This is the other half: the phrasebook in
 * `docs/knowledge/scaling.md` §6, turned into code, so /list/ can stop implying that tripling a
 * recipe leaves the clock alone.
 *
 * Three things hold it up.
 *
 * 1. THE FINDING IS NAMED BEFORE IT IS WORDED. `findingOf()` returns one of nine kinds and
 *    `wordsFor()` turns a kind into a sentence. The two that matter most are `free` — nothing
 *    binds, so cooking three times as much really does cost nothing extra — and `cannot-say`,
 *    where the recipe times so little of itself that any sentence would be a guess. **They are
 *    opposite answers**, and collapsing them into one nullable string is the bug this module
 *    exists to make impossible: they are two different words in one union, and only `wordsFor`
 *    knows that both come out silent.
 *
 * 2. `bounded` IS TESTED BEFORE `evidence`, and this is the load-bearing order. All 22 air fryer
 *    files read `evidence: 'unknown'`, because roast and air-fry are unattended verbs and those
 *    recipes report zero hands-on minutes. Asking about evidence first would silence exactly the
 *    recipes this was written for. It is also right on the merits: a batch count is arithmetic
 *    over two numbers the author stated — `>> capacity:` and `>> servings:` — and does not rest
 *    on the hands-on figure at all.
 *
 * 3. NO NOTATION LEAVES THIS FILE. Not O(·), not a multiplier, not a batch count dressed as
 *    arithmetic. `scaling.md` §6 is explicit and a whole-collection test in scaling-words.test.ts
 *    holds every sentence in the build to it. Counts are words — "three lots", not "3".
 *
 * WHY THIS IS NOT IN src/lib/. Every other pure module in this repository lives there, and this
 * one would too if it were this ticket's to write. T-011-05 owns src/pages/list.astro,
 * src/styles/** and new files under src/components/; src/lib/** belongs to nobody here.
 * src/components/dials.ts is the same situation solved the same way, and says so. Moving it
 * later is a rename.
 */
import { MULTIPLIERS } from '../lib/plan.ts';
import { buildSchedule } from '../lib/schedule.ts';
import { costOf, servingsOf, type Cost } from '../lib/scaling.ts';
import { formatDuration } from '../lib/time.ts';
import type { RawRecipe } from '../lib/tree.ts';

/* ---- what the model found -------------------------------------------------- */

/**
 * One reading of one recipe at one size. Nine kinds, each with exactly one §6 row.
 *
 * `free` and `cannot-say` are the pair the whole ticket turns on: *nothing extra to pay* and
 * *nobody measured this* are opposite answers, and a page that draws them the same way has
 * reintroduced the defect one level up.
 */
export type Finding =
  /** × 1. The recipe as written — there is no change to describe. */
  | { kind: 'unchanged' }
  /** Nothing binds, and there is no work to grow. The good news, and it is real. */
  | { kind: 'free' }
  /** Nothing binds, and the work grows with the food. The wait does not. */
  | { kind: 'work' }
  /** Nothing binds, less is wanted, and the clock does not move at all. */
  | { kind: 'same-wait'; minutes: number }
  /** A vessel is declared and the wanted amount still fits the loads it already needed. */
  | { kind: 'fits' }
  /** A vessel is declared and at this size it stops binding. */
  | { kind: 'unbinds' }
  /** The vessel binds, and it costs nothing but the reloading. */
  | { kind: 'lots-only'; loads: number }
  /** The vessel binds on a wait, so the loads reach the clock. */
  | { kind: 'lots-cost'; loads: number; minutes: number }
  /** No vessel declared, and the hands-on figure is ours rather than the author's. */
  | { kind: 'cannot-say' };

/**
 * A §6 sentence and the §6 tail that qualifies it — never one string.
 *
 * *"…plus three steps the recipe never times"* is written in the phrasebook with a leading
 * ellipsis because it is a continuation, and gluing it onto the end of a finished sentence gives
 * `"…about 42 min. …plus three steps"`. Kept apart, the page can draw the tail quieter than the
 * claim, which is what it is.
 */
export interface Words {
  said: string;
  qualifier: string | null;
}

/**
 * Which of the nine this cost is.
 *
 * The order of the tests is the argument. `bounded` first (see the header), then the evidence
 * gate, then the three unbounded readings. Nothing here formats anything.
 */
export function findingOf(cost: Cost): Finding {
  if (cost.servings.multiplier === 1) return { kind: 'unchanged' };

  if (cost.bounded) {
    const { at, written, costMinutes } = cost.batches;
    // Scaling down can take a load away, and the ratio finds it without being told.
    if (at < written) return { kind: 'unbinds' };
    if (at === written) return { kind: 'fits' };
    /*
     * A vessel that binds a WAIT is expensive and a vessel that binds WORK is free — the work
     * was going to grow anyway. `costMinutes` is scaling.md §2's A_batch·(r−1) + H_batch·(r−m),
     * which is the whole of what the vessel adds over the same recipe with no capacity at all.
     */
    return costMinutes > 0
      ? { kind: 'lots-cost', loads: at, minutes: costMinutes }
      : { kind: 'lots-only', loads: at };
  }

  /*
   * The same gate src/components/dials.ts:154 puts on the standing dial, on the same axis, so
   * the front page and the plan page cannot disagree about which recipes can be spoken for.
   * `unknown` means the recipe times nothing, or reports no hands-on minutes across steps nobody
   * timed, or carries minutes we assumed because nothing was said. A confident scaling sentence
   * over any of those is scaling.md §4.6's failure with a new coat on.
   */
  if (cost.evidence === 'unknown') return { kind: 'cannot-say' };

  if (cost.standing.flat) {
    return cost.servings.multiplier < 1
      ? { kind: 'same-wait', minutes: cost.elapsed.at }
      : { kind: 'free' };
  }
  return { kind: 'work' };
}

/* ---- the words ------------------------------------------------------------- */

/*
 * The multipliers this collection offers, in the two grammatical shapes §6 needs. Keyed by the
 * number rather than computed from it, because "Twice as much" is not something arithmetic
 * produces and "2 times as much" is not something anyone says.
 */
const MUCH: Record<string, string> = {
  '0.5': 'Half as much',
  '2': 'Twice as much',
  '3': 'Three times as much',
};

const TIMES: Record<string, string> = {
  '0.5': 'half',
  '2': 'twice',
  '3': 'three times',
};

/** Counts are words. Past twelve nobody reads the word faster than the numeral. */
const COUNTS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
];

const counted = (n: number): string => COUNTS[n] ?? String(n);

/** The same count, starting a sentence. */
const Counted = (n: number): string => {
  const word = counted(n);
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

/** "…plus three steps the recipe never times." — §6's last row, and only where it applies. */
const qualify = (untimedCount: number): string | null =>
  untimedCount > 0
    ? `…plus ${counted(untimedCount)} step${untimedCount === 1 ? '' : 's'} the recipe never times.`
    : null;

/**
 * The phrasebook. One §6 row per finding, and null for the two silences.
 *
 * `unchanged` and `cannot-say` both come back null, which is the whole of what the page needs to
 * know: nothing at × 1, and nothing where there is nothing to say. They arrived here as
 * different kinds and a caller that wants to tell them apart still can.
 *
 * The qualifier rides on the five findings that make a claim about TIME. `fits` and `unbinds`
 * say only how many loads it goes in, and an untimed step does not put a floor under a count.
 *
 * ONE ROW OF §6 IS DELIBERATELY UNUSED: *"three times the batches, and three times as long
 * standing there"*, the long-bound-wait row. Every recipe in this collection that would reach it
 * is an air fryer file reporting ZERO standing minutes — their extra forty minutes is a wait at
 * the machine, not work — so the row would be false on all 22. The short-wait row states the
 * same fact without the clause that is wrong, and it is used for both.
 */
export function wordsFor(
  finding: Finding,
  multiplier: number,
  untimedCount: number,
): Words | null {
  const key = String(multiplier);
  const much = MUCH[key];
  const times = TIMES[key];
  const qualifier = qualify(untimedCount);

  switch (finding.kind) {
    case 'unchanged':
    case 'cannot-say':
      return null;

    case 'free':
      return times ? { said: `Cooking ${times} as much costs you nothing extra.`, qualifier } : null;

    case 'work':
      return much && times
        ? { said: `${much} is ${times} the chopping. The pot doesn’t care.`, qualifier }
        : null;

    case 'same-wait':
      return much
        ? { said: `${much} still takes the same ${formatDuration(finding.minutes)}.`, qualifier }
        : null;

    case 'fits':
      return { said: 'It fits. One load either way.', qualifier: null };

    case 'unbinds':
      return { said: 'At this size it all goes in at once.', qualifier: null };

    case 'lots-only':
      return {
        said: `It goes in ${counted(finding.loads)} lots, and that is the only difference.`,
        qualifier,
      };

    case 'lots-cost':
      return {
        said:
          `It goes in ${counted(finding.loads)} lots, and that costs you about ` +
          `${formatDuration(finding.minutes)}.`,
        qualifier,
      };
  }
}

/* ---- the table the page reads ---------------------------------------------- */

/*
 * /list/ is drawn in the browser out of localStorage and one fetch of /plan.json, and costOf()
 * needs the whole recipe tree — 4.2 MB of it. So every call is made at build time and what
 * crosses into the page is this: a table of finished sentences, and two minute figures per
 * recipe per multiplier. The page looks things up. IT DOES NO ARITHMETIC ON BATCHES OR MINUTES,
 * because it does not have the inputs to do any with.
 *
 * The shape lives here rather than in the page for the reason PlanRecipe lives in plan.ts: the
 * end that writes it and the end that reads it are held to one definition.
 */

/**
 * One recipe at one multiplier:
 * `[ index into says (−1 for silence), standing minutes, elapsed minutes, 1 if standing is sayable ]`
 *
 * A tuple rather than an object because there are 685 recipes times four multipliers of them and
 * the key names would be most of the bytes.
 */
export type CostEntry = [number, number, number, 0 | 1];

export interface CostTable {
  /** Deduplicated `[said, qualifier]` pairs — every unbounded recipe says the same thing. */
  says: [string, string][];
  /** The multipliers, in the order the arrays in `at` run. */
  multipliers: number[];
  at: Record<string, CostEntry[]>;
}

/** What `readCost` hands back: the words, and the two figures the evening total is made of. */
export interface CostReading {
  words: Words | null;
  standingMinutes: number;
  elapsedMinutes: number;
  /**
   * Whether the standing figure is the author's rather than ours. False does NOT mean the
   * elapsed figure is unusable — see eveningLine().
   */
  canStand: boolean;
}

/** Build time. One schedule per recipe, one cost per multiplier, one sentence per cost. */
export function buildCostTable(recipes: RawRecipe[]): CostTable {
  const says: [string, string][] = [];
  const seen = new Map<string, number>();

  const indexOf = (words: Words | null): number => {
    if (!words) return -1;
    const key = `${words.said} ${words.qualifier ?? ''}`;
    let at = seen.get(key);
    if (at === undefined) {
      at = says.length;
      says.push([words.said, words.qualifier ?? '']);
      seen.set(key, at);
    }
    return at;
  };

  const at: Record<string, CostEntry[]> = {};

  for (const recipe of recipes) {
    const written = servingsOf(recipe);
    // No readable `>> servings:` is no baseline to be relative to, so the recipe says nothing.
    if (written === null) continue;

    const schedule = buildSchedule(recipe);
    const entries: CostEntry[] = [];

    for (const multiplier of MULTIPLIERS) {
      const cost = costOf(recipe, written * multiplier, schedule);
      if (!cost) {
        entries.push([-1, 0, 0, 0]);
        continue;
      }
      entries.push([
        indexOf(wordsFor(findingOf(cost), multiplier, cost.untimedCount)),
        cost.standing.at,
        cost.elapsed.at,
        cost.evidence === 'unknown' ? 0 : 1,
      ]);
    }

    at[recipe.slug] = entries;
  }

  return { says, multipliers: [...MULTIPLIERS], at };
}

/**
 * Browser. One recipe at the multiplier it is planned at.
 *
 * Null for a slug the build did not know and for a multiplier the dial does not offer —
 * setMultiplier() accepts any positive number and an old stored plan can carry one. A multiplier
 * with no entry is silence, never a sentence borrowed from a neighbouring one.
 */
export function readCost(
  table: CostTable,
  slug: string,
  multiplier: number,
): CostReading | null {
  const entries = table.at[slug];
  if (!entries) return null;

  const which = table.multipliers.indexOf(multiplier);
  const entry = which < 0 ? undefined : entries[which];
  if (!entry) return null;

  const [say, standingMinutes, elapsedMinutes, canStand] = entry;
  const pair = say >= 0 ? table.says[say] : undefined;

  return {
    words: pair ? { said: pair[0], qualifier: pair[1] || null } : null,
    standingMinutes,
    elapsedMinutes,
    canStand: canStand === 1,
  };
}

/* ---- what the evening costs ------------------------------------------------ */

/**
 * The whole list, added up the only way it can honestly be added up.
 *
 * **Unattended work runs at the same time and hands-on work does not.** So the standing minutes
 * are summed and the elapsed times are NOT: two two-hour braises are a two-hour evening, and the
 * answer given is the longest single dish, stated as a floor. Adding elapsed times together
 * would be wrong in the same direction as the silence this whole ticket is fixing, and it is
 * the one thing the criteria forbid outright.
 *
 * A FULL CROSS-RECIPE SCHEDULE IS ITS OWN STORY and is not attempted. Interleaving two recipes
 * means merging their critical paths and knowing which of them wants the oven, and per-step
 * cookware is not in the generated data (scaling.md §9). Sum-and-max answers what a cook is
 * actually asking — is this a one-hour evening or a four-hour one — and cannot be wrong in the
 * dangerous direction, because it never claims less than the longest dish on the list.
 *
 * The two gates are the ones dials.ts already argues for, one per axis:
 *   - standing sums only the figures whose evidence is the author's. Summing the others would
 *     put back, in the total, exactly the guess the per-line rule just refused to print.
 *   - the floor takes every recipe with a clock, including those. An eight-hour braise is eight
 *     hours because the recipe says eight hours; refusing to say when the evening ends because
 *     its HANDS-ON figure is weak is its own dishonesty, and dials.ts:153 measured that at 371
 *     recipes.
 *
 * Null for fewer than two recipes: with one, "the evening" is the dish, and the page would be
 * repeating the line directly above it.
 */
export function eveningLine(read: CostReading[]): string | null {
  if (read.length < 2) return null;

  let standing = 0;
  let sayable = 0;
  let unsaid = 0;
  let floor = 0;

  for (const one of read) {
    if (one.canStand) {
      standing += one.standingMinutes;
      sayable += 1;
    } else {
      unsaid += 1;
    }
    if (one.elapsedMinutes > floor) floor = one.elapsedMinutes;
  }

  if (floor <= 0) return null;

  const missing =
    unsaid === 0
      ? ''
      : unsaid === 1
        ? ' One of these doesn’t time enough of itself to count.'
        : ` ${Counted(unsaid)} of these don’t time enough of themselves to count.`;

  const evening = `the evening runs at least ${formatDuration(floor)}`;

  if (sayable === 0) {
    return `${evening.charAt(0).toUpperCase()}${evening.slice(1)}.${missing}`;
  }

  const stood = standing > 0 ? `About ${formatDuration(standing)} standing` : 'No standing about';
  return `${stood}, and ${evening} — the waits overlap, the standing about doesn’t.${missing}`;
}
