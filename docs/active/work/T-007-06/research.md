# T-007-06 — Research

What exists, where, and how the silent drop happens. No proposals here.

## 1. The drop, exactly

`src/lib/counters.ts:73-91`, `menuFor(counter, all)`:

```ts
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
...
items: items.map((slug) => bySlug.get(slug)).filter(Boolean) as RawRecipe[],
...
return { counter, sections, count: mine.length };
```

Three consequences, all of them silent:

1. `bySlug` is built from `mine`, not `all`. A section slug whose recipe does not carry the
   counter on its own `>> counters:` line resolves to `undefined` and is removed by
   `.filter(Boolean)`.
2. `count` is `mine.length`, so the printed "N recipes" agrees with the rendered list. The page
   is internally consistent, which is why nobody noticed.
3. Sections that empty out entirely are dropped by `.filter((section) => section.items.length > 0)`.
   A whole heading can disappear with no trace.

Nothing throws, nothing logs, no build step compares the two lists.

## 2. Measured: nine slugs, and nine is the real number

A pass over all 22 counters, every section slug checked against `src/generated/recipes.json`:

```
One Pot (4):
  general-tsos-chicken [shelved at: Takeout Counter]
  orange-chicken       [shelved at: Takeout Counter]
  sesame-chicken       [shelved at: Takeout Counter]
  sweet-and-sour-pork  [shelved at: Takeout Counter]
Cha Chaan Teng (5):
  pineapple-bun    [Bakery, Dim Sum Counter]
  egg-custard-tart [Dim Sum Counter, Bakery]
  beef-chow-fun    [Dim Sum Counter]
  char-siu         [Dim Sum Counter, Takeout Counter, Phở & Bánh Mì, The Bowl Shop]
  club-sandwich    [Diner, Deli]
TOTAL dropped = 9 · slugs naming no recipe at all = 0
```

Nine, matching the ticket. No section lists a slug that is not a recipe somewhere, so every one
of the nine is a live recipe sitting at the wrong shelf, not a typo.

## 3. Baseline: what the built site prints today

`npm run build` → 710 pages, 22 counter pages. Rendered item count (`data-slug` occurrences on
`dist/menu/<slug>/index.html`) equals the stated count in the `<p class="count">` header on every
one of the 22, because both come from `mine`:

```
air-fryer-and-pot 21   bakery 107   bowl-shop 103   cha-chaan-teng 22   curry-house 47
deli 62   dim-sum-counter 30   diner 77   instant-pot 25   japanese-home 38
meat-and-three 53   one-pot 73   panaderia 30   pho-and-banh-mi 18   pizzeria 32
ramen-shop 27   shawarma-counter 44   slow-cooker 20   smokehouse 21   takeout-counter 20
taqueria 34   thai-kitchen 21
```

Cha Chaan Teng prints 22. Every one of those 22 `.cook` files was first committed on
**2026-08-07**, the day S-007 landed. **None of them predates the story** — the second half of
T-007-05's criterion, and it is failing today. The five borrowed files were all first committed
**2026-07-30**, a week before S-007.

## 4. Where shelf membership is read, site-wide

`recipe.counters` — the `>> counters:` line in the `.cook` file — is not only `menuFor`'s input.
It is the answer three other surfaces give:

| Surface | File | Uses |
| --- | --- | --- |
| Recipe page: "the counter you'd have bought it from" | `src/pages/[slug].astro:38` | `recipe.counters[0]` |
| Recipe page: the counter links under the table | `src/pages/[slug].astro:77-81` | `recipe.counters` |
| Search index / front-page cards and dials | `src/pages/search.json.ts:55,62` and `src/pages/index.astro:382` | `recipe.counters` |
| Front page: which counters render at all | `src/lib/counters.ts:109-114` (`menus`) | `count > 0`, i.e. `mine` |

None of these four consults `counters.json` sections. This is the constraint that shapes the whole
ticket: **`recipe.counters` is the site's single site-wide answer to "which counters is this on".**
Section lists are consulted by exactly one function.

`src/pages/[slug].astro`, `src/pages/index.astro` and `src/pages/search.json.ts` are **not** in the
ticket's list of files that may be modified.

## 5. `scripts/menu-sections.mjs` — what it does and what it already reports

Reads `## What it has` out of each `docs/gaps/<slug>.md`, splits it at bold lead-ins, takes every
slug-shaped token that exists in `src/generated/recipes.json`, and folds the result into
`counters.json` under `--write`. Dry run by default.

It already computes exactly the comparison this ticket is about, at line 112:

```js
const extra = [...placed].filter((slug) => !mine.includes(slug));
...
if (extra.length) { console.log(`  listed but not shelved here -> ${extra.join(', ')}`); problems++; }
```

But it compares the **gap note** against the recipes — not `counters.json` against the recipes. So
its current output names only five of the nine:

```
  ok   Cha Chaan Teng: 5 sections, 27/22 placed
         listed but not shelved here -> pineapple-bun, egg-custard-tart, beef-chow-fun, char-siu, club-sandwich
  ok   One Pot: 4 sections, 68/73 placed
         unplaced -> century-egg-amaranth-soup, crucian-carp-tofu-soup, mustard-greens-tofu-soup, seaweed-egg-drop-soup, tomato-potato-beef-soup
  ok   The Air Fryer & the Pot: 0 sections, 0/21 placed
         unplaced -> air-fryer-frozen-spring-rolls, … (21)
3 counter(s) need a look.
```

**`docs/gaps/README.md:155-157` claims the script "names both every run". It does not.** One Pot's
four are absent from `docs/gaps/one-pot.md`'s `What it has` block, so the script has nothing to
report — the four exist only in `counters.json`. That is precisely why they survived two stories.

### The round-trip, measured

`node scripts/menu-sections.mjs` (no `--write`) writes nothing, so the file is byte-identical after
a run. `--write` **does not** round-trip today, for three reasons, all pre-existing and none of them
this ticket's doing:

- it drops all 11 hand-written `notes` blocks (the header comment says so outright);
- `docs/gaps/one-pot.md` has drifted: its `What it has` still shows 68, so `--write` deletes the
  `Quick soups that go with dinner` section (5 items, added when S-007 moved soups off The Soup
  Pot) and replaces it with `Also`;
- `docs/gaps/air-fryer-and-pot.md` deliberately holds five empty section titles; `--write` would
  replace them with `Also (21)`. That file warns against running `--write` against it, in as many
  words.

`docs/gaps/**` is not in this ticket's modifiable set, so the second and third cannot be closed here.

## 6. The One Pot four — why they must not come back

`docs/gaps/one-pot.md` threw them off deliberately and argued it at length:

> **The deep fry.** `general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and
> `sweet-and-sour-pork` are one wok on paper and four things to wash in a kitchen … They sit at the
> Takeout Counter, which is where all four already were.

and its `Left open` section names this exact bug and hands it forward:

> **`src/data/counters.json` still lists the four fried dishes** under *Skillet dinners*. They
> render nowhere — `menuFor()` intersects a section's slugs with the recipes that actually name the
> counter … Removing the four inert slugs … is a one-line job for T-003-07.

The recipes were updated (all four name only `Takeout Counter`); `counters.json` was not. The drop
has been producing the correct page from incorrect data since `88ca990`.

## 7. The Cha Chaan Teng five — why they were listed

`docs/gaps/cha-chaan-teng.md:151-175` is a full verdict table. Five of seven candidate files are
**shelve as is**, and the note states the mechanism and the remedy without ambiguity:

> **A borrowed slug does not reach the page.** `menuFor()` … drops anything it does not find —
> silently, with nothing failing. … Making them appear needs `Cha Chaan Teng` added to five
> `>> counters:` lines, which is a one-line edit per file and belongs to whoever owns those files.

So the gap note's own author already treated the `.cook` edit as the fix, not a `menuFor` change.

## 8. What the documentation actually says

- `src/data/counters.json` header comment: describes `categories` as a fallback, and describes
  `notes`. **It does not describe section-slug resolution at all** — there is no sentence saying
  a section may list a recipe that never names the counter.
- `docs/knowledge/counters.md`: 1160 lines, and the only mention of `counters.json` is lines 21-22
  about the `categories` fallback. **It does not describe `sections` at all.**
- The "a shelf borrows" doctrine lives in tickets — `T-003-06` line 26, `T-008-05` line 38 — and in
  `docs/gaps/README.md:155` and `docs/gaps/cha-chaan-teng.md`. Two of those four are gap files this
  ticket may not edit; two are tickets.

So the documentation gap is an **absence** in the two files this ticket owns, not a wrong sentence
in them: neither says how a section slug resolves.

## 9. The Air Fryer & the Pot, and the claim that it borrows

`docs/active/tickets/T-008-05` (open, not started) says *"A section may list a recipe that never
names the counter — that is how a shelf borrows, and this shelf borrows its entire pressure-cooker
half."* Measured against the repository, that sentence is already stale:

- `docs/gaps/air-fryer-and-pot.md:9-13` — *"S-008 worried the shelf would turn out to be 'a filter
  wearing a shelf's clothes', 90% borrowed from Instant Pot. Measured, the borrowing is **0%**.
  Every item here has to be written"* and *"This shelf cannot borrow"* (line 27).
- 21 `air-fryer-*.cook` files exist already (written by T-008-04) and every one names
  `The Air Fryer & the Pot` on its own line. The shelf prints 21 today with zero borrowing.

## 10. Existing check surfaces

| Where | Runs in | Sees |
| --- | --- | --- |
| `scripts/check-recipes.mjs` | `npm run check` (first in `verify`) | one file at a time; validates counter **names** against `counters.json` |
| `scripts/parse-recipes.mjs` | `npm run recipes` | the whole collection at once; already validates `notes` against `shelvedAt` and **throws** when a note points at a slug the section does not shelve (lines 104-140) |
| `vitest run` | `verify` | `src/lib/*.test.ts` — there is **no** `counters.test.ts` |
| `astro build` | `verify` | renders every menu page |
| `scripts/check-overflow.mjs`, `check-touch.mjs` | `verify:mobile` only, post-build, read `dist/` | precedent for a post-build check that reads built HTML |

`npm run verify` = `check && recipes && vitest run && astro build`. Nothing runs after the build.

`parse-recipes.mjs:104-110` is the closest precedent and states the principle this ticket needs:
> this is the only place that sees the whole collection at once … A note on a slug the section
> lists but the shelf does not carry is the quiet failure: menuFor drops the item and the note goes
> with it, silently.

The note is guarded. The item itself is not.

## 11. Constraints carried into Design

- Modifiable: `src/lib/counters.ts`, `src/data/counters.json`, `scripts/`,
  `docs/knowledge/counters.md`, `.cook` files the decision requires, tests, work artifacts.
- **Not** modifiable: `src/pages/**`, `docs/gaps/**`, `docs/active/tickets/**`.
- `menuFor` is called from `src/pages/index.astro` (via `menus`) and `src/pages/menu/[counter].astro`,
  both with the full recipe list. A throw inside it fails `astro build`.
- Every other counter's rendered count must be unchanged; the baseline in §3 is the before-half.
