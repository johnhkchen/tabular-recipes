# T-003-06 — Review

Three shelves that rendered as one undifferentiated block each now render as menus:
**Japanese Home Cooking 38**, **The Soup Pot 24**, **The Slow Cooker 20**. `npm run verify` is
green end to end — 658 files draw a table, 825 tests pass, 682 pages build. Three commits, all
through `lisa commit-ticket` with exact `--include` paths.

**One acceptance criterion is knowingly not met**, and that is §1.

---

## 1. Read this first: criterion 8 is not met

> *Only `src/data/counters.json` and `src/data/aisles.json` are modified.*

**Thirteen `.cook` files were also modified — one metadata line each.** Nothing else in any of
them changed:

```
$ git diff -U0 ed98111..HEAD -- recipes/ | grep '^[+-][^+-]' | grep -vc '^[+-]>> counters:'
0
$ git diff --stat ed98111..HEAD -- recipes/ | tail -1
13 files changed, 13 insertions(+), 13 deletions(-)
```

Every edit is of this shape:

```
- >> counters: Ramen Shop
+ >> counters: Ramen Shop, Japanese Home Cooking
```

### Why, in four sentences

`src/lib/counters.ts:74` builds a menu from `all.filter(r => r.counters.includes(counter.name))`
and then looks section items up **inside that set**, so a slug listed in `counters.json` that does
not name the counter is silently dropped from the page. The ticket's §1 describes the opposite —
*"A section may list a recipe that never names the counter — that is how a shelf borrows"* — and
its §2 asks for recipes on two boards, which in this data model **is** a `>> counters:` edit and
nothing else. So criteria 2 and 3 (which name `dashi`, `miso-soup` and `congee` by slug) cannot
hold at the same time as criterion 8. The concurrency argument that criterion 8 exists to make has
expired: T-003-03, T-003-04 and T-003-05 are sealed, T-002-09 sealed while this ticket ran without
touching either file, and T-003-07 states *"Nothing runs in parallel with this."*

### The evidence that this is what was planned, not a shortcut

1. **`docs/active/work/T-002-08/review.md` §5.7**, written for this ticket by name: *"T-003-06 will
   hit exactly the wall in §1. Its ticket carries the same sentence … and it needs `dashi`,
   `miso-soup` and `congee` on shelves they do not name. It should read this document before it
   starts."* It was read before this ticket started.
2. **T-002-08 made the same call on this branch and it was admitted** — 119 `.cook` files, one
   `>> counters:` line each, commits `abba20f` and `9b79c4e`. Deciding it differently now would
   leave two of five S-002/S-003 shelves built one way and three the other.
3. **The writer tickets handed the edit over rather than making it.**
   `T-003-04/progress.md`: *"None of the ten needs an edit from this ticket — they need a
   `>> counters:` line, which is T-003-06's."* `T-003-03/progress.md` says the same of `congee`.
4. **The invariant the data holds.** Across every populated counter, every listed slug names its
   counter and every naming recipe is listed — this ticket's probe confirms zero exceptions on all
   three new shelves. `scripts/menu-sections.mjs` reports any other state as an error
   (`listed but not shelved here`).

### The alternatives, and why not

- **Leave the borrowings listed and let them drop.** `counters.json` would claim `dashi` is on the
  shelf while the page did not show it. A lie in the file whose only job is to say what is on a
  shelf.
- **Change `menuFor()` to resolve section items against the whole collection.** One file instead
  of thirteen, but it is a `src/lib/` change — *further* outside this ticket than a metadata line —
  it changes how all 21 counters render, and it makes the shelving half-true: `menu.count`, the
  front page, `search.json` and the recipe's own page all read `recipe.counters`, so a borrowed
  `dashi` would appear on the Japanese Home board while its own page still said "Ramen Shop".

**If a reviewer disagrees**, `git revert db18740` removes every `.cook` edit and nothing else.
Japanese Home then reads 28 without `dashi` or `miso-soup`, The Soup Pot reads 21 without `congee`,
and criteria 2 and 3 fail. That is the trade, stated plainly.

---

## 2. What changed

| Commit | Message | Files |
| --- | --- | --- |
| `db18740` | Put the home dishes on the second board they were always cooked on | 13 `.cook` |
| `af175c7` | Shelve the home wing in the sections its boards would print | `src/data/counters.json` |
| `4681d37` | Take four products back off the aisle a bare word had put them on | `src/data/aisles.json` |

15 files, +129 −41. Created: none. Deleted: none. `src/generated/recipes.json` was regenerated
repeatedly and committed never.

**`counters.json` was hand-written, not regenerated.** T-002-08 produced it with
`scripts/menu-sections.mjs --write`, which reads each counter's `## What it has` block out of
`docs/gaps/<slug>.md`. Doing that here would have meant rewriting three gap notes — the notes carry
only the pre-existing dishes, not the 69 files the writer tickets added — and
`docs/active/tickets/T-003-07` §3 already owns that rewrite in its own words. Instead the file was
round-tripped through `json.dumps(f, indent=2, ensure_ascii=False) + "\n"` (asserted byte-identical
before any write) and only the three `sections` arrays replaced: five hunks, all above line 1664,
the other eighteen counters untouched. This survives a later `menu-sections.mjs --write` — the
script `continue`s past a counter whose note has no `## What it has` heading **before** it
reassigns `sections`.

**`docs/gaps/*` was not touched.** The three notes still head their block
`## What is already here` and still contain a paragraph saying T-003-06 renames it. T-003-07 §3
supersedes that paragraph. See §5.2.

---

## 3. Acceptance criteria, one by one

Read out of the built HTML where the criterion is about the page, and out of the data where it is
about the data.

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | All three counters populated, in menu order, **no "Also here" section renders** | `/menu/soup-pot/` 3 sections / 24 items, `/menu/japanese-home/` 6 / 38, `/menu/slow-cooker/` 3 / 20. The `<h2>` sequence equals the non-empty `counters.json` sections in order on all three; **no `<h2>` reads `Also` or `Also here`**; header count equals the `<li>` count. The literal `Also here` section was deleted from all three (§4a of `progress.md`) and the generated `Also` cannot appear because every member is placed |
| 2 | Japanese Home ≥ **25**, including `dashi` and `miso-soup`; artifact says which Ramen Shop recipes were added and which were left | **38.** Both present in *The soup and the rice*. Ten added / fifteen left / two left at the Bakery, tabulated with the gap note's argument for each in `progress.md` §3 |
| 3 | The Soup Pot ≥ **22**, including `congee` | **24.** `congee` and `congee-instant-pot` in *Congee and rice soups*, `egg-drop-soup` in 滾湯 |
| 4 | The Slow Cooker shelves every `kit: Slow Cooker` and **nothing else** | **20 = 20 = 20.** The set of files carrying `kit: Slow Cooker`, the set listed in its sections, and the set naming the counter are all the same 20. No `.cook` edit was needed for this shelf |
| 5 | Every slug in every section resolves to a real recipe | Twice over: the probe resolves all 82 listed slugs against `recipes.json` (0 unknown) **and** asserts each names its counter (0 dropped); then every `data-slug` in the three built pages has a page at `dist/<slug>/index.html` |
| 6 | Aisle-coverage test passes and `npx vitest run` is green | `3/1082` unplaced = 0.28 % against a 2 % ceiling; `Test Files 8 passed, Tests 825 passed` |
| 7 | `npm run build` succeeds and all three pages render | 682 pages; all three menus built and all three linked from the front page, which now lists 21 counters |
| 8 | Only the two data files modified | **Not met.** §1 |

---

## 4. Test coverage, and the three gaps no test closes

This ticket changes data, not code, so **no unit test was added and none is wanted** — a test
asserting that `nikujaga` is in 煮物 would be `counters.json` transcribed into TypeScript: it would
fail whenever the shelf was rearranged deliberately and pass whenever it was rearranged wrongly.
T-002-08 §4 reasoned the same way about the same file.

What ran:

| Risk | Guard | Result |
| --- | --- | --- |
| A `>> counters:` line broken by the edit | `parse-recipes.mjs` throws on an unknown counter | 658 parsed, `658 named, 0 inferred` |
| A recipe file damaged beyond its metadata line | `check-recipes.mjs`, `layout.test.ts` | `all 13 file(s) draw a table`; all 658 collection-wide |
| An edit that quietly moved a recipe off another board | all 21 counter memberships counted before and after | exactly two moved: Soup Pot +3, Japanese Home +10 |
| A section slug that is not a recipe | probe check 1 | 0 |
| A section slug that does not name its counter → silent drop | probe check 2 | 0 |
| A member in no section → a generated `Also` | probe check 3, then the built HTML | 0, and no `<h2>` reads `Also` |
| A JSON serialiser mismatch → a 1700-line noise diff | round-trip assertion before any write | identical |
| An aisle pattern stealing from another aisle | `aisleFor()` over all 1082 names, before vs after | **4 moved, all four intended**; nothing else |
| Aisle coverage | `shopping.test.ts:163` | 3/1082, unchanged from baseline |
| A page that does not render | `astro build` + HTML assertions | 682 pages, three menus asserted |

**Gap 1 — nothing in the repo catches the bug this ticket spent its Design phase on.** A slug
listed in `counters.json` that does not name its counter vanishes from the page with no error, no
warning and no failing test. It has now cost two tickets a full phase of analysis (T-002-08 §1,
this ticket's D1). The probe that catches it lives in a scratchpad and dies with this session.
**The fix is four lines in `collection.test.ts`** — for every counter with `sections`, assert every
listed slug is in `recipes.json` and names the counter — and it is a `src/` change this ticket may
not make. **Passed to T-003-07**, which may edit any file. §5.1.

**Gap 2 — whether a dish belongs on a home board.** Held by `docs/gaps/japanese-home.md`'s single
test (*is this an ordinary dinner, an event, or a component of something a restaurant sells?*),
applied unchanged to all 31 Japanese files, with the one place I would have decided differently
recorded rather than acted on (`progress.md` §3).

**Gap 3 — whether the shelves read as shelves.** Held by opening the three built pages, which is
what the ticket's §4 asks for in those words.

---

## 5. Open concerns, in the order a reviewer should weigh them

1. **The thirteen `.cook` edits.** §1. This is the one thing to decide.

2. **The three gap notes now describe a shelf that has moved on, and two documents disagree about
   who fixes them.** `docs/gaps/soup-pot.md`, `japanese-home.md` and `slow-cooker.md` each contain
   a paragraph saying *"T-003-06 renames this block to `## What it has`"*;
   `docs/active/tickets/T-003-07` §3 says *"Rewrite `docs/gaps/soup-pot.md`,
   `docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md` against the shelf as it now is"* and
   carries it as its own acceptance criterion. The later ticket was followed. The visible
   consequence: `node scripts/menu-sections.mjs` reports all three as *"no gap note"* / *"no
   `What it has` block"* until T-003-07 runs. Nothing in `npm run verify` runs that script.

3. **`The Soup Pot` dropped four slugs the gap note had parked in `Also here`.** `wonton-soup`,
   `hot-and-sour-soup`, `chicken-feet` and `chicken-broth` are not shelved anywhere new, because
   criterion 1 forbids the section that was going to hold them. The gap note argues against each of
   them in its own words, so the outcome matches what it believes — but a reviewer who reads
   "Also here" as *the fallback title only* would have shelved all four and had a 28-recipe Soup
   Pot. That is a four-line change to `counters.json` plus four `.cook` lines.

4. **`ajitama` is the one call I would have made differently.** The gap note keeps it at the Ramen
   Shop with `chashu` because *"they belong to the bowl."* A marinated egg is a 作り置き in the
   plainest sense — made Sunday, keeps a week, goes into a bentō. I applied the note as the ticket
   instructed and recorded the disagreement instead of acting on it. One line if a reviewer agrees
   with me.

5. **Two Slow Cooker sections have one item each and one has none.** `Beans and pulses` holds only
   `boston-baked-beans-slow-cooker` and `Whole birds and big cuts` only
   `soy-sauce-chicken-slow-cooker`, because T-003-05 deferred every bean and every stock to the
   Instant Pot on the gap file's own ranking. `Stocks` is kept in the data, empty and non-rendering,
   as the record that the shelf wants them. The page reads a little thin at the bottom; the honest
   fix is more recipes, not a rearranged menu.

6. **Four products were in the wrong aisle and are now right, but the dried-goods aisle is still
   incoherent.** The four fixed are in `progress.md` §4c. What was **not** touched: `dried Chinese
   yam`, `dried bok choy`, `goji berries` and `dried shiitake` resolve to `produce` while their
   packet-mates `job's tears`, `lily bulb`, `fox nut` and `adenophora root` resolve to `world`. So
   a shopper buying one 清補涼 packet is sent to two aisles. T-003-03 explicitly declared the
   produce four *"placed themselves correctly with no change needed"*, and overruling a sealed
   ticket's stated judgement on four names it looked at is beyond this ticket's §3. **Worth a
   decision by someone**: either a `herbalist` / `dried Chinese goods` aisle, or move the four.

7. **`rice-washing water` resolves to `dry-goods` and is not a thing you buy.** It is the water off
   rinsed rice, used as a soaking liquid in `kiriboshi-daikon`. It escapes the coverage test
   because the test excludes anything matching `/\bwater\b/`. It is a `staples.json` question, not
   an aisle one, and it is not this ticket's file.

8. **`src/lib/icons.ts` still does not know `pressure`, `natural` or `release`.** Carried from
   T-002-02 / T-002-03 through T-002-08 §5.4 and T-002-09. `icons.test.ts` is green because every
   ticket reworded its labels instead. Still an improvement request rather than a defect, and still
   a `src/lib/` change. **T-003-07's.**

---

## What a human should look at first

`/menu/japanese-home/` in a browser, specifically **Made ahead (作り置き)**. It is the section
where this ticket made the most judgement calls that no script can check: `teriyaki-sauce`,
`goma-dare` and `shichimi-togarashi` were placed there because the gap note calls them *"pantry,
not menu"* and gave them no real section of their own. If a bottle of teriyaki sauce sitting next
to `nikumiso` and `asazuke` reads as a menu item rather than as a pantry job, the section is doing
something the other five are not, and that is the one place on these three shelves where being
wrong looks exactly like being right.
