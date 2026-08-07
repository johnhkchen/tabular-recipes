/*
 * What a section list is allowed to do, and what it is not.
 *
 * The fixtures here are made up rather than read out of the collection, and that is the point:
 * the collection is clean, so a data-driven test could never reach the failure this file exists
 * to pin. A test that can only pass is not a test.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { menuFor, menus, principalIngredients } from './counters.ts';
import type { Counter } from './counters.ts';
import type { RawRecipe } from './tree.ts';

/** Only the fields menuFor and the menu page read. The other twenty are noise here. */
const recipe = (slug: string, counters: string[], category = 'Stews & Braises'): RawRecipe =>
  ({ slug, title: slug, category, counters, steps: [] }) as unknown as RawRecipe;

const shelf = (sections: { title: string; items: string[] }[]): Counter => ({
  name: 'Cha Chaan Teng',
  slug: 'cha-chaan-teng',
  blurb: 'Tea café.',
  categories: [],
  sections,
});

describe('menuFor, sectioned', () => {
  it('prints the sections in the order the counter gives them', () => {
    const all = [
      recipe('thick-toast', ['Cha Chaan Teng']),
      recipe('yuenyeung', ['Cha Chaan Teng']),
    ];
    const menu = menuFor(
      shelf([
        { title: 'The drinks counter', items: ['yuenyeung'] },
        { title: 'Toast and the bun case', items: ['thick-toast'] },
      ]),
      all,
    );

    // Not alphabetical and not biggest-first: a menu's order is part of what it says.
    expect(menu.sections.map((s) => s.title)).toEqual([
      'The drinks counter',
      'Toast and the bun case',
    ]);
    expect(menu.count).toBe(2);
  });

  it('throws, naming the slug, when a listed recipe does not name the counter', () => {
    const all = [
      recipe('thick-toast', ['Cha Chaan Teng']),
      recipe('pineapple-bun', ['Bakery', 'Dim Sum Counter']),
    ];
    const build = () =>
      menuFor(
        shelf([{ title: 'Toast and the bun case', items: ['thick-toast', 'pineapple-bun'] }]),
        all,
      );

    expect(build).toThrow(/pineapple-bun/);
    // The three things a person needs to find the mistake: which shelf, which heading, which dish.
    expect(build).toThrow(/Cha Chaan Teng/);
    expect(build).toThrow(/Toast and the bun case/);
  });

  it('says where the recipe actually is, so the reader knows which file to open', () => {
    const all = [recipe('orange-chicken', ['Takeout Counter'])];
    expect(() => menuFor(shelf([{ title: 'Rice plates', items: ['orange-chicken'] }]), all)).toThrow(
      /shelved at Takeout Counter/,
    );
  });

  it('names every offender in one throw rather than one per build', () => {
    const all = [
      recipe('pineapple-bun', ['Bakery']),
      recipe('club-sandwich', ['Diner', 'Deli']),
    ];
    expect(() =>
      menuFor(
        shelf([
          { title: 'Toast and the bun case', items: ['pineapple-bun'] },
          { title: 'Sandwiches and buns', items: ['club-sandwich'] },
        ]),
        all,
      ),
    ).toThrow(/lists 2 recipe\(s\)[\s\S]*pineapple-bun[\s\S]*club-sandwich/);
  });

  it('says so plainly when the slug is not a recipe at all', () => {
    expect(() => menuFor(shelf([{ title: 'Rice plates', items: ['no-such-dish'] }]), [])).toThrow(
      /no recipe has that slug/,
    );
  });

  it('sweeps a shelved recipe no section lists into Also, last', () => {
    const all = [
      recipe('thick-toast', ['Cha Chaan Teng']),
      recipe('horlicks', ['Cha Chaan Teng']),
    ];
    const menu = menuFor(shelf([{ title: 'Toast and the bun case', items: ['thick-toast'] }]), all);

    expect(menu.sections.map((s) => s.title)).toEqual(['Toast and the bun case', 'Also']);
    expect(menu.sections[1].items.map((r) => r.slug)).toEqual(['horlicks']);
  });

  it('drops a section the data left empty, and keeps the count honest', () => {
    const all = [recipe('thick-toast', ['Cha Chaan Teng'])];
    const menu = menuFor(
      shelf([
        { title: 'The set meals', items: [] },
        { title: 'Toast and the bun case', items: ['thick-toast'] },
      ]),
      all,
    );

    expect(menu.sections.map((s) => s.title)).toEqual(['Toast and the bun case']);
    // The number the page prints and the number of items it lists are one fact.
    expect(menu.count).toBe(1);
    expect(menu.sections.flatMap((s) => s.items)).toHaveLength(menu.count);
  });
});

describe('menuFor, no sections', () => {
  it('falls back to grouping by category, biggest group first', () => {
    const all = [
      recipe('a', ['Cha Chaan Teng'], 'Noodles'),
      recipe('b', ['Cha Chaan Teng'], 'Rice'),
      recipe('c', ['Cha Chaan Teng'], 'Noodles'),
      recipe('d', ['Bakery'], 'Noodles'),
    ];
    const menu = menuFor({ ...shelf([]), sections: undefined }, all);

    expect(menu.sections.map((s) => s.title)).toEqual(['Noodles', 'Rice']);
    expect(menu.count).toBe(3);
  });
});

describe('menus, over the real collection', () => {
  /*
   * The one case that reads the shipped data rather than a fixture, and it is the cheap half of
   * scripts/check-menus.mjs: every slug in src/data/counters.json has to resolve against the
   * recipes as written, and this says so before `astro build` gets that far.
   */
  const all = recipes as unknown as RawRecipe[];

  it('builds every counter without a listed slug going missing', () => {
    expect(() => menus(all)).not.toThrow();
  });

  it('gives every open counter a count that matches what it would print', () => {
    for (const menu of menus(all)) {
      expect(menu.sections.flatMap((s) => s.items)).toHaveLength(menu.count);
      expect(menu.count).toBeGreaterThan(0);
    }
  });
});

describe('principalIngredients', () => {
  it('skips the things nobody reads a menu to find out about', () => {
    const one = {
      steps: [
        { ingredients: [{ name: 'water' }, { name: 'Beef Shin' }, { name: 'salt' }] },
        { ingredients: [{ name: 'beef shin' }, { name: 'Star Anise' }] },
      ],
    } as unknown as RawRecipe;

    // Water and salt out, and the second mention of the shin is not a second ingredient.
    expect(principalIngredients(one)).toEqual(['Beef Shin', 'Star Anise']);
  });
});
