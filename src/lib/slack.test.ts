import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { SLACK_LEVELS, readSlack, slackWord } from './slack.ts';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const declared = all.filter((recipe) => recipe.slack !== null);

describe('readSlack', () => {
  it('reads each level, and keeps the reason as the author wrote it', () => {
    expect(readSlack('forgiving — an extra hour in the pot changes little')).toEqual({
      slack: { level: 'forgiving', reason: 'an extra hour in the pot changes little' },
      problem: null,
    });
    expect(readSlack('narrow — pull it at 12 minutes or the pasta is soft')).toEqual({
      slack: { level: 'narrow', reason: 'pull it at 12 minutes or the pasta is soft' },
      problem: null,
    });
    expect(readSlack('unforgiving — the custard breaks past 82°C and will not come back')).toEqual({
      slack: {
        level: 'unforgiving',
        reason: 'the custard breaks past 82°C and will not come back',
      },
      problem: null,
    });
  });

  it('takes whichever separator the author reached for, or none at all', () => {
    const reason = 'it goes grey and stays grey';
    for (const line of [
      `narrow — ${reason}`,
      `narrow – ${reason}`,
      `narrow - ${reason}`,
      `narrow: ${reason}`,
      `narrow, ${reason}`,
      `narrow ${reason}`,
    ]) {
      expect(readSlack(line).slack, line).toEqual({ level: 'narrow', reason });
    }
  });

  it('does not eat a dash that belongs to the reason', () => {
    expect(readSlack('narrow — pull it at 200°F — 10° over and it is dry').slack?.reason).toBe(
      'pull it at 200°F — 10° over and it is dry',
    );
  });

  it('does not mind how the line was typed', () => {
    expect(readSlack('  Forgiving  —  it only improves overnight  ').slack).toEqual({
      level: 'forgiving',
      reason: 'it only improves overnight',
    });
    expect(readSlack('UNFORGIVING: the sugar burns in seconds').slack?.level).toBe('unforgiving');
  });

  it('says nothing at all when the recipe never declared one', () => {
    for (const absent of [undefined, null, '', '   ']) {
      expect(readSlack(absent)).toEqual({ slack: null, problem: null });
    }
  });

  it('refuses a level with no reason, because the reason is the whole value', () => {
    for (const line of ['forgiving', 'forgiving —', 'unforgiving  :  ']) {
      const { slack, problem } = readSlack(line);
      expect(slack, line).toBeNull();
      expect(problem, line).toMatch(/no reason/);
    }
  });

  it('refuses a level nobody agreed on, and says what the legal ones are', () => {
    const { slack, problem } = readSlack('gentle — an extra hour changes little');
    expect(slack).toBeNull();
    expect(problem).toContain('gentle');
    for (const level of SLACK_LEVELS) expect(problem).toContain(level);
  });

  it('treats a reason with no level as an unknown level, which is what it is', () => {
    const { slack, problem } = readSlack('an extra hour in the pot changes little');
    expect(slack).toBeNull();
    expect(problem).toContain('unknown slack');
  });
});

describe('slackWord', () => {
  it('capitalises for printing and changes nothing else', () => {
    expect(slackWord('forgiving')).toBe('Forgiving');
    expect(slackWord('narrow')).toBe('Narrow');
    expect(slackWord('unforgiving')).toBe('Unforgiving');
  });
});

/*
 * The render is one guard over one value — `{slack && …}` in Timeline.astro — so these are
 * what stand behind it. A recipe is either whole or null; there is no third state for the
 * component to draw an empty slot out of.
 */
describe('slack across the collection', () => {
  it('leaves every recipe either whole or silent, never half-declared', () => {
    const halfway = all
      .filter((recipe) => recipe.slack !== null && !recipe.slack?.reason?.trim())
      .map((recipe) => recipe.slug);
    expect(halfway).toEqual([]);
  });

  it('renders nothing for a recipe that never declared one', () => {
    // Nothing to draw is the common case: 500-odd files predate the field.
    const undeclared = all.filter((recipe) => recipe.slack === null);
    expect(undeclared.length).toBeGreaterThan(0);
    for (const recipe of undeclared) expect(recipe.slack, recipe.slug).toBeNull();
  });

  it('only uses levels that are in the vocabulary', () => {
    const strange = declared
      .filter((recipe) => !SLACK_LEVELS.includes(recipe.slack!.level))
      .map((recipe) => `${recipe.slug}: ${recipe.slack!.level}`);
    expect(strange).toEqual([]);
  });

  it('re-reads every declared line without a complaint', () => {
    const problems = declared
      .map((recipe) => ({
        slug: recipe.slug,
        problem: readSlack(`${recipe.slack!.level} — ${recipe.slack!.reason}`).problem,
      }))
      .filter((entry) => entry.problem)
      .map((entry) => `${entry.slug}: ${entry.problem}`);
    expect(problems).toEqual([]);
  });

  it('has worked examples for all three levels, so a writer has one to copy', () => {
    const levels = new Set(declared.map((recipe) => recipe.slack!.level));
    expect([...levels].sort()).toEqual([...SLACK_LEVELS].sort());
    expect(declared.length).toBeGreaterThanOrEqual(8);
  });

  it('gives reasons that name a failure rather than restating the level', () => {
    const thin = declared
      .filter((recipe) => recipe.slack!.reason.split(/\s+/).length < 5)
      .map((recipe) => `${recipe.slug}: ${recipe.slack!.reason}`);
    expect(thin).toEqual([]);
  });
});
