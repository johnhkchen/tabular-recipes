# T-003-02 — Review

A recipe can now say what happens if you get it wrong, in a line a stranger can read, and the
site prints it next to the clock or prints nothing at all.

```cooklang
>> slack: unforgiving — past 82°C the yolks scramble and the sauce will not come back
```

## What changed

**New**

| File | What it is |
| --- | --- |
| `src/lib/slack.ts` | The three levels, `readSlack()`, `slackWord()`. 100 lines, pure, no I/O. |
| `src/lib/slack.test.ts` | 9 unit tests over the reader, 6 sweeps over the whole collection. |

**Modified**

| File | Change |
| --- | --- |
| `src/lib/tree.ts` | `RawRecipe.slack: Slack \| null` and `slackProblem?: string \| null`. `RecipeTree` untouched — the table does not draw this. |
| `scripts/normalise.mjs` | Reads the line beside `dish`/`kit`; `'slack'` joins `PROMOTED`; returns `slack` and `slackProblem`. |
| `scripts/check-recipes.mjs` | One line: pushes `slackProblem` onto the file's problems. |
| `scripts/parse-recipes.mjs` | Throws on `slackProblem`, so a malformed line cannot reach `recipes.json`. |
| `src/components/Timeline.astro` | One guarded `<dl class="slack">` after the notes; `.slack` styles; one word in the print block. |
| `src/lib/schedule.test.ts` | `slack: null` in the one hand-built `RawRecipe` fixture. |
| `README.md` | The `>> slack:` line, a bullet with the three levels and two example lines, one table row. |
| ten `.cook` files | One `>> slack:` line each. |

Nothing under `src/data/`. `src/lib/time.ts` untouched. Every file outside `recipes/**` is in
`scripts/`, `src/`, or is `README.md`.

## The decisions a reviewer should check first

**The vocabulary is `forgiving` · `narrow` · `unforgiving`.** The middle level is `narrow`
rather than `fussy` because a fussy recipe is a *fiddly* one — that is the clock's "needs
you" figure, two lines up the same panel — and this field is about the size of the window,
not the size of the job. Three writer tickets copy these examples, so a middle word that
invites the wrong axis would be a mistake replicated dozens of times. Full reasoning and the
four rejected sets are in `design.md` §2.

**One line, and the punctuation joining it is not policed.** The first run of letters is the
level; `—`, `–`, `-`, `:`, `,` or nothing may join it to the reason; the rest of the line is
the reason verbatim, its own dashes intact. Liberal about how a human wrote it, strict about
what it means. A checker that spends its credibility on punctuation has none left for the
level.

**A malformed line yields no slack at all, plus the reason why.** `readSlack` returns
`{slack, problem}`; `slack` is whole or null, never half-built — the same discipline as
`minutesOf()` returning null rather than guessing at a unit. The message is written once, in
`slack.ts`, so the per-file checker and the build print the same sentence.

**Absence is one guard.** `{slack && (…)}` around the whole element: no label, no well, no
dash, nothing in the DOM. 505 of the 515 pages are in that state and none of them gained an
empty slot.

## Test coverage

Every line the acceptance criteria asked for, and where it is:

| Criterion | Test |
| --- | --- |
| each level parses | `readSlack › reads each level, and keeps the reason as the author wrote it` |
| a missing reason fails | `readSlack › refuses a level with no reason` — bare `forgiving`, `forgiving —`, `unforgiving  :` |
| an unknown level fails | `readSlack › refuses a level nobody agreed on, and says what the legal ones are` — asserts all three legal values appear in the message |
| an undeclared recipe renders no line | `slack across the collection › renders nothing for a recipe that never declared one`, plus the `dist/` grep below |

Beyond those: the five separator forms and none at all; a dash inside a reason surviving; case
and padding; a reason with no level; and six sweeps over the built collection — nothing
half-declared, no level outside the vocabulary, every declared line re-reading without a
complaint, all three levels present, at least eight recipes declaring one, and no reason under
five words (the cheapest filler catcher available).

Totals: 15 new tests. 681 tests green at `4e43c24`.

**The render was verified against real built HTML, twice.** Before any recipe declared one:
532 pages built, `grep -rl "If you get it wrong" dist/` matched **0**. After the ten worked
examples: 534 pages, the same grep matched **exactly 10**, and they are exactly the ten
annotated slugs. That before/after pair is the evidence that the guard works in both
directions.

### The gap, stated plainly

**There is no test that renders `Timeline.astro`.** Doing so needs
`experimental_AstroContainer` *plus* the Astro Vite plugin, which arrives only through a root
`vitest.config.ts` — a file outside the `scripts/` · `src/` · `README.md` budget this ticket
is held to, and `npx tsc` is not installed either, so there is no typecheck step to lean on.

What was done instead: the render was reduced to a single guard over a single nullable value;
the value is unit-tested and swept across all 515 recipes; and the rendered output is grepped
out of `dist/` before and after. That is strong evidence, and it is not a component test. A
future ticket that wants one should carry the `vitest.config.ts` — this is the second
component in the repo in that position (`RecipeTable.astro` is likewise covered through
`layout.test.ts`'s data structure, not its HTML), so it is a repo-level gap, not one this
field introduced.

## The worked examples

Ten rather than the required eight, three genuinely dangerous or unrecoverable rather than the
required two. Every reason was written after reading the whole file and names something that
file's own steps say.

| Recipe | Level | The failure named |
| --- | --- | --- |
| `beef-stew` | forgiving | the potatoes go before the beef minds |
| `no-knead-bread` | forgiving | an overnight rise that does not mind when you get up |
| `sauerkraut` | forgiving | three weeks is when to start tasting, not a deadline |
| `chicken-broth` | narrow | one boil and the broth stays beige |
| `mushroom-risotto` | narrow | overshoot al dente and it is porridge |
| `sourdough-boule` | narrow | over-proofed dough bakes flat however well you score it |
| `carne-asada` | narrow | skirt goes pink to grey while you fetch the plates |
| `creme-anglaise` | **unforgiving** | past 82°C the yolks scramble and will not come back |
| `fried-chicken` | **unforgiving** | six cups of oil at 325°F, and a piece pulled early is raw at the bone |
| `belly-lox` | **unforgiving** | the cure is what makes raw salmon safe to eat |

`chicken-broth` was planned as forgiving and is filed as narrow; reading the file settled it,
and `progress.md` records why.

## Open concerns

1. **`npm run verify` fails at the branch tip, on someone else's test.** It passes on this
   ticket's work: exit 0, 681 tests, 532 pages, run in a clean worktree at `4e43c24`, the
   commit holding every source change here. At the tip,
   `src/lib/icons.test.ts › recognises every verb the recipes open an operation with` fails on
   the verbs `cabbage`, `roots`, `vegetables`. They come from
   `recipes/stews-and-braises/new-england-boiled-dinner.cook` (added by `6fd3fd0`, T-002-04)
   and `recipes/stews-and-braises/beef-stew-instant-pot.cook` (T-002-02, which landed as
   `87679ec` while this was being written). Neither file existed at the session-start HEAD,
   neither is owned here, and a `>> slack:` metadata line cannot change an operation label —
   labels come from step text. The remedy belongs to those tickets: reword the steps, or add
   the verbs to `icons.ts`. Flagged rather than fixed, because `icons.ts` is not this ticket's
   to change on another ticket's behalf.
2. **Nothing filters by slack yet.** Deliberate: no ticket asked for it. The vocabulary is
   exported from one module and `data-level` is on the rendered element, which is the seam a
   filter or a menu grouping will use.
3. **`slack` is not carried into `plan.json` or `search.json`.** Out of scope; both read
   `RawRecipe`, so both are one line away when something needs it.
4. **The reason's quality is a review judgement, not a check.** Non-empty and five words are
   enforceable; "is this a real failure or filler" is not. The story chose worked examples as
   the mechanism for that, and there are ten of them.
5. **505 recipes still declare nothing.** Expected — T-003-07 backfills where it matters. The
   page is designed for that state and was verified in it.

## For the three writer tickets

Write the line from the first file. The level is one word from
`forgiving` · `narrow` · `unforgiving`; the rest of the line is the reason, and the reason is
the whole value. If you cannot name the actual failure — the temperature it breaks at, the
window it has, the thing that cannot be undone — leave the line off. The build will not let a
level through without a reason, and an honest silence renders as nothing at all.
