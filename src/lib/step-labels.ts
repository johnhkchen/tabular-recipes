/*
 * The label that sits on the line above its step.
 *
 *     Blanch @pork neck bones{2%lb}(900 g) from cold in a #soup pot{}, ~blanch{10%min}.
 *
 *     >> step: soak the flower 30 min, then rinse it hard
 *     Soak @dried overlord flower{2%oz}(60 g) in cold water, ~soak{30%min}.
 *
 * The older form, `>> step.4:`, names a step by counting to it, and the count is written
 * somewhere the step is not: insert an operation and every override below it labels the wrong
 * row, silently. This form has no number to get wrong. What it needs instead is to know WHERE
 * the line sat, and that is the one thing the parser throws away — a mid-file `>> key: value`
 * is hoisted into `raw_metadata.map`, where two `>> step:` lines in one file collide and the
 * last one wins.
 *
 * So the positions are read here, off the source, before the parser ever sees it. Three
 * things about cooklang 0.18.7 hold this up, all of them measured rather than assumed:
 *
 *  1. A `>> key: value` line that STARTS a block does not split the step under it. That is
 *     what makes the form possible at all.
 *  2. A `>> key: value` line in the MIDDLE of a step splits that step in two — which would
 *     move every step below it. Hence the rule that a label may not sit inside a step.
 *  3. A comment line (`--`) neither opens nor closes a block. So each label line is blanked
 *     to `--` in place rather than deleted: the parse comes out byte-identical to the same
 *     file with the line removed, and every line number below it still points where it did.
 *
 * Pure — no parser, no filesystem — so all of it is testable directly. `scripts/normalise.mjs`
 * calls it, hands the blanked source to the parser, and reads `labels` where it used to read
 * `metadata['step.' + (index + 1)]`. Nothing downstream can tell which form a file used.
 */

/** A recipe's inline step labels, read off the source before the parser sees it. */
export interface StepLabels {
  /** The source with every label line blanked to `--`. The same number of lines, always. */
  source: string;
  /** Label text by 0-based step index — the same index normalise() counts steps with. */
  labels: Map<number, string>;
  /** Step blocks this scan found. normalise() holds the parser to the same number. */
  stepCount: number;
  /** Every way the labels were written wrong, in line order. Each one names its line. */
  problems: string[];
}

/** `>> step: bake 30 min`. Cooklang only reads `>>` at the start of a line, so this does too. */
const INLINE = /^>>[ \t]*step[ \t]*:(.*)$/i;

/**
 * The same line with a space in front of it, which cooklang does NOT read as metadata: the
 * whole line falls into the step below and the words turn up in the cell. Matched so that it
 * can be refused, because the alternative is a page that is confidently wrong.
 */
const INDENTED = /^[ \t]+>>[ \t]*step[ \t]*:/i;

/** `>> step.7:` — matched only to catch a file that writes both forms. */
const NUMBERED = /^>>[ \t]*step\.(\d+)[ \t]*:/i;

/** Either form of the inline line, anywhere in the file. The fast path turns on this. */
const ANY_INLINE = /^[ \t]*>>[ \t]*step[ \t]*:/im;

type Shape = 'blank' | 'metadata' | 'section' | 'text' | 'comment' | 'step';

/**
 * What cooklang does with one line, to the only depth this file needs: does it open a step,
 * close one, or neither. `>>` and `--` are recognised at the start of the line because that
 * is where cooklang recognises them; an indented `>>` really is step text.
 */
function classify(line: string): Shape {
  if (!line.trim()) return 'blank';
  if (/^>>/.test(line)) return 'metadata';
  if (/^\s*=/.test(line)) return 'section';
  if (/^\s*>(?!>)/.test(line)) return 'text';
  if (/^\s*--/.test(line)) return 'comment';
  return 'step';
}

/**
 * The line each step block starts on, in order. This duplicates a rule that properly belongs
 * to the parser, which is why normalise() checks the count against the parser's own before it
 * trusts a single label. Blank lines, metadata, section headers and text blocks close a block;
 * a comment is transparent; anything else opens one.
 */
function scanSteps(lines: string[]): number[] {
  const starts: number[] = [];
  let open = false;
  for (const [i, line] of lines.entries()) {
    const shape = classify(line);
    if (shape === 'comment') continue;
    if (shape !== 'step') {
      open = false;
      continue;
    }
    if (!open) {
      starts.push(i);
      open = true;
    }
  }
  return starts;
}

/** The nearest line above `i` that is not blank and not a comment, or null at the top. */
function above(lines: string[], i: number): Shape | null {
  for (let j = i - 1; j >= 0; j--) {
    const shape = classify(lines[j]);
    if (shape === 'comment') continue;
    return shape;
  }
  return null;
}

/**
 * The next line below `i` that says something — comments and blank lines skipped — and whether
 * a blank line was crossed to reach it. Null when the rest of the file is blank: a label above
 * nothing but the file's own trailing newline has nothing under it, not a blank line under it.
 */
function below(
  lines: string[],
  i: number,
): { index: number; shape: Shape; acrossBlank: boolean } | null {
  let acrossBlank = false;
  for (let j = i + 1; j < lines.length; j++) {
    const shape = classify(lines[j]);
    if (shape === 'comment') continue;
    if (shape === 'blank') {
      acrossBlank = true;
      continue;
    }
    return { index: j, shape, acrossBlank };
  }
  return null;
}

/**
 * Reads the `>> step:` lines out of a recipe.
 *
 * A file with none — every file that uses the older numbered form — comes straight back with
 * its own source object, unscanned and unchanged. Nothing below that line can reach it.
 */
export function readStepLabels(source: string): StepLabels {
  if (!ANY_INLINE.test(source)) {
    return { source, labels: new Map(), stepCount: 0, problems: [] };
  }

  const lines = source.split('\n');
  const labels = new Map<number, string>();
  const found: { line: number; text: string }[] = [];

  // Blanked in place, not deleted, so a message can name the line the author is looking at.
  const blanked = lines.map((line) => (INLINE.test(line) ? '--' : line));
  const stepOf = new Map(scanSteps(blanked).map((start, index) => [start, index]));

  const say = (line: number, text: string) => found.push({ line, text });

  let firstInline: number | null = null;

  for (const [i, line] of lines.entries()) {
    if (INDENTED.test(line)) {
      say(
        i,
        'a >> step: line is indented — cooklang only reads >> at the start of a line, so these ' +
          'words would end up inside the step instead of naming it',
      );
      continue;
    }

    const match = line.match(INLINE);
    if (!match) continue;
    if (firstInline === null) firstInline = i;

    const value = match[1].trim();
    if (!value) {
      say(i, '>> step: says nothing — write the label after the colon, e.g. >> step: soak 30 min');
      continue;
    }

    // A label in the middle of a step does not just miss: it splits the step in two and moves
    // every step below it. Refused before anything is bound.
    if (above(lines, i) === 'step') {
      say(
        i,
        `>> step: "${value}" is inside a step — a >> line in the middle of a step splits it in ` +
          'two, so put the label above the whole step',
      );
      continue;
    }

    const next = below(lines, i);
    if (!next) {
      say(
        i,
        `>> step: "${value}" has nothing under it — the label names the step on the next line, ` +
          'so put it directly above one',
      );
      continue;
    }
    if (next.acrossBlank) {
      say(
        i,
        `>> step: "${value}" has a blank line under it — the label binds to the step on the very ` +
          'next line, so close the gap',
      );
      continue;
    }
    if (next.shape !== 'step') {
      const what = INLINE.test(lines[next.index]) ? 'another >> step: line' : `"${lines[next.index].trim()}"`;
      say(
        i,
        `>> step: "${value}" has ${what} under it, not a step — put the label directly above the ` +
          'step it names',
      );
      continue;
    }

    const index = stepOf.get(next.index);
    if (index === undefined) {
      // Unreachable unless scanSteps() and the walk above disagree about what a step is.
      say(i, `>> step: "${value}" could not be bound to a step — that is a bug in readStepLabels()`);
      continue;
    }
    labels.set(index, value);
  }

  // Both forms in one file is ambiguous about which wins, and a reader should not have to work
  // that out. Reported once, at the first inline line, naming a line of each.
  const numbered = lines.findIndex((line) => NUMBERED.test(line));
  if (firstInline !== null && numbered >= 0) {
    say(
      firstInline,
      `this file writes both >> step: and ${lines[numbered].trim().split(':')[0]}: (line ` +
        `${numbered + 1}) — use one or the other, and the label above its step is the one to use`,
    );
  }

  return {
    source: blanked.join('\n'),
    labels,
    stepCount: stepOf.size,
    problems: found
      .sort((a, b) => a.line - b.line)
      .map((problem) => `line ${problem.line + 1}: ${problem.text}`),
  };
}
