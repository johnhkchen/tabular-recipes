/*
 * The station reading is a reading of English, so these tests are mostly named real files: the
 * value of a test here is that it names the sentence that would break the rule.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import {
  celsiusIn,
  OVEN_TOLERANCE_C,
  type Occupancy,
  readStations,
  temperaturesAgree,
} from './stations.ts';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const real = (slug: string): RawRecipe => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return recipe;
};

/** Every reading a file produces, so a test can say "this file uses no burner" in one line. */
const stationsOf = (slug: string): Occupancy[] => [...readStations(real(slug)).values()];

describe('celsiusIn', () => {
  it('reads Fahrenheit and Celsius to the same answer', () => {
    expect(celsiusIn('roast 400°F (205°C) 45 min')).toEqual([204, 205]);
  });

  it('leaves the numbers in a recipe that are not oven temperatures alone', () => {
    // A meat thermometer, a proving cupboard, a percentage, a tin size.
    expect(celsiusIn('pull it at 165°F')).toEqual([]);
    expect(celsiusIn('prove at 26°C')).toEqual([]);
    expect(celsiusIn('salt at 2%')).toEqual([]);
    expect(celsiusIn('a 9x13-in pan')).toEqual([]);
  });
});

describe('temperaturesAgree', () => {
  it('lets two dishes a cook would split the difference on share the oven', () => {
    expect(temperaturesAgree(175, 190)).toBe(true);
    expect(OVEN_TOLERANCE_C).toBe(15);
  });

  it('refuses 180 and 230, which is the case the whole constant exists for', () => {
    expect(temperaturesAgree(180, 230)).toBe(false);
  });

  it('treats a temperature nobody said as agreeing with everything', () => {
    expect(temperaturesAgree(null, 230)).toBe(true);
    expect(temperaturesAgree(230, null)).toBe(true);
    expect(temperaturesAgree(null, null)).toBe(true);
  });
});

describe('the oven', () => {
  it('finds it in a file whose cookware names nothing at all', () => {
    // baked-turkey-wings: `cookware` is [], and it roasts for 45 min then braises for 90.
    expect(real('baked-turkey-wings').cookware).toEqual([]);
    const stations = readStations(real('baked-turkey-wings'));
    expect(stations.get(2)).toEqual({ station: 'oven', celsius: 204, temperatureSource: 'step' });
    expect(stations.get(3)).toEqual({ station: 'oven', celsius: 163, temperatureSource: 'step' });
  });

  it('reads the temperature off the step that says it', () => {
    const stations = readStations(real('crispy-roast-potatoes'));
    expect(stations.get(3)).toEqual({ station: 'oven', celsius: 218, temperatureSource: 'step' });
  });

  it('does not call a pan of oil an oven, whatever its temperature', () => {
    // The three shapes: a deep-fry at 350°F, a fry "at 300°F", and a griddle at 375°F.
    for (const slug of ['crab-rangoon', 'samosa', 'buttermilk-pancakes']) {
      const ovens = stationsOf(slug).filter((o) => o.station === 'oven');
      expect(`${slug}: ${ovens.length}`).toBe(`${slug}: 0`);
    }
  });

  it('does not call an air fryer an oven, even when the file says "roast"', () => {
    // air-fryer-sweet-potatoes step 2: "roast in the basket 200°C (400°F), 15–18 min, one layer".
    expect(stationsOf('air-fryer-sweet-potatoes')).toEqual([]);
  });

  it('does not call a Dutch oven an oven', () => {
    const chili = real('chili-con-carne');
    expect(chili.cookware).toContain('Dutch oven');
    expect(stationsOf('chili-con-carne').filter((o) => o.station === 'oven')).toEqual([]);
  });
});

describe('the hob', () => {
  it('counts a burner in a file that names no pan', () => {
    // mashed-potatoes names only a ricer and plainly simmers for twenty minutes. Erring towards a
    // busier afternoon is schedule.ts's own convention and this is where it applies.
    expect(real('mashed-potatoes').cookware).toEqual(['ricer']);
    expect(readStations(real('mashed-potatoes')).get(0)).toEqual({
      station: 'hob',
      celsius: null,
      temperatureSource: 'none',
    });
  });

  it('does not put a burner under a recipe whose only vessel is its own box', () => {
    const potted = all.filter(
      (r) => r.cookware.length > 0 && r.cookware.every((c) => /instant pot|slow cooker/i.test(c)),
    );
    expect(potted.length).toBeGreaterThan(0);
    for (const recipe of potted) {
      const hobs = [...readStations(recipe).values()].filter((o) => o.station === 'hob');
      expect(`${recipe.slug}: ${hobs.length}`).toBe(`${recipe.slug}: 0`);
    }
  });
});

describe('across the collection', () => {
  it('never reports a temperature outside the oven band', () => {
    const wild: string[] = [];
    for (const recipe of all) {
      for (const [index, occupancy] of readStations(recipe)) {
        if (occupancy.celsius === null) continue;
        if (occupancy.celsius < 90 || occupancy.celsius > 320) {
          wild.push(`${recipe.slug}#${index}=${occupancy.celsius}`);
        }
      }
    }
    expect(wild).toEqual([]);
  });

  it('never gives a temperature to a burner', () => {
    const wrong: string[] = [];
    for (const recipe of all) {
      for (const [index, occupancy] of readStations(recipe)) {
        if (occupancy.station === 'hob' && occupancy.celsius !== null) {
          wrong.push(`${recipe.slug}#${index}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });

  it('only ever reads an operation step, because only those become tasks', () => {
    const stray: string[] = [];
    for (const recipe of all) {
      const operations = new Set(
        recipe.steps
          .filter((step) => step.ingredients.length > 0 || step.refs.length > 0)
          .map((step) => step.index),
      );
      for (const index of readStations(recipe).keys()) {
        if (!operations.has(index)) stray.push(`${recipe.slug}#${index}`);
      }
    }
    expect(stray).toEqual([]);
  });

  it('still finds the oven in more files than `cookware` alone would', () => {
    // The measurement in the file header, kept live: cookware misses about a third of it, so a
    // future gate on cookware would fail here rather than quietly halving the finding.
    const byText = all.filter((r) =>
      [...readStations(r).values()].some((o) => o.station === 'oven'),
    );
    const byCookware = all.filter((r) =>
      r.cookware.some((c) => /\boven\b/i.test(c) && !/dutch/i.test(c)),
    );
    expect(byText.length).toBeGreaterThan(byCookware.length * 1.3);
  });
});
