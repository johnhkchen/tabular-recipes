/*
 * Two kinds of test here and they are doing different jobs.
 *
 * The hand-built meals pin the FIVE COLLISIONS the ticket names, at sizes small enough to check the
 * arithmetic by hand. The whole-collection tests pin the thing that would actually go wrong quietly:
 * this file re-reads timers to place hands-on work, and if that reading ever drifts from the one
 * schedule.ts and scaling.ts make, the meal page and the recipe page start disagreeing.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { A_DAY, diagnose, type Finding, type FindingKind, handsOnSpansOf } from './meal.ts';
import { costOf } from './scaling.ts';
import { buildSchedule } from './schedule.ts';
import type { Attention, AttentionSource } from './time.ts';
import type { RawIngredient, RawRecipe, RawTimer } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const real = (slug: string): RawRecipe => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return recipe;
};

/* ---- hand-built meals ------------------------------------------------------ */

/** tree.ts's RawTimer predates the `source` the parser writes; the schedule reads it. */
type Timer = RawTimer & { source: AttentionSource };

/*
 * buildSchedule() re-reads every timer with readTimers(), so a fixture's stored `attention` and
 * `source` are ignored and the TIMER NAME is what decides both the reading and its confidence. A
 * recognised name — `roast`, `stir` — is the author saying it outright and reads `stated`; an
 * unnamed timer over a label with no cooking word in it falls through to the hands-on default and
 * reads `unknown`, which is the "nobody said" case this file has to be honest about.
 */
const timer = (
  name: string | null,
  minutes: number,
  attention: Attention = 'unattended',
): Timer => ({ name, text: `${minutes} min`, minutes, attention, source: 'name' });

const ingredient = (name: string): RawIngredient => ({
  name,
  quantity: '',
  note: null,
  display: name,
  amount: { value: null, unit: null },
});

interface StepSpec {
  label: string;
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
    keeps: null,
    capacity: null,
    aka: [],
    pairsWith: [],
    variants: [],
    ingredientNames: [],
    cookware: [],
    metadata: { servings: '4' },
    steps: steps.map((step, index) => ({
      index,
      rawLabel: step.label,
      labelOverride: step.label,
      ingredients: step.refs?.length ? [] : [ingredient(`${slug}-${index}`)],
      refs: step.refs ?? [],
      timers: step.timers ?? [],
    })),
    ...extra,
  };
}

/** A dish that is nothing but one spell in the oven, at a stated temperature. */
const roast = (slug: string, celsius: number, minutes: number): RawRecipe =>
  fixture(slug, [
    { label: `roast ${celsius}°C ${minutes} min`, timers: [timer('roast', minutes)] },
  ]);

/**
 * A dish that is nothing but hands-on work, at the very end.
 *
 * `claimed: false` is the recipe saying nothing at all — an unnamed timer over a label with no
 * cooking word in it, which is exactly how the schedule collects minutes nobody ever claimed.
 */
const chopping = (slug: string, minutes: number, claimed = true): RawRecipe =>
  claimed
    ? fixture(slug, [{ label: `stir ${minutes} min`, timers: [timer('stir', minutes, 'hands-on')] }])
    : fixture(slug, [{ label: `work it ${minutes} min`, timers: [timer(null, minutes, 'hands-on')] }]);

const kinds = (findings: Finding[]): FindingKind[] => findings.map((f) => f.kind);
const only = (findings: Finding[], kind: FindingKind): Finding[] =>
  findings.filter((f) => f.kind === kind);
const one = (findings: Finding[], kind: FindingKind): Finding => {
  const found = only(findings, kind);
  if (found.length !== 1) throw new Error(`expected one ${kind}, got ${found.length}`);
  return found[0];
};

const dish = (recipe: RawRecipe, servings: number, madeAhead = false) => ({
  recipe,
  servings,
  madeAhead,
});

/* ---- the oven -------------------------------------------------------------- */

describe('two dishes wanting the oven at once', () => {
  const meal = {
    dishes: [dish(roast('long-roast', 180, 60), 4), dish(roast('short-roast', 180, 30), 4)],
  };

  it('names both, over the stretch they overlap', () => {
    const shared = one(diagnose(meal).findings, 'oven-shared');
    expect(shared.dishes).toEqual(['long-roast', 'short-roast']);
    // Both end at the hour; the short one only joins for its last thirty minutes.
    expect(shared.window).toEqual({ from: -30, to: 0 });
    expect(shared.wanted).toBe(2);
    expect(shared.celsius).toEqual([180]);
  });

  it('does not call it a clash, because 180 and 180 share an oven', () => {
    expect(kinds(diagnose(meal).findings)).not.toContain('oven-clash');
  });

  it('says nothing about crowding until somebody says how many shelves there are', () => {
    expect(kinds(diagnose(meal).findings)).not.toContain('oven-crowded');
    expect(kinds(diagnose({ ...meal, ovenShelves: 1 }).findings)).toContain('oven-crowded');
    expect(kinds(diagnose({ ...meal, ovenShelves: 2 }).findings)).not.toContain('oven-crowded');
  });

  it('leaves two roasts that merely touch alone', () => {
    // 60 min ending at 0, and 30 min ending at -60: back to back, never together.
    const early = fixture('early-roast', [
      { label: 'roast 180°C 30 min', timers: [timer('roast', 30)] },
      { label: 'roast 180°C 60 min', refs: [0], timers: [timer('roast', 60)] },
    ]);
    const findings = diagnose({ dishes: [dish(early, 4)] }).findings;
    expect(only(findings, 'oven-shared')).toEqual([]);
  });
});

describe('two dishes wanting the oven at incompatible temperatures', () => {
  const meal = {
    dishes: [dish(roast('low-and-slow', 180, 60), 4), dish(roast('hot-and-fast', 230, 20), 4)],
  };

  it('is a clash, and carries both temperatures', () => {
    const clash = one(diagnose(meal).findings, 'oven-clash');
    expect(clash.dishes).toEqual(['hot-and-fast', 'low-and-slow']);
    expect(clash.celsius).toEqual([180, 230]);
    expect(clash.window).toEqual({ from: -20, to: 0 });
  });

  it('is not also reported as sharing, because it cannot be shared', () => {
    expect(only(diagnose(meal).findings, 'oven-shared')).toEqual([]);
  });

  it('lets a fifteen-degree difference share, and refuses fifty', () => {
    const near = { dishes: [dish(roast('a', 175, 60), 4), dish(roast('b', 190, 60), 4)] };
    expect(kinds(diagnose(near).findings)).toContain('oven-shared');
    expect(kinds(diagnose(near).findings)).not.toContain('oven-clash');
  });
});

/* ---- the cook -------------------------------------------------------------- */

describe('a hands-on pile-up in the final hour', () => {
  /*
   * Three dishes, each twenty minutes of chopping, each ending at the hour. Nothing can start
   * before −20, so sixty minutes of work is asked for in a twenty-minute window. One cook has
   * twenty of those minutes. No ordering fixes it, which is why the finding does not need one.
   */
  const meal = {
    dishes: [dish(chopping('one', 20), 4), dish(chopping('two', 20), 4), dish(chopping('three', 20), 4)],
  };

  it('states the window, what it asks for and what there is', () => {
    const crunch = one(diagnose(meal).findings, 'hands-pile-up');
    expect(crunch.window).toEqual({ from: -20, to: 0 });
    expect(crunch.wanted).toBe(60);
    expect(crunch.have).toBe(20);
    expect(crunch.overrunMinutes).toBe(40);
    expect(crunch.dishes).toEqual(['one', 'three', 'two']);
  });

  it('grows the work with the servings, because chopping does', () => {
    const doubled = {
      dishes: meal.dishes.map((d) => ({ ...d, servings: 8 })),
    };
    expect(one(diagnose(doubled).findings, 'hands-pile-up').wanted).toBe(120);
  });

  it('says nothing when the afternoon is long enough for the work', () => {
    // The same sixty minutes of chopping, spread over three hours instead of twenty minutes.
    const spread = fixture('spread', [
      { label: 'stir 20 min', timers: [timer('stir', 20, 'hands-on')] },
      { label: 'rest 80 min', refs: [0], timers: [timer('rest', 80)] },
      { label: 'stir 20 min', refs: [1], timers: [timer('stir', 20, 'hands-on')] },
    ]);
    expect(kinds(diagnose({ dishes: [dish(spread, 4)] }).findings)).not.toContain('hands-pile-up');
  });
});

describe('the same meal with two cooks instead of one', () => {
  const dishes = [dish(chopping('one', 20), 4), dish(chopping('two', 20), 4)];

  it('clears the pile-up that one cook could not do', () => {
    // Forty minutes of work in the last twenty. One cook is ten short; two cooks are exactly level.
    const alone = one(diagnose({ dishes }).findings, 'hands-pile-up');
    expect(alone.overrunMinutes).toBe(20);
    expect(kinds(diagnose({ dishes, cooks: 2 }).findings)).not.toContain('hands-pile-up');
  });

  it('changes nothing about the oven, which does not care how many of you there are', () => {
    const withOven = [...dishes, dish(roast('a', 180, 60), 4), dish(roast('b', 180, 60), 4)];
    const alone = only(diagnose({ dishes: withOven }).findings, 'oven-shared');
    const together = only(diagnose({ dishes: withOven, cooks: 2 }).findings, 'oven-shared');
    expect(together).toEqual(alone);
  });
});

/* ---- the hob --------------------------------------------------------------- */

describe('the burners', () => {
  const simmer = (slug: string, minutes: number) =>
    fixture(slug, [{ label: `simmer ${minutes} min`, timers: [timer('simmer', minutes)] }]);

  it('says nothing while there are enough of them', () => {
    const four = ['a', 'b', 'c', 'd'].map((slug) => dish(simmer(slug, 30), 4));
    expect(kinds(diagnose({ dishes: four }).findings)).not.toContain('hob-crowded');
  });

  it('names the pans when there are more of them than burners', () => {
    const five = ['a', 'b', 'c', 'd', 'e'].map((slug) => dish(simmer(slug, 30), 4));
    const crowded = one(diagnose({ dishes: five }).findings, 'hob-crowded');
    expect(crowded.wanted).toBe(5);
    expect(crowded.have).toBe(4);
    expect(crowded.dishes).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(kinds(diagnose({ dishes: five, burners: 6 }).findings)).not.toContain('hob-crowded');
  });

  it('never reads more confidently than a burner deserves', () => {
    // There is no `400°F` for a burner, so a hob reading is never the author's own word.
    const five = ['a', 'b', 'c', 'd', 'e'].map((slug) => dish(simmer(slug, 30), 4));
    expect(one(diagnose({ dishes: five }).findings, 'hob-crowded').confidence).not.toBe('stated');
  });
});

/* ---- being guessed at ------------------------------------------------------ */

describe('a meal where one recipe is entirely assumed', () => {
  const guessed = chopping('guessed', 20, false);
  const stated = chopping('stated', 20);

  it('drags every finding built on its minutes down to "nobody said"', () => {
    const crunch = one(diagnose({ dishes: [dish(guessed, 4), dish(stated, 4)] }).findings, 'hands-pile-up');
    expect(crunch.confidence).toBe('unknown');
    expect(costOf(stated, 4)!.evidence).toBe('stated');
  });

  it('does not drag down an oven finding it has nothing to do with', () => {
    const findings = diagnose({
      dishes: [dish(guessed, 4), dish(roast('a', 180, 60), 4), dish(roast('b', 180, 60), 4)],
    }).findings;
    expect(one(findings, 'oven-shared').confidence).toBe('stated');
    // The blunt answer is still available, and it is still the weakest recipe in the meal.
    expect(
      diagnose({
        dishes: [dish(guessed, 4), dish(roast('a', 180, 60), 4)],
      }).evidence,
    ).toBe('unknown');
  });
});

/* ---- what comes out of the day --------------------------------------------- */

describe('making something ahead', () => {
  const keeper = fixture(
    'keeper',
    [{ label: 'stir 20 min', timers: [timer('stir', 20, 'hands-on')] }],
    { keeps: { text: '3 days', minutes: 3 * A_DAY, character: 'better on the second' } },
  );

  it('offers the dish that keeps, and only inside the crunch', () => {
    const meal = { dishes: [dish(keeper, 4), dish(chopping('other', 20), 4)] };
    const offer = one(diagnose(meal).findings, 'make-ahead-available');
    expect(offer.dishes).toEqual(['keeper']);
    expect(offer.overrunMinutes).toBe(20);
  });

  it('takes its work off the clock entirely when it is moved', () => {
    const meal = { dishes: [dish(keeper, 4, true), dish(chopping('other', 20), 4)] };
    const after = diagnose(meal);
    expect(kinds(after.findings)).not.toContain('hands-pile-up');
    expect(after.standingMinutes).toBe(20);
    expect(after.dishes.find((d) => d.slug === 'keeper')!.madeAhead).toBe(true);
  });

  it('refuses to believe a dish keeps just because a caller moved it', () => {
    const meal = { dishes: [dish(chopping('never-said', 20), 4, true)] };
    const doubt = one(diagnose(meal).findings, 'made-ahead-unclaimed');
    expect(doubt.dishes).toEqual(['never-said']);
    expect(doubt.confidence).toBe('unknown');
  });
});

describe('a vessel that binds', () => {
  it('says the target needs more loads than the recipe was measured at', () => {
    const basket = real('air-fryer-sweet-potatoes');
    expect(basket.capacity).not.toBeNull();
    const binds = one(diagnose({ dishes: [dish(basket, 12)] }).findings, 'vessel-binds');
    expect(binds.wanted).toBe(3);
    expect(binds.have).toBe(1);
    expect(binds.overrunMinutes).toBe(costOf(basket, 12)!.batches.costMinutes);
  });
});

/* ---- the promises this file makes ------------------------------------------ */

describe('it never schedules anything', () => {
  const slugs = ['baked-turkey-wings', 'cornbread-dressing', 'crispy-roast-potatoes', 'candied-yams'];

  it('leaves every dish exactly where its own recipe put it', () => {
    for (const slug of slugs) {
      const recipe = real(slug);
      const schedule = buildSchedule(recipe);
      const load = diagnose({ dishes: [dish(recipe, 10)] }).dishes[0];
      // The only thing that happened to it is the shift that lands its last operation at the hour.
      expect(`${slug}: ${load.startsAt}`).toBe(`${slug}: ${-schedule.totalMinutes}`);
    }
  });

  it('gives the same answer twice', () => {
    const meal = { dishes: slugs.map((slug) => dish(real(slug), 10)), cooks: 1 };
    expect(diagnose(meal)).toEqual(diagnose(meal));
  });

  it('has nothing to say about an empty meal', () => {
    expect(diagnose({ dishes: [] })).toMatchObject({
      findings: [],
      dishes: [],
      standingMinutes: 0,
      startsAt: 0,
    });
  });
});

describe('the hands-on reading is the schedule’s own', () => {
  it('reproduces handsOnMinutes on every recipe in the collection', () => {
    const wrong: string[] = [];
    for (const recipe of all) {
      const schedule = buildSchedule(recipe);
      const summed =
        Math.round(
          handsOnSpansOf(recipe, schedule).reduce((total, span) => total + span.minutes, 0) * 100,
        ) / 100;
      if (Math.abs(summed - schedule.handsOnMinutes) > 0.01) {
        wrong.push(`${recipe.slug}: ${summed} vs ${schedule.handsOnMinutes}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('reproduces the cost function’s standing figure once it is scaled', () => {
    const wrong: string[] = [];
    for (const recipe of all) {
      const cost = costOf(recipe, 12);
      if (!cost) continue;
      const load = diagnose({ dishes: [dish(recipe, 12)] });
      if (Math.abs(load.standingMinutes - cost.standing.at) > 0.05) {
        wrong.push(`${recipe.slug}: ${load.standingMinutes} vs ${cost.standing.at}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});

describe('nothing here is a string a page could print', () => {
  const KINDS = new Set<string>([
    'oven-clash',
    'oven-shared',
    'oven-crowded',
    'hob-crowded',
    'hands-pile-up',
    'vessel-binds',
    'make-ahead-available',
    'made-ahead-unclaimed',
  ]);
  const LEVELS = new Set(['stated', 'inferred', 'unknown']);
  const bySlug = new Set(all.map((r) => r.slug));

  it('returns only enum members and slugs', () => {
    const meal = {
      dishes: [
        'baked-turkey-wings',
        'cornbread-dressing',
        'crispy-roast-potatoes',
        'candied-yams',
        'sweet-potato-pie',
        'mashed-potatoes',
        'turkey-pan-gravy',
      ].map((slug) => dish(real(slug), 10)),
      cooks: 1,
    };
    const diagnosis = diagnose(meal);
    expect(diagnosis.findings.length).toBeGreaterThan(0);

    const strings: string[] = [];
    const walk = (value: unknown): void => {
      if (typeof value === 'string') strings.push(value);
      else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') Object.values(value).forEach(walk);
    };
    walk(diagnosis);

    const stray = strings.filter((s) => !KINDS.has(s) && !LEVELS.has(s) && !bySlug.has(s));
    expect(stray).toEqual([]);
  });
});
