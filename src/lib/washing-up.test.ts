import { describe, expect, it } from 'vitest';
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
      readWashingUp('the Instant Pot, a skillet for the spices, a fine sieve, the sachet cloth')
        .washingUp,
    ).toEqual({
      items: ['the Instant Pot', 'a skillet for the spices', 'a fine sieve', 'the sachet cloth'],
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
