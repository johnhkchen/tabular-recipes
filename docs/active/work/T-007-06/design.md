# T-007-06 — Design

## The decision

**Borrowing is not a thing.** A slug listed in a `counters.json` section that does not name that
counter on its own `>> counters:` line **fails the build, by name**. Shelf membership lives in the
`.cook` file, in one place, and a section list is an *ordering* of what the shelf already holds —
never a way onto it.

The rejected option — *borrowing works*, `menuFor` resolving listed slugs against `all` — is argued
below. It is not close, and the reason is not taste.

---

## Why borrowing cannot work here

### 1. It would make the site contradict itself, in files this ticket may not touch

`recipe.counters` is the answer the rest of the site gives to "which counters is this on"
(research §4):

- `src/pages/[slug].astro:77-81` prints the counter links under a recipe's table.
- `src/pages/[slug].astro:38` picks `counters[0]` as the recipe's home counter.
- `src/pages/search.json.ts:55,62` puts `recipe.counters` in the search index; the front page's
  cards and dials read it back (`src/pages/index.astro:382`).

If `menuFor` resolved against `all`, `pineapple-bun` would print on the Cha Chaan Teng menu while
`pineapple-bun`'s own page listed only Bakery and Dim Sum Counter, and a search for Cha Chaan Teng
would not return it. Three surfaces disagreeing about one fact is a worse bug than the one being
fixed, and it would be **silent in exactly the same way**.

Making them agree means editing `[slug].astro`, `search.json.ts` and `index.astro`. **None of the
three is in this ticket's modifiable set.** So *borrowing works* is not implementable here as
anything but a half-change.

### 2. Nothing was ever built on it

All 904 shelf assignments across 22 counters came from `>> counters:` lines. The two exceptions are
the nine dropped slugs, and both are drift rather than design:

- One Pot's four are stale data that `docs/gaps/one-pot.md` **already asked to be deleted**
  (research §6). Making borrowing work resurrects, on the One Pot menu, exactly the four deep-fried
  wok dishes that page spent a paragraph arguing off it.
- Cha Chaan Teng's five were listed *knowing they would not render*, and
  `docs/gaps/cha-chaan-teng.md` names the remedy as "adding `Cha Chaan Teng` to five
  `>> counters:` lines" (research §7). The gap note's own author designed for this option.

### 3. The one live ticket that assumes borrowing is working from a superseded number

`T-008-05` says the Air Fryer shelf "borrows its entire pressure-cooker half". Its own gap page
measured that borrowing at **0%** and says "This shelf cannot borrow"; 21 `air-fryer-*.cook` files
already exist and every one names the counter (research §9). Choosing *borrowing is not a thing*
costs T-008-05 nothing real.

### 4. The mechanism already in the codebase is a throw, not a fallback

`scripts/parse-recipes.mjs:104-140` already refuses a `notes` entry pointing at a slug the section
does not shelve, and says why: *"menuFor drops the item and the note goes with it, silently."* The
guard exists for the annotation. Extending it to the item itself is the smaller, consistent move.
`scripts/menu-sections.mjs:112` likewise already counts *listed but not shelved here* as a problem.

### What it costs

Stated plainly, because it is a real cost:

- **A recipe cannot appear on a shelf without editing its file.** Cross-shelf listing needs a
  one-line edit per recipe, not a one-line edit per counter. `char-siu` now carries five counters.
- **`docs/gaps/cha-chaan-teng.md` becomes partly stale** ("the counter prints 22 rather than 27";
  "silently, with nothing failing"). It is not in the modifiable set; flagged for its owner.
- **`docs/gaps/README.md:155-157`'s tally of borrows becomes obsolete.** Same constraint.
- The doctrine sentence in `T-003-06` and `T-008-05` is now wrong. Tickets are not modifiable.

None of these is a behaviour regression. All are stale prose in files another owner holds.

---

## The four changes, and the order they must land in

### A. Make the data honest, before the code can fail on it

**One Pot** — delete `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`,
`sweet-and-sour-pork` from `Skillet dinners` in `src/data/counters.json`. This is what
`one-pot.md`'s *Left open* asked for, it matches that page's `What it has` block exactly, and it is
the only way the acceptance criterion "*do not reappear on One Pot*" and "*no slug is silently
dropped*" hold at once. One Pot's rendered count is unaffected — those four never rendered.

**Cha Chaan Teng** — append `Cha Chaan Teng` to the `>> counters:` line of the five files the gap
note ruled *shelve as is*:

| File | before | after |
| --- | --- | --- |
| `recipes/breads/pineapple-bun.cook` | Bakery, Dim Sum Counter | + Cha Chaan Teng |
| `recipes/custards-and-puddings/egg-custard-tart.cook` | Dim Sum Counter, Bakery | + Cha Chaan Teng |
| `recipes/noodles/beef-chow-fun.cook` | Dim Sum Counter | + Cha Chaan Teng |
| `recipes/stews-and-braises/char-siu.cook` | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì, The Bowl Shop | + Cha Chaan Teng |
| `recipes/sandwiches-and-rolls/club-sandwich.cook` | Diner, Deli | + Cha Chaan Teng |

**Appended, never prepended**: `[slug].astro:38` reads `counters[0]` as the recipe's home counter,
and reordering would silently move five recipes' home shelf. Appending changes nothing else — the
five already sit in the right sections in `counters.json`, so Cha Chaan Teng goes 22 → 27 with no
`Also` section, and no other counter's membership changes.

Rejected alternative for Cha Chaan Teng: *delete the five listings instead*. It satisfies "no
silent drop" but fails T-007-05's criterion outright — the shelf would print 22 with nothing
predating S-007, which is the half of that criterion the ticket says nobody noticed was failing.

### B. End the silent drop in `menuFor`

`src/lib/counters.ts` — resolve section slugs against `mine` as now, but **collect the misses and
throw** instead of `.filter(Boolean)`. The error names the counter, the section title, each
offending slug and where that recipe actually is:

```
Cha Chaan Teng / "Toast and the bun case" lists 1 recipe that does not name this counter:
  pineapple-bun — shelved at Bakery, Dim Sum Counter
A section orders what a shelf already holds; it cannot put a recipe on one.
Add "Cha Chaan Teng" to that file's >> counters: line, or remove the slug from
src/data/counters.json. docs/knowledge/counters.md says why.
```

Why a throw inside `menuFor` rather than a separate validator:

- It is the exact line that dropped things. Anything else leaves the drop reachable.
- `menuFor` is called from `index.astro` and `menu/[counter].astro`, both over the full recipe
  list, so the throw fails `astro build` — the criterion's *"fails a check by name"*.
- It fails at the moment of the mistake, in the function whose doc comment will now say so.

Considered and rejected: **returning a `dropped: string[]` on the `Menu`** and letting callers
decide. Callers are `.astro` files this ticket may not modify, so nobody would read it, and it
recreates the silent drop with extra steps.

`count` stays `mine.length`. Under this decision `mine` *is* the shelf, so the number the page
prints and the number of items it lists are the same fact — and after (A) that is true again.

### C. A check that compares the section lists to what the built site prints

New `scripts/check-menus.mjs`, appended to `npm run verify` **after** `astro build`:

```
"verify": "npm run check && npm run recipes && vitest run && astro build && node scripts/check-menus.mjs"
```

It reads `src/data/counters.json` and `dist/menu/<slug>/index.html` and asserts, per counter, that
**every section slug prints under its own heading** — not merely somewhere on the page. It parses
the built HTML into `heading → [data-slug…]` and compares three ways:

1. every listed slug appears on the page (catches a drop of any kind, including a future one);
2. it appears under the *heading it was listed under* (catches a slug sliding into `Also`, which is
   the failure `menuFor`'s throw cannot see because `Also` is legitimate);
3. the page's stated `N recipes` equals the number of items it prints (catches a `count`/render
   divergence — the property that let this bug hide for two stories).

It prints one line per counter for all 22 and a total, then exits 1 if anything failed. Reading the
built HTML, rather than re-running `menuFor`, is deliberate: a checker that calls the code under
test agrees with the bug. `scripts/check-overflow.mjs` and `check-touch.mjs` are the precedent for
a post-build `dist/`-reading check in this repo.

Rejected: **folding it into `scripts/check-recipes.mjs`**. That script runs first in `verify`,
before the build exists, and is explicitly per-file ("runs on whichever files you name"), so it
cannot answer a whole-collection question. Rejected: **a vitest test**, for the same reason — it
runs before `astro build` and would have to re-derive the page rather than read it.

### D. Say what the code does, in the two docs this ticket owns

Neither `docs/knowledge/counters.md` nor the `counters.json` header currently describes how a
section slug resolves at all (research §8). The fix is an addition, not a correction:

- `docs/knowledge/counters.md` — a short **Sections** subsection under the existing fallback
  paragraph: what `sections` is, that membership is the `>> counters:` line and only that, that a
  listed slug which does not name the counter fails the build, and that cross-shelf listing is a
  one-line edit to the recipe.
- `src/data/counters.json` header comment — one sentence in the same place, in the file's own
  voice, plus the pointer to the check.

### What is deliberately not changed

- **`scripts/menu-sections.mjs`** — unchanged. It derives sections from `docs/gaps/*.md` and
  already reports *listed but not shelved here*; under this decision that report is a warning
  ahead of a build failure, which is the right shape. Its `--write` note-dropping and the One
  Pot / Air Fryer gap-note drift are pre-existing and live in files this ticket may not edit
  (research §5); recorded as open concerns rather than half-fixed here.
- **`count` semantics**, the `Also` fallback, and the category fallback path — all untouched.
