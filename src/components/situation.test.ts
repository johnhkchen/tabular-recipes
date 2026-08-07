/*
 * The situation, checked against the model it claims to be reading and then against the whole
 * collection.
 *
 * The first block is the one that decides whether any of this is honest. src/lib/scaling.ts owns
 * the cost function and does not export the four parameters a browser would need to evaluate it,
 * so situation.ts reads 46 recipes off a table costOf() built and computes the other 639 from
 * §2's collapsed form. That is a second piece of arithmetic about the same minutes, and the only
 * thing that makes it a reading rather than a second opinion is this: EVERY recipe, at EVERY size
 * the controls can ask for, comes out at exactly what costOf() says. If that test goes red the
 * design is wrong, not the expectation.
 *
 * The index is read through search.json.ts's own GET(), the boundary dials.test.ts and
 * _search.json.test.ts already use, so a change to the endpoint lands here too.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import { costOf } from '../lib/scaling.ts';
import type { RawRecipe } from '../lib/tree.ts';
import { GET } from '../pages/search.json.ts';
import { DIALS, OFF, canAnswer, verdict } from './dials.ts';
import type { Settings } from './dials.ts';
import {
  CONTROLS,
  NOBODY,
  TARGETS,
  anyoneSet,
  carriesSituation,
  costAt,
  dropped,
  keepsLine,
  keepsMinutesNeeded,
  keepsVerdict,
  link,
  overDays,
  readSituation,
  reason,
  scaledItem,
  shelve,
  silence,
  target,
} from './situation.ts';
import type { Situation, SituationItem } from './situation.ts';

const all = recipes as unknown as RawRecipe[];
const bySlugRaw = new Map(all.map((one) => [one.slug, one]));
const index: SituationItem[] = JSON.parse(await GET().text());
const bySlug = new Map(index.map((one) => [one.slug, one]));
const item = (slug: string): SituationItem => {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`no index entry for ${slug}`);
  return found;
};

/** A recipe shape with everything answerable and nothing over any cap, to vary one field of. */
const plain = (over: Partial<SituationItem> = {}): SituationItem => ({
  slug: 'made-up',
  title: 'Made Up',
  counters: ['Deli'],
  find: 'made up',
  elapsedMinutes: 20,
  handsOnMinutes: 4,
  longestHandsOnMinutes: 4,
  washingUpCount: 1,
  evidence: 'stated',
  writtenServings: 4,
  waitMinutes: 16,
  untimedCount: 0,
  ...over,
});

const set = (over: Partial<Settings> = {}): Settings => ({ ...OFF, ...over });
const when = (over: Partial<Situation> = {}): Situation => ({ ...NOBODY, ...over });

/** Every combination of the two controls, including both on Any. */
const situations: Situation[] = [];
for (const people of [null, ...CONTROLS[0].stops.map((s) => s.value)]) {
  for (const days of [null, ...CONTROLS[1].stops.map((s) => s.value)]) {
    situations.push({ people, days });
  }
}

/** Every combination of the three dials, as dials.test.ts builds them. */
const combinations: Settings[] = [];
for (const standing of [null, ...DIALS[0].stops.map((s) => s.value)]) {
  for (const by of [null, ...DIALS[1].stops.map((s) => s.value)]) {
    for (const wash of [null, ...DIALS[2].stops.map((s) => s.value)]) {
      combinations.push({ standing, by, wash });
    }
  }
}

describe('the cost at a size is scaling.ts’s own answer', () => {
  /*
   * The whole collection, at every size the controls can produce. Both code paths are in here:
   * the 46 recipes that read a table costOf() built, and the 639 that use the collapsed form.
   */
  it('reproduces costOf() exactly, on every recipe at every size', () => {
    const wrong: string[] = [];
    for (const entry of index) {
      const raw = bySlugRaw.get(entry.slug)!;
      for (const wanted of TARGETS) {
        const mine = costAt(entry, wanted);
        const theirs = costOf(raw, Math.max(wanted, entry.writtenServings ?? 1));
        if (!mine || !theirs) {
          wrong.push(`${entry.slug} at ${wanted}: one of the two answered null`);
          continue;
        }
        if (
          mine.elapsed !== theirs.elapsed.at ||
          mine.standing !== theirs.standing.at ||
          mine.longest !== theirs.longest.at
        ) {
          wrong.push(
            `${entry.slug} at ${wanted}: ` +
              `[${mine.elapsed}, ${mine.standing}, ${mine.longest}] against costOf's ` +
              `[${theirs.elapsed.at}, ${theirs.standing.at}, ${theirs.longest.at}]`,
          );
        }
      }
    }
    expect(wrong.slice(0, 5)).toEqual([]);
    expect(wrong).toHaveLength(0);
  });

  it('counts the loads costOf() counts', () => {
    for (const entry of index) {
      if (!entry.capacityServings) continue;
      for (const wanted of TARGETS) {
        const raw = bySlugRaw.get(entry.slug)!;
        const mine = costAt(entry, wanted)!;
        const theirs = costOf(raw, Math.max(wanted, entry.writtenServings ?? 1))!;
        expect([entry.slug, mine.loads, mine.loadsWritten]).toEqual([
          entry.slug,
          theirs.batches.at,
          theirs.batches.written,
        ]);
      }
    }
  });

  it('refuses a size it has no answer for rather than guessing one', () => {
    const bound = index.find((one) => one.scaled)!;
    expect(() => costAt(bound, 7)).toThrow(/not one of the stops/);
  });

  it('has an answer for every size the controls can produce', () => {
    for (const situation of situations) expect(TARGETS).toContain(target(situation));
  });

  it('answers null when the recipe never said how much it makes', () => {
    expect(costAt(plain({ writtenServings: null }), 18)).toBeNull();
  });
});

describe('at or below the written size, nothing happens at all', () => {
  it('hands back the same object', () => {
    for (const entry of index) {
      for (const wanted of TARGETS) {
        if (wanted > (entry.writtenServings ?? 0)) continue;
        expect(scaledItem(entry, wanted)).toBe(entry);
      }
    }
  });

  it('gives every dial the verdict it gave before, on the whole collection', () => {
    // 1 × 1: the small situation, and the ticket's before-and-after.
    const small = when({ people: 1, days: 1 });
    for (const settings of combinations) {
      for (const entry of index) {
        const before = verdict(entry, settings);
        const after = shelve(entry, settings, small);
        const expected = before === 'pass' ? 'match' : before === 'unsaid' ? 'unsaid' : 'out';
        if (after !== expected) {
          throw new Error(`${entry.slug} moved to ${after} where it was ${before}`);
        }
      }
    }
  });

  it('is the off state too', () => {
    expect(anyoneSet(NOBODY)).toBe(false);
    for (const settings of combinations.slice(0, 8)) {
      for (const entry of index) {
        const before = verdict(entry, settings);
        expect(shelve(entry, settings, NOBODY)).toBe(
          before === 'pass' ? 'match' : before === 'unsaid' ? 'unsaid' : 'out',
        );
      }
    }
  });
});

describe('scaling cannot change what the data can answer', () => {
  it('leaves canAnswer alone on every recipe at every size', () => {
    for (const entry of index) {
      for (const wanted of TARGETS) {
        const scaled = scaledItem(entry, wanted);
        for (const dial of DIALS) {
          expect([entry.slug, dial.id, canAnswer(scaled, dial.id)]).toEqual([
            entry.slug,
            dial.id,
            canAnswer(entry, dial.id),
          ]);
        }
      }
    }
  });

  it('never lets a figure shrink', () => {
    for (const entry of index) {
      for (const wanted of TARGETS) {
        const scaled = scaledItem(entry, wanted);
        expect(scaled.handsOnMinutes).toBeGreaterThanOrEqual(entry.handsOnMinutes);
        expect(scaled.longestHandsOnMinutes).toBeGreaterThanOrEqual(entry.longestHandsOnMinutes);
      }
    }
  });
});

describe('does it keep', () => {
  const keeper = (text: string, character = 'better on the second') =>
    plain({ keepsText: text, keepsCharacter: character });

  it('asks for one day less than it feeds', () => {
    expect(keepsMinutesNeeded(when({ days: 1 }))).toBe(0);
    expect(keepsMinutesNeeded(when({ days: 2 }))).toBe(1440);
    expect(keepsMinutesNeeded(when({ days: 3 }))).toBe(2880);
    expect(keepsMinutesNeeded(NOBODY)).toBe(0);
  });

  it('asks nothing at all when it is one day', () => {
    expect(keepsVerdict(plain(), when({ days: 1 }))).toBe('pass');
    expect(keepsVerdict(keeper('not at all'), when({ days: 1, people: 6 }))).toBe('pass');
  });

  /*
   * Three days needs a dish that is good after TWO: it is cooked on the first day and the last
   * plate is eaten on the third. A rule of three would demand a fourth day nobody eats.
   */
  it('reads a span the way the author wrote it', () => {
    expect(keepsVerdict(keeper('3 days'), when({ days: 3 }))).toBe('pass');
    expect(keepsVerdict(keeper('2 days'), when({ days: 3 }))).toBe('pass');
    expect(keepsVerdict(keeper('1 day'), when({ days: 3 }))).toBe('fail');
    expect(keepsVerdict(keeper('1 day'), when({ days: 2 }))).toBe('pass');
    expect(keepsVerdict(keeper('1 week'), when({ days: 3 }))).toBe('pass');
    expect(keepsVerdict(keeper('36 hr'), when({ days: 2 }))).toBe('pass');
    expect(keepsVerdict(keeper('12 hr'), when({ days: 2 }))).toBe('fail');
  });

  it('treats "not at all" as the real answer it is', () => {
    expect(keepsVerdict(keeper('not at all'), when({ days: 2 }))).toBe('fail');
  });

  it('says nothing rather than guessing where nobody wrote it down', () => {
    expect(keepsVerdict(plain(), when({ days: 3 }))).toBe('unsaid');
  });

  it('never prints a span without what it is like', () => {
    expect(keepsLine(keeper('3 days'), when({ days: 3 }))).toBe('Keeps 3 days — better on the second');
    expect(keepsLine(keeper('3 days'), when({ days: 1 }))).toBe('');
    expect(keepsLine(plain(), when({ days: 3 }))).toBe('');
  });

  it('is a real span on the collection', () => {
    const declared = index.filter((one) => one.keepsText);
    expect(declared.length).toBeGreaterThan(100);
    for (const entry of declared) expect(entry.keepsCharacter).toBeTruthy();
    // Every declared span either fails or passes; none of them is silent.
    for (const entry of declared) {
      expect(keepsVerdict(entry, when({ days: 3 }))).not.toBe('unsaid');
    }
  });
});

describe('which shelf', () => {
  const big = when({ people: 6, days: 1 });

  it('drops a recipe that was fine at the written size and says so', () => {
    // 4 servings, 8 minutes standing; at 24 servings that is 48, over a 30-minute cap.
    const one = plain({ handsOnMinutes: 8, longestHandsOnMinutes: 8, waitMinutes: 12 });
    expect(shelve(one, set({ standing: 30 }), NOBODY)).toBe('match');
    expect(shelve(one, set({ standing: 30 }), when({ people: 6, days: 3 }))).toBe('dropped');
  });

  it('leaves a recipe that was already failing where it was', () => {
    const one = plain({ handsOnMinutes: 40, longestHandsOnMinutes: 40 });
    expect(shelve(one, set({ standing: 30 }), NOBODY)).toBe('out');
    expect(shelve(one, set({ standing: 30 }), when({ people: 6, days: 3 }))).toBe('out');
  });

  it('drops a dish that does not keep, whatever it does to the clock', () => {
    const one = plain({ keepsText: 'not at all', keepsCharacter: 'the crust is gone by morning' });
    expect(shelve(one, OFF, big)).toBe('match');
    expect(shelve(one, OFF, when({ people: 6, days: 3 }))).toBe('dropped');
  });

  it('says it cannot say when nobody wrote the keeping down', () => {
    expect(shelve(plain(), OFF, when({ days: 2 }))).toBe('unsaid');
    expect(shelve(plain(), OFF, when({ days: 1 }))).toBe('match');
  });

  it('lets a known failure beat an unknown, on the fourth question too', () => {
    const one = plain({ handsOnMinutes: 40, longestHandsOnMinutes: 40 }); // no keeps line
    expect(shelve(one, set({ standing: 30 }), when({ days: 3 }))).toBe('out');
  });

  it('puts every recipe on exactly one shelf', () => {
    for (const situation of situations) {
      const counts = { match: 0, dropped: 0, unsaid: 0, out: 0 };
      for (const entry of index) counts[shelve(entry, set({ standing: 30 }), situation)]++;
      const total = counts.match + counts.dropped + counts.unsaid + counts.out;
      expect([situation.people, situation.days, total]).toEqual([
        situation.people,
        situation.days,
        index.length,
      ]);
    }
  });
});

describe('what the cards say', () => {
  it('says the recipe already makes that much', () => {
    expect(reason(plain({ writtenServings: 6 }), when({ people: 6, days: 1 }))).toBe(
      'Makes six as written.',
    );
  });

  it('prints the sentence this story exists to print', () => {
    const one = plain({ waitMinutes: 120, handsOnMinutes: 0, longestHandsOnMinutes: 0 });
    expect(reason(one, when({ people: 6, days: 3 }))).toBe(
      'Feeds eighteen without taking any longer.',
    );
  });

  it('says the work grows where the work is what grows', () => {
    const one = plain({ handsOnMinutes: 20, waitMinutes: 10 });
    expect(reason(one, when({ people: 6, days: 3 }))).toBe(
      "Feeds eighteen. The pot doesn't care; it's the work that grows.",
    );
  });

  it('says a vessel that binds on work is only a rearrangement', () => {
    // beef-with-broccoli, twelve portions: six lots, and scaling.md §3 says it costs nothing.
    expect(reason(item('beef-with-broccoli'), when({ people: 4, days: 3 }))).toBe(
      'It goes in six lots, and that is the only difference. Plus one step it never times.',
    );
  });

  it('says what a vessel that binds on a wait actually costs', () => {
    const line = reason(item('air-fryer-chicken-wings'), when({ people: 6, days: 3 }));
    expect(line).toMatch(/^Five lots, one after another, and about .* longer for it\./);
  });

  /*
   * §4.6's error bar, carried by the finding rather than replacing it. chili-con-carne times four
   * of its five operations at nothing, so the model reporting that eighteen portions cost nothing
   * extra is true partly by luck, and the card says both halves.
   */
  it('says the silence out loud where the model is reading one', () => {
    expect(reason(item('chili-con-carne'), when({ people: 6, days: 3 }))).toBe(
      'Feeds eighteen without taking any longer. Plus four steps it never times.',
    );
  });

  it('says there is nothing to work out when there are no times at all', () => {
    const nothing = plain({ elapsedMinutes: 0, handsOnMinutes: 0, waitMinutes: 0 });
    expect(reason(nothing, when({ people: 6, days: 3 }))).toBe(
      "No times here at all, so there's nothing to work out.",
    );
  });

  it('says which half a dropped recipe failed', () => {
    const clock = plain({ handsOnMinutes: 8, longestHandsOnMinutes: 8, evidence: 'stated' });
    expect(dropped(clock, set({ standing: 30 }), when({ people: 6, days: 3 }))).toMatch(
      /^Fine for four\. At eighteen you're standing there/,
    );
    const stale = plain({ keepsText: '1 day', keepsCharacter: 'still fine, a little softer' });
    expect(dropped(stale, OFF, when({ days: 3 }))).toBe(
      'Keeps 1 day — still fine, a little softer, and you asked for three.',
    );
    const never = plain({ keepsText: 'not at all', keepsCharacter: 'the crust goes by morning' });
    expect(dropped(never, OFF, when({ days: 3 }))).toBe(
      'Eat it the day you make it — the crust goes by morning.',
    );
  });

  it('adds the fourth silence to the three dials.ts already says', () => {
    const quiet = plain({ evidence: 'unknown' });
    expect(silence(quiet, set({ standing: 15 }), when({ days: 3 }))).toBe(
      "Nobody said how long you'd stand there. Nobody said whether this keeps.",
    );
    expect(silence(quiet, set({ standing: 15 }), when({ days: 1 }))).toBe(
      "Nobody said how long you'd stand there.",
    );
  });

  /*
   * The ban, over every sentence the module can produce for the whole collection at every size.
   * scaling.md's boundary is that the model is O(·) in the file, in scaling.ts and in the tests,
   * and never on a page a cook reads — so this is where it is enforced rather than promised.
   */
  it('never prints notation', () => {
    const notation = /[×→]|\bO\s*\(|\b\d+\s*[x×]\b|\bn\b|serves \d+ →/;
    const found: string[] = [];
    for (const situation of situations) {
      for (const entry of index) {
        for (const line of [
          reason(entry, situation),
          keepsLine(entry, situation),
          dropped(entry, set({ standing: 15, by: 60 }), situation),
          silence(entry, set({ standing: 15, by: 60, wash: 3 }), situation),
        ]) {
          if (notation.test(line)) found.push(`${entry.slug}: ${line}`);
        }
      }
    }
    expect(found.slice(0, 5)).toEqual([]);
  });

  it('never calls the situation a score, a level or a difficulty', () => {
    const banned = /difficult|easy|hard|score|rating|level|effort|active time|hands-on/i;
    for (const control of CONTROLS) {
      expect(control.name).not.toMatch(banned);
      expect(control.anySpoken).not.toMatch(banned);
      for (const stop of control.stops) {
        expect(stop.label).not.toMatch(banned);
        expect(stop.spoken).not.toMatch(banned);
      }
    }
  });
});

describe('the URL', () => {
  it('round-trips every setting the controls can make', () => {
    for (const situation of situations) {
      const written = link('', OFF, situation);
      expect(readSituation(written)).toEqual(situation);
    }
  });

  it('drops a setting the controls do not have', () => {
    expect(readSituation('?people=7&days=9')).toEqual(NOBODY);
    expect(readSituation('?people=six&days=three')).toEqual(NOBODY);
    expect(readSituation('?people=-1')).toEqual(NOBODY);
  });

  it('writes one order, and writes nothing for a pristine page', () => {
    expect(link('beans', set({ standing: 15 }), when({ people: 6, days: 3 }))).toBe(
      '?q=beans&standing=15&people=6&days=3',
    );
    expect(link('', OFF, when({ people: 2 }))).toBe('?people=2');
    expect(link('', OFF, NOBODY)).toBe('');
  });

  it('knows whether the URL is ours to write', () => {
    expect(carriesSituation('?people=6')).toBe(true);
    expect(carriesSituation('?days=2')).toBe(true);
    expect(carriesSituation('?q=beans&standing=15')).toBe(false);
    expect(carriesSituation('')).toBe(false);
  });

  it('counts an unset day as today and an unset head as one', () => {
    expect(target(when({ people: 6 }))).toBe(6);
    expect(target(when({ days: 3 }))).toBe(3);
    expect(overDays(NOBODY)).toBe(1);
  });
});
