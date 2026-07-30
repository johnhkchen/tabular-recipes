/*
 * A shopping list is not an ingredient list.
 *
 * An ingredient list says what goes in the pan: "1/2 cup finely chopped almonds", "melted
 * unsalted butter", "2 lb beef chuck, cut in 2-in cubes". A shopping list says what to pick
 * up: almonds, butter, beef chuck. Nobody sells melted butter, and nobody sells almonds
 * already chopped for you — you do that at home.
 *
 * So this does three things to each line:
 *   1. names it the way the shop names it,
 *   2. puts it where the shop keeps it,
 *   3. says whether you are buying a pack, opening one, or spending a spoonful of one.
 */
import aisles from '../data/aisles.json';
import { canonicalUnit, matchesStaple, type Amount } from './units.ts';

/* ---- 1. the name as it is sold -------------------------------------------- */

/*
 * Things you do at home, which no shop does for you. Stripping these is safe because the
 * result is still a product on a shelf.
 */
const HOME_PREP = [
  'finely chopped', 'roughly chopped', 'coarsely chopped', 'freshly grated', 'freshly ground',
  'thinly sliced', 'finely diced', 'finely minced', 'coarsely ground',
  'chopped', 'minced', 'diced', 'grated', 'mashed', 'crushed', 'cubed', 'halved',
  'quartered', 'pitted', 'seeded', 'stemmed', 'trimmed', 'beaten', 'whisked', 'sifted',
  'packed', 'rinsed', 'drained', 'torn', 'zested', 'juiced', 'peeled', 'shredded',
  'melted', 'softened', 'cooled', 'warmed', 'chilled', 'boiling', 'warm', 'cold', 'hot',
  'lukewarm', 'room-temperature', 'cooked', 'toasted', 'divided',
];

/*
 * …except where the shop DOES do it for you, and the word is part of the product. Sliced
 * almonds and shredded coconut are things on a shelf; a tin's label reads "whole peeled
 * tomatoes" and that is what you look for. These are matched whole and kept intact.
 */
const SOLD_THAT_WAY = [
  'sliced almonds', 'toasted sliced almonds', 'shredded coconut', 'sweetened shredded coconut',
  'unsweetened grated coconut', 'shredded sweetened coconut', 'desiccated coconut',
  'canned crushed tomatoes', 'canned diced tomatoes', 'crushed tomatoes', 'diced tomatoes',
  'whole peeled tomatoes', 'ground beef', 'ground pork', 'ground lamb', 'ground chicken',
  'ground turkey', 'crushed red pepper', 'rolled oats', 'steel-cut oats', 'cracked wheat',
  'smoked paprika', 'toasted sesame oil', 'sliced pork belly', 'grated Parmesan',
  'grated Parmigiano-Reggiano', 'grated Pecorino Romano',
  // The temperature words are the trap here: "hot sauce" is a bottle, not warm sauce.
  'hot sauce', 'hot dogs', 'cold cuts', 'cold brew', 'cooked ham', 'sliced bread',
  'chilli oil', 'chili oil', 'hot chocolate',
];

/* A spice is sold ground. "ground cumin" is the jar's name, not a thing you did. */
const GROUND_IS_THE_PRODUCT =
  /^ground (cumin|coriander|cinnamon|turmeric|ginger|cloves|cardamom|nutmeg|allspice|mace|fenugreek|mustard|white pepper|black pepper|cayenne|paprika|chile|chili|almonds|rice)/i;

const words = (text: string) => text.toLowerCase().split(/[\s,]+/).filter(Boolean);

/*
 * Accents are folded before matching, both sides. A shopper types "gruyere" and a recipe
 * writes "Gruyère"; a pattern list that had to carry both spellings of every word would be
 * wrong the first time someone wrote "linguiça".
 */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

const hasPhrase = (name: string, phrase: string): boolean =>
  matchesStaple(fold(name), [fold(phrase)]);

/**
 * The name a shop would put on the shelf edge.
 *
 * Never invents a product: it only removes words, and only ones that describe something
 * done in a kitchen rather than something bought.
 */
export function soldAs(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed) return trimmed;

  // Left alone: the preparation is how it is sold.
  if (SOLD_THAT_WAY.some((phrase) => hasPhrase(trimmed, phrase))) return trimmed;
  if (GROUND_IS_THE_PRODUCT.test(trimmed)) return trimmed;

  let out = trimmed;
  for (const phrase of HOME_PREP) {
    // Longest first, so "finely chopped" goes before "chopped" leaves "finely" behind.
    if (!hasPhrase(out, phrase)) continue;
    const pattern = new RegExp(`(^|\\s)${phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(\\s|$)`, 'gi');
    out = out.replace(pattern, '$1$2').replace(/\s+/g, ' ').trim();
  }

  // Everything was preparation ("melted butter" is fine, "chopped" alone is not a product).
  return out || trimmed;
}

/* Words that end in s and are not plurals. */
const NEVER_SINGULAR = new Set([
  'oats', 'grits', 'greens', 'molasses', 'couscous', 'hummus', 'asparagus', 'chives',
  'watercress', 'anise', 'cress', 'peas', 'gigantes', 'sprouts', 'olives', 'capers',
  'preserves', 'sardines', 'anchovies', 'clams', 'mussels', 'oysters', 'grapes',
]);

const singular = (word: string): string => {
  if (NEVER_SINGULAR.has(word) || word.length < 4) return word;
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes') || word.endsWith('shes') || word.endsWith('ches')) return word.slice(0, -2);
  if (word.endsWith('ss') || word.endsWith('us') || word.endsWith('is')) return word;
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
};

/**
 * The key two lines have to share to become one line. "yellow onion" and "yellow onions"
 * are one thing to buy; "egg" and "eggs" are one thing to buy.
 */
export function shoppingKey(name: string): string {
  return words(soldAs(name)).map(singular).join(' ');
}

/* ---- 2. where the shop keeps it ------------------------------------------- */

export interface Aisle {
  slug: string;
  name: string;
  note: string;
  patterns: string[];
  except?: string[];
}

export const AISLES: Aisle[] = aisles.aisles as Aisle[];

export const OTHER_AISLE = { slug: 'other', name: 'Anything else', note: 'ask someone' };

/** How specific a pattern is: more words beats fewer, then longer beats shorter. */
const specificity = (pattern: string) => words(pattern).length * 1000 + pattern.length;

/**
 * The most specific aisle that claims this name. Specificity is compared ACROSS aisles, not
 * within them, which is what keeps coconut milk out of the dairy case and sends it to the
 * tins where it actually lives.
 */
export function aisleFor(name: string): Aisle | typeof OTHER_AISLE {
  const sold = soldAs(name);
  let best: { aisle: Aisle; score: number } | null = null;

  for (const aisle of AISLES) {
    if (aisle.except && matchesStaple(sold, aisle.except)) continue;
    for (const pattern of aisle.patterns) {
      if (!hasPhrase(sold, pattern)) continue;
      const score = specificity(pattern);
      if (!best || score > best.score) best = { aisle, score };
    }
  }

  return best?.aisle ?? OTHER_AISLE;
}

/** Aisles in the order you would walk them, with only the ones in play. */
export function walkOrder(slugs: Iterable<string>): (Aisle | typeof OTHER_AISLE)[] {
  const present = new Set(slugs);
  const out: (Aisle | typeof OTHER_AISLE)[] = AISLES.filter((a) => present.has(a.slug));
  if (present.has(OTHER_AISLE.slug)) out.push(OTHER_AISLE);
  return out;
}

/* ---- 3. a pack, part of one, or a spoonful -------------------------------- */

interface PackSize {
  patterns: string[];
  pack: { value: number; unit: string };
  as: string;
}

const PACKS: PackSize[] = aisles.packs.sizes as PackSize[];

export type Scale = 'pack' | 'part' | 'smidge';

export interface Purchase {
  scale: Scale;
  /** How many packs it comes to, for the label. */
  packs: number;
  /** What the pack is, in words: "a 2 lb bag". */
  as: string;
}

const packFor = (sold: string): PackSize | null => {
  let best: { size: PackSize; score: number } | null = null;
  for (const size of PACKS) {
    for (const pattern of size.patterns) {
      if (!hasPhrase(sold, pattern)) continue;
      const score = specificity(pattern);
      if (!best || score > best.score) best = { size, score };
    }
  }
  return best?.size ?? null;
};

/**
 * Whether this line is a pack, part of a pack, or a spoonful of one.
 *
 * Returns null wherever an honest answer is not available: no pack size on file, no number
 * on the amount, or a unit that will not convert to the pack's. It never converts across
 * systems to force an answer — a cup of flour and a 2 lb bag are compared as volumes or not
 * at all, because turning one into the other needs a density we do not have.
 */
export function purchaseOf(sold: string, amounts: Amount[]): Purchase | null {
  const size = packFor(sold);
  if (!size) return null;

  const packUnit = canonicalUnit(size.pack.unit || null);
  const packBase = packUnit ? size.pack.value * packUnit.per : size.pack.value;
  const packSystem = packUnit?.system ?? 'count';
  if (!Number.isFinite(packBase) || packBase <= 0) return null;

  let total = 0;
  let comparable = false;
  let skipped = false;

  for (const amount of amounts) {
    // No number at all ("salt, to taste") tells us nothing either way, so it is not a gap.
    if (amount.value === null || !Number.isFinite(amount.value)) continue;
    const unit = canonicalUnit(amount.unit);
    // A bare number is a count; it only compares with a pack counted the same way.
    const system = unit?.system ?? 'count';
    if (system !== packSystem || (system === 'count' && (unit?.unit ?? '') !== (packUnit?.unit ?? ''))) {
      skipped = true;
      continue;
    }
    total += amount.value * (unit?.per ?? 1);
    comparable = true;
  }

  /*
   * A number we could not compare is not a number we can ignore. "3 Tbs + 4 oz butter"
   * against a pack measured in cups can only weigh the tablespoons, and answering from
   * those alone called half a block of butter a smidge. Say nothing instead.
   */
  if (!comparable || skipped || total <= 0) return null;

  const packs = total / packBase;
  const scale: Scale = packs >= 0.5 ? 'pack' : packs >= 0.08 ? 'part' : 'smidge';
  return { scale, packs, as: size.as };
}

export const SCALE_WORDS: Record<Scale, { label: string; hint: string }> = {
  pack: { label: 'a pack', hint: 'this uses most of one' },
  part: { label: 'part of a pack', hint: 'you will have plenty left' },
  smidge: { label: 'a smidge', hint: 'you may well have it already' },
};
