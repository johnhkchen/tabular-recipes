/*
 * The label that sits on the line above its step.
 *
 *     Blanch @pork neck bones{2%lb}(900 g) from cold in a #soup pot{}, ~blanch{10%min}.
 *
 *     >> step: soak the flower 30 min, then rinse it hard
 *     Soak @dried overlord flower{2%oz}(60 g) in cold water, ~soak{30%min}.
 *
 * The form this replaced, `>> step.4:`, named a step by counting to it, and the count was
 * written somewhere the step was not: insert an operation and every override below it labelled
 * the wrong row, silently. T-009-03 removed it — a numbered line is now refused here, by name,
 * with the same label written the new way. This form has no number to get wrong. What it needs
 * instead is to know WHERE the line sat, and that is the one thing the parser throws away — a
 * mid-file `>> key: value` is hoisted into `raw_metadata.map`, where two `>> step:` lines in one
 * file collide and the last one wins.
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
 * calls it, hands the blanked source to the parser, and reads `labels`. There is one form, so
 * nothing downstream has to ask which one a file used.
 */

/** A `>> step.N:` line: the numbered form, which this project no longer reads. */
export interface NumberedLabel {
  /** 0-based line index, so a message can say `line ${line + 1}`. */
  line: number;
  /** The N that was written. Not resolved to a step — nothing resolves it any more. */
  n: number;
  /** What was written after the colon, trimmed. Empty when the line says nothing. */
  text: string;
}

/** A recipe's inline step labels, read off the source before the parser sees it. */
export interface StepLabels {
  /** The source with every label line blanked to `--`. The same number of lines, always. */
  source: string;
  /** Label text by 0-based step index — the same index normalise() counts steps with. */
  labels: Map<number, string>;
  /**
   * The line each step block starts on, in order. Its length is the step count normalise()
   * holds the parser to; the positions are what scripts/inline-step-labels.mjs inserts against,
   * so that the scan which finds a step and the scan which binds a label are the same one.
   */
  stepLines: number[];
  /** Every way the labels were written wrong, in line order. Each one names its line. */
  problems: string[];
  /**
   * Every `>> step.N:` line in the file. `problems` carries exactly one entry for each of these,
   * which is how the fixer tells "only the numbered form is wrong here" from "and something
   * else is too" without reading the messages.
   */
  numbered: NumberedLabel[];
}

/** `>> step: bake 30 min`. Cooklang only reads `>>` at the start of a line, so this does too. */
const INLINE = /^>>[ \t]*step[ \t]*:(.*)$/i;

/**
 * The same line with a space in front of it, which cooklang does NOT read as metadata: the
 * whole line falls into the step below and the words turn up in the cell. Matched so that it
 * can be refused, because the alternative is a page that is confidently wrong.
 */
const INDENTED = /^[ \t]+>>[ \t]*step[ \t]*:/i;

/** `>> step.7: simmer 15 min` — the numbered form, matched so that it can be refused. */
const NUMBERED = /^>>[ \t]*step\.(\d+)[ \t]*:(.*)$/i;

/** Either form of the inline line, anywhere in the file. The fast path turns on this. */
const ANY_INLINE = /^[ \t]*>>[ \t]*step[ \t]*:/im;

/** A numbered line anywhere in the file. The fast path has to see these too, or nothing does. */
const ANY_NUMBERED = /^>>[ \t]*step\.\d+[ \t]*:/im;

/** The script that moves a numbered label onto the line above its step. Named in the refusal. */
const FIXER = 'node scripts/inline-step-labels.mjs --write';

/*
 * What a numbered line gets told. Somebody will type the old form from muscle memory, and this
 * message is the only documentation they are going to read, so it does three things: it says the
 * form is gone, it hands back THEIR OWN label rewritten so it can be copied out of the terminal,
 * and it names the script that will do it for them. `--write` and not the bare command, because
 * the bare command is a dry run and a reader who sees nothing change is worse off than before.
 *
 * The N is used to say WHICH step and then thrown away, which is the whole change in one line.
 */
function numberedRefusal({ n, text }: NumberedLabel): string {
  const rewritten = text
    ? `Write ">> step: ${text}" on the line above step ${n}`
    : `Write ">> step:" with the label after the colon on the line above step ${n}`;
  return (
    `>> step.${n}: is the numbered form, and it is gone — the label goes on the line directly ` +
    `above the step it names. ${rewritten}, or run ${FIXER} and it will move every one of them ` +
    'for you.'
  );
}

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
 * Reads the `>> step:` lines out of a recipe, and refuses the numbered form.
 *
 * A file that writes neither comes straight back with its own source object, unscanned and
 * unchanged. Nothing below that line can reach it. A file that writes only `>> step.N:` used to
 * take that same exit, which is why the fast path has to ask about both: a form nobody looks for
 * is a form nobody can reject.
 */
export function readStepLabels(source: string): StepLabels {
  if (!ANY_INLINE.test(source) && !ANY_NUMBERED.test(source)) {
    return { source, labels: new Map(), stepLines: [], problems: [], numbered: [] };
  }

  const lines = source.split('\n');
  const labels = new Map<number, string>();
  const numbered: NumberedLabel[] = [];
  const found: { line: number; text: string }[] = [];

  // Blanked in place, not deleted, so a message can name the line the author is looking at.
  const blanked = lines.map((line) => (INLINE.test(line) ? '--' : line));
  const stepOf = new Map(scanSteps(blanked).map((start, index) => [start, index]));

  const say = (line: number, text: string) => found.push({ line, text });

  for (const [i, line] of lines.entries()) {
    // Before anything binds, because a numbered line binds to nothing. One message per line
    // rather than one per file: four of them are four things to fix, in the order they appear.
    const counted = line.match(NUMBERED);
    if (counted) {
      const hit = { line: i, n: Number(counted[1]), text: counted[2].trim() };
      numbered.push(hit);
      say(i, numberedRefusal(hit));
      continue;
    }

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

  /*
   * There used to be a "this file writes both forms" message here. There is one form now, so a
   * file writing the other gets told that once per line it wrote, and being told twice about
   * one line would be the second thing wrong with it.
   */
  return {
    source: blanked.join('\n'),
    labels,
    stepLines: [...stepOf.keys()],
    problems: found
      .sort((a, b) => a.line - b.line)
      .map((problem) => `line ${problem.line + 1}: ${problem.text}`),
    numbered,
  };
}
