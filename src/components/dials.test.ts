/*
 * The dials, checked against hand-built shapes and then against the whole collection.
 *
 * The collection half matters more than it looks. Every number design.md argues from — 227
 * passes at fifteen minutes standing, 24 recipes that time nothing at all, 653 sinks nobody
 * wrote down — is asserted here, so a collection that moves under this feature fails a test
 * with both numbers in the message rather than quietly making the argument wrong.
 *
 * It reads the index through search.json.ts's own GET(), the same boundary
 * src/pages/_search.json.test.ts uses, so a change to the endpoint's shape lands here too.
 */
import { describe, expect, it } from 'vitest';
import { GET } from '../pages/search.json.ts';
import {
  DIALS,
  OFF,
  SHOW_PASSES,
  SHOW_UNSAID,
  anySet,
  canAnswer,
  carriesState,
  figures,
  measure,
  readQuery,
  readSettings,
  searchString,
  tallyLine,
  unsaidLine,
  verdict,
} from './dials.ts';
import type { Item, Settings } from './dials.ts';

const index: Item[] = JSON.parse(await GET().text());
const bySlug = new Map(index.map((one) => [one.slug, one]));
const item = (slug: string): Item => {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`no index entry for ${slug}`);
  return found;
};

/** A recipe shape with everything answerable and nothing over any cap, to vary one field of. */
const plain = (over: Partial<Item> = {}): Item => ({
  slug: 'made-up',
  title: 'Made Up',
  counters: ['Deli'],
  find: 'made up',
  elapsedMinutes: 20,
  handsOnMinutes: 4,
  longestHandsOnMinutes: 4,
  washingUpCount: 1,
  evidence: 'stated',
  ...over,
});

const set = (over: Partial<Settings> = {}): Settings => ({ ...OFF, ...over });

/** Every combination of the three dials: four choices each, including Any. */
const combinations: Settings[] = [];
for (const standing of [null, ...DIALS[0].stops.map((s) => s.value)]) {
  for (const by of [null, ...DIALS[1].stops.map((s) => s.value)]) {
    for (const wash of [null, ...DIALS[2].stops.map((s) => s.value)]) {
      combinations.push({ standing, by, wash });
    }
  }
}

const count = (settings: Settings) => {
  const counts = { pass: 0, fail: 0, unsaid: 0 };
  for (const one of index) counts[verdict(one, settings)]++;
  return counts;
};

describe('the vocabulary', () => {
  it('is three dials, in reading order', () => {
    expect(DIALS.map((d) => d.id)).toEqual(['standing', 'by', 'wash']);
    expect(DIALS.map((d) => d.name)).toEqual([
      "Time you're standing there",
      'On the table by',
      'Things to wash',
    ]);
  });

  it('gives every dial three stops, each with a distinct value, a label and a spoken form', () => {
    for (const dial of DIALS) {
      expect(dial.stops).toHaveLength(3);
      expect(new Set(dial.stops.map((s) => s.value)).size).toBe(3);
      for (const stop of dial.stops) {
        expect(stop.label.length).toBeGreaterThan(0);
        expect(stop.spoken.length).toBeGreaterThan(stop.label.length);
      }
      expect(dial.anySpoken.length).toBeGreaterThan(0);
    }
  });

  /*
   * The composite ban, asserted rather than promised. S-010 spends a section refusing a
   * difficulty rating; this is the line that fails if one is smuggled back in as a label.
   */
  it('never says difficulty, or any of the words that mean it', () => {
    const banned = /difficult|\beasy\b|\bhard\b|score|rating|\blevel\b|effort|active time|hands-on/i;
    const strings = DIALS.flatMap((dial) => [
      dial.id,
      dial.name,
      dial.anySpoken,
      ...dial.stops.flatMap((stop) => [stop.label, stop.spoken]),
    ]);
    expect(strings.filter((one) => banned.test(one))).toEqual([]);
  });

  it('draws fewer unanswered cards than passing ones', () => {
    expect(SHOW_UNSAID).toBeLessThan(SHOW_PASSES);
  });

  it('knows when it is off', () => {
    expect(anySet(OFF)).toBe(false);
    expect(anySet(set({ wash: 1 }))).toBe(true);
  });
});

describe('what each dial can answer', () => {
  it('will not read a standing figure nobody stood behind', () => {
    expect(canAnswer(plain({ evidence: 'unknown' }), 'standing')).toBe(false);
    expect(canAnswer(plain({ evidence: 'inferred' }), 'standing')).toBe(true);
    expect(canAnswer(plain({ evidence: 'stated' }), 'standing')).toBe(true);
  });

  it('will not read no-timers-at-all as no time at all', () => {
    expect(canAnswer(plain({ elapsedMinutes: 0 }), 'by')).toBe(false);
    expect(canAnswer(plain({ elapsedMinutes: 1 }), 'by')).toBe(true);
  });

  /* washing-up.ts is emphatic that absent and zero are different answers. */
  it('reads a declared zero sink but not an undeclared one', () => {
    expect(canAnswer(plain({ washingUpCount: null }), 'wash')).toBe(false);
    expect(canAnswer(plain({ washingUpCount: 0 }), 'wash')).toBe(true);
    expect(measure(plain({ washingUpCount: 0 }), 'wash')).toBe(0);
  });

  /*
   * The rule that would be cleaner and is wrong: one global evidence gate. chile-verde's
   * elapsed figure is real even though its standing figure is not.
   */
  it('does not let one dial’s silence make the others deaf', () => {
    const braise = plain({ evidence: 'unknown', elapsedMinutes: 512 });
    expect(canAnswer(braise, 'standing')).toBe(false);
    expect(canAnswer(braise, 'by')).toBe(true);
  });
});

describe('the verdict', () => {
  it('passes everything when no dial is set', () => {
    expect(verdict(plain({ evidence: 'unknown', elapsedMinutes: 0 }), OFF)).toBe('pass');
  });

  it('fails a recipe over a cap it can be measured against', () => {
    expect(verdict(plain({ handsOnMinutes: 40 }), set({ standing: 15 }))).toBe('fail');
    expect(verdict(plain({ elapsedMinutes: 300 }), set({ by: 60 }))).toBe('fail');
    expect(verdict(plain({ washingUpCount: 6 }), set({ wash: 3 }))).toBe('fail');
  });

  it('passes a recipe exactly on a cap — the stop is a cap, not a fence', () => {
    expect(verdict(plain({ handsOnMinutes: 15 }), set({ standing: 15 }))).toBe('pass');
  });

  it('cannot say for a recipe the set dial has no evidence for', () => {
    expect(verdict(plain({ evidence: 'unknown' }), set({ standing: 15 }))).toBe('unsaid');
    expect(verdict(plain({ elapsedMinutes: 0 }), set({ by: 30 }))).toBe('unsaid');
    expect(verdict(plain({ washingUpCount: null }), set({ wash: 1 }))).toBe('unsaid');
  });

  /*
   * The tie-break, and the one this whole design turns on: a recipe we KNOW is out stays out,
   * whatever else we do not know about it.
   */
  it('lets a known failure beat an unknown, whichever dial is walked first', () => {
    const braise = plain({ evidence: 'unknown', elapsedMinutes: 512 });
    expect(verdict(braise, set({ standing: 15, by: 30 }))).toBe('fail');
    expect(verdict(braise, set({ by: 30, standing: 15 }))).toBe('fail');
    /* And with nothing to fail it on, it is back to unanswered. */
    expect(verdict(braise, set({ standing: 15, by: 600 }))).toBe('unsaid');
  });

  it('is unaffected by a dial left on Any', () => {
    const one = plain({ washingUpCount: null });
    expect(verdict(one, set({ standing: 15 }))).toBe('pass');
    expect(verdict(one, set({ standing: 15, wash: 1 }))).toBe('unsaid');
  });
});

describe('the URL', () => {
  it('round-trips a whole state', () => {
    const settings = set({ standing: 15, by: 60, wash: 3 });
    const written = searchString('beans', settings);
    expect(written).toBe('?q=beans&standing=15&by=60&wash=3');
    expect(readQuery(written)).toBe('beans');
    expect(readSettings(written)).toEqual(settings);
  });

  it('says nothing for the pristine front page', () => {
    expect(searchString('', OFF)).toBe('');
    expect(searchString('   ', OFF)).toBe('');
    expect(carriesState('')).toBe(false);
    expect(carriesState('?other=1')).toBe(false);
  });

  it('knows when the URL is already ours to write', () => {
    expect(carriesState('?q=beans')).toBe(true);
    expect(carriesState('?wash=1')).toBe(true);
  });

  /* A page drawing a list its own controls cannot reproduce is worse than a link that degrades. */
  it('ignores a value that is not one of the dial’s stops', () => {
    expect(readSettings('?standing=7')).toEqual(OFF);
    expect(readSettings('?by=soon')).toEqual(OFF);
    expect(readSettings('?wash=-1')).toEqual(OFF);
    expect(readSettings('?standing=15&by=7')).toEqual(set({ standing: 15 }));
  });

  it('writes the same link for the same state, every time', () => {
    const settings = set({ wash: 3, standing: 5 });
    expect(searchString('a b', settings)).toBe(searchString('a b', settings));
    expect(searchString('', settings)).toBe('?standing=5&wash=3');
  });

  it('reproduces every combination it can produce', () => {
    for (const settings of combinations) {
      expect(readSettings(searchString('x', settings))).toEqual(settings);
    }
  });
});

describe('what the cards say', () => {
  it('mentions only the dials the reader set', () => {
    const one = plain({
      handsOnMinutes: 12,
      longestHandsOnMinutes: 12,
      elapsedMinutes: 90,
      washingUpCount: 3,
    });
    expect(figures(one, set({ standing: 15 }))).toBe('12 min standing');
    expect(figures(one, set({ by: 120 }))).toBe('on the table in 1 hr 30 min');
    expect(figures(one, set({ wash: 3 }))).toBe('3 things to wash');
    expect(figures(one, set({ standing: 15, wash: 3 }))).toBe('12 min standing · 3 things to wash');
    expect(figures(one, OFF)).toBe('');
  });

  it('counts one thing as one thing, and none as none', () => {
    expect(figures(plain({ washingUpCount: 1 }), set({ wash: 3 }))).toBe('1 thing to wash');
    expect(figures(plain({ washingUpCount: 0 }), set({ wash: 3 }))).toBe('nothing to wash');
  });

  it('says a real zero of standing in words rather than as an empty duration', () => {
    expect(figures(plain({ handsOnMinutes: 0 }), set({ standing: 5 }))).toBe('no standing about');
  });

  /*
   * The longest unbroken stretch, as a qualifier rather than a fourth dial — see design.md D2.
   * It appears when the gap is at least one break long, and a one-minute gap is noise.
   */
  it('qualifies the standing figure when the work comes in separate goes', () => {
    const broken = plain({ handsOnMinutes: 16, longestHandsOnMinutes: 8 });
    expect(figures(broken, set({ standing: 30 }))).toBe('16 min standing · longest go 8 min');

    const unbroken = plain({ handsOnMinutes: 16, longestHandsOnMinutes: 16 });
    expect(figures(unbroken, set({ standing: 30 }))).toBe('16 min standing');

    const barely = plain({ handsOnMinutes: 11, longestHandsOnMinutes: 10 });
    expect(figures(barely, set({ standing: 30 }))).toBe('11 min standing');
  });

  it('says what is missing, in one sentence, once', () => {
    const nothing = plain({ evidence: 'unknown', elapsedMinutes: 0, washingUpCount: null });
    expect(unsaidLine(nothing, set({ standing: 15 }))).toBe("Nobody said how long you'd stand there.");
    expect(unsaidLine(nothing, set({ standing: 15, wash: 1 }))).toBe(
      "Nobody said how long you'd stand there or what this leaves in the sink.",
    );
    expect(unsaidLine(nothing, set({ standing: 15, by: 30, wash: 1 }))).toBe(
      "Nobody said how long you'd stand there, how long this takes or what this leaves in the sink.",
    );
    expect(unsaidLine(plain(), set({ standing: 15 }))).toBe('');
  });

  it('gives all three answers in the tally', () => {
    expect(tallyLine({ pass: 227, fail: 42, unsaid: 395 })).toBe(
      '227 match · 42 don’t · 395 we can’t say',
    );
  });
});

describe('over the whole collection', () => {
  it('has a collection to read', () => {
    expect(index.length).toBeGreaterThan(600);
  });

  it('gives every recipe exactly one of three answers, under every setting there is', () => {
    expect(combinations).toHaveLength(64);
    const words = new Set<string>();
    for (const settings of combinations) {
      for (const one of index) words.add(verdict(one, settings));
    }
    expect([...words].sort()).toEqual(['fail', 'pass', 'unsaid']);
  });

  it('shows the whole shelf when no dial is set', () => {
    expect(count(OFF)).toEqual({ pass: index.length, fail: 0, unsaid: 0 });
  });

  /*
   * The invariant the three-answer design exists for. If this ever passes a recipe on a dial
   * that cannot be answered for it, the filter is recommending the least-annotated recipes
   * first — which is the failure S-010 is written about.
   */
  it('never passes a recipe on a dial that cannot answer for it', () => {
    const wrong: string[] = [];
    for (const settings of combinations) {
      for (const one of index) {
        if (verdict(one, settings) !== 'pass') continue;
        for (const dial of DIALS) {
          if (settings[dial.id] !== null && !canAnswer(one, dial.id)) {
            wrong.push(`${one.slug} @ ${searchString('', settings)}`);
          }
        }
      }
    }
    expect(wrong).toEqual([]);
  });

  /*
   * The shape of the split, not its exact totals.
   *
   * The first draft of these asserted the counts design.md argues from — 227 passing at fifteen
   * minutes standing, 653 sinks nobody had written down — and they were both stale within the
   * hour: recipes and washing-up lines land on this branch from other tickets while this one is
   * being written, and the sink went from 11 answerable to 164 between two runs. On a shared
   * branch an exact-count assertion is not a guard, it is a tripwire strung across everybody
   * else's `npm run verify`. The measurements themselves are in review.md, against a named
   * commit, which is where a number that was true on a Tuesday belongs.
   *
   * What is asserted instead is everything the design actually rests on, none of which moves
   * when a recipe is added.
   */
  it('splits the collection into three, and only three, whatever is on the shelf', () => {
    for (const settings of combinations) {
      const c = count(settings);
      expect(c.pass + c.fail + c.unsaid).toBe(index.length);
    }
  });

  it('does not let the cap decide what it can answer', () => {
    /* Answerability is a fact about the recipe. Turning the dial up cannot reveal evidence. */
    const unsaids = [5, 15, 30].map((v) => count(set({ standing: v })).unsaid);
    expect(new Set(unsaids).size).toBe(1);
    expect(new Set([30, 60, 120].map((v) => count(set({ by: v })).unsaid)).size).toBe(1);
    expect(new Set([1, 3, 5].map((v) => count(set({ wash: v })).unsaid)).size).toBe(1);
  });

  it('lets more through as the dial is turned up, on every dial', () => {
    for (const dial of DIALS) {
      const passes = dial.stops.map((stop) => count(set({ [dial.id]: stop.value })).pass);
      expect(passes, `${dial.id} passes`).toEqual([...passes].sort((a, b) => a - b));
      expect(passes[2]).toBeGreaterThan(passes[0]);
      const fails = dial.stops.map((stop) => count(set({ [dial.id]: stop.value })).fail);
      expect(fails, `${dial.id} fails`).toEqual([...fails].sort((a, b) => b - a));
    }
  });

  /*
   * The annotation gap, in the order it actually stands: nearly nobody has written down what a
   * recipe leaves in the sink, most recipes cannot vouch for their standing figure, and the
   * clock is the one thing almost every recipe does say. If this ever reverses, the filter is
   * answering a different collection and the design deserves re-reading rather than a green run.
   */
  it('cannot say most often about the sink, least often about the clock', () => {
    const cannot = (id: 'standing' | 'by' | 'wash') =>
      index.filter((one) => !canAnswer(one, id)).length;
    expect(cannot('wash')).toBeGreaterThan(cannot('standing'));
    expect(cannot('standing')).toBeGreaterThan(cannot('by'));
    expect(cannot('by')).toBeGreaterThan(0);
  });

  /* The reason this filter has three answers rather than two. */
  it('cannot say more often than it can, on two of the three dials', () => {
    expect(count(set({ standing: 15 })).unsaid).toBeGreaterThan(count(set({ standing: 15 })).pass);
    expect(count(set({ wash: 1 })).unsaid).toBeGreaterThan(count(set({ wash: 1 })).pass);
  });

  /*
   * Two dials, and the tie-break showing its work on the whole collection. Recipes whose
   * standing figure is worthless but whose clock is real do not get to hide under "we can't
   * say" — they fail on the clock. So adding the second dial moves recipes OUT of unanswered
   * and into failed, which is the opposite of what the naive rule would do.
   */
  it('lets a real clock settle a recipe whose standing figure is silent', () => {
    const one = count(set({ standing: 15 }));
    const two = count(set({ standing: 15, by: 60 }));
    expect(two.pass).toBeLessThanOrEqual(one.pass);
    expect(two.unsaid).toBeLessThan(one.unsaid);
    expect(two.fail).toBeGreaterThan(one.fail);
  });

  describe('the recipes this was designed against', () => {
    it('will not let the trap through: blondies times almost nothing', () => {
      expect(item('blondies').handsOnMinutes).toBe(0);
      expect(verdict(item('blondies'), set({ standing: 5 }))).toBe('unsaid');
      expect(verdict(item('blondies'), set({ standing: 30 }))).toBe('unsaid');
    });

    it('will not let a sauce with no timers read as instant', () => {
      expect(item('mayonnaise').elapsedMinutes).toBe(0);
      expect(verdict(item('mayonnaise'), set({ by: 30 }))).toBe('unsaid');
    });

    it('fails an eight-hour braise on the clock even when the standing figure is silent', () => {
      const braise = item('chile-verde-slow-cooker');
      expect(braise.evidence).toBe('unknown');
      expect(braise.elapsedMinutes).toBeGreaterThan(480);
      expect(verdict(braise, set({ standing: 15, by: 60 }))).toBe('fail');
    });

    it('passes the one recipe that genuinely washes nothing', () => {
      expect(item('memphis-dry-rub').washingUpCount).toBe(0);
      expect(verdict(item('memphis-dry-rub'), set({ wash: 1 }))).toBe('pass');
    });

    it('qualifies gyoza’s standing figure and not patty-melt’s', () => {
      const gyoza = item('gyoza');
      expect(verdict(gyoza, set({ standing: 30 }))).toBe('pass');
      expect(figures(gyoza, set({ standing: 30 }))).toBe('16 min standing · longest go 8 min');

      const melt = item('patty-melt');
      expect(melt.handsOnMinutes).toBe(melt.longestHandsOnMinutes);
      expect(figures(melt, set({ standing: 30 }))).toBe('45 min standing');
      expect(verdict(melt, set({ standing: 30 }))).toBe('fail');
    });
  });
});
