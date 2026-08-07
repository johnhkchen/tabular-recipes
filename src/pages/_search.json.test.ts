/*
 * The one file the front page fetches, checked at its boundary.
 *
 * The leading underscore is Astro's, not a style: everything else under src/pages/ is a route,
 * and without it this file builds to /search.json.test/ and the build fails inside vitest's
 * runner. It sits here anyway rather than in src/lib/, because a test belongs beside the thing
 * it tests and the thing it tests is a page.
 *
 * Two things are worth testing here that neither schedule.ts nor index.astro can test alone.
 * One is that the numbers in the index are the clock's own, so the endpoint cannot drift from
 * the module. The other is the `find` dedupe: the browser's search is not this ticket's to fix,
 * so the property it relies on is asserted here against every token in the collection rather
 * than argued in a comment.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { TARGETS } from '../components/situation.ts';
import { buildSchedule, handsOnEvidence } from '../lib/schedule.ts';
import { costOf, servingsOf } from '../lib/scaling.ts';
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
  writtenServings: number | null;
  waitMinutes: number;
  untimedCount: number;
  capacityServings?: number;
  vessel?: string;
  scaled?: number[][];
  keepsText?: string;
  keepsCharacter?: string;
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

  /*
   * Twelve keys on every recipe and four more that are there only where the recipe said
   * something. Absent rather than null, so 639 entries with no vessel and 547 with nothing said
   * about keeping cost the file nothing at all — JSON.stringify drops an undefined.
   */
  it('gives every recipe the same twelve keys, and the optional four only where earned', () => {
    const always = [
      'slug', 'title', 'counters', 'find',
      'elapsedMinutes', 'handsOnMinutes', 'longestHandsOnMinutes', 'washingUpCount', 'evidence',
      'writtenServings', 'waitMinutes', 'untimedCount',
    ].sort();
    const sometimes = ['capacityServings', 'vessel', 'scaled', 'keepsText', 'keepsCharacter'];
    const wrong = index.filter((i) => {
      const keys = Object.keys(i);
      return (
        always.some((key) => !keys.includes(key)) ||
        keys.some((key) => !always.includes(key) && !sometimes.includes(key))
      );
    });
    expect(wrong.map((i) => i.slug)).toEqual([]);
  });
});

/*
 * What it costs to cook more of the thing. Everything here is costOf()'s own answer written down
 * — the test that the browser's arithmetic agrees with it lives in src/components/situation.test.ts,
 * because that is the file doing the arithmetic.
 */
describe('the scaling numbers', () => {
  it('says how much every recipe makes', () => {
    const wrong = all.filter((recipe) => item(recipe.slug).writtenServings !== servingsOf(recipe));
    expect(wrong.map((r) => r.slug)).toEqual([]);
    expect(index.filter((i) => i.writtenServings === null)).toHaveLength(0);
  });

  /*
   * `A` is the wait on the critical path and NOT elapsedMinutes: the timeline runs some hands-on
   * work on a second pair of hands, so A + H sits at or above the drawn clock. gumbo is the
   * worked example in scaling.md §2 — 53 and 49 against 94 — and this is where the two are kept
   * from being read as the same number.
   */
  it('carries the wait, taken off costOf’s own written figures', () => {
    const wrong: string[] = [];
    for (const recipe of all) {
      const servings = servingsOf(recipe);
      if (servings === null) continue;
      const cost = costOf(recipe, servings)!;
      const wait = Math.round((cost.elapsed.written - cost.standing.written) * 100) / 100;
      if (item(recipe.slug).waitMinutes !== wait) wrong.push(recipe.slug);
    }
    expect(wrong).toEqual([]);
    expect(item('gumbo').waitMinutes).toBe(53);
    expect(item('gumbo').handsOnMinutes).toBe(49);
    expect(item('gumbo').elapsedMinutes).toBe(94);
  });

  it('names the vessel wherever it carries a capacity, and carries neither otherwise', () => {
    for (const recipe of all) {
      const entry = item(recipe.slug);
      expect([recipe.slug, entry.capacityServings]).toEqual([
        recipe.slug,
        recipe.capacity?.servings,
      ]);
      expect([recipe.slug, entry.vessel]).toEqual([recipe.slug, recipe.capacity?.vessel]);
    }
    expect(index.filter((i) => i.capacityServings).length).toBeGreaterThan(20);
  });

  it('gives a bound recipe one row per size, and an unbound one none', () => {
    for (const entry of index) {
      if (entry.capacityServings) {
        expect([entry.slug, entry.scaled?.length]).toEqual([entry.slug, TARGETS.length]);
        for (const row of entry.scaled!) expect(row).toHaveLength(3);
      } else {
        expect([entry.slug, entry.scaled]).toEqual([entry.slug, undefined]);
      }
    }
  });

  it('reproduces the worked example in scaling.md §3', () => {
    // beef-with-broccoli, four portions to twelve: 42 minutes, twelve of them standing.
    const row = item('beef-with-broccoli').scaled![TARGETS.indexOf(12)];
    expect(row[0]).toBe(42);
    expect(row[1]).toBe(12);
  });

  it('carries the keeping span with what the dish is like, never one without the other', () => {
    for (const recipe of all) {
      const entry = item(recipe.slug);
      expect([recipe.slug, entry.keepsText]).toEqual([recipe.slug, recipe.keeps?.text]);
      expect(Boolean(entry.keepsText)).toBe(Boolean(entry.keepsCharacter));
    }
    expect(index.filter((i) => i.keepsText).length).toBeGreaterThan(100);
  });

  it('says how many operations the recipe never timed', () => {
    const wrong = all.filter(
      (recipe) => item(recipe.slug).untimedCount !== buildSchedule(recipe).untimedCount,
    );
    expect(wrong.map((r) => r.slug)).toEqual([]);
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
