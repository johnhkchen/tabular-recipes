# T-011-05 — Review

The plan page said `serves 4 → 12` and nothing about the clock. It now says what the multiplier
costs, in the phrasebook's words, for the 296 recipes whose figures can carry a sentence — and
says nothing at all for the 389 that cannot, which is the other half of the fix.

---

## 1. What changed

| File | | Lines | What |
| --- | --- | ---: | --- |
| `src/components/scaling-words.ts` | new | 438 | `docs/knowledge/scaling.md` §6 as code: nine findings, one row each, the table the page reads, and the evening total |
| `src/components/scaling-words.test.ts` | new | 282 | 25 tests, four of them over the whole 685-recipe build |
| `src/components/PlanCosts.astro` | new | 33 | build time: `recipes.json` → one inert JSON island |
| `src/pages/list.astro` | modified | +123 | the island reader, the cost line, the evening total, three style rules |

Four commits: `457ad94`, `cb73622`, `f8cd05a`, `f425bfa`.

**Nothing else was touched.** No `.cook` file, no `src/lib/**`, no `src/lib/plan.ts`, no
`scaleAmount`, no `MULTIPLIERS`, no change to the shopping list's grouping or to
`src/pages/plan.json.ts`. `src/styles/**` was not needed — the page's rules live in its own
scoped `<style>` block, and no new media query was added, so `src/styles/breakpoints.test.ts`
stays green.

### How it works, in four sentences

`costOf()` needs the whole recipe tree and `/list/` is drawn in the browser, so every call is
made at build time by `PlanCosts.astro` and what crosses into the page is a table of finished
sentences plus two minute figures per recipe per multiplier — 685 slugs, 71 distinct sentences,
**54 KB** inline, against a page that already fetches 650 KB of `plan.json`. The page looks
things up; **it cannot compute a batch count, because it never receives a capacity or a servings
count to compute one from.** `findingOf()` names the reading before `wordsFor()` words it, so
*nothing binds* and *we cannot say* are two different kinds that only the phrasebook collapses to
the same silence. The evening total sums hands-on minutes and takes the **maximum** elapsed,
never the sum.

---

## 2. Against the acceptance criteria

| Criterion | |
| --- | --- |
| All three cases, phrasebook wording, one screenshot | ✅ `list-390.png` / `list-768.png` — a bounded line, an unbounded line, a cannot-say line, and a `× 1` line in one frame |
| Unbounded and cannot-say visibly different, and different in the code | ✅ a sentence against a blank; `{kind:'free'}`/`{kind:'work'}` against `{kind:'cannot-say'}` in one union, asserted by test |
| No notation on the page | ✅ for everything this ticket adds — see §4 for the one thing on that page it did not add |
| The batch count comes from `src/lib/scaling.ts` | ✅ `batches.at`, read off `Cost` at build time; there is no arithmetic in the page |
| Nothing at `× 1`, nothing where the recipe cannot answer | ✅ both return no words, and no element is created |
| The total delivered or deferred, and elapsed never summed | ✅ delivered as sum-of-standing and max-of-elapsed, stated as a floor; the full cross-recipe schedule is deferred with a reason in `design.md` §4 |
| `scaleAmount`, the multiplier set, the shopping grouping unchanged | ✅ |
| `npm run verify` and `npm run verify:mobile` pass | ✅ see §3 |
| Five most misleading recipes, before and after, checked first | ✅ `before-after.md`, produced from `costOf()` before a line of the feature was written |
| Only the named files modified | ✅ see the table above |

---

## 3. Tests and gates

**`npm run verify` — exit 0. 20 test files, 1218 tests.**

**`npm run verify:mobile` — exit 0.** 710 pages at 375, 390 and 768 px: nothing scrolls sideways,
everything a thumb has to hit is 44 px, the table's three narrow-width promises hold.

Both were run against `git archive HEAD` unpacked into a scratch directory with `node_modules`
symlinked, rather than against the shared working tree. **A neighbouring ticket's thread had
`src/pages/search.json.ts`, `src/components/situation.test.ts` and `src/lib/meal.ts` in flight on
the same branch mid-run**, and six of their tests were red at the time; none of those files is
one this ticket touches. The clean copy is every committed file and none of theirs. That thread
has since committed and the shared tree is green too.

### The 25 unit tests

Nine named recipes carry one branch each — `air-fryer-chicken-wings` (a basket that costs),
`beef-with-broccoli` (a wok that does not), `gumbo` (nothing binds), `beef-rendang` and
`chili-con-carne` (we cannot say), and so on. Four run over the whole build:

- **no notation** in any of the 71 sentences;
- **every recipe with a capacity speaks** at every multiplier but one — 46 of them, ×4;
- **389 silent, 296 spoken**, so a collection that moves under this feature fails with the number
  in the message rather than quietly making `design.md` wrong;
- **nothing promises a still clock when the clock moves** — no sentence containing *"the only
  difference"*, *"costs you nothing extra"* or *"still takes the same"* may be printed for a
  recipe whose elapsed figure changes, over 685 recipes × 4 multipliers.

That last one is the test that matters most, and it exists because the first draft failed it: see
`progress.md`, Deviation 1.

### The gap the scripted gates cannot see, and how it was covered

`check-overflow.mjs` and `check-touch.mjs` visit `/list/` with an empty `localStorage`, **so they
never see a cost line at all** — the case this ticket adds is invisible to both. `shot.mjs` seeds
a four-recipe plan, reloads, and measures the same two things on the populated page at 390 px and
768 px: no sideways scroll, nothing interactive under 44 px. It copies `check-touch`'s two
documented exemptions rather than inventing its own.

### Not covered by a test, said plainly

That the *right* sentence appears for a recipe nobody named in a test. The whole-collection tests
bound what can go wrong; they do not read 685 sentences for sense. Ten are read by hand in
`before-after.md` and four in the screenshot, and the rest rests on nine branches each having a
named example.

---

## 4. Open concerns

### 4.1 The dial still says `×3`, and the meta line still says `serves 8 → 24`

The criterion reads *"No notation appears anywhere on the page."* Everything this ticket adds
obeys it — no `O(·)`, no multiplier, no arrow, no batch count written as arithmetic, enforced by
a test over every sentence in the build. **Two older things on that page do not**, and both were
left alone deliberately:

- the multiplier dial's button labels (`×1/2 ×1 ×2 ×3`), which come from `formatMultiplier()` in
  `src/lib/plan.ts` — a file the criteria forbid this ticket to touch — and which are the
  multiplier set's own control, protected by *"do not change the multiplier set"*. Each button
  already carries the words as its `aria-label` (*"three times the recipe"*).
- `servingsText`'s arrow. The story calls `serves 4 → 12` the lie, but the lie is the **silence
  beside it**: the servings really do triple. Rewriting true copy the ticket did not ask about
  would be scope this ticket has no mandate for.

The reading taken is that the rule governs the sentences the model produces — it appears in §1
*Say what the multiplier costs*, directly under *"The wording comes from the phrasebook"*, and in
§6 of `scaling.md` as a rule about phrasebook rows. **If the intended reading was the whole page,
this is one ticket away and is a change to a control, not to a sentence.** Flagged rather than
guessed at.

### 4.2 `scaling.md` §6 has a row that cannot be used as written

*"Vessel binds only on work, not on waiting → It goes in three lots, and that is the only
difference."* The "difference" it means is the vessel's own share — the same recipe with the
capacity taken away. **A reader has no such recipe to compare against**, so on a page the sentence
claims the whole evening is unchanged. It is false for all 24 recipes it would reach:
`beef-bourguignon-instant-pot` gains ninety minutes of browning at `× 3` with a vessel that costs
nothing at all.

Two §6 rows are joined instead — *"It goes in six lots, and three times as much is three times
the chopping"* — with *"The pot doesn't care"* dropped, because here it does. Nothing was
invented, and the whole-collection invariant above prevents the class of error rather than the
instance.

A second row is unreachable for a related reason: *"three times the batches, and three times as
long standing there"* is false on every recipe that would reach it, because all 22 baskets report
**zero** standing minutes — their forty extra minutes is a wait at the machine, not work.

**`docs/knowledge/scaling.md` was not edited.** The ticket's §1 says a missing sentence is a gap
to be added to the phrasebook, but the acceptance criteria do not list `docs/knowledge/**` among
the files this ticket may modify, and the criteria are the checkable contract. Both rows are
reported here for whoever owns that file next.

### 4.3 389 recipes stay silent, and 34 of them carry half an hour or more

`beef-rendang` gains **two hours** at `× 3` and the page says nothing, because 180 of its 180
standing minutes are assumed — no timer in the file claims any of them. That is the ticket's third
case working exactly as specified, and it is also the honest measure of how far this collection's
`.cook` files are from being able to answer the question. **The fix is timers and `>> capacity:`
lines, not a looser rule here.** `before-after.md` §3 names the worst five.

### 4.4 54 KB of inline JSON on `/list/`

Almost all short integers, on a page that already fetches 650 KB, and well inside the 100 KB gate
`plan.md` set as a stop-and-rethink line. It would be a few hundred bytes of extra `plan.json` if
that file were in this ticket's scope. Worth revisiting when it is.

### 4.5 The evening total is a floor, and the model under it is optimistic

`scaling.md` §4.5: an oven drops heat every time the door opens, so *n* batches is more than *n*
times one batch, and the batch count is the one place this collection errs towards a lighter
evening rather than a busier one. The word *about* on the `lots-cost` line and the untimed tail
both exist for that. The total says *at least* out loud for the same reason.

---

## 5. What a human should look at first

1. **The screenshot**, `list-390.png` — three readings and a `× 1` line, and whether the blank
   under Beef Rendang reads as deliberate or as missing.
2. **§4.1**, which is the one place this ticket has taken a reading of a criterion rather than
   satisfied it mechanically.
3. **`findingOf()` in `scaling-words.ts`** — twenty lines, and the whole argument is the order of
   its tests.
