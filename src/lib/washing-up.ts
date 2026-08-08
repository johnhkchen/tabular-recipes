/*
 * What is in the sink when the food is on the table.
 *
 * The clock under the table says how long a dish takes and how much of that you stand there
 * for. `slack` says what happens if you get it wrong. Neither says what you are left holding
 * at the end, and three counters on this site — One Pot, Instant Pot, The Slow Cooker — make
 * a promise about exactly that. This is the fact those promises can be checked against.
 *
 * Two rules hold the whole file up.
 *
 * 1. IT IS AUTHORED, NEVER DERIVED. Nothing here reads the `cookware` list, and no formula
 *    over it could stand in. That list counts what a recipe NAMES: general-tsos-chicken
 *    declares one #wok{} and is a quart of frying oil, a bowl to velvet in, a dish to dredge
 *    in, a rack to drain on and a bowl for the glaze. docs/gaps/one-pot.md ranked 114
 *    candidates off that line and then threw 61 off the shelf by hand, which is the
 *    experiment already run. A cook knows what they washed; a parser does not.
 *
 * 2. THE COUNT IS THE LIST'S LENGTH, AND IT IS TAKEN HERE AND NOWHERE ELSE. A recipe that
 *    says "2" and then lists three things has told two different stories, so an author never
 *    writes the number at all — the same instinct behind labels being derived from steps and
 *    pairs-with being made mutual at build time. One entry is one thing to wash.
 *
 * Absent and zero are different answers and are different values. Most of the collection has
 * never declared one (`null`), and a dry rub shaken together in the jar it is kept in
 * genuinely washes nothing (`{ items: [], count: 0 }`). A line that is there but not whole is
 * neither: it hands back the reason, which check-recipes prints and parse-recipes throws on.
 */

/**
 * How a recipe says it washes nothing. The whole line, not an entry in one — "nothing" among
 * three real things is a typo wearing a keyword, and the strongest thing this field can say
 * should not be reachable by accident.
 */
export const NOTHING_WORDS = ['nothing', 'none'] as const;

/**
 * Cookware that is bolted down or plugged in, so it never goes in a sink. Deliberately short:
 * it holds only the things nobody would argue about. A tray, a rack and a masher are left to
 * the author, because the author is the point of an authored field.
 *
 * Matched on the WHOLE name and never on a word inside it. A #Dutch oven{} is a pot that
 * happens to end in "oven", and a rule loose enough to excuse it would excuse the one vessel
 * this whole field was written about.
 */
export const NEVER_WASHED = [
  'oven', 'toaster oven', 'hob', 'stove', 'stovetop', 'range', 'grill', 'charcoal grill',
  'gas grill', 'broiler', 'smoker', 'microwave', 'fridge', 'refrigerator', 'freezer',
  'worktop', 'counter', 'sink',
] as const;

export interface WashingUp {
  /** The things, in the author's own words and order. Empty is a real answer: nothing. */
  items: string[];
  /** items.length. Derived here, so the number and the list can never disagree. */
  count: number;
}

/** Whole, or nothing — and when it is nothing, what to tell the person who wrote the line. */
export interface WashingUpReading {
  /** Null when the recipe never declared one, which is most of them. */
  washingUp: WashingUp | null;
  /** Null when the line is absent (which is fine) or whole. */
  problem: string | null;
}

const EXAMPLE =
  'e.g. >> washing-up: the Dutch oven, a bowl for the glaze — ' +
  'or >> washing-up: nothing, if it genuinely washes nothing';

/** `nothing`, `None`, `nothing.` — and nothing else. */
const isNothing = (text: string): boolean =>
  (NOTHING_WORDS as readonly string[]).includes(text.toLowerCase().replace(/[.!]+$/, ''));

/*
 * A claim rather than a thing: "2", "5 things", "3 items". This is the one shape the field
 * exists to forbid, so it is refused wherever it appears rather than only on its own.
 */
const isNumberClaim = (item: string): boolean =>
  /^\d+(\s+(things?|items?|pieces?))?$/i.test(item.trim());

/**
 * `>> washing-up: the wok, a rack to drain on` — a comma-separated list of the things that go
 * in the sink, in the words a cook would use, read exactly the way `tags` and `counters` are.
 *
 * `value` is the raw metadata value: **undefined when the line is absent, '' when it is there
 * and empty**. Those are different answers here, which is the one place this reader parts
 * company with readSlack(): a line an author started and abandoned must not quietly become
 * the strongest claim the field can make.
 */
export function readWashingUp(value: string | null | undefined): WashingUpReading {
  if (value === undefined || value === null) return { washingUp: null, problem: null };

  const line = value.trim();
  const items = line
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return {
      washingUp: null,
      problem:
        'washing-up is there but says nothing — list the things that go in the sink, ' +
        `or write "nothing" if there are none. ${EXAMPLE}`,
    };
  }

  if (items.length === 1 && isNothing(items[0])) {
    return { washingUp: { items: [], count: 0 }, problem: null };
  }

  const stray = items.find(isNothing);
  if (stray) {
    return {
      washingUp: null,
      problem:
        `washing-up says "${stray}" alongside ${items.length - 1} other thing(s) — ` +
        `"nothing" is the whole line or none of it. ${EXAMPLE}`,
    };
  }

  const number = items.find(isNumberClaim);
  if (number) {
    return {
      washingUp: null,
      problem:
        `washing-up says "${number}", which is a number rather than a thing — the count is ` +
        `worked out from the list, so write what the things are. ${EXAMPLE}`,
    };
  }

  return { washingUp: { items, count: items.length }, problem: null };
}

const COUNT_WORDS = [
  'Nothing to wash', 'One thing', 'Two things', 'Three things', 'Four things', 'Five things',
  'Six things', 'Seven things', 'Eight things', 'Nine things', 'Ten things', 'Eleven things',
  'Twelve things',
];

/** The derived count as it is printed. Past twelve a word is a number anyway, so it is one. */
export function washingUpWord(count: number): string {
  return COUNT_WORDS[count] ?? `${count} things`;
}

/*
 * Both sides of the cross-check are human writing, so both are flattened the same way before
 * they meet: no case, no accents, no leading article, no punctuation. Loose on purpose — an
 * advisory that fires on a comma gets ignored, and an ignored warning is worse than none.
 */
const flatten = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // drop the accents NFD just split off
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/^(the|a|an|one) /, '')
    .trim();

const isFixture = (name: string): boolean =>
  (NEVER_WASHED as readonly string[]).includes(name);

/**
 * Every `#thing{}` the file names that its washing-up line does not account for, minus the
 * things that are never washed. **Advisory, never an error.**
 *
 * A file naming a #Dutch oven{} and declaring nothing in the sink is probably wrong and worth
 * a warning; it is not automatically wrong, because a foil-lined tray is a real answer. And
 * the interesting failure is the opposite direction — the bowls a recipe uses and never names
 * — which no check can catch and which is why the field is authored in the first place.
 */
export function unaccountedCookware(
  cookware: string[],
  washingUp: WashingUp | null,
): string[] {
  if (!washingUp) return [];
  const listed = washingUp.items.map(flatten).filter((item) => item.length >= 3);

  return cookware.filter((name) => {
    const flat = flatten(name);
    if (!flat || isFixture(flat)) return false;
    return !listed.some((item) => item.includes(flat) || flat.includes(item));
  });
}

/*
 * "two mixing bowls" is one entry and two things, and splitList cannot tell. Left as a warning
 * rather than an error because it is a guess about English, but it is the one guess worth
 * making: it defends the rule the whole field rests on, that one entry is one thing.
 */
const PLURAL_START =
  /^(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|[2-9]|\d\d+)\b/i;

/** Entries that count as one thing and plainly mean several. Advisory. */
export function pluralEntries(washingUp: WashingUp | null): string[] {
  if (!washingUp) return [];
  return washingUp.items.filter((item) => PLURAL_START.test(item.trim()));
}
