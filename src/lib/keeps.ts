/*
 * How long a dish stays good, and what it is like when you come back to it.
 *
 * The clock under the table says how long a dish takes. `slack` says what happens if you get
 * it wrong. `washing-up` says what you are left holding. None of them says anything about
 * Thursday — and *six people, over three days* is two questions, of which scaling only
 * answers one. A recipe that scales beautifully and dies overnight does not answer it.
 *
 * Three rules hold the whole file up.
 *
 * 1. IT IS AUTHORED, NEVER DERIVED. No timer, step or ingredient knows what a fridge does
 *    overnight. A six-hour braise and a six-hour custard sit in the same fridge and come out
 *    as two different mornings, and any formula over the steps gets that backwards.
 *
 * 2. THE CHARACTER IS NOT OPTIONAL, AND IT IS THE POINT. "3 days — better on the second" and
 *    "3 days — the crust is gone by the next morning; reheat in the oven, not the microwave"
 *    are both three days and they are two different dinners. A DURATION ON ITS OWN IS A SHELF
 *    LIFE, and a shelf life is a food-safety claim this site does not make. So the reader
 *    refuses a bare number the same way readSlack() refuses a level with no reason — not as a
 *    style rule, but because the bare form means something this field is not allowed to mean.
 *
 * 3. THIS IS THE FRIDGE. Freezing is a different question with a different answer — chili
 *    keeps four days cold and three months frozen; bread is stale by Tuesday and perfect from
 *    the freezer — and there is no ordering between the two, so a line carrying both would
 *    sometimes carry a contradiction. One line that means two things is how a field stops
 *    comparing. See mentionsFreezer() at the bottom, which warns and never fails.
 *
 * What this field is NOT, said once and plainly: it is one cook's judgement of whether a dish
 * is still worth eating, and never a claim about whether it is safe to. Where the honest
 * answer is not known, the line is left off — which is most of the collection, and which is
 * the right answer rather than a gap.
 */
import { minutesOf } from './time.ts';

/**
 * How a recipe says the dish does not keep at all — a real answer, and often a more useful
 * one than a long span.
 *
 * One phrasing rather than a handful, because the negative is the strongest thing this field
 * can say and it should read the same in every file that says it. It is also the only way to
 * keep "no longer than a day" from being read as a "no" with a stray sentence after it.
 */
export const NOT_AT_ALL = 'not at all';

export interface Keeps {
  /** The span in the author's own words: "3 days", or NOT_AT_ALL. */
  text: string;
  /** The same span in minutes, so "still good on Thursday" is a comparison. 0 = it does not. */
  minutes: number;
  /** Never empty. A duration with nothing after it is a shelf life, and this site does not make those. */
  character: string;
}

/** Whole, or nothing — and when it is nothing, what to tell the person who wrote the line. */
export interface KeepsReading {
  /** Null when the recipe never declared one, which is most of them. */
  keeps: Keeps | null;
  /** Null when the line is absent (which is fine) or whole. */
  problem: string | null;
}

const EXAMPLE =
  'e.g. >> keeps: 3 days — better on the second, once the chile has settled into the fat — ' +
  `or >> keeps: ${NOT_AT_ALL} — the crust is gone in the time it takes to sit down`;

/** `3 days`, `1 week`, `36 hr`, `1.5 days` — one number and one unit, and nothing cleverer. */
const SPAN = /^(\d+(?:\.\d+)?)\s*(\p{L}+)\b/u;

/** One separator after the span is punctuation, spaced or not. A dash in the character survives. */
const SEPARATOR = /^\s*[—–:,-]?\s*/;

/**
 * `>> keeps: 3 days — better on the second`
 *
 * The front of the line is a length of time, or the words for none at all; the rest is what
 * the dish is like when you get there. Whatever joins them — an em dash, a hyphen, a colon,
 * a comma, or nothing — is punctuation, and a checker that spends its credibility on
 * punctuation has none left for the half that matters. So: liberal about how a human wrote
 * it, strict about what it means.
 */
export function readKeeps(value: string | null | undefined): KeepsReading {
  const line = value?.trim();
  if (!line) return { keeps: null, problem: null };

  let text: string;
  let minutes: number;
  let rest: string;

  if (line.toLowerCase().startsWith(NOT_AT_ALL)) {
    text = NOT_AT_ALL;
    minutes = 0;
    rest = line.slice(NOT_AT_ALL.length);
  } else {
    const span = line.match(SPAN);
    const found = span ? minutesOf(Number(span[1]), span[2]) : null;
    if (!span || found === null) {
      const opening = (span ? `${span[1]} ${span[2]}` : line.split(/\s+/).slice(0, 2).join(' '))
        .trim();
      return {
        keeps: null,
        problem:
          `keeps starts with "${opening}", which is not a length of time — write one number ` +
          `and one unit (hours, days or weeks), or "${NOT_AT_ALL}" when the dish does not ` +
          `keep, and then what it is like when you come back to it. ${EXAMPLE}`,
      };
    }
    text = `${span[1]} ${span[2]}`;
    minutes = found;
    rest = line.slice(span[0].length);
  }

  const character = rest.replace(SEPARATOR, '').trim();
  if (!character) {
    return {
      keeps: null,
      problem:
        `keeps "${text}" says nothing about what it is like when you come back to it — a ` +
        `duration on its own is a shelf life, and this site does not make those. Say what ` +
        `you would actually be eating. ${EXAMPLE}`,
    };
  }

  return { keeps: { text, minutes, character }, problem: null };
}

/** The span as it is printed. Capitalisation only — the words themselves are the author's. */
export function keepsWord(keeps: Keeps): string {
  return keeps.text[0].toUpperCase() + keeps.text.slice(1);
}

/*
 * A character that has wandered into the freezer. ADVISORY, never an error: "unlike the frozen
 * version, this one…" is a legitimate sentence and refusing it would only teach authors to
 * write around the checker. But two questions in one line is how a field stops comparing, and
 * this is the one place the drift is visible.
 */
const FREEZER = /\bfreez\w*|\bfrozen\b/i;

/** True when a declared line mentions freezing, which is a different question. */
export function mentionsFreezer(keeps: Keeps | null): boolean {
  return keeps ? FREEZER.test(keeps.character) : false;
}
