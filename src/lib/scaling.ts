/*
 * What it costs to cook more of a thing.
 *
 * The model is docs/knowledge/scaling.md and this file implements it. Where the two
 * disagree the file is right and this is a bug — every figure that file publishes by hand is
 * a test in scaling.test.ts, so a disagreement fails the build rather than reaching a page.
 *
 * Two halves. The first reads `>> capacity:` — how many servings the limiting vessel holds,
 * which vessel, and which operations it bounds. The second turns a recipe and a number of
 * servings into what that costs. Nothing here renders and nothing here knows about a page.
 *
 * Three rules hold it up.
 *
 * 1. CAPACITY IS AUTHORED, NEVER DERIVED, and it is ABSENT on almost every file. Most
 *    recipes are not vessel-bound, and a capacity on every file would mean somebody guessed.
 *    It is a fact about a kitchen — the same file is a different number of batches in a
 *    different kitchen (scaling.md §4.2) — so the vessel is named and a reader with a smaller
 *    one can do the correction no model can.
 *
 * 2. THE LINE NAMES AN OPERATION, NOT JUST A NUMBER. A bare `2` on beef-with-broccoli
 *    triples a thirty-minute rest in a fridge and turns 42 minutes into 102 (§3). Nobody's
 *    fridge holds less because the wok does. Only the bounded part batches.
 *
 * 3. NO NOTATION ESCAPES. O(·) is used freely in these names, comments and tests, and this
 *    file returns NO STRING A PAGE COULD PRINT — the only string-typed member of `Cost` is
 *    the `Confidence` enum schedule.ts already ships. The sentences live in §6's phrasebook
 *    and are T-011-05's and T-011-06's to say. A function returning "O(n)" is how the
 *    notation ends up on a card.
 */
import {
  buildSchedule,
  type Confidence,
  handsOnEvidence,
  type Schedule,
  type Task,
} from './schedule.ts';
import { readTimers } from './time.ts';
import type { RawRecipe, RawStep } from './tree.ts';

/* ---- the property ---------------------------------------------------------- */

export interface Capacity {
  /** Servings the limiting vessel holds at once. Finite and greater than zero. */
  servings: number;
  /** The vessel, in the author's own words: "one 12-inch skillet". Never empty. */
  vessel: string;
  /** The operations it bounds, in the author's own words. Never empty. */
  operations: string[];
}

/** Whole, or nothing — and when it is nothing, what to tell the person who wrote the line. */
export interface CapacityReading {
  /** Null when the recipe never declared one, which is nearly every recipe. */
  capacity: Capacity | null;
  /** Null when the line is absent (which is fine) or whole. */
  problem: string | null;
}

const EXAMPLE = 'e.g. >> capacity: 2 — the wok, sear';

/*
 * A count of loads rather than a count of servings: "2 batches", "three loads", "2 goes".
 *
 * This is the one shape the field exists to forbid, for the reason washing-up forbids "2" as
 * an entry: the number of batches is worked out from the capacity and the servings, so an
 * author who writes it has told two stories that can disagree. It is also the number that
 * silently becomes a lie the moment somebody edits `>> servings:`.
 */
const isBatchClaim = (text: string): boolean =>
  /\b(batch|batches|load|loads|go|goes|round|rounds|lot|lots)\b/i.test(text);

/**
 * `>> capacity: 2 — the wok, sear`
 *
 * The leading number is how many SERVINGS the vessel holds — servings, because that is what
 * `>> servings:` and the plan page's multipliers are already in, and because a pan that holds
 * two portions still holds two after somebody rewrites the recipe for six. Then the vessel,
 * then the operations it bounds, comma-separated the way `washing-up` and `tags` are.
 *
 * Liberal about how a human joined the number to the words — an em dash, a hyphen, a colon, a
 * comma, or nothing at all — and strict about what the parts mean. A checker that spends its
 * credibility on punctuation has none left for the operation.
 */
export function readCapacity(value: string | null | undefined): CapacityReading {
  const line = value?.trim();
  if (!line) return { capacity: null, problem: null };

  // The leading number, an optional unit word that is only politeness, then one separator.
  const match = line.match(/^(\d+(?:\.\d+)?)\s*(?:servings?|portions?)?\s*[—–:,-]?\s*([\s\S]*)$/);
  if (!match) {
    return {
      capacity: null,
      problem:
        `capacity "${line}" does not start with a number — it is how many SERVINGS the ` +
        `vessel holds, then the vessel, then what it bounds. ${EXAMPLE}`,
    };
  }

  const servings = Number(match[1]);
  if (!Number.isFinite(servings) || servings <= 0) {
    return {
      capacity: null,
      problem: `capacity "${match[1]}" has to be more than zero servings. ${EXAMPLE}`,
    };
  }

  const rest = match[2].trim();
  if (isBatchClaim(rest)) {
    return {
      capacity: null,
      problem:
        `capacity "${rest}" counts batches rather than servings — how many batches is ` +
        `worked out from this number and >> servings:, so say what the vessel HOLDS. ${EXAMPLE}`,
    };
  }

  const parts = rest.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return {
      capacity: null,
      problem:
        `capacity ${servings} names no vessel — "${servings}" alone tells a reader with a ` +
        `different pan nothing at all. ${EXAMPLE}`,
    };
  }

  const [vessel, ...operations] = parts;
  if (operations.length === 0) {
    return {
      capacity: null,
      problem:
        `capacity ${servings} names "${vessel}" but not what it bounds — a capacity with no ` +
        `operation charges the batches onto every wait in the recipe, including the ones in ` +
        `the fridge. ${EXAMPLE}`,
    };
  }

  return { capacity: { servings, vessel, operations }, problem: null };
}

/* ---- reading the recipe ---------------------------------------------------- */

/**
 * Servings the recipe is written for: the leading number of `>> servings:`.
 *
 * Six files in the collection say a volume ("1 cup", "6 cups") rather than a count. Their
 * leading number is read the same way, because §2 of the model measures everything against
 * this line and a recipe with no baseline has no cost to scale. What such a file must not do
 * is declare a capacity — check-recipes.mjs says so.
 */
export function servingsOf(recipe: RawRecipe): number | null {
  const match = recipe.metadata?.servings?.trim().match(/^(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const servings = Number(match[1]);
  return Number.isFinite(servings) && servings > 0 ? servings : null;
}

/*
 * Both sides of the match are human writing, so both are flattened the same way before they
 * meet: no case, no accents, no punctuation. The same treatment washing-up gives its
 * cross-check, and for the same reason.
 */
const words = (text: string): string[] =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // drop the accents NFD just split off
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/*
 * Enough of a word to compare a verb with its -ing: "marinating" and "marinate" both come
 * back "marinat", "searing" and "sear" both come back "sear". Deliberately crude — a real
 * stemmer is a dependency and an English rule this file has no business owning.
 */
const stem = (word: string): string => {
  const trimmed = word.length > 4 ? word.replace(/(ing|ed|es|s)$/, '') : word;
  return trimmed.length > 3 ? trimmed.replace(/e$/, '') : trimmed;
};

/**
 * Whether one word the author wrote is the word the step used.
 *
 * Stems compared whole, then a prefix in either direction with three letters minimum: "sear"
 * finds "searing", "marinating" finds "marinate", and neither finds "research" because whole
 * words are compared and never substrings of a sentence. It is a guess about English. What
 * makes the guess safe is that an operation matching NOTHING fails the check and prints the
 * labels it tried, so a wrong guess is caught by the author on the first run rather than by a
 * reader six months later.
 */
const sameWord = (a: string, b: string): boolean => {
  const [x, y] = [stem(a), stem(b)];
  return x === y || (x.length >= 3 && y.length >= 3 && (x.startsWith(y) || y.startsWith(x)));
};

/** Everything a step says: the label a cook reads, and the sentence it was written from. */
const textOf = (step: RawStep): string =>
  [step.labelOverride ?? '', step.rawLabel].filter(Boolean).join(' ');

const entryMatches = (entry: string, text: string): boolean => {
  const wanted = words(entry);
  if (wanted.length === 0) return false;
  const said = words(text);
  return wanted.every((word) => said.some((other) => sameWord(word, other)));
};

/**
 * Indices of the steps a capacity binds — the ones whose cost repeats with every load.
 *
 * EMPTY IS A FAULT AND NOT A FACT: a capacity that binds nothing is an author naming an
 * operation this recipe does not have, and check-recipes.mjs fails on it. Only the bounded
 * part batches (§2), so getting this set wrong is how a sauce simmered in one pot gets
 * charged four times over.
 */
export function boundSteps(recipe: RawRecipe, capacity: Capacity): number[] {
  const bound = new Set<number>();
  for (const step of recipe.steps) {
    const text = textOf(step);
    if (capacity.operations.some((entry) => entryMatches(entry, text))) bound.add(step.index);
  }
  return [...bound].sort((a, b) => a - b);
}

/**
 * Whether the recipe's own words already say the bound operation happens in batches.
 *
 * A capacity below `>> servings:` says the recipe as written already needs more than one
 * load. That is either a wrong number or, in the ticket's words, "a recipe that already
 * batches and did not say" — and a recipe that DID say is neither. 23 files say it inside the
 * timer (`~brown{12%min}, in two batches`), which is exactly where it belongs, and
 * beef-with-broccoli says it in the label the model quotes: "sear in two batches 3 min".
 */
export function saysItBatches(recipe: RawRecipe, capacity: Capacity): boolean {
  const bound = new Set(boundSteps(recipe, capacity));
  return recipe.steps.some((step) => bound.has(step.index) && /\bbatch(es)?\b/i.test(textOf(step)));
}

/* ---- the cost function ----------------------------------------------------- */

/**
 * A figure at the size the recipe is written for, the same figure at the size you want, and
 * how it got from one to the other.
 *
 * The growth is returned rather than left to the caller because the useful statement is about
 * the curve — *three times as much costs you nothing extra* — and a caller re-deriving it is a
 * second answer to one question.
 */
export interface Growth {
  /** The figure at the servings the recipe is written for. */
  written: number;
  /** The same figure at the target. */
  at: number;
  /**
   * `at / written`, or null when `written` is zero — chili-con-carne stands you at the pot for
   * no minutes at all, and "zero grew by a factor of nothing" is a division a caller should
   * not have to defend.
   */
  factor: number | null;
  /** True when the figure did not move at all. */
  flat: boolean;
}

/** How many loads the vessel makes of it, then and now. `scaling.md` §2's `b` and `r`. */
export interface Batches {
  /** `ceil(s/c)` — loads the recipe already needs as written. 1 when no capacity is declared. */
  written: number;
  /** `ceil(n/c)` — loads at the target. */
  at: number;
  /** `b(n)/b(s)`. A RATIO, because a recipe measured at `s` was measured with `b(s)` loads. */
  ratio: number;
  /** True when the target needs more loads than the written recipe does. */
  binds: boolean;
  /**
   * Minutes the vessel costs over the same recipe with no capacity at all:
   * `A_batch·(r − 1) + H_batch·(r − m)`. Usually zero, and that is the point — a vessel that
   * binds a WAIT is expensive and a vessel that binds WORK is free, because the work was
   * going to grow anyway. Searing in two goes costs nothing; three loads of a 20-minute
   * basket costs forty minutes.
   */
  costMinutes: number;
}

export interface Cost {
  /** False when no capacity was declared, which is nearly always. */
  bounded: boolean;
  /** `s`, `n` and `m = n/s`. */
  servings: { written: number; at: number; multiplier: number };
  batches: Batches;
  /** Clock time for one cook: `A_free + m·H_free + r·(A_batch + H_batch)`. */
  elapsed: Growth;
  /** Time you are standing there: `m·H_free + r·H_batch`. */
  standing: Growth;
  /** The longest unbroken stretch of that, grown by `max(m, r)` — see longestGrowth(). */
  longest: Growth;
  /**
   * How good the hands-on figure was BEFORE it was scaled, unchanged by the scaling. A
   * multiplied guess is a bigger guess, so this may never read stronger than the figure it
   * scaled — and the one place it could have been made to is here.
   */
  evidence: Confidence;
  /** The part of `standing.at` that is there only because nothing was said. Grows with it. */
  assumedStandingMinutes: number;
  /** Operations the recipe never timed. The figure above is a floor by exactly this much. */
  untimedCount: number;
}

/** Minutes are floats once seconds are involved; keep the arithmetic from drifting. */
const round = (minutes: number) => Math.round(minutes * 100) / 100;

/**
 * One task's minutes, split hands-on from unattended.
 *
 * `Task.attention` is a whole-step label and deliberately cautious — a step with one hands-on
 * timer among five is called hands-on entire — which is right for a table cell and wrong here:
 * read that way karaage's `A` comes out 35 against the 40 the model computed by hand, because
 * the five-minute rest inside "fry 90 sec, rest 5 min" disappears into a hands-on label.
 *
 * So the timers are read again, with the same call buildSchedule() makes on the same inputs —
 * the step's own timers against the label off the tree. It is the same reading and not a
 * second opinion, and a whole-collection test in scaling.test.ts holds it to that: summing
 * this over every task reproduces the schedule's own two totals on every recipe.
 */
function splitAttention(
  step: RawStep | undefined,
  task: Task,
  inVessel: (timerName: string | null) => boolean,
): Split {
  const all = step?.timers ?? [];
  const readings = readTimers(all, task.label);
  const split: Split = { handsOn: 0, unattended: 0, handsOnBound: 0, unattendedBound: 0 };

  for (const [i, timer] of all.entries()) {
    const minutes = timer.minutes;
    if (minutes === null || !Number.isFinite(minutes)) continue;
    const bound = inVessel(timer.name);
    if (readings[i].attention === 'unattended') {
      split.unattended += minutes;
      if (bound) split.unattendedBound += minutes;
    } else {
      split.handsOn += minutes;
      if (bound) split.handsOnBound += minutes;
    }
  }

  return split;
}

interface Split {
  handsOn: number;
  unattended: number;
  handsOnBound: number;
  unattendedBound: number;
}

/**
 * Which minutes of a bound step are actually inside the vessel.
 *
 * A capacity binds an OPERATION, and a step is often two of them in one sentence:
 * karaage's `~fry{90%sec}, then lift it onto a rack and ~rest{5%min}` is ninety seconds in the
 * oil and five minutes on a rack, and only the first is in the pot. Charging the rest to the
 * vessel puts ten minutes on twelve portions that nobody waits — the same error at timer
 * granularity that scaling.md §3's 102 minutes is at recipe granularity.
 *
 * A TIMER'S NAME is the author saying which operation the minutes belong to, which is the
 * claim time.ts already leans on for the whole hands-on reading. So a named timer is in the
 * vessel only if the capacity names it, and an unnamed one is in whenever its step is —
 * because nothing distinguishes it, and charging it is the busier reading.
 */
const binderFor = (capacity: Capacity | null, bound: Set<number>) =>
  (index: number) =>
    (timerName: string | null): boolean => {
      if (!capacity || !bound.has(index)) return false;
      if (!timerName) return true;
      return capacity.operations.some((entry) => entryMatches(entry, timerName));
    };

/** `scaling.md` §2's symbols, read off one recipe and its schedule. */
function parts(recipe: RawRecipe, schedule: Schedule, capacity: Capacity | null, bound: Set<number>) {
  const steps = new Map(recipe.steps.map((step) => [step.index, step]));
  const onPath = new Set(schedule.criticalPath);
  const binds = binderFor(capacity, bound);

  /*
   * A is a LENGTH OF CLOCK and unattendedMinutes is a branch sum, which is not the same
   * number: gyoza reports 56 unattended minutes against a 49-minute recipe, because the
   * cabbage salts while the dough rests. Only one of those two is time you wait through, so A
   * is summed along the critical path. H is the branch sum as published, because every minute
   * of work is a minute somebody stands there whichever branch it is on.
   */
  let a = 0;
  let aBatch = 0;
  let hBatch = 0;

  for (const task of schedule.tasks) {
    const index = Number(task.id.slice(1));
    const split = splitAttention(steps.get(index), task, binds(index));
    if (onPath.has(task.id)) {
      a += split.unattended;
      aBatch += split.unattendedBound;
    }
    hBatch += split.handsOnBound;
  }

  const h = schedule.handsOnMinutes;
  return { a, h, aBatch, hBatch, aFree: a - aBatch, hFree: h - hBatch };
}

const growth = (written: number, at: number): Growth => ({
  written: round(written),
  at: round(at),
  factor: written === 0 ? null : round(at / written),
  flat: round(at) === round(written),
});

/**
 * What the longest unbroken stretch grows by.
 *
 * `longestHandsOnMinutes` is made of hands-on minutes, and WHICH of them — free or batched —
 * is not recorded, so the honest answer is the larger of the two factors those minutes could
 * have grown by. `max(m, r)` and not `r`: `r < m` is possible (s=4, c=3, n=8 gives r=1.5 and
 * m=2), and a stretch must never be reported as growing more slowly than the work it is made
 * of. When the vessel bounds no hands-on work at all there is no batched work in the stretch
 * to begin with, so it grows with the work: at half a recipe the stretch halves.
 *
 * Where it errs it errs towards a busier evening, which is schedule.ts:longestUnbroken()'s own
 * convention: it warns a tired cook rather than reassuring one. It is an ACCEPTED ERROR with a
 * stated direction — four loads of a basket put a twenty-minute wait between the hands-on
 * chunks, which is a break, so a real cook's stretch would not grow by the batch ratio at all.
 *
 * The one thing it may not do is exceed the standing figure, which is why costOf() caps it
 * there: the stretch is made of those minutes, and a run longer than the work it is cut from
 * is not a cautious answer but an incoherent one. The schedule keeps the same invariant.
 */
const longestGrowth = (multiplier: number, ratio: number, batchedWork: number) =>
  batchedWork > 0 ? Math.max(multiplier, ratio) : multiplier;

/**
 * What it costs to cook `wanted` servings of this recipe.
 *
 * Null when the recipe has no readable `>> servings:` to scale from, or when `wanted` is not a
 * positive number. There is no baseline to be relative to, and inventing one would be the
 * plan page printing `serves 4 → 12` all over again.
 *
 * Pass the schedule if you already built one — a page has, and building it twice is waste.
 */
export function costOf(recipe: RawRecipe, wanted: number, schedule?: Schedule): Cost | null {
  const s = servingsOf(recipe);
  if (s === null || !Number.isFinite(wanted) || wanted <= 0) return null;

  const built = schedule ?? buildSchedule(recipe);
  const capacity = recipe.capacity ?? null;
  const bound = new Set(capacity ? boundSteps(recipe, capacity) : []);
  const { a, h, aBatch, hBatch, aFree, hFree } = parts(recipe, built, capacity, bound);

  const m = wanted / s;
  // b(k) = ceil(k/c), and 1 when nothing binds — every load is the only load.
  const loads = (servings: number) => (capacity ? Math.ceil(servings / capacity.servings) : 1);
  const bWritten = loads(s);
  const bAt = loads(wanted);
  const r = bAt / bWritten;

  const elapsedAt = aFree + m * hFree + r * (aBatch + hBatch);
  const standingAt = m * hFree + r * hBatch;
  const stretch = longestGrowth(m, r, hBatch);

  /*
   * The whole of the vessel's contribution, which is almost always zero: subtract the
   * no-capacity answer from this one and everything else cancels. A_batch·(r−1) is a WAIT
   * repeated, and it is the expensive term; H_batch·(r−m) is a part-full last load.
   */
  const costMinutes = aBatch * (r - 1) + hBatch * (r - m);

  return {
    bounded: capacity !== null,
    servings: { written: s, at: wanted, multiplier: round(m) },
    batches: {
      written: bWritten,
      at: bAt,
      ratio: round(r),
      binds: bAt > bWritten,
      costMinutes: round(costMinutes),
    },
    elapsed: growth(a + h, elapsedAt),
    standing: growth(h, standingAt),
    longest: growth(
      built.longestHandsOnMinutes,
      Math.min(built.longestHandsOnMinutes * stretch, standingAt),
    ),
    /*
     * The reading the schedule already publishes, passed through rather than recomputed. A
     * cost built on assumed minutes is a guess multiplied, and multiplying makes it worse —
     * so the one thing this function may never do is hand back a figure that looks more
     * certain than the figure it scaled.
     */
    evidence: handsOnEvidence(built),
    assumedStandingMinutes: round(
      built.assumedHandsOnMinutes * (h === 0 ? m : standingAt / h),
    ),
    untimedCount: built.untimedCount,
  };
}
