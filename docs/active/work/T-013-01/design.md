# T-013-01 — Design

Seven decisions. Each states what was chosen, what was rejected, and — where the choice decides a
number or a verdict — what the rejected option would have produced instead.

---

## 1. Where the file lives and what "indexed" means

**Decided: `docs/knowledge/occasions.md`, indexed by sibling cross-links from its opening
paragraph, with the interpretation stated in the file's closing section.**

Criterion 1 asks for the file to be *"linked where that folder is indexed."* Criterion 8 permits
only `docs/knowledge/occasions.md` and `docs/active/work/T-013-01/**`. Those two cannot both be met
by editing an index outside the file, so one of them has to be read.

- There is no `docs/knowledge/README.md`. `docs/gaps/` has an index; `docs/knowledge/` does not.
- `README.md:15` names `counters.md` and `README.md:160` names `scaling.md`, both inside prose
  about something else. `voice.md` and `cooks.md` are named from nowhere in `README.md` at all.
- The folder's real convention is sibling cross-linking: `cooks.md:20-22` opens by naming
  `counters.md`, `voice.md` and `scaling.md` and saying what each settled; `voice.md:189` links out
  the same way.

**T-012-01 hit this exact conflict and resolved it identically** (`T-012-01/review.md:29-42`), and
its disposition passed. Following the accepted precedent is worth more than inventing a second
reading. **Rejected: editing `README.md`** — it would breach criterion 8, which is explicit and
narrower. **Rejected: creating `docs/knowledge/README.md`** — a new index file is also outside the
permitted set, and it would orphan the three siblings that do not link to it.

## 2. The rule, and what counts as somebody selling

**Decided: an occasion is real when somebody sells for it — meaning a priced, dated or
inventory-committing offer aimed at the moment itself. Four kinds of evidence, each with what it
proves and what it cannot.**

The four are the ticket's, and the reason to keep exactly these four is that each fails differently,
so agreement between them is worth something:

1. **A caterer's seasonal menu** — a list that costs money to hold. Weakest on its own, because a
   caterer will print an aspirational package.
2. **A pre-order sheet with a deadline** — the strongest, because it commits inventory. A chain
   printing a form has forecast demand it intends to buy against.
3. **A seasonal bakery board** — the purest, because the dish exists only in the window. Weak as a
   measure of *size*: one bakery's board is one bakery.
4. **A one-night prix fixe, and what dining volume does that day** — the only kind that measures the
   whole population rather than one shop.

**The line that does the rejecting: advice is not selling.** A blog telling you what to eat on
moving day, a listicle of make-ahead meals for houseguests, a magazine's thirty ideas — none of
these is somebody committing money to the moment. They are content about a moment, which is
precisely what the occasion cookbook is, and admitting them would readmit the failure S-013 named.

- **Rejected: search-volume or recipe-site traffic as evidence.** It measures what people *look up*,
  and `cooks.md`'s second cook is somebody who looks up far more than they cook. Revealed preference
  means money moved.
- **Rejected: "a tradition exists" as evidence.** Moving day has a tradition — pizza, or Chinese
  takeout — and it produces no product. That is the case that shows the two are different.
- **Rejected: softening the rule for occasions that feel obvious.** The ticket asks for it applied
  hard. Applied hard it rejects *moving*, which is on S-013's own list of moments in life, and
  *in-laws for a week*, which is one of the three people in `cooks.md`. Both rejections stay in.

## 3. Real is one gate. Ours is a second, and they are not the same gate

**Decided: the file states two gates in order — *is it real* (somebody sells) and *is it ours*
(does the site answer it better than something already on the board) — and says plainly that an
occasion can pass the first and fail the second.**

This came out of the evidence rather than being planned. The snow day was expected to be the
rejection and it is not: restaurants across four cities print snow-day specials, and pizzerias sell
take-home *Snow Day* kits. It passes the selling test outright.

A single gate would then have forced one of two bad answers — admit the snow day as an occasion and
duplicate S-010's dials, or fudge the evidence to keep it out. **Rejected: one gate.** Two gates
keeps the rule honest about the world and still lets the site decline the work.

## 4. The three axes

**Decided: time of year — in. Moment in life — in, with the evidence graded as thinner. Type of
day — out, on the second gate, not the first.**

| Axis | Verdict | Decided on |
| --- | --- | --- |
| Time of year | **In** | All four kinds of evidence, abundantly |
| Moment in life | **In** | Two kinds — priced packages (postpartum delivery) and a printed menu category (the repast). No pre-order sheet, no dining-volume figure. Recorded as thinner |
| Type of day | **Out** | Passes gate one. Fails gate two: `handsOnMinutes`, `totalMinutes`, `washingUpCount` and `longestHandsOnMinutes` are already three dials on the front page, and S-010 argued them for exactly this reader |

The ticket says getting *type of day* wrong is expensive in both directions, so the decision states
both costs and which one is being accepted:

- **As an occasion** it duplicates a feature already built and shipped, and hands the reader two
  places to ask one question. `cooks.md`'s second cook — whose cost *is* the deciding — is made
  worse by exactly that.
- **Excluded** it strands the person most often in the kitchen. **This is the cost being accepted,
  and it is accepted because they are not stranded**: they are the reader S-010's three dials were
  built for, and `cooks.md`'s worked verdict already records that those dials **pass** for them.

**Rejected: folding type of day in as a set of pre-set dial positions** (a *long day* button that
sets standing-time to 20 minutes). It is a real idea and it is T-011-06's, which S-011 already owns
— proposing it here would be a knowledge file recommending a feature, which `cooks.md` refuses by
name.

## 5. The shape of the hall-of-fame profile

**Decided: a profile is three things — a gate, a signed weighting in minutes-equivalent over named
existing fields, and a silence rule with three answers. Not a score.**

```
profile(occasion) = { n, gates[], weights{ field → signed rate }, silence: pass | reject | cannot say }
```

Four properties, each chosen against an alternative:

**It is signed, and the sign is the occasion's.** `standing(n)` is a cost for the family meal and a
*good* for the dumpling party. This is the whole mechanism of the inversion, and it needs no new
field — the same number, one sign flip.

**The rates are in minutes-equivalent and are declared, not measured.** *A day of keeping is worth
twenty minutes back* is a preference statement the occasion owns. The file says so out loud, because
the repo's rule is that a measurement may never be invented — and a weight is not a measurement. The
alternative was normalising each field to a z-score across the collection; **rejected**, because it
makes the arbitrary part invisible and makes every score depend on which recipes happen to exist.

**It ranks, rejects or says it cannot say.** Borrowed unchanged from S-010's filter and
`cooks.md`'s instrument. A recipe that never declared `keeps` is not a recipe that keeps for zero
days. **Rejected: treating absence as a zero** — that is the failure mode `washing-up`, `slack`,
`keeps` and `capacity` were each separately built to avoid.

**Rejected: a single difficulty score per occasion.** S-010 refuses one on the record and gives the
reason: it averages together things a cook is trading against. A per-occasion score would be the
same object with a season attached, which S-013 names as the tempting mistake.

**Rejected: a hand-curated list per occasion.** That is the occasion cookbook. The whole point is
that the selection is derived from measurements, so a new occasion costs a weighting rather than a
reading of the whole shelf.

## 6. What the worked corners are for, and what they showed

**Decided: work both corners over the same seventeen-recipe candidate set at `n = 12`, with real
`buildSchedule` and `costOf` figures, and report what the machinery did — including where it is
wrong.**

Running it produced three results, and the third changes a rule:

**The inversion is real.** Same fields, signs flipped: `gyoza` goes from last of seventeen under the
family-meal profile to first under the party's; `green-beans` 16th → 2nd; `smoked-turkey-breast`
2nd → 14th; `chili-con-carne` 1st → 5th. The shape expresses both corners, which is what S-013
demands of it.

**The collection cannot feed either profile.** Nine of seventeen score identically under the family
profile because every field they would be separated on is absent. Under the party profile,
`har-gow`, `siu-mai` and `xiao-long-bao` — the three purest per-unit hand-labour dishes on the shelf
— rank at or near the bottom, at zero standing minutes, because their shaping steps carry no timer.
`scaling.md` §4.3 found this on `gyoza`; it is the rule across the dumpling shelf, not one file's
oversight.

**The sign flip inverts the site's error convention, and this is the finding.** `schedule.ts`
falls back to hands-on when a step says nothing, and `longestUnbroken()` states the convention:
*"where it errs it errs towards a busier evening, which warns a tired cook rather than reassuring
one."* That is safe **only while hands-on time is a cost**. Give it a positive weight and the same
fallback rewards the recipe nobody annotated. It is not hypothetical: `green-beans` ranks **second**
in a dumpling party, on 13 unclaimed minutes out of 19.5.

**So the file carries one rule that follows from its own worked example:** a profile that weights
hands-on time positively may score only claimed minutes — `handsOnMinutes − assumedHandsOnMinutes`
— and must put `evidence: unknown` in cannot-say rather than ranking it. Applied, the party profile
ranks 5 of 17 and says *cannot say* to 12, including three of the four dishes the party is about.
That is the honest answer and it is the one T-013-03 inherits.

## 7. The namespace

**Decided: a separate axis. Not a third kind of entry in `>> counters:`.**

**The case for one namespace**, put at its strongest: one field, one render, one front page, no
schema change, no new machinery — and a recipe genuinely can belong to a shop and a moment at once,
which `>> counters:` already supports since it is a list. The precedent is real: the field stretched
once for the bargains and the site did not break.

**The case against, which wins on the second point:**

- `counters.md`'s opening definition — *where you would get this if you were not making it at
  home* — stops being true. The bargains already strained it; The Air Fryer & the Pot admits at
  line 889 that it is not a shop. A third kind makes the sentence decorative.
- **The stretch that already happened is the argument against stretching again, not for it.** The
  bargains kept the *user gesture* — you are still picking a way to get dinner. An occasion is not
  a way of getting dinner; it is a reason for it. And unlike a counter, an occasion is
  **time-bounded**: *Thanksgiving* on the front page is wrong eleven months of the year, where
  *Bakery* never is.
- A front page mixing Bakery, One Pot and Thanksgiving has stopped being wayfinding, which is the
  one job the front page has.

**The decisive test, and it is mechanical rather than aesthetic.** A counter's membership is a
judgement about the shop, and it is stable. An occasion's membership is `profile(occasion)` applied
to a recipe's measured fields — it changes when `keeps` is annotated, when a timer is added, when
`capacity` lands. **A derived, moving membership cannot live in an authored, static list.** Putting
it in `>> counters:` would mean either freezing it into a hand-list (the cookbook) or letting a
`counters.json` entry silently change under the reader.

**The cost of a separate axis, stated because the ticket requires it and because it is not free:**
a new authored or derived field and its reader in `src/lib/`; `src/pages/search.json.ts` currently
joins title, category, counters, `aka`, tags and ingredients into one blob and would need the axis
kept separate or it becomes free text; a place to render it that is not the counter row;
`scripts/menu-sections.mjs` round-trips `docs/gaps/**` into `src/data/counters.json` and would need
to keep ignoring it; and a `docs/gaps/` page per occasion if occasions are to be readable the way
counters are. **None of that is proposed here** — it is the price tag on the decision, which is what
was asked for.

---

## What this design deliberately does not do

- **No occasion is opened, ranked or shelved.** T-013-03 proves the method on two; this file is the
  method.
- **No field is proposed.** Missing fields are named with what each would take, and stop there —
  `cooks.md`'s §"What is missing" is the precedent and its own closing rule forbids more.
- **No recipe is written and no annotation is added**, including the obvious ones. `cranberry-sauce`
  plainly keeps and plainly is the make-ahead dish of the plate; saying so would edit a `.cook`
  file, which criterion 8 forbids. It is recorded as a gap instead.
