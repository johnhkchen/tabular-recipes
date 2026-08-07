# T-013-03 — Design

Five decisions, each with what was rejected. The governing constraint is the ticket's own:
**"A profile shape adjusted to flatter its examples has proved nothing."** Every choice below is
made *before* the numbers are seen, and the ones that could be tuned are pinned to
`occasions.md`'s text rather than chosen here.

---

## 1. How the ranking is produced

### Options

| | Approach | Reproducible | Agrees with the site |
| --- | --- | --- | --- |
| A | A script in the work directory, importing `src/lib/` under Node 24 type-stripping | yes, by path | yes, by construction |
| B | A `vitest` probe, run and deleted | **no** | yes |
| C | Reimplement the scoring arithmetic in the document by hand | no | **no** |
| D | A new file under `scripts/` | yes | yes — but `src/`-adjacent and outside the ticket's writable paths |

### Decided: A

`docs/active/work/T-013-03/rank-the-shelf.ts`, run as T-012-02's script is run:

```
PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" node docs/active/work/T-013-03/rank-the-shelf.ts
```

**Why not B.** T-013-01 produced its seventeen-recipe tables from a throwaway `vitest` probe and
deleted it (`T-013-01/review.md`: *"It was deleted before the commit"*). That is why this ticket
exists in the shape it does — the numbers cannot be re-run, so they cannot be checked, so they have
to be redone over the whole collection anyway. Repeating the mistake at 685 files would be worse.

**Why not C.** `costOf()` at twelve servings involves `m`, `r`, the free/bound split and
`longestGrowth()`. Hand arithmetic over 685 files would be wrong somewhere and nobody could find
where.

**Why not D.** `scripts/` is not in the ticket's writable set, and this script is a one-off reading
rather than a build step. T-012-02 set the precedent and it held.

**Rules the script inherits from T-012-02's opening**, because they are the reason that document
survived review: the profile constants are **declared tables at the top of the file**, not numbers
buried in a scoring function, so a reader who disagrees with *"−20 per day of keeping"* can point at
the line. And it **writes nothing** — stdout only, captured to `ranking-output.txt`.

---

## 2. The scoring, stated completely before it is run

Both profiles are `occasions.md` §3.3 and §3.4 transcribed, with **no rate changed**. What Design
must settle is the handful of things §3.3/§3.4 left to the implementer.

### 2.1 Three answers, and what puts a recipe in each

`occasions.md` §3.2 demands *ranked · rejected · cannot say*. Four distinct causes exist and they
must not be collapsed:

| Cause | Family | Party | Why |
| --- | --- | --- | --- |
| `>> servings:` unreadable, so `costOf()` returns null | **cannot say** | **cannot say** | There is no twelve-serving figure at all. Different from a zero |
| `slack: unforgiving` | **rejected** | **rejected** | The gate, in both corners, for different reasons |
| `handsOnEvidence` is `unknown` | ranked | **cannot say** | §3.6's rule, and it binds the party only |
| Everything else | ranked | ranked | |

**Silence at the gate passes.** A recipe with no `>> slack:` line is not `unforgiving`, so it is not
rejected — but it also earns no `forgiving` bonus. That is scoring absence as a middle value, which
§3.2's third answer exists to prevent, and it is the one place this design knowingly departs from
the spirit of the file. It is kept because the alternative — *cannot say* for all 269 files with no
`slack` line — would empty the family list of nearly everything and make the whole exercise a
report about `slack` coverage. **The departure is recorded as a finding rather than hidden**, and
§2.5 below measures exactly how much of each ranking rests on it.

### 2.2 The family-meal profile, exactly

```
gate:   slack.level === 'unforgiving'            → rejected
        costOf(recipe, 12) === null              → cannot say

score = 1.0 × standing.at
      + 1.0 × longest.at
      + 5.0 × (washingUp?.count ?? 0)
      − 20.0 × min(keepsDays, 4)
      − 20.0 × (slack.level === 'forgiving' ? 1 : 0)

lower is better
```

`keepsDays = keeps.minutes / 1440`, and **absence is not zero-days-of-keeping — it is zero
bonus**, which is arithmetically the same and semantically different; the count of files taking a
zero for absence is reported alongside the ranking so the difference is visible. `NOT_AT_ALL` is a
declared zero and takes the same zero bonus, which is correct: the author said it does not keep.

The cap is on **days, at 4**, per §3.3's "−20 per day, capped at 4" — so the keeps term floors at
−80, and `chili-con-carne`'s worked −95 reproduces: `0 + 0 + 5 − 80 − 20 = −95`. **That
reproduction is the acceptance test for the transcription** and it is checked before anything else
is reported.

### 2.3 The dumpling-party profile, exactly

```
gate:   slack.level === 'unforgiving'            → rejected
        costOf(recipe, 12) === null              → cannot say
        handsOnEvidence(schedule) === 'unknown'  → cannot say        (§3.6's rule)

claimed = standing.at − assumedStandingMinutes

score = 1.0 × claimed
      + 0.5 × longest.at
      − 2.0 × (washingUp?.count ?? 0)
      + 20.0 × (slack.level === 'forgiving' ? 1 : 0)
      − 40.0 × (slack.level === 'unforgiving' ? 1 : 0)

higher is better
```

Two things to note, both forced by §3.6 rather than chosen:

- **`claimed`, not `standing.at`.** §3.6's rule is explicit that a positively-weighted hands-on
  term may score only `handsOnMinutes − assumedHandsOnMinutes`. The scaled equivalents are
  `standing.at − assumedStandingMinutes`, both of which `costOf()` returns.
- **The `−40` unforgiving term is dead code and stays anyway.** §3.4's table declares it, and the
  gate already removed those recipes. It is transcribed so the table and the code match; the script
  asserts it never fires.

`longest.at` is **not** claim-filtered. §3.6's rule names the hands-on total only, and
`longestGrowth()` has no assumed-minutes counterpart to subtract. This is a hole in the rule rather
than in this transcription, and it is reported as one.

### 2.4 Target servings: twelve, both

§3.3 and §3.4 both work at twelve. Twelve is also where a family meal's vessel arithmetic starts to
bind, which is the whole reason `capacity` matters. Not varied, because varying it is tuning.

### 2.5 What gets measured about the profiles themselves

Three diagnostics, decided now so they cannot be chosen after seeing the ranking:

1. **How many ranked recipes are separated by nothing** — the count of distinct scores against the
   count of ranked recipes, and the size of the largest tie group. §3.6 found nine of seventeen tied
   at zero. If that ratio holds at 685, the ranking is a ranking in name only.
2. **How much of the family score is `slack`-absence** — the share of ranked files with no `slack`
   line, per §2.1's recorded departure.
3. **How much of the family standing figure is assumed** — the family profile may score unclaimed
   minutes, so the same fallback that §3.6 caught poisoning the party is quietly inflating the
   family's *costs*. The share is computed and stated.

---

## 3. The overlap number

The ticket demands *"the overlap between the two lists is computed and stated as a number"* and
calls a high overlap a failure. It does not say which overlap, so this is a real decision.

### Options

| | Metric | Says |
| --- | --- | --- |
| A | Top-10 intersection size | Whether a reader opening both shelves sees the same food |
| B | Jaccard over the full ranked sets | Whether the *gates* differ — mostly a coverage fact, not a ranking fact |
| C | Spearman ρ over the recipes both profiles rank | Whether the two orderings are the same ordering |
| D | Rank-position deltas on the seventeen from §3.5 | Whether this run reproduces T-013-01's worked example |

### Decided: A as the headline, C as the real test, B and D reported

**A is the headline** because it is the reader's experience: two shelves whose top tens are the same
eight files are one shelf with two names, and that is the failure mode the ticket is pointing at.

**C is the one that can convict the method.** A top-ten intersection can be small by accident when
both lists are mostly ties. Spearman over the shared ranked population is the direct measurement of
*are these the same ordering*, and it is the number that answers §3.5's claim that only the signs
changed. A ρ near +1 is the *easy is good* collapse the ticket names; a ρ near −1 is the inversion
working exactly as designed; a ρ near 0 means the two profiles are reading different, mostly-absent
fields and agreeing about nothing in particular, which is a third outcome and the one nobody has
predicted.

**B is reported** because the two gates differ (the party's extra `evidence: unknown` gate), so
Jaccard over ranked sets is mostly a statement about coverage — worth having, easy to misread, so
it is stated with that caveat attached.

**D is reported** because reproducing T-013-01's seventeen-row table is the only available check
that this transcription is the same profile that file described. A row that moves is either a bug
here or a change in the collection since 7 August, and both are worth knowing.

All four are printed. None is chosen after the fact.

---

## 4. The inversion test

`occasions.md` §3.5's strongest claim is `gyoza`: **#17 for the family, #1 for the party.** The
ticket restates it as *"does the dumpling party's list contain the dish the holiday list ranks
worst?"*

**Decided.** *Worst* means **last among the family profile's ranked recipes** — not last among all
685, because rejected and cannot-say are not rankings. The test is run three ways and all three
reported:

1. **The literal test.** Take the family list's last ranked slug. Is it in the party's ranked list,
   and where?
2. **The bottom ten.** How many of the family's worst ten are in the party's top ten. One slug is a
   coin flip; ten is a shape.
3. **The named case.** `gyoza` specifically, since it is the claim on record.

If the family's worst-ranked recipe turns out to be something with nothing to do with a dumpling
party — a nine-hour smoked brisket, say — that is a **real answer and it is reported as one**,
against the ticket's instruction not to tune until it looks good.

---

## 5. Establishing both occasions

`occasions.md` §1 already applied the rule to both and found both real. The ticket asks for the
evidence gathered *"the way `docs/gaps/soup-pot.md` gathered its sources — linked, and saying what
each one established."*

### Options

| | Approach |
| --- | --- |
| A | Cite `occasions.md` §1's rows and stop |
| B | Re-run the search independently, gather fresh sources, say what each establishes, and record where it agrees and disagrees with §1 |

### Decided: B, with §1 treated as a prior rather than as an answer

A is not what the ticket asks for and would make step 1 a citation. More importantly `occasions.md`
itself says its selling pass is **"eight searches in one sitting"** against `counters.md`'s six
independent readings of seventy menus — it flags its own evidence as thin, and this ticket is the
first opportunity to thicken it.

**The holiday meal** gets a shorter pass. §1 found all four kinds of evidence and the ticket agrees
it is the easy case; the work here is confirming the *four kinds* claim with links that say which
kind each source is, not finding more of them.

**The dumpling party gets the effort**, per the ticket. The four evidence classes to push on are
the ones the ticket names: kits, restaurant classes, the frozen aisle, and shops selling wrappers by
the packet. And the honest failure has to stay available: **if what is sold turns out to be classes
and kits — a hobby product — and not a moment anybody caters, that is a result**, and it changes
what the party's ranking means rather than invalidating it.

The distinction to hold onto, which §1 already noticed and did not develop: **what is sold for a
dumpling party is the making, not the dumplings.** A class is sold to people who want to spend the
afternoon doing it. That is the selling evidence for *hands-on time is the feature* — which is the
party profile's entire sign flip — so it is not a footnote, it is the profile's justification.

---

## 6. The holiday meal for step 4

**Decided: assemble from the family ranking, but as a meal rather than as a top-N slice**, and say
exactly which rule picked each dish.

A top-six slice off a ranked list is not a meal — the ranking has no idea what a plate is, and
`occasions.md` §3.3 already found the profile crowning `chili-con-carne`, which is not a
Thanksgiving dish. Taking six literal top scorers would produce a diagnosis of a meal nobody eats,
and the ticket's test is whether the output *"reads as the explanation of a real afternoon."*

So: **a centrepiece, a starch, a vegetable, a sauce and a make-ahead**, each chosen as the
best-ranked file in the collection that fills that slot, with the slot rules written down first.
Where the ranking's own pick for a slot is absurd, that is a finding about the profile and it is
printed next to the substitution.

**Run twice**: `cooks: 1` (the occasion as `occasions.md` defines it — cooked alone) and `cooks: 2`,
because `meal.ts`'s own test suite pins that a second cook clears the pile-up, and the difference
between the two diagnoses is the clearest available statement of what the model knows. `burners: 4`,
`ovenShelves: null` — the defaults, because guessing a reader's oven is the thing `meal.ts`'s
comments say not to do. **The raw `Finding[]` is pasted verbatim** in addition to the prose, so
*"pasted in full"* means pasted rather than paraphrased.

---

## 7. Where the report lands

**Decided: `docs/gaps/two-that-invert.md`.**

`docs/gaps/` already holds two files that are not counter pages — `soup-pot.md` (a retired shelf)
and `what-the-shelf-offers.md` (a whole-shelf reading) — so a reading that opens no counter is an
established shape for the folder.

**The safety check that makes this decision safe** rather than merely conventional:
`scripts/menu-sections.mjs` folds `docs/gaps/*.md` into `src/data/counters.json`, and it keys on a
`## What it has` heading matched to a counter that already exists in `counters.json`.
`soup-pot.md`'s own text records why it is inert — *"It has no `## What it has` block, because
there is no counter for `menu-sections.mjs` to match it to."* The new file will carry **no
`## What it has` heading**, and the script's dry run is captured **before and after** the file
exists to prove byte-identical output. Without that check, writing a document could open a counter,
which is the one thing this ticket forbids most loudly.

`docs/gaps/README.md` is **not** edited: it is scoped as "one page per counter" plus a retired-shelf
note, and `what-the-shelf-offers.md` is not indexed there either. Following the precedent beats
inventing a second convention, and the ticket's writable set permits the edit but nothing asks for
it.

---

## 8. What this design deliberately does not do

- **It does not tune.** No rate is changed, no gate is softened, no target-serving is varied. If
  both lists are nonsense, the report says both lists are nonsense.
- **It proposes no field.** `occasions.md` §3.7 names six missing fields and stops; step 5 of the
  ticket asks which fields are missing, which is a restatement of that list against two real
  examples, not a design for any of them.
- **It writes no recipe and annotates nothing**, even where the ranking makes an annotation
  obviously worth writing. That is another ticket's, and the report says which files it would be.
- **It opens nothing.** No `src/data/counters.json` entry, no counter page, no occasion axis.
