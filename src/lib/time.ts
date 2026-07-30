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

/* Waits you can walk away from. */
const UNATTENDED = new Set([
  'rise', 'prove', 'proof', 'ferment', 'rest', 'chill', 'cool', 'freeze', 'set',
  'marinate', 'brine', 'soak', 'steep', 'bake', 'roast', 'braise', 'simmer', 'steam',
  'boil', 'slowcook', 'infuse', 'dry', 'cure', 'age', 'refrigerate', 'overnight',
  'leave', 'stand', 'sit', 'blindbake', 'parbake', 'prebake', 'autolyse', 'retard',
  'thaw', 'defrost', 'macerate', 'wilt', 'drain', 'press', 'smoke', 'stew', 'poach',
]);

/* Time you have to be there for, so an author can say so outright rather than by omission. */
const HANDS_ON = new Set([
  'whisk', 'stir', 'knead', 'beat', 'mix', 'fold', 'toss', 'whip', 'roll', 'shape',
  'saute', 'fry', 'deepfry', 'stirfry', 'sear', 'brown', 'temper', 'toast', 'grill',
  'flip', 'baste', 'skim', 'churn',
]);

export type Attention = 'hands-on' | 'unattended';
export type AttentionSource = 'name' | 'label' | 'default';

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
 */
export function attentionOf(
  timerName: string | null,
  operationLabel = '',
): { attention: Attention; source: AttentionSource } {
  if (timerName) {
    const name = normalise(timerName);
    if (UNATTENDED.has(name)) return { attention: 'unattended', source: 'name' };
    if (HANDS_ON.has(name)) return { attention: 'hands-on', source: 'name' };
  }

  const words = operationLabel.toLowerCase().match(/[a-z]+/g) ?? [];
  if (words.some((word) => UNATTENDED.has(word))) {
    return { attention: 'unattended', source: 'label' };
  }
  return { attention: 'hands-on', source: 'default' };
}
