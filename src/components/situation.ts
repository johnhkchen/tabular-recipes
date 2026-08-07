/*
 * How many people, and over how many days — the two settings that turn the dials into a
 * situation.
 *
 * S-010's dials ask *what can I cook*. Between them these two ask *what can I cook for these
 * people, over these days*, and the answer is the same three dials read against the SCALED cost
 * rather than the recipe's written figures. Time you're standing there at eighteen servings is a
 * different number from time you're standing there at four, and until this file the site could
 * not tell.
 *
 * Four rules hold it up, and the first is the one everything else falls out of.
 *
 * 1. THE SITUATION CHANGES THE RECIPE, NOT THE DIALS. Nothing here re-implements a dial. It
 *    builds the same `Item` with three figures replaced by their values at the target and hands
 *    it to dials.ts's own verdict(). So "at small numbers the behaviour is identical" is not a
 *    promise about behaviour, it is an object comparison: at or below the written servings the
 *    scaled item IS the item.
 *
 * 2. THE TARGET NEVER GOES BELOW WHAT THE RECIPE MAKES. You do not un-cook a recipe. Faced with
 *    a pot of chili written for six and one person to feed, nobody simmers a sixth of it for a
 *    sixth of the time — they cook the pot and eat it twice, which is exactly S-011's *two meals
 *    for one*. Scaling down is also where the model is least trustworthy in the direction that
 *    matters (scaling.md §4.3: a quarter of a roux is not a quarter of the stirring), and it
 *    would err towards reassuring a tired cook, which is the opposite of the house convention.
 *
 * 3. THE COST IS scaling.ts's, NEVER A SECOND OPINION. The 46 recipes with a capacity carry a
 *    small table of figures computed by costOf() itself at build time. The other 639 use §2's
 *    collapsed form, which the model states outright for the no-capacity case — and a
 *    whole-collection test holds BOTH to costOf's own answer at every reachable target.
 *
 * 4. NO NOTATION. The sentences come from scaling.md §6's phrasebook. No O(·), no multiplier, no
 *    arrow, no batch count dressed as arithmetic — a test greps every sentence this file can
 *    produce, over the whole collection, for all of them.
 *
 * WHY THIS IS NOT IN src/lib/, and why dials.ts is imported rather than edited: the same reason
 * dials.ts gives one file over. This ticket owns src/pages/index.astro, src/pages/search.json.ts,
 * src/styles/** and new files under src/components/. dials.ts is an existing component and is not
 * ours to touch, which is a constraint that made the design better rather than worse — see rule 1.
 */
import { type Item, type Settings, type Verdict, searchString, unsaidLine, verdict } from './dials.ts';
import { formatDuration } from '../lib/time.ts';

/* ---- the vocabulary -------------------------------------------------------- */

export type ControlId = 'people' | 'days';

/** A setting the reader can pick. `label` is drawn; `spoken` is what a screen reader says. */
export interface Stop {
  value: number;
  label: string;
  spoken: string;
}

export interface Control {
  id: ControlId;
  /** What the reader sees above the row. */
  name: string;
  /** What the off stop is called aloud. */
  anySpoken: string;
  stops: Stop[];
}

/** null means Any — that setting is not made. */
export interface Situation {
  people: number | null;
  days: number | null;
}

/*
 * Both settings, in one place, so the page renders from it and the tests assert against it.
 *
 * The stops are the story's. S-011 names one person and six people, so both ends are its own; 2
 * and 4 are the households in between. Days stops at three because that is the span the story
 * asks for and because the keeping evidence thins out past it — one file in the collection claims
 * five days and one a week.
 *
 * Not a number input and not a slider. dials.ts already argues this for elapsed minutes, and here
 * it is worse: a free number invites 7, 11 and 23, and the page would have to answer for targets
 * nobody cooks. Named stops are also what keeps the table in search.json small enough to ship.
 */
export const CONTROLS: readonly Control[] = [
  {
    id: 'people',
    name: 'How many people',
    anySpoken: 'any number of people',
    stops: [
      { value: 1, label: '1', spoken: 'cooking for one' },
      { value: 2, label: '2', spoken: 'cooking for two' },
      { value: 4, label: '4', spoken: 'cooking for four' },
      { value: 6, label: '6', spoken: 'cooking for six' },
    ],
  },
  {
    id: 'days',
    name: 'Over how many days',
    anySpoken: 'however many days',
    stops: [
      { value: 1, label: 'Today', spoken: 'eating it today' },
      { value: 2, label: '2 days', spoken: 'over two days' },
      { value: 3, label: '3 days', spoken: 'over three days' },
    ],
  },
];

/** Both settings on Any. */
export const NOBODY: Situation = { people: null, days: null };

/** How many cards the dropped shelf draws. The same 12 the unanswered shelf uses. */
export const SHOW_DROPPED = 12;

const control = (id: ControlId): Control => CONTROLS.find((one) => one.id === id)!;

/** Is either setting off Any? */
export function anyoneSet(situation: Situation): boolean {
  return CONTROLS.some((one) => situation[one.id] !== null);
}

/** How many days the food has to last. Any means today, which asks nothing about keeping. */
export function overDays(situation: Situation): number {
  return situation.days ?? 1;
}

/**
 * Portion-meals wanted: how many people, once a day, for that many days.
 *
 * An unset setting counts as one, so *six people* with nothing said about days is six portions
 * tonight, and *three days* with nothing said about people is a question about keeping rather
 * than about size.
 */
export function target(situation: Situation): number {
  return (situation.people ?? 1) * overDays(situation);
}

/*
 * Every target the controls can produce: 1, 2, 3, 4, 6, 8, 12 and 18.
 *
 * DERIVED, never written down twice. search.json.ts builds its per-recipe table from this list,
 * so adding a stop grows the table by itself rather than silently leaving 46 recipes with no
 * answer at the new size.
 */
export const TARGETS: readonly number[] = [
  ...new Set(
    [1, ...control('people').stops.map((stop) => stop.value)].flatMap((people) =>
      [1, ...control('days').stops.map((stop) => stop.value)].map((days) => people * days),
    ),
  ),
].sort((a, b) => a - b);

/* ---- one entry of search.json ---------------------------------------------- */

/**
 * The nine keys dials.ts reads, and the seven this file added.
 *
 * `extends Item` is load-bearing: it is what lets a scaled entry go straight into dials.ts's
 * verdict(), figures() and unsaidLine() without any of them knowing this file exists.
 */
export interface SituationItem extends Item {
  /** `>> servings:`, the size every figure on this entry was measured at. */
  writtenServings: number | null;
  /**
   * scaling.md §2's `A`: unattended minutes ON THE CRITICAL PATH.
   *
   * NOT `elapsedMinutes`, and the difference is the point of §2's identity — `A + H` is the
   * one-cook clock and sits at or above the timeline the page draws, because the timeline runs
   * some hands-on work on a second pair of hands.
   */
  waitMinutes: number;
  /** Servings the limiting vessel holds. Absent on 639 of 685 recipes, which is correct. */
  capacityServings?: number;
  /** The vessel in the author's own words, so a reader with a smaller one can correct for it. */
  vessel?: string;
  /** `[elapsed, standing, longest]` per TARGETS index, from costOf(). Only where a vessel binds. */
  scaled?: number[][];
  /** `>> keeps:` — the span in the author's words, or "not at all". */
  keepsText?: string;
  /** What it is like when you come back to it. Never printed without the span. */
  keepsCharacter?: string;
  /** Operations the recipe never timed. Every figure here is a floor by exactly this much. */
  untimedCount: number;
}

/* ---- the cost at a target --------------------------------------------------- */

/** Minutes are floats once seconds are involved. costOf() rounds this way; so must this. */
const round = (minutes: number) => Math.round(minutes * 100) / 100;

/** What this recipe costs at the size the reader asked for. */
export interface Scaled {
  /** `n_eff` — the target, or the written servings when the target is smaller. */
  servings: number;
  /** True when the recipe already makes this much, which is when nothing changes at all. */
  asWritten: boolean;
  /** `n_eff / s`. Never below one. */
  multiplier: number;
  /** Loads the vessel makes of it at the target, and as written. Both 1 when nothing binds. */
  loads: number;
  loadsWritten: number;
  /** Clock time for one cook, at the target. */
  elapsed: number;
  /** Time you are standing there, at the target. */
  standing: number;
  /** The longest unbroken stretch of that. */
  longest: number;
}

/** `b(k) = ceil(k/c)`, and 1 when nothing binds — every load is the only load. */
const loadsOf = (servings: number, capacity: number | undefined): number =>
  capacity ? Math.ceil(servings / capacity) : 1;

/**
 * What `wanted` servings of this recipe costs.
 *
 * Null when the recipe has no readable `>> servings:` to scale from — there is no baseline to be
 * relative to, and inventing one is the plan page printing `serves 4 → 12` all over again. No
 * file in the collection is in that state today; the branch exists so a future one cannot make
 * this page lie.
 *
 * `wanted` MUST be one of TARGETS. A capacity-bound recipe answers from a table computed by
 * costOf() itself, and a target with no row in that table has no honest answer here — so it
 * throws rather than falling through to the unbounded formula, which would hand back a quietly
 * wrong number for exactly the 46 recipes the table exists for.
 */
export function costAt(item: SituationItem, wanted: number): Scaled | null {
  const s = item.writtenServings;
  if (s === null || !(s > 0)) return null;

  const servings = Math.max(wanted, s);
  const multiplier = servings / s;
  const loads = loadsOf(servings, item.capacityServings);
  const loadsWritten = loadsOf(s, item.capacityServings);
  const shape = {
    servings,
    asWritten: servings === s,
    multiplier: round(multiplier),
    loads,
    loadsWritten,
  };

  if (item.scaled) {
    const row = TARGETS.indexOf(wanted);
    if (row < 0 || !item.scaled[row]) {
      throw new Error(`no scaled figures for ${item.slug} at ${wanted} — not one of the stops`);
    }
    const [elapsed, standing, longest] = item.scaled[row];
    return { ...shape, elapsed, standing, longest };
  }

  /*
   * scaling.md §2, the no-capacity case, quoted: "when no capacity is declared — which is nearly
   * always — the batch set is empty, r = 1, and it collapses to elapsed(n) = A + m·H".
   *
   * The longest unbroken stretch grows with the work when the vessel binds no hands-on work, and
   * costOf() caps it at the standing figure because a run longer than the work it is cut from is
   * not a cautious answer but an incoherent one. Both are reproduced here, and a whole-collection
   * test holds this arithmetic to costOf's own answer at every target rather than trusting it.
   */
  const standing = multiplier * item.handsOnMinutes;
  return {
    ...shape,
    elapsed: round(item.waitMinutes + standing),
    standing: round(standing),
    longest: round(Math.min(item.longestHandsOnMinutes * multiplier, standing)),
  };
}

/**
 * The same recipe, with the three figures the dials measure taken at the target.
 *
 * Returned unchanged when the recipe already makes that much, which is what makes the small-n
 * claim an identity rather than a resemblance. `washingUpCount` is deliberately untouched: six
 * portions of stew is the same pot, board and spoon as four, and the second load is already
 * charged to the clock — charging it to the sink as well would be one fact counted twice.
 */
export function scaledItem(item: SituationItem, wanted: number): SituationItem {
  const cost = costAt(item, wanted);
  if (!cost || cost.asWritten) return item;
  return {
    ...item,
    elapsedMinutes: cost.elapsed,
    handsOnMinutes: cost.standing,
    longestHandsOnMinutes: cost.longest,
  };
}

/* ---- does it keep ----------------------------------------------------------- */

const DAY = 24 * 60;

/**
 * How long the dish has to last, in minutes.
 *
 * Cook once, on the first day; the last plate is eaten on day `days`, which is `days − 1` days
 * later. A rule of `days` would demand a fourth day nobody eats.
 */
export function keepsMinutesNeeded(situation: Situation): number {
  return Math.max(0, overDays(situation) - 1) * DAY;
}

/** The span in minutes, or null when the recipe never said. `not at all` is a real zero. */
function keepsMinutes(item: SituationItem): number | null {
  if (!item.keepsText) return null;
  const span = item.keepsText.match(/^(\d+(?:\.\d+)?)\s*(\p{L}+)/u);
  if (!span) return 0; // the only non-numeric span the field allows is "not at all"
  const unit = span[2].toLowerCase();
  const per = unit.startsWith('week') ? 7 * DAY : unit.startsWith('day') ? DAY : 60;
  return Number(span[1]) * per;
}

/**
 * pass | fail | unsaid, on the fourth question.
 *
 * Today asks nothing: one day is one meal and every dish survives to dinner. Past that, 547
 * recipes have no line and every one of them is `unsaid` rather than a quiet pass — treating
 * silence as a yes would put the whole collection into a three-day list on 138 recipes' worth of
 * evidence.
 */
export function keepsVerdict(item: SituationItem, situation: Situation): Verdict {
  const needed = keepsMinutesNeeded(situation);
  if (needed === 0) return 'pass';
  const minutes = keepsMinutes(item);
  if (minutes === null) return 'unsaid';
  return minutes >= needed ? 'pass' : 'fail';
}

/* ---- which shelf ------------------------------------------------------------ */

/**
 * Where a recipe goes. `out` is not drawn — that is what failing a filter means — and the other
 * three each have a heading of their own.
 */
export type Shelf = 'match' | 'dropped' | 'unsaid' | 'out';

/**
 * A KNOWN FAILURE BEATS AN UNKNOWN, on the fourth question as much as the first three. dials.ts
 * settles the argument for the dials; the same rule decides the order here, so a recipe that
 * blows the clock at eighteen servings fails on the clock rather than being promoted onto the
 * shelf where a reader would meet it as a maybe.
 *
 * And `dropped` is deliberately not every failure. A recipe that already failed at four portions
 * did not fail BECAUSE of the situation, and putting it under *not at this size* would turn a
 * finding into a dump of six hundred cards.
 */
export function shelve(item: SituationItem, settings: Settings, situation: Situation): Shelf {
  const answer = verdict(item, settings);
  if (!anyoneSet(situation)) {
    return answer === 'pass' ? 'match' : answer === 'unsaid' ? 'unsaid' : 'out';
  }

  const now = verdict(scaledItem(item, target(situation)), settings);
  const keeps = keepsVerdict(item, situation);

  if (now === 'fail' || keeps === 'fail') return answer === 'fail' ? 'out' : 'dropped';
  if (now === 'unsaid' || keeps === 'unsaid') return 'unsaid';
  return 'match';
}

/* ---- what the cards say ------------------------------------------------------ */

const WORDS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty',
];

/**
 * Counts are words, the way the phrasebook writes them — *three lots*, not *3 lots*.
 *
 * Twenty is far enough: the biggest number the controls can ask for is eighteen, and the most
 * loads any recipe in the collection makes of that is eighteen too (a frying pan that holds one).
 * Past that it is digits, which is a thing a card should not have to print and does not today.
 */
const count = (n: number): string => (Number.isInteger(n) && n < WORDS.length ? WORDS[n] : `${n}`);

/** "Feeds six", "Feeds eighteen" — the reader's own number, said back. */
const feeds = (n: number): string => `Feeds ${count(n)}`;

/*
 * scaling.md §6's last row: "…plus four steps the recipe never times."
 *
 * It is appended rather than substituted, and that is a decision worth naming. The row above it —
 * "this one doesn't time enough of itself to say" — would fire on 228 of the 248 recipes that
 * scale flat at eighteen servings, including every stew in the three-day list, because 267
 * recipes report zero hands-on minutes and most of them are silence rather than freedom (§4.6).
 * A list of six hundred cards all reading "we can't say" is the site explaining itself, which §6's
 * second rule refuses. So the finding is said and the silence is said after it, in one line.
 */
const untimed = (item: SituationItem): string =>
  item.untimedCount > 0
    ? ` Plus ${count(item.untimedCount)} step${item.untimedCount === 1 ? '' : 's'} it never times.`
    : '';

/*
 * A wait inside the vessel, repeated, is the expensive term and the only one worth a sentence of
 * its own: scaling.md §2's `A_batch·(r − 1)`. It cannot be read off the table directly, but the
 * difference between what the recipe costs with the vessel and what the same minutes would cost
 * without it is exactly that term plus the part-full last load — which is the figure the
 * phrasebook's two "binds on a wait" rows are about.
 */
const vesselCost = (item: SituationItem, cost: Scaled): number =>
  round(cost.elapsed - (item.waitMinutes + cost.multiplier * item.handsOnMinutes));

/**
 * Where a vessel stops being a rearrangement and starts being an evening.
 *
 * Twenty minutes is one basket load (scaling.md §7: wings at 200°C for 18–24 minutes), so a
 * vessel that costs less than one load's wait is costing you a rearrangement of work you were
 * doing anyway, and one that costs more has put a whole extra wait in front of dinner.
 */
const A_REAL_WAIT = 20;

/**
 * Why this recipe is on the list, in one sentence.
 *
 * scaling.md §6 is the whole vocabulary, and the uncertainty rows are tested BEFORE the growth
 * rows on purpose: §4.6's failure is a confident sentence on a recipe that times almost none of
 * itself, and a growth claim built on assumed minutes is a guess multiplied.
 */
export function reason(item: SituationItem, situation: Situation): string {
  const cost = costAt(item, target(situation));
  if (!cost) return "This one doesn't say how much it makes, so there's nothing to work out.";
  if (item.elapsedMinutes === 0 && item.handsOnMinutes === 0) {
    return "No times here at all, so there's nothing to work out.";
  }
  if (cost.asWritten) return `Makes ${count(cost.servings)} as written.`;

  if (cost.loads > cost.loadsWritten) {
    const lots = count(cost.loads);
    const extra = vesselCost(item, cost);
    if (extra >= A_REAL_WAIT) {
      const opening = lots[0].toUpperCase() + lots.slice(1);
      return `${opening} lots, one after another, and about ${formatDuration(extra)} longer for it.${untimed(item)}`;
    }
    if (extra >= 1) {
      return `It goes in ${lots} lots, and that costs you about ${formatDuration(extra)}.${untimed(item)}`;
    }
    return `It goes in ${lots} lots, and that is the only difference.${untimed(item)}`;
  }

  /*
   * The baseline is the recipe's own one-cook clock, `A + H`, and NOT `elapsedMinutes`: the
   * timeline runs some hands-on work on a second pair of hands, so gumbo draws 94 minutes
   * against 102 of clock (scaling.md §2's identity). Comparing the scaled figure to the drawn
   * one would report every branching recipe as having grown when nothing had.
   */
  const grown = cost.standing - item.handsOnMinutes;
  if (cost.elapsed - round(item.waitMinutes + item.handsOnMinutes) < 1 && grown < 1) {
    return `${feeds(cost.servings)} without taking any longer.${untimed(item)}`;
  }
  if (item.capacityServings) {
    return `${feeds(cost.servings)}. It fits, one load either way — it's the work that grows.${untimed(item)}`;
  }
  return `${feeds(cost.servings)}. The pot doesn't care; it's the work that grows.${untimed(item)}`;
}

/** "3 days — better on the second". The span never goes out without what it is like. */
export function keepsLine(item: SituationItem, situation: Situation): string {
  if (overDays(situation) < 2 || !item.keepsText) return '';
  const span = item.keepsText === 'not at all' ? "Doesn't keep" : `Keeps ${item.keepsText}`;
  return item.keepsCharacter ? `${span} — ${item.keepsCharacter}` : span;
}

/**
 * Why a recipe dropped out, on a card that is drawn rather than hidden.
 *
 * A filter that hides things without saying why is the thing this site is built not to be, and
 * the negative case matters as much as the list: a recipe that is perfect for two and terrible
 * for six should say which of the two it failed.
 */
export function dropped(
  item: SituationItem,
  settings: Settings,
  situation: Situation,
): string {
  if (keepsVerdict(item, situation) === 'fail') {
    const character = item.keepsCharacter ? ` — ${item.keepsCharacter}` : '';
    return item.keepsText === 'not at all'
      ? `Eat it the day you make it${character}.`
      : `Keeps ${item.keepsText}${character}, and you asked for ${count(overDays(situation))}.`;
  }

  const cost = costAt(item, target(situation));
  if (!cost) return "Fine as written. This one doesn't say how much it makes.";

  const written = `Fine for ${count(item.writtenServings ?? 0)}.`;
  if (settings.standing !== null && cost.standing > settings.standing) {
    return `${written} At ${cost.servings} you're standing there ${formatDuration(cost.standing)}.`;
  }
  if (settings.by !== null && cost.elapsed > settings.by) {
    return `${written} At ${cost.servings} it's ${formatDuration(cost.elapsed)} before you eat.`;
  }
  return `${written} It doesn't stretch to ${cost.servings}.`;
}

/**
 * The line on an unanswered card: what nobody wrote down, in one sentence.
 *
 * dials.ts owns its own three silences and says them; this adds the fourth rather than restating
 * them, so the two files cannot drift into two vocabularies for one absence.
 */
export function silence(
  item: SituationItem,
  settings: Settings,
  situation: Situation,
): string {
  const dials = unsaidLine(item, settings);
  const keeps = keepsVerdict(item, situation) === 'unsaid' ? 'Nobody said whether this keeps.' : '';
  return [dials, keeps].filter(Boolean).join(' ');
}

/**
 * The figures a scaled card carries, from dials.ts, measured at the target.
 *
 * A convenience rather than a rule of its own: it exists so index.astro never has to remember
 * which of the two items — the written one or the scaled one — a given line is about.
 */
export function scaledFor(item: SituationItem, situation: Situation): Item {
  return anyoneSet(situation) ? scaledItem(item, target(situation)) : item;
}

/* ---- the URL ---------------------------------------------------------------- */

/**
 * A situation off a query string, validated rather than trusted — `?people=7` is not a stop this
 * control has, so it falls back to Any. dials.ts's argument holds here word for word: a page
 * drawing a list its own controls cannot reproduce is worse than a link that degrades.
 */
export function readSituation(search: string): Situation {
  const params = new URLSearchParams(search);
  const situation: Situation = { ...NOBODY };
  for (const one of CONTROLS) {
    const raw = params.get(one.id);
    if (raw === null) continue;
    const stop = one.stops.find((each) => String(each.value) === raw);
    if (stop) situation[one.id] = stop.value;
  }
  return situation;
}

/** Does this query string carry a situation parameter? */
export function carriesSituation(search: string): boolean {
  const params = new URLSearchParams(search);
  return CONTROLS.some((one) => params.has(one.id));
}

/**
 * The whole state as one query string: '?q=beans&standing=15&people=6&days=3', or '' for the
 * pristine front page.
 *
 * dials.ts writes its own half and this appends the situation, so the parameter order is fixed —
 * the query, the dials in reading order, then the people and the days — and the same state is
 * always the same link.
 */
export function link(query: string, settings: Settings, situation: Situation): string {
  const dials = searchString(query, settings);
  const params = new URLSearchParams();
  for (const one of CONTROLS) {
    const value = situation[one.id];
    if (value !== null) params.set(one.id, String(value));
  }
  const mine = params.toString();
  if (!mine) return dials;
  return dials ? `${dials}&${mine}` : `?${mine}`;
}
