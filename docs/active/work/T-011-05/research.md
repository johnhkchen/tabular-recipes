# T-011-05 — Research

What exists, where, and what it already knows. No solutions here.

## 1. The defect, located

`src/pages/list.astro:919-926` is the whole of it:

```ts
/** "serves 9 → 18" when the number can be read; the author's own words when it cannot. */
const servingsText = (servings: string | null, multiplier: number): string | null => {
  if (!servings) return null;
  if (multiplier === 1) return `serves ${servings}`;
  const n = Number(servings.trim());
  if (!Number.isFinite(n)) return `serves ${servings}, at ${formatMultiplier(multiplier)}`;
  return `serves ${servings} → ${Number((n * multiplier).toFixed(2))}`;
};
```

It is drawn into `.planned li > .what > p.meta` at line 984 as
`counters · serves 4 → 12`. Nothing else on the page mentions time at any multiplier. The dial
(`MULTIPLIERS = [0.5, 1, 2, 3]`, `src/lib/plan.ts:47`) is drawn at 995-1010, and
`scaleAmount` (`plan.ts:64`) multiplies every ingredient amount. Both are correct and both are
out of scope: the ticket forbids touching them.

So today the page makes one claim about scaling (the servings) and stays silent about the other
(the clock), and a reader takes silence for *unchanged*.

## 2. What is already built, and what it returns

### `src/lib/scaling.ts` — T-011-02

`costOf(recipe, wanted, schedule?) → Cost | null`. Null when `>> servings:` has no leading
number, or `wanted` is not positive. Everything this ticket needs is on `Cost`:

| Field | What it is |
| --- | --- |
| `bounded` | `true` iff the recipe declares `>> capacity:`. **This is the unbounded/vessel switch.** |
| `servings.{written,at,multiplier}` | `s`, `n`, `m` |
| `batches.{written,at,ratio,binds,costMinutes}` | `b(s)`, `b(n)`, `r`, `b(n)>b(s)`, and `A_batch·(r−1)+H_batch·(r−m)` — **what the vessel actually costs** |
| `elapsed.{written,at,factor,flat}` | one-cook clock, then and now |
| `standing.{written,at,factor,flat}` | time at the pan |
| `longest.…` | longest unbroken stretch |
| `evidence` | `stated \| inferred \| unknown` — how good the hands-on figure was **before** scaling |
| `assumedStandingMinutes` | the part of `standing.at` that exists only because nothing was said |
| `untimedCount` | operations the recipe never timed |

Its header states the rule this ticket inherits: *"this file returns NO STRING A PAGE COULD
PRINT … The sentences live in §6's phrasebook and are T-011-05's and T-011-06's to say."* The
batch count is `batches.at`, already computed here — the page must never do `ceil(n/c)` itself.

### `src/lib/schedule.ts` — `handsOnEvidence`

`evidence: 'unknown'` means one of three things, all of them "the hands-on figure is ours, not
the author's": the recipe times nothing at all; it reports zero hands-on minutes **and** has
untimed steps (chili-con-carne — §4.6's worked example); or some hands-on minutes were assumed
because no timer said. This is exactly the ticket's phrase *"its hands-on figure is mostly
assumed"*, already named and already computed.

### `src/components/dials.ts` — T-010-02

The nearest precedent, and it settles two things this ticket would otherwise have to invent.

1. **A `.ts` module under `src/components/` is the house answer** when a page needs pure,
   testable logic and `src/lib/**` belongs to no ticket. Its header says so explicitly, and
   `src/components/dials.test.ts` is beside it.
2. **`canAnswer` is per-axis, not global** (`dials.ts:153`). The standing dial refuses
   `evidence === 'unknown'`; the elapsed dial refuses only `elapsedMinutes === 0`. The comment
   gives the reason: *"chile-verde-slow-cooker is unknown because its hands-on figure has
   assumed minutes in it, and its 512 elapsed minutes come from real timers. Telling a reader we
   cannot say when an eight-hour braise will be on the table … would do that to 371 recipes."*

It also carries the three-answer discipline — pass / fail / **cannot say** — and
`unsaidLine()`/`tallyLine()` as the shape for saying what was left out.

### `docs/knowledge/scaling.md` §6 — the phrasebook

Thirteen rows, finding → sentence, and a hard rule: *no notation, ever*. The rows this page can
reach are listed in Design. Two of them are tails rather than sentences
(*"…plus four steps the recipe never times."*), which matters for the markup.

## 3. How the page gets its data — the constraint that shapes everything

`/list/` is **drawn entirely in the browser**. The plan is `localStorage`; the amounts come from
one `fetch('/plan.json')`. `src/pages/plan.json.ts` emits, per recipe, only
`{slug, title, counters, servings, ingredients}` — no steps, no timers, no capacity. Its own
header says why: *"Only what a shopping list uses is in here."*

`costOf()` needs the whole `RawRecipe` plus a `Schedule`. `src/generated/recipes.json` is
**4.2 MB**; `dist/plan.json` is 650 KB. Shipping the recipe tree to the browser is not on the
table.

And **`src/pages/plan.json.ts` is not a file this ticket owns.** The acceptance criteria name
`src/pages/list.astro`, any new component, `src/styles/**`, tests and the work directory. So the
cost data has to arrive by a route that stays inside those files. Astro frontmatter runs at build
time and can import `recipes.json`, which is the door that is open.

## 4. The collection, measured

685 recipes parse a servings number (all of them). Run `costOf()` over every one at ×0.5, ×2, ×3:

| | ×0.5 | ×2 | ×3 |
| --- | ---: | ---: | ---: |
| capacity declared (`bounded`) | 46 | 46 | 46 |
| … needs more loads than written | 0 | 46 | 46 |
| … needs fewer / the same | 46 | 0 | 0 |
| unbounded, `evidence !== 'unknown'` | 250 | 250 | 250 |
| unbounded, `evidence === 'unknown'` | 389 | 389 | 389 |

`evidence` across all 685: `unknown` 416, `inferred` 223, `stated` 46. Of the 46 with a
capacity, 27 are `unknown` — every air fryer recipe is, because roast/air-fry are unattended
verbs and those files report **zero** hands-on minutes.

**That is the finding that decides the classifier.** A rule of "silence when `evidence` is
`unknown`" would silence exactly the recipes the ticket was written about. The batch count of a
bounded recipe is a fact about an authored `>> capacity:` line; it does not depend on the
hands-on figure at all.

The 46 capacities (T-011-03) come in five families: the 5.7 L air fryer basket (22 files, `c=4`
or `2`, bounding *roast, air fry*), the Instant Pot / skillet base for browning (11 files, `c=3`),
a wok or pan of oil for frying (6 files, `c=2`), a heavy pot for searing (3 files, `c=3`), and
one-offs — `wonton-soup` (a wide pot, boil), `beef-with-broccoli` (the wok, sear).

## 5. What ×3 costs today, unwarned

`elapsed.at − elapsed.written` at ×3 is the number of minutes the plan page currently adds
without saying so. Top of the collection by that measure:

| Slug | written | at ×3 | added | ×  | capacity? | can the page speak? |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `beef-rendang` | 180 | 300 | +120 | 1.7 | no | **no** — 180 of 180 standing minutes assumed |
| `french-onion-soup` | 83 | 189 | +106 | 2.3 | no | **no** — 150 of 159 assumed |
| `mujaddara` | 82 | 186 | +104 | 2.3 | no | yes |
| `gumbo` | 102 | 200 | +98 | 2.0 | no | yes (`stated`) |
| `sourdough-boule` | 975 | 1065 | +90 | 1.1 | no | yes |
| `patty-melt` | 45 | 135 | +90 | 3.0 | no | yes |
| `beef-bourguignon-instant-pot` | 110 | 200 | +90 | 1.8 | yes, 6 loads | yes |
| `polenta` | 40 | 120 | +80 | 3.0 | no | yes |
| `air-fryer-chips` | 22 | 66 | +44 | 3.0 | yes, 3 loads | yes |
| `air-fryer-chicken-wings` | 21 | 63 | +42 | 3.0 | yes, 3 loads | yes |

Two things fall out.

- **The worst offenders by raw minutes are not vessel-bound.** They are roux, onions and
  browning — `O(n)` hands-on work in a pot that does not care. The vessel is the story S-011
  tells, but the arithmetic says hands-on growth is the bigger lie in this collection today.
- **The two largest are ones we will still not be able to speak about.** `beef-rendang`'s 180
  standing minutes are 100% assumed. Printing *"three times the chopping"* there would be
  §4.6's failure with a new coat on.

The air fryer numbers are lower than the ticket's illustration (*"a twenty-five-minute recipe …
the fourth basket"*) because T-011-03 wrote `c = 4` against `>> servings: 4`, so ×3 is **three**
loads, not four, and `air-fryer-chicken-wings` is 21 minutes rather than 25. The shape is exactly
as described; the figures are the ones in the files.

## 6. The page's shape and its constraints

`.planned li` is a flex row: `.what` (title + one `p.meta`) `· .dial · .drop`. Everything is
rebuilt from scratch on every plan change (`drawPlanned`, 964), with focus restored by hand
(`focusedControl`/`restoreFocus`, 934-962) — anything added must not break that.

Styling: **every rule is `.list-page :global(…)`**, because the script draws the DOM and Astro's
scoped styles only reach markup that was in the file. The file comment at line 105 also records a
hard constraint: this page may write exactly one width, `34rem`;
`src/styles/breakpoints.test.ts` fails the build on a third number.

`npm run verify` = `check-recipes` + `parse-recipes` + `vitest run` + `astro build`.
`npm run verify:mobile` = build + `check-overflow.mjs --width 375,390,768` + `check-touch.mjs`.
Both scripts drive the Chrome on the machine over CDP through `scripts/browser.mjs`, which
exposes `go`, `evaluate` and `Page.captureScreenshot` — enough to seed `localStorage` with a
plan and photograph the result.

At ≤34rem the page already promises 44px on `.dial button`, `.drop`, `.small`, `.tick` and
`.planned h3 a`. A new line of prose is not a control and adds none of that; it adds height to
`.what`, which the flex row absorbs.

## 7. Assumptions and open questions carried into Design

1. **Nothing may be added to `src/lib/`.** The criteria list does not include it; `dials.ts`
   solved the identical problem one directory over and left a note saying moving it later is a
   rename.
2. **The phrasebook is a fixed vocabulary.** §1 of the ticket permits adding a row to
   `docs/knowledge/scaling.md` if one is missing, but the criteria list does not name that file
   as modifiable. Design must therefore try to reach every case with an existing row and record
   any genuine gap rather than quietly improvising.
3. **The total is not in the phrasebook.** §6 catalogues per-recipe findings. A sentence about
   what the *evening* costs is a scheduling statement and has no row. Design has to argue both
   the arithmetic and the wording.
4. **`multiplierOf` is not restricted to `MULTIPLIERS`.** `setMultiplier` accepts any finite
   positive number and a stored plan can carry one. Whatever is precomputed covers four values;
   anything else has to degrade to silence rather than to a wrong sentence.
5. **266 of 685 recipes have a flat elapsed time at ×3** — the good news the ticket wants said
   out loud. Most of them are flat because `H = 0`, and `H = 0` with untimed steps is precisely
   `evidence: 'unknown'`. How many can actually be congratulated is a Design question and the
   answer is smaller than 266.
