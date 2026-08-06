/*
 * Turns the merge tree into a schedule.
 *
 * The table is already a dependency graph — an operation cannot start until everything
 * feeding it is done — and cooklang timers are already durations, so a schedule is READ OFF
 * the recipe rather than invented. Two branches that do not depend on each other run at the
 * same time, which is the thing a cook most wants to know and the thing a numbered list of
 * steps hides: the glaze genuinely gets made while the braise braises.
 *
 * Nothing here fills a gap with a plausible number. An operation the recipe never timed gets
 * zero minutes and `timed: false`, and the count of those is reported so a page can say
 * "plus 6 steps the recipe does not time" instead of pretending it knows.
 */
import type { Attention, AttentionSource, Reading } from './time.ts';
import { minutesOf, readTimers } from './time.ts';
import { buildTree, type OpNode, type RawRecipe, type RawTimer, type RecipeTree, type TreeNode } from './tree.ts';

/** 'unknown' is for an operation the recipe never timed: no timer, so nothing to read. */
export type TaskAttention = Attention | 'unknown';

/**
 * How sure we are that `attention` is right — not how sure we are of the minutes. When a
 * task is timed the minutes are the author's own number, always.
 *
 *  - `stated`   the author named the timer (~chill{4%hr}) and we know that name.
 *  - `inferred` we read it off the operation, because "braise 3 hr" is plainly not 3 hr of
 *               your attention.
 *  - `unknown`  nothing said, so we assumed you are standing there — the safe assumption,
 *               but an assumption, and a page should be allowed to say so.
 */
export type Confidence = 'stated' | 'inferred' | 'unknown';

export interface Task {
  /** Matches the table cell's id in layout.ts, so a page can light up the cell. */
  id: string;
  /** The operation cell's text. */
  label: string;
  /** The column this operation occupies in the table — its depth in the tree. */
  column: number;
  /** Sum of this step's timers. 0 when the recipe never says. */
  minutes: number;
  /** False when `minutes` came from nothing rather than from a timer. */
  timed: boolean;
  attention: TaskAttention;
  confidence: Confidence;
  /** Earliest start, in minutes from zero. */
  start: number;
  end: number;
  /** Ids of the operations feeding this one. Ingredients are not tasks. */
  dependsOn: string[];
}

export interface Schedule {
  /** Deepest-first, so every task appears after the tasks it depends on. */
  tasks: Task[];
  /** Tasks packed into rows so two in the same row never overlap. */
  lanes: Task[][];
  /** Ids of the chain that sets the total, earliest first. */
  criticalPath: string[];
  /** Length of the critical path. Not the sum: two parallel one-hour waits take one hour. */
  totalMinutes: number;
  /**
   * How much of the WORK is of each kind, summed over every task — not elapsed time, which
   * is `totalMinutes`. Two parallel one-hour rises are two hours of unattended work and one
   * hour of your evening. (The schedule also assumes you have as many hands as the tree has
   * branches; it never delays one hands-on task for another.)
   */
  unattendedMinutes: number;
  handsOnMinutes: number;
  /**
   * How much of `handsOnMinutes` is there only because nobody said otherwise.
   *
   * Hands-on is what we fall back to when a step says nothing about whether you can leave,
   * so "needs you" quietly collects minutes nobody ever claimed. A page printing that figure
   * as a fact would be putting a cook in front of a pan on our say-so, so the figure comes
   * with the part of it we are guessing at.
   */
  assumedHandsOnMinutes: number;
  /** Operations that never said how long they take. */
  untimedCount: number;
  /** Parsed from `>> time:`. The author's claim about the whole dish, not ours. */
  authorMinutes: number | null;
}

/** Minutes are floats once seconds are involved; keep the arithmetic from drifting. */
const round = (minutes: number) => Math.round(minutes * 100) / 100;

/** tree.ts's RawTimer predates the `source` the parser now writes for every timer. */
type SourcedTimer = RawTimer & { source?: AttentionSource };

const CONFIDENCE_OF: Record<AttentionSource, Confidence> = {
  name: 'stated',
  label: 'inferred',
  default: 'unknown',
};

/**
 * The tree carries the columns and the edges; the raw steps carry the timers. Pass the tree
 * if you already built one — a page has, and building it twice would be waste.
 */
export function buildSchedule(recipe: RawRecipe, tree: RecipeTree = buildTree(recipe)): Schedule {
  const steps = new Map(recipe.steps.map((step) => [step.index, step]));
  const tasks: Task[] = [];
  const byId = new Map<string, Task>();

  let unattendedMinutes = 0;
  let handsOnMinutes = 0;
  let assumedHandsOnMinutes = 0;

  // Deepest-first, so a task's dependencies are always already scheduled.
  for (const op of opsDeepestFirst(tree.root)) {
    /*
     * Read here rather than trusting the `attention` the parser wrote, because reading a
     * step needs ALL of its timers at once — each one only speaks for its own clause — and
     * because it is this label, the one on the table cell, that the page shows next to the
     * answer. One reading, made in one place, from what the reader can see.
     */
    const all = (steps.get(op.stepIndex)?.timers ?? []) as SourcedTimer[];
    const readings = readTimers(all, op.label);

    // A timer with no readable duration (or a unit that is not a duration) times nothing.
    const timers = all
      .map((timer, i) => ({ minutes: timer.minutes as number, ...readings[i] }))
      .filter((timer) => timer.minutes !== null && Number.isFinite(timer.minutes));

    const minutes = round(timers.reduce((sum, timer) => sum + timer.minutes, 0));
    for (const timer of timers) {
      if (timer.attention === 'unattended') unattendedMinutes += timer.minutes;
      else {
        handsOnMinutes += timer.minutes;
        if (timer.source === 'default') assumedHandsOnMinutes += timer.minutes;
      }
    }

    const dependsOn = op.children
      .filter((child): child is OpNode => child.kind === 'op')
      .map((child) => idOf(child));
    const start = dependsOn.reduce((latest, id) => Math.max(latest, byId.get(id)?.end ?? 0), 0);

    const task: Task = {
      id: idOf(op),
      label: op.label,
      column: op.col,
      minutes,
      timed: timers.length > 0,
      attention: attentionOfTask(timers),
      confidence: confidenceOfTask(timers),
      start: round(start),
      end: round(start + minutes),
      dependsOn,
    };
    tasks.push(task);
    byId.set(task.id, task);
  }

  // Every branch flows into the root, so the root finishing is the recipe finishing.
  const root = byId.get(idOf(tree.root));

  return {
    tasks,
    lanes: packLanes(tasks),
    criticalPath: root ? criticalPathTo(root, byId) : [],
    totalMinutes: root?.end ?? 0,
    unattendedMinutes: round(unattendedMinutes),
    handsOnMinutes: round(handsOnMinutes),
    assumedHandsOnMinutes: round(assumedHandsOnMinutes),
    untimedCount: tasks.filter((task) => !task.timed).length,
    authorMinutes: authorMinutesOf(recipe.metadata?.time),
  };
}

/** Same id the table's operation cell uses. */
const idOf = (op: OpNode) => `s${op.stepIndex}`;

function opsDeepestFirst(root: OpNode): OpNode[] {
  const out: OpNode[] = [];
  const walk = (node: TreeNode) => {
    if (node.kind !== 'op') return;
    for (const child of node.children) walk(child);
    out.push(node);
  };
  walk(root);
  return out;
}

/**
 * Mixed timers in one step take the hands-on reading, because telling a cook they can walk
 * away when half of the step needs them there is the worse error. The split between
 * `handsOnMinutes` and `unattendedMinutes` is still done timer by timer, so nothing is
 * miscounted — only this one summary label is cautious.
 */
function attentionOfTask(timers: Reading[]): TaskAttention {
  if (timers.length === 0) return 'unknown';
  return timers.some((timer) => timer.attention === 'hands-on') ? 'hands-on' : 'unattended';
}

/**
 * Whether the hands-on / walk-away reading is ours rather than the author's own word.
 *
 * `stated` is the author naming a timer we know. Everything else — read off the operation, or
 * assumed because nothing was said — is us, and a page printing the reading should say so.
 *
 * The two ways we came to it are a fact about this module, not about the dish, so a page gets
 * one answer here rather than two of its own. Asked in one place because it was being asked in
 * two and answered differently: one pane hedged an inferred reading and the other did not.
 */
export function attentionIsOurs(task: Task): boolean {
  return task.confidence !== 'stated';
}

/** The weakest reading wins: a step is only as well described as its vaguest timer. */
function confidenceOfTask(timers: Reading[]): Confidence {
  if (timers.length === 0) return 'unknown';
  const levels = timers.map((timer) =>
    timer.source ? CONFIDENCE_OF[timer.source] ?? 'unknown' : 'unknown');
  if (levels.includes('unknown')) return 'unknown';
  if (levels.includes('inferred')) return 'inferred';
  return 'stated';
}

/**
 * The chain that sets the total, walked back from the end: at each task, the dependency that
 * finished exactly when this one could start. A task starting at zero starts the chain —
 * nothing before it held anything up, so untimed prep is not dragged in.
 *
 * Ties (two dependencies finishing together) go to the longer job, then to the earlier step,
 * so the same recipe always reports the same chain.
 */
function criticalPathTo(task: Task, byId: Map<string, Task>): string[] {
  const path: string[] = [];
  let current: Task | undefined = task;

  while (current) {
    path.push(current.id);
    if (current.start <= 0) break;
    const start = current.start;
    const previous: Task[] = current.dependsOn
      .map((id) => byId.get(id))
      .filter((dep): dep is Task => dep !== undefined && dep.end === start)
      .sort((a, b) => b.minutes - a.minutes || a.id.localeCompare(b.id));
    current = previous[0];
  }

  return path.reverse();
}

/**
 * First fit by start time: a task joins the first lane whose last task is already finished.
 * A zero-length task still takes a slot, so an untimed operation shows up on the timeline
 * instead of vanishing.
 */
function packLanes(tasks: Task[]): Task[][] {
  const lanes: Task[][] = [];
  const ordered = [...tasks].sort(
    (a, b) => a.start - b.start || a.column - b.column || a.id.localeCompare(b.id),
  );

  for (const task of ordered) {
    const lane = lanes.find((row) => row[row.length - 1].end <= task.start);
    if (lane) lane.push(task);
    else lanes.push([task]);
  }

  return lanes;
}

/**
 * `>> time: 1 hr 20 min` → 80. The author's claim, kept apart from ours.
 *
 * Anything we cannot read whole — a range ("30 to 40 min"), a unit that is not a duration,
 * a word left over — comes back null. A half-read time would be a number nobody wrote.
 */
export function authorMinutesOf(time: string | undefined | null): number | null {
  if (!time) return null;

  let rest = time.trim().toLowerCase();
  if (!rest) return null;

  let total = 0;
  let found = false;

  for (const match of rest.matchAll(/(\d+(?:\.\d+)?)\s*([a-z]+)/g)) {
    const minutes = minutesOf(Number(match[1]), match[2]);
    if (minutes === null) return null;
    total += minutes;
    found = true;
  }
  if (!found) return null;

  // Whatever the pairs did not account for had better be punctuation, or we misread it.
  rest = rest.replace(/(\d+(?:\.\d+)?)\s*([a-z]+)/g, ' ');
  const leftovers = rest.split(/[\s,;+]+/).filter(Boolean);
  if (leftovers.some((word) => word !== 'and')) return null;

  return round(total);
}
