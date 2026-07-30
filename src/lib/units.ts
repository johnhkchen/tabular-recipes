/*
 * Adding two recipes together.
 *
 * A shopping list is one ingredient's amounts from several recipes, added up and written
 * the way a shop sells the thing. Three jobs live here:
 *
 *   canonicalUnit()  — cup/cups/Cup are one unit; Tbs/Tbsp/tablespoon are one unit.
 *   combine()        — add what can be added, and REFUSE what cannot.
 *   formatAmount()   — say the total in a unit a cook would write.
 *
 * The refusal is the important half. A cup is a volume and a gram is a mass; turning one
 * into the other needs the ingredient's density, which no recipe here carries. So
 * combine([3 cups, 80 g]) is two entries and the page prints "3 cups + 80 g". It is never
 * one number. The same goes for counts: 2 cloves and 1 cup of garlic stay apart, because a
 * clove's volume is a fact about that clove and we do not have it.
 *
 * What we WILL convert is inside one system: tsp → Tbs → cup → qt → gal, oz → lb,
 * mL → L, g → kg. Those factors are definitions, not guesses.
 */

/** The same shape as RawIngredient.amount, so an ingredient's amount can be passed straight in. */
export interface Amount {
  value: number | null;
  unit: string | null;
}

/**
 * 'count' covers both a thing you count (2 cloves) and a size you count by (2 large), and
 * also anything we do not recognise — see canonicalUnit(). Nothing in 'count' is ever
 * converted into anything else.
 */
export type System = 'mass' | 'volume' | 'count';

export interface CanonicalUnit {
  /** The canonical spelling, singular: 'cup', 'Tbs', 'tsp', 'oz', 'lb', 'g', 'clove', 'large'. */
  unit: string;
  system: System;
  /** Base units in one of these — mL for volume, g for mass, 1 for count. */
  per: number;
}

type Family = 'us' | 'metric';

interface UnitDef {
  system: System;
  per: number;
  /** Which ladder to render on. Cups do not become litres, litres do not become cups. */
  family?: Family;
  /** Only set when the plural is a real word a cook writes: 2 cups, 2 cloves, 2 leaves. */
  plural?: string;
  /** A count that is a size rather than a thing: "large", "ripe". See combine(). */
  descriptor?: true;
  /** Metric is written in decimals — "3.07 L", not "3 1/8 L". Nobody halves a litre twice. */
  decimal?: true;
  aliases: string[];
}

/*
 * Every unit the 249 recipes actually use, plus the obvious neighbours. The corpus writes
 * "Tbs" nine times as often as "Tbsp", so "Tbs" is the canonical spelling.
 *
 * "oz" is mass. Bare "oz" in an American recipe is weight — the corpus uses it that way
 * ("125 g (4 1/2 oz) unsalted butter"). A fluid ounce has to say "fl oz".
 */
const UNITS: Record<string, UnitDef> = {
  // ---- volume, US ----
  tsp: {
    system: 'volume', per: 4.92892159375, family: 'us',
    aliases: ['tsp', 'tsps', 'teaspoon', 'teaspoons', 'tspn'],
  },
  Tbs: {
    system: 'volume', per: 14.78676478125, family: 'us',
    aliases: ['tbs', 'tbsp', 'tbsps', 'tbls', 'tb', 'tablespoon', 'tablespoons'],
  },
  'fl oz': {
    system: 'volume', per: 29.5735295625, family: 'us',
    aliases: ['fl oz', 'floz', 'fl. oz', 'fluid ounce', 'fluid ounces'],
  },
  cup: {
    system: 'volume', per: 236.5882365, family: 'us', plural: 'cups',
    aliases: ['cup', 'cups'],
  },
  pt: {
    system: 'volume', per: 473.176473, family: 'us',
    aliases: ['pt', 'pts', 'pint', 'pints'],
  },
  qt: {
    system: 'volume', per: 946.352946, family: 'us',
    aliases: ['qt', 'qts', 'quart', 'quarts'],
  },
  gal: {
    system: 'volume', per: 3785.411784, family: 'us',
    aliases: ['gal', 'gals', 'gallon', 'gallons'],
  },

  // ---- volume, metric ----
  mL: {
    system: 'volume', per: 1, family: 'metric', decimal: true,
    aliases: ['ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres', 'cc'],
  },
  cL: {
    system: 'volume', per: 10, family: 'metric', decimal: true,
    aliases: ['cl', 'centiliter', 'centilitre'],
  },
  dL: {
    system: 'volume', per: 100, family: 'metric', decimal: true,
    aliases: ['dl', 'deciliter', 'decilitre'],
  },
  L: {
    system: 'volume', per: 1000, family: 'metric', decimal: true,
    aliases: ['l', 'liter', 'liters', 'litre', 'litres'],
  },

  // ---- mass ----
  oz: {
    system: 'mass', per: 28.349523125, family: 'us',
    aliases: ['oz', 'ozs', 'ounce', 'ounces'],
  },
  lb: { system: 'mass', per: 453.59237, family: 'us', aliases: ['lb', 'lbs', 'pound', 'pounds'] },
  mg: {
    system: 'mass', per: 0.001, family: 'metric', decimal: true,
    aliases: ['mg', 'milligram', 'milligrams'],
  },
  g: {
    system: 'mass', per: 1, family: 'metric', decimal: true,
    aliases: ['g', 'gr', 'gram', 'grams', 'gramme'],
  },
  kg: {
    system: 'mass', per: 1000, family: 'metric', decimal: true,
    aliases: ['kg', 'kilogram', 'kilograms', 'kilo'],
  },

  // ---- counts: things you count ----
  clove: { system: 'count', per: 1, plural: 'cloves', aliases: ['clove', 'cloves'] },
  sprig: { system: 'count', per: 1, plural: 'sprigs', aliases: ['sprig', 'sprigs'] },
  rib: { system: 'count', per: 1, plural: 'ribs', aliases: ['rib', 'ribs'] },
  stalk: { system: 'count', per: 1, plural: 'stalks', aliases: ['stalk', 'stalks'] },
  slice: { system: 'count', per: 1, plural: 'slices', aliases: ['slice', 'slices'] },
  leaf: { system: 'count', per: 1, plural: 'leaves', aliases: ['leaf', 'leaves'] },
  can: { system: 'count', per: 1, plural: 'cans', aliases: ['can', 'cans'] },
  jar: { system: 'count', per: 1, plural: 'jars', aliases: ['jar', 'jars'] },
  package: { system: 'count', per: 1, plural: 'packages', aliases: ['package', 'packages', 'pkg'] },
  stick: { system: 'count', per: 1, plural: 'sticks', aliases: ['stick', 'sticks'] },
  sheet: { system: 'count', per: 1, plural: 'sheets', aliases: ['sheet', 'sheets'] },
  head: { system: 'count', per: 1, plural: 'heads', aliases: ['head', 'heads'] },
  bulb: { system: 'count', per: 1, plural: 'bulbs', aliases: ['bulb', 'bulbs'] },
  cube: { system: 'count', per: 1, plural: 'cubes', aliases: ['cube', 'cubes'] },
  bunch: { system: 'count', per: 1, plural: 'bunches', aliases: ['bunch', 'bunches'] },
  piece: { system: 'count', per: 1, plural: 'pieces', aliases: ['piece', 'pieces'] },
  strip: { system: 'count', per: 1, plural: 'strips', aliases: ['strip', 'strips'] },
  wedge: { system: 'count', per: 1, plural: 'wedges', aliases: ['wedge', 'wedges'] },
  ear: { system: 'count', per: 1, plural: 'ears', aliases: ['ear', 'ears'] },
  /*
   * A pinch is a count, not a volume. It is often written as 1/16 tsp, but that number is
   * an convention rather than a measurement of anybody's fingers, so we do not spend it.
   */
  pinch: { system: 'count', per: 1, plural: 'pinches', aliases: ['pinch', 'pinches'] },
  handful: { system: 'count', per: 1, plural: 'handfuls', aliases: ['handful', 'handfuls'] },

  // ---- counts: sizes you count by ----
  large: { system: 'count', per: 1, descriptor: true, aliases: ['large', 'lg'] },
  medium: { system: 'count', per: 1, descriptor: true, aliases: ['medium', 'med'] },
  small: { system: 'count', per: 1, descriptor: true, aliases: ['small', 'sm'] },
  'extra-large': {
    system: 'count', per: 1, descriptor: true,
    aliases: ['extra-large', 'extra large', 'xl', 'jumbo'],
  },
  ripe: { system: 'count', per: 1, descriptor: true, aliases: ['ripe'] },
  whole: { system: 'count', per: 1, descriptor: true, aliases: ['whole'] },
};

const ALIASES = new Map<string, string>();
for (const [name, def] of Object.entries(UNITS)) {
  ALIASES.set(name.toLowerCase(), name);
  for (const alias of def.aliases) ALIASES.set(alias, name);
}

/** Lowercase, collapse whitespace, drop the trailing full stop in "Tbs.". */
function normaliseUnit(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '');
}

/** Only used after the alias table has already missed, so it cannot mangle a known word. */
function singular(word: string): string {
  if (word.length > 3 && /(ch|sh|s|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 2 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * The unit, folded to one spelling.
 *
 * A unit we do not know becomes a count named by its own word — "2 in" stays "2 in", adds
 * to another "2 in", and merges with nothing else. That is the safe reading: an unknown
 * word cannot be converted, so refusing to convert it is the whole of the right answer.
 * Only an empty or wordless unit ("", "%") comes back null.
 */
export function canonicalUnit(unit: string | null): CanonicalUnit | null {
  if (unit === null) return null;
  const key = normaliseUnit(unit);
  if (!key || !/[a-z]/.test(key)) return null;

  const name = ALIASES.get(key) ?? ALIASES.get(singular(key));
  if (name) {
    const def = UNITS[name];
    return { unit: name, system: def.system, per: def.per };
  }
  return { unit: singular(key), system: 'count', per: 1 };
}

/**
 * Two amounts add up only if they land in the same bucket.
 *
 *   mass      — every mass converts to every other mass.
 *   volume    — every volume converts to every other volume.
 *   count     — a bare number and a size ("2 large") count the same things, so they share
 *               one bucket; a named thing ("2 cloves") is its own bucket, because a clove
 *               is not a slice and neither of them is a bare 2.
 */
function bucketOf(unit: string | null): string {
  const canon = canonicalUnit(unit);
  if (!canon) return 'count';
  if (canon.system !== 'count') return canon.system;
  return UNITS[canon.unit]?.descriptor ? 'count' : `count:${canon.unit}`;
}

/** Whether these two would add up, rather than be printed side by side. */
export function canCombine(a: Amount, b: Amount): boolean {
  return bucketOf(a.unit) === bucketOf(b.unit);
}

interface Bucket {
  order: number;
  base: number;
  /** How many amounts used each canonical unit, and how much of the total each brought. */
  used: Map<string, { times: number; base: number; order: number }>;
  /** Count buckets only: the size word, or null once two different ones have met. */
  descriptor: string | null | undefined;
}

const isUsable = (a: Amount) => a.value !== null && Number.isFinite(a.value);

/**
 * Add up what can be added; return one entry per bucket that cannot merge with another.
 *
 * The list comes back in the order the buckets first appeared, so
 * combine([3 cups, 80 g]) is [3 cups, 80 g] and the page prints "3 cups + 80 g".
 *
 * Two things it will not do:
 *
 *   - Cross a system. There is no density here, so there is no conversion.
 *   - Keep a size word it cannot stand behind. 2 large + 3 large is 5 large; 2 large + 2
 *     plain is 4, with no claim about size, because nobody said the second two were large.
 *
 * An amount with no number at all is not added to anything — it comes back as a single
 * trailing { value: null, unit: null }, which formatAmount() prints as "some".
 */
export function combine(amounts: Amount[]): Amount[] {
  const buckets = new Map<string, Bucket>();
  let unknown = false;

  for (const amount of amounts) {
    if (!isUsable(amount)) {
      unknown = true;
      continue;
    }
    const value = amount.value as number;
    const canon = canonicalUnit(amount.unit);
    const key = bucketOf(amount.unit);
    const base = value * (canon?.per ?? 1);

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { order: buckets.size, base: 0, used: new Map(), descriptor: undefined };
      buckets.set(key, bucket);
    }
    bucket.base += base;

    if (canon) {
      const seen = bucket.used.get(canon.unit);
      if (seen) {
        seen.times += 1;
        seen.base += base;
      } else {
        bucket.used.set(canon.unit, { times: 1, base, order: bucket.used.size });
      }
    }

    if (key === 'count') {
      const size = canon && UNITS[canon.unit]?.descriptor ? canon.unit : null;
      bucket.descriptor = bucket.descriptor === undefined || bucket.descriptor === size
        ? size
        : null;
    }
  }

  const out: Amount[] = [...buckets.values()]
    .sort((a, b) => a.order - b.order)
    .map((bucket) => {
      if (bucket.descriptor !== undefined) {
        return { value: bucket.base, unit: bucket.descriptor };
      }
      const preferred = preferredUnit(bucket);
      if (preferred === null) return { value: bucket.base, unit: null };
      const def = UNITS[preferred];
      if (!def || def.system === 'count') return { value: bucket.base, unit: preferred };
      return humanise(bucket.base, preferred);
    });

  if (unknown) out.push({ value: null, unit: null });
  return out;
}

/** The unit the inputs mostly used: most amounts, then most of the total, then first seen. */
function preferredUnit(bucket: Bucket): string | null {
  let best: string | null = null;
  let bestSeen: { times: number; base: number; order: number } | null = null;
  for (const [unit, seen] of bucket.used) {
    if (
      !bestSeen ||
      seen.times > bestSeen.times ||
      (seen.times === bestSeen.times && seen.base > bestSeen.base) ||
      (seen.times === bestSeen.times && seen.base === bestSeen.base && seen.order < bestSeen.order)
    ) {
      best = unit;
      bestSeen = seen;
    }
  }
  return best;
}

/*
 * The ladders a total is written on. `upAt` is where the number gets silly and the next
 * unit up reads better: 3 tsp is 1 Tbs, 8 Tbs is half a cup, 16 oz is a pound. Cups climb
 * only at 16, which is why 13 cups stays 13 cups rather than becoming 3 1/4 qt — a cook
 * buying stock thinks in cups until it is a gallon of the stuff.
 *
 * Families do not mix. 3 L is 3 L, not 12 2/3 cups; converting a metric recipe into cups
 * helps nobody and loses the precision that made it metric.
 */
const LADDERS: Record<string, { unit: string; upAt: number }[]> = {
  'volume:us': [
    { unit: 'tsp', upAt: 3 },
    { unit: 'Tbs', upAt: 8 },
    { unit: 'cup', upAt: 16 },
    { unit: 'qt', upAt: 4 },
    { unit: 'gal', upAt: Infinity },
  ],
  'volume:metric': [
    { unit: 'mL', upAt: 1000 },
    { unit: 'L', upAt: Infinity },
  ],
  'mass:us': [
    { unit: 'oz', upAt: 16 },
    { unit: 'lb', upAt: Infinity },
  ],
  'mass:metric': [
    { unit: 'g', upAt: 1000 },
    { unit: 'kg', upAt: Infinity },
  ],
};

/** Below a quarter of a unit, drop to the next unit down: 1/8 cup is really 2 Tbs. */
const STEP_DOWN = 0.25;

/**
 * A total in base units, written in a unit a cook would write it in.
 *
 * Starts at the unit the recipes used and moves only as far as it has to, so a list built
 * from cups says cups. Exported because a page that already knows its unit can call it
 * directly.
 */
export function humanise(base: number, preferred: string): Amount {
  const def = UNITS[preferred];
  if (!def || def.system === 'count' || !def.family) return { value: base, unit: preferred };

  const ladder = LADDERS[`${def.system}:${def.family}`];
  if (!ladder) return { value: base, unit: preferred };

  // Start at the rung at or just below the unit the recipes used ("pt" starts at "cup").
  let i = 0;
  for (let r = 0; r < ladder.length; r += 1) {
    if (UNITS[ladder[r].unit].per <= def.per + 1e-9) i = r;
  }

  const magnitude = Math.abs(base);
  while (i < ladder.length - 1 && magnitude / UNITS[ladder[i].unit].per >= ladder[i].upAt) i += 1;
  while (i > 0 && magnitude / UNITS[ladder[i].unit].per < STEP_DOWN) i -= 1;
  if (i > 0 && isSpoonThirds(magnitude, ladder[i].unit)) i -= 1;

  return { value: base / UNITS[ladder[i].unit].per, unit: ladder[i].unit };
}

/*
 * The one rung where the ladder makes a number nobody can measure.
 *
 * Every step in these ladders doubles or quadruples — 16 oz to the pound, 4 qt to the gallon,
 * 16 Tbs to the cup — except one: 3 tsp to the tablespoon. So thirds turn up at that rung and
 * nowhere else, and doubling a recipe that wanted 2 tsp of vanilla used to print "1 1/3 Tbs".
 * There is no third of a tablespoon in anybody's drawer; the thing being described is 4 tsp,
 * and there is a spoon for that.
 *
 * Only near the bottom of the rung, where the teaspoon is still a sensible way to say it. Past
 * a quarter cup of anything, "1 1/3 cups" is fine and "64 tsp" is not.
 */
const SPOONS_BEFORE_IT_IS_SILLY = 12;

function isSpoonThirds(base: number, unit: string): boolean {
  if (unit !== 'Tbs') return false;
  const spoons = base / UNITS.tsp.per;
  if (spoons >= SPOONS_BEFORE_IT_IS_SILLY) return false;
  // Whole and half tablespoons are 3 and 1.5 teaspoons; anything else between them is not one.
  const halves = spoons / 1.5;
  return Math.abs(halves - Math.round(halves)) > 1e-6;
}

/*
 * Cooks write fractions, so we write fractions: 3/4, not 0.75. Halves, thirds, quarters and
 * eighths are the ones that appear on a measuring cup; anything a long way from those is
 * printed as a decimal rather than rounded into a lie.
 */
const DENOMINATORS = [2, 3, 4, 8];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * The written number and the number it now says. Both, because "1.0546 cups" prints as
 * "1 cup" and the word has to agree with what is on the page, not with what is behind it.
 */
interface Shown {
  text: string;
  value: number;
}

/** Metric: as many decimals as the size of the number deserves, and no trailing zeros. */
function formatDecimal(value: number): Shown {
  const x = Math.abs(value);
  const places = x >= 100 ? 0 : x >= 10 ? 1 : 2;
  const rounded = Number(value.toFixed(places));
  return { text: String(rounded), value: rounded };
}

function formatNumber(value: number): Shown {
  if (!Number.isFinite(value)) return { text: '', value: 0 };
  const sign = value < 0 ? -1 : 1;
  const prefix = value < 0 ? '-' : '';
  let x = Math.abs(value);

  // A shop does not sell 12.9863 cups. Big numbers get coarse; small ones stay exact.
  if (x >= 10) x = Math.round(x * 2) / 2;
  else if (x >= 4) x = Math.round(x * 4) / 4;

  if (Math.abs(x - Math.round(x)) < 1e-9) {
    return { text: `${prefix}${Math.round(x)}`, value: sign * Math.round(x) };
  }

  let best: { n: number; d: number; err: number } | null = null;
  for (const d of DENOMINATORS) {
    const n = Math.round(x * d);
    if (n === 0) continue;
    const err = Math.abs(x - n / d);
    if (!best || err < best.err - 1e-12) best = { n, d, err };
  }
  /*
   * Snap to the fraction when it is close: within 5%, or — once there is at least a
   * quarter of a unit, which is the smallest thing on a measuring spoon — within half an
   * eighth of it, since that is the finest mark a cook could hit anyway. A number far from
   * any of those marks is printed as itself rather than rounded into a lie.
   */
  const tolerance = Math.max(0.05 * x, x >= 0.25 ? 1 / 16 : 0);
  if (!best || best.err > tolerance) {
    const rounded = Number(x.toFixed(2));
    return { text: `${prefix}${rounded}`, value: sign * rounded };
  }

  const shownValue = sign * (best.n / best.d);
  const whole = Math.floor(best.n / best.d);
  const rem = best.n - whole * best.d;
  if (rem === 0) return { text: `${prefix}${whole}`, value: shownValue };
  const g = gcd(rem, best.d);
  const fraction = `${rem / g}/${best.d / g}`;
  return { text: prefix + (whole ? `${whole} ${fraction}` : fraction), value: shownValue };
}

/**
 * "cups" only where a cook writes it out. Nobody writes "2 tsps" or "3 lbs" on a list.
 * A part of one stays singular, because that is how it is said: 3/4 cup, not 3/4 cups.
 */
function unitWord(unit: string, value: number): string {
  const def = UNITS[unit];
  if (!def || !def.plural) return unit;
  const size = Math.abs(value);
  return size > 0 && size <= 1 + 1e-9 ? unit : def.plural;
}

/**
 * "3 1/2 cups", "1 lb 4 oz", "2 cloves", "5 large", "13 cups".
 *
 * The ingredient's name is not in here — a shopping list writes "5 large" and "eggs" in
 * two different places. An amount with no number prints as "some", which is what we
 * honestly know.
 */
export function formatAmount(amount: Amount): string {
  if (!isUsable(amount)) return 'some';
  const value = amount.value as number;

  const canon = canonicalUnit(amount.unit);
  if (!canon) return formatNumber(value).text;

  const shown = humanise(value * canon.per, canon.unit);
  const unit = shown.unit as string;
  const shownValue = shown.value as number;

  // A butcher's scale says "1 lb 4 oz", and so does the label on the packet.
  if (unit === 'lb') {
    const pounds = Math.floor(shownValue);
    const ounces = Math.round((shownValue - pounds) * 16);
    if (pounds >= 1 && ounces > 0 && ounces < 16) return `${pounds} lb ${ounces} oz`;
    if (ounces === 16) return `${pounds + 1} lb`;
  }

  const number = UNITS[unit]?.decimal ? formatDecimal(shownValue) : formatNumber(shownValue);
  return `${number.text} ${unitWord(unit, number.value)}`.trim();
}

/** The whole line: "3 cups + 80 g". One recipe's worth or ten, added where they add. */
export function formatTotal(amounts: Amount[]): string {
  const combined = combine(amounts);
  if (combined.length === 0) return '';
  return combined.map(formatAmount).join(' + ');
}

/**
 * Does this ingredient name match one of the patterns in src/data/staples.json?
 *
 * A pattern matches when its words appear as consecutive words in the name, which is what
 * keeps "salt" off "unsalted butter" and lets "olive oil" catch "extra-virgin olive oil".
 * Substring matching would get both of those wrong, so the staples file points here rather
 * than leaving each caller to reinvent it.
 */
export function matchesStaple(name: string, patterns: readonly string[]): boolean {
  const words = name.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return patterns.some((pattern) => {
    const wanted = pattern.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    if (wanted.length === 0 || wanted.length > words.length) return false;
    for (let i = 0; i <= words.length - wanted.length; i += 1) {
      if (wanted.every((word, j) => words[i + j] === word)) return true;
    }
    return false;
  });
}
