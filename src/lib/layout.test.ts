import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { cleanLabel } from './label.ts';
import { findTilingErrors, layout, type Grid } from './layout.ts';
import { buildTree, type RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const grid = (slug: string): Grid => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return layout(buildTree(recipe));
};

const pick = (g: Grid, kind: 'op' | 'blank' | 'ingredient') =>
  g.rows.flat().filter((c) => c.kind === kind)
    .map((c) => ({ row: c.row, col: c.col, rowSpan: c.rowSpan, colSpan: c.colSpan, text: c.text }));

describe('cleanLabel', () => {
  it('keeps the verb and drops what the ingredients left behind', () => {
    expect(cleanLabel('Melt .')).toBe('melt');
    expect(cleanLabel('Mix  with , , and .')).toBe('mix');
    expect(cleanLabel('Fold in , , , and to .')).toBe('fold in');
  });

  it('keeps temperatures and times, which the cook actually needs', () => {
    expect(cleanLabel('Bake  at 350°F for 30 min.')).toBe('bake at 350°F for 30 min');
  });

  it('leaves a full sentence alone', () => {
    expect(cleanLabel('Preheat the oven to 350°F (170°C).')).toBe('preheat the oven to 350°F (170°C)');
  });
});

describe('the espresso brownies table', () => {
  const g = grid('espresso-brownies');

  it('is nine ingredient rows and six columns', () => {
    expect(g.rowCount).toBe(9);
    expect(g.colCount).toBe(6);
  });

  it('puts the prep steps in full-width rows above the table', () => {
    expect(g.headers).toEqual([
      'Butter and flour an 8x8-in pan',
      'Preheat the oven to 350°F (170°C)',
    ]);
    expect(g.footers).toEqual([]);
  });

  it('orders ingredients so the long chain of operations rides along the top', () => {
    expect(pick(g, 'ingredient').map((c) => c.text)).toEqual([
      '4 oz (115 g) unsalted butter',
      '1 cup (200 g) sugar',
      '1/4 tsp (2.5 mL) vanilla extract',
      '4 Tbs (60 mL; or very strong coffee) fresh brewed espresso',
      '2 large (100 g) eggs',
      '1/2 cup (80 g) all-purpose flour',
      "1/3 cup (80 g) Hershey's cocoa powder",
      '1/4 tsp (1.3 g) baking soda',
      '1/4 tsp (1.5 g) table salt',
    ]);
  });

  // The staircase, read straight off the reference image.
  it('spans each operation over exactly the ingredients feeding it', () => {
    expect(pick(g, 'op')).toEqual([
      { row: 0, col: 2, rowSpan: 1, colSpan: 1, text: 'melt' },
      { row: 0, col: 3, rowSpan: 4, colSpan: 1, text: 'mix' },
      { row: 0, col: 4, rowSpan: 5, colSpan: 1, text: 'mix' },
      { row: 0, col: 5, rowSpan: 9, colSpan: 1, text: 'fold in' },
      { row: 0, col: 6, rowSpan: 9, colSpan: 1, text: 'bake 350°F (170°C) 30 to 40 min' },
    ]);
  });

  it('merges the columns a late ingredient skips into one blank cell', () => {
    expect(pick(g, 'blank')).toEqual([
      { row: 1, col: 2, rowSpan: 3, colSpan: 1, text: '' }, // sugar, vanilla, espresso
      { row: 4, col: 2, rowSpan: 1, colSpan: 2, text: '' }, // eggs
      { row: 5, col: 2, rowSpan: 4, colSpan: 3, text: '' }, // flour, cocoa, soda, salt
    ]);
  });
});

describe('every recipe', () => {
  for (const recipe of all) {
    it(`${recipe.slug} tiles the table with no holes or overlaps`, () => {
      expect(findTilingErrors(layout(buildTree(recipe)))).toEqual([]);
    });
  }
});
