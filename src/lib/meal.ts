/*
 * Why six reasonable recipes make an unreasonable afternoon.
 *
 * Every tool in src/lib/ reasons about one dish. buildSchedule() builds a DAG per recipe, packs its
 * lanes and finds its critical path, and everything it returns is relative to a zero that belongs to
 * that recipe alone. A MEAL is several of those at once, competing for one oven, a handful of
 * burners and one cook, all landing at one serving time — and that competition is the entire reason
 * a family holiday overwhelms somebody who cooks perfectly well the other fifty-one weeks.
 *
 * Four rules hold this file up.
 *
 * 1. IT DIAGNOSES; IT DOES NOT PLAN. Nothing here moves a task. Every task sits exactly where its
 *    own recipe put it, and the findings are places where what the meal ASKS FOR is more than what
 *    exists. A generated minute-by-minute plan would be over-promising — a turkey is done when it is
 *    done, and a plan wrong by fifteen minutes is worse than no plan because somebody trusted it —
 *    and it is the wrong shape of problem besides. What a cook cannot see is where the collisions
 *    are, not what order to do things in.
 *
 *    The hands-on finding is the sharpest form of this. It is not a simulation that ran out of time;
 *    it is a bound. Work that cannot begin before t and must be finished by the hour needs at least
 *    that many cook-minutes, and k cooks do not have them. NO ORDERING FIXES IT, so the finding does
 *    not depend on an ordering, which is precisely what makes it worth printing.
 *
 * 2. IT REUSES; IT DOES NOT REIMPLEMENT. buildSchedule() for the DAG and the clock, costOf() for
 *    what the target servings cost, readTimers() for which minutes are yours. A meal model that
 *    recomputed a recipe's schedule its own way would disagree with the recipe's own page inside a
 *    month, so the arithmetic here is arrangement rather than derivation, and two whole-collection
 *    tests in meal.test.ts hold it to that.
 *
 * 3. THE WEAKEST READING WINS, AND SIX RECIPES IS SIX CHANCES TO BE GUESSING. A collision computed
 *    from six recipes' figures is only as good as the worst of them. But the confidence is per
 *    finding and over what that finding actually rests on: an oven clash read off two authors' own
 *    temperatures is not made doubtful by a third dish whose hands-on minutes are a fallback. See
 *    confidenceOf() at the bottom.
 *
 * 4. NOTHING HERE RENDERS. No display string, no notation, no sentence. Every string in the output
 *    is an enum this repo already ships or declares here, or a recipe SLUG, which is an identifier
 *    and already plan.ts's currency. The words a cook reads are a later ticket's.
 */
import type { Keeps } from './keeps.ts';
import { type Cost, costOf } from './scaling.ts';
import { buildSchedule, type Confidence, type Schedule, type Task } from './schedule.ts';
import { type Occupancy, readStations, type Station, temperaturesAgree } from './stations.ts';
import { readTimers } from './time.ts';
import type { RawRecipe, RawStep } from './tree.ts';

/* ---- what you are cooking -------------------------------------------------- */

export interface MealDish {
  recipe: RawRecipe;
  /** Servings wanted at the table, not what the recipe is written for. */
  servings: number;
  /**
   * True when it is not cooked on the day: its work leaves the clock entirely.
   *
   * This is the change a cook actually has, and it is why this model is a tool rather than a report
   * — you take a dish out of the afternoon and read which finding goes with it. A dish marked ahead
   * whose recipe never declared `keeps` raises `made-ahead-unclaimed` rather than being quietly
   * believed.
   */
  madeAhead?: boolean;
}

export interface Meal {
  dishes: MealDish[];
  /**
   * Hands at once. Default 1.
   *
   * schedule.ts states its own assumption — it "assumes you have as many hands as the tree has
   * branches; it never delays one hands-on task for another" — which is right for one recipe's
   * timeline and becomes absurd across six. So the count is an input here, and one is the default
   * because one is who is usually standing there.
   */
  cooks?: number;
  /** Burners. Default 4, which is what a domestic hob has. */
  burners?: number;
  /**
   * How many dishes the oven holds at once. NULL IS THE DEFAULT AND IT MEANS NOBODY SAID.
   *
   * Not infinity. Nothing in this collection measures a dish — a sheet pan of potatoes and a ramekin
   * of custard are both "one dish" here — so the model reports how many things want the oven at once
   * and refuses to rule on whether they fit. A caller who knows their oven passes the number and
   * gets `oven-crowded`; a caller who does not gets the count and decides. Defaulting this to two
   * would be us guessing at somebody's kitchen and printing the guess as a finding.
   */
  ovenShelves?: number | null;
}

/* ---- what it tells you ----------------------------------------------------- */

/**
 * Minutes RELATIVE TO SERVING. Zero is the moment it goes on the table and everything before it is
 * negative, because what makes a meal a meal is that it all lands at once. Turning these into a
 * clock face is a later ticket's; this file returns numbers.
 */
export interface Window {
  /** ≤ 0 */
  from: number;
  /** ≤ 0, and never less than `from`. */
  to: number;
}

export type FindingKind =
  /** In the oven together at temperatures no cook could split. */
  | 'oven-clash'
  /** In the oven together at temperatures that agree. Not a fault — a count you should have. */
  | 'oven-shared'
  /** More dishes in the oven than there are shelves. Only ever when `ovenShelves` was given. */
  | 'oven-crowded'
  /** More pans than burners. */
  | 'hob-crowded'
  /** More hands-on work than the cooks can get through before it is served. */
  | 'hands-pile-up'
  /** The target needs more loads of the vessel than the written recipe does. */
  | 'vessel-binds'
  /** It keeps a day or more, and its work is inside the pile-up. This is the one to move. */
  | 'make-ahead-available'
  /** Marked as made ahead, and the recipe never said it keeps. */
  | 'made-ahead-unclaimed';

/**
 * One thing the meal cannot do, or one thing you should know before it starts.
 *
 * `wanted`, `have` and `overrunMinutes` mean different things per kind, so they are tabulated once
 * here rather than explained in eight places:
 *
 *   kind                  wanted                     have                       overrunMinutes
 *   oven-clash            things in the oven         ovenShelves ?? 0           0
 *   oven-shared           things in the oven         ovenShelves ?? 0           0
 *   oven-crowded          things in the oven         ovenShelves                0
 *   hob-crowded           pans on the hob            burners                    0
 *   hands-pile-up         cook-minutes wanted        cook-minutes available     wanted − have
 *   vessel-binds          loads at the target        loads as written           batches.costMinutes
 *   make-ahead-available  0                          0                          minutes it removes
 *   made-ahead-unclaimed  0                          0                          0
 */
export interface Finding {
  kind: FindingKind;
  /** Slugs, sorted, never empty. */
  dishes: string[];
  /** Null on findings that are not about a stretch of the afternoon. */
  window: Window | null;
  confidence: Confidence;
  /** Oven temperatures in play, °C, ascending, deduplicated. Empty unless it is about the oven. */
  celsius: number[];
  wanted: number;
  have: number;
  overrunMinutes: number;
}

/** What one dish costs at the size it is wanted, whether or not it is in a finding. */
export interface DishLoad {
  slug: string;
  /** `written` is null when the recipe has no readable `>> servings:` to scale from. */
  servings: { written: number | null; at: number };
  /** `costOf(...).standing.at`. Null when the dish could not be scaled. */
  standingMinutes: number | null;
  elapsedMinutes: number | null;
  batches: { written: number; at: number; binds: boolean; costMinutes: number } | null;
  /** `costOf(...).evidence`, or `unknown` when the dish could not be scaled at all. */
  evidence: Confidence;
  /** The part of `standingMinutes` that is there only because nothing was said. */
  assumedStandingMinutes: number;
  untimedCount: number;
  madeAhead: boolean;
  /** Its earliest task, relative to serving. Negative, and 0 when it is made ahead. */
  startsAt: number;
}

export interface Diagnosis {
  findings: Finding[];
  /** One entry per dish, in the order they were given. */
  dishes: DishLoad[];
  /** Hands-on minutes the day asks for, over every dish cooked on the day. */
  standingMinutes: number;
  /** The earliest a dish has to start, relative to serving. Negative; 0 for an empty meal. */
  startsAt: number;
  /**
   * The weakest recipe in the meal — the blunt answer, in one place, for a caller that wants one.
   * It is deliberately NOT applied as a floor to the oven findings: only 269 of 685 recipes have a
   * hands-on figure that is not a guess, and stamping that doubt onto a temperature clash read from
   * two authors' own numbers would be honest about nothing.
   */
  evidence: Confidence;
  /** Slugs with no readable `>> servings:`. Placed on the clock, never scaled. */
  unscalable: string[];
  cooks: number;
  burners: number;
  ovenShelves: number | null;
}

/* ---- the constants that decide things -------------------------------------- */

/** A day in the fridge. `keeps` shorter than this is not a dish you can make on Wednesday. */
export const A_DAY = 24 * 60;

/** Minutes are floats once seconds are involved; keep the arithmetic from drifting. */
const round = (minutes: number) => Math.round(minutes * 100) / 100;

const RANK: Record<Confidence, number> = { unknown: 0, inferred: 1, stated: 2 };

/** The weakest reading wins, as it does inside a task, inside a recipe, and inside a cost. */
const weakest = (levels: Confidence[]): Confidence =>
  levels.length === 0
    ? 'unknown'
    : levels.reduce((worst, level) => (RANK[level] < RANK[worst] ? level : worst));

/* ---- putting one dish on the shared clock ---------------------------------- */

/** One hands-on timer, at its place on the shared clock. Minutes are already scaled. */
interface Span {
  slug: string;
  /** ≤ 0. Relative to serving. */
  start: number;
  minutes: number;
  evidence: Confidence;
}

/** One task holding a station, at its place on the shared clock. */
interface Hold {
  slug: string;
  taskId: string;
  station: Station;
  from: number;
  to: number;
  celsius: number | null;
  confidence: Confidence;
}

interface Placed {
  dish: MealDish;
  load: DishLoad;
  spans: Span[];
  holds: Hold[];
}

/**
 * Where each hands-on timer sits, read the way schedule.ts reads it.
 *
 * schedule.ts builds exactly this list internally and never returns it, and Task.attention is no
 * substitute: it calls a whole step hands-on when any timer in it is, which is the right label for a
 * table cell and would read baguette's 128-minute step as two hours at the bench. So the timers are
 * read again with the same call on the same inputs — the step's own timers against the label off the
 * tree — which is the move scaling.ts:splitAttention() already makes and defends. It is the same
 * reading and not a second opinion, and meal.test.ts holds it to that over all 685 files: these
 * minutes must sum to the schedule's own handsOnMinutes on every recipe.
 */
export function handsOnSpansOf(recipe: RawRecipe, schedule: Schedule): { start: number; minutes: number }[] {
  const steps = new Map<number, RawStep>(recipe.steps.map((step) => [step.index, step]));
  const out: { start: number; minutes: number }[] = [];

  for (const task of schedule.tasks) {
    const all = steps.get(Number(task.id.slice(1)))?.timers ?? [];
    const readings = readTimers(all, task.label);

    // Filtered first, then walked — the same order schedule.ts does it in, so the offsets agree.
    const timers = all
      .map((timer, i) => ({ minutes: timer.minutes as number, ...readings[i] }))
      .filter((timer) => timer.minutes !== null && Number.isFinite(timer.minutes));

    let at = task.start;
    for (const timer of timers) {
      if (timer.attention !== 'unattended' && timer.minutes > 0) {
        out.push({ start: round(at), minutes: timer.minutes });
      }
      at += timer.minutes;
    }
  }

  return out;
}

/**
 * A task's confidence, which is what a station finding rests on.
 *
 * The oven window is read off a timer, so it is the timer's reading that matters — not the hands-on
 * split, which the window has nothing to do with. A temperature that came from a header step, or
 * from nowhere, drops it one notch, because a window we placed at a temperature the step did not
 * state is a weaker claim than one it did.
 */
const holdConfidence = (task: Task, occupancy: Occupancy): Confidence => {
  if (occupancy.temperatureSource === 'step') return task.confidence;
  return task.confidence === 'stated' ? 'inferred' : task.confidence;
};

/**
 * One dish, placed so its last operation lands at zero.
 *
 * TWO DIFFERENT THINGS HAPPEN TO THE TWO KINDS OF MINUTE, and the reason is in the cost function.
 * `elapsed` is `A_free + m·H_free + r·(A_batch + H_batch)`: only HANDS-ON minutes carry the serving
 * multiplier. Unattended minutes grow only through `r`, the batch ratio, which is 1 unless a vessel
 * binds the dish. So:
 *
 *  - A STATION WINDOW IS TAKEN AS WRITTEN. A 45-minute roast is 45 minutes for four wings and for
 *    ten; twice the potatoes is not twice the roast. Stretching it would be inventing a number the
 *    recipe never said.
 *  - HANDS-ON MINUTES ARE SCALED, by costOf()'s own `standing` factor, so the spans sum to
 *    `standing.at` exactly. This distributes the cost function's answer rather than recomputing it.
 *    Which individual minutes were batched is not recorded, so the growth is spread evenly: exact
 *    for the 639 files with no capacity, an even spread of an uneven truth for the 46 with one, and
 *    the total is right either way. scaling.ts:longestGrowth() makes the same trade for the same
 *    reason.
 *
 * Where a vessel does bind, the windows are a FLOOR, and `vessel-binds` says so rather than letting
 * the drawing pass for the truth.
 */
function placeDish(dish: MealDish): Placed {
  const { recipe } = dish;
  const schedule = buildSchedule(recipe);
  const cost = costOf(recipe, dish.servings, schedule);
  const madeAhead = dish.madeAhead === true;

  // Everything lands at once, so the recipe's last operation is the hour and its start is negative.
  const offset = -schedule.totalMinutes;
  const factor = cost?.standing.factor ?? 1;
  const evidence: Confidence = cost?.evidence ?? 'unknown';

  const spans: Span[] = madeAhead
    ? []
    : handsOnSpansOf(recipe, schedule).map((span) => ({
        slug: recipe.slug,
        start: round(span.start + offset),
        minutes: round(span.minutes * factor),
        evidence,
      }));

  const stations = readStations(recipe);
  const holds: Hold[] = [];
  if (!madeAhead) {
    for (const task of schedule.tasks) {
      const occupancy = stations.get(Number(task.id.slice(1)));
      // A task with no minutes holds nothing: it is an instruction, not an occupancy.
      if (!occupancy || task.minutes <= 0) continue;
      holds.push({
        slug: recipe.slug,
        taskId: task.id,
        station: occupancy.station,
        from: round(task.start + offset),
        to: round(task.end + offset),
        celsius: occupancy.celsius,
        confidence: holdConfidence(task, occupancy),
      });
    }
  }

  return {
    dish,
    load: loadOf(dish, schedule, cost, offset, madeAhead),
    spans,
    holds,
  };
}

function loadOf(
  dish: MealDish,
  schedule: Schedule,
  cost: Cost | null,
  offset: number,
  madeAhead: boolean,
): DishLoad {
  return {
    slug: dish.recipe.slug,
    servings: { written: cost?.servings.written ?? null, at: dish.servings },
    standingMinutes: cost ? cost.standing.at : null,
    elapsedMinutes: cost ? cost.elapsed.at : null,
    batches: cost
      ? {
          written: cost.batches.written,
          at: cost.batches.at,
          binds: cost.batches.binds,
          costMinutes: cost.batches.costMinutes,
        }
      : null,
    evidence: cost?.evidence ?? 'unknown',
    assumedStandingMinutes: cost?.assumedStandingMinutes ?? 0,
    untimedCount: cost?.untimedCount ?? schedule.untimedCount,
    madeAhead,
    startsAt: madeAhead ? 0 : offset,
  };
}

/* ---- where two things want the same thing ---------------------------------- */

/** A stretch of the afternoon over which the same set of things holds a station. */
interface Contention {
  window: Window;
  holds: Hold[];
}

/**
 * The boundary sweep: every distinct edge in time becomes a cut, and each elementary interval
 * records what was holding the station across it. Adjacent intervals with the identical occupant set
 * merge, so two dishes that overlap for fifty minutes come back as one window rather than four.
 *
 * Intervals are half-open, `[from, to)`. Two roasts back to back — one ending exactly as the next
 * begins — are not in the oven together, and a half-open interval is what says so without a
 * tolerance nobody could defend.
 */
function contentions(holds: Hold[], station: Station): Contention[] {
  const relevant = holds.filter((hold) => hold.station === station && hold.to > hold.from);
  const cuts = [...new Set(relevant.flatMap((hold) => [hold.from, hold.to]))].sort((a, b) => a - b);

  const out: Contention[] = [];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const [from, to] = [cuts[i], cuts[i + 1]];
    const inside = relevant.filter((hold) => hold.from <= from && hold.to >= to);
    if (inside.length === 0) continue;

    const previous = out[out.length - 1];
    const sameSet =
      previous !== undefined &&
      previous.window.to === from &&
      previous.holds.length === inside.length &&
      previous.holds.every((hold) => inside.includes(hold));

    if (sameSet) previous.window.to = to;
    else out.push({ window: { from, to }, holds: inside });
  }

  return out;
}

const slugsOf = (holds: Hold[]): string[] => [...new Set(holds.map((hold) => hold.slug))].sort();

const celsiusOf = (holds: Hold[]): number[] =>
  [...new Set(holds.map((hold) => hold.celsius).filter((c): c is number => c !== null))].sort(
    (a, b) => a - b,
  );

/** True when any two of them could not go in the same oven. Null agrees with everything. */
const clashes = (holds: Hold[]): boolean =>
  holds.some((a, i) => holds.slice(i + 1).some((b) => !temperaturesAgree(a.celsius, b.celsius)));

function ovenFindings(holds: Hold[], shelves: number | null): Finding[] {
  const out: Finding[] = [];

  for (const { window, holds: inside } of contentions(holds, 'oven')) {
    const confidence = weakest(inside.map((hold) => hold.confidence));
    const base = {
      dishes: slugsOf(inside),
      window,
      confidence,
      celsius: celsiusOf(inside),
      wanted: inside.length,
      have: shelves ?? 0,
      overrunMinutes: 0,
    };

    if (inside.length > 1) {
      out.push({ kind: clashes(inside) ? 'oven-clash' : 'oven-shared', ...base });
    }
    // Absence is not infinity: with no shelf count given, the count is reported and not judged.
    if (shelves !== null && inside.length > shelves) {
      out.push({ kind: 'oven-crowded', ...base, have: shelves });
    }
  }

  return out;
}

function hobFindings(holds: Hold[], burners: number): Finding[] {
  return contentions(holds, 'hob')
    .filter(({ holds: inside }) => inside.length > burners)
    .map(({ window, holds: inside }) => ({
      kind: 'hob-crowded' as const,
      dishes: slugsOf(inside),
      window,
      confidence: weakest(inside.map((hold) => hold.confidence)),
      celsius: [],
      wanted: inside.length,
      have: burners,
      overrunMinutes: 0,
    }));
}

/* ---- more work than there are hands ---------------------------------------- */

/**
 * The tail that cannot be done, and it is a bound rather than a guess.
 *
 * For a cut `t`, take every hands-on span the recipes will not let start before `t`. All of that
 * work has to happen between `t` and the hour, and `k` cooks cannot make more than `k·(0 − t)`
 * cook-minutes in that stretch. If the work is more than that, NO ORDERING FINISHES IT — not the
 * clever one, not the one a generated plan would have proposed. That is why this file can say
 * something useful without ever proposing an order.
 *
 * Every span start is a candidate cut, because the worst tail always begins at one: between two
 * starts the work is constant and the room only grows. The largest overrun wins, and ties go to the
 * earliest cut, so the same meal always reports the same window.
 *
 * `start >= t` rather than a proportional share of an overlapping span: a span cannot begin before
 * the recipe allows, so all of its minutes fall inside the tail. That is what keeps this a bound
 * rather than an estimate.
 */
function pileUp(spans: Span[], cooks: number): Finding | null {
  if (spans.length === 0) return null;

  let worst: { cut: number; wanted: number; have: number } | null = null;

  for (const cut of [...new Set(spans.map((span) => span.start))].sort((a, b) => a - b)) {
    const wanted = spans
      .filter((span) => span.start >= cut)
      .reduce((sum, span) => sum + span.minutes, 0);
    const have = cooks * (0 - cut);
    if (wanted - have <= 0) continue;
    if (worst === null || wanted - have > worst.wanted - worst.have) worst = { cut, wanted, have };
  }

  if (worst === null) return null;

  const { cut, wanted, have } = worst;
  const inside = spans.filter((span) => span.start >= cut);
  return {
    kind: 'hands-pile-up',
    dishes: [...new Set(inside.map((span) => span.slug))].sort(),
    window: { from: cut, to: 0 },
    confidence: weakest(inside.map((span) => span.evidence)),
    celsius: [],
    wanted: round(wanted),
    have: round(have),
    overrunMinutes: round(wanted - have),
  };
}

/* ---- what could come out of the day ---------------------------------------- */

const keepsOf = (recipe: RawRecipe): Keeps | null => recipe.keeps ?? null;

/**
 * Which dishes could be moved off the day, and which were moved without the recipe agreeing.
 *
 * `keeps` is authored and never derived — nothing about a dish's second morning can be read off its
 * steps — so a recipe that never declared one is not a recipe that keeps for zero days. It is a
 * recipe nobody has looked at, and it does not get to be a make-ahead on our say-so in either
 * direction: it is neither offered as one nor believed when a caller claims it.
 */
function aheadFindings(placed: Placed[], crunch: Finding | null): Finding[] {
  const out: Finding[] = [];

  for (const { dish, load } of placed) {
    if (!load.madeAhead) continue;
    const keeps = keepsOf(dish.recipe);
    if (keeps === null || keeps.minutes < A_DAY) {
      out.push({
        kind: 'made-ahead-unclaimed',
        dishes: [load.slug],
        window: null,
        confidence: 'unknown',
        celsius: [],
        wanted: 0,
        have: 0,
        overrunMinutes: 0,
      });
    }
  }

  const window = crunch?.window ?? null;
  if (window === null) return out;

  for (const { dish, load, spans } of placed) {
    if (load.madeAhead) continue;
    const keeps = keepsOf(dish.recipe);
    if (keeps === null || keeps.minutes < A_DAY) continue;

    const inside = spans.filter((span) => span.start >= window.from);
    if (inside.length === 0) continue;

    out.push({
      kind: 'make-ahead-available',
      dishes: [load.slug],
      window,
      confidence: load.evidence,
      celsius: [],
      wanted: 0,
      have: 0,
      overrunMinutes: round(inside.reduce((sum, span) => sum + span.minutes, 0)),
    });
  }

  return out;
}

/** The vessel's own answer, surfaced because it is what makes a window a floor rather than a fact. */
function vesselFindings(placed: Placed[]): Finding[] {
  return placed
    .filter(({ load }) => !load.madeAhead && load.batches?.binds === true)
    .map(({ load }) => ({
      kind: 'vessel-binds' as const,
      dishes: [load.slug],
      window: null,
      confidence: load.evidence,
      celsius: [],
      wanted: load.batches!.at,
      have: load.batches!.written,
      overrunMinutes: load.batches!.costMinutes,
    }));
}

/* ---- the whole afternoon --------------------------------------------------- */

/** Declared, so the same meal always reports its findings in the same order. */
const KIND_ORDER: FindingKind[] = [
  'oven-clash',
  'oven-crowded',
  'hob-crowded',
  'hands-pile-up',
  'vessel-binds',
  'oven-shared',
  'make-ahead-available',
  'made-ahead-unclaimed',
];

/**
 * Where a set of recipes, cooked at these sizes by this many people for one hour, collides.
 *
 * Returns findings and load. It returns NO SCHEDULE AND NO ITINERARY, and no task is moved anywhere:
 * every window below is the window the recipe's own schedule put it in, shifted so the meal lands at
 * zero. A caller wanting to know what to do about any of it has to decide that themselves, which is
 * the correct division of labour between a kitchen and a computer.
 */
export function diagnose(meal: Meal): Diagnosis {
  const cooks = Number.isFinite(meal.cooks) && (meal.cooks as number) > 0 ? (meal.cooks as number) : 1;
  const burners =
    Number.isFinite(meal.burners) && (meal.burners as number) > 0 ? (meal.burners as number) : 4;
  const ovenShelves =
    typeof meal.ovenShelves === 'number' && meal.ovenShelves > 0 ? meal.ovenShelves : null;

  const placed = meal.dishes.map(placeDish);
  const holds = placed.flatMap((one) => one.holds);
  const spans = placed.flatMap((one) => one.spans);

  const crunch = pileUp(spans, cooks);
  const findings = [
    ...ovenFindings(holds, ovenShelves),
    ...hobFindings(holds, burners),
    ...(crunch ? [crunch] : []),
    ...vesselFindings(placed),
    ...aheadFindings(placed, crunch),
  ].sort(
    (a, b) =>
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
      (a.window?.from ?? 0) - (b.window?.from ?? 0) ||
      a.dishes.join().localeCompare(b.dishes.join()),
  );

  const cooked = placed.filter(({ load }) => !load.madeAhead);

  return {
    findings,
    dishes: placed.map(({ load }) => load),
    standingMinutes: round(spans.reduce((sum, span) => sum + span.minutes, 0)),
    startsAt: cooked.length === 0 ? 0 : Math.min(...cooked.map(({ load }) => load.startsAt)),
    evidence: weakest(placed.map(({ load }) => load.evidence)),
    unscalable: placed
      .filter(({ load }) => load.servings.written === null)
      .map(({ load }) => load.slug)
      .sort(),
    cooks,
    burners,
    ovenShelves,
  };
}
