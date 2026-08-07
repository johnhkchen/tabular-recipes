import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { readStepRefs, refProblems, resolveRef } from './step-refs.ts';

/** A recipe as an author writes one: a metadata header, a blank line, then steps. */
const recipe = (...body: string[]) =>
  ['>> title: Probe', '>> category: Test', '>> tags: probe', '>> servings: 4', '', ...body, ''].join(
    '\n',
  );

describe('resolveRef', () => {
  /*
   * The window is `0 <= target < stepIndex`, and the upper bound is the referring step rather
   * than the recipe's length. A recipe is read downwards: a step cannot consume itself, and it
   * cannot consume something that has not been made yet.
   */
  it('reads an absolute reference as a 1-based step number, prep steps included', () => {
    expect(resolveRef('3', 5)).toBe(2);
    expect(resolveRef('1', 5)).toBe(0);
  });

  it('reads a relative reference as a count back from the step doing the referring', () => {
    expect(resolveRef('~1', 5)).toBe(4);
    expect(resolveRef('~5', 5)).toBe(0);
  });

  it('refuses a reference that lands outside the steps above it', () => {
    expect(resolveRef('99', 5)).toBeNull(); // past the end of the file
    expect(resolveRef('0', 5)).toBeNull(); // there is no step zero
    expect(resolveRef('~9', 5)).toBeNull(); // past the start of the file
    expect(resolveRef('6', 5)).toBeNull(); // itself: step 6 is index 5
    expect(resolveRef('7', 5)).toBeNull(); // a step below it, not made yet
    expect(resolveRef('~0', 5)).toBeNull(); // itself, the other way round
  });

  it('gives the first step nothing to point at', () => {
    expect(resolveRef('~1', 0)).toBeNull();
    expect(resolveRef('1', 0)).toBeNull();
  });
});

describe('readStepRefs', () => {
  const MIX = 'Mix @flour{2%cups} and @water{1%cup}.';
  const REST = 'Rest the @&(~1)dough{} in the #fridge{}, ~rest{30%min}.';

  it('reads the tokens of each step, in written order', () => {
    expect(readStepRefs(recipe(MIX, '', REST))).toEqual([[], ['~1']]);
  });

  it('keeps two references in one step in the order they were written', () => {
    expect(
      readStepRefs(recipe(MIX, '', MIX, '', 'Fold @&(~1)dry{} into @&(1)wet{} with @&(2)eggs{}.')),
    ).toEqual([[], [], ['~1', '1', '2']]);
  });

  it('finds a reference on the second line of a step that runs over two', () => {
    expect(
      readStepRefs(recipe(MIX, '', 'Fold @&(~1)dry{} in slowly,', 'then rest @&(1)it{} cold.')),
    ).toEqual([[], ['~1', '1']]);
  });

  it('does not count a reference written inside a comment', () => {
    // A `--` line is transparent to the block scan and dropped by the parser, so a token in
    // one is not a reference and must not be counted as one.
    expect(readStepRefs(recipe(MIX, '', '-- was @&(9)wrong{} before', REST))).toEqual([[], ['~1']]);
  });

  it('does not count a reference written inside a metadata line', () => {
    // A `>>` line closes a block, so it belongs to no step. The label a reader sees is not
    // a place references live.
    expect(readStepRefs(recipe(MIX, '', '>> step: rest @&(9)it{} cold', REST))).toEqual([
      [],
      ['~1'],
    ]);
  });

  it('gives a file with no references one empty list per step', () => {
    expect(readStepRefs(recipe(MIX, '', MIX))).toEqual([[], []]);
  });
});

describe('refProblems', () => {
  it('says nothing about references that all resolve', () => {
    expect(refProblems([[], ['~1']], [[], [0]])).toEqual([]);
  });

  it('names the step and the token of a reference that points at no step', () => {
    const [problem] = refProblems([[], [], ['~1', '99']], [[], [], [1]]);
    expect(problem).toContain('step 3');
    expect(problem).toContain('@&(99)');
    // The part nobody would guess: the page does not go missing, it grows a row.
    expect(problem).toContain('ingredient');
  });

  it('tells the first step it has nothing above it, rather than counting to zero', () => {
    const [problem] = refProblems([['~1']], [[]]);
    expect(problem).toContain('step 1 has nothing above it');
    expect(problem).not.toContain('0 step');
  });

  it('does not offer an example that is the number already written', () => {
    // "step 3 writes @&(3) … a reference names a step from the top (@&(3))" would read as
    // though the fix were what the author already typed.
    const [problem] = refProblems([[], [], ['~1', '3']], [[], [], [1]]);
    expect(problem).not.toMatch(/@&\(3\).*@&\(3\)/s);
  });

  it('reports a disagreement with the parser as a bug in itself, not in the file', () => {
    // Unreachable on any real file — quiet across all 685 — but it is the guard that stops a
    // scan drifting away from the parser without anyone noticing.
    const [problem] = refProblems([[], ['~1']], [[], []]);
    expect(problem).toContain('bug in readStepRefs()');
  });
});

/*
 * "Fails" is a property of a whole run, not of any function's return value, so the only honest
 * way to test it is to run the checker — which is also the only way to reach the WASM parser,
 * since it never runs inside Vite. Same shape as step-labels.test.ts and washing-up.test.ts:
 * fixtures go to a temp directory and never to recipes/, so the collection build never sees them.
 */
describe('the checker, run for real', () => {
  const root = path.resolve(import.meta.dirname, '../..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'step-refs-'));

  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  const PREP = 'Preheat the #oven{} to 350°F.';
  const DRY = 'Whisk @all-purpose flour{2%cup}, @sugar{1%cup}, @table salt{1%tsp}.';
  const WET = 'Whisk @eggs{2}, @whole milk{1%cup}, @vegetable oil{1/2%cup}.';

  const file = (name: string, ...body: string[]) => {
    const target = path.join(dir, `${name}.cook`);
    fs.writeFileSync(
      target,
      ['>> title: Probe', '>> category: Cakes & Loaves', '>> tags: probe', '>> servings: 4', '', ...body, ''].join('\n'),
    );
    return target;
  };

  const run = (...targets: string[]) => {
    try {
      const out = execFileSync(process.execPath, ['scripts/check-recipes.mjs', ...targets], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return { code: 0, out };
    } catch (error) {
      const failure = error as { status: number; stdout: string };
      return { code: failure.status, out: failure.stdout };
    }
  };

  it('draws a table for a file whose references all land', () => {
    const { code, out } = run(
      file('healthy', DRY, '', WET, '', 'Fold @&(~1)wet{} into @&(1)dry{} and bake ~bake{40%min}.'),
    );
    expect(code).toBe(0);
    expect(out).toContain('ok ');
  });

  /* ---- the reference that names no step at all: silent until this ticket ---- */

  it('fails on a reference past the end of the file, and names the file and the step', () => {
    const target = file(
      'past-the-end',
      DRY,
      '',
      WET,
      '',
      'Fold @&(~1)wet{} into @&(1)dry{}.',
      '',
      'Bake @&(~1)batter{} with @&(99)glaze{} at 350°F ~bake{40%min}.',
    );
    const { code, out } = run(target);
    expect(code).toBe(1);
    expect(out).toContain(path.basename(target));
    expect(out).toContain('step 4');
    expect(out).toContain('@&(99)');
    // Without the check this file draws 7 rows x 4 cols with "glaze" as an ingredient row.
    expect(out).not.toContain('ok ');
  });

  it('fails on a relative reference past the start of the file', () => {
    const { code, out } = run(
      file('past-the-start', DRY, '', WET, '', 'Fold @&(~1)wet{} into @&(~9)dry{}.'),
    );
    expect(code).toBe(1);
    expect(out).toContain('@&(~9)');
    expect(out).toContain('step 3');
  });

  it('fails on @&(0), because there is no step zero', () => {
    const { code, out } = run(file('zero', DRY, '', WET, '', 'Fold @&(~1)wet{} into @&(0)dry{}.'));
    expect(code).toBe(1);
    expect(out).toContain('@&(0)');
  });

  it('fails on a step that references itself', () => {
    const { code, out } = run(
      file('itself', DRY, '', WET, '', 'Fold @&(~1)wet{} into @&(3)itself{}.'),
    );
    expect(code).toBe(1);
    expect(out).toContain('@&(3)');
    expect(out).toContain('step 3');
  });

  /* ---- the reference at a step that makes nothing: already refused ----------
   *
   * These two pass on the code as it stood before T-009-04. src/lib/tree.ts:174-178 has
   * always thrown when a resolved reference lands on a step that earned no column — a prep
   * step, a full-width row. The acceptance criterion asked to show the test that proves it
   * if the build already does it, and there was no such test anywhere in the repo. There is
   * now, so deleting that throw fails the suite instead of quietly re-opening the hole.
   */

  it('fails on an absolute reference to a prep step, which makes nothing', () => {
    const target = file(
      'prep-absolute',
      PREP,
      '',
      DRY,
      '',
      WET,
      '',
      'Fold @&(~1)wet{} into @&(2)dry{}.',
      '',
      'Bake @&(~1)batter{} in @&(1)the oven{} ~bake{40%min}.',
    );
    const { code, out } = run(target);
    expect(code).toBe(1);
    expect(out).toContain(path.basename(target));
    expect(out).toContain('step 5 references step 1, which makes nothing');
  });

  it('fails on a relative reference to a prep step, which is the same mistake', () => {
    const { code, out } = run(
      file(
        'prep-relative',
        PREP,
        '',
        DRY,
        '',
        WET,
        '',
        'Fold @&(~1)wet{} into @&(2)dry{}.',
        '',
        'Bake @&(~1)batter{} in @&(~4)the oven{} ~bake{40%min}.',
      ),
    );
    expect(code).toBe(1);
    expect(out).toContain('step 5 references step 1, which makes nothing');
  });

  /* ---- the whole collection, which is why this check could be turned on ---- */

  it('leaves every recipe in the collection drawing a table', () => {
    // 2,500 reference tokens across 685 files, none of them dangling. The check is a
    // ratchet, not a repair: it landed green and it has to stay green.
    const { code, out } = run();
    expect(code).toBe(0);
    expect(out).toContain('draw a table.');
    expect(out).not.toContain('points at no step');
  });
});
