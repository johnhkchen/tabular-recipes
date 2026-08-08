# T-010-03 — Design

This ticket produces findings, not code. So the decisions are about **how the audit is run and
how its verdicts are defended**, and about **which of the things found are written down as
proposals rather than applied**.

---

## D1 — Which setting is "the story's scenario"

The story says *under twenty minutes standing there*. The `standing` dial has stops at 5, 15 and
30. There is no 20.

| option | |
| --- | --- |
| **A. Run at `standing=15`** | the tightest stop that honours "under twenty" |
| B. Run at `standing=30` | the loosest stop a person after twenty minutes might settle for |
| C. Run a hypothetical `≤ 20` cut | the story's literal number, but not a list any reader can produce |

**Chosen: A, and B reported alongside.** The acceptance criterion says *run against the built
site*, and C is not a list the built site can produce — pressing a dial is the only way in, and
`readSettings()` throws away `?standing=20` as not a stop this dial has. A verdict on a list
nobody can reach is not an audit of the filter.

B is reported because the difference is the point: 15 passes 227 and 30 passes 260, and **the
gap between the two nearest reachable settings is 33 recipes.** That the story's own number
cannot be set is the first entry in what the filter cannot say.

C is not run at all. The number would be somewhere between 227 and 260 and would tell a reader
nothing they could act on.

## D2 — What "would a tired person be glad to see this?" means, written down before the reading

A verdict per recipe is worthless if the standard moves while reading 227 of them. So the
standard is fixed first, stated in the artifact, and applied by a script whose overrides are all
named.

A recipe is **wrong for the evening** when any of these is true, in this order:

1. **It is not dinner.** A component another recipe eats (`Spice Blends & Marinades`,
   `Sauces & Gravies`, `Dressings & Dips`, `Toppings & Pickles`, `Pastry & Doughs`), or —
   read by hand, because the category tree does not say — a stock, a loaf, a side, a course or a
   drink. `dashi` and `chicken-broth` are filed under `Soups`; `baguette` under `Breads`.
2. **It started yesterday.** `elapsedMinutes > 240`. A person deciding at six o'clock cannot use
   a fourteen-hour proof, and the clock counting it correctly does not make it available.
3. **Its standing figure is a floor**, and the untimed operation is minutes of shaping rather
   than a stir. Read by hand, one file at a time.
4. **It is a quart of oil.** Deep frying at 350°F reads as the fry timer alone; heating the oil,
   the dredging station and the batches are all untimed. `docs/gaps/one-pot.md` already makes
   this argument about four of these exact files.

**Borderline** is: two to four hours on the clock, or a tool a bare kitchen may not own, or it
makes eight or more when two are eating. **Right** is everything left.

Rejected: scoring each recipe on a 1–5 scale and thresholding. That is the composite score S-010
refuses, arriving through the back door of the audit that was meant to check it.

Rejected: reading only a sample. The criterion says *every result is read*, *slugs, not a
summary*, and a sample is exactly how a filter's tail gets a pass.

**The judgement is made auditable rather than claimed to be objective.** Rule 1 accounts for 112
of the 143 wrong verdicts, and it is the rule most open to disagreement — a reader who thinks a
loaf of bread is a legitimate answer to *what can I cook tonight* would score this filter far
better. So the count is reported broken down by reason, and the two hand-read sets are printed in
full, so anyone can subtract the ones they disagree with.

## D3 — The dark-roux check: what "the number is measuring something else" would look like

The ticket says: if the gumbo line is not near the top of the longest-unbroken ranking, diagnose
rather than accept.

It is 4th of 685, at 49 minutes. So the number is not measuring something else, and the honest
report is a pass. But **4th is worth a paragraph rather than a tick**, because of what is above
it:

| | longest | assumed | evidence |
| --- | --: | --: | --- |
| `beef-rendang` | 60 | **60 (100%)** | unknown |
| `mujaddara` | 52 | 0 | inferred |
| `french-onion-soup` | 50 | **50 (94%)** | unknown |
| **`gumbo`** | **49** | **0** | **stated** |

Two of the three above it are recipes where the entire figure is a minute nobody claimed. The
ranking is polluted by exactly the thing `evidence` exists to flag, and the fix is not to change
the number — it is that **the ranking should be read with the evidence column beside it**, at
which point gumbo is first among the figures anyone actually claimed. That is the finding, and it
is stronger than the tick the criterion asks for.

## D4 — The rescue check: how to report a number that rescues almost nothing

The criterion asks for recipes with high total hands-on and a short longest stretch, read and
confirmed to really be broken up, and says: if they are not, the fourth number is not earning its
place, and say so.

They *are* really broken up — all three of them. The problem is that there are three.

So the honest report is neither "it earns its place" nor "it does not". It is the measurement:
the qualifier can say something about 35 recipes of 685, **19 of those 35 are on the cannot-say
shelf where `figures()` never runs**, and of the 16 that remain only 5 pass at `standing ≤ 15`.
The number is correct, it is cheap, and **it is printed on about five cards.**

Rejected: recommending the fourth dial T-010-02 argued against. Its D2 measured the same thing
from the other side and reached the same answer, and nothing found here reverses it — the dial
would have even less to sort than the qualifier has to say.

## D5 — Vocabulary findings: which direction, and why none is applied

Twenty timer names fall through to word-reading. Each is a candidate for one of the two lists,
and the candidates split three ways:

**(a) Words that should be `UNATTENDED`, and change minutes.** `reduce` and `thicken`. A lid-off
reduction on Sauté or a slaked starch on High is a pot bubbling by itself. Measured on a patched
copy: **31 recipes move, 16 leave the cannot-say shelf, 18 more pass `standing ≤ 15`, and zero
recipes newly fail.** That last number is what makes it safe: nothing that was answerable becomes
less so.

**(b) Words that should be `HANDS_ON`, and change no minutes at all.** `render`, `sweat`, `char`,
`blanch`, `warm`, `glaze`, `rub`, `cream`, `bloom`, `caramel`, `cook`. Every one already reads
hands-on — by falling through to `default`. Adding them changes `source` from `default` to
`name`, which is `confidence: unknown` → `stated`. **The minutes are identical and the recipe
becomes answerable.** This is the cheapest coverage the standing dial can buy.

**(c) `churn`, which should probably leave `HANDS_ON`.** It is never written as a timer name
anywhere. Its only effect is loose in a sentence, and its only catch in the whole collection is
`french-vanilla-ice-cream` — *"Churn @cold custard{} in an #ice cream maker{} for ~{25%min}"* —
where it reports 25 minutes of standing at a machine that is designed to be left. That is the
same shape as `dry`, `press` and `boil`: a word that means the work when named and something else
when spotted.

**None of this is applied.** `time.ts`'s header records that every word in
`NOT_A_VERB_IN_A_SENTENCE` *"was caught lying"*, with the sentence that caught it. That file is
argued line by line and the ticket says a change to it is its own ticket. The counter-evidence
against each proposal is written down beside it — `nikujaga` and `red-braised-pork-belly` spoon
liquid over the fish *every minute or so* through their `~reduce`, and would be over-corrected —
because a proposal that hides its exceptions is not a proposal.

## D6 — Where the two documents go, and which is which

Two artifacts are owed: a coverage statement in `docs/gaps/README.md`, and a new page recording
what the filter cannot say.

**Chosen: `docs/gaps/filter.md`, and a short section plus a link in `README.md`.**

The gap pages are one per counter and this is not a counter, but `soup-pot.md` is already a file
in that directory that is not a counter page — the record of a shelf that came down. `README.md`
names it and says why. The same move works here, and the ticket asks for the new page to be *in
the shape of the gap pages' what-it-could-not-stock sections*, which is a shape that lives in
this directory and nowhere else.

`README.md` gets the per-dial coverage table and what the filter looks like at that coverage,
because that is the file the ticket names and the file the next pass reads for work. It does not
get the long findings; those would bury the counter tally that is `README.md`'s job.

Rejected: `docs/knowledge/`. That directory is conventions and vocabulary — what a writer must
follow. A record of what a feature cannot do is not a convention.

Rejected: putting everything in `docs/active/work/T-010-03/`. Work artifacts are the record of
how a ticket was done; the ticket asks for a page that *the next pass looks at*, and nobody reads
another ticket's work directory looking for work.

## D7 — What is deliberately not proposed

- **No dial is added.** Equipment, servings and lead-time all came up as real reader questions and
  all three are recorded as things the filter cannot say rather than as a fourth, fifth and sixth
  control. S-010's argument against a composite is also an argument against a control panel.
- **`handsOnEvidence()` is not rewritten here** although §"the floor problem" argues it has a
  hole. It sits in `src/lib/schedule.ts`, which this ticket does not own, and the fix has at least
  two shapes (demote on any untimed hands-shaped operation; or ship `untimedCount` and let
  `canAnswer` decide). Choosing between them is a ticket with tests.
- **`search.json.ts` is not widened** to carry `cookware` or `servings`, for the same reason.
- **No `.cook` file is annotated.** `sourdough-boule` and `ciabatta` each need one timer split,
  `crab-rangoon` and eleven others each need one `~` on a shaping step. Every one is a one-file
  edit and every one is somebody else's ticket.
