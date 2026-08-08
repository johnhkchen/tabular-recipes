import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { NOT_AT_ALL, keepsWord, mentionsFreezer, readKeeps } from './keeps.ts';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const declared = all.filter((recipe) => recipe.keeps !== null);

describe('readKeeps', () => {
  it('reads a span and keeps the character exactly as it was written', () => {
    expect(readKeeps('3 days — better on the second')).toEqual({
      keeps: { text: '3 days', minutes: 4320, character: 'better on the second' },
      problem: null,
    });
    expect(readKeeps('1 week — the flavour only settles further into the fat')).toEqual({
      keeps: {
        text: '1 week',
        minutes: 10080,
        character: 'the flavour only settles further into the fat',
      },
      problem: null,
    });
    expect(readKeeps('36 hr — the crumb dries from the cut face in')).toEqual({
      keeps: { text: '36 hr', minutes: 2160, character: 'the crumb dries from the cut face in' },
      problem: null,
    });
  });

  it('takes whichever separator the author reached for, or none at all', () => {
    const character = 'the potatoes go grainy first';
    for (const line of [
      `4 days — ${character}`,
      `4 days – ${character}`,
      `4 days - ${character}`,
      `4 days: ${character}`,
      `4 days, ${character}`,
      `4 days ${character}`,
    ]) {
      expect(readKeeps(line).keeps, line).toEqual({ text: '4 days', minutes: 5760, character });
    }
  });

  it('does not eat a dash that belongs to the character', () => {
    expect(readKeeps('2 days — good cold — better warmed through in the pan').keeps?.character).toBe(
      'good cold — better warmed through in the pan',
    );
  });

  it('does not mind how the line was typed', () => {
    expect(readKeeps('  3days   —   it thickens to a paste overnight  ').keeps).toEqual({
      text: '3 days',
      minutes: 4320,
      character: 'it thickens to a paste overnight',
    });
    expect(readKeeps('NOT AT ALL: the coating is wet within the hour').keeps?.text).toBe(NOT_AT_ALL);
  });

  it('says nothing at all when the recipe never declared one', () => {
    for (const absent of [undefined, null, '', '   ']) {
      expect(readKeeps(absent)).toEqual({ keeps: null, problem: null });
    }
  });

  /*
   * The one shape this field exists to forbid. A number on its own is a shelf life, and a
   * shelf life is a food-safety claim the site does not make — so it is refused here rather
   * than left to an author's judgement, and the message says which half is missing.
   */
  it('refuses a duration with no character, because that is a shelf life', () => {
    for (const line of ['3 days', '3 days —', '2 weeks  :  ', `${NOT_AT_ALL} -`]) {
      const { keeps, problem } = readKeeps(line);
      expect(keeps, line).toBeNull();
      expect(problem, line).toMatch(/shelf life/);
    }
  });

  it('reads the words for a dish that does not keep, and still wants the character', () => {
    expect(readKeeps('not at all — the crust goes soft in the time it takes to sit down')).toEqual({
      keeps: {
        text: NOT_AT_ALL,
        minutes: 0,
        character: 'the crust goes soft in the time it takes to sit down',
      },
      problem: null,
    });
    expect(readKeeps(NOT_AT_ALL).keeps).toBeNull();
  });

  it('refuses a unit that is not a length of time, and names the ones that are', () => {
    const { keeps, problem } = readKeeps('3 fortnights — it holds');
    expect(keeps).toBeNull();
    expect(problem).toContain('3 fortnights');
    expect(problem).toContain('hours, days or weeks');
  });

  /*
   * "no longer than a day" is why the negative has one spelling. Read as a bare "no" it would
   * come out as a dish that does not keep with "longer than a day" as its character, which
   * inverts the answer. It is refused instead, and the message says what to write.
   */
  it('refuses a hedge that only looks like a length of time', () => {
    for (const line of ['no longer than a day — it dries out', 'about a day — it dries out']) {
      const { keeps, problem } = readKeeps(line);
      expect(keeps, line).toBeNull();
      expect(problem, line).toContain('not a length of time');
    }
  });

  it('treats a character with no span as an unreadable span, which is what it is', () => {
    const { keeps, problem } = readKeeps('better on the second day');
    expect(keeps).toBeNull();
    expect(problem).toContain('not a length of time');
  });
});

describe('keepsWord', () => {
  it('capitalises for printing and changes nothing else', () => {
    expect(keepsWord({ text: NOT_AT_ALL, minutes: 0, character: 'x' })).toBe('Not at all');
    expect(keepsWord({ text: '3 days', minutes: 4320, character: 'x' })).toBe('3 days');
    expect(keepsWord({ text: '1 week', minutes: 10080, character: 'x' })).toBe('1 week');
  });
});

describe('mentionsFreezer', () => {
  it('spots a line that has wandered into the other question', () => {
    const at = (character: string) => ({ text: '3 days', minutes: 4320, character });
    expect(mentionsFreezer(at('freezes well in portions'))).toBe(true);
    expect(mentionsFreezer(at('better from frozen than from the fridge'))).toBe(true);
    expect(mentionsFreezer(at('freeze the rest'))).toBe(true);
  });

  it('leaves the fridge alone, and says nothing about a recipe that never declared one', () => {
    expect(mentionsFreezer({ text: '3 days', minutes: 4320, character: 'cold from the fridge' })).toBe(
      false,
    );
    expect(mentionsFreezer(null)).toBe(false);
  });
});

/*
 * The render is one guard over one value — `{keeps && …}` in Timeline.astro — so these are
 * what stand behind it. A recipe is either whole or null; there is no third state for the
 * component to draw an empty slot out of.
 */
describe('keeps across the collection', () => {
  it('leaves every recipe either whole or silent, never half-declared', () => {
    const halfway = all
      .filter((recipe) => recipe.keeps !== null && !recipe.keeps?.character?.trim())
      .map((recipe) => recipe.slug);
    expect(halfway).toEqual([]);
  });

  it('renders nothing for a recipe that never declared one', () => {
    // Nothing to draw is the common case, and it is the honest answer rather than a gap:
    // 500-odd files have never been read for this, and a guess would be worse than silence.
    const undeclared = all.filter((recipe) => recipe.keeps === null);
    expect(undeclared.length).toBeGreaterThan(0);
    for (const recipe of undeclared) expect(recipe.keeps, recipe.slug).toBeNull();
  });

  it('re-reads every declared line without a complaint', () => {
    const problems = declared
      .map((recipe) => ({
        slug: recipe.slug,
        problem: readKeeps(`${recipe.keeps!.text} — ${recipe.keeps!.character}`).problem,
      }))
      .filter((entry) => entry.problem)
      .map((entry) => `${entry.slug}: ${entry.problem}`);
    expect(problems).toEqual([]);
  });

  /*
   * The count the ticket asked for, asserted rather than claimed. It is a floor and not a
   * target: a recipe whose answer could not be established honestly is left undeclared, and
   * five that had been written were taken back out for exactly that reason. Raising this
   * number by guessing at a file is the one failure this field cannot afford.
   */
  it('has been written on at least sixty recipes', () => {
    expect(declared.length).toBeGreaterThanOrEqual(60);
  });

  it('has worked examples of both answers, so a writer has one of each to copy', () => {
    const doesNot = declared.filter((recipe) => recipe.keeps!.minutes === 0);
    const spans = declared.filter((recipe) => recipe.keeps!.minutes > 0);
    expect(doesNot.length).toBeGreaterThanOrEqual(4);
    expect(spans.length).toBeGreaterThanOrEqual(40);
    for (const recipe of doesNot) expect(recipe.keeps!.text, recipe.slug).toBe(NOT_AT_ALL);
  });

  it('measures every span in hours at least, because nothing here is a matter of minutes', () => {
    const odd = declared
      .filter((recipe) => recipe.keeps!.minutes > 0 && recipe.keeps!.minutes < 60)
      .map((recipe) => `${recipe.slug}: ${recipe.keeps!.text}`);
    expect(odd).toEqual([]);
  });

  it('gives characters that say what you are eating rather than restating the span', () => {
    const thin = declared
      .filter((recipe) => recipe.keeps!.character.split(/\s+/).length < 5)
      .map((recipe) => `${recipe.slug}: ${recipe.keeps!.character}`);
    expect(thin).toEqual([]);
  });

  /*
   * The checker only WARNS on this, because "unlike the frozen version, this one…" is a
   * legitimate sentence and a guess about intent should not fail a build. Nothing written so
   * far needed the exception, so the collection is held at zero here — one line did trip it
   * (a frozen prawn going INTO the basket) and was reworded rather than waived. An author who
   * needs the exception moves this test and says why, the way the caps are moved.
   */
  it('keeps the freezer out of it, which is a different question', () => {
    const strayed = declared.filter((recipe) => mentionsFreezer(recipe.keeps)).map((r) => r.slug);
    expect(strayed).toEqual([]);
  });
});
