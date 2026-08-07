# T-008-05 — Progress

Eleven planned steps, all executed, **four commits instead of three** — the fourth is a correction to
the first, described in deviation 4. `npm run verify` exits 0.

**This file also carries the two scripts the gap pages cite.** They live in the attempt's private
work directory, which is gitignored and is not published; printing them here is what makes
`docs/gaps/air-fryer-and-pot.md`'s *"the script is in `docs/active/work/T-008-05/progress.md`"*
true rather than a dangling reference. T-008-03's `findings.md` is the precedent for the mistake
this avoids.

---

## Baseline, recorded before anything was edited

```
### baseline: npm run recipes

> tabular-recipes@0.1.0 recipes
> node scripts/parse-recipes.mjs

parsed 685 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 685 named, 0 inferred from category · timers in 661 · pairings 770 · washing-up in 177

### baseline: node scripts/menu-sections.mjs (tail)
         Sandwiches and buns (4)
  ok   The Air Fryer & the Pot: 0 sections, 0/21 placed
         unplaced -> air-fryer-frozen-spring-rolls, air-fryer-batata-harra, air-fryer-chicken-thighs, air-fryer-chicken-wings, air-fryer-chickpeas, air-fryer-chips, air-fryer-frozen-chips, air-fryer-frozen-prawns, air-fryer-halloumi, air-fryer-tofu, air-fryer-reheated-pizza, air-fryer-chicken-tikka, air-fryer-saba-shioyaki, air-fryer-salmon, air-fryer-shish-tawook, air-fryer-broccoli, air-fryer-brussels-sprouts, air-fryer-cauliflower, air-fryer-corn-ribs, air-fryer-padron-peppers, air-fryer-sweet-potatoes

dry run — pass --write to fold these into counters.json
2 counter(s) need a look.

### baseline: shopping.test.ts
 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  16:28:06
   Duration  950ms (transform 457ms, setup 0ms, import 643ms, tests 259ms, environment 0ms)
```

---

## The eleven steps

| # | step | result |
| --: | --- | --- |
| 1 | aisle snapshot, before | 1086 ingredients written; probe invisible to `npx vitest list` (0 matches) |
| 2 | run the gate | **21 clear all three bars** · sole cause: bar 1 **0**, bar 2 **22**, bar 3 **14** |
| 3 | write `docs/gaps/air-fryer-and-pot.md` | `menu-sections.mjs` → `4 sections, 21/21 placed`, no `unparsed`, counters-needing-a-look **2 → 1** |
| 4 | write `src/data/counters.json` | parses; `parse-recipes` unchanged at 685 recipes, 0 inferred from category |
| 5 | destructive round-trip | diff contains **0 air-fryer lines** |
| 6 | commit one | `564577a` |
| 7 | build and read the shelf | 4 sections, 21 items, **0** `<h2>Also</h2>`, 22 counter cards |
| 8 | `src/data/aisles.json` + diff | **exactly 3 changed lines**; coverage 5/1086 → 4/1086 |
| 9 | commit two | `442a9c2` |
| 10 | the three other gap pages | `menu-sections.mjs` unchanged on One Pot and Instant Pot |
| 11 | commit three, verify | `1d48482`; `npm run verify` **exit 0** |
| — | commit four | the correction in deviation 4 |

## Step 2 — the gate, and what it found

**21 recipes clear all three bars, and every one of them is an air fryer file.** That is under the
twenty-five S-008 named, so the story's own criterion fires and the page reports it.

```
| bar | pass | fail | not declared |
| 1 — washing-up ≤ 2            | 118 |  59 | 508 |
| 2 — one plug-in machine cooks |  45 | 640 |   0 |
| 3 — 45 min, claimed AND elapsed | 260 | 425 | 0 |

Clearing all three: 21.

failed exactly one bar: bar 1 only 0 · bar 2 only 22 · bar 3 only 14
```

| shelf | recipes | bar 1 | bar 2 | bar 3 | all three |
| --- | --: | --: | --: | --: | --: |
| One Pot | 73 | 65 | 0 | 17 | **0** |
| Instant Pot | 25 | 13 | 21 | 0 | **0** |
| The Slow Cooker | 20 | 6 | 3 | 0 | **0** |
| The Air Fryer & the Pot | 21 | 21 | 21 | 21 | **21** |

### Where the script was overruled, which the ticket asked to be said

**Bar 2 on the Instant Pot shelf is T-008-03's hand reading, not the lexicon's.** The machine browns
on its own Sauté and no word list separates that from a skillet. Nine verdicts moved, all from fail
to pass, all reading `instant pot plus hob` by lexicon and *the pot's own Sauté* by T-008-03:
`cuban-black-beans`, `gigantes-plaki`, `refried-beans`, `borscht`, `chicken-broth`, `chintan-broth`,
`tonkotsu-broth`, `braised-short-ribs`, `pot-roast`, each `-instant-pot`. The result, 21 of 25,
reproduces the figure `docs/gaps/air-fryer-and-pot.md` published before any of it was scripted.

One further override, carried from the gap page and named in the script:
`birria-de-res-instant-pot` **passes** bar 2 — a jug blender is plugged in and cooks nothing; its jug
and sieve are a bar 1 cost, and it washes 4.

**The Slow Cooker was not overruled**, because T-008-03 published a count and not a slug list. Its
seventeen failures are the lexicon's and all seventeen name the second vessel in their own
`cookware` line.

### Two corrections the gate produced, neither of which changes an outcome

1. **`docs/gaps/air-fryer-and-pot.md` said "The Slow Cooker clears bar 2 outright" (20 of 20). It is
   3 of 20** — `irish-stew`, `corned-beef` and `new-england-boiled-dinner`, each `-slow-cooker`, the
   three whose own first row says nothing is browned. Corrected on the page.
2. **The ticket says the menus index should read 23 counters. It reads 22.** The Soup Pot came down
   under S-007. Recorded on the page and in `docs/gaps/README.md` rather than worked around.

## The gate script, in full

Save as `gate.mjs` and run from the repository root after `npm run recipes`.

```js
/*
 * T-008-05 — the gate, applied mechanically.
 *
 *   node .lisa/attempts/T-008-05/1/work/gate.mjs            # the whole report
 *   node .lisa/attempts/T-008-05/1/work/gate.mjs --shelf    # only what passes
 *
 * Run from the repository root, after `npm run recipes`.
 *
 * The three bars are docs/gaps/air-fryer-and-pot.md's, unchanged:
 *
 *   bar 1  washing-up of two or fewer, as DECLARED. Undeclared is not a pass.
 *   bar 2  one plug-in machine does the cooking.
 *   bar 3  on the table in 45 minutes, wall-clock — on BOTH readings of the clock,
 *          the author's `>> time:` and buildSchedule()'s critical path.
 *
 * Bar 2 is the one a script cannot decide alone, so it is decided in two halves and both
 * halves are printed: a lexicon over the file's own cookware and step prose, and an
 * authored override list taken from T-008-03 §3. Every override is named below with its
 * reason, so a reader can disagree with a line rather than with a total.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const { buildSchedule } = await import(path.join(ROOT, 'src/lib/schedule.ts'));

const recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/generated/recipes.json'), 'utf8'));

/* ---- bar 2's vocabulary ---------------------------------------------------- */

/*
 * Plug-in machines that COOK. A blender is plugged in and cooks nothing, so it is not here:
 * its jug is a bar 1 cost instead, which is the reading docs/gaps/air-fryer-and-pot.md gives
 * for birria-de-res-instant-pot.
 */
const MACHINES = [
  // `air fryer basket`, never a bare `basket`: a bamboo steamer is a basket and a ramen bowl
  // has one, and five files say so.
  ['air fryer', /\bair[- ]fry(er|ing)?\b/i],
  ['instant pot', /\binstant pot\b|\bpressure cook(er)?\b|\bmulticooker\b|\bcome to pressure\b|\bnatural release\b|\bquick release\b/i],
  ['slow cooker', /\bslow cooker\b|\bcrock ?pot\b|\bcrock\b/i],
  ['rice cooker', /\brice cooker\b/i],
  ['bread machine', /\bbread machine\b/i],
  ['sous vide', /\bsous vide\b|\bimmersion circulator\b/i],
];

/*
 * Heat that is not the machine. A hob, an oven, a grill, a smoker — and every vessel that
 * only makes sense on one of them. Matched over `cookware` and over the step prose, because
 * docs/gaps/one-pot.md established that `cookware` counts only what a recipe NAMES.
 */
const OTHER_HEAT = [
  ['broiler', /\bbroil(er|ed|ing)?\b/i],
  ['oven', /\boven\b|\bbaked?\b|\bbaking (sheet|tray|dish|tin)\b|\broasting (tin|pan)\b|\bsheet pan\b|\bsheet tray\b/i],
  /*
   * A hob is named, or it is a job only a hob does. `simmer`, `boil`, `sauté`, `sear` and `fry`
   * were in this list and came out: a slow cooker simmers, an Instant Pot sautés, and a step
   * labelled `simmer on low, 9 hr` in a #slow cooker{} is the machine doing its job. Left in,
   * they failed `corned-beef-slow-cooker` and `new-england-boiled-dinner-slow-cooker`, both of
   * which say in their own first row that nothing is browned. A separate pan is caught below,
   * by name, which is the signal that does not lie in either direction.
   */
  ['hob', /\bhob\b|\bstove(top)?\b|\bburner\b|\bparboil\b|\bblanch\b|\bdeep[- ]fry\b|\bover (medium|high|low)[- ]/i],
  ['pan', /\bskillet\b|\bfrying pan\b|\bsauce ?pan\b|\bstock ?pot\b|\bdutch oven\b|\bwok\b|\bkadai\b|\bkarahi\b|\bgriddle\b|\bgrill pan\b|\bcomal\b|\btagine\b|\bpaella pan\b|\bcasserole\b|\bcrepe pan\b|\bcast[- ]iron\b/i],
  ['grill', /\bgrill(ed|ing|s)?\b|\bbarbecue\b|\bsmoker\b|\bcharcoal\b/i],
  ['microwave', /\bmicrowave\b/i],
];

/*
 * Words the OTHER_HEAT patterns would otherwise trip over inside a machine recipe. Each is
 * removed from the prose before the OTHER_HEAT match (never before the MACHINES match) and
 * each is named so the removal can be argued.
 */
const NOT_A_SECOND_APPLIANCE = [
  /air[- ]fry(er|ers|ing)?/gi,      // "air fry" contains "fry"; "air fryer" contains "fryer"
  /\bpot roast\b/gi,                // a dish name, not a roasting tin
  /\bsaut[ée]\b(?=[^.]{0,120}?\b(the pot|instant pot|pressure|multicooker)\b)/gi, // the pot's own Sauté
];

/* T-008-03 §3, read off step prose. The authored half of bar 2. */
const BROWNS_OUTSIDE_THE_POT = {
  'chile-verde-instant-pot': 'chars tomatillos and poblanos under a broiler, before the pot',
  'carnitas-instant-pot': 'crisps the shreds under the broiler on a sheet, after the pot',
  'beef-bourguignon-instant-pot': 'glazes the garnish in a skillet — "a separate pan, because the pot is full"',
  'pho-broth-instant-pot': 'toasts the spices in a dry skillet',
};

/*
 * The shelf whose bar 2 is decided by a person rather than by the lexicon. T-008-03 read all
 * 25 Instant Pot files' step prose and found exactly four that cook outside the pot; every
 * other one browns on the machine's own Sauté, which is the machine's whole selling point and
 * which no word-list can tell apart from a skillet. Where the two disagree the authored
 * reading wins and the disagreement is printed.
 */
const AUTHORED_SHELF = 'Instant Pot';

/*
 * Where the lexicon is overruled outside that shelf, and why. Every entry moves a recipe's
 * bar 2 verdict and every one is a reading of the file's own prose.
 */
const BAR2_OVERRIDES = {
  'birria-de-res-instant-pot': {
    verdict: true,
    why: 'a jug blender is plugged in and cooks nothing — the gap page reads it as a bar 1 cost, and it washes 4',
  },
};

/* ---- reading one recipe ----------------------------------------------------- */

/*
 * Bar 2 is read off the STEPS, per docs/gaps/one-pot.md, and off two kinds of line the steps
 * are made of: the `>> step:` label and the body under it. Two kinds of line are dropped, and
 * both would otherwise put a second appliance in a recipe that never uses one:
 *
 *   - every other `>> key: value` line. `>> category: Fried & Crispy` is not a frying pan and
 *     `>> keeps: better than an oven or a microwave will` is not an oven.
 *   - a step that carries no @ingredient, no #cookware and no ~timer. Those are this
 *     collection's full-width note rows — argument about the dish, not instructions for it,
 *     and they are where the comparisons to ovens, grills and microwaves live.
 */
function cookingProse(recipe) {
  const file = path.join(ROOT, recipe.path);
  if (!fs.existsSync(file)) return '';
  const source = fs.readFileSync(file, 'utf8');

  const chunks = [];
  let current = null;
  for (const line of source.split('\n')) {
    const step = line.match(/^>>\s*step:\s*(.*)$/);
    if (step) {
      if (current) chunks.push(current);
      current = step[1];
      continue;
    }
    if (/^>>\s*[a-z-]+:/i.test(line)) {
      if (current) chunks.push(current);
      current = null;
      continue;
    }
    if (current !== null) current += `\n${line}`;
  }
  if (current) chunks.push(current);

  return chunks.filter((chunk) => /[@#~]/.test(chunk)).join('\n');
}

function scrub(text) {
  let out = text;
  for (const pattern of NOT_A_SECOND_APPLIANCE) out = out.replace(pattern, ' ');
  return out;
}

function readBarTwo(recipe) {
  const raw = `${cookingProse(recipe)}\n${recipe.cookware.join(' ')}\n${recipe.kit ?? ''}`;
  const prose = scrub(raw);

  const machines = MACHINES.filter(([, re]) => re.test(raw)).map(([name]) => name);
  const others = OTHER_HEAT.filter(([, re]) => re.test(prose)).map(([name]) => name);

  const byLexicon = machines.length === 1 && others.length === 0;
  const lexiconWhy =
    machines.length === 0
      ? 'no plug-in machine cooks it'
      : machines.length > 1
        ? `two machines: ${machines.join(' + ')}`
        : others.length
          ? `${machines[0]} plus ${others.join(', ')}`
          : machines[0];

  let pass = byLexicon;
  let why = lexiconWhy;
  let authored = false;

  if (recipe.counters.includes(AUTHORED_SHELF)) {
    authored = true;
    const browns = BROWNS_OUTSIDE_THE_POT[recipe.slug];
    pass = !browns;
    why = browns
      ? `the pot — but it ${browns} (T-008-03 §3)`
      : 'the pot, browning on its own Sauté (T-008-03 §3)';
  }

  const override = BAR2_OVERRIDES[recipe.slug];
  if (override) {
    pass = override.verdict;
    why = `${why} · OVERRIDDEN: ${override.why}`;
  }

  return {
    pass,
    why,
    machines,
    others,
    byLexicon,
    lexiconWhy,
    authored,
    overridden: Boolean(override),
    disagrees: pass !== byLexicon,
  };
}

function readOne(recipe) {
  const schedule = buildSchedule(recipe);
  const wash = recipe.washingUp;

  const bar1 = {
    pass: Boolean(wash) && wash.count <= 2,
    declared: Boolean(wash),
    count: wash ? wash.count : null,
  };

  const bar2 = readBarTwo(recipe);

  const claimed = schedule.authorMinutes;
  const elapsed = Math.round(schedule.totalMinutes);
  const bar3 = {
    pass: claimed !== null && claimed <= 45 && elapsed <= 45,
    claimed,
    elapsed,
    untimed: schedule.untimedCount,
  };

  return {
    slug: recipe.slug,
    title: recipe.title,
    counters: recipe.counters,
    kit: recipe.kit,
    category: recipe.category,
    wash: wash ? wash.items.join(', ') : null,
    bar1,
    bar2,
    bar3,
    pass: bar1.pass && bar2.pass && bar3.pass,
  };
}

/* ---- the report ------------------------------------------------------------- */

const rows = recipes.map(readOne);
const shelfOnly = process.argv.includes('--shelf');

const passing = rows.filter((r) => r.pass).sort((a, b) => a.slug.localeCompare(b.slug));

if (!shelfOnly) {
  console.log(`# The gate, applied to all ${rows.length} recipes\n`);

  const tally = (predicate) => rows.filter(predicate).length;
  console.log('## Per bar, over the whole collection\n');
  console.log('| bar | pass | fail | not declared |');
  console.log('| --- | --: | --: | --: |');
  console.log(
    `| 1 — washing-up ≤ 2 | ${tally((r) => r.bar1.pass)} | ` +
      `${tally((r) => r.bar1.declared && !r.bar1.pass)} | ${tally((r) => !r.bar1.declared)} |`,
  );
  console.log(
    `| 2 — one plug-in machine cooks | ${tally((r) => r.bar2.pass)} | ` +
      `${tally((r) => !r.bar2.pass)} | 0 |`,
  );
  console.log(
    `| 3 — 45 min, claimed AND elapsed | ${tally((r) => r.bar3.pass)} | ` +
      `${tally((r) => !r.bar3.pass)} | 0 |`,
  );
  console.log(`\n**Clearing all three: ${passing.length}.**\n`);

  /* Which bar is doing the excluding: for every failure, which bars it failed. */
  console.log('## What each failure died on\n');
  const failed = rows.filter((r) => !r.pass);
  const combos = new Map();
  for (const r of failed) {
    const key = [!r.bar1.pass && '1', !r.bar2.pass && '2', !r.bar3.pass && '3']
      .filter(Boolean)
      .join(' + ');
    combos.set(key, (combos.get(key) ?? 0) + 1);
  }
  console.log('| bars failed | recipes |');
  console.log('| --- | --: |');
  for (const [key, n] of [...combos.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`| ${key} | ${n} |`);
  }
  console.log(
    `\n**Sole cause** — failed exactly one bar: ` +
      `bar 1 only ${combos.get('1') ?? 0} · bar 2 only ${combos.get('2') ?? 0} · ` +
      `bar 3 only ${combos.get('3') ?? 0}.\n`,
  );

  /* The candidate pool S-008 named: One Pot, Instant Pot, The Slow Cooker. */
  console.log('## The three shelves the gate was braced against\n');
  console.log('| shelf | recipes | clear bar 1 | clear bar 2 | clear bar 3 | clear all three |');
  console.log('| --- | --: | --: | --: | --: | --: |');
  for (const shelf of ['One Pot', 'Instant Pot', 'The Slow Cooker', 'The Air Fryer & the Pot']) {
    const mine = rows.filter((r) => r.counters.includes(shelf));
    console.log(
      `| ${shelf} | ${mine.length} | ${mine.filter((r) => r.bar1.pass).length} | ` +
        `${mine.filter((r) => r.bar2.pass).length} | ${mine.filter((r) => r.bar3.pass).length} | ` +
        `${mine.filter((r) => r.pass).length} |`,
    );
  }

  /* The near misses, because "which bar excluded the most" needs the ones that nearly made it. */
  console.log('\n## Missed by exactly one bar\n');
  for (const bar of ['1', '2', '3']) {
    const near = failed.filter((r) => {
      const bars = [!r.bar1.pass && '1', !r.bar2.pass && '2', !r.bar3.pass && '3'].filter(Boolean);
      return bars.length === 1 && bars[0] === bar;
    });
    console.log(`\n**Bar ${bar} only — ${near.length} recipes.**\n`);
    for (const r of near.slice(0, 40)) {
      const detail =
        bar === '1'
          ? `washes ${r.bar1.count ?? 'undeclared'}`
          : bar === '2'
            ? r.bar2.why
            : `${r.bar3.claimed ?? '—'} claimed / ${r.bar3.elapsed} elapsed`;
      console.log(`- \`${r.slug}\` — ${detail}`);
    }
    if (near.length > 40) console.log(`- …and ${near.length - 40} more`);
  }

  console.log('\n## Bar 2, where the authored reading overrode the lexicon\n');
  const moved = rows.filter((x) => x.bar2.disagrees);
  console.log(
    `${moved.length} verdict(s) moved. Every one is on the ${AUTHORED_SHELF} shelf, ` +
      'where T-008-03 read the step prose by hand.\n',
  );
  console.log('| slug | lexicon said | authored says | verdict |');
  console.log('| --- | --- | --- | --- |');
  for (const r of moved) {
    console.log(
      `| \`${r.slug}\` | ${r.bar2.byLexicon ? 'pass' : 'fail'} — ${r.bar2.lexiconWhy} | ` +
        `${r.bar2.why} | **${r.bar2.pass ? 'pass' : 'fail'}** |`,
    );
  }

  console.log('\n## Bar 2 on The Slow Cooker, where nothing overrode the lexicon\n');
  const crock = rows.filter((r) => r.counters.includes('The Slow Cooker'));
  console.log(`${crock.filter((r) => r.bar2.pass).length} of ${crock.length} clear bar 2.\n`);
  for (const r of crock.filter((x) => !x.bar2.pass)) {
    console.log(`- \`${r.slug}\` — ${r.bar2.lexiconWhy}`);
  }
  console.log('');
}

console.log(`\n## The shelf — ${passing.length} recipes clear all three bars\n`);
console.log('| slug | washing-up | count | machine | `>> time:` | elapsed | untimed ops |');
console.log('| --- | --- | --: | --- | --: | --: | --: |');
for (const r of passing) {
  console.log(
    `| \`${r.slug}\` | ${r.wash} | ${r.bar1.count} | ${r.bar2.machines.join(' + ')} | ` +
      `${r.bar3.claimed} min | ${r.bar3.elapsed} min | ${r.bar3.untimed} |`,
  );
}
console.log(`\n${passing.length} recipes. Every one declares a washing-up line.`);
```

## The tally script, in full

`docs/gaps/README.md`'s **Recipes** and **Only here** columns.

```js
/*
 * T-008-05 — the two columns of docs/gaps/README.md's tally that can be derived.
 *
 *   node .lisa/attempts/T-008-05/1/work/tally.mjs
 *
 * Counts of ASSIGNMENTS, so a recipe at two counters is counted twice — the README says so and
 * this reproduces it. "Only here" is how many of a counter's recipes name no other counter.
 *
 * Missing dishes and missing components are NOT derived here: they come off each page's ranked
 * `## What it is missing` list and its `## Components it would need` bullets, which are prose
 * with a shape rather than data. They are carried forward from the printed table, and the
 * README says which columns are which.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const counters = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/counters.json'), 'utf8'),
).counters;
const recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/generated/recipes.json'), 'utf8'));

const rows = counters
  .map((counter) => {
    const mine = recipes.filter((r) => r.counters.includes(counter.name));
    return {
      name: counter.name,
      slug: counter.slug,
      recipes: mine.length,
      only: mine.filter((r) => r.counters.length === 1).length,
    };
  })
  .sort((a, b) => b.recipes - a.recipes || a.name.localeCompare(b.name));

console.log('| Counter | Recipes | Only here |');
console.log('| --- | --: | --: |');
for (const row of rows) {
  console.log(`| [${row.name}](${row.slug}.md) | ${row.recipes} | ${row.only} |`);
}
console.log(
  `| **Total** | **${rows.reduce((n, r) => n + r.recipes, 0)}** | ` +
    `**${rows.reduce((n, r) => n + r.only, 0)}** |`,
);
console.log(`\n${rows.length} counters · ${recipes.length} recipes in the collection`);
```

## Step 5 — the round-trip, in full

The criterion is that `menu-sections.mjs` *reproduces* `src/data/counters.json` from the gap page.
The dry run says the page parses; this says the two agree. `counters.json` was copied aside,
`--write` was run, the result diffed, and the hand-written file copied back (`cp`, never
`git checkout` — the file is ticket-owned and mid-flight, and the ordinary index is not used for
ticket work). The restored file was verified byte-identical.

**The diff is 175 lines and contains exactly three kinds of thing, none of them this counter's:**

- the **twelve** hand-written `notes` blocks `--write` drops — Curry House (4 sections), Pizzeria,
  Deli, Japanese Home Cooking, The Slow Cooker (2), and this counter's one
- One Pot's *Quick soups that go with dinner* being renamed to **`Also`**, which is the S-007 drift
  and is a reason **not** to run `--write` rather than a fault
- The Slow Cooker's empty `"title": "Stocks"` section being dropped

```
$ grep -c "air-fryer-" roundtrip.diff
0
```

**Zero air-fryer lines. The page and the JSON agree exactly.**

## Step 8 — the aisle diff, in full

```
486c486
< other	frozen chips
---
> freezer	frozen chips
488,489c488,489
< fishmonger	frozen raw prawns
< bakery	frozen spring rolls
---
> freezer	frozen raw prawns
> freezer	frozen spring rolls
```

**Three lines out of 1086, and no fourth.** Each is intended:

- `frozen chips` was in **`other`** — nothing claimed it at all.
- `frozen spring rolls` was in **`bakery`**, claimed by the Bakery's `rolls` pattern. A frozen spring
  roll is not in the bread aisle.
- `frozen raw prawns` was in **`fishmonger`**, which is defensible and wrong for a shopper: you take
  it out of a freezer.

Patterns were written at the length the ingredient is written, because `matchesStaple` needs
**consecutive whole words** — `frozen prawns` would not have claimed `frozen raw prawns`. No bare
`frozen` and no bare `chips` was added; a one-word pattern is compared on length alone against every
other aisle's one-word patterns, and `frozen` at six characters would have out-scored `peas`,
`corn` and `ice`.

Coverage went **5/1086 → 4/1086 unplaced**. The four left are deliberate: `leftover pizza` (no shop
sells it) and `flat skewers`, `metal skewers`, `oak or hickory wood` (equipment, and all three
predate this story). No `packs` entry was invented — `purchaseOf` returns null rather than compare
grams to cups.

## Deviations from the plan

**1. The bar-2 lexicon was tightened twice, after measuring rather than before.** Both rounds are on
the gap page because they are the reason to trust the third reading.

- **Round one: metadata and commentary.** Reading the whole `.cook` file failed **18 of the 21 air
  fryer recipes** on their own filing — `>> category: Fried & Crispy` contains *fried*,
  `>> keeps: better than an oven or a microwave` contains both. The fix reads only `>> step:` labels
  and their bodies, and drops any step carrying no `@ingredient`, `#cookware` or `~timer`, which is
  this collection's full-width note row.
- **Round two: the machine's own verbs.** `simmer`, `boil`, `sauté`, `sear` and `fry` failed
  `corned-beef-slow-cooker` and `new-england-boiled-dinner-slow-cooker`, both of which say in their
  own first row that *nothing is browned and nothing should be*. A slow cooker simmers. Those words
  came out and a second pan is now caught **by name**, which is the signal that does not lie in
  either direction. Verified by reading all four affected files.

**2. `\bbasket\b` was too loose for machine detection.** Five files name a basket and own no air
fryer: `har-gow` and `siu-mai` (a bamboo steamer) and the three ramen bowls. Narrowed to
`air fry`/`air fryer`, which all 21 files carry.

**3. The probe is a `.probe.mts` with its own vitest config, not a `.test.ts`.** `src/lib/shopping.ts`
cannot be imported by plain node — it imports JSON without an import attribute — so the aisle
snapshot has to run under vitest. A file named `*.test.ts` anywhere in the tree **is** picked up by
`npx vitest run`, verified by `npx vitest list | grep -c aisle-diff` returning 1. That would have
added a test this ticket invented to `npm run verify`'s count, which is the tripwire T-008-03 §5.4
warned about. Renamed, given a config that is the only thing that can see it, and re-verified at 0.

**4. A fourth commit, correcting the first.** The gap pages originally cited
`docs/active/work/T-008-05/gate.mjs` and `tally.mjs`. **Lisa publishes phase artifacts, not every
file in the attempt directory** — `.lisa/` is gitignored, and T-008-03's `findings.md` is cited by
its own review and does not exist in `docs/active/work/T-008-03/`. Committed gap pages must not
carry a dangling path, so both scripts are printed in full above and the six references now point
here.

**5. The 25-row Instant Pot table was regenerated, which the plan did not call for.** Its bar 1
column read `not declared` on 23 of 25 rows — true when T-008-02 wrote it and false since T-008-03.
A page that presents a column as measured must not print a stale one. The regenerated column says
**13 clear bar 1, 12 fail**, and the paragraph under it now says the thing that matters: bar 1
becoming readable moved the total by nothing.

**6. Two extra findings landed in `docs/gaps/one-pot.md` that the ticket did not ask for**, both
because the page asserted something that is now checkable:

- The page said `src/data/counters.json` **still lists the four fried dishes** and that `menuFor()`
  drops them quietly. Neither is true: T-003-07 removed them, and since T-011-05 `menuFor()` throws
  with the slug named. Corrected.
- The page's *broiler argument*, left open by T-002-09, now has numbers on both sides:
  `carnitas` declares **1** and `chile-verde` declares **4**. That does not settle it, but it
  separates two cases that were being argued as one.

## What was deliberately not done

- **No bar moved.** Not the ≤ 2, not the one machine, not the 45 minutes. Bar 1 excludes nobody in
  685 recipes and is written up as a recommendation for a later story, with the consequence of each
  option costed (`≤ 1` would admit three of the twenty-one).
- **No `.cook` file was edited**, and none was staged, modified or left untracked.
- **Nothing was re-shelved off One Pot.** Its eight recipes washing three or more are recorded with
  the argument and the recommendation; moving them is a counter decision.
- **`src/lib/**` was not touched**, so T-008-04's `'airfry'`-in-`UNATTENDED` defect is recorded as a
  live defect rather than fixed, alongside `shake` in `VERB_ICONS` and a `NEVER_WASHED` utensil
  entry.
- **`docs/gaps/README.md`'s `Build state` block was left alone.** It is labelled S-007's and the
  file already carries a fresher measurement two sections below it.
- **One Pot's `## What it has` block was not touched.** Adding the five S-007 soups would close the
  last drift on the board and it is a counter decision about another counter.
- **`npm run verify:mobile` was not run.** It drives a browser, is not part of `npm run verify`, and
  this ticket adds no markup — but it adds a menu page with 21 items where there were none, so the
  first person to run it is measuring something new.

## Final state

```
npm run verify                 exit 0
  all 685 file(s) draw a table
  685 recipes, 27 categories, 0 inferred from category, timers 661, pairings 770, washing-up 177
  21 test files, 1229 tests passed
  710 pages built
  22 counter(s): 930 slug(s) listed, 930 printed
node scripts/menu-sections.mjs 1 counter needs a look (One Pot's S-007 drift, pre-existing)
git status --porcelain         no ticket-owned file staged, modified or untracked
```

Seven `unaccountedCookware` advisories still print, unchanged in number and identity from
T-008-03's — a `#fork{}`, three `#potato masher{}`, two `#immersion blender{}`. All print `ok`,
none fails the build, and the fix is a `NEVER_WASHED` utensil entry in `src/lib/washing-up.ts`,
which is not this ticket's to make.

## Commits

| commit | message | files |
| --- | --- | --- |
| `564577a` | Shelve the twenty-one that cleared the gate, and say it is twenty-one | `docs/gaps/air-fryer-and-pot.md`, `src/data/counters.json` |
| `442a9c2` | Put the frozen things where the shop keeps them | `src/data/aisles.json` |
| `1d48482` | Pay washing-up forward to the three shelves that promised it | `docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md`, `docs/gaps/README.md` |
| *(fourth)* | Point the gap pages at a work artifact that will exist | `docs/gaps/air-fryer-and-pot.md`, `docs/gaps/README.md` |

All through `lisa commit-ticket` with exact `--include` paths. The ordinary index was never used.
