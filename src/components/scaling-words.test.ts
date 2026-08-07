/*
 * The phrasebook, checked on named recipes and then on the whole collection.
 *
 * The collection half is the one that matters. Every claim design.md argues from — 46 recipes
 * with a capacity, 389 the page must stay silent about, 22 baskets whose evidence is `unknown`
 * and which must speak anyway — is asserted here, so a collection that moves under this feature
 * fails a test with the numbers in the message rather than quietly making the argument wrong.
 *
 * It builds the table through buildCostTable() and reads it back through readCost(), which is
 * the same boundary the built page crosses, so a change to the wire shape lands here too.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { MULTIPLIERS } from '../lib/plan.ts';
import { buildSchedule } from '../lib/schedule.ts';
import { costOf, servingsOf } from '../lib/scaling.ts';
import type { RawRecipe } from '../lib/tree.ts';
import {
  buildCostTable,
  type CostReading,
  eveningLine,
  findingOf,
  readCost,
  wordsFor,
} from './scaling-words.ts';

const all = recipes as unknown as RawRecipe[];

const real = (slug: string): RawRecipe => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return recipe;
};

/** One recipe at a multiplier of its written servings, the way the plan page asks. */
const at = (slug: string, multiplier: number) => {
  const recipe = real(slug);
  const written = servingsOf(recipe);
  if (written === null) throw new Error(`${slug} has no servings`);
  const cost = costOf(recipe, written * multiplier, buildSchedule(recipe));
  if (!cost) throw new Error(`${slug} has no cost at ${multiplier}`);
  return { cost, finding: findingOf(cost), words: wordsFor(findingOf(cost), multiplier, cost.untimedCount) };
};

/* The table is built once: 685 recipes times four multipliers is a second of work. */
const table = buildCostTable(all);
/* And once more through JSON, because that is how the page receives it. */
const shipped = JSON.parse(JSON.stringify(table)) as typeof table;

describe('findingOf', () => {
  it('says nothing at all at the written size', () => {
    for (const slug of ['gumbo', 'air-fryer-chicken-wings', 'beef-rendang', 'beef-with-broccoli']) {
      const { finding, words } = at(slug, 1);
      expect(finding.kind).toBe('unchanged');
      expect(words).toBeNull();
    }
  });

  it('reads a basket that binds as loads with a price on them', () => {
    const { finding, words } = at('air-fryer-chicken-wings', 3);
    expect(finding).toEqual({ kind: 'lots-cost', loads: 3, minutes: 42 });
    expect(words?.said).toBe('It goes in three lots, and that costs you about 42 min.');
    expect(words?.qualifier).toBe('…plus three steps the recipe never times.');
  });

  it('reads a vessel that binds work rather than a wait as costing nothing', () => {
    // The wok sears two portions at a time, and searing was going to triple anyway.
    const { cost, finding, words } = at('beef-with-broccoli', 3);
    expect(cost.batches.binds).toBe(true);
    expect(finding).toEqual({ kind: 'lots-only', loads: 6 });
    expect(words?.said).toBe('It goes in six lots, and that is the only difference.');
  });

  it('reads a vessel that stops binding when less is wanted', () => {
    expect(at('beef-with-broccoli', 0.5).finding.kind).toBe('unbinds');
    expect(at('beef-with-broccoli', 0.5).words?.said).toBe('At this size it all goes in at once.');
  });

  it('reads an unbound recipe with real work as work that grows', () => {
    // gumbo is the best-evidenced recipe in the collection: every operation timed and named.
    const { cost, finding, words } = at('gumbo', 3);
    expect(cost.bounded).toBe(false);
    expect(cost.evidence).toBe('stated');
    expect(finding.kind).toBe('work');
    expect(words?.said).toBe('Three times as much is three times the chopping. The pot doesn’t care.');
    expect(words?.qualifier).toBeNull();
  });

  it('reads half a recipe with the same words, downward', () => {
    expect(at('gumbo', 0.5).words?.said).toBe(
      'Half as much is half the chopping. The pot doesn’t care.',
    );
  });

  it('refuses a recipe whose standing figure is ours', () => {
    // The largest unwarned cost in the collection (+120 min at three times), and 180 of its 180
    // standing minutes are assumed. Saying anything here is scaling.md §4.6's failure.
    const rendang = at('beef-rendang', 3);
    expect(rendang.cost.assumedStandingMinutes).toBe(rendang.cost.standing.at);
    expect(rendang.finding.kind).toBe('cannot-say');
    expect(rendang.words).toBeNull();

    // Four of chili's five operations carry no timer, so its zero is silence, not freedom.
    expect(at('chili-con-carne', 3).finding.kind).toBe('cannot-say');
    expect(at('chili-con-carne', 3).words).toBeNull();
  });

  it('keeps the good-news case and the cannot-say case apart', () => {
    const free = all
      .map((recipe) => ({ recipe, cost: costOf(recipe, (servingsOf(recipe) ?? 1) * 3) }))
      .filter((one) => one.cost && findingOf(one.cost).kind === 'free');

    expect(free.length).toBeGreaterThan(0);
    for (const one of free) {
      // Different kinds, and one of them has a sentence where the other has none.
      expect(one.cost!.evidence).not.toBe('unknown');
      expect(wordsFor(findingOf(one.cost!), 3, one.cost!.untimedCount)?.said).toContain(
        'costs you nothing extra',
      );
    }
  });
});

describe('the whole collection', () => {
  it('has a cost for every recipe that states its servings', () => {
    const stated = all.filter((recipe) => servingsOf(recipe) !== null);
    expect(stated.length).toBe(all.length);
    expect(Object.keys(table.at).length).toBe(all.length);
  });

  it('never lets notation reach a sentence', () => {
    /* scaling.md §6: no O(·), no multiplier, no arrow, no batch count dressed as arithmetic. */
    const notation = /O\(|×|→|÷|\bceil\b|\d\s*\/\s*\d|\bO\b\s*\(/;
    for (const [said, qualifier] of table.says) {
      expect(said, said).not.toMatch(notation);
      expect(qualifier, qualifier).not.toMatch(notation);
    }
  });

  it('speaks for every recipe that declares a capacity, at every multiplier but one', () => {
    const bounded = all.filter((recipe) => recipe.capacity);
    expect(bounded.length).toBe(46);

    for (const recipe of bounded) {
      for (const multiplier of MULTIPLIERS) {
        const read = readCost(table, recipe.slug, multiplier);
        expect(read, recipe.slug).not.toBeNull();
        if (multiplier === 1) expect(read!.words, recipe.slug).toBeNull();
        else expect(read!.words, `${recipe.slug} at ${multiplier}`).not.toBeNull();
      }
    }
  });

  it('stays silent on the recipes whose hands-on figure nobody wrote down', () => {
    let silent = 0;
    let spoken = 0;
    for (const recipe of all) {
      const read = readCost(table, recipe.slug, 3);
      if (read?.words) spoken += 1;
      else silent += 1;
    }
    // design.md's figures: 389 unbounded and unknown, 296 that can say something.
    expect(silent).toBe(389);
    expect(spoken).toBe(296);
  });

  it('packs to a small table because most recipes say the same thing', () => {
    expect(table.says.length).toBeLessThan(120);
    expect(JSON.stringify(table).length).toBeLessThan(100_000);
  });
});

describe('readCost', () => {
  it('survives the trip through JSON', () => {
    const { cost } = at('air-fryer-chips', 3);
    const here = wordsFor(findingOf(cost), 3, cost.untimedCount);
    const there = readCost(shipped, 'air-fryer-chips', 3);
    expect(there?.words).toEqual(here);
    expect(there?.elapsedMinutes).toBe(66);
  });

  it('is null for a slug the build never saw', () => {
    expect(readCost(table, 'not-a-recipe', 3)).toBeNull();
  });

  it('is null for a multiplier the dial does not offer', () => {
    // setMultiplier() accepts any positive number, and an old stored plan can carry one.
    expect(readCost(table, 'gumbo', 1.5)).toBeNull();
    expect(readCost(table, 'gumbo', 4)).toBeNull();
  });
});

describe('eveningLine', () => {
  const one = (
    standingMinutes: number,
    elapsedMinutes: number,
    canStand = true,
  ): CostReading => ({ words: null, standingMinutes, elapsedMinutes, canStand });

  it('says nothing about one recipe, because that is the line above it', () => {
    expect(eveningLine([one(20, 45)])).toBeNull();
    expect(eveningLine([])).toBeNull();
  });

  it('sums the standing and takes the longest clock, never the sum of clocks', () => {
    const said = eveningLine([one(30, 120), one(20, 120)])!;
    expect(said).toContain('50 min standing');
    expect(said).toContain('at least 2 hr');
    expect(said).not.toContain('4 hr');
  });

  it('never claims an evening longer than the sum of its recipes', () => {
    const readings = [one(30, 120), one(20, 95), one(5, 240)];
    const floor = Math.max(...readings.map((r) => r.elapsedMinutes));
    const sum = readings.reduce((total, r) => total + r.elapsedMinutes, 0);
    expect(floor).toBeLessThanOrEqual(sum);
    expect(eveningLine(readings)).toContain('at least 4 hr');
  });

  it('leaves out the standing figures nobody wrote down, and says how many', () => {
    const said = eveningLine([one(30, 120), one(999, 90, false)])!;
    expect(said).toContain('30 min standing');
    expect(said).not.toContain('999');
    expect(said).toContain('One of these doesn’t time enough of itself to count.');

    const two = eveningLine([one(30, 120), one(999, 90, false), one(999, 40, false)])!;
    expect(two).toContain('Two of these don’t time enough of themselves to count.');
  });

  it('still gives the floor when no standing figure is sayable', () => {
    const said = eveningLine([one(0, 120, false), one(0, 90, false)])!;
    expect(said).toBe(
      'The evening runs at least 2 hr. Two of these don’t time enough of themselves to count.',
    );
  });

  it('gives nothing when nothing on the list has a clock', () => {
    expect(eveningLine([one(0, 0, false), one(0, 0, false)])).toBeNull();
  });

  it('carries no notation', () => {
    const said = eveningLine([one(30, 120), one(20, 95, false)])!;
    expect(said).not.toMatch(/O\(|×|→|÷/);
  });
});
