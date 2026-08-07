/*
 * The one file the front page fetches, checked at its boundary.
 *
 * Two things are worth testing here that neither schedule.ts nor index.astro can test alone.
 * One is that the numbers in the index are the clock's own, so the endpoint cannot drift from
 * the module. The other is the `find` dedupe: the browser's search is not this ticket's to fix,
 * so the property it relies on is asserted here against every token in the collection rather
 * than argued in a comment.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { buildSchedule, handsOnEvidence } from '../lib/schedule.ts';
import type { RawRecipe } from '../lib/tree.ts';
import { GET } from './search.json.ts';

interface Item {
  slug: string;
  title: string;
  counters: string[];
  find: string;
  elapsedMinutes: number;
  handsOnMinutes: number;
  longestHandsOnMinutes: number;
  washingUpCount: number | null;
  evidence: string;
}

const all = recipes as unknown as RawRecipe[];
const response = GET();
const index: Item[] = JSON.parse(await response.text());
const bySlug = new Map(index.map((item) => [item.slug, item]));
const item = (slug: string): Item => {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`no index entry for ${slug}`);
  return found;
};

/** `find` as it was before the dedupe, so the two can be compared word for word. */
const rawFind = (recipe: RawRecipe) =>
  [
    recipe.title,
    recipe.category,
    ...recipe.counters,
    ...recipe.aka,
    ...recipe.tags,
    ...recipe.ingredientNames,
  ]
    .join(' ')
    .toLowerCase();

describe('the endpoint itself', () => {
  it('is JSON, one entry per recipe, sorted by title', () => {
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(index).toHaveLength(all.length);
    expect(index.map((i) => i.title)).toEqual([...index.map((i) => i.title)].sort((a, b) => a.localeCompare(b)));
  });

  it('gives every recipe the same nine keys and nothing else', () => {
    const keys = [
      'slug', 'title', 'counters', 'find',
      'elapsedMinutes', 'handsOnMinutes', 'longestHandsOnMinutes', 'washingUpCount', 'evidence',
    ].sort();
    const wrong = index.filter((i) => Object.keys(i).sort().join() !== keys.join());
    expect(wrong.map((i) => i.slug)).toEqual([]);
  });
});

describe('the numbers a tired cook sorts by', () => {
  it('are the clock’s own, not a second opinion about them', () => {
    const wrong: string[] = [];
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      const entry = item(recipe.slug);
      if (entry.elapsedMinutes !== schedule.totalMinutes) wrong.push(`${recipe.slug}: elapsed`);
      if (entry.handsOnMinutes !== schedule.handsOnMinutes) wrong.push(`${recipe.slug}: hands-on`);
      if (entry.longestHandsOnMinutes !== schedule.longestHandsOnMinutes) {
        wrong.push(`${recipe.slug}: longest stretch`);
      }
      if (entry.evidence !== handsOnEvidence(schedule)) wrong.push(`${recipe.slug}: evidence`);
    }
    expect(wrong).toEqual([]);
  });

  it('says whose the hands-on figure is, in one of three words', () => {
    const words = new Set(index.map((i) => i.evidence));
    expect([...words].sort()).toEqual(['inferred', 'stated', 'unknown']);
  });

  it('never claims a longer unbroken stretch than there are hands-on minutes', () => {
    const wrong = index.filter((i) => i.longestHandsOnMinutes > i.handsOnMinutes);
    expect(wrong.map((i) => i.slug)).toEqual([]);
  });
});

describe('what is in the sink', () => {
  /*
   * washing-up.ts is emphatic that absent and zero are different answers and different values,
   * and this is the boundary where a careless `||` would collapse them.
   */
  it('carries a real zero for a recipe that genuinely washes nothing', () => {
    expect(item('memphis-dry-rub').washingUpCount).toBe(0);
  });

  it('carries the derived count for a recipe that declared a list', () => {
    expect(item('general-tsos-chicken').washingUpCount).toBe(5);
    expect(item('beef-bourguignon').washingUpCount).toBe(3);
  });

  it('carries null — not zero — for a recipe that never declared one', () => {
    expect(item('blondies').washingUpCount).toBeNull();
  });

  it('agrees with every declaration in the collection', () => {
    const wrong = all.filter(
      (recipe) => item(recipe.slug).washingUpCount !== (recipe.washingUp?.count ?? null),
    );
    expect(wrong.map((r) => r.slug)).toEqual([]);
  });
});

describe('the deduplicated find string', () => {
  it('keeps every word once', () => {
    const wrong = index.filter((i) => {
      const words = i.find.split(' ').filter(Boolean);
      return new Set(words).size !== words.length;
    });
    expect(wrong.map((i) => i.slug)).toEqual([]);
  });

  /*
   * The contract index.astro relies on, asserted rather than assumed: it splits a query on
   * whitespace and asks find.includes(word) for each word on its own, so a query word can never
   * contain a space and the answer cannot depend on order or repetition. Every distinct token in
   * the collection, against every recipe.
   */
  it('answers every possible query word exactly as the undeduplicated string did', () => {
    const vocabulary = new Set<string>();
    for (const recipe of all) {
      for (const word of rawFind(recipe).split(/\s+/)) if (word) vocabulary.add(word);
    }
    const words = [...vocabulary];

    const changed: string[] = [];
    for (const recipe of all) {
      const before = rawFind(recipe);
      const after = item(recipe.slug).find;
      for (const word of words) {
        if (before.includes(word) !== after.includes(word)) changed.push(`${recipe.slug}: ${word}`);
      }
    }
    expect(words.length).toBeGreaterThan(2000);
    expect(changed).toEqual([]);
  });

  it('still finds a dish by what somebody would type', () => {
    const search = (query: string) => {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      return index.filter((i) => words.every((word) => i.find.includes(word))).map((i) => i.slug);
    };
    expect(search('mujaddara')).toContain('mujaddara');
    expect(search('lentils rice')).toContain('mujaddara');
  });
});
