import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import {
  boundSteps,
  type Capacity,
  readCapacity,
  saysItBatches,
  servingsOf,
} from './scaling.ts';
import type { Attention, AttentionSource } from './time.ts';
import type { RawIngredient, RawRecipe, RawTimer } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const real = (slug: string): RawRecipe => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return recipe;
};

/* --- hand-built recipes, so a capacity can be declared without a .cook file doing it --- */

/** tree.ts's RawTimer predates the `source` the parser writes; the schedule reads it. */
type Timer = RawTimer & { source: AttentionSource };

const timer = (
  minutes: number | null,
  attention: Attention = 'unattended',
  source: AttentionSource = 'label',
): Timer => ({ name: null, text: `${minutes} min`, minutes, attention, source });

const ingredient = (name: string): RawIngredient => ({
  name,
  quantity: '',
  note: null,
  display: name,
  amount: { value: null, unit: null },
});

interface StepSpec {
  label: string;
  /** The sentence the label was written from, when it says something the label does not. */
  body?: string;
  /** Indices of the steps this one consumes. Without them the step starts a branch. */
  refs?: number[];
  timers?: Timer[];
}

/** A recipe with the tree we want and nothing else: every leaf step gets one ingredient. */
function fixture(
  slug: string,
  steps: StepSpec[],
  extra: Partial<RawRecipe> & { metadata?: Record<string, string> } = {},
): RawRecipe {
  return {
    slug,
    path: `test/${slug}.cook`,
    title: slug,
    category: 'test',
    tags: [],
    counters: [],
    countersInferred: false,
    dish: slug,
    kit: null,
    slack: null,
    washingUp: null,
    capacity: null,
    aka: [],
    pairsWith: [],
    variants: [],
    ingredientNames: [],
    cookware: [],
    metadata: { servings: '4' },
    steps: steps.map((step, index) => ({
      index,
      rawLabel: step.body ?? step.label,
      labelOverride: step.label,
      ingredients: step.refs?.length ? [] : [ingredient(`${slug}-${index}`)],
      refs: step.refs ?? [],
      timers: step.timers ?? [],
    })),
    ...extra,
  };
}

const capacity = (line: string): Capacity => {
  const { capacity: read, problem } = readCapacity(line);
  if (!read) throw new Error(`fixture capacity "${line}" is not readable: ${problem}`);
  return read;
};

/* ---- the line ------------------------------------------------------------- */

describe('readCapacity', () => {
  it('reads the number, the vessel and what it bounds', () => {
    expect(readCapacity('2 — the wok, sear')).toEqual({
      capacity: { servings: 2, vessel: 'the wok', operations: ['sear'] },
      problem: null,
    });
  });

  it('takes any punctuation between the number and the words, or none', () => {
    const parts = { servings: 4, vessel: 'the basket', operations: ['roast'] };
    for (const line of [
      '4 — the basket, roast',
      '4 – the basket, roast',
      '4 - the basket, roast',
      '4: the basket, roast',
      '4, the basket, roast',
      '4 the basket, roast',
      '4 servings — the basket, roast',
      '4 portions — the basket, roast',
    ]) {
      expect(readCapacity(line).capacity, line).toEqual(parts);
    }
  });

  it('keeps several operations, in the words and the order they were written', () => {
    expect(readCapacity('6 — one 12-inch skillet, brown, fry').capacity).toEqual({
      servings: 6,
      vessel: 'one 12-inch skillet',
      operations: ['brown', 'fry'],
    });
  });

  it('is absent when the line is absent, which is the common and correct answer', () => {
    expect(readCapacity(undefined)).toEqual({ capacity: null, problem: null });
    expect(readCapacity(null)).toEqual({ capacity: null, problem: null });
    expect(readCapacity('   ')).toEqual({ capacity: null, problem: null });
  });

  it('refuses a line that does not start with a number', () => {
    const { capacity: read, problem } = readCapacity('the wok, sear');
    expect(read).toBeNull();
    expect(problem).toContain('does not start with a number');
  });

  it('refuses a vessel that holds nothing', () => {
    expect(readCapacity('0 — the wok, sear').problem).toContain('more than zero');
  });

  it('refuses a count of batches, because that number is worked out and not written', () => {
    // The washing-up rule again: a derived number an author states is two stories that can
    // disagree, and this one becomes a lie the moment >> servings: is edited.
    const { capacity: read, problem } = readCapacity('2 batches — the wok, sear');
    expect(read).toBeNull();
    expect(problem).toContain('counts batches rather than servings');
    expect(readCapacity('3 — the basket, roast in two loads').problem).toContain('counts batches');
  });

  it('refuses a number with no vessel', () => {
    expect(readCapacity('6').problem).toContain('names no vessel');
    expect(readCapacity('6 —').problem).toContain('names no vessel');
  });

  it('refuses a vessel with no operation, which is the 102-minute mistake', () => {
    // scaling.md §3: a bare capacity triples a rest in the fridge and turns 42 into 102.
    const { capacity: read, problem } = readCapacity('2 — the wok');
    expect(read).toBeNull();
    expect(problem).toContain('not what it bounds');
  });
});

/* ---- servings ------------------------------------------------------------- */

describe('servingsOf', () => {
  it('reads the number every file carries', () => {
    expect(servingsOf(real('beef-with-broccoli'))).toBe(4);
    expect(servingsOf(real('gumbo'))).toBe(8);
    expect(servingsOf(real('chili-con-carne'))).toBe(6);
  });

  it('reads the leading number of the six files that say a volume', () => {
    expect(servingsOf(fixture('jar', [{ label: 'stir' }], { metadata: { servings: '2 cups' } }))).toBe(2);
  });

  it('is null when there is no number to scale from', () => {
    expect(servingsOf(fixture('vague', [{ label: 'stir' }], { metadata: { servings: 'plenty' } }))).toBeNull();
    expect(servingsOf(fixture('silent', [{ label: 'stir' }], { metadata: {} }))).toBeNull();
  });

  it('parses on every file in the collection', () => {
    for (const recipe of all) expect(servingsOf(recipe), recipe.slug).not.toBeNull();
  });
});

/* ---- which steps the vessel bounds ---------------------------------------- */

describe('boundSteps', () => {
  const recipe = fixture('fryer', [
    { label: 'marinate 30 min' },
    { label: 'sear in two batches 3 min', refs: [0] },
    { label: 'simmer the sauce 20 min', refs: [1] },
  ]);

  it('finds the operation the author named', () => {
    expect(boundSteps(recipe, capacity('2 — the wok, sear'))).toEqual([1]);
  });

  it('matches by prefix in either direction, so a verb and its -ing are one word', () => {
    expect(boundSteps(recipe, capacity('2 — the wok, searing'))).toEqual([1]);
    expect(boundSteps(recipe, capacity('2 — the wok, marinating'))).toEqual([0]);
  });

  it('finds every step an operation names, not only the first', () => {
    const karaage = real('karaage');
    // Both fries: "fry at 320°F ... 90 sec" and "fry again at 360°F ... 60 sec".
    expect(boundSteps(karaage, capacity('4 — the oil, fry'))).toEqual([4, 5]);
  });

  it('takes several operations at once', () => {
    expect(boundSteps(recipe, capacity('2 — the wok, sear, simmer'))).toEqual([1, 2]);
  });

  it('binds nothing when the operation is not in the recipe — a fault the checker fails on', () => {
    expect(boundSteps(recipe, capacity('2 — the wok, deep-fry'))).toEqual([]);
  });

  it('does not match a word inside another word', () => {
    const research = fixture('research', [{ label: 'research the sauce' }, { label: 'stir', refs: [0] }]);
    expect(boundSteps(research, capacity('2 — the pan, sea'))).toEqual([]);
  });
});

describe('saysItBatches', () => {
  it('reads it off the label, where beef-with-broccoli writes it', () => {
    // >> step: sear in two batches 3 min, lift out
    expect(saysItBatches(real('beef-with-broccoli'), capacity('2 — the wok, sear'))).toBe(true);
  });

  it('reads it off the step body, where karaage writes it', () => {
    // The label says "fry at 320°F (160°C) 90 sec, rest 5 min"; the sentence says "in batches".
    expect(saysItBatches(real('karaage'), capacity('4 — the oil, fry'))).toBe(true);
  });

  it('reads it off the label of a recipe that sears in batches', () => {
    expect(saysItBatches(real('vindaloo'), capacity('3 — the pan, sear'))).toBe(true);
  });

  it('is false when the batching is somewhere else in the recipe', () => {
    const recipe = fixture('elsewhere', [
      { label: 'brown in two batches 10 min' },
      { label: 'simmer 40 min', refs: [0] },
    ]);
    expect(saysItBatches(recipe, capacity('2 — the pot, simmer'))).toBe(false);
    expect(saysItBatches(recipe, capacity('2 — the pot, brown'))).toBe(true);
  });
});

/*
 * "Fails the build" is a property of the checker's exit code, not of any function's return
 * value, so the only honest way to test it is to run the checker. The fixtures are written to
 * a temp directory and never to recipes/, so the collection build never sees them — and no
 * .cook file in this repository declares a capacity, which is T-011-03's work and not this
 * ticket's. The pattern is washing-up.test.ts's.
 */
describe('the capacity check, run for real', () => {
  const root = path.resolve(import.meta.dirname, '../..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'capacity-'));
  const folder = path.join(dir, 'stir-fries');
  fs.mkdirSync(folder, { recursive: true });

  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  /** A four-step stir-fry that sears, with whatever capacity and servings the case wants. */
  const write = (name: string, lines: { capacity: string; servings?: string; sear?: string }) => {
    const file = path.join(folder, `${name}.cook`);
    fs.writeFileSync(
      file,
      [
        '>> title: Probe',
        '>> category: Stir-Fries',
        '>> tags: probe',
        `>> servings: ${lines.servings ?? '4'}`,
        lines.capacity,
        '',
        '>> step: velvet, rest 30 min',
        'Toss @flank steak{1%lb} with @egg white{1} and ~rest{30%min} in the fridge.',
        '',
        `>> step: ${lines.sear ?? 'sear 3 min, lift out'}`,
        'Sear @&(~1)velveted beef{} in @peanut oil{3%Tbs} in a very hot #wok{}, ~sear{3%min}.',
        '',
        '>> step: stir-fry the aromatics 1 min',
        'Stir-fry @garlic{3%cloves} and @fresh ginger{1%Tbs} with @&(~1)seared beef{} ~stirfry{1%min}.',
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

  it('fails a capacity below servings, naming both lines', () => {
    const { code, out } = run(
      write('probe-contradiction', { capacity: '>> capacity: 2 — the wok, sear', servings: '8' }),
    );
    expect(code).toBe(1);
    expect(out).toContain('FAIL');
    expect(out).toContain('capacity and servings disagree');
    // Both lines, quoted as they were written. This is the criterion's "show it".
    expect(out).toContain('>> capacity: 2 — the wok, sear');
    expect(out).toContain('>> servings: 8');
  });

  it('allows a capacity below servings when the step says where it batches', () => {
    // beef-with-broccoli's own case: s = 4, c = 2, and the label says "in two batches".
    const { code, out } = run(
      write('probe-batches', {
        capacity: '>> capacity: 2 — the wok, sear',
        sear: 'sear in two batches 3 min, lift out',
      }),
    );
    expect(code).toBe(0);
    expect(out).toContain('  ok   ');
    expect(out).not.toContain('capacity and servings disagree');
  });

  it('says nothing at all when the vessel holds what the recipe makes', () => {
    const { code, out } = run(write('probe-quiet', { capacity: '>> capacity: 4 — the wok, sear' }));
    expect(code).toBe(0);
    expect(out).toContain('  ok   ');
    expect(out).not.toContain('capacity and servings disagree');
    expect(out).not.toContain('is not a plain count');
  });

  it('fails a capacity that binds an operation the recipe does not have', () => {
    const { code, out } = run(write('probe-unbound', { capacity: '>> capacity: 4 — the wok, deep-fry' }));
    expect(code).toBe(1);
    expect(out).toContain('not an operation in this recipe');
    // The labels it tried, so the fix is a word the author can see.
    expect(out).toContain('velvet, rest 30 min');
  });

  it('fails a line that is there but not whole', () => {
    expect(run(write('probe-bare', { capacity: '>> capacity: 4' })).out).toContain('names no vessel');
    expect(run(write('probe-vessel', { capacity: '>> capacity: 4 — the wok' })).out).toContain(
      'not what it bounds',
    );
    expect(run(write('probe-batch-claim', { capacity: '>> capacity: 2 batches — the wok, sear' })).out)
      .toContain('counts batches rather than servings');
    expect(run(write('probe-bare', { capacity: '>> capacity: 4' })).code).toBe(1);
  });

  it('warns, and does not fail, when servings is not a number to compare against', () => {
    const { code, out } = run(
      write('probe-volume', { capacity: '>> capacity: 4 — the wok, sear', servings: '2 cups' }),
    );
    expect(code).toBe(0);
    expect(out).toContain('is not a plain count of servings');
  });
});
