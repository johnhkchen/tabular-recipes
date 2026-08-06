# T-005-07 · Progress — read it all again

Five commits. The plan's four, plus one the plan did not foresee: check (d) found two sentences
printed on both a menu and a recipe page, and fixing them was two lines.

| # | Commit | What |
| --- | --- | --- |
| 1 | `ee79ac2` | Say which one to buy, and put the tonic word on the shelf — 17 notes in 13 files, + `counters.json` |
| 2 | `0637147` | Fail the build on a field that says too much — `CAPS_FAIL_BUILD = true` |
| 3 | `00f2947` | Script the measurement the story was written from — `scripts/measure-pages.mjs` |
| 3b | `dc2284d` | Keep the page counter a driver, not an import — dropped an `export` whose import had side effects |
| 4 | `7f531fc` | Say it on the menu or say it on the page, not both — the two check (d) findings |
| 5 | — | `docs/gaps/voice.md`, `docs/knowledge/voice.md` |

---

## Step 0 · Baseline

`git worktree add … 1ae1165` — the commit before `937ca8a`, the first S-005 commit.
`node scripts/parse-recipes.mjs` there gives **658 recipes in 27 categories, timers in 635,
pairings 760** — the same counts as HEAD, so the baseline is the same collection. Then a full
`astro build` into that worktree's `dist/`.

Every "before" number below is measured on that tree with the same tool as the "after".
Nothing is quoted from a prior ticket's review as though it were measured here.

*One incident worth recording: linking the worktree's `node_modules` at the repo's own left the
repository without one. Restored with `npm ci`; nothing under version control was touched, and
`npm run verify` passed afterwards.*

---

## Step 1 · The 17 ingredient notes

The field nobody owned. T-005-01 flagged it, T-005-05 and T-005-06 each recorded it and passed
it on, and this ticket's own text settles it: *fix what remains, or raise the cap with the
measurement that justifies it, and do not exempt.*

**All 17 cut, none exempted, no cap moved.** 500 characters over → 0. Every one keeps the
romanisation and how the thing arrives or is cut; what goes is what it does for the dish and
where the name comes from — the two entries in `voice.md`'s *what does not go here* column for
this field.

| File | Ingredient | Was | Now | The note now | Where the dropped clause went |
| --- | --- | ---: | ---: | --- | --- |
| `soups/apple-pear-pork-bone-soup` | apricot kernels | 129 | 79 | naam bak hang; sweet and bitter, about three to one — the bitter kind never raw | dropped: *goes in small* is the amount; *always cooked through* is *never raw* twice |
| `soups/dried-bok-choy-pork-lung-soup` | apricot kernels | 129 | 79 | *(same text)* | same |
| `soups/overlord-flower-soup` | apricot kernels | 129 | 79 | *(same text)* | same |
| `soups/green-radish-carrot-pork-bone-soup` | apricot kernels | 172 | 79 | *(same text)* | dropped: *the pairing is the point* is what it does for the dish |
| `soups/watercress-honey-date-soup` | apricot kernels | 172 | 79 | *(same text)* | same |
| `soups/century-egg-amaranth-soup` | century eggs | 121 | 67 | pei daan; shelled and quartered — they half-dissolve into the broth | already on the page: *they go in early* is step 2 |
| `soups/chinese-yam-goji-black-chicken-soup` | dried Chinese yam | 91 | 33 | 30 g; waai saan, sliced dried yam | **to the shelf** — 健脾 |
| `soups/crucian-carp-tofu-soup` | crucian carp | 101 | 75 | 560 g; zik jyu, scaled and gutted, dried inside and out — a wet fish sticks | dropped: *with paper*, *and tears* — detail on a failure the note still names |
| `soups/green-radish-carrot-pork-bone-soup` | dried duck gizzard | 83 | 57 | can san; a savoury note in a pot that is otherwise radish | dropped: the second half restated the first |
| `soups/old-cucumber-rice-bean-soup` | rice beans | 81 | 48 | cek siu dau; the small dark red ones, not adzuki | **to the shelf** — 祛濕 |
| `soups/seaweed-egg-drop-soup` | laver | 85 | 59 | 10 g; zi coi, the sheets torn up — they melt into the broth | dropped: *rather than sitting in it* is the same fact twice |
| `soups/sha-shen-yu-zhu-soup` | lean pork | 96 | 35 | 450 g; sau juk, in two whole pieces | **to the shelf** — the counter already says this pot is four things and no more |
| `soups/sha-shen-yu-zhu-soup` | Solomon's seal | 91 | 29 | 30 g; juk zuk, rhizome slices | **to the shelf** — 潤燥 |
| `soups/watercress-honey-date-soup` | watercress | 95 | 68 | 340 g; half the bunch, washed hard — it cooks down to almost nothing | dropped: *and that is the point* is comment |
| `soups/winter-melon-jobs-tears-soup` | toasted job's tears | 111 | 78 | suk ji mai; the toasted kind — both go in, and neither stands in for the other | dropped: *in for the roundness* is what it does for the dish |
| `soups/winter-melon-jobs-tears-soup` | dried scallops | 90 | 44 | jiu cyu; the soaking water goes in with them | dropped: the superlative; the instruction stays |
| `stews-and-braises/buri-daikon` | rice-washing water | 84 | 73 | 2 L; the cloudy water off rinsing rice, or 2 qt water with 1 Tbs raw rice | dropped: *stirred in* is implied |

**The one safety fact in the set survives.** Bitter apricot kernels must be cooked; *never raw*
is inside the 79-character replacement on all five files. Nothing else on the list carries one —
checked against T-005-04's table of 36, which names no ingredient note.

**The shelf note**, added to `The Soup Pot · Old-fire soups (老火湯)`, section-level, 110/120:

> Each dried thing goes in for a word — 潤 to moisten, 祛濕 to clear damp, 健脾 for the stomach,
> 潤燥 for a dry autumn.

The applier refused anything but the parenthetical: it anchors on `(before)`, requires the
ingredient's own `@name{` within 120 characters ahead of it, requires the before-text to appear
exactly once, and compares the file with every `(...)` blanked out on both sides before writing.
`git diff -U0 -- recipes/` is 17 hunks and every ingredient name, quantity and unit is
byte-identical across all of them.

```
npm run check      all 658 file(s) draw a table.   no over-cap report at all
git diff --numstat 13 .cook files, 1 or 2 lines each; counters.json +3 −0
npm run recipes    658 recipes, 27 categories, 760 pairings, 0 warnings
npm run verify     exit 0 — 9 test files, 833 tests, 682 pages
```

---

## Step 2 · The gate

`scripts/check-recipes.mjs:67`, `false` → `true`. The comment above it was rewritten from a
promise into a record, and the closing message's `true` branch now tells a writer what to do.
`CAPS` did not move — not one of the five numbers. `measure()` did not change. There is no skip
list and none was added.

**Proved in both directions, on a real file, after the flip:**

```
clean collection                    npm run check → exit 0
one note put back at 172/80         npm run check → exit 1
                                    "+ 92 ingredient note 172/80 …green-radish…"
                                    "Caps are enforced: this run fails."
restored                            npm run check → exit 0
```

---

## Step 3 · The measurement, scripted

`scripts/measure-pages.mjs`. The story's method existed only as prose; T-005-02, T-005-05 and
T-005-06 each rebuilt it in a throwaway under `.lisa/`, which is gitignored. It is now one
committed file, and `docs/gaps/voice.md` cites it so its numbers are re-runnable.

**Its only test is the one that matters, and it passes.** Run against the pre-story build it
reproduces the figures a person published before the script existed:

| | this script, on `1ae1165` | the story |
| --- | ---: | ---: |
| mean over 658 pages | **3487** | 3487 |
| median | **3376** | 3379 |
| max | **6219** `ching-bo-leung-soup` | 6223, same page |

The mean is exact; nothing is off by more than 4 characters in 6000. The wordiest ten comes out
as the Chinese soup shelf, which is what the story said it was.

---

## Step 4 · The six measurements

### 1 · Visible characters a page

| | before (`1ae1165`) | after | |
| --- | ---: | ---: | ---: |
| mean | 3487 | **2823** | −19% |
| median | 3376 | **2766** | −18% |
| max | 6219 | **4474** | −28% |
| min | 1825 | **1566** | |
| collection total | 2,294,301 | **1,857,209** | **−437,092** |

Against the story's stated start of **mean 3487 / median 3379 / max 6223**.

### 2 · The wordiest ten

| | before | after |
| --- | --- | --- |
| 1 | 6219 ching-bo-leung-soup | 4474 biryani |
| 2 | 6121 dried-bok-choy-pork-lung-soup | 4451 ching-bo-leung-soup |
| 3 | 5764 green-radish-carrot-pork-bone-soup | 4389 lo-mai-gai |
| 4 | 5726 watercress-honey-date-soup | 4275 harissa-chicken-bowl |
| 5 | 5655 biryani | 4244 bbq-tofu-bowl |
| 6 | 5641 gumbo | 4233 watercress-honey-date-soup |
| 7 | 5572 winter-melon-jobs-tears-soup | 4201 harvest-bowl |
| 8 | 5563 boston-baked-beans-slow-cooker | 4135 gyoza |
| 9 | 5528 overlord-flower-soup | 4088 sancocho |
| 10 | 5457 old-cucumber-rice-bean-soup | 4073 samosa |

**Seven of the old ten were the Chinese soup shelf; two of the new ten are.** The story said the
start list was almost entirely that shelf and it was right. What is at the top now is a long
recipe — `biryani` at 4474 is 23 ingredients and 8 operations, not an essay.

### 3 · The six chrome sentences — all zero

| Sentence | before | after |
| --- | ---: | ---: |
| "…so both numbers are floors" | 577 | **0** |
| "the shortest stretches keep a sliver…" | 531 | **0** |
| "…a dotted one means…" / "we worked out from the step" | 307 | **0** |
| "Start to finish is the longest chain…" | 144 | **0** |
| "…counted as time you are standing over it" | **97** | **0** |
| "…because two branches run at once" | 15 | **0** |

**The 97/57 discrepancy is resolved: they are two different sentences, both real.** This
ticket's list says 97 and T-005-02's ticket table says 57. Measured on the pre-story build,
*"counted as time you are standing over it"* is on **97** pages and *"counted as needing you
only because"* is on **57**. Both are now zero. Two more from the same family, also zero:
*"The recipe itself says"* **658 → 0** and *"two waits that overlap count once"* **635 → 0**.

### 4 · `slack:` reasons over 200

| Counting | before | after |
| --- | ---: | ---: |
| the rendered reason (what the cap governs) | **304** of 397 | **0** |
| the whole `>> slack:` value, level word included (what the story counted) | **330** of 397 | **0** |

Distribution of the rendered reason: mean 222.4 → **111.7**, p50 236 → **111**, max 290 → **151**.
The story said *333 of 397*; measured on the pre-story tree by its own convention it is 330. The
three-line gap is the story's arithmetic, not a change to the collection — the count of declared
recipes is 397 before and after, and no recipe was backfilled or silenced.

### 5 · Prose rows over 120

| | count | over 120 before | over 120 after | mean before | mean after |
| --- | ---: | ---: | ---: | ---: | ---: |
| headers | 286 → 286 | **126** | **0** | 133.9 | **69.8** |
| footers | 107 → 107 | **106** | **0** | 270.7 | **89.8** |

Against the ticket's *126 headers and 106 footers* — exact. The counts either side are the
tree-identity half of the claim: 286 headers before and after, 107 footers before and after. No
row was created and none was deleted. Worst row before: 730 characters. Worst now: 120.

### 6 · Discarded step-body characters

| | before | after |
| --- | ---: | ---: |
| steps carrying a `>> step.N:` line | 2782 in 637 recipes | 2782 in 637 recipes |
| characters in their bodies | **278,833** | **172,003** |
| over the 150 cap | 656 | **0** |

**Against the story's 228,000, with the discrepancy stated rather than smoothed.** The story
said *1501 steps across 474 recipes, 228,000 characters*. T-005-01 found the field is wider than
the story's description — `src/lib/tree.ts:129` applies the override on both sides of the
`isOpStep` branch, so a prose-row step discards its paragraph too — and measured the honest field
at 2782 steps / 278,833 characters, which is what is reported above.

**The story's own 1501/474/228,000 could not be reproduced under any definition tried**, and the
near misses are recorded so the next person does not hunt for it: steps that become operations,
2642 / 250,382; bodies longer than their own label, 2371 in 622 recipes / 253,445; operation
steps with a body over 100 characters, 960 in 363 recipes / 173,315. The number is real in the
sense that a person counted something; nothing in the tree today counts to it.

---

## Step 5 · The four regressions

### a. The merge tree is unchanged, across all 658 — **empty diff**

`buildTree` + `layout` over the pre-story tree and over HEAD, one line per recipe carrying root
column count, leaf count, row count, column count, header count, footer count, and every
operation's `stepIndex:col:row:rowSpan`:

```
$ diff cols-before.tsv cols-after.tsv ; echo $?
0
```

658 lines, byte-identical, **before the story began against after every one of its seven
tickets.** T-005-05 and T-005-06 each proved this across their own commits; this is the whole
chain in one diff, which is the claim the ticket asked for.

Re-run after commit 4 (which rewrote two prose rows) and still empty.

### b. No ingredient or timer was lost — **empty diff**

Per step: every ingredient as `name|quantity|amount.value|amount.unit`, every timer as
`name|text|minutes|attention`, every reference in order, plus each recipe's whole `cookware` and
`ingredientNames` lists.

```
$ diff data-before.tsv data-after.tsv ; echo $?
0
```

**4786 lines, byte-identical.** Also re-run after commit 4 and still empty.

**Ingredient notes are projected separately, deliberately**, because this ticket changes 17 of
them. That diff is **exactly 17 rows changed out of 4553**, and they fall in exactly the 13 files
step 1 names. No note anywhere else in the collection moved across the whole story.

### c. No safety fact was cut to fit a cap — **36 of 36 intact, and rendering**

T-005-04 published 36 safety lines as *after*-text. They were checked against the collection **as
it stands now**, not against that table, because T-005-05 and T-005-06 edited files on that list
afterwards.

- **36 of 36**: every number token in T-005-04's text (165°F, 160°F, 50°F, 40°F, 110°F, 325°F,
  three days, five days, seven days, two hours, two days, three days, six minutes, eight minutes,
  ten minutes, twenty minutes, twenty-four hours, two-week) is still in the current `slack:`
  reason for that recipe.
- **36 of 36**: that reason appears in the visible text of the built page.

Nothing is living only in a discarded step body. The one case where the collection *gained* a
safety fact — `sauerkraut`, rescued by T-005-04 out of an unrendered body — is on the page at 96
characters.

### d. Nothing moved twice, and nothing moved and stayed — **two found, both fixed**

Every `notes` entry in `counters.json` that names a dish, against the visible text of that dish's
built page. Compared on content words and on shared four-word runs rather than exact strings,
because both sides were rewritten — an exact-match test would come back clean by construction.

**Two real duplications, neither of them caught by any earlier ticket's check:**

| Recipe | The menu said | The page still said |
| --- | --- | --- |
| `new-england-boiled-dinner-slow-cooker` | *The one here that is not leave-it-and-go — you are home for the last two hours, adding the vegetables in order.* | *You are home for the last two hours adding things in order.* Nothing is browned and nothing should be. |
| `corn-carrot-pork-bone-soup` | *The one here that needs no explaining at the table: sweet, mild, and made all year round.* | *The child's pot — sweet, mild, made all year*, and the only dried thing in it is a fig. |

The first is one of the four sentences **T-005-03 moved** and T-005-05 recorded as *struck from
the row*. It was not struck; the row was shortened and kept the sentence. Neither ticket was
wrong about its own scope — T-005-03 could not edit `.cook` files and T-005-05 read its own
row list — but between them the sentence ended up in both rooms, which is exactly what this
check exists to find.

**Fixed in commit `7f531fc`.** Each row keeps only what changes how you cook it; the comparison
stays on the menu:

- `new-england-boiled-dinner-slow-cooker` → *Nothing is browned and nothing should be*
- `corn-carrot-pork-bone-soup` → *The only dried thing in this pot is a fig.*

Re-run afterwards: **43 notes checked, 0 flagged.** Merge tree and data projections both still
empty diffs.

**One judgement, recorded rather than acted on.** `baked-turkey-wings-slow-cooker`'s menu note
(*the only one here that browns before the pot*) and its row (*the colour happens in the oven
first… a steamed turkey wing comes out grey*) share a fact. The tool did not flag it and it is
correct as it stands: the menu carries the **comparison** and the row carries the **failure**,
which is the split the story asked for.

---

## Step 6 · Seven pages read whole

Every one read top to bottom in its built form, table view, prep view, cook view, clock and all.

### `ching-bo-leung-soup` — **6219 → 4451 (−28%). A cook is being talked to.**

The wordiest page on the site when this started. Nothing on it now explains the site. The row
above the table is one sentence — *Summer — 清補涼, clearing without heating. It is bought as a
mixed packet and the contents vary by shop* — and it is the one thing you need before you shop.
The clock reads `at least 3 hr 30 min · 1 of 4 steps gives no time` / `about 10 min`. `slack:`
names a failure: a lotus seed with its core left in turns the pot bitter and cannot be undone.
Ingredient notes are romanisations and instructions.

**Still wrong on this page:** three of its notes carry a Chinese tonic word (健脾, 安神, 祛濕) that
this ticket has just moved to the shelf for four other soups. They are under 80, so the checker
never asked. See gaps finding 5.

### `dried-bok-choy-pork-lung-soup` — **6121 → 4003 (−35%). Yes.**

The row is the one genuinely hard instruction in the recipe — washing the lung white — and it is
where a reader needs it. `slack:` is `Unforgiving` and says why. Every note is a romanisation or
a cut.

**Still wrong:** the chip under the title says `about 4 hr 30 min`; the clock says `at least
3 hr 30 min`. An hour apart, nothing reconciles them. See gaps finding 2.

### `boston-baked-beans-slow-cooker` — **5563 → 3012 (−46%). Yes.**

The story's headline case. The 757-character essay is 117 characters and both its sentences earn
their place: *the beans are soaked overnight and boiled hard for half an hour first* is something
you must know the night before, and *molasses and vinegar stall a hard bean forever* is why the
order is what it is. The crock-versus-pressure comparison is on The Slow Cooker's menu, where the
Instant Pot version is visible.

**Small:** the row is cut mid-sentence and ends without a full stop, and *boiled hard for half an
hour* repeats step 2's label *parboil 30 min, drain*.

### `tonkotsu-broth-instant-pot` — **4020 → 3341 (−17%). Yes, and it is the most interesting of
the seven.**

The worked example: one fact in three lengths in three fields. All three were rewritten by three
different tickets and none of them is what `voice.md` prescribed.

| Field | Was | Is |
| --- | ---: | --- |
| the row (step 1) | 132 | *The pot does the extraction. It cannot do the emulsion.* (55) |
| `>> slack:` | 250 | *the twenty minutes with the lid off is the whole white of it, and a broth not boiled hard there stays thin and grey* (115) |
| the step 1 body | 472 | 72, and rendered nowhere |
| the step 3 body | 273 | 63, and rendered nowhere |

**The honest verdict is that the fact is still on the page twice**, doing two jobs: the row
frames what the machine can and cannot do, `slack:` says what goes wrong if you cut the boil
short, and step 5's label says *boil hard, lid off, 20 min — this is the colour*. Three angles,
not three drafts — which is better than what was there and is not `voice.md`'s *say it once*.
`voice.md` has been corrected to describe what was built.

**Still wrong:** chip `about 3 hr 30 min`, clock `at least 2 hr 50 min`. And `Needs you` reads
`none given`, which is a phrase, not a number.

### `fresh-egg-pasta` — **4380 → 2694 (−38%). Yes — and it is finding 1, visible.**

The 596-character footer is 108 characters: *Toss it into the pan of sauce with a splash of that
water and keep it moving over the heat for half a minute.*

**That is a cooking instruction with a verb, an object and a duration, printed as an aside.** In
the cook view it is numbered **step 6** and you tick it off like any other step — so the site
already treats it as a step everywhere except the table, where it has no column, no timer and no
ingredients. Reading the page makes the case for finding 1 more sharply than the list does.

### `egg-cream` and `grilled-cheese` — **already short, and nothing was taken from the recipe**

The ticket asks this be shown, not asserted, so both pages' visible text was diffed pre-story
against now, line by line. **Every character that left is chrome about the site's own
arithmetic. Not one word about the drink or the sandwich was removed.**

`egg-cream` **1825 → 1566**. What went:

> *Not one step here is timed, so there is no clock to keep — only the order things happen in.*
> *This one never puts a number on anything — not one of its 3 steps is timed, so how long it
> takes is honestly unknown. The recipe itself says 5 min altogether, but it does not say where
> that time goes.*

replaced by **`Not one of its 3 steps is timed.`** Everything else on the page is byte-identical.

`grilled-cheese` **2004 → 1868**. What went:

> *two waits that overlap count once · of the steps that give a time · 2 of the 3 steps never
> say how long they take, so both numbers are floors. The recipe itself says 15 min.*

replaced by **`2 of 3 steps give no time`** and **`about 7 min`**. Everything else identical.

Both files did lose text in the `.cook` source — three sentences each, cut by T-005-06 — but
every step in both files already carried a `>> step.N:` line before the story began, so those
sentences rendered nowhere before and render nowhere now. **A recipe with nothing spare had
nothing taken.**

### The Slow Cooker menu — **the shelf talk arrived, and it is buried**

All 20 dishes read. The section note on *Braises, left alone all day* is a real shelf
observation, and 9 cards carry one — *the shortest braise here at six hours, and the one where
longer is actively worse*; *the one here with the most room in it: a pot that tops out at a
simmer cannot overcook a cheek*. These are the sentences that were in the wrong room, now in the
right one, and they read well.

**And they are 5% of the page.** Measured across all 21 counter menus, 855 cards:

| | characters |
| --- | ---: |
| the *also called* line | **69,387** (81 a card, on every card) |
| the ingredient line | 49,664 |
| the dish name | 13,002 |
| **the shelf talk** | **3,880**, on **40** of 855 cards |

Every card also prints its kit name — on The Slow Cooker's page, the word *Slow Cooker* appears
under all 20 titles. See gaps finding 4.

---

## Steps 7–8 · The two documents

`docs/gaps/voice.md`, created — seven findings ranked by what they cost a cook, opening with the
three the ticket names, closing with what this story did not fix.

`docs/knowledge/voice.md`, corrected in four places with a `What changed, and when` section at
the foot naming the ticket behind each. Detail in `review.md` §5.

---

## Deviations from the plan

1. **A fifth commit.** The plan expected check (d) to pass. It found two duplications and fixing
   them was two lines in two files. Recorded above with what each row now says.
2. **`export` removed from `measure-pages.mjs`** after a diagnostic script imported it and ran
   its whole body. One-line follow-up commit rather than a silent amend.
3. **`node_modules` had to be reinstalled** mid-step-1 after a symlink into the scratch worktree
   removed the repository's own. `npm ci`, no tracked file touched.
4. **The story's 228,000 could not be reproduced.** Reported with the three closest definitions
   rather than quietly replaced by 278,833.
