import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { readStepLabels } from './step-labels.ts';

/**
 * A recipe as an author writes one: a metadata header, a blank line, then steps with blank
 * lines between them. `body` is joined with newlines so a fixture reads like the file it is.
 */
const recipe = (...body: string[]) =>
  ['>> title: Probe', '>> category: Test', '>> tags: probe', '>> servings: 4', '', ...body, ''].join(
    '\n',
  );

const MIX = 'Mix @flour{2%cups} and @water{1%cup}.';
const REST = 'Rest the @&(~1)dough{} in the #fridge{}, ~rest{30%min}.';
const BAKE = 'Bake the @&(~1)dough{} at 350°F, ~bake{30%min}.';
const PREHEAT = 'Preheat the #oven{} to 350°F.';

describe('readStepLabels', () => {
  it('binds a label to the step on the very next line', () => {
    const { labels, problems, stepCount } = readStepLabels(recipe(MIX, '', '>> step: rest it cold', REST));
    expect(problems).toEqual([]);
    // Step 0 is the mix; the label names step 1, the one under it.
    expect([...labels]).toEqual([[1, 'rest it cold']]);
    expect(stepCount).toBe(2);
  });

  it('blanks the line to a comment rather than deleting it, so line numbers hold', () => {
    const source = recipe(MIX, '', '>> step: rest it cold', REST);
    const { source: cleaned } = readStepLabels(source);
    expect(cleaned.split('\n').length).toBe(source.split('\n').length);
    expect(cleaned.split('\n')[7]).toBe('--');
    // Nothing else moved: only the label line differs.
    const differing = source
      .split('\n')
      .map((line, i) => [line, cleaned.split('\n')[i]])
      .filter(([before, after]) => before !== after);
    expect(differing).toEqual([['>> step: rest it cold', '--']]);
  });

  it('reads two labels in one file onto two different steps', () => {
    const { labels, problems } = readStepLabels(
      recipe('>> step: mix it rough', MIX, '', '>> step: rest it cold', REST, '', BAKE),
    );
    expect(problems).toEqual([]);
    // The collision in the parser's metadata map is what this whole file exists to escape.
    expect([...labels]).toEqual([
      [0, 'mix it rough'],
      [1, 'rest it cold'],
    ]);
  });

  it('labels a prep step, which the numbered form can only reach by counting prose', () => {
    const { labels, problems } = readStepLabels(
      recipe(PREHEAT, '', '>> step: line the pan, leave an overhang', 'Line the pan with parchment.', '', MIX),
    );
    expect(problems).toEqual([]);
    // A step with no ingredients is a step: it is step 1, between the preheat and the mix.
    expect([...labels]).toEqual([[1, 'line the pan, leave an overhang']]);
  });

  it('keeps everything after the first colon, punctuation and all', () => {
    const { labels } = readStepLabels(recipe('>> step: bake 350°F: hot, then 20 min', MIX));
    expect(labels.get(0)).toBe('bake 350°F: hot, then 20 min');
  });

  it('does not mind how the line was typed', () => {
    for (const line of ['>> step: rest it cold', '>>step:rest it cold', '>> Step:   rest it cold  ']) {
      const { labels, problems } = readStepLabels(recipe(line, REST));
      expect(problems, line).toEqual([]);
      expect(labels.get(0), line).toBe('rest it cold');
    }
  });

  it('hands back the source untouched when the file never writes one', () => {
    const source = recipe('>> step.2: rest it cold', MIX, '', REST);
    const reading = readStepLabels(source);
    // By reference: the 643 files on the older form do not even get scanned.
    expect(reading.source).toBe(source);
    expect(reading.labels.size).toBe(0);
    expect(reading.problems).toEqual([]);
    expect(reading.stepCount).toBe(0);
  });
});

describe('a label that does not bind fails, and says which line', () => {
  it('refuses a label with nothing under it', () => {
    const { problems } = readStepLabels(recipe(MIX, '', '>> step: rest it cold'));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('line 8:');
    expect(problems[0]).toContain('has nothing under it');
    expect(problems[0]).toContain('directly above one');
  });

  it('refuses a label with a blank line under it, which is the one the older form cannot get wrong', () => {
    const { problems, labels } = readStepLabels(recipe(MIX, '', '>> step: rest it cold', '', REST));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('line 8:');
    expect(problems[0]).toContain('has a blank line under it');
    // And it is refused rather than quietly bound to the step further down.
    expect(labels.size).toBe(0);
  });

  it('refuses a label stacked on another label', () => {
    const { problems, labels } = readStepLabels(recipe('>> step: first', '>> step: second', MIX));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('line 6:');
    expect(problems[0]).toContain('another >> step: line under it');
    // The lower one still names its step, so the message is about one line and not the file.
    expect([...labels]).toEqual([[0, 'second']]);
  });

  it('refuses a label with ordinary metadata under it', () => {
    const { problems } = readStepLabels(recipe('>> step: rest it cold', '>> slack: forgiving — it keeps', '', MIX));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('>> slack: forgiving');
    expect(problems[0]).toContain('not a step');
  });

  it('refuses a label written inside a step, because cooklang splits the step there', () => {
    const { problems, labels } = readStepLabels(recipe('Mix @flour{2%cups}', '>> step: rest it cold', 'and @water{1%cup}.'));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('line 7:');
    expect(problems[0]).toContain('is inside a step');
    expect(problems[0]).toContain('splits it in two');
    expect(labels.size).toBe(0);
  });

  it('refuses an indented label, which cooklang reads as step text', () => {
    const { problems } = readStepLabels(recipe(MIX, '', '  >> step: rest it cold', REST));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('line 8:');
    expect(problems[0]).toContain('indented');
    expect(problems[0]).toContain('inside the step');
  });

  it('refuses a label that says nothing, rather than blanking the cell', () => {
    for (const line of ['>> step:', '>> step:    ']) {
      const { problems, labels } = readStepLabels(recipe(line, MIX));
      expect(problems, line).toHaveLength(1);
      expect(problems[0], line).toContain('says nothing');
      expect(labels.size, line).toBe(0);
    }
  });

  it('refuses a file that writes both forms, naming a line of each', () => {
    const { problems } = readStepLabels(
      recipe('>> step.1: mix it rough', '', '>> step: rest it cold', REST),
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('both >> step:');
    expect(problems[0]).toContain('>> step.1:');
    expect(problems[0]).toContain('line 6');
  });

  it('reports every problem in one pass, in line order', () => {
    const { problems } = readStepLabels(
      recipe('>> step:', '', MIX, '', '>> step: rest it cold', '', REST),
    );
    expect(problems.map((p) => p.split(':')[0])).toEqual(['line 6', 'line 10']);
  });
});

/*
 * The scan of step blocks is the one rule this file borrows from the parser, so it is tested
 * on the constructs the collection does not use today as well as the ones it does.
 * scripts/normalise.mjs holds the count to the parser's own at runtime besides.
 */
describe('the step scan', () => {
  const indexes = (...body: string[]) => [...readStepLabels(recipe(...body)).labels.keys()];

  it('counts a step written over several lines once', () => {
    // The label goes on step 1; the two-line step above it is one block, not two.
    expect(indexes('Mix @flour{2%cups}', 'and @water{1%cup}.', '', '>> step: rest it cold', REST)).toEqual([1]);
  });

  it('lets a comment sit between the label and its step', () => {
    const { labels, problems } = readStepLabels(recipe(MIX, '', '>> step: rest it cold', '-- worth doing cold', REST));
    expect(problems).toEqual([]);
    expect([...labels]).toEqual([[1, 'rest it cold']]);
  });

  it('does not count a comment block, a section header or a text block as a step', () => {
    expect(indexes('-- just a note', '', '= Prep =', '', '> a quoted aside', '', MIX, '', '>> step: rest it cold', REST)).toEqual([1]);
  });

  it('counts the steps a section header separates as two', () => {
    expect(indexes(MIX, '', '= Baking =', '', BAKE, '', '>> step: rest it cold', REST)).toEqual([2]);
  });
});

/*
 * "Fails" and "renders" are properties of a whole run, not of any function's return value, so
 * the only honest way to test them is to run the checker — which is also the only way to reach
 * the WASM parser, since it never runs inside Vite. Same shape as washing-up.test.ts: fixtures
 * go to a temp directory and never to recipes/, so the collection build never sees them.
 */
describe('the checker, run for real', () => {
  const root = path.resolve(import.meta.dirname, '../..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'step-labels-'));

  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  const PREP = 'Preheat the #oven{} to 350°F.';
  const FRY = 'Fry @onion{1} and @garlic{2%cloves} in @olive oil{2%Tbs} in a #Dutch oven{}.';
  const SIMMER = 'Simmer @&(~1)base{} with @tomatoes{1%lb} and @stock{2%cups} for ~simmer{20%min}.';
  const SEASON = 'Season @&(~1)stew{} with @salt{1%tsp} and @black pepper{1/2%tsp}.';

  const file = (name: string, ...body: string[]) => {
    const target = path.join(dir, `${name}.cook`);
    fs.writeFileSync(
      target,
      ['>> title: Probe', '>> category: Stews & Braises', '>> tags: probe', '>> servings: 4', '', ...body, ''].join('\n'),
    );
    return target;
  };

  const run = (...targets: string[]) => {
    try {
      const out = execFileSync(process.execPath, ['scripts/check-recipes.mjs', '--labels', ...targets], {
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

  it('draws the label written above a step, and it wins over the derived one', () => {
    const { code, out } = run(file('binds', PREP, '', FRY, '', '>> step: simmer it down 20 min', SIMMER, '', SEASON));
    expect(code).toBe(0);
    expect(out).toContain('simmer it down 20 min');
    // The derived label for that step, which the override replaced.
    expect(out).not.toContain('simmer with');
  });

  it('applies two labels in one file, which the parser’s metadata map cannot hold', () => {
    const { code, out } = run(
      file('two', PREP, '', '>> step: fry the aromatics', FRY, '', '>> step: simmer it down 20 min', SIMMER, '', SEASON),
    );
    expect(code).toBe(0);
    expect(out).toContain('fry the aromatics');
    expect(out).toContain('simmer it down 20 min');
  });

  it('labels a prep step, which is a full-width row and not a cell', () => {
    const { code, out } = run(file('prep', '>> step: heat the oven early', PREP, '', FRY, '', SIMMER, '', SEASON));
    expect(code).toBe(0);
    // --labels prints a full-width row in brackets, with its sentence capital back.
    expect(out).toContain('[ Heat the oven early ]');
  });

  it('still derives every label for a file that writes neither form', () => {
    const { code, out } = run(file('derived', PREP, '', FRY, '', SIMMER, '', SEASON));
    expect(code).toBe(0);
    expect(out).toContain('[ Preheat the oven to 350°F ]');
    // Derived from the step's own words, ingredients stripped out — see cleanLabel().
    expect(out).toContain('fry and in in a Dutch oven');
  });

  it('fails a label with no step under it, naming the file and the line', () => {
    for (const [name, body] of [
      ['dangling-eof', [PREP, '', FRY, '', SIMMER, '', SEASON, '', '>> step: and then what']],
      ['dangling-blank', [PREP, '', FRY, '', '>> step: simmer it down', '', SIMMER, '', SEASON]],
      ['dangling-stacked', [PREP, '', '>> step: fry the aromatics', '>> step: simmer it down', FRY, '', SIMMER, '', SEASON]],
    ] as [string, string[]][]) {
      const target = file(name, ...body);
      const { code, out } = run(target);
      expect(code, name).toBe(1);
      expect(out, name).toContain('FAIL');
      expect(out, name).toContain(`${name}.cook`);
      expect(out, name).toMatch(/line \d+: >> step:/);
    }
  });

  it('fails a file that writes both forms rather than picking one', () => {
    const target = path.join(dir, 'mixed.cook');
    fs.writeFileSync(
      target,
      [
        '>> title: Probe',
        '>> category: Stews & Braises',
        '>> tags: probe',
        '>> servings: 4',
        '>> step.2: fry the aromatics',
        '',
        PREP,
        '',
        FRY,
        '',
        '>> step: simmer it down 20 min',
        SIMMER,
        '',
        SEASON,
        '',
      ].join('\n'),
    );
    const { code, out } = run(target);
    expect(code).toBe(1);
    expect(out).toContain('mixed.cook');
    expect(out).toContain('both >> step:');
    expect(out).toContain('>> step.2:');
  });

  /*
   * The claim the whole ticket rests on, made on a real recipe rather than a fixture: the two
   * forms are the same thing. Both files are built from the same recipe with its own overrides
   * stripped, so this keeps working whichever form the collection is written in when it runs.
   */
  it('renders one real recipe identically written either way', () => {
    const REAL = 'recipes/soups/new-england-clam-chowder.cook';
    const source = fs.readFileSync(path.join(root, REAL), 'utf8');
    const bare = source.split('\n').filter((line) => !/^>>[ \t]*step[.:]/i.test(line));

    // Step blocks, found here rather than borrowed from the module under test.
    const starts = bare
      .map((line, i) => ({ line, i }))
      .filter(({ line, i }) => {
        const previous = bare[i - 1];
        return line.trim() && !line.startsWith('>>') && (previous === undefined || !previous.trim() || previous.startsWith('>>'));
      })
      .map(({ i }) => i);
    expect(starts.length).toBeGreaterThanOrEqual(5);

    const labels = new Map([
      [1, 'sweat them soft, 8 min'],
      [3, 'simmer 15 min, potatoes tender'],
      [starts.length - 1, 'season it last'],
    ]);

    const numbered = [
      ...bare.slice(0, 1),
      ...[...labels].map(([step, text]) => `>> step.${step + 1}: ${text}`),
      ...bare.slice(1),
    ].join('\n');

    const inline = bare
      .flatMap((line, i) => {
        const step = starts.indexOf(i);
        return step >= 0 && labels.has(step) ? [`>> step: ${labels.get(step)}`, line] : [line];
      })
      .join('\n');

    fs.writeFileSync(path.join(dir, 'real-numbered.cook'), numbered);
    fs.writeFileSync(path.join(dir, 'real-inline.cook'), inline);

    const clean = (name: string) => run(path.join(dir, name)).out.split(path.join(dir, name)).join('<file>');
    const fromNumbered = clean('real-numbered.cook');
    const fromInline = clean('real-inline.cook');

    // Not vacuously equal: the labels are in there, and the file really did draw a table.
    for (const text of labels.values()) expect(fromInline).toContain(text);
    expect(fromInline).toContain('  ok   ');
    expect(fromInline).toBe(fromNumbered);
  });
});
