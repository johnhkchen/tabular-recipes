# T-003-07 — Design

Six things to decide: which recipes get a slack line, how the reason is written, what to do
about the one clock that misreads, what counts as a duplicate, what the front-page verdict is,
and what shape the three gap docs take. The rest is measurement, and measurement has no
options.

---

## 1. Which recipes get a slack line

557 are undeclared. The ticket is explicit that this pass does not annotate all of them, and
equally explicit that two classes are not optional: *a window that closes* and *a failure that
is a safety failure*. The third class — the long cooks — is where the honest answer is usually
"an extra hour changes little", and the ticket says saying so is what makes the walk-away
shelves trustworthy.

### Rejected: annotate by folder

The obvious cut — "do custards-and-puddings, do breads" — is wrong because the folders are
categories of *what the thing is*, not of *how it fails*. `dressings-and-dips` holds
`mayonnaise` (an emulsion that breaks) beside `coleslaw` (which does not care). `soups` holds
`tonkotsu-broth` (nine hours) beside `egg-drop-soup` (five minutes). Cutting by folder either
sweeps in files with nothing to declare — which produces filler, the one thing the property's
own header forbids — or leaves out the file next to them that needed it most.

### Rejected: annotate by level

"Do all the unforgiving ones first" cannot be executed, because the level is the *output* of
reading the file. There is no list of unforgiving recipes to work from; making one is the work.

### Chosen: three measured predicates, unioned

Each is a property of the file that can be checked rather than felt, and each maps to one of
the ticket's three rules.

**P1 — a long cook.** `buildSchedule().unattendedMinutes >= 120`. **157 files.** Measured, not
judged. This is the ticket's third rule, and it is the widest net because on this site a long
unattended stretch is the thing the shelves are sold on. It sweeps in most of what the other
two rules would have caught anyway: every bread dough with a bulk ferment, every custard with
a chill, every cure, every pickle, every stock and every braise.

**P2 — pressure.** Every file carrying `kit: Instant Pot`. **25 files, 3 already in P1.** A
pressure cooker is where "dangerous when wrong" is most acute and least visible: the lid is
locked, nothing can be looked at, and a bean or a piece of pork that comes out under-done comes
out under-done with no warning. S-002 wrote all 25 before T-003-02 existed, so **not one of
them declares a slack**, and they are the newest files on the shelf. That is the sharpest hole
in the collection and it is not old work.

**P3 — a short window that closes.** The set the first two predicates cannot reach, because
these dishes are fast: an emulsion that breaks, sugar past its colour, a foam that deflates, a
grain past al dente, an egg past set. Enumerated by hand from the collection rather than
measured, because there is no number for it — that is the honest form of this rule.
**~26 files.**

**Union: roughly 205 files.** Everything outside it is left undeclared on purpose: a cookie
that browns a minute late, a stir-fry that is four minutes of standing at the pan, a dressing
that is whisked and eaten. An honest gap is better than a filled field, and the render was
built to look deliberate when the line is missing.

### The rule for what remains

Say the number. The next pass starts from it, and it is the only part of this decision that
outlives the ticket.

---

## 2. How a reason is written

`slack.ts` says it plainly: a level without a reason is not a reading, and a recipe that
cannot name its real failure has not earned a rating. The existing 101 lines set the register
and this pass matches it rather than inventing a second voice:

> `narrow — the paprika has about thirty seconds off the heat before it scorches, and scorched
> paprika is bitter for the whole eight hours that follow; nothing later in the day takes it
> back out`

Four rules, taken from those 101:

1. **Name the thing that fails, not the dish.** "The custard breaks" — not "this is fussy."
2. **Say whether it comes back.** That is the difference between `narrow` and `unforgiving`,
   and it is the sentence a cook actually plans around.
3. **A forgiving dish still names its one tight part** where it has one. Half the existing
   `forgiving` lines do exactly this — the braise is fine all day, *the gravy is not*.
4. **Never fabricate a number.** A temperature or a minute count is a claim. Where the file
   itself states one, use the file's. Where it does not, describe the failure without one.

### Level, from the failure

- `forgiving` — late costs little; sometimes it improves.
- `narrow` — a real window, missed it is worse, still dinner.
- `unforgiving` — gone: broken, ruined, or unsafe.

**Unsafe is always `unforgiving`.** Under-done beans and under-done pork are not "worse
dinner", and grading them `narrow` would be the render telling a comfortable lie.

---

## 3. The one clock that misreads

`buri-daikon` reports 30 of its 55 minutes as hands-on, and **all 30 are assumed** — source
`default`, meaning nobody said and `time.ts` fell back to "you are standing there." Twenty of
those minutes are `~parboil{20%min}`: a pot of rice water with daikon in it.

The ticket names the two legal fixes — a timer name, or `src/lib/time.ts` — and forbids the
third, changing the number.

**Chosen: add `parboil` to `UNATTENDED` in `src/lib/time.ts`.**

The timer is *already named* `~parboil`; the name is simply not in the vocabulary. Renaming it
to `~simmer` to satisfy the parser would be writing a worse label to get a better answer, which
is the exact failure the `attentionOf` comment warns about — *naming a timer more descriptively
makes the answer worse than leaving it blank*.

`parboil` belongs beside `parbake`, `blindbake` and `prebake`, which are already there for the
same reason. And it is safe from the trap `NOT_A_VERB_IN_A_SENTENCE` exists for: `boil` is
withheld because "boil 1 min a side" is standing at the pan, but **`parboil` appears in the
collection only ever as a timer name or as the verb opening its own step** — seven timers
across `buri-daikon`, `chintan-broth`, `tonkotsu-broth`, `pho-broth` and three Instant Pot
siblings, every one of them "bring to a boil and parboil, then drain and rinse." Nobody stands
over a parboil; that is what parboiling is.

This is a change outside `recipes/` and `docs/`, so it gets named in the work artifact.

---

## 4. What counts as a duplicate

Three passes were run in Research and the honest finding is that **the collection has no dish
written twice.** So the design question is not "how do we merge" but "where is the line", and
two cases sit on it.

**`crockpot corned beef and cabbage` on two files.** It is on
`corned-beef-slow-cooker` and on `new-england-boiled-dinner-slow-cooker`. Read against the
plain siblings, the answer is clear: `new-england-boiled-dinner` carries *corned beef and
cabbage* and `corned-beef` does not. The boiled dinner **is** the corned-beef-and-cabbage dish;
`corned-beef` is a deli brisket that happens to get an hour of cabbage at the end.

**Chosen: drop that one alias from `corned-beef-slow-cooker.cook`.** It is not a merge — the
two files are genuinely different dishes and both should exist — it is a variant that drifted
from its plain sibling's vocabulary and gets put back. `slow cooker corned beef` stays.

**`beetroot salad` on `roasted-beet-salad` and `roasted-beets`.** Kept, both. A deli case sells
dressed roasted beets as beetroot salad and it also sells beets with goat cheese and leaves as
beetroot salad. The two files are a side and a composed salad — the `char-siu` / `char-siu-bao`
shape, which the collection already accepts. Recorded, not changed.

Everything else — *grain bowl* on ten bowls, *lo fo tong* on sixteen old-fire soups — is `aka`
doing precisely the job it exists for: carrying the words a person would actually type.

---

## 5. The front page at 21 counters

The ticket asks for a verdict and explicitly does not ask for a redesign. So the design
decision is only *what the verdict says*, and it has to be defensible from the page rather than
from taste.

`index.astro` renders one flat `<ul class="counters">`, declaration order, no grouping. That
worked at fifteen because all fifteen answered one question: *where would I buy this.*

Six of the twenty-one no longer answer it. **Instant Pot** and **The Slow Cooker** are kit.
**One Pot** is a constraint. **The Bowl Shop** is a place, but a new one. **The Soup Pot** and
**Japanese Home Cooking** are a household, not a storefront. A visitor scanning the row gets
*Diner*, *Smokehouse*, *Meat and Three*, then *Instant Pot* — a shelf that is not a place at
all — with nothing to signal the change of kind.

**Verdict: the list has not stopped being usable at twenty-one, but it has stopped being one
list.** Twenty-one cards still scan; six of them answer a different question, and that is what
degraded, not the length. Recorded with what I would do about it, and left for its own ticket.

---

## 6. The three gap docs

`scripts/menu-sections.mjs` parses **only** the `## What it has` block and folds its section
titles and slugs into `counters.json`. That block is upstream data, not prose. So:

- **The `What it has` block is rewritten from `recipes.json`, never from memory.** Every slug
  in it must be a file that names that counter, or the menu silently changes.
- `soup-pot.md` still heads that block `## What is already here`, with a note saying T-003-06
  renames it once the `>> counters:` lines are written. T-003-06 has run. **Rename it.**
- The before/after shape T-002-09 used: correct the counts in the headline, move what has been
  written off the missing list and into `What it has`, keep the ranked remainder with its
  reasons intact, and add a closing block saying what this pass found and what is left open.

**Rejected: rewriting the reference material.** The soup-pot glossary of dried goods, the four
rules of the pot, the sources — none of that went stale. Rewriting it would burn the ticket's
budget re-deriving what T-003-01 established and risk losing detail. Only what the shelf
changed gets changed.

---

## Order of work

Slack first, in batches by family; then the clock fix; then the reads; then the gap docs; then
verify. Slack first because it touches the most files and every later measurement is taken
against the tree it leaves behind.
