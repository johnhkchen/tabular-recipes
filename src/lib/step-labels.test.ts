import { describe, expect, it } from 'vitest';
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
