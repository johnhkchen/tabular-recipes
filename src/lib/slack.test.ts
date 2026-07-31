import { describe, expect, it } from 'vitest';
import { SLACK_LEVELS, readSlack, slackWord } from './slack.ts';

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
