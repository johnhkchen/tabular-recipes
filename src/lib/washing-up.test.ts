import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import type { RawRecipe } from './tree.ts';
import {
  NEVER_WASHED,
  pluralEntries,
  readWashingUp,
  unaccountedCookware,
  washingUpWord,
} from './washing-up.ts';

describe('readWashingUp', () => {
  /*
   * The four lines below are the ones actually written into recipes by this ticket, so the
   * number each produces here is the number the page shows. This is the derivation: nothing
   * else in the codebase computes a count, and nothing an author writes states one.
   */
  it('derives the count from the list, and keeps the words as they were written', () => {
    expect(
      readWashingUp(
        'the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze',
      ),
    ).toEqual({
      washingUp: {
        items: [
          'the wok',
          'a bowl to velvet in',
          'a dish to dredge in',
          'a rack to drain on',
          'a bowl for the glaze',
        ],
        count: 5,
      },
      problem: null,
    });

    expect(
      readWashingUp('the Instant Pot, a skillet for the spices, a fine sieve, the spice sachet')
        .washingUp,
    ).toEqual({
      items: ['the Instant Pot', 'a skillet for the spices', 'a fine sieve', 'the spice sachet'],
      count: 4,
    });

    expect(readWashingUp('the Dutch oven').washingUp).toEqual({
      items: ['the Dutch oven'],
      count: 1,
    });
  });

  it('does not mind how the line was typed', () => {
    expect(readWashingUp('  the wok ,  a rack to drain on  ').washingUp).toEqual({
      items: ['the wok', 'a rack to drain on'],
      count: 2,
    });
  });

  it('reads a recipe that washes nothing, and that is not the same as saying nothing', () => {
    for (const line of ['nothing', 'None', '  NOTHING  ', 'nothing.', 'none']) {
      const { washingUp, problem } = readWashingUp(line);
      expect(problem, line).toBeNull();
      expect(washingUp, line).toEqual({ items: [], count: 0 });
      // The whole point: zero is a value, and a value is not null.
      expect(washingUp, line).not.toBeNull();
    }
  });

  it('says nothing at all when the recipe never declared one', () => {
    for (const absent of [undefined, null]) {
      expect(readWashingUp(absent)).toEqual({ washingUp: null, problem: null });
    }
  });

  it('refuses a line that is there but empty, rather than reading it as nothing', () => {
    for (const line of ['', '   ', ',', ' , , ']) {
      const { washingUp, problem } = readWashingUp(line);
      expect(washingUp, line).toBeNull();
      expect(problem, line).toContain('says nothing');
      // The fix is one word, so the message has to carry it.
      expect(problem, line).toContain('nothing');
    }
  });

  it('refuses a number where the things go, and says what a good line looks like', () => {
    for (const line of ['2', '5 things', '3, 2', 'the wok, 2']) {
      const { washingUp, problem } = readWashingUp(line);
      expect(washingUp, line).toBeNull();
      expect(problem, line).toContain('number');
      expect(problem, line).toContain('>> washing-up:');
    }
  });

  it('refuses "nothing" used as one entry among several, because that is a typo', () => {
    const { washingUp, problem } = readWashingUp('the jar, nothing');
    expect(washingUp).toBeNull();
    expect(problem).toContain('whole line');
  });
});

describe('washingUpWord', () => {
  it('prints the derived count as a cook would say it', () => {
    expect(washingUpWord(0)).toBe('Nothing to wash');
    expect(washingUpWord(1)).toBe('One thing');
    expect(washingUpWord(5)).toBe('Five things');
    expect(washingUpWord(12)).toBe('Twelve things');
    expect(washingUpWord(13)).toBe('13 things');
  });
});

describe('unaccountedCookware', () => {
  const list = (line: string) => readWashingUp(line).washingUp;

  it('names the cookware a file declares and its washing-up line forgets', () => {
    expect(unaccountedCookware(['Dutch oven', 'skillet'], list('the Dutch oven'))).toEqual([
      'skillet',
    ]);
  });

  it('leaves the things that are never washed out of it', () => {
    expect(unaccountedCookware([...NEVER_WASHED], list('the Dutch oven'))).toEqual([]);
  });

  it('does not excuse a Dutch oven for ending in the word oven', () => {
    expect(unaccountedCookware(['Dutch oven'], list('a chopping board'))).toEqual(['Dutch oven']);
  });

  it('matches the way a person writes, not the way a parser does', () => {
    expect(
      unaccountedCookware(
        ['Dutch oven', 'fine-mesh sieve', 'Instant Pot'],
        list('the Dutch oven, scraped clean, a fine mesh sieve, the Instant Pot'),
      ),
    ).toEqual([]);
    // The other direction too: a #skillet{} is accounted for by the pan a cook names.
    expect(unaccountedCookware(['skillet'], list('the cast-iron skillet'))).toEqual([]);
  });

  it('says nothing about a recipe that never declared a line', () => {
    expect(unaccountedCookware(['Dutch oven', 'skillet'], null)).toEqual([]);
  });

  it('flags every named vessel when the recipe says it washes nothing', () => {
    expect(unaccountedCookware(['Dutch oven'], list('nothing'))).toEqual(['Dutch oven']);
  });
});

describe('pluralEntries', () => {
  const list = (line: string) => readWashingUp(line).washingUp;

  it('flags an entry that counts as one thing and means several', () => {
    expect(pluralEntries(list('the wok, two mixing bowls'))).toEqual(['two mixing bowls']);
    expect(pluralEntries(list('3 sheet pans'))).toEqual(['3 sheet pans']);
  });

  it('leaves a number that is part of the thing alone', () => {
    expect(pluralEntries(list('a bowl for two eggs, one mixing bowl, the 9x13-in pan'))).toEqual([]);
  });

  it('says nothing about a recipe that never declared a line', () => {
    expect(pluralEntries(null)).toEqual([]);
  });
});

/*
 * The render is one guard over one value — `{washingUp && …}` in Timeline.astro — so these are
 * what stand behind it, exactly as the slack tests stand behind theirs. A recipe is whole, or
 * it washes nothing, or it never said; there is no fourth state for the component to draw an
 * empty slot out of.
 */
describe('washing-up across the collection', () => {
  const all = recipes as unknown as RawRecipe[];
  const declared = all.filter((recipe) => recipe.washingUp !== null);

  it('derives every count from the list it was written from', () => {
    // The invariant the whole field rests on, asserted over real files rather than fixtures:
    // no author writes a number, so no number can disagree with its list.
    const disagreeing = declared
      .filter((recipe) => recipe.washingUp!.count !== recipe.washingUp!.items.length)
      .map((r) => `${r.slug}: ${r.washingUp!.count} vs ${r.washingUp!.items.length}`);
    expect(disagreeing).toEqual([]);
  });

  it('leaves every declared line whole, never half-declared', () => {
    const halfway = declared
      .filter((recipe) => recipe.washingUp!.items.some((item) => !item.trim()))
      .map((recipe) => recipe.slug);
    expect(halfway).toEqual([]);
  });

  it('renders nothing for a recipe that never declared one', () => {
    // Nothing to draw is the common case: 650-odd files predate the field.
    const undeclared = all.filter((recipe) => recipe.washingUp === null);
    expect(undeclared.length).toBeGreaterThan(0);
    for (const recipe of undeclared) expect(recipe.washingUp, recipe.slug).toBeNull();
  });

  it('tells a recipe that washes nothing apart from one that never said', () => {
    const nothing = declared.filter((recipe) => recipe.washingUp!.count === 0);
    expect(nothing.length).toBeGreaterThan(0);
    for (const recipe of nothing) {
      expect(recipe.washingUp, recipe.slug).not.toBeNull();
      expect(recipe.washingUp!.items, recipe.slug).toEqual([]);
    }
  });

  it('re-reads every declared line without a complaint', () => {
    const problems = declared
      .map((recipe) => ({
        slug: recipe.slug,
        problem: readWashingUp(recipe.washingUp!.items.join(', ') || 'nothing').problem,
      }))
      .filter((entry) => entry.problem)
      .map((entry) => `${entry.slug}: ${entry.problem}`);
    expect(problems).toEqual([]);
  });

  it('has worked examples a later ticket can copy, at both ends of the range', () => {
    expect(declared.length).toBeGreaterThanOrEqual(8);
    expect(declared.some((recipe) => recipe.washingUp!.count === 0)).toBe(true);
    expect(declared.some((recipe) => recipe.washingUp!.count === 1)).toBe(true);
    // The four wok recipes are the reason this field exists: one #wok{}, five things to wash.
    const tsos = declared.find((recipe) => recipe.slug === 'general-tsos-chicken');
    expect(tsos?.washingUp?.count).toBe(5);
    expect(tsos?.cookware).toEqual(['wok']);
  });

  it('shows the variant counts only when every side of a dish has declared', () => {
    // The switcher's condition, asserted on the data it reads. A count beside a silent sibling
    // would read as a claim that the silent one washes nothing.
    for (const recipe of all) {
      for (const variant of recipe.variants) {
        const sibling = all.find((r) => r.slug === variant.slug);
        expect(variant.washingUpCount, variant.slug).toBe(sibling?.washingUp?.count ?? null);
      }
    }
  });
});

/*
 * "Warns, does not fail" is a property of the checker's exit code, not of any function's return
 * value, so the only honest way to test it is to run the checker. The fixture is written to a
 * temp directory and never to recipes/, so the collection build never sees it.
 */
describe('the cookware cross-check, run for real', () => {
  const root = path.resolve(import.meta.dirname, '../..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'washing-up-'));
  const folder = path.join(dir, 'stews-and-braises');
  fs.mkdirSync(folder, { recursive: true });

  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  const write = (name: string, washingUp: string) => {
    const file = path.join(folder, `${name}.cook`);
    fs.writeFileSync(
      file,
      [
        '>> title: Probe',
        '>> category: Stews & Braises',
        '>> tags: probe',
        '>> servings: 4',
        washingUp,
        '',
        'Fry @onion{1} and @garlic{2%cloves} in @olive oil{2%Tbs} in a #Dutch oven{}.',
        '',
        'Simmer @&(~1)base{} with @tomatoes{1%lb} and @stock{2%cups} for ~simmer{20%min}.',
        '',
        'Season @&(~1)stew{} with @salt{1%tsp} and @black pepper{1/2%tsp}.',
        '',
      ].join('\n'),
    );
    return file;
  };

  const run = (file: string) => {
    try {
      const out = execFileSync(process.execPath, ['scripts/check-recipes.mjs', file], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return { code: 0, out };
    } catch (error) {
      const failure = error as { status: number; stdout: string };
      return { code: failure.status, out: failure.stdout };
    }
  };

  it('warns about cookware the line forgets, and still exits 0', () => {
    const { code, out } = run(write('probe-warn', '>> washing-up: a chopping board'));
    expect(code).toBe(0);
    expect(out).toContain('  ok   ');
    expect(out).toContain('washing-up: names #Dutch oven{}');
  });

  it('says nothing when the line accounts for what the file names', () => {
    const { code, out } = run(write('probe-quiet', '>> washing-up: the Dutch oven'));
    expect(code).toBe(0);
    expect(out).not.toContain('washing-up:');
  });

  it('fails a line that states a number instead of the things', () => {
    const { code, out } = run(write('probe-number', '>> washing-up: 2'));
    expect(code).toBe(1);
    expect(out).toContain('FAIL');
    expect(out).toContain('which is a number rather than a thing');
  });

  it('fails a line that is there and empty rather than reading it as nothing', () => {
    const { code, out } = run(write('probe-empty', '>> washing-up:'));
    expect(code).toBe(1);
    expect(out).toContain('washing-up is there but says nothing');
  });
});
