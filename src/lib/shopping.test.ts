import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import type { RawRecipe } from './tree.ts';
import { aisleFor, purchaseOf, shoppingKey, soldAs, walkOrder } from './shopping.ts';

const all = recipes as unknown as RawRecipe[];

const everyIngredient = () => {
  const counts = new Map<string, number>();
  for (const recipe of all) {
    for (const step of recipe.steps) {
      for (const ingredient of step.ingredients) {
        counts.set(ingredient.name, (counts.get(ingredient.name) ?? 0) + 1);
      }
    }
  }
  return counts;
};

describe('the name as it is sold', () => {
  it('takes off what you do at home', () => {
    expect(soldAs('melted unsalted butter')).toBe('unsalted butter');
    expect(soldAs('softened unsalted butter')).toBe('unsalted butter');
    expect(soldAs('finely chopped almonds')).toBe('almonds');
    expect(soldAs('chopped pitted dates')).toBe('dates');
    expect(soldAs('freshly grated nutmeg')).toBe('nutmeg');
    expect(soldAs('grated carrots')).toBe('carrots');
    expect(soldAs('beaten egg')).toBe('egg');
    expect(soldAs('warm whole milk')).toBe('whole milk');
    expect(soldAs('boiling water')).toBe('water');
    expect(soldAs('cold unsalted butter')).toBe('unsalted butter');
  });

  it('leaves alone what the shop already did', () => {
    // These are products on a shelf, not a job you were given.
    expect(soldAs('sliced almonds')).toBe('sliced almonds');
    expect(soldAs('shredded coconut')).toBe('shredded coconut');
    expect(soldAs('whole peeled tomatoes')).toBe('whole peeled tomatoes');
    expect(soldAs('crushed tomatoes')).toBe('crushed tomatoes');
    expect(soldAs('ground beef')).toBe('ground beef');
    expect(soldAs('ground cumin')).toBe('ground cumin');
    expect(soldAs('smoked paprika')).toBe('smoked paprika');
  });

  it('never strips a name down to nothing', () => {
    expect(soldAs('melted butter')).toBe('butter');
    expect(soldAs('chopped')).toBe('chopped');
    expect(soldAs('  ')).toBe('');
  });

  it('folds a plural into the thing you buy', () => {
    expect(shoppingKey('yellow onions')).toBe(shoppingKey('yellow onion'));
    expect(shoppingKey('eggs')).toBe(shoppingKey('egg'));
    expect(shoppingKey('melted unsalted butter')).toBe(shoppingKey('unsalted butter'));
    // …but not a word that merely ends in s.
    expect(shoppingKey('rolled oats')).toBe('rolled oats');
    expect(shoppingKey('molasses')).toBe('molasses');
  });
});

describe('where the shop keeps it', () => {
  it('sends things to the counter they are cut at', () => {
    expect(aisleFor('beef chuck').slug).toBe('butcher');
    expect(aisleFor('pork shoulder').slug).toBe('butcher');
    expect(aisleFor('littleneck clams').slug).toBe('fishmonger');
    expect(aisleFor('grated Parmesan').slug).toBe('cheese');
    expect(aisleFor('heavy cream').slug).toBe('dairy');
    expect(aisleFor('yellow onion').slug).toBe('produce');
  });

  it('lets the more specific name win across aisles', () => {
    // "milk" is dairy and "coconut" is dry goods, but coconut milk is a tin.
    expect(aisleFor('coconut milk').slug).toBe('tins');
    expect(aisleFor('coconut oil').slug).toBe('oils');
    expect(aisleFor('chicken stock').slug).toBe('tins');
    expect(aisleFor('chicken thighs').slug).toBe('butcher');
    expect(aisleFor('fish sauce').slug).toBe('world');
    expect(aisleFor('dried oregano').slug).toBe('spices');
    expect(aisleFor('flat-leaf parsley').slug).toBe('produce');
    expect(aisleFor('crushed tomatoes').slug).toBe('tins');
  });

  it('walks the aisles in shop order, skipping the empty ones', () => {
    const order = walkOrder(['spices', 'produce', 'butcher']).map((a) => a.slug);
    expect(order).toEqual(['produce', 'butcher', 'spices']);
  });
});

describe('a pack, part of one, or a spoonful', () => {
  it('reads the amount against what a shop sells', () => {
    expect(purchaseOf('all-purpose flour', [{ value: 6, unit: 'cup' }])?.scale).toBe('pack');
    expect(purchaseOf('all-purpose flour', [{ value: 2, unit: 'cup' }])?.scale).toBe('part');
    expect(purchaseOf('all-purpose flour', [{ value: 2, unit: 'Tbs' }])?.scale).toBe('smidge');
    expect(purchaseOf('instant yeast', [{ value: 2.25, unit: 'tsp' }])?.scale).toBe('pack');
    expect(purchaseOf('ground cumin', [{ value: 1, unit: 'tsp' }])?.scale).toBe('smidge');
  });

  it('adds several helpings together before deciding', () => {
    const once = purchaseOf('unsalted butter', [{ value: 4, unit: 'Tbs' }]);
    const thrice = purchaseOf('unsalted butter', [
      { value: 4, unit: 'Tbs' },
      { value: 4, unit: 'Tbs' },
      { value: 1, unit: 'cup' },
    ]);
    expect(once?.scale).toBe('part');
    expect(thrice?.scale).toBe('pack');
  });

  it('says nothing rather than guessing', () => {
    // No pack on file for it.
    expect(purchaseOf('lemongrass', [{ value: 2, unit: 'stalk' }])).toBeNull();
    // No number to compare.
    expect(purchaseOf('all-purpose flour', [{ value: null, unit: null }])).toBeNull();
    /*
     * A cup of flour and a 2 lb bag are compared as volumes or not at all — turning grams
     * into cups needs a density we do not have, and inventing one to fill in a badge is
     * exactly the kind of quiet lie this whole file exists to avoid.
     */
    expect(purchaseOf('all-purpose flour', [{ value: 500, unit: 'g' }])).toBeNull();
  });

  it('will not judge a line it could only half measure', () => {
    /*
     * Butter's pack is in cups, so "3 Tbs + 4 oz" can only weigh the tablespoons — and
     * answering from those alone called half a block of butter a smidge.
     */
    expect(
      purchaseOf('unsalted butter', [
        { value: 3, unit: 'Tbs' },
        { value: 4, unit: 'oz' },
      ]),
    ).toBeNull();
    // An amount with no number at all is not a gap: it says nothing either way.
    expect(
      purchaseOf('unsalted butter', [
        { value: 4, unit: 'Tbs' },
        { value: null, unit: null },
      ])?.scale,
    ).toBe('part');
  });
});

describe('the whole collection', () => {
  const counts = everyIngredient();

  it('finds an aisle for nearly everything, and reports what is left', () => {
    const unplaced = [...counts.entries()]
      .filter(([name]) => aisleFor(name).slug === 'other')
      .sort((a, b) => b[1] - a[1]);

    /*
     * Water is the one thing that SHOULD fall through: no shop sells it, and every one of
     * its seven spellings here folds to the same line, which the staples file then lifts
     * off the buying list entirely.
     */
    const real = unplaced.filter(([name]) => !/\bwater\b/i.test(name));
    if (real.length) {
      console.log(
        `\n${real.length}/${counts.size} ingredients have no aisle:\n  ` +
          real.slice(0, 40).map(([name, n]) => `${name} (${n})`).join(', '),
      );
    }
    expect(real.length / counts.size).toBeLessThan(0.02);
  });

  it('never lets a temperature word eat a product name', () => {
    // "hot" is something you do to food and also the first word of a bottle on a shelf.
    expect(soldAs('hot sauce')).toBe('hot sauce');
    expect(aisleFor('hot sauce').slug).toBe('world');
    expect(soldAs('hot water')).toBe('water');
  });

  it('never turns a name into an empty string', () => {
    const empty = [...counts.keys()].filter((name) => !soldAs(name).trim());
    expect(empty).toEqual([]);
  });
});
