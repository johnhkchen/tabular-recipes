import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import {
  boundSteps,
  type Capacity,
  costOf,
  readCapacity,
  saysItBatches,
  servingsOf,
} from './scaling.ts';
import { buildSchedule, handsOnEvidence } from './schedule.ts';
import { type Attention, type AttentionSource, readTimers } from './time.ts';
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

/* ---- the worked examples, which are the ones that matter ------------------- */

/*
 * docs/knowledge/scaling.md computed every figure below by hand, and the ticket says that
 * where the code and that file disagree the file is right and the code is a bug. So these are
 * the oracle: they are the model's own arithmetic, not this module's opinion of it.
 */
const withCapacity = (slug: string, line: string): RawRecipe => ({
  ...real(slug),
  capacity: capacity(line),
});

const cost = (recipe: RawRecipe, wanted: number) => {
  const answer = costOf(recipe, wanted);
  if (!answer) throw new Error(`no cost for ${recipe.slug} at ${wanted}`);
  return answer;
};

const nearest = (minutes: number) => Math.round(minutes);

describe('§7, the five dishes worked from the collection', () => {
  it('1. chili-con-carne, 6 → 18: the pole where nothing binds', () => {
    const answer = cost(real('chili-con-carne'), 18);
    expect(answer.elapsed.at).toBe(120);
    expect(answer.standing.at).toBe(0);
    // "Cooking three times as much costs you nothing extra" is this, and only this.
    expect(answer.elapsed.flat).toBe(true);
    expect(answer.bounded).toBe(false);
    // …with the caveat §4.6 exists for: four of its five operations are untimed.
    expect(answer.evidence).toBe('unknown');
    expect(answer.untimedCount).toBe(4);
  });

  it('2. karaage, 4 → 12: batches, and the oil costs nothing', () => {
    const answer = cost(real('karaage'), 12);
    expect(answer.elapsed.at).toBe(47.5);
    expect(answer.standing.at).toBe(7.5);
    // Declared or not, the answer is the same: what the pot bounds is 2.5 minutes of frying.
    const bounded = cost(withCapacity('karaage', '4 — the oil, fry'), 12);
    expect(bounded.elapsed.at).toBe(47.5);
    expect(bounded.batches.costMinutes).toBe(0);
  });

  it('3. beef-with-broccoli, 4 → 12: the wok binds, and it costs nothing', () => {
    const answer = cost(withCapacity('beef-with-broccoli', '2 — the wok, sear'), 12);
    expect(answer.elapsed.at).toBe(42);
    expect(answer.standing.at).toBe(12);
    expect(answer.batches).toMatchObject({ written: 2, at: 6, ratio: 3, binds: true });
    // §3's "what the capacity bought": the same 42 minutes with no capacity at all.
    expect(answer.batches.costMinutes).toBe(0);
    expect(cost(real('beef-with-broccoli'), 12).elapsed.at).toBe(42);
  });

  it('3b. and it is not 102 — the wrong reading puts the batches on the fridge', () => {
    // r·A + m·H = 3·30 + 3·4. Nobody's fridge holds less because the wok does.
    const answer = cost(withCapacity('beef-with-broccoli', '2 — the wok, sear'), 12);
    expect(answer.elapsed.at).not.toBe(102);
  });

  it('4. gumbo, 8 → 24: nothing binds and it still scales worst', () => {
    const answer = cost(real('gumbo'), 24);
    expect(answer.elapsed.at).toBe(200);
    expect(answer.standing.at).toBe(147);
    // The best-evidenced recipe in the collection, and the model is still wrong about it
    // (§4.3): three times the roux in a wider pan is not 105 minutes of stirring.
    expect(answer.evidence).toBe('stated');
    expect(answer.untimedCount).toBe(0);
  });

  it('5. gyoza, 4 → 12: the model prices it too cheaply, and says so', () => {
    const answer = cost(real('gyoza'), 12);
    expect(answer.elapsed.at).toBe(84);
    expect(answer.standing.at).toBe(48);
    // Rolling and pleating are untimed, so the figure is a floor by two whole operations.
    expect(answer.untimedCount).toBe(2);
  });
});

describe('§7, the air fryer pole', () => {
  /*
   * No .cook file yet — §7 builds it from the measured figures in docs/gaps/air-fryer-and-pot.md:
   * a basket load is about 20 minutes of waiting, it holds about four servings, and the work
   * around it is about two minutes.
   */
  const basket = fixture(
    'basket',
    [
      { label: 'toss the wings in the rub 2 min', timers: [timer(2, 'hands-on')] },
      { label: 'roast in the basket 20 min', refs: [0], timers: [timer(20, 'unattended')] },
    ],
    { metadata: { servings: '4' }, capacity: capacity('4 — the basket, roast') },
  );

  it('costs 66 minutes for twelve, against 26 with the capacity taken away', () => {
    const answer = cost(basket, 12);
    expect(answer.elapsed.at).toBe(66);
    expect(answer.batches).toMatchObject({ written: 1, at: 3, ratio: 3 });

    const unbounded = cost({ ...basket, capacity: null }, 12);
    expect(unbounded.elapsed.at).toBe(26);
    expect(answer.batches.costMinutes).toBe(40);
  });

  it('is the whole argument: a wait inside the batch costs, and frying does not', () => {
    // §7: both batch, and only one of them costs anything.
    expect(cost(basket, 12).batches.costMinutes).toBe(40);
    expect(cost(withCapacity('karaage', '4 — the oil, fry'), 12).batches.costMinutes).toBe(0);
  });
});

describe('§8, the two situations', () => {
  const beef = withCapacity('beef-with-broccoli', '2 — the wok, sear');

  it('"exhausted, two meals for one": every dish at n = 2', () => {
    const table: [RawRecipe, number, number][] = [
      [beef, 32, 2],
      [real('karaage'), 41, 1],
      [real('gyoza'), 44, 8],
      [real('gumbo'), 65, 12],
      [real('chili-con-carne'), 120, 0],
    ];
    for (const [recipe, elapsed, standing] of table) {
      const answer = cost(recipe, 2);
      expect(nearest(answer.elapsed.at), recipe.slug).toBe(elapsed);
      expect(nearest(answer.standing.at), recipe.slug).toBe(standing);
    }
  });

  it('scaling down takes a batch away without being told', () => {
    // §3: b(2)/b(4) = 1/2, so the wok stops binding altogether.
    const answer = cost(beef, 2);
    expect(answer.batches).toMatchObject({ written: 2, at: 1, ratio: 0.5, binds: false });
  });

  it('"stressed, six people, over three days": every dish at n = 18', () => {
    const table: [RawRecipe, number, number][] = [
      [beef, 48, 18],
      [real('chili-con-carne'), 120, 0],
      [real('gyoza'), 108, 72],
      [real('gumbo'), 163, 110],
    ];
    for (const [recipe, elapsed, standing] of table) {
      const answer = cost(recipe, 18);
      expect(nearest(answer.elapsed.at), recipe.slug).toBe(elapsed);
      expect(nearest(answer.standing.at), recipe.slug).toBe(standing);
    }
  });

  it('vindaloo is the shape chili is, more extreme: tripling adds 26 minutes', () => {
    // §8: A = 780, H = 13, so 3× a fourteen-hour recipe costs 2·13 more minutes.
    const answer = cost(real('vindaloo'), 18);
    expect(answer.elapsed.written).toBe(793);
    expect(answer.elapsed.at).toBe(819);
  });
});

/* ---- the five cases the acceptance criteria name --------------------------- */

describe('what scaling does to each figure', () => {
  /** A pot: a wait nothing bounds, and some work around it. */
  const pot = fixture('pot', [
    { label: 'chop the onions 10 min', timers: [timer(10, 'hands-on')] },
    { label: 'simmer 60 min', refs: [0], timers: [timer(60)] },
  ]);

  /** The same recipe with a basket around the wait. */
  const basket = fixture(
    'basket',
    [
      { label: 'chop the onions 10 min', timers: [timer(10, 'hands-on')] },
      { label: 'roast in the basket 60 min', refs: [0], timers: [timer(60)] },
    ],
    { capacity: capacity('4 — the basket, roast') },
  );

  it('an unbounded recipe at 3×: the clock does not move, the chopping triples', () => {
    const answer = cost(pot, 12);
    expect(answer.elapsed).toEqual({ written: 70, at: 90, factor: 1.29, flat: false });
    expect(answer.standing).toEqual({ written: 10, at: 30, factor: 3, flat: false });
    // The wait is untouched: 60 minutes of simmering is 60 minutes of simmering.
    expect(answer.elapsed.at - answer.standing.at).toBe(60);
    expect(answer.batches).toMatchObject({ written: 1, at: 1, ratio: 1, binds: false });
  });

  it('a bounded recipe at 3×: elapsed and standing both go up by the batch count', () => {
    const answer = cost(basket, 12);
    expect(answer.batches).toMatchObject({ written: 1, at: 3, ratio: 3, binds: true });
    // Three loads of an hour, one after another, plus three times the chopping.
    expect(answer.elapsed.at).toBe(210);
    expect(answer.standing.at).toBe(30);
    // What the vessel cost: two extra hours nobody had before.
    expect(answer.batches.costMinutes).toBe(120);
    expect(answer.elapsed.at - cost(pot, 12).elapsed.at).toBe(120);
  });

  it('a recipe at 0.5×: nothing batches and the hands-on figure halves', () => {
    const answer = cost(basket, 2);
    expect(answer.batches).toMatchObject({ written: 1, at: 1, ratio: 1, binds: false });
    expect(answer.standing.at).toBe(5);
    expect(answer.elapsed.at).toBe(65);
  });

  it('a recipe with no capacity declared says so, and prices the vessel at nothing', () => {
    const answer = cost(pot, 12);
    expect(answer.bounded).toBe(false);
    expect(answer.batches.costMinutes).toBe(0);
    // §6's row is "nobody has measured what the pan holds for this one" — a fact about the
    // file, not a claim that nothing binds. `bounded` is what a page reads to say it.
    expect(cost(basket, 12).bounded).toBe(true);
  });

  it('a recipe whose hands-on figure is entirely assumed carries the guess, multiplied', () => {
    // Nothing in the step says whether you stand there, so time.ts falls back to hands-on:
    // the minutes are real and the reading is ours.
    const assumed = fixture('assumed', [
      { label: 'do the thing 20 min', timers: [timer(20, 'hands-on', 'default')] },
      { label: 'and then this', refs: [0] },
    ]);
    const answer = cost(assumed, 12);
    expect(answer.evidence).toBe('unknown');
    expect(answer.standing.at).toBe(60);
    // The part nobody claimed grew exactly as fast as the figure it sits inside.
    expect(answer.assumedStandingMinutes).toBe(60);
  });

  it('never lets a scaled figure look more certain than the one it scaled', () => {
    const strong = { stated: 3, inferred: 2, unknown: 1 } as const;
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      const before = handsOnEvidence(schedule);
      for (const wanted of [1, 2, 3, 12, 48]) {
        const answer = costOf(recipe, wanted);
        if (!answer) continue;
        expect(strong[answer.evidence], `${recipe.slug} at ${wanted}`).toBeLessThanOrEqual(
          strong[before],
        );
      }
    }
  });

  it('grows the assumed part of the figure whenever the figure grows', () => {
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      if (schedule.assumedHandsOnMinutes === 0) continue;
      const answer = costOf(recipe, servingsOf(recipe)! * 3);
      expect(answer!.assumedStandingMinutes, recipe.slug).toBeGreaterThanOrEqual(
        schedule.assumedHandsOnMinutes,
      );
    }
  });

  it('is null when there is no baseline to scale from, rather than inventing one', () => {
    const vague = fixture('vague', [{ label: 'stir' }], { metadata: { servings: 'plenty' } });
    expect(costOf(vague, 12)).toBeNull();
    expect(costOf(pot, 0)).toBeNull();
    expect(costOf(pot, -4)).toBeNull();
    expect(costOf(pot, Number.NaN)).toBeNull();
  });
});

/* ---- no notation escapes --------------------------------------------------- */

describe('what a Cost is allowed to contain', () => {
  const basketFixture = fixture(
    'basket-contract',
    [
      { label: 'toss the wings in the rub 2 min', timers: [timer(2, 'hands-on')] },
      { label: 'roast in the basket 20 min', refs: [0], timers: [timer(20)] },
    ],
    { capacity: capacity('4 — the basket, roast') },
  );

  const values = (value: unknown): unknown[] =>
    value !== null && typeof value === 'object'
      ? Object.values(value).flatMap(values)
      : [value];

  it('holds no string a page could print — only the confidence enum', () => {
    const answers = [
      cost(real('gumbo'), 24),
      cost(withCapacity('beef-with-broccoli', '2 — the wok, sear'), 12),
      cost(real('chili-con-carne'), 18),
    ];
    for (const answer of answers) {
      for (const value of values(answer)) {
        if (typeof value !== 'string') continue;
        expect(['stated', 'inferred', 'unknown']).toContain(value);
      }
    }
  });

  it("never hands back the vessel's own words, which are the author's to print", () => {
    const answer = cost(withCapacity('beef-with-broccoli', '2 — the wok, sear'), 12);
    expect(JSON.stringify(answer)).not.toContain('wok');
    expect(JSON.stringify(answer)).not.toContain('sear');
  });

  it('says nothing in notation and nothing in words', () => {
    // The keys are this module's own names — `batches`, `elapsed` — and are not printed. It
    // is the VALUES that would reach a card, so it is the values that are checked.
    for (const answer of [cost(real('gumbo'), 24), cost(basketFixture, 12)]) {
      for (const value of values(answer)) {
        if (typeof value !== 'string') continue;
        expect(value).not.toMatch(/O\(/);
        expect(value).not.toMatch(/×|three times|costs you nothing|one load|batch/i);
      }
    }
  });
});

/* ---- the whole collection -------------------------------------------------- */

describe('every recipe in the collection', () => {
  it('reads its timers exactly the way the schedule does', () => {
    /*
     * scaling.ts re-reads each step's timers to get the hands-on/unattended split PER TASK,
     * which the schedule computes and does not publish. This is the guard on that
     * duplication: sum the re-read split over every task and it has to reproduce the
     * schedule's own two totals, on every recipe, or the two files have started disagreeing.
     */
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      const steps = new Map(recipe.steps.map((step) => [step.index, step]));
      let handsOn = 0;
      let unattended = 0;
      for (const task of schedule.tasks) {
        const step = steps.get(Number(task.id.slice(1)));
        const readings = readTimers(step?.timers ?? [], task.label);
        for (const [i, t] of (step?.timers ?? []).entries()) {
          if (t.minutes === null || !Number.isFinite(t.minutes)) continue;
          if (readings[i].attention === 'unattended') unattended += t.minutes;
          else handsOn += t.minutes;
        }
      }
      expect(Math.round(handsOn * 100) / 100, recipe.slug).toBe(schedule.handsOnMinutes);
      expect(Math.round(unattended * 100) / 100, recipe.slug).toBe(schedule.unattendedMinutes);
    }
  });

  it('costs something finite at every multiplier the plan page offers', () => {
    for (const recipe of all) {
      const s = servingsOf(recipe)!;
      for (const multiplier of [0.5, 1, 2, 3]) {
        const answer = costOf(recipe, s * multiplier);
        expect(answer, recipe.slug).not.toBeNull();
        for (const value of Object.values(answer!.elapsed)) {
          if (typeof value === 'number') expect(Number.isFinite(value), recipe.slug).toBe(true);
        }
        expect(answer!.elapsed.at, recipe.slug).toBeGreaterThanOrEqual(answer!.standing.at);
        expect(answer!.longest.at, recipe.slug).toBeLessThanOrEqual(answer!.standing.at + 0.01);
      }
    }
  });

  it('leaves the written figures exactly as the schedule published them', () => {
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      const answer = costOf(recipe, servingsOf(recipe)!)!;
      expect(answer.standing.written, recipe.slug).toBe(schedule.handsOnMinutes);
      expect(answer.longest.written, recipe.slug).toBe(schedule.longestHandsOnMinutes);
      // At the size it is written for, nothing has been scaled at all.
      expect(answer.servings.multiplier, recipe.slug).toBe(1);
      expect(answer.standing.at, recipe.slug).toBe(schedule.handsOnMinutes);
    }
  });
});
