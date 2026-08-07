# T-007-06 — Progress

All four planned steps done. `npm run verify` exits 0. No deviations from `plan.md`.

| Step | Commit | State |
| --- | --- | --- |
| 0 — before-half recorded | — | done |
| 1 — make the data honest | `8af004f` | done |
| 2 — end the silent drop, with tests | `675f22b` | done |
| 3 — the check, wired into `verify` | `7a4af33` | done |
| 4 — say what the code does | `740fabd` | done |

---

## Step 0 — the before-half

`npm run build` at `7ba2ce5`, item count read off `data-slug` in each `dist/menu/*/index.html`:

```
air-fryer-and-pot 21   bakery 107   bowl-shop 103   cha-chaan-teng 22   curry-house 47
deli 62   dim-sum-counter 30   diner 77   instant-pot 25   japanese-home 38
meat-and-three 53   one-pot 73   panaderia 30   pho-and-banh-mi 18   pizzeria 32
ramen-shop 27   shawarma-counter 44   slow-cooker 20   smokehouse 21   takeout-counter 20
taqueria 34   thai-kitchen 21
```

`shasum -a 256 src/data/counters.json` → `268d8547…f7cd`.
`node scripts/menu-sections.mjs` → `3 counter(s) need a look.`

The nine-slug scan, run before anything was edited:

```
One Pot (4):        general-tsos-chicken · orange-chicken · sesame-chicken · sweet-and-sour-pork
                    all four shelved at Takeout Counter
Cha Chaan Teng (5): pineapple-bun · egg-custard-tart · beef-chow-fun · char-siu · club-sandwich
TOTAL dropped = 9 · slugs naming no recipe at all = 0
```

**Nine is the real number.** Every one is a live recipe at another shelf, not a typo.

---

## Step 1 — make the data honest (`8af004f`)

- `src/data/counters.json`, One Pot / `Skillet dinners`: 16 → 12 items. Removed
  `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork`. The section
  is now identical to `docs/gaps/one-pot.md`'s. Edited by hand, **not** with
  `menu-sections.mjs --write` (which would drop all 11 `notes` blocks).
- Five `.cook` files: `Cha Chaan Teng` **appended** to `>> counters:`. Appended, not prepended —
  `src/pages/[slug].astro:38` reads `counters[0]` as the recipe's home counter.

```
pineapple-bun.cook     Bakery, Dim Sum Counter, Cha Chaan Teng
egg-custard-tart.cook  Dim Sum Counter, Bakery, Cha Chaan Teng
beef-chow-fun.cook     Dim Sum Counter, Cha Chaan Teng
char-siu.cook          Dim Sum Counter, Takeout Counter, Phở & Bánh Mì, The Bowl Shop, Cha Chaan Teng
club-sandwich.cook     Diner, Deli, Cha Chaan Teng
```

Verified: `npm run check` green (685 files draw a table); `npm run recipes` → 685 parsed, **685
counters named, 0 inferred**; the nine-slug scan → **TOTAL dropped = 0**; JSON shape preserved
(`JSON.parse` → `stringify(…, 2)` + `\n` equals the file byte for byte).

---

## Step 2 — end the silent drop (`675f22b`)

`src/lib/counters.ts` — `menuFor`'s sectioned branch resolves and collects instead of
`.filter(Boolean)`, then throws once with every offender named. Membership is still decided
against `mine`; the *diagnostic* looks the slug up in `all`, so the message can say where the
recipe actually is. The doc comment now states the rule.

`src/lib/counters.test.ts` — new, 11 cases: section order preserved; the throw names the counter,
the heading and the slug; the throw says where the recipe is shelved; all offenders in one throw;
an unknown slug reads *no recipe has that slug*; the `Also` sweep; an empty section dropped with
`count` still equal to the items printed; the category fallback path; and two over the real
collection (`menus(all)` does not throw, and every open counter's `count` equals its item total).

### Negative control — the drop is over

`orange-chicken` put back into One Pot / `Skillet dinners`, then `npm run build`:

```
One Pot lists 1 recipe(s) that do not name this counter:
  "Skillet dinners" — orange-chicken (shelved at Takeout Counter)
A section orders what a shelf already holds; it cannot put a recipe on one.
Either add "One Pot" to that file's >> counters: line, or drop the slug
from src/data/counters.json. docs/knowledge/counters.md#sections says why.
```

Build fails. Reverted. `npx vitest run` → 21 files, 1229 tests, all green.

---

## Step 3 — the check (`7a4af33`)

`scripts/check-menus.mjs` (new) reads `src/data/counters.json` and the built
`dist/menu/*/index.html`, and asks three questions per counter: does every listed slug print at
all; does it print under the heading it was listed under; does the header's count equal the number
of items below it. It reads the built HTML rather than calling `menuFor`, because a checker that
runs the code under test agrees with the bug.

`package.json` — `verify` gains `&& node scripts/check-menus.mjs`, after `astro build`.

### Negative control A — it catches what nothing caught

The historical bug reconstructed: `menuFor` reverted to `.filter(Boolean)` **and**
`orange-chicken` put back. `npm run build` **succeeds** — 710 pages, no warning, exactly as it did
for two stories. Then:

```
  FAIL One Pot                   5 sections,  74 listed,  73 printed, count 73
         listed but not printed: orange-chicken
1 counter(s) do not print what they list.
exit 1
```

Both files restored (`git diff --stat` empty afterwards).

### Negative control B — it cannot pass vacuously

```
$ rm -rf dist && node scripts/check-menus.mjs
no dist/menu — run `npm run build` first.
exit 1
```

---

## Step 4 — say what the code does (`740fabd`)

- `docs/knowledge/counters.md` — new `### Sections` block after the `categories`-fallback
  paragraph: what `sections` is, the rule (*a section orders what a shelf already holds; it cannot
  put a recipe on one*), what happens when the two disagree, how to list a dish on a second shelf,
  and the history in one paragraph. The file previously said **nothing** about `sections`.
- `src/data/counters.json` header comment — the same rule in one sentence, in the file's voice,
  naming both `menuFor`'s throw and `scripts/check-menus.mjs`.

### Round-trip

```
$ shasum -a 256 src/data/counters.json
e87366f4f8a49ad6730fe124effa1b9270764e7024a25a0e680dada2cb65c0ef
$ node scripts/menu-sections.mjs   # exit 0
$ shasum -a 256 src/data/counters.json
e87366f4f8a49ad6730fe124effa1b9270764e7024a25a0e680dada2cb65c0ef
```

Byte for byte. The script's own report is down from **3 counters need a look** to **2**: the
*listed but not shelved here → pineapple-bun, egg-custard-tart, beef-chow-fun, char-siu,
club-sandwich* line is gone. The two remaining are `docs/gaps/**` drift outside this ticket
(see `review.md`).

---

## Deviations from the plan

One, and it made a test stronger rather than weaker. `plan.md` step 2 listed a `menus()` case
asserting that a counter with nothing on it is left out. Written against a one-recipe fixture it
threw — correctly, because `menus()` reads the real `counters.json` and every real counter lists
slugs that fixture does not contain. `menuFor` needs the whole collection; that is not a bug, it
is the same "only one place sees the whole collection at once" constraint
`scripts/parse-recipes.mjs:104` already names. Replaced with two cases over the real generated
collection, which makes `vitest` an early guard on the shipped data — it now fails before
`astro build` gets there.
