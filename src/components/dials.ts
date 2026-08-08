/*
 * The three dials on the front page, and the three answers they give.
 *
 * A tired cook turns three things: how long they stand there, when it has to be on the table,
 * and how much ends up in the sink. This module holds the vocabulary for all three — the
 * labels, the stops, the URL parameters — and the one function that decides what a dial says
 * about a recipe.
 *
 * It says three things, never two. **Passes, fails, and cannot say.** Hands-on minutes are what
 * the clock falls back to when a step says nothing, so a recipe nobody annotated collects a
 * figure nobody claimed — 254 of the 267 recipes reading zero minutes of standing have no
 * evidence behind that zero. A filter with two answers recommends those first. So each dial
 * carries its own rule for whether the data can answer it at all, and a recipe it cannot answer
 * for comes back `unsaid` rather than passing quietly.
 *
 * Nothing here combines the three. There is no score, no rating, no weight and no sort: a cook
 * who can stand at a pan for forty minutes but has no clean bowls is not served by an average.
 *
 * WHY THIS IS NOT IN src/lib/. Every other pure module in this repository lives there, and this
 * one would too if it were this ticket's to write. T-010-02 owns src/pages/index.astro,
 * src/styles/** and new files under src/components/; src/lib/** belongs to nobody here.
 * src/pages/_search.json.test.ts is the same situation solved the same way one directory over.
 * Moving it later is a rename.
 *
 * The two imports below are reads. Durations are formatted by the site's one formatter rather
 * than by a second opinion about the same minute, and a "break" is the constant that decided
 * what a break is when the longest unbroken stretch was derived.
 */
import { BREAK_MINUTES } from '../lib/schedule.ts';
import { formatDuration } from '../lib/time.ts';

export type DialId = 'standing' | 'by' | 'wash';

/** What a dial says about one recipe. Three words, and never a number. */
export type Verdict = 'pass' | 'fail' | 'unsaid';

/** One entry of search.json — all nine keys T-010-01 ships. */
export interface Item {
  slug: string;
  title: string;
  counters: string[];
  find: string;
  elapsedMinutes: number;
  handsOnMinutes: number;
  longestHandsOnMinutes: number;
  washingUpCount: number | null;
  evidence: 'stated' | 'inferred' | 'unknown';
}

/** A cap the reader can pick. `label` is drawn; `spoken` is what a screen reader says. */
export interface Stop {
  value: number;
  label: string;
  spoken: string;
}

export interface Dial {
  id: DialId;
  /** What the reader sees above the row. */
  name: string;
  /** What the off stop is called aloud. */
  anySpoken: string;
  stops: Stop[];
}

/** null means Any — that dial is not set. */
export type Settings = Record<DialId, number | null>;

/*
 * The whole vocabulary, in one place, so the page renders from it and the tests assert against
 * it and there is one copy of every string.
 *
 * The names are the ones a tired person would say out loud. "Time you're standing there", not
 * active time and not hands-on — that is the code's word for it, two files away. "On the table
 * by" rather than "ready in", because the preposition is the difference between a promise the
 * recipe makes and a cap the reader sets. And no dial anywhere is called difficulty.
 *
 * The stops are chosen for spread, measured over the collection. Standing 5/15/30 splits the
 * 269 answerable recipes 109 → 227 → 260; a 45-minute stop passes 267 of 269 and sorts nothing.
 * Elapsed runs 0 to 33,240 minutes with a median of 45, which is why these are named stops and
 * not a slider: a linear track over that range puts every dinner in its first fifth of a
 * percent. The sink's stops are chosen for the pool T-008-03 will annotate rather than for the
 * eleven recipes that carry a count today.
 */
export const DIALS: readonly Dial[] = [
  {
    id: 'standing',
    name: "Time you're standing there",
    anySpoken: 'any amount of standing there',
    stops: [
      { value: 5, label: '5 min', spoken: 'under 5 minutes standing there' },
      { value: 15, label: '15 min', spoken: 'under 15 minutes standing there' },
      { value: 30, label: '30 min', spoken: 'under 30 minutes standing there' },
    ],
  },
  {
    id: 'by',
    name: 'On the table by',
    anySpoken: 'no limit on how long it takes',
    stops: [
      { value: 30, label: '30 min', spoken: 'on the table within 30 minutes' },
      { value: 60, label: '1 hr', spoken: 'on the table within an hour' },
      { value: 120, label: '2 hr', spoken: 'on the table within two hours' },
    ],
  },
  {
    id: 'wash',
    name: 'Things to wash',
    anySpoken: 'any number of things to wash',
    stops: [
      { value: 1, label: '1', spoken: 'one thing to wash' },
      { value: 3, label: '3', spoken: 'up to three things to wash' },
      { value: 5, label: '5', spoken: 'up to five things to wash' },
    ],
  },
];

/** Every dial on Any. */
export const OFF: Settings = { standing: null, by: null, wash: null };

/*
 * How many cards each shelf draws before it stops and says how many it did not.
 *
 * 60 is what the search box already uses. 12 is smaller on purpose: the unanswered shelf's job
 * is to be seen and counted, not browsed, and setting the sink dial puts 653 recipes on it.
 * Neither is a silent drop — the remainder is printed and the tally has already said the total.
 */
export const SHOW_PASSES = 60;
export const SHOW_UNSAID = 12;

const byId = new Map(DIALS.map((dial) => [dial.id, dial]));

/** Is any dial off Any? */
export function anySet(settings: Settings): boolean {
  return DIALS.some((dial) => settings[dial.id] !== null);
}

/*
 * Whether this recipe's data can answer this dial at all — one rule per dial, deliberately not
 * one rule for all three.
 *
 * The tempting shortcut is to treat `evidence: 'unknown'` as unanswerable everywhere. It reads
 * cleaner and it is wrong on a real recipe: chile-verde-slow-cooker is unknown because its
 * hands-on figure has assumed minutes in it, and its 512 elapsed minutes come from real timers.
 * Telling a reader we cannot say when an eight-hour braise will be on the table, when the recipe
 * says eight hours, is its own dishonesty — and it would do that to 371 recipes.
 *
 * The elapsed rule is its own axis's trap rather than a softer version of the hands-on one: 24
 * recipes time nothing at all and read as zero minutes, and every one of them is a sauce or a
 * rub — mayonnaise, guacamole, basil-pesto, taco-seasoning. A naive cap would rank them first
 * on no timer whatever.
 */
export function canAnswer(item: Item, id: DialId): boolean {
  if (id === 'standing') return item.evidence !== 'unknown';
  if (id === 'by') return item.elapsedMinutes > 0;
  return item.washingUpCount !== null;
}

/** The figure a dial measures. Only meaningful where `canAnswer` is true. */
export function measure(item: Item, id: DialId): number {
  if (id === 'standing') return item.handsOnMinutes;
  if (id === 'by') return item.elapsedMinutes;
  return item.washingUpCount ?? 0;
}

/*
 * pass | fail | unsaid.
 *
 * A KNOWN FAILURE BEATS AN UNKNOWN, which is the part that is easy to get wrong. If the sink
 * dial cannot say for a recipe but "on the table by 30 min" definitely fails it, the recipe has
 * failed — it does not get promoted onto the unanswered shelf where a reader looking for a
 * half-hour dinner would meet an eight-hour braise. With 653 recipes carrying no washing-up
 * count, the other rule would put nearly the whole collection under that heading.
 *
 * Returning on the first failure is what makes this independent of the order the dials are
 * walked in: any failing dial short-circuits whatever the ones before it said.
 */
export function verdict(item: Item, settings: Settings): Verdict {
  let unsaid = false;
  for (const dial of DIALS) {
    const cap = settings[dial.id];
    if (cap === null) continue;
    if (!canAnswer(item, dial.id)) {
      unsaid = true;
      continue;
    }
    if (measure(item, dial.id) > cap) return 'fail';
  }
  return unsaid ? 'unsaid' : 'pass';
}

/* ---- the URL ------------------------------------------------------------- */

/** The `q` a link arrived with, or ''. */
export function readQuery(search: string): string {
  return new URLSearchParams(search).get('q') ?? '';
}

/*
 * Settings off a query string, validated rather than trusted.
 *
 * `?standing=7` is not a stop this dial has, so it falls back to Any. A page drawing a list its
 * own controls cannot reproduce is worse than a link that degrades: the reader would see an
 * answer, press the dial that supposedly produced it, and get a different one.
 */
export function readSettings(search: string): Settings {
  const params = new URLSearchParams(search);
  const settings: Settings = { ...OFF };
  for (const dial of DIALS) {
    const raw = params.get(dial.id);
    if (raw === null) continue;
    const stop = dial.stops.find((one) => String(one.value) === raw);
    if (stop) settings[dial.id] = stop.value;
  }
  return settings;
}

/** Does this query string carry a finder parameter — is the URL ours to write? */
export function carriesState(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.has('q') || DIALS.some((dial) => params.has(dial.id));
}

/**
 * '?q=beans&standing=15', or '' for the pristine front page. Parameter order is fixed — `q`,
 * then the dials in reading order — so the same state is always the same link.
 */
export function searchString(query: string, settings: Settings): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query);
  for (const dial of DIALS) {
    const value = settings[dial.id];
    if (value !== null) params.set(dial.id, String(value));
  }
  const written = params.toString();
  return written ? `?${written}` : '';
}

/* ---- what the cards say --------------------------------------------------- */

/** "1 thing", "3 things" — the sink counted in words a person would use. */
const things = (count: number) => (count === 1 ? '1 thing' : `${count} things`);

/*
 * The meta line on a card that passed: the figures the reader actually asked about, and nothing
 * else. A reader who asked a question about time is not answered by a list of shelf names.
 *
 * The qualifier on the standing figure is the longest unbroken stretch, and it appears only
 * when the gap is at least one break long. Thirty minutes split into three ten-minute jobs
 * around two waits is a different evening from thirty at the hob, and this is where that is
 * said — on the card, next to the number it qualifies, rather than as a fourth dial nobody
 * would turn. BREAK_MINUTES is the same constant that decided what a break is, so the two
 * cannot drift; a one-minute gap (bagels, 11 against 10) is noise and stays off.
 */
export function figures(item: Item, settings: Settings): string {
  const parts: string[] = [];

  if (settings.standing !== null) {
    parts.push(
      item.handsOnMinutes > 0
        ? `${formatDuration(item.handsOnMinutes)} standing`
        : 'no standing about',
    );
    if (item.handsOnMinutes - item.longestHandsOnMinutes >= BREAK_MINUTES) {
      parts.push(`longest go ${formatDuration(item.longestHandsOnMinutes)}`);
    }
  }

  if (settings.by !== null) parts.push(`on the table in ${formatDuration(item.elapsedMinutes)}`);

  if (settings.wash !== null) {
    const count = item.washingUpCount ?? 0;
    parts.push(count === 0 ? 'nothing to wash' : `${things(count)} to wash`);
  }

  return parts.join(' · ');
}

/** What each dial's silence sounds like, as the tail of one sentence. */
const SILENCE: Record<DialId, string> = {
  standing: "how long you'd stand there",
  by: 'how long this takes',
  wash: 'what this leaves in the sink',
};

/**
 * The line on an unanswered card. One sentence, one "Nobody said", so a reader who lands on a
 * single card knows what is missing without reading the heading above it.
 */
export function unsaidLine(item: Item, settings: Settings): string {
  const missing = DIALS.filter(
    (dial) => settings[dial.id] !== null && !canAnswer(item, dial.id),
  ).map((dial) => SILENCE[dial.id]);

  if (missing.length === 0) return '';
  if (missing.length === 1) return `Nobody said ${missing[0]}.`;
  const last = missing[missing.length - 1];
  return `Nobody said ${missing.slice(0, -1).join(', ')} or ${last}.`;
}

/**
 * The tally, when a dial is set. All three answers, always, in the order the reader meets them
 * — the passes above, the ones that did not make it, and the ones nobody wrote down.
 */
export function tallyLine(counts: { pass: number; fail: number; unsaid: number }): string {
  return `${counts.pass} match · ${counts.fail} don’t · ${counts.unsaid} we can’t say`;
}
