# T-014-02 — Structure

Ten files modified, none created, none deleted. No `.cook` file, no `src/data/*.json`, no
`src/generated/`, no test file. Twelve fixes across the ten.

## 1. The file list

| file | fixes | kind of change |
| --- | --- | --- |
| `docs/gaps/one-pot.md` | 1 | one section block added to `## What it has` |
| `docs/gaps/cha-chaan-teng.md` | 2, 3 | two prose repairs, five table cells |
| `docs/gaps/voice.md` | 4 | one dated note inserted |
| `docs/gaps/air-fryer-and-pot.md` | 11 | one heading renamed |
| `docs/knowledge/scaling.md` | 5 | two false clauses repaired |
| `docs/knowledge/occasions.md` | 8 | three counts repaired |
| `docs/gaps/README.md` | 7, and the finding-6 pushback, and §4 | one clause repaired, rows added |
| `README.md` | 10 | one bullet added |
| `scripts/measure-pages.mjs` | 9 | one usage line |
| `scripts/parse-recipes.mjs` | 13 | one array member |
| `src/lib/time.ts` | 12 | one set member |
| `docs/gaps/what-the-season-left.md` | bookkeeping | one bullet moved between bands |

Eleven of the twelve are under twenty changed lines. The largest is finding 2.

## 2. Boundaries this respects

- **`src/data/counters.json` is not edited.** Finding 1 moves the page towards the JSON, never the
  other way. `scripts/menu-sections.mjs --write` is not run — `docs/gaps/README.md:18-21` says it
  rewrites every counter and drops twelve hand-written `notes` blocks.
- **No `.cook` file is edited**, so no recipe changes shelf, servings, capacity, washing-up or slack.
- **No test is added or changed.** Nothing new is testable: eleven fixes are documents and the two
  code fixes are covered below.
- **`dist/` and `src/generated/` are build outputs** and are neither edited nor committed.

## 3. File by file

### 3.1 `docs/gaps/one-pot.md` — finding 1

Insert one block after the existing `**Soups that are the whole meal.**` block, inside
`## What it has`, in the `**Title.** slug · slug` shape the parser requires:

```
**Quick soups that go with dinner.** tomato-potato-beef-soup · seaweed-egg-drop-soup ·
mustard-greens-tofu-soup · crucian-carp-tofu-soup · century-egg-amaranth-soup
```

Title and members copied from `src/data/counters.json`, in its order. No em-dash in the title (the
parser cuts a title at ` — `). Nothing else on the page moves.

**Interface:** `node scripts/menu-sections.mjs` must go from `4 sections, 68/73 placed` with five
`unplaced` to `5 sections, 73/73 placed` with none, and no other counter's line may move.

### 3.2 `docs/gaps/cha-chaan-teng.md` — findings 2 and 3

Three sites for finding 2, and they are separate edits in one commit because they are one claim:

- **Lines 39-44**, the `## What it has` preamble. `"a borrowed slug is recorded in this file and
  dropped from the page. The counter prints 22."` → the five are shelved and the counter prints 27.
  The sentence about reading the caution before adding a sixth stays; it is still the right advice.
- **Lines 157-163**, the borrow preamble. Two false statements about code: `menuFor()` *drops
  silently*, and `menu-sections.mjs` *reports the five as listed but not shelved here every run*.
  Since T-011-05 `menuFor()` throws with the slug named, and the dry run reports `27/27 placed`.
  The paragraph's last sentence — *"that line is the reminder, not a fault"* — describes a reminder
  that no longer exists and goes with it.
- **Lines 167-171**, five `What happened` cells: `listed, not rendering` → shelved and rendering.

**Not touched:** the `Verdict` column, the `Why` column, the two *write a new file* rows, the
`lo-mein` refusal, and the closing paragraph *"That is five shelve as is, two write a new file, and
one refusal"* — which is the section's argument and is still exactly true.

Finding 3 is one clause in one bullet under `### The tea` (line 127). **No source states a ratio** →
one does, named, with its figures, and with the standing point kept: there is no standard, and a
file that invents its own is inventing the recipe. `## Sources` already cites 自由時報 and already
says ACTHK states no ratio; neither needs to change.

### 3.3 `docs/gaps/voice.md` — finding 4

One inserted note directly under the `## 5.` heading, before *"**What happens.**"*, dated, saying
the numbered form was removed by T-009-03, that `npm run check` refuses it, that
`scripts/inline-step-labels.mjs --write` moves any survivor, and that **the measurements below are
S-005's and are kept as they were measured**.

**Not touched:** the table, the 172,003, the 2782/637, the 38%, T-005-06's four bodies, the
*Mitigation or cure* line. The page is a dated record; the note dates it.

### 3.4 `docs/gaps/air-fryer-and-pot.md` — finding 11

Line 856: `## What a table cannot hold` → `## What it could not stock`. One line. No body text
changes; the eight entries under it are untouched.

Any in-page cross-reference to the old heading has to move with it or the anchor breaks — checked
before the edit, not assumed.

### 3.5 `docs/knowledge/scaling.md` — finding 5

Two clauses, both factual, neither structural:

- **§7, line ~402.** *"and **no air fryer recipe exists in this collection** — no `.cook` file
  declares `kit: Air Fryer`, and T-008-04 is the ticket that writes them"* → they exist, 13 declare
  the kit across a 21-recipe shelf, and **this block was not rewritten from one**, with the date.
- **§9, line 508.** *"**There is no air fryer recipe**, so the second pole in §7 is an illustration
  … When T-008-04 lands, §7's air fryer block should be rewritten"* → T-008-04 landed; the block is
  still the illustration; the rewrite is still owed.

**Not touched:** the figures in the code block (`a basket load ≈ 20 min`, `c ≈ 4`, `H ≈ 2`, `r = 3`,
`elapsed = 66 min`, `40 min`), the karaage comparison, §7's argument, and every other section.

### 3.6 `docs/knowledge/occasions.md` — finding 8

Three sites, `0` → `46`:

- **Line 213**, a table cell: `**0 capacities declared**`.
- **Lines 216-218**, the sentence that depends on it — *"`capacity` is built and unannotated … no
  file declares one yet, so every scaling answer in this collection today is the no-vessel branch."*
  Both clauses are false at 46 and are corrected to what is true: thinly annotated, and the
  no-vessel branch is where the other 639 land.
- **Line 393**, *"the annotation pass has not run, so all 685 files answer as though nothing binds."*
- **Line 539**, `` `capacity` 0 `` in a list whose other three figures (138 · 416 · 177) are right.

**Not touched:** the argument that two of those rows are the whole difficulty — true at 46 of 685 —
the 43-file population sentence, §3.5, §3.6, and the rates. `occasions.md`'s other three findings are
in the *needs an argument* band and stay there.

### 3.7 `docs/gaps/README.md` — finding 7, the pushback, and §4

- **Finding 7**, line 395: *"prints 3 of 1074 rather than 5"* → `4 of 1086`, naming the fourth
  (`leftover pizza`) and why it is there (T-008-05 left it in `other`; no shop sells it). The bullet
  heading *"Three ingredient names are not food"* stays true — `leftover pizza` is food with no
  aisle, which is a different thing and the corrected clause says so.
- **The finding-6 pushback** gets a row in the `**Needs an argument**` table at lines 441-467, with
  finding, source (T-014-01, pushed back by T-014-02) and the reason.
- **§4 of the ticket**: whatever the row-by-row read of the two band tables finds missing. Additive
  only; no existing row is reworded, because those rows are T-014-01's record.

**Not touched:** `## Build state` and its arithmetic paragraph — that is the pushback.

### 3.8 `README.md` — finding 10

One bullet appended to the list at lines 248-251, in the shape of the two beside it — a bolded name
for the shape, then what the rule is. It names a reference that points at no step, which cooklang
reads as an ingredient, so the table draws a row that is not an ingredient.

**Not touched:** everything else in the file, including `## Publishing` and `## Not yet`, which are
T-014-03's.

### 3.9 `scripts/measure-pages.mjs` — finding 9

Line 6 only:

```
 *   node scripts/measure-pages.mjs --slug ching-bo-leung-soup   # one page
```

The replacement is **the slug the script itself currently reports as the wordiest page**, so the
example is derived rather than chosen. **Line 30 is not touched** — it is a dated baseline note
about a build of `1ae1165` and is true of that build.

### 3.10 `scripts/parse-recipes.mjs` — finding 13

One member added to the array at lines 53-58:

```js
    recipe.slackProblem,
    recipe.washingUpProblem,
    recipe.keepsProblem,
    recipe.capacityProblem,          // <- added
    ...recipe.stepLabelProblems,
    ...recipe.stepRefProblems,
```

`scripts/normalise.mjs:286,318` already produces the field. No new function, no new message, no
signature change. Order inside the array is cosmetic — the loop throws on the first truthy one — so
it goes beside its three siblings.

### 3.11 `src/lib/time.ts` — finding 12

One string added to `UNATTENDED` (lines 60-68), beside the appliance names that are already there
for the same reason:

```js
  'pressure', 'pressurecook', … 'keepwarm', 'airfry',
```

`normalise()` strips spaces and hyphens, so this catches `~air fry{}`, `~air-fry{}` and `~airfry{}`
and nothing else. `readWords()` is not changed, `HANDS_ON` is not changed, `NOT_A_VERB_IN_A_SENTENCE`
is not changed. A one-line comment records why a word with no current call site is in the set, the
way the file already does for `parboil`.

### 3.12 `docs/gaps/what-the-season-left.md` — bookkeeping

Two edits, both required by *push it back … say so*:

- The finding-6 bullet moves from `## Mechanical` to `## Needs an argument`, carrying the test it
  failed.
- The `## Mechanical` preamble's *"Thirteen findings"* becomes twelve, with one line pointing at
  T-014-02's work artifact for what happened to each.

**Not touched:** the other twelve bullets, the first section, the twenty-nine table, and both other
bands. This is the minimum that keeps the page from telling the next reader that a rejected finding
is still T-014-02's scope.

## 4. Ordering that matters

1. **Finding 1 before anything else builds.** It is the only prose edit `menu-sections.mjs` reads,
   so it is verified against an otherwise untouched tree.
2. **Findings 13 and 12 last**, in that order. Both can change what the build does; 13 can only make
   it stricter, 12 can only change a reading. Running them last means every earlier verify was over
   an unmodified library.
3. **The dump wraps finding 12.** Dump before, apply, dump after, diff. The diff is the evidence,
   not `npm run verify` — verify would pass either way.
4. **`verify:mobile` alone, at the end.** It builds; nothing else may.
5. **§4's band read after every fix**, so what it adds to `docs/gaps/README.md` is written once
   against the final state rather than amended.

## 5. What a reviewer should be able to check in one command each

| fix | command |
| --- | --- |
| 1 | `node scripts/menu-sections.mjs \| grep 'One Pot'` |
| 2 | `grep -c 'listed, not rendering' docs/gaps/cha-chaan-teng.md` → 0; `grep -o '<p class="count">[^<]*' dist/menu/cha-chaan-teng/index.html` |
| 3 | `grep -c 'No source states a ratio' docs/gaps/cha-chaan-teng.md` → 0 |
| 4 | `grep -rn '^>> *step\.' recipes --include='*.cook' \| wc -l` → 0, and the note is present |
| 5 | `grep -c 'no air fryer recipe' docs/knowledge/scaling.md` → 0 |
| 7 | `npx vitest run src/lib/shopping.test.ts` → `4/1086` |
| 8 | `node -e "…filter(r=>r.capacity).length"` → 46, three sites agree |
| 9 | `node scripts/measure-pages.mjs --slug <the replacement>` prints a count |
| 10 | the bullet is present; `npm run verify` unchanged |
| 11 | `grep -l '^## What it could not stock' docs/gaps/*.md \| wc -l` → **23** |
| 12 | dump-and-diff over 685 recipes → **empty** |
| 13 | a throwaway `.cook` with a malformed capacity makes `npm run recipes` exit non-zero |
