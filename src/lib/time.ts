/*
 * Cooklang timers carry a number and a unit; a schedule needs minutes.
 *
 * A named timer says what kind of wait it is — ~rise{90%min}, ~chill{4%hr}, ~bake{30%min} —
 * which is the difference between time you spend and time you merely wait out. That
 * distinction is the whole point of putting a timeline under the table, so the names are
 * the honest source for it rather than a guess made from the verb.
 */

const PER_MINUTE: Record<string, number> = {
  sec: 1 / 60, secs: 1 / 60, second: 1 / 60, seconds: 1 / 60, s: 1 / 60,
  min: 1, mins: 1, minute: 1, minutes: 1, m: 1,
  hr: 60, hrs: 60, hour: 60, hours: 60, h: 60,
  day: 1440, days: 1440, d: 1440,
  week: 10080, weeks: 10080,
};

/** Minutes, or null when the unit is not a duration we understand. */
export function minutesOf(value: number | null, unit: string | null): number | null {
  if (value === null || !Number.isFinite(value) || !unit) return null;
  const factor = PER_MINUTE[unit.trim().toLowerCase()];
  return factor === undefined ? null : Math.round(value * factor * 100) / 100;
}

/** "4 hr 35 min", "45 min", "2 days" — how long a cook would say it takes. */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '';
  if (minutes < 1) return `${Math.round(minutes * 60)} sec`;

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.round(minutes % 60);

  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours) parts.push(`${hours} hr`);
  if (mins && !days) parts.push(`${mins} min`);
  return parts.join(' ');
}

/*
 * Waits you can walk away from.
 *
 * The pressure-cooker words are the sealed wait by definition — the lid is locked, so there is
 * nothing a cook could do at the pot even if they stood there. `pressure` is listed bare as well
 * as compounded, because it is the word an unnamed timer's step reliably carries ("cook at high
 * pressure 35 min"), and it appears nowhere in the 514 files today, so it has no prose meaning
 * here to lie about. `release` is deliberately NOT here on its own: "what makes the shell
 * release" (ajitama) and "until the mushrooms release their liquid" are hands doing work, which
 * is the trap NOT_A_VERB_IN_A_SENTENCE below exists for. Same for `seal`, which is twenty-two
 * dumpling and empanada edges.
 *
 * `parboil` is here although bare `boil` is withheld below, and the difference is that the word
 * does not lead a double life. Every one of its seven appearances is a named timer or the verb
 * opening its own step — "bring to a boil and ~parboil{10%min}, then drain and rinse" in three
 * stocks and their pressure siblings, and the rice-water parboil in buri-daikon. Nobody stands
 * over a pot of water waiting for it; that is what parboiling is, and it was reading as twenty
 * minutes of a cook's attention.
 */
const UNATTENDED = new Set([
  'rise', 'prove', 'proof', 'ferment', 'rest', 'chill', 'cool', 'freeze', 'set',
  'marinate', 'brine', 'soak', 'steep', 'bake', 'roast', 'braise', 'simmer', 'steam',
  'boil', 'parboil', 'slowcook', 'infuse', 'dry', 'cure', 'age', 'refrigerate', 'overnight',
  'leave', 'stand', 'sit', 'blindbake', 'parbake', 'prebake', 'autolyse', 'retard',
  'thaw', 'defrost', 'macerate', 'wilt', 'drain', 'press', 'smoke', 'stew', 'poach',
  'pressure', 'pressurecook', 'pressurecooking', 'pressurerelease', 'naturalrelease',
  'naturalpressurerelease', 'quickrelease', 'cometopressure', 'keepwarm',
]);

/* Time you have to be there for, so an author can say so outright rather than by omission. */
const HANDS_ON = new Set([
  'whisk', 'stir', 'knead', 'beat', 'mix', 'fold', 'toss', 'whip', 'roll', 'shape',
  'saute', 'fry', 'deepfry', 'stirfry', 'sear', 'brown', 'broil', 'temper', 'toast', 'grill',
  'flip', 'baste', 'skim', 'churn',
]);

/*
 * Words that mean the wait when an author NAMES a timer with them, and mean something else
 * entirely when they are merely spotted in a sentence. Every one of these was caught lying:
 *
 *   dry    — "toast in a dry skillet 3 min" is an adjective on the pan, and it was reading
 *            nine spice blends, three flatbreads and a comal as time you can walk away from.
 *            Spices burn in seconds.
 *   press  — "press in the hot iron for 45 sec" (pizzelle) is your hands on the iron, not a
 *            weighted press draining tofu.
 *   boil   — "boil 1 min a side" (bagels), "cook to a boil, 1 min" (whisking a pudding hard)
 *            and "boil to a thick caramel, 10 min" are all standing at the pan.
 *
 * `~dry{3%hr}` still reads as a wait, because there the author said so on purpose. This set
 * only withholds trust from the word when it is found loose in a step.
 */
const NOT_A_VERB_IN_A_SENTENCE = new Set(['boil', 'dry', 'press']);

export type Attention = 'hands-on' | 'unattended';
export type AttentionSource = 'name' | 'label' | 'default';

/** Whether you have to be there, and which of the three ways we came to think so. */
export interface Reading {
  attention: Attention;
  source: AttentionSource;
}

const normalise = (word: string) => word.trim().toLowerCase().replace(/[\s-]/g, '');

/**
 * Where the answer came from matters, so the page can be honest about how sure it is.
 *
 * A recognised timer name is the author saying it outright. An UNRECOGNISED one is not a
 * claim about anything, so it falls through to the same reading an unnamed timer gets —
 * otherwise naming a timer more descriptively makes the answer worse than leaving it blank,
 * which is how `~blind bake{20%min}` came to be classified as twenty minutes of standing at
 * the oven. Failing the name we read the operation the timer sits in, since "braise 3 hr" is
 * plainly not three hours of attention. Failing both we assume you are standing there,
 * because promising a cook they can leave when they cannot is the worse error.
 *
 * One timer at a time, for a caller that has only one. A step with several wants
 * readTimers(), which gives each timer only the words that are its own.
 */
export function attentionOf(
  timerName: string | null,
  operationLabel = '',
): Reading {
  return readTimers([{ name: timerName, text: '' }], operationLabel)[0];
}

/** What a run of words says, if it says anything. Unattended wins, as it always did. */
function readWords(text: string): Reading | null {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const said = (vocabulary: Set<string>) =>
    words.some((word) => vocabulary.has(word) && !NOT_A_VERB_IN_A_SENTENCE.has(word));

  if (said(UNATTENDED)) return { attention: 'unattended', source: 'label' };
  /*
   * Reading the hands-on words too is what stops the fallback below reaching over a comma
   * for someone else's verb. Without it "knead 10 min, rise 1 hour" finds nothing in the
   * knead, falls back to the whole step, finds "rise", and tells a cook that ten minutes of
   * kneading is time they can walk away from.
   */
  if (said(HANDS_ON)) return { attention: 'hands-on', source: 'label' };
  return null;
}

/**
 * Which slice of the step each timer speaks for.
 *
 * A step is often two operations in one sentence — "knead 8 min, then rise 2 hours" — and
 * reading the whole sentence for every timer in it hands the rise's answer to the knead. So
 * each timer gets the words from the end of the previous timer up to the end of its own:
 * "knead 8 min", then ", then rise 2 hours".
 *
 * The timers have to be found, in order, or nothing is narrowed — a label rewritten by a
 * `>> step.N:` line may not contain them at all, and a wrong slice is worse than no slice.
 */
function regionsOf(label: string, timers: readonly { text: string }[]): string[] {
  const regions: string[] = [];
  let at = 0;
  for (const timer of timers) {
    const found = timer.text ? label.indexOf(timer.text, at) : -1;
    if (found < 0) return timers.map(() => label);
    regions.push(label.slice(at, found + timer.text.length));
    at = found + timer.text.length;
  }
  return regions;
}

/**
 * Every timer in one step, read against the words that belong to it.
 *
 * A timer whose own slice says nothing falls back to the whole step, because a second timer
 * continuing one operation — "bake in a Dutch oven 450°F, 30 min covered + 15 min open" —
 * leaves the verb behind in the first slice, and "+ 15 min" on its own is not a claim that
 * you have to stand there.
 */
export function readTimers(
  timers: readonly { name: string | null; text: string }[],
  operationLabel = '',
): Reading[] {
  const regions = regionsOf(operationLabel, timers);

  return timers.map((timer, i) => {
    if (timer.name) {
      const name = normalise(timer.name);
      if (UNATTENDED.has(name)) return { attention: 'unattended', source: 'name' };
      if (HANDS_ON.has(name)) return { attention: 'hands-on', source: 'name' };
    }

    return (
      readWords(regions[i]) ??
      readWords(operationLabel) ?? { attention: 'hands-on', source: 'default' }
    );
  });
}
