/*
 * How much room a recipe leaves you, and what actually goes wrong when you run out.
 *
 * The clock under the table says how long a dish takes and how much of that you have to
 * stand there for. It says nothing about the question people are more nervous about: what
 * happens if I get it wrong. That is what this is.
 *
 * Two rules hold the whole file up.
 *
 * 1. IT IS AUTHORED, NEVER DERIVED. Nothing here reads a timer, a step count or an
 *    ingredient count. A five-minute custard is less forgiving than a six-hour braise, and
 *    any formula that gets that backwards is worse than nothing. The value enters the system
 *    in one place: a line a cook wrote.
 *
 * 2. THE VALUE IS IN THE REASON. "Forgiving" on its own is a vibe. "An extra hour in the pot
 *    changes little" is something you can plan an evening around, and so is "the custard
 *    breaks past 82°C and will not come back." So a level without a reason is not a reading
 *    — it fails the check the same way an unknown counter does — and a recipe that cannot
 *    name its real failure has not earned a rating. Absent is a legitimate, honest answer,
 *    and most of the collection is absent.
 */

/**
 * The whole controlled vocabulary, in declaration order: most room to least.
 *
 * Three words a cook says, not a scale. `narrow` rather than `fussy` because a fussy recipe
 * is a fiddly one — that is the clock's "needs you" figure, two lines further up the same
 * panel — and this is about the size of the window, not the size of the job.
 */
export const SLACK_LEVELS = ['forgiving', 'narrow', 'unforgiving'] as const;

/**
 *  - `forgiving`    the window is wide; late costs little, and sometimes it improves.
 *  - `narrow`       there is a real window and you have to hit it. Miss it and the dish is
 *                   worse — but it is still dinner.
 *  - `unforgiving`  miss it and it is gone: broken, ruined or unsafe. It does not come back.
 */
export type SlackLevel = (typeof SLACK_LEVELS)[number];

export interface Slack {
  level: SlackLevel;
  /** Never empty. A level with nothing after it is not a reading. */
  reason: string;
}

/** Whole, or nothing — and when it is nothing, what to tell the person who wrote the line. */
export interface SlackReading {
  slack: Slack | null;
  /** Null when the line is absent (which is fine) or whole. */
  problem: string | null;
}

const isLevel = (word: string): word is SlackLevel =>
  (SLACK_LEVELS as readonly string[]).includes(word);

/**
 * `>> slack: forgiving — an extra hour in the pot changes little`
 *
 * The first word is the level; the rest of the line is the reason. Whatever joins them —
 * an em dash, a hyphen, a colon, a comma, or nothing at all — is punctuation, and a checker
 * that spends its credibility on punctuation has none left for the level. So: liberal about
 * how a human wrote it, strict about what it means.
 */
export function readSlack(value: string | null | undefined): SlackReading {
  const line = value?.trim();
  if (!line) return { slack: null, problem: null };

  // The first run of letters is the level; one separator after it is punctuation, spaced or
  // not; everything left is the reason, dashes of its own included.
  const match = line.match(/^(\p{L}+)\s*[—–:,-]?\s*([\s\S]*)$/u);
  const word = match?.[1] ?? line.split(/\s+/)[0];
  const level = word.toLowerCase();

  if (!match || !isLevel(level)) {
    return {
      slack: null,
      problem:
        `unknown slack "${word}" — it has to be one of: ${SLACK_LEVELS.join(', ')}, ` +
        `and the rest of the line says what goes wrong`,
    };
  }

  const reason = match[2].trim();
  if (!reason) {
    return {
      slack: null,
      problem:
        `slack "${level}" gives no reason — name the actual failure, ` +
        `e.g. >> slack: forgiving — an extra hour in the pot changes little`,
    };
  }

  return { slack: { level, reason }, problem: null };
}

/** The level as it is printed. Capitalisation only — the word itself is the author's. */
export function slackWord(level: SlackLevel): string {
  return level[0].toUpperCase() + level.slice(1);
}
