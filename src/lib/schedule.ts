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
  /**
   * The longest run of hands-on work with no break in it — the difference between thirty
   * minutes at the hob and three ten-minute jobs around two waits, which `handsOnMinutes`
   * alone cannot tell apart because a sum has no shape.
   *
   * Measured on ONE COOK, across every branch: see longestUnbroken() below. Never more than
   * `handsOnMinutes`, because it is made of the same minutes. It can be more than
   * `totalMinutes`, for the same reason `handsOnMinutes` already can — two branches running
   * at once are more work than there is clock.
   */
  longestHandsOnMinutes: number;
  /** Operations that never said how long they take. */
  untimedCount: number;
  /** Parsed from `>> time:`. The author's claim about the whole dish, not ours. */
  authorMinutes: number | null;
}

/** Minutes are floats once seconds are involved; keep the arithmetic from drifting. */
const round = (minutes: number) => Math.round(minutes * 100) / 100;

/**
 * Idle time long enough to be a break — long enough to leave the pan and sit down.
 *
 * An unattended step between two hands-on ones is plainly a break; two minutes of it is not,
 * because nobody sits down for two minutes. Five is the smallest gap you could plausibly
 * leave the kitchen for.
 *
 * It is also a number doing no secret work. The smallest gap between hands-on stretches
 * anywhere in the collection is three minutes, exactly one gap is under four, and thresholds
 * of four and five give the SAME answer on every recipe. The value that would decide things
 * is zero — every gap a break — and that is the reading this constant exists to refuse: it
 * calls a recipe restful for putting its half-hour down for ninety seconds.
 */
export const BREAK_MINUTES = 5;

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
  const handsOnSpans: HandsOnSpan[] = [];

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

    /*
     * Where each hands-on timer sits, so a run of work can be measured across steps.
     *
     * The TIMER is the unit, never the task. attentionOfTask() below calls a whole step
     * hands-on when any timer in it is — the cautious reading, and the right one for a label
     * — but baguette's one such step is 128 minutes of which 8 are your hands and 120 are a
     * prove. Read at task granularity this collection's longest stretch at the bench is two
     * hours of standing at a bowl of dough that is doing nothing.
     *
     * The timers of a step run in order from its start, which is the same order readTimers()
     * slices its label in, so a running offset gives each one its place. The test for
     * hands-on is the one the minute split above uses, so a timer earns a stretch exactly
     * when it earns a minute — which is what keeps the total below handsOnMinutes.
     */
    let at = start;
    for (const timer of timers) {
      if (timer.attention !== 'unattended' && timer.minutes > 0) {
        handsOnSpans.push({ start: round(at), minutes: timer.minutes, id: idOf(op), column: op.col });
      }
      at += timer.minutes;
    }

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
    longestHandsOnMinutes: longestUnbroken(handsOnSpans),
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

/** One hands-on timer, at its place on the clock. Not a task: see the loop that fills these. */
interface HandsOnSpan {
  start: number;
  minutes: number;
  /** Its task's id and column, so two stretches starting together always sort the same way. */
  id: string;
  column: number;
}

/**
 * The longest run of hands-on work a cook does without a break, ACROSS EVERY BRANCH.
 *
 * The schedule above assumes as many hands as the tree has branches — it never delays one
 * hands-on task for another — which is right for a timeline and wrong for this number. A
 * person with two hands-on jobs running at once is doing both, one after the other. So the
 * stretches are laid on one cook's clock here: each is taken no earlier than the recipe
 * allows and no earlier than the last one finished.
 *
 * Measuring along criticalPath instead would disagree on 80 recipes and always downward, six
 * of them to ZERO — potato-knish, mole-poblano, chicken-pesto-bowl and three more stand at
 * the hob for twelve to twenty unbroken minutes on branches the critical path never touches.
 * Calling those restful is exactly the failure this number exists to prevent.
 *
 * Serialising can only push work later, so it can only shrink the gaps it measures: where it
 * errs it errs towards a busier evening, which warns a tired cook rather than reassuring one.
 * Nothing here touches a task's own start or end — the schedule is read, never rewritten.
 */
function longestUnbroken(spans: HandsOnSpan[]): number {
  // Same tie-break as packLanes(), so no two parts of this module order a recipe differently.
  const ordered = [...spans].sort(
    (a, b) => a.start - b.start || a.column - b.column || a.id.localeCompare(b.id),
  );

  let cursor = 0;
  let run = 0;
  let longest = 0;

  for (const span of ordered) {
    const at = Math.max(cursor, span.start);
    // Idle time for the COOK, not a hole in the recipe: two jobs the recipe runs at once
    // leave no gap at all, and join into one stretch.
    if (at - cursor >= BREAK_MINUTES) run = 0;
    run += span.minutes;
    cursor = at + span.minutes;
    if (run > longest) longest = run;
  }

  return round(longest);
}

/**
 * Whose the hands-on figure is: the author's, ours, or nobody's.
 *
 * A filter on "time you're standing there" is only honest if it can say "cannot say", and
 * hands-on is what the clock falls back to when a step says nothing — so an under-annotated
 * recipe collects minutes nobody ever claimed, and a recipe with no timers at all reads as no
 * time at all. Asked here, once, for the same reason attentionIsOurs() is: a browser deriving
 * this for itself is a second answer to one question, and the wrong answer would be the quiet
 * one — 327 recipes sail through "under fifteen minutes standing" on no evidence whatever.
 *
 * Weakest reading wins, as it does within a task — with one distinction a single task never
 * had to make. An UNTIMED operation adds no minutes, so it leaves the figure a floor: we read
 * what was there and there is more. An ASSUMED minute is different in kind — a number nobody
 * claimed, sitting inside the figure as though somebody had — so it is what drops a recipe to
 * "nobody said". Taking untimed steps the same way would put 615 of 664 recipes in that one
 * bucket and leave the dial sorting nothing.
 */
export function handsOnEvidence(schedule: Schedule): Confidence {
  // Times nothing at all: the figure is not low, it is absent.
  if (schedule.totalMinutes === 0) return 'unknown';
  // Claims you never stand there, across steps nobody put a number on. That is the trap.
  if (schedule.handsOnMinutes === 0 && schedule.untimedCount > 0) return 'unknown';
  if (schedule.assumedHandsOnMinutes > 0) return 'unknown';
  // An untimed task is already 'unknown', so this covers untimedCount === 0 without saying so.
  if (schedule.tasks.every((task) => task.confidence === 'stated')) return 'stated';
  return 'inferred';
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
