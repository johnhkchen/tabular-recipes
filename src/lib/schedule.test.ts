import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { layout } from './layout.ts';
import { authorMinutesOf, buildSchedule, type Schedule, type Task } from './schedule.ts';
import type { Attention, AttentionSource } from './time.ts';
import { buildTree, type RawIngredient, type RawRecipe, type RawTimer } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const of = (slug: string): Schedule => {
  const recipe = all.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`no recipe fixture for ${slug}`);
  return buildSchedule(recipe);
};
const task = (schedule: Schedule, id: string): Task => {
  const found = schedule.tasks.find((t) => t.id === id);
  if (!found) throw new Error(`no task ${id}`);
  return found;
};
const spans = (schedule: Schedule) =>
  schedule.tasks.map((t) => `${t.label} ${t.start}-${t.end}`);

/* --- hand-built trees, so the arithmetic can be checked against a shape we chose --- */

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
  /** Indices of the steps this one consumes. Without them the step starts a branch. */
  refs?: number[];
  timers?: Timer[];
}

/** A recipe with the tree we want and nothing else: every leaf step gets one ingredient. */
function fixture(slug: string, steps: StepSpec[], metadata: Record<string, string> = {}): RawRecipe {
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
    aka: [],
    pairsWith: [],
    variants: [],
    ingredientNames: [],
    cookware: [],
    metadata,
    steps: steps.map((step, index) => ({
      index,
      rawLabel: step.label,
      labelOverride: step.label,
      ingredients: step.refs?.length ? [] : [ingredient(`${slug}-${index}`)],
      refs: step.refs ?? [],
      timers: step.timers ?? [],
    })),
  };
}

describe('a linear chain', () => {
  // stir (untimed) → rest 30 min → bake 45 min
  const schedule = buildSchedule(
    fixture('chain', [
      { label: 'stir' },
      { label: 'rest 30 min', refs: [0], timers: [timer(30)] },
      { label: 'bake 45 min', refs: [1], timers: [timer(45)] },
    ]),
  );

  it('starts each step when the one before it ends', () => {
    expect(spans(schedule)).toEqual(['stir 0-0', 'rest 30 min 0-30', 'bake 45 min 30-75']);
  });

  it('adds the chain up, because nothing here is concurrent', () => {
    expect(schedule.totalMinutes).toBe(75);
  });

  it('leaves the untimed step out of the chain that sets the total', () => {
    // "stir" ends at zero, so nothing waits on it; the chain starts where time starts.
    expect(schedule.criticalPath).toEqual(['s1', 's2']);
    expect(schedule.untimedCount).toBe(1);
  });

  it('needs only one lane, since nothing overlaps', () => {
    expect(schedule.lanes).toHaveLength(1);
    expect(schedule.lanes[0].map((t) => t.id)).toEqual(['s0', 's1', 's2']);
  });
});

describe('two branches that do not depend on each other', () => {
  // A braise and a glaze, made at the same time, then brought together.
  const schedule = buildSchedule(
    fixture('parallel', [
      { label: 'braise 3 hr', timers: [timer(180)] },
      { label: 'reduce 20 min', timers: [timer(20, 'hands-on', 'default')] },
      { label: 'glaze and rest 5 min', refs: [0, 1], timers: [timer(5)] },
    ]),
  );

  it('runs them at the same time — the glaze is made while the braise braises', () => {
    expect(task(schedule, 's0').start).toBe(0);
    expect(task(schedule, 's1').start).toBe(0);
  });

  it('makes the merge wait for the slower branch only', () => {
    expect(task(schedule, 's2').start).toBe(180);
    expect(schedule.totalMinutes).toBe(185);
  });

  it('reports the critical path, not the sum of the work', () => {
    const sum = schedule.tasks.reduce((total, t) => total + t.minutes, 0);
    expect(sum).toBe(205);
    expect(schedule.totalMinutes).toBeLessThan(sum);
    expect(schedule.criticalPath).toEqual(['s0', 's2']);
  });

  it('gives the concurrent branch its own lane', () => {
    expect(schedule.lanes.map((lane) => lane.map((t) => t.id))).toEqual([['s0', 's2'], ['s1']]);
  });

  it('splits the work by attention even though the elapsed time is shorter than both', () => {
    expect(schedule.handsOnMinutes).toBe(20);
    expect(schedule.unattendedMinutes).toBe(185);
  });
});

describe('two parallel one-hour waits', () => {
  const schedule = buildSchedule(
    fixture('two-rises', [
      { label: 'rise 1 hr', timers: [timer(60)] },
      { label: 'rise 1 hr', timers: [timer(60)] },
      { label: 'stack', refs: [0, 1] },
    ]),
  );

  it('takes one hour', () => {
    expect(schedule.totalMinutes).toBe(60);
  });

  it('still counts two hours of waiting as work done', () => {
    // Elapsed time and how much waiting the recipe contains are different questions.
    expect(schedule.unattendedMinutes).toBe(120);
  });
});

describe('a recipe that never says how long anything takes', () => {
  const schedule = buildSchedule(
    fixture('untimed', [
      { label: 'whisk' },
      { label: 'fold in', refs: [0] },
      { label: 'spoon into glasses', refs: [1] },
    ]),
  );

  it('gives every operation zero minutes rather than a plausible five', () => {
    expect(schedule.tasks.map((t) => t.minutes)).toEqual([0, 0, 0]);
    expect(schedule.tasks.every((t) => !t.timed)).toBe(true);
    expect(schedule.totalMinutes).toBe(0);
  });

  it('counts them, so a page can say so out loud', () => {
    expect(schedule.untimedCount).toBe(3);
  });

  it('will not claim to know whether you can walk away', () => {
    expect(schedule.tasks.map((t) => t.attention)).toEqual(['unknown', 'unknown', 'unknown']);
    expect(schedule.tasks.map((t) => t.confidence)).toEqual(['unknown', 'unknown', 'unknown']);
    expect(schedule.handsOnMinutes).toBe(0);
    expect(schedule.unattendedMinutes).toBe(0);
  });

  it('still gives every operation a slot on the timeline', () => {
    expect(schedule.lanes.flat()).toHaveLength(3);
    expect(schedule.criticalPath).toEqual(['s2']);
  });
});

describe('what a task says it knows', () => {
  const schedule = buildSchedule(
    fixture('confidence', [
      { label: 'chill', timers: [{ ...timer(60), name: 'chill', source: 'name' }] },
      { label: 'braise 2 hr', refs: [0], timers: [timer(120, 'unattended', 'label')] },
      { label: 'warm through', refs: [1], timers: [timer(6, 'hands-on', 'default')] },
    ]),
  );

  it('reads the timer’s own source', () => {
    expect(schedule.tasks.map((t) => t.confidence)).toEqual(['stated', 'inferred', 'unknown']);
  });

  it('does not dress an assumption up as a fact', () => {
    // "warm through" was never called hands-on by anyone; we assumed it.
    expect(task(schedule, 's2').attention).toBe('hands-on');
    expect(task(schedule, 's2').confidence).toBe('unknown');
  });
});

describe('a step with more than one timer', () => {
  const schedule = buildSchedule(
    fixture('mixed', [
      {
        label: 'sear 4 min, then braise 90 min',
        timers: [timer(4, 'hands-on', 'name'), timer(90, 'unattended', 'label')],
      },
    ]),
  );

  it('adds the timers together', () => {
    expect(task(schedule, 's0').minutes).toBe(94);
  });

  it('calls the whole step hands-on, because half of it needs you there', () => {
    expect(task(schedule, 's0').attention).toBe('hands-on');
  });

  it('still splits the minutes timer by timer, so nothing is miscounted', () => {
    expect(schedule.handsOnMinutes).toBe(4);
    expect(schedule.unattendedMinutes).toBe(90);
  });

  it('reports the weakest of the two readings', () => {
    expect(task(schedule, 's0').confidence).toBe('inferred');
  });
});

describe('a timer that times nothing', () => {
  const schedule = buildSchedule(
    fixture('unreadable', [{ label: 'rest', timers: [timer(null)] }]),
  );

  it('is not a time', () => {
    expect(task(schedule, 's0').timed).toBe(false);
    expect(task(schedule, 's0').minutes).toBe(0);
    expect(task(schedule, 's0').attention).toBe('unknown');
    expect(schedule.untimedCount).toBe(1);
  });
});

describe('authorMinutesOf', () => {
  it('reads the way a recipe writes its time', () => {
    expect(authorMinutesOf('45 min')).toBe(45);
    expect(authorMinutesOf('4 hr')).toBe(240);
    expect(authorMinutesOf('1 hr 20 min')).toBe(80);
    expect(authorMinutesOf('1 hour 30 min')).toBe(90);
    expect(authorMinutesOf('2 days')).toBe(2880);
    expect(authorMinutesOf('3 hr 15 min')).toBe(195);
    expect(authorMinutesOf('90 sec')).toBe(1.5);
    expect(authorMinutesOf(' 1 hr and 20 min ')).toBe(80);
  });

  it('says it cannot read something rather than guessing at it', () => {
    expect(authorMinutesOf('overnight')).toBeNull();
    expect(authorMinutesOf('30 to 40 min')).toBeNull();
    expect(authorMinutesOf('about an hour')).toBeNull();
    expect(authorMinutesOf('1 hr, plus chilling')).toBeNull();
    expect(authorMinutesOf('1 1/2 hr')).toBeNull();
    expect(authorMinutesOf('350°F')).toBeNull();
    expect(authorMinutesOf('')).toBeNull();
    expect(authorMinutesOf(undefined)).toBeNull();
  });

  it('reads every `>> time:` line in the collection', () => {
    const unreadable = all
      .filter((recipe) => authorMinutesOf(recipe.metadata.time) === null)
      .map((recipe) => `${recipe.slug}: ${recipe.metadata.time ?? '(none)'}`);
    expect(unreadable).toEqual([]);
  });
});

/* --- the real collection --- */

describe('every recipe', () => {
  const schedules = all.map((recipe) => ({ recipe, schedule: buildSchedule(recipe) }));

  it('never starts an operation before the things feeding it are done', () => {
    const early: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const byId = new Map(schedule.tasks.map((t) => [t.id, t]));
      for (const t of schedule.tasks) {
        for (const id of t.dependsOn) {
          const dep = byId.get(id);
          if (!dep) early.push(`${recipe.slug}: ${t.id} depends on missing ${id}`);
          else if (dep.end > t.start) {
            early.push(`${recipe.slug}: ${t.id} starts at ${t.start}, but ${id} ends at ${dep.end}`);
          }
        }
      }
    }
    expect(early).toEqual([]);
  });

  it('starts every operation as early as its dependencies allow', () => {
    const late: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const byId = new Map(schedule.tasks.map((t) => [t.id, t]));
      for (const t of schedule.tasks) {
        const earliest = Math.max(0, ...t.dependsOn.map((id) => byId.get(id)?.end ?? 0));
        if (t.start !== earliest) late.push(`${recipe.slug}: ${t.id} waits until ${t.start}, could start at ${earliest}`);
        if (t.end !== t.start + t.minutes) late.push(`${recipe.slug}: ${t.id} ends at the wrong time`);
      }
    }
    expect(late).toEqual([]);
  });

  it('packs the lanes so two tasks in one lane never overlap', () => {
    const collisions: string[] = [];
    for (const { recipe, schedule } of schedules) {
      for (const [i, lane] of schedule.lanes.entries()) {
        for (let n = 1; n < lane.length; n++) {
          if (lane[n - 1].end > lane[n].start) {
            collisions.push(
              `${recipe.slug}: lane ${i}, ${lane[n - 1].id} ends at ${lane[n - 1].end} ` +
                `but ${lane[n].id} starts at ${lane[n].start}`,
            );
          }
        }
      }
    }
    expect(collisions).toEqual([]);
  });

  it('puts every task in exactly one lane', () => {
    const wrong: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const laid = schedule.lanes.flat().map((t) => t.id).sort();
      const ids = schedule.tasks.map((t) => t.id).sort();
      if (laid.join() !== ids.join()) wrong.push(recipe.slug);
      if (new Set(ids).size !== ids.length) wrong.push(`${recipe.slug}: duplicate task ids`);
    }
    expect(wrong).toEqual([]);
  });

  it('makes totalMinutes the critical path rather than the sum', () => {
    const wrong: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const byId = new Map(schedule.tasks.map((t) => [t.id, t]));
      const path = schedule.criticalPath.map((id) => byId.get(id));
      if (path.some((t) => !t)) {
        wrong.push(`${recipe.slug}: critical path names a task that is not there`);
        continue;
      }
      const chain = path as Task[];
      const walked = Math.round(chain.reduce((total, t) => total + t.minutes, 0) * 100) / 100;
      const latest = Math.max(...schedule.tasks.map((t) => t.end));
      const sum = Math.round(schedule.tasks.reduce((total, t) => total + t.minutes, 0) * 100) / 100;

      if (walked !== schedule.totalMinutes) {
        wrong.push(`${recipe.slug}: path is ${walked} but total is ${schedule.totalMinutes}`);
      }
      if (latest !== schedule.totalMinutes) {
        wrong.push(`${recipe.slug}: last task ends at ${latest}, total says ${schedule.totalMinutes}`);
      }
      if (schedule.totalMinutes > sum) {
        wrong.push(`${recipe.slug}: total ${schedule.totalMinutes} exceeds the sum ${sum}`);
      }
      // The chain has to be a real chain: each link feeds the next, ending where time ends.
      for (let n = 1; n < chain.length; n++) {
        if (!chain[n].dependsOn.includes(chain[n - 1].id)) {
          wrong.push(`${recipe.slug}: ${chain[n].id} does not depend on ${chain[n - 1].id}`);
        }
        if (chain[n - 1].end !== chain[n].start) {
          wrong.push(`${recipe.slug}: a gap between ${chain[n - 1].id} and ${chain[n].id}`);
        }
      }
      if (chain.length && chain[chain.length - 1].end !== schedule.totalMinutes) {
        wrong.push(`${recipe.slug}: the chain does not reach the end`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('accounts for every timed minute as either hands-on or unattended', () => {
    const wrong: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const sum = Math.round(schedule.tasks.reduce((total, t) => total + t.minutes, 0) * 100) / 100;
      const split = Math.round((schedule.handsOnMinutes + schedule.unattendedMinutes) * 100) / 100;
      if (sum !== split) wrong.push(`${recipe.slug}: ${sum} of work, ${split} accounted for`);
      const untimed = schedule.tasks.filter((t) => !t.timed);
      if (untimed.some((t) => t.minutes !== 0 || t.attention !== 'unknown')) {
        wrong.push(`${recipe.slug}: an untimed task claims a time`);
      }
      if (schedule.untimedCount !== untimed.length) wrong.push(`${recipe.slug}: untimedCount is off`);
    }
    expect(wrong).toEqual([]);
  });

  it('gives every task the id and column of its cell in the table', () => {
    const wrong: string[] = [];
    for (const { recipe, schedule } of schedules) {
      const cells = layout(buildTree(recipe)).rows.flat().filter((c) => c.kind === 'op');
      const fromTable = cells.map((c) => `${c.id}@${c.col}`).sort();
      const fromSchedule = schedule.tasks.map((t) => `${t.id}@${t.column}`).sort();
      if (fromTable.join() !== fromSchedule.join()) wrong.push(recipe.slug);
    }
    expect(wrong).toEqual([]);
  });
});

describe('the deepest table in the collection', () => {
  // Seven columns is the deepest anything gets; brown butter brownies is one of eighteen.
  const schedule = of('brown-butter-brownies');

  it('is a chain of six operations, columns two through seven', () => {
    expect(schedule.tasks.map((t) => t.column)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(schedule.tasks.map((t) => t.dependsOn)).toEqual([[], ['s2'], ['s3'], ['s4'], ['s5'], ['s6']]);
  });

  it('times only the bake, so depth is not duration', () => {
    expect(schedule.untimedCount).toBe(5);
    expect(schedule.totalMinutes).toBe(30);
    expect(schedule.criticalPath).toEqual(['s7']);
    expect(schedule.authorMinutes).toBe(50);
  });
});

describe('the recipes with the longest critical path', () => {
  const longest = all
    .map((recipe) => ({ slug: recipe.slug, schedule: buildSchedule(recipe) }))
    .sort((a, b) => b.schedule.totalMinutes - a.schedule.totalMinutes);

  /*
   * This used to name three slugs, and it was wrong within one ticket of being written and
   * wrong again after every ticket since — the collection has more than doubled and each new
   * pickle or cure displaces one of them. The property is what the three names were standing
   * in for, and it survives the next twenty recipes.
   *
   * Today the three are sour-dill-pickles (2 hr soak → 3 weeks ferment → 2 days chill),
   * sauerkraut (3 weeks at 18°C → 2 days in the fridge) and lime-pickle (7 days in the sun →
   * 7 days more in the jar).
   */
  it('are ferments and cures, long from one named wait rather than from many steps', () => {
    for (const { slug, schedule } of longest.slice(0, 3)) {
      expect(schedule.totalMinutes, slug).toBeGreaterThan(7 * 24 * 60);

      const onPath = schedule.tasks.filter((task) => schedule.criticalPath.includes(task.id));
      const waiting = onPath
        .filter((task) => task.attention === 'unattended')
        .reduce((total, task) => total + task.minutes, 0);

      // Nearly all of it is waiting. A long list of short jobs is a different animal.
      expect(waiting / schedule.totalMinutes, slug).toBeGreaterThan(0.99);
      // Three or four steps, not thirty: the length is in the waits, not in the work.
      expect(onPath.length, slug).toBeLessThanOrEqual(6);
      // And the author named every long one, rather than us reading it off a sentence.
      for (const task of onPath.filter((t) => t.minutes >= 60)) {
        expect(task.confidence, `${slug}: ${task.label}`).toBe('stated');
      }
    }
  });

  it('agree with what their authors claim, within a few percent', () => {
    // The critical path is derived from the timers alone, so this is two independent
    // accounts of the same dish landing in the same place.
    for (const { slug, schedule } of longest.slice(0, 3)) {
      const claimed = schedule.authorMinutes;
      expect(claimed).not.toBeNull();
      expect(Math.abs(schedule.totalMinutes - claimed!) / claimed!).toBeLessThan(0.05);
    }
  });

  it('are almost all waiting, which is why they can be long', () => {
    for (const { schedule } of longest.slice(0, 3)) {
      expect(schedule.unattendedMinutes).toBeGreaterThan(schedule.handsOnMinutes * 100);
    }
  });
});

describe('a real recipe with concurrent branches', () => {
  // Mujaddara: the rice simmers, the onions fry and the lentils fry, all at once.
  const schedule = of('mujaddara');

  it('overlaps the three branches instead of queueing them', () => {
    expect(schedule.tasks.filter((t) => t.start === 0)).toHaveLength(3);
    expect(schedule.lanes).toHaveLength(3);
  });

  it('finishes well before the sum of its parts', () => {
    const sum = schedule.tasks.reduce((total, t) => total + t.minutes, 0);
    expect(sum).toBe(97);
    expect(schedule.totalMinutes).toBe(57);
  });
});
