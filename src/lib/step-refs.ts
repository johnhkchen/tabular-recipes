/*
 * The references a recipe WRITES, as against the ones the parser managed to resolve.
 *
 *     Fold @&(~1)dry mixture{} into @&(3)egg mixture{}.
 *
 * Both forms name a step: `3` counts from the top of the file, prep steps included; `~1`
 * counts back from the step doing the referring. The parser resolves either to a step index,
 * and src/lib/tree.ts turns that index into an edge. Nothing downstream can tell the two
 * forms apart, which is the point — a reference is a reference.
 *
 * What this file exists for is the reference that resolves to nothing. cooklang does not
 * refuse one. `@&(99)glaze{}` in a five-step recipe comes back with relation `definition`
 * rather than `reference`, so the branch in scripts/normalise.mjs that recognises an edge
 * never fires and the token falls through into the ingredient list four lines below. The
 * table then draws a row called "glaze" with no quantity, the check prints `ok`, and a
 * reader gets a confident, plausible, incorrect page — the exact failure the numbered
 * `>> step.N:` label had, in the one other place this format counts steps by hand.
 *
 * An in-range reference that points at a step making nothing is already refused, by
 * src/lib/tree.ts:174-178. This is the other half: the reference that points at no step at
 * all. It cannot be seen after parsing, because by then the token is an ingredient and looks
 * like every other ingredient. So it is read off the source first, the same way and for the
 * same reason src/lib/step-labels.ts reads label positions off the source first.
 *
 * Pure — no parser, no filesystem — so all of it is testable directly.
 */
import { stepBlocks } from './step-labels.ts';

/** `@&(~1)batter{}` and `@&(3)dough{}` — the token, not the ingredient name after it. */
const REF = /@&\((~?\d+)\)/g;

/**
 * Where one reference token points, as a 0-based step index, or null when it points nowhere.
 *
 * The window is `0 <= target < stepIndex`. The upper bound is the referring step rather than
 * the recipe's length, because a recipe is read downwards: a step cannot consume itself, and
 * it cannot consume something that has not been made yet. Writing the bound that way is what
 * makes `@&(3)` in step 3, `@&(7)` in step 5, `@&(0)` and `@&(~9)` all fall out of one rule
 * instead of needing four.
 *
 * Measured against cooklang 0.18.7: every token this returns null for is a token the parser
 * silently turns into an ingredient.
 */
export function resolveRef(token: string, stepIndex: number): number | null {
  const relative = token.startsWith('~');
  const n = Number(relative ? token.slice(1) : token);
  if (!Number.isInteger(n)) return null;
  const target = relative ? stepIndex - n : n - 1;
  return target >= 0 && target < stepIndex ? target : null;
}

/**
 * Every reference token written in each step, in written order, by step index.
 *
 * Hand it the same source the parser was handed — scripts/normalise.mjs blanks the
 * `>> step:` lines before parsing, so it passes the blanked copy here too. Metadata lines
 * and comments are not part of a step block, so a `@&(…)` written in one is not a reference
 * and is not counted.
 */
export function readStepRefs(source: string): string[][] {
  const lines = source.split('\n');
  return stepBlocks(lines).map((block) =>
    block.flatMap((i) => [...lines[i].matchAll(REF)].map((match) => match[1])),
  );
}

/**
 * What is wrong with the references in one recipe.
 *
 * `written` is readStepRefs(); `resolved` is what the parser made of the same file, one
 * array of step indices per step. Each problem names the step and the token it is about.
 * The file is not named here — both callers already prefix it, check-recipes.mjs with its
 * `FAIL <path>` line and parse-recipes.mjs with `${recipe.path}:`.
 */
export function refProblems(written: string[][], resolved: number[][]): string[] {
  const problems: string[] = [];

  for (const [index, tokens] of written.entries()) {
    const at = `step ${index + 1}`;
    const targets = tokens.map((token) => resolveRef(token, index));

    for (const [i, target] of targets.entries()) {
      if (target !== null) continue;
      /*
       * Three things, because the failure is invisible without all three: where it is, that
       * the token quietly stopped being a reference, and what the two legal forms are. The
       * middle one is the part nobody would guess — the page does not go missing, it grows
       * an ingredient.
       */
      problems.push(
        `${at} writes @&(${tokens[i]}), which points at no step — cooklang read it as an ` +
          `ingredient instead of a reference, so the table would draw a row that is not an ` +
          `ingredient. A reference names a step from the top of the file (@&(3), counting ` +
          `prep steps) or counts back from this one (@&(~1)), and either way it has to land ` +
          `on one of the ${index} step(s) above it.`,
      );
    }

    /*
     * The reader is held to the parser's own answer, the way normalise() holds the label
     * pre-pass to the parser's step count. This can only fire on a cooklang construct the
     * scan does not understand, and when it does it is a bug here rather than in the file —
     * which is what the message says. Quiet across all 685 recipes and 2,500 references.
     */
    const found = targets.filter((target) => target !== null);
    if (found.length !== (resolved[index]?.length ?? 0)) {
      problems.push(
        `${at}: this file's references read as [${found.join(', ')}] and the parser resolved ` +
          `${resolved[index]?.length ?? 0} of them — that is a bug in readStepRefs(), not in ` +
          `this file`,
      );
    }
  }

  return problems;
}
