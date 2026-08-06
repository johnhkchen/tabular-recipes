# T-005-04 · Research — what `>> slack:` is today

Descriptive only. What the field is, where it is read, how it is measured, and what the 397
declared lines actually look like when you count them.

---

## 1. The field, end to end

**Written** — one line of cooklang front matter, in every case exactly:

```
>> slack: <level> — <reason>
```

Checked across all 658 files: **397 declare it, 261 do not, and no file declares it twice.**
The separator is uniform — 397 of 397 use a spaced em dash. There is no multi-line variant.

**Parsed** — `scripts/normalise.mjs:212` hands `metadata.slack` to `readSlack()` in
`src/lib/slack.ts:64`. That function takes the first run of letters as the level, eats one
optional separator, and keeps everything after it as `reason`. It is deliberately liberal about
punctuation (`slack.ts:56-63`) and strict about two things only: the level must be one of
`forgiving | narrow | unforgiving` (`slack.ts:74`), and the reason must be non-empty
(`slack.ts:84`). A file failing either is reported by `check-recipes.mjs:151` as a structural
problem that exits 1 today.

**Rendered** — `src/components/Timeline.astro:311-316`, under the timeline:

```astro
<b>{slackWord(slack.level)}</b> — {slack.reason}
```

One `<dd>`, one paragraph, no truncation, no clamp. The level is bolded and capitalised; the
reason is printed verbatim. It renders once per page (not three times — that is the full-width
prose row T-005-05 owns).

**Measured** — `scripts/check-recipes.mjs:107`:

```js
if (recipe.slack) check('slack reason', recipe.slack.reason.length, 'slack:', recipe.slack.reason);
```

against `CAPS['slack reason'] = 200` (`check-recipes.mjs:55`). **The cap governs the reason
alone — not the level word, not the separator, not the `>> slack:` prefix.** T-005-01's review
§3 flags this explicitly: the story's headline "333 of 397 over 200" counts the whole value
including the level; on the reason alone the number is **304**. A regenerated run of
`npm run check` confirms `slack reason 304` today. The 200 characters this ticket must reach are
rendered characters.

Because T-005-01's `report.txt` was not published into `docs/active/work/T-005-01/`, the ranked
list was regenerated from the committed checker (`npm run check`, exit 0) rather than
re-derived by hand. Same script, same caps, same numbers — `operation cell 0 · step body 656 ·
prose row 232 · slack reason 304 · ingredient note 17`.

---

## 2. The distribution as it stands

397 declared reasons, measured as `reason.length`:

```
count 397   min 92   max 290   mean 222.4
p50 236     p90 260  p99 280
over 200: 304        over 120: 373
```

```
  75- 99    6  ###
 100-124   21  ###########
 125-149    8  ####
 150-174   15  ########
 175-199   39  ####################
 200-224   51  ##########################
 225-249  153  #############################################################################
 250-274   95  ################################################
 275-299    9  #####
```

By level:

| Level | Files | Mean | Over 200 |
| --- | ---: | ---: | ---: |
| `forgiving` | 117 | 215.1 | 79 |
| `narrow` | 187 | 222.6 | 148 |
| `unforgiving` | 93 | 231.0 | 77 |

T-005-01's design called this shape correctly: there is no trough. 62% of the field sits in the
single band 225–274. That is what a field written *to a length* looks like, not a field written
to a thought.

---

## 3. The finding that decides the work: the lines are not long sentences, they are lists

Splitting each reason on `;`, `:` and sentence boundaries:

| Clauses in the reason | Files |
| ---: | ---: |
| 1 | **23** |
| 2 | **320** |
| 3 | 53 |
| 4 | 1 |

**374 of 397 reasons carry two or more separate warnings.** 294 use a semicolon to do it.

And the sizes fall out of that, not out of verbosity:

```
first clause alone:  mean 107.9   p50 107   p90 164   max 248
                     over 200: 4          over 120: 149
single-clause lines: 23 of them, mean 137.8
lines already ≤120:  24 of them, mean 107.6
```

**One clause of this collection is already about one breath.** The mean first clause is 107.9
characters against voice.md's stated aim of "about 120." The field is over cap because it says
two or three things, not because it says one thing at length.

This is the ticket's "pattern to cut against" confirmed by measurement rather than by reading
one example. The ticket names three parts; the corpus shows the same three:

1. **The recipe justifying itself.** 143 reasons contain `because`, 32 contain `which is/means`,
   25 contain `since`. Not all are justification — many introduce the failure — but the
   `<number> is <number> because that is <property>` construction the ticket quotes from
   `sour-dill-pickles` recurs throughout.
2. **The failure, named.** Present in nearly every line somewhere. This is the field.
3. **The semicolon chain.** 294 files.

Two house phrasings carry most of the chaining:

- `the <X> is the part with a window` / `the part with no room` — **39 files** between them.
- `<A> or <B> is the same <thing>` — **40 files**, always the slack half of a two-part line.

---

## 4. Why this cannot be done mechanically

The obvious automation is "keep clause 1, drop the rest." The measurement above makes it look
safe: mean 107.9, only 4 over 200. It is not safe, and the reason is structural.

Counting, per level, how often clause 1 is the *slack* half (nothing goes wrong in it) while the
failure only arrives in a later clause:

| Level | Files | Clause 1 is the slack half | Failure named only later |
| --- | ---: | ---: | ---: |
| `forgiving` | 117 | **64** | 69 |
| `narrow` | 187 | 4 | 71 |
| `unforgiving` | 93 | 3 | 37 |

**On 64 of 117 `forgiving` lines the first clause names no failure at all.** The house shape for
a forgiving recipe is:

> *three hours or four is the same beef, and the whole dish is better on the second day; the
> garnish is where the attention goes, since the onions and mushrooms go from browned to
> collapsed in a couple of minutes*

Clause 1 is "nothing goes wrong here." Clause 2 is the entire value of the field. A first-clause
truncation would leave 64 recipes saying *forgiving — three hours or four is the same beef*,
which is a restatement of the level, which is exactly the failure mode the ticket's acceptance
criteria call out by name and which `slack.test.ts` already has a (weak, 5-word) guard for.

So which clause survives is a judgement per file. 397 of them.

---

## 5. What the tests already require of a reason

`src/lib/slack.test.ts` runs against `src/generated/recipes.json`, i.e. against the real
collection, in `describe('slack across the collection')`:

| Test | Constraint on a rewritten reason |
| --- | --- |
| `leaves every recipe either whole or silent` | reason must be non-empty after trim |
| `only uses levels that are in the vocabulary` | level word unchanged |
| `re-reads every declared line without a complaint` | `readSlack('<level> — <reason>')` must not complain — so a reason must not start with a bare separator |
| `gives reasons that name a failure rather than restating the level` | **≥ 5 whitespace-separated words** |
| `has worked examples for all three levels` | all three levels must still appear; ≥ 8 declared |

The unit fixtures at the top of the file are all short — the longest is
`'the custard breaks past 82°C and will not come back'` at 50 characters, and
`'pull it at 200°F — 10° over and it is dry'` at 41. **No fixture is near the 200 cap, so the
ticket's "fix the fixture if it is now longer than the cap" contingency does not arise.**

The 5-word floor is a low bar. Nothing in the suite can tell a named failure from a well-formed
restatement; that check is the work artifact's spot-check, per the acceptance criteria.

---

## 6. Safety facts present in the field

The ticket names chicken and terrine temperature lines. Grepping the 397 reasons for
temperature, cure, pathogen and injury language finds a wider set. These are the lines where the
failure is illness or injury rather than texture, and they are the ones that cannot be dropped
to make a cap:

**Internal temperature, stated as safety** — `smoked-and-grilled/smoked-chicken` (165°F breast /
175°F thigh, "a safety number and not a preference"), `smoked-and-grilled/gyro-meat` (165°F,
"where a ground-meat loaf stops being a safety question"), `dressings-and-dips/pork-liver-pate`
(160°F terrine, "a safety failure rather than a texture one"), `stews-and-braises/cha-lua`
(165°F at the centre), `stews-and-braises/white-cut-chicken` ("an under-poached chicken is a
safety failure"), `stews-and-braises/xiu-mai` (poaching is the safety),
`smoked-and-grilled/smoked-turkey-breast` (160°F carrying to 165°F).

**Cooked-through, ground or raw meat** — `stews-and-braises/meatloaf`,
`stews-and-braises/meatballs`, `smoked-and-grilled/kafta`, `smoked-and-grilled/seekh-kabab`,
`fried-and-crispy/breakfast-sausage-patties`, `fried-and-crispy/fried-chicken`,
`dumplings-and-rolls/siu-mai`.

**Cure, brine and holding temperature** — `cured-fish/belly-lox` (three days in salt is what
makes raw salmon safe), `spice-blends-and-marinades/turkey-brine` (below 40°F, "a food-safety
failure"), `stews-and-braises/corned-beef` and `-instant-pot` (five-day cure),
`smoked-and-grilled/pastrami` (five to seven days).

**Growth and spoilage** — `spice-blends-and-marinades/ginger-garlic-paste` (botulism under oil,
two-week fridge life), `dressings-and-dips/sour-dill-pickles` (surface film, everything under
the brine), `dressings-and-dips/lime-pickle` (oil above the limes or the jar moulds),
`dressings-and-dips/mayonnaise`, `-/aioli`, `-/caesar-dressing` (raw yolk, fridge not counter),
`dressings-and-dips/chopped-liver` (two-day item), `salads/whitefish-salad` (three-day item),
`soups/new-england-clam-chowder` (same-day clams), `stews-and-braises/chikuzenni` (konnyaku
turns first).

**Injury rather than illness** — `soups/congee-instant-pot` (venting sends scalding porridge
out), `stews-and-braises/chicken-feet` (wet feet spit in oil, "the failure is a burn"),
`dumplings-and-rolls/sesame-balls` (bursts under boiling oil),
`flatbreads-and-pancakes/corn-tortillas` and `pastry-and-doughs/nixtamalised-masa` (cal is
caustic).

That is **36 files** whose reason carries something that is not a texture note.

---

## 7. Boundaries and hazards

- **`src/lib/slack.ts` needs no change.** It already rejects a level with no reason and
  normalises the separator. The cap lives in `check-recipes.mjs`, and it is T-005-01's, already
  committed. Nothing in this ticket wants a parser change.
- **The level is not re-litigated.** 117/187/93 is the current split and stays that way. Where
  shortening exposes a rating that looks wrong, the ticket says record it.
- **One field per file.** T-005-05 owns full-width prose rows, T-005-06 owns discarded step
  bodies, and both run after this ticket on the same files. Only the `>> slack:` line may move.
- **The 261 undeclared files stay undeclared.** Backfilling is explicitly out.
- **`src/generated/recipes.json` is a gitignored build artifact** regenerated by
  `npm run recipes`; it is not ticket-owned and must not be committed. `slack.test.ts` reads it,
  so it must be regenerated before the suite reflects any edit.
- **Duplicated reasons exist across variant files.** `boston-baked-beans` /
  `-slow-cooker`, `carnitas` / `-slow-cooker` / `-instant-pot`, `chile-verde` ×3,
  `hungarian-goulash` ×3, `flatbreads-and-pancakes/dosa` and `.../idli`-style pairs, and
  `cachete` ×3 share whole clauses verbatim. They are separate recipes with genuinely different
  windows (a slow cooker's broiler leg is not a pressure cooker's), so they need separate
  sentences, not one sentence copied three times.

---

## 8. Assumptions carried into Design

1. The cap to hit is **200 on `reason` as `readSlack` returns it**, and the aim voice.md states
   is **about 120**.
2. `>> slack: <level> — ` is a stable prefix in all 397 files, so an edit can be a whole-line
   replacement keyed on the level being unchanged.
3. Nothing outside the `>> slack:` line of a `.cook` file, and possibly `slack.test.ts`, is in
   scope. Research found no fixture over cap, so `slack.test.ts` is expected to need no edit.
4. `npm run verify` is the gate: `check` → `recipes` → `vitest` → `astro build`.
