import { describe, expect, it } from 'vitest';
import { attentionOf, formatDuration, minutesOf, readTimers } from './time.ts';
import { slugify, splitList } from './meta.ts';

describe('minutesOf', () => {
  it('converts the units a recipe actually writes', () => {
    expect(minutesOf(30, 'min')).toBe(30);
    expect(minutesOf(3, 'hr')).toBe(180);
    expect(minutesOf(2, 'hours')).toBe(120);
    expect(minutesOf(90, 'sec')).toBe(1.5);
    expect(minutesOf(2, 'days')).toBe(2880);
  });

  it('returns null rather than guessing at something that is not a duration', () => {
    expect(minutesOf(350, '°F')).toBeNull();
    expect(minutesOf(2, 'cups')).toBeNull();
    expect(minutesOf(null, 'min')).toBeNull();
    expect(minutesOf(30, null)).toBeNull();
  });
});

describe('formatDuration', () => {
  it('reads the way a cook would say it', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(275)).toBe('4 hr 35 min');
    expect(formatDuration(60)).toBe('1 hr');
    expect(formatDuration(1440)).toBe('1 day');
    expect(formatDuration(1500)).toBe('1 day 1 hr');
  });

  it('says nothing when there is no time to report', () => {
    expect(formatDuration(0)).toBe('');
    expect(formatDuration(Number.NaN)).toBe('');
  });
});

describe('attentionOf', () => {
  it('takes a recognised timer name as the author saying it outright', () => {
    expect(attentionOf('rise')).toEqual({ attention: 'unattended', source: 'name' });
    expect(attentionOf('chill')).toEqual({ attention: 'unattended', source: 'name' });
    expect(attentionOf('whisk')).toEqual({ attention: 'hands-on', source: 'name' });
  });

  it('never lets a name it does not know beat the operation it sits in', () => {
    // `~blind bake{20%min}` used to resolve hands-on purely because "blindbake" was not in
    // the vocabulary — so naming a timer well made the answer worse than leaving it blank.
    expect(attentionOf('blind bake', 'bake the shell 20 min')).toEqual({
      attention: 'unattended',
      source: 'name',
    });
    expect(attentionOf('sit tight', 'chill 2 hr')).toEqual({
      attention: 'unattended',
      source: 'label',
    });
    expect(attentionOf('nonsense', 'stir constantly')).toEqual({
      attention: 'hands-on',
      source: 'label',
    });
  });

  it('falls back to the operation, so a braise is not three hours of your attention', () => {
    expect(attentionOf(null, 'braise 300°F 3 hr')).toEqual({
      attention: 'unattended',
      source: 'label',
    });
    expect(attentionOf(null, 'Cover and leave at room temperature for 18 hours')).toEqual({
      attention: 'unattended',
      source: 'label',
    });
  });

  it('assumes you are standing there when nothing says otherwise', () => {
    // Promising a cook they can walk away when they cannot is the worse error.
    expect(attentionOf(null, 'warm through')).toEqual({ attention: 'hands-on', source: 'default' });
    expect(attentionOf(null, '')).toEqual({ attention: 'hands-on', source: 'default' });
  });

  it('reads a hands-on verb off the step instead of calling it an assumption', () => {
    // "mix" is the step saying so. Filing that under "we assumed" both understates what the
    // recipe said and wears out the hedge the page prints beside the ones we really guessed.
    expect(attentionOf(null, 'mix')).toEqual({ attention: 'hands-on', source: 'label' });
    expect(attentionOf(null, 'knead 8 min')).toEqual({ attention: 'hands-on', source: 'label' });
  });

  it('will not take a word for a verb it plainly is not', () => {
    // A dry skillet is a pan, not a wait; the iron is what your hands are on.
    expect(attentionOf(null, 'toast in a dry skillet 3 min')).toEqual({
      attention: 'hands-on',
      source: 'label',
    });
    expect(attentionOf(null, 'press in the hot iron for 45 sec')).toEqual({
      attention: 'hands-on',
      source: 'default',
    });
    expect(attentionOf(null, 'boil 1 min a side')).toEqual({
      attention: 'hands-on',
      source: 'default',
    });
    // Named on purpose, it is still the wait the author meant.
    expect(attentionOf('dry', 'in the dehydrator')).toEqual({
      attention: 'unattended',
      source: 'name',
    });
  });
});

describe('readTimers', () => {
  const texts = (step: string, ...timers: string[]) =>
    readTimers(timers.map((text) => ({ name: null, text })), step);

  it('gives each timer only the words that are its own', () => {
    // The bug this exists for: the rise handed its answer to the knead, and the page told a
    // cook that ten minutes of kneading was ten minutes they could walk away from.
    expect(texts('add flour and salt, knead 10 min, rise 1 hour', '10 min', '1 hour')).toEqual([
      { attention: 'hands-on', source: 'label' },
      { attention: 'unattended', source: 'label' },
    ]);
  });

  it('lets a second timer lean on the step when its own words say nothing', () => {
    // "+ 15 min" is the same bake carrying on, not fifteen minutes at the oven door.
    expect(
      texts('bake in a Dutch oven 450°F, 30 min covered + 15 min open', '30 min', '15 min'),
    ).toEqual([
      { attention: 'unattended', source: 'label' },
      { attention: 'unattended', source: 'label' },
    ]);
  });

  it('narrows nothing when the timers are not in the label to be found', () => {
    // A `>> step.N:` line can rewrite a step in words of its own; half a slice is worse than
    // none, so the whole step answers for every timer in it.
    expect(texts('rest overnight', '8 hr')).toEqual([
      { attention: 'unattended', source: 'label' },
    ]);
  });

  it('stops the words after a timer speaking for it', () => {
    // "fry crisp 25 min, drain" was twenty-five minutes of frying read as a drain.
    expect(texts('fry crisp 25 min, drain', '25 min')).toEqual([
      { attention: 'hands-on', source: 'label' },
    ]);
  });
});

describe('metadata readers', () => {
  it('splits a list line without leaving blanks behind', () => {
    expect(splitList('a, b , ,c')).toEqual(['a', 'b', 'c']);
    expect(splitList(undefined)).toEqual([]);
    expect(splitList('')).toEqual([]);
  });

  it('slugs a counter name into a URL', () => {
    expect(slugify('Taquería')).toBe('taqueria');
    expect(slugify('Pastry Case')).toBe('pastry-case');
    expect(slugify("Millionaire's Shortbread")).toBe('millionaires-shortbread');
  });
});
