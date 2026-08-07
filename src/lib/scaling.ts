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
