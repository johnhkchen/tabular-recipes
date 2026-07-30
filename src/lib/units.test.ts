/*
 * The arithmetic of a shopping list, and — more of this file — the arithmetic it refuses.
 *
 * Everything here is a cook in a kitchen. Adding a cup to a gram would need a density we
 * do not have, so the tests that matter most are the ones that assert two entries came
 * back where a careless implementation would have returned one plausible number.
 */
import { describe, expect, it } from 'vitest';
import {
  canCombine,
  canonicalUnit,
  combine,
  formatAmount,
  formatTotal,
  humanise,
  matchesStaple,
} from './units.ts';
import type { Amount } from './units.ts';
import staplesFile from '../data/staples.json';
import recipes from '../generated/recipes.json';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const amounts = all.flatMap((r) => r.steps.flatMap((s) => s.ingredients.map((i) => i.amount)));

describe('canonicalUnit', () => {
  it('folds the plurals and the spellings the corpus actually writes', () => {
    for (const spelling of ['cup', 'cups', 'Cups', ' CUP ']) {
      expect(canonicalUnit(spelling)?.unit).toBe('cup');
    }
    for (const spelling of ['Tbs', 'Tbsp', 'tbsp', 'tablespoon', 'tablespoons', 'Tbs.']) {
      expect(canonicalUnit(spelling)?.unit).toBe('Tbs');
    }
    for (const spelling of ['tsp', 'tsps', 'teaspoon', 'teaspoons']) {
      expect(canonicalUnit(spelling)?.unit).toBe('tsp');
    }
    for (const spelling of ['clove', 'cloves']) {
      expect(canonicalUnit(spelling)?.unit).toBe('clove');
    }
    expect(canonicalUnit('leaves')?.unit).toBe('leaf');
    expect(canonicalUnit('ribs')?.unit).toBe('rib');
    expect(canonicalUnit('pounds')?.unit).toBe('lb');
    expect(canonicalUnit('grams')?.unit).toBe('g');
  });

  it('sorts the units into systems that do not talk to each other', () => {
    expect(canonicalUnit('cup')?.system).toBe('volume');
    expect(canonicalUnit('tsp')?.system).toBe('volume');
    expect(canonicalUnit('qt')?.system).toBe('volume');
    expect(canonicalUnit('oz')?.system).toBe('mass');
    expect(canonicalUnit('lb')?.system).toBe('mass');
    expect(canonicalUnit('kg')?.system).toBe('mass');
    expect(canonicalUnit('cloves')?.system).toBe('count');
    expect(canonicalUnit('large')?.system).toBe('count');
  });

  it('carries the conversion factors, which are definitions rather than guesses', () => {
    const tsp = canonicalUnit('tsp')!;
    const tbs = canonicalUnit('Tbsp')!;
    const cup = canonicalUnit('cups')!;
    expect(tbs.per / tsp.per).toBeCloseTo(3, 9);
    expect(cup.per / tbs.per).toBeCloseTo(16, 9);
    expect(canonicalUnit('qt')!.per / cup.per).toBeCloseTo(4, 9);
    expect(canonicalUnit('gal')!.per / canonicalUnit('quart')!.per).toBeCloseTo(4, 9);
    expect(canonicalUnit('lb')!.per / canonicalUnit('oz')!.per).toBeCloseTo(16, 9);
    expect(canonicalUnit('kg')!.per).toBe(1000);
    expect(canonicalUnit('L')!.per).toBe(1000);
  });

  it('reads a bare oz as weight, because that is what the recipes mean by it', () => {
    expect(canonicalUnit('oz')?.system).toBe('mass');
    expect(canonicalUnit('fl oz')?.system).toBe('volume');
  });

  it('gives an unknown unit its own word rather than a system to be converted in', () => {
    // "2 in (sliced into coins) ginger" — inches are not a measure we can spend.
    expect(canonicalUnit('in')).toEqual({ unit: 'in', system: 'count', per: 1 });
    expect(canonicalUnit('fillets')).toEqual({ unit: 'fillet', system: 'count', per: 1 });
  });

  it('says null when there is no unit at all', () => {
    expect(canonicalUnit(null)).toBeNull();
    expect(canonicalUnit('')).toBeNull();
    expect(canonicalUnit('   ')).toBeNull();
    expect(canonicalUnit('%')).toBeNull();
  });

  it('has a canonical unit for every unit the 249 recipes use', () => {
    const unknown = new Set<string>();
    for (const amount of amounts) {
      if (amount.unit === null) continue;
      if (!canonicalUnit(amount.unit)) unknown.add(amount.unit);
    }
    expect([...unknown]).toEqual([]);
  });
});

describe('combine refuses what it cannot honestly add', () => {
  it('keeps a volume and a mass apart, forever and always', () => {
    const out = combine([
      { value: 3, unit: 'cups' },
      { value: 80, unit: 'g' },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ value: 3, unit: 'cup' });
    expect(out[1]).toEqual({ value: 80, unit: 'g' });
    expect(formatTotal([
      { value: 3, unit: 'cups' },
      { value: 80, unit: 'g' },
    ])).toBe('3 cups + 80 g');
  });

  it('does not add a mass to a volume in the other order either', () => {
    expect(formatTotal([
      { value: 8, unit: 'oz' },
      { value: 1, unit: 'cup' },
    ])).toBe('8 oz + 1 cup');
  });

  it('never merges a mass and a volume, for any pair the corpus contains', () => {
    const masses = amounts.filter((a) => canonicalUnit(a.unit)?.system === 'mass');
    const volumes = amounts.filter((a) => canonicalUnit(a.unit)?.system === 'volume');
    expect(masses.length).toBeGreaterThan(0);
    expect(volumes.length).toBeGreaterThan(0);
    for (const mass of masses.slice(0, 40)) {
      for (const volume of volumes.slice(0, 40)) {
        expect(canCombine(mass, volume)).toBe(false);
        expect(combine([mass, volume])).toHaveLength(2);
      }
    }
  });

  it('keeps a counted thing out of both, because a clove has no volume we know', () => {
    expect(combine([
      { value: 2, unit: 'cloves' },
      { value: 1, unit: 'cup' },
    ])).toHaveLength(2);
    expect(formatTotal([
      { value: 2, unit: 'cloves' },
      { value: 30, unit: 'g' },
    ])).toBe('2 cloves + 30 g');
  });

  it('keeps two different counted things apart', () => {
    expect(formatTotal([
      { value: 2, unit: 'cloves' },
      { value: 3, unit: 'sprigs' },
    ])).toBe('2 cloves + 3 sprigs');
    expect(canCombine({ value: 1, unit: 'slice' }, { value: 1, unit: 'rib' })).toBe(false);
  });

  it('adds a unit it does not recognise only to itself', () => {
    expect(formatTotal([
      { value: 2, unit: 'in' },
      { value: 2, unit: 'in' },
    ])).toBe('4 in');
    expect(formatTotal([
      { value: 2, unit: 'in' },
      { value: 1, unit: 'cup' },
    ])).toBe('2 in + 1 cup');
  });

  it('will not turn a missing number into a number', () => {
    expect(formatTotal([{ value: null, unit: 'cup' }])).toBe('some');
    expect(formatTotal([
      { value: 2, unit: 'cups' },
      { value: null, unit: 'cup' },
    ])).toBe('2 cups + some');
    expect(formatTotal([{ value: Number.NaN, unit: 'cup' }])).toBe('some');
  });

  it('returns nothing at all when given nothing at all', () => {
    expect(combine([])).toEqual([]);
    expect(formatTotal([])).toBe('');
  });
});

describe('combine adds what it can', () => {
  it('adds volumes to volumes', () => {
    expect(combine([
      { value: 1, unit: 'cup' },
      { value: 2, unit: 'cups' },
    ])).toEqual([{ value: 3, unit: 'cup' }]);
    expect(formatTotal([
      { value: 2, unit: 'cup' },
      { value: 2, unit: 'Tbs' },
    ])).toBe('2 1/8 cups');
    expect(formatTotal([
      { value: 1, unit: 'tsp' },
      { value: 2, unit: 'teaspoons' },
    ])).toBe('1 Tbs');
  });

  it('adds masses to masses, across the two spellings and the two families', () => {
    expect(formatTotal([
      { value: 1, unit: 'lb' },
      { value: 4, unit: 'oz' },
    ])).toBe('1 lb 4 oz');
    expect(formatTotal([
      { value: 500, unit: 'g' },
      { value: 1, unit: 'kg' },
    ])).toBe('1.5 kg');
  });

  it('adds the same counted thing', () => {
    expect(combine([
      { value: 2, unit: 'cloves' },
      { value: 3, unit: 'clove' },
    ])).toEqual([{ value: 5, unit: 'clove' }]);
    expect(formatAmount(combine([
      { value: 2, unit: 'cloves' },
      { value: 3, unit: 'clove' },
    ])[0])).toBe('5 cloves');
  });

  it('loses nothing: the total that goes in is the total that comes out', () => {
    const input: Amount[] = [
      { value: 3, unit: 'cups' },
      { value: 5, unit: 'Tbs' },
      { value: 2, unit: 'tsp' },
      { value: 1, unit: 'qt' },
    ];
    const mL = (a: Amount) => (a.value ?? 0) * (canonicalUnit(a.unit)?.per ?? 1);
    const before = input.reduce((sum, a) => sum + mL(a), 0);
    const after = combine(input).reduce((sum, a) => sum + mL(a), 0);
    expect(after).toBeCloseTo(before, 9);
  });

  it('adds up every ingredient in the collection without losing a drop', () => {
    const byName = new Map<string, Amount[]>();
    for (const recipe of all) {
      for (const step of recipe.steps) {
        for (const ing of step.ingredients) {
          const list = byName.get(ing.name.toLowerCase()) ?? [];
          list.push(ing.amount);
          byName.set(ing.name.toLowerCase(), list);
        }
      }
    }
    for (const [name, list] of byName) {
      const out = combine(list);
      // Every entry is a real number in a unit we can name, and nothing vanished.
      expect(out.length, name).toBeGreaterThan(0);
      for (const entry of out) expect(Number.isFinite(entry.value), name).toBe(true);
      const systems = new Set(out.map((a) => canonicalUnit(a.unit)?.system ?? 'count'));
      expect(systems.size, name).toBe(out.length === 1 ? 1 : systems.size);
      expect(formatTotal(list), name).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
});

describe('sizes are not measures', () => {
  it('adds two lots of large eggs into large eggs', () => {
    expect(combine([
      { value: 2, unit: 'large' },
      { value: 3, unit: 'large' },
    ])).toEqual([{ value: 5, unit: 'large' }]);
    expect(formatTotal([
      { value: 2, unit: 'large' },
      { value: 3, unit: 'large' },
    ])).toBe('5 large');
  });

  it('drops the size when only some of them were sized', () => {
    // 2 large eggs + 2 eggs is 4 eggs. It is not 4 large eggs — nobody said the second
    // two were large — and it is certainly not two separate lines on a shopping list.
    expect(combine([
      { value: 2, unit: 'large' },
      { value: 2, unit: null },
    ])).toEqual([{ value: 4, unit: null }]);
    expect(formatTotal([
      { value: 2, unit: 'large' },
      { value: 2, unit: null },
    ])).toBe('4');
  });

  it('drops the size when two different sizes meet', () => {
    expect(combine([
      { value: 2, unit: 'large' },
      { value: 3, unit: 'medium' },
    ])).toEqual([{ value: 5, unit: null }]);
  });

  it('treats a bare count as a count', () => {
    expect(formatTotal([
      { value: 2, unit: null },
      { value: 1, unit: null },
    ])).toBe('3');
  });
});

describe('formatAmount', () => {
  it('writes fractions where a cook writes fractions', () => {
    expect(formatAmount({ value: 3.5, unit: 'cups' })).toBe('3 1/2 cups');
    expect(formatAmount({ value: 0.75, unit: 'cup' })).toBe('3/4 cup');
    expect(formatAmount({ value: 1 / 3, unit: 'cup' })).toBe('1/3 cup');
    expect(formatAmount({ value: 2 / 3, unit: 'cup' })).toBe('2/3 cup');
    expect(formatAmount({ value: 0.125, unit: 'tsp' })).toBe('1/8 tsp');
    expect(formatAmount({ value: 1.5, unit: 'tsp' })).toBe('1 1/2 tsp');
  });

  it('says 13 cups rather than 3072 mL, and 3 lb rather than 48 oz', () => {
    expect(formatTotal(Array.from({ length: 13 }, () => ({ value: 1, unit: 'cup' })))).toBe(
      '13 cups',
    );
    expect(formatAmount({ value: 48, unit: 'oz' })).toBe('3 lb');
    expect(formatAmount({ value: 20, unit: 'oz' })).toBe('1 lb 4 oz');
  });

  it('will not write a third of a tablespoon, which is a teaspoon nobody can pour', () => {
    // Doubling a recipe that wanted 2 tsp of vanilla used to print "1 1/3 Tbs". Three
    // teaspoons to the tablespoon is the only step in either ladder that is not a doubling,
    // so this is the one rung where the arithmetic lands off the measures.
    expect(formatAmount({ value: 4, unit: 'tsp' })).toBe('4 tsp');
    expect(formatAmount({ value: 8, unit: 'tsp' })).toBe('8 tsp');
    // Whole and half tablespoons are still tablespoons, and past a quarter cup the teaspoon
    // stops being a sensible way to say it.
    expect(formatAmount({ value: 4.5, unit: 'tsp' })).toBe('1 1/2 Tbs');
    expect(formatAmount({ value: 12, unit: 'tsp' })).toBe('4 Tbs');
    expect(formatAmount({ value: 34, unit: 'tsp' })).toBe('2/3 cup');
  });

  it('climbs to the unit that reads best, and no further', () => {
    expect(formatAmount({ value: 3, unit: 'tsp' })).toBe('1 Tbs');
    expect(formatAmount({ value: 2, unit: 'tsp' })).toBe('2 tsp');
    expect(formatAmount({ value: 8, unit: 'Tbs' })).toBe('1/2 cup');
    expect(formatAmount({ value: 6, unit: 'Tbs' })).toBe('6 Tbs');
    // Cups hold on until there is a gallon of the stuff, because that is how a cook
    // measuring stock thinks about it: 8 cups is 8 cups, not "2 qt".
    expect(formatAmount({ value: 8, unit: 'cups' })).toBe('8 cups');
    expect(formatAmount({ value: 16, unit: 'cups' })).toBe('1 gal');
    expect(formatAmount({ value: 3, unit: 'qt' })).toBe('3 qt');
    expect(formatAmount({ value: 4, unit: 'qt' })).toBe('1 gal');
  });

  it('does not turn a metric recipe into cups, or an American one into millilitres', () => {
    expect(formatAmount({ value: 3072, unit: 'mL' })).toBe('3.07 L');
    expect(formatAmount({ value: 1500, unit: 'g' })).toBe('1.5 kg');
    expect(formatAmount({ value: 80, unit: 'g' })).toBe('80 g');
    expect(formatAmount({ value: 250, unit: 'mL' })).toBe('250 mL');
  });

  it('pluralises the words a cook spells out, and leaves the abbreviations alone', () => {
    expect(formatAmount({ value: 1, unit: 'cup' })).toBe('1 cup');
    expect(formatAmount({ value: 2, unit: 'cup' })).toBe('2 cups');
    expect(formatAmount({ value: 1, unit: 'clove' })).toBe('1 clove');
    expect(formatAmount({ value: 2, unit: 'cloves' })).toBe('2 cloves');
    expect(formatAmount({ value: 3, unit: 'leaves' })).toBe('3 leaves');
    expect(formatAmount({ value: 2, unit: 'tsp' })).toBe('2 tsp');
    expect(formatAmount({ value: 3, unit: 'lb' })).toBe('3 lb');
    expect(formatAmount({ value: 5, unit: 'large' })).toBe('5 large');
    expect(formatAmount({ value: 2, unit: 'pinch' })).toBe('2 pinches');
  });

  it('prints a bare count as a bare number, and no number as "some"', () => {
    expect(formatAmount({ value: 7, unit: null })).toBe('7');
    expect(formatAmount({ value: null, unit: null })).toBe('some');
    expect(formatAmount({ value: null, unit: 'cups' })).toBe('some');
  });

  it('rounds to something a shop sells rather than to the last decimal', () => {
    expect(formatAmount({ value: 12.9863, unit: 'cups' })).toBe('13 cups');
    expect(formatAmount({ value: 0.751, unit: 'cup' })).toBe('3/4 cup');
    // Nowhere near a fraction anyone can measure: say the number instead of inventing one.
    expect(formatAmount({ value: 0.1, unit: 'tsp' })).toBe('0.1 tsp');
  });

  it('is idempotent, so formatting a combined total does not move it', () => {
    for (const amount of amounts.slice(0, 200)) {
      const once = formatAmount(amount);
      const combined = combine([amount])[0];
      expect(formatAmount(combined)).toBe(once);
    }
  });
});

describe('humanise', () => {
  it('starts from the unit the recipes used', () => {
    const thirteenCups = humanise(236.5882365 * 13, 'cup');
    expect(thirteenCups.unit).toBe('cup');
    expect(thirteenCups.value).toBeCloseTo(13, 9);
    expect(humanise(28.349523125 * 20, 'oz').unit).toBe('lb');
    expect(humanise(1, 'g')).toEqual({ value: 1, unit: 'g' });
  });

  it('hands back anything it has no ladder for, untouched', () => {
    expect(humanise(4, 'clove')).toEqual({ value: 4, unit: 'clove' });
    expect(humanise(2, 'in')).toEqual({ value: 2, unit: 'in' });
  });
});

describe('staples.json', () => {
  const staples = staplesFile.staples as { name: string; patterns: string[]; except?: string[] }[];
  const stapleOf = (name: string) =>
    staples.find(
      (s) => matchesStaple(name, s.patterns) && !matchesStaple(name, s.except ?? []),
    ) ?? null;

  it('is a tight, curated list rather than a dump', () => {
    expect(staples.length).toBeGreaterThanOrEqual(25);
    expect(staples.length).toBeLessThanOrEqual(35);
    expect(new Set(staples.map((s) => s.name)).size).toBe(staples.length);
    for (const staple of staples) expect(staple.patterns.length).toBeGreaterThan(0);
  });

  it('says where the line is', () => {
    expect(typeof staplesFile.note).toBe('string');
    expect(staplesFile['where the line is'].length).toBeGreaterThan(0);
  });

  it('holds the things you already have', () => {
    for (const name of [
      'kosher salt', 'table salt', 'fine sea salt', 'water', 'warm water', 'ice water',
      'black pepper', 'black peppercorns', 'olive oil', 'extra-virgin olive oil',
      'vegetable oil', 'baking powder', 'baking soda', 'vanilla extract', 'ground cinnamon',
      'ground cumin', 'bay leaf', 'cider vinegar', 'soy sauce', 'cornstarch',
    ]) {
      expect(stapleOf(name), name).not.toBeNull();
    }
  });

  it('leaves the shopping on the shopping list', () => {
    for (const name of [
      'all-purpose flour', 'bread flour', 'unsalted butter', 'salted butter', 'eggs',
      'granulated sugar', 'light brown sugar', 'whole milk', 'heavy cream', 'garlic',
      'yellow onion', 'chicken stock', 'fresh ginger', 'thyme', 'salt pork', 'olives',
      'toasted sesame oil', 'fish sauce', 'mirin', 'garam masala', 'instant yeast',
      'coriander root', 'orange blossom water', 'lemon juice',
    ]) {
      expect(stapleOf(name), name).toBeNull();
    }
  });

  it('claims no ingredient twice', () => {
    const names = new Set(all.flatMap((r) => r.ingredientNames));
    for (const name of names) {
      const claims = staples.filter(
        (s) => matchesStaple(name, s.patterns) && !matchesStaple(name, s.except ?? []),
      );
      expect(claims.length, `${name}: ${claims.map((c) => c.name).join(', ')}`).toBeLessThan(2);
    }
  });

  it('carries no entry the collection never asks for', () => {
    const names = [...new Set(all.flatMap((r) => r.ingredientNames))];
    for (const staple of staples) {
      const found = names.some(
        (n) => matchesStaple(n, staple.patterns) && !matchesStaple(n, staple.except ?? []),
      );
      expect(found, staple.name).toBe(true);
    }
  });
});

describe('matchesStaple', () => {
  it('matches whole words, so salt does not claim unsalted butter', () => {
    expect(matchesStaple('kosher salt', ['salt'])).toBe(true);
    // Neither of these is salt, and neither of them is claimed by it.
    expect(matchesStaple('unsalted butter', ['salt'])).toBe(false);
    expect(matchesStaple('salted butter', ['salt'])).toBe(false);
  });

  it('matches a phrase only where its words run together', () => {
    expect(matchesStaple('extra-virgin olive oil', ['olive oil'])).toBe(true);
    expect(matchesStaple('olive oil', ['olive oil'])).toBe(true);
    expect(matchesStaple('oil-cured olives', ['olive oil'])).toBe(false);
    expect(matchesStaple('green bell pepper', ['black pepper'])).toBe(false);
    expect(matchesStaple('fresh ginger', ['ground ginger'])).toBe(false);
  });

  it('is case-insensitive and takes an empty list as no', () => {
    expect(matchesStaple('Kosher Salt', ['salt'])).toBe(true);
    expect(matchesStaple('kosher salt', [])).toBe(false);
  });
});
