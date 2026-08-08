# T-007-06 — Review

**The decision: borrowing is not a thing.** A slug listed in a `counters.json` section whose recipe
does not name that counter now fails the build, by name. Shelf membership is the `.cook` file's
`>> counters:` line and nothing else. The nine dropped slugs are resolved: four deleted, five
shelved. `npm run verify` exits 0.

---

## What changed

| File | Change |
| --- | --- |
| `src/lib/counters.ts` | `menuFor` throws instead of `.filter(Boolean)`; doc comment states the rule |
| `src/lib/counters.test.ts` | **new** — 11 cases |
| `scripts/check-menus.mjs` | **new** — post-build check over all 22 counters |
| `package.json` | `verify` gains `&& node scripts/check-menus.mjs` |
| `src/data/counters.json` | 4 stale One Pot slugs removed; header comment states the rule |
| `recipes/breads/pineapple-bun.cook` | `>> counters:` + `Cha Chaan Teng` |
| `recipes/custards-and-puddings/egg-custard-tart.cook` | same |
| `recipes/noodles/beef-chow-fun.cook` | same |
| `recipes/stews-and-braises/char-siu.cook` | same |
| `recipes/sandwiches-and-rolls/club-sandwich.cook` | same |
| `docs/knowledge/counters.md` | **new** `### Sections` block |

Four commits: `8af004f` data · `675f22b` the throw + tests · `7a4af33` the check · `740fabd` docs.
Nothing else in the tree is modified, staged or left untracked. `src/generated/` is gitignored and
was not committed.

## Why this decision and not the other

Argued in full in `design.md`. The deciding fact is not taste: `recipe.counters` is what
`src/pages/[slug].astro` (the counter links under a table, and `counters[0]` as the home counter)
and `src/pages/search.json.ts` (the search index, read back by the front page's cards and dials)
use to answer "which counters is this on". Making `menuFor` resolve against `all` would print
`pineapple-bun` on the Cha Chaan Teng menu while its own page and the search index still said
Bakery and Dim Sum Counter — **three surfaces disagreeing, silently, about one fact**. Fixing that
means editing three `src/pages/` files that this ticket may not touch. The rejected option was not
implementable here as anything but a half-change.

Two supporting facts: `docs/gaps/one-pot.md` already asked for the four stale slugs to be deleted,
and `docs/gaps/cha-chaan-teng.md` already named the remedy for its five as "adding `Cha Chaan Teng`
to five `>> counters:` lines". Both gap notes designed for this answer.

**What it costs**, stated plainly: a dish cannot reach a second shelf without editing its own file —
one line per recipe rather than one line per counter. `char-siu` now carries five counters.

## Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| decision made and argued, with its cost | `design.md`, and the paragraph above |
| no slug silently dropped | `menuFor` throws (negative control in `progress.md` §2 — build fails naming `orange-chicken`, `One Pot`, `Skillet dinners`, `Takeout Counter`); `check-menus.mjs` catches it even with the old code restored |
| the four resolved; do not reappear on One Pot | removed from `counters.json`; One Pot renders **73** before and after; `dist/menu/one-pot/index.html` contains none of the four slugs (regex-checked) |
| Cha Chaan Teng ≥ 20 incl. ≥ 4 pre-S-007, named | **27**, five of them pre-S-007 — see below |
| a check exists, runs in `verify`, output over 22 | `scripts/check-menus.mjs`; the `verify` line; full run pasted below |
| `menu-sections.mjs` round-trips byte for byte | sha256 identical either side of a dry run (`progress.md` §4) |
| docs describe what the code does | `counters.md` `### Sections`; `counters.json` header |
| every other counter's count unchanged | 22-row before/after below |
| `npm run verify` passes | exit 0 |
| only permitted files modified | table above; `git status` clean |

### Cha Chaan Teng, on the built page

`dist/menu/cha-chaan-teng/index.html`, header **"27 recipes"**:

```
## The drinks counter (6)
   hong-kong-milk-tea · yuenyeung · iced-lemon-tea · lemon-coke-with-ginger · horlicks · red-bean-ice
## Toast and the bun case (4)
   thick-toast · hong-kong-french-toast · pineapple-bun · egg-custard-tart
## Macaroni, noodles and things in soup (7)
   ham-macaroni-soup · luncheon-meat-and-egg-noodles · hong-kong-borscht · satay-beef-noodles ·
   soy-sauce-pan-fried-noodles · beef-chow-fun · char-siu
## Rice plates (6)
   baked-pork-chop-rice · pork-chop-in-tomato-sauce · minced-beef-rice · shrimp-and-egg-rice ·
   curry-beef-brisket · swiss-wings
## Sandwiches and buns (4)
   luncheon-meat-and-egg-sandwich · hong-kong-egg-sandwich · pork-chop-bun · club-sandwich
```

No `Also` section — every one of the 27 prints under a heading the board would use.

**Written before S-007, five of them**, by first commit of the `.cook` file, against S-007's first
commit `9120fb6` (2026-08-07):

| Slug | First committed | Commit |
| --- | --- | --- |
| `pineapple-bun` | 2026-07-30 | `c7b2681` |
| `egg-custard-tart` | 2026-07-30 | `568497e` |
| `beef-chow-fun` | 2026-07-30 | `d77ad7c` |
| `char-siu` | 2026-07-30 | `0643a88` |
| `club-sandwich` | 2026-07-30 | `f102abb` |

The other 22 were all first committed on 2026-08-07. **Before this ticket the shelf printed 22 and
not one of them predated the story** — the half of T-007-05's criterion nobody noticed was failing.
It now passes: 27 ≥ 20, and five ≥ four predate S-007.

### Every counter, before and after

```
counter              before  after  stated  delta
air-fryer-and-pot        21     21      21   —
bakery                  107    107     107   —
bowl-shop               103    103     103   —
cha-chaan-teng           22     27      27   +5
curry-house              47     47      47   —
deli                     62     62      62   —
dim-sum-counter          30     30      30   —
diner                    77     77      77   —
instant-pot              25     25      25   —
japanese-home            38     38      38   —
meat-and-three           53     53      53   —
one-pot                  73     73      73   —
panaderia                30     30      30   —
pho-and-banh-mi          18     18      18   —
pizzeria                 32     32      32   —
ramen-shop               27     27      27   —
shawarma-counter         44     44      44   —
slow-cooker              20     20      20   —
smokehouse               21     21      21   —
takeout-counter          20     20      20   —
taqueria                 34     34      34   —
thai-kitchen             21     21      21   —
```

One counter moved, and it is the one that was meant to. `stated` is the number printed in each
page's header; it equals the rendered count on all 22.

### The check, over all twenty-two

```
  ok   Bakery                    8 sections, 107 listed, 107 printed, count 107
  ok   Panadería                 5 sections,  30 listed,  30 printed, count 30
  ok   Taquería                  6 sections,  34 listed,  34 printed, count 34
  ok   Dim Sum Counter           7 sections,  30 listed,  30 printed, count 30
  ok   Takeout Counter          11 sections,  20 listed,  20 printed, count 20
  ok   Phở & Bánh Mì             6 sections,  18 listed,  18 printed, count 18
  ok   Ramen Shop                7 sections,  27 listed,  27 printed, count 27
  ok   Curry House               9 sections,  47 listed,  47 printed, count 47
  ok   Thai Kitchen              7 sections,  21 listed,  21 printed, count 21
  ok   Shawarma Counter         10 sections,  44 listed,  44 printed, count 44
  ok   Pizzeria                  9 sections,  32 listed,  32 printed, count 32
  ok   Deli                     11 sections,  62 listed,  62 printed, count 62
  ok   Diner                     9 sections,  77 listed,  77 printed, count 77
  ok   Smokehouse                6 sections,  21 listed,  21 printed, count 21
  ok   Meat and Three            7 sections,  53 listed,  53 printed, count 53
  ok   The Bowl Shop             6 sections, 103 listed, 103 printed, count 103
  ok   Instant Pot               5 sections,  25 listed,  25 printed, count 25
  ok   One Pot                   5 sections,  73 listed,  73 printed, count 73
  ok   Japanese Home Cooking     6 sections,  38 listed,  38 printed, count 38
  ok   The Slow Cooker           3 sections,  20 listed,  20 printed, count 20
  ok   Cha Chaan Teng            5 sections,  27 listed,  27 printed, count 27
  ok   The Air Fryer & the Pot   1 sections,   0 listed,  21 printed, count 21

22 counter(s): 909 slug(s) listed, 930 printed.
every listed slug prints under the heading it was listed under.
```

`The Air Fryer & the Pot` lists 0 and prints 21 in `Also`: its five section titles are
deliberately empty in `docs/gaps/air-fryer-and-pot.md` pending T-008-05, and all 21 recipes name
the counter on their own line. Listing fewer than you shelve is legitimate — `Also` exists for it.
Listing more is what this ticket ended.

## Test coverage

- **`src/lib/counters.test.ts`** — 11 cases. Synthetic fixtures for the failure modes (the real
  data is clean, so a data-driven test could never reach the throw), plus two over the real
  generated collection so `vitest` guards the shipped data before `astro build` reaches it. The
  throw cases assert on message **content**, not just that it throws: "fails a check *by name*" is
  the criterion.
- **`scripts/check-menus.mjs`** — the integration half, over the built HTML.
- Full suite: 21 files, **1229 tests**, all passing.

### Gaps, honestly

1. **The heading assertion cannot fail from data alone.** `check-menus.mjs` compares
   *listed-under* to *printed-under*, and both sides derive from `counters.json`, so it fires only
   if the renderer or `menuFor` deviates from the data. That is a real regression guard on the
   template, but it is not exercised by any negative control — the two controls I ran cover the
   drop (control A) and the missing build (control B).
2. **No test pins the built page's shape** that `check-menus.mjs` parses
   (`<section class="menu-section">`, `<h2>`, `data-slug`, `<p class="count">`). If
   `src/pages/menu/[counter].astro` is restyled, the checker could start reading zero sections
   everywhere and still exit 0 on counters that list nothing. It would fail loudly on the 21
   counters that do list slugs, so this is a soft edge rather than a hole.
3. **`principalIngredients`** got one test because it was untested and sits in the same file; it is
   not part of this ticket's change.

## Open concerns for a human

None block completion. All four are stale prose in files outside this ticket's permitted set.

1. **`docs/gaps/cha-chaan-teng.md`** §*What this board borrows* is now partly wrong: "a borrowed
   slug is recorded in this file and dropped from the page", "silently, with nothing failing", "the
   counter prints 22 rather than 27", and the five *What happened → listed, not rendering* cells.
   All five are now shelved and rendering; the counter prints 27. **Its `## What it has` block is
   still correct**, which is what `menu-sections.mjs` reads, so nothing is broken — only the prose.
2. **`docs/gaps/README.md:155-157`** — "Two counters list a slug they do not shelve … `node
   scripts/menu-sections.mjs` names both every run." Neither half holds now. It was already half
   wrong: the script only ever named Cha Chaan Teng's five, because One Pot's four existed solely
   in `counters.json` and never in `one-pot.md`. That is exactly why they survived two stories.
3. **`docs/gaps/one-pot.md`** *Left open* asks a future ticket to remove the four inert slugs. Done
   here; the note can be struck. Separately, its `## What it has` block has drifted — it still
   shows 68 and omits the five `Quick soups that go with dinner` S-007 moved over from The Soup
   Pot, so `menu-sections.mjs` reports them as *unplaced* every run.
4. **`T-003-06` line 26 and `T-008-05` line 38** both state the borrowing doctrine as fact. T-003-06
   is archived work. **T-008-05 is open and unstarted**, and its sentence — "this shelf borrows its
   entire pressure-cooker half" — is already contradicted by its own gap page (*"Measured, the
   borrowing is 0%"*, *"This shelf cannot borrow"*) and by the 21 `air-fryer-*.cook` files that
   already name the counter. Whoever picks it up should read `docs/gaps/air-fryer-and-pot.md` over
   the ticket's line.

### One thing deliberately not fixed

`node scripts/menu-sections.mjs --write` still does **not** round-trip `counters.json`. Three
causes, all pre-existing: it drops all 11 hand-written `notes` blocks (its header comment says so);
`docs/gaps/one-pot.md` has drifted (item 3 above); and `docs/gaps/air-fryer-and-pot.md` holds five
deliberately empty titles and warns in writing against running `--write` against it. Two of the
three live in `docs/gaps/**`, outside this ticket, so fixing only the first would leave a
half-closed gap that reads as closed. The dry run — the form the acceptance criterion names — does
round-trip byte for byte, verified by sha256. Reported rather than half-fixed.

## Handoff, in one line

`menuFor` no longer eats a slug it cannot place; `npm run verify` ends with a check that reads the
built pages back and says so for all twenty-two counters.
