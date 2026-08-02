# T-002-08 — Plan

Ordered steps, each verifiable on its own. The pipeline in `structure.md` §2 fixes the order:
membership → reparse → gap notes → fold → aisles → build.

---

## Step 0 — Baseline, before anything moves

Record what "unchanged" means, so §3's assertion about the other 18 counters is checkable rather
than asserted.

```
node scripts/menu-sections.mjs                  > /tmp/sections-before.txt
cp src/data/counters.json                         /tmp/counters-before.json
npx vitest run                                  > /tmp/tests-before.txt   # 824 pass, 1 fail
python3 …aisle-map…                             > /tmp/aisles-before.txt  # 1082 name→slug rows
```

**Verify:** the aisle map has 1082 rows and 37 non-water `other`s. The section report ends
`6 counter(s) need a look` — the three of mine and T-003-06's three.

---

## Step 1 — One Pot membership (58 `.cook` files)

Append `, One Pot` to the `>> counters:` line of each slug in `structure.md` §4.1. Scripted, one
regex on one line, but **not blind**: the script refuses a file whose `>> counters:` line is
missing or already names One Pot, and prints the before/after line for every file so the diff is
readable.

**Verify:**

```
node scripts/check-recipes.mjs           → all 658 file(s) draw a table
npm run recipes                          → 658 named, 0 inferred, no error
git diff --stat                          → 58 files, 58 insertions, 58 deletions
git diff -U0 | grep -c '^[+-]>> counters:'   → 116   (nothing but counters lines moved)
```

and in the built collection: **72 recipes name One Pot**, of which 58 predate this story.

**Commit** (`lisa commit-ticket`, 58 exact paths): *Shelve the pot that is the only pot to wash*.

---

## Step 2 — The Bowl Shop membership (61 further `.cook` files)

Same mechanism, `, The Bowl Shop`, over `structure.md` §4.2. Six of the 119 files were already
touched in step 1 and get their second name here.

**Verify:** identical checks; **103 recipes name The Bowl Shop**, and `git diff` since step 1
shows only `>> counters:` lines.

**Commit**: *Put the drawer of dressings on the counter it was always for*.

---

## Step 3 — The three gap notes, and fold them in

Edit `docs/gaps/one-pot.md`, `bowl-shop.md`, `instant-pot.md` per `structure.md` §6: heading
renamed, the preamble paragraph about the rename deleted, `**Also here.**` deleted, lists
curated, opening "0 recipes" line replaced with the real count.

Then:

```
node scripts/menu-sections.mjs            # dry run — READ IT
node scripts/menu-sections.mjs --write
```

**Verify, in this order:**

1. The dry run reports the three counters with the section titles and counts of
   `structure.md` §3 and **no** `unplaced ->` or `listed but not shelved here ->` lines for them.
2. `3 counter(s) need a look` — down from 6, and the three remaining are T-003-06's, each
   `gap note has no "What it has" block`.
3. `diff /tmp/counters-before.json src/data/counters.json` touches **only** the `bowl-shop`,
   `instant-pot` and `one-pot` blocks. The 15 old counters and T-003-06's three are byte-identical.
4. `python3` over the written JSON: no section titled `Also here` on the three; no section with
   zero items; every slug resolves to a real recipe **and** names the counter (this is the check
   `menuFor` performs at render time, run early).

**Commit**: notes + `src/data/counters.json` together — they must never diverge.

---

## Step 4 — Aisles

Add the patterns of `structure.md` §7, one destination aisle at a time, re-running the map after
each group.

**Verify — the real risk is theft, not coverage:**

```
python3 …aisle-map… > /tmp/aisles-after.txt
diff /tmp/aisles-before.txt /tmp/aisles-after.txt
```

Every line in the diff must be `other → <real aisle>`. **A name that moves from one real aisle to
another real aisle is a regression** — that is the `"pepper"` in Produce orphaning
`green bell pepper` failure the ticket names — and the pattern that caused it comes back out or
gets more words.

```
npx vitest run   → 8 files, 825 tests, 0 failures
```

The coverage test needs `< 2%` of 1082 = at most 21 unplaced. Target is 3 (the skewers and the
wood), not 21.

**Commit**: *Give the shelf's new ingredients an aisle to be found in*.

---

## Step 5 — Build, and look at the three pages

```
npm run build
```

**Verify:**

- exit 0, and `/menu/bowl-shop/`, `/menu/instant-pot/`, `/menu/one-pot/` are all in the page list.
- Parse the three built HTML files and assert, per page: the `<h2>` list equals the section
  titles in `counters.json` order; **no `<h2>` reads `Also` or `Also here`**; the item count in
  `<p class="count">` equals the sum of the sections; every `data-slug` resolves.

This is the acceptance criterion that cannot be checked any other way — criterion 1 is about what
renders, and `menuFor` drops sections silently.

**No commit** — the build writes only to `dist/`, which is gitignored.

---

## Step 6 — `npm run verify`, end to end

`npm run check && npm run recipes && vitest run && astro build`. The single command a reviewer
will run. It must be green with no caveat.

---

## Testing strategy

**No new unit tests.** This ticket changes data, not code, and the repository already has the
harness for data:

| Risk | Guard | When it runs |
| --- | --- | --- |
| A `>> counters:` line broken by the edit | `parse-recipes.mjs` throws on an unknown counter | step 1, 2 |
| A recipe file damaged beyond its metadata line | `check-recipes.mjs`, `layout.test.ts` | step 1, 2, 6 |
| A section slug that is not a recipe | `menu-sections.mjs` (`listed but not shelved here`) | step 3 |
| A member with no section → an `Also` on the page | `menu-sections.mjs` (`unplaced ->`) | step 3 |
| An aisle pattern stealing from another aisle | the before/after map diff | step 4 |
| Aisle coverage | `shopping.test.ts:163` | step 4, 6 |
| A page that does not render | `astro build` + the HTML assertions | step 5 |

**The three gaps no test closes**, and how each is held:

1. **Whether a dish is really one pot.** Held by reading. `cookware` is evidence and it missed
   four of the eight files that boil something in separate water — those were caught by reading
   the steps, and each is named in `progress.md`.
2. **Whether a dressing belongs on a bowl board.** Held by the *"would this be ladled last over a
   finished bowl?"* test, and every exclusion is listed with its reason.
3. **Whether the menus read as menus.** Held by looking at the three built pages, which is what
   the ticket's §3 asks for in those words.

---

## Rollback

Each step is one commit over a disjoint path set. Step 1 and 2 are `>> counters:` lines only —
`git revert` on either leaves the recipes intact and drops a shelf back to what T-002-0x wrote.
Step 3 is the only commit where two files must move together.

---

## The deviation this plan carries, stated once more before executing

119 `.cook` files are edited, against an acceptance criterion that says only
`src/data/counters.json` and `src/data/aisles.json` are modified. The argument is in
`design.md` §2 — T-002-01's handoff instructs it, commit `a41f570` is the precedent, and
criteria 2 and 3 are unreachable without it. Every edit is one metadata line; no recipe content
moves. It is restated in `review.md` with the full file list so a reviewer can act on it.
