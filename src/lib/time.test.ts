import { describe, expect, it } from 'vitest';
import { attentionOf, formatDuration, minutesOf } from './time.ts';
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
      source: 'default',
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
    expect(attentionOf(null, 'mix')).toEqual({ attention: 'hands-on', source: 'default' });
    expect(attentionOf(null, '')).toEqual({ attention: 'hands-on', source: 'default' });
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
