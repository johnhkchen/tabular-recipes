# T-008-01 — Research

What exists, where, and what a fourth recipe property has to fit into. Descriptive only; no
proposals. Every path and line number below was read, not remembered.

---

## 1. The claim being checked, and the evidence already on record

`docs/gaps/one-pot.md` is the primary source and it has already done this ticket's homework.

- It ranked **114 candidates off the derived `cookware` line** and then **threw 61 off by hand**
  (`docs/gaps/one-pot.md:126-172`), in seven named groups.
- Its own verdict on the derived line: *"That line turned out to be evidence rather than an
  answer: it counts what a recipe names"* (`:8-10`).
- The sharpest group is **"A second pot of water, drained — the colander case (8)"**, and the page
  says out loud: *"**Not one of these declares a second vessel in its `cookware` line.**"*
  (`:135-142`). `chicken-noodle-soup`, `matzo-ball-soup`, `biryani`, `corned-beef-hash`,
  `beef-with-broccoli`, `mujaddara`, `chana-masala`, `dal-tadka`.
- The four the story quotes came off **after** the shelf was built (`:15-21`): `general-tsos-chicken`,
  `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` — each declaring one `#wok{}`.
- And the line this ticket exists to answer: *"the **promise** of the counter is a claim about the
  washing-up, and washing-up is not a row in a table"* (`:103-105`).

I verified the wok claim directly. `recipes/stir-fries/general-tsos-chicken.cook` declares exactly
one `#wok{}` and its steps require: a bowl to velvet in (step 1), a dish to dredge in (step 2), a
rack to drain on (step 3, *"rest them on a rack"* — the rack is **not** marked `#rack{}`), a bowl
for the glaze (step 4, *"smooth in a bowl"* — likewise unmarked), and the wok. Five things; the
`cookware` array has one entry. The failure is exactly as described.

## 2. The three shelves that hold the promise

| Counter | Files | Blurb (src/data/counters.json) |
| --- | ---: | --- |
| One Pot | 68 | *Everything goes in one pan, and that is the only pan to wash.* |
| Instant Pot | 25 | *Lock the lid and walk away.* |
| The Slow Cooker | 20 | *Fill it before you leave.* |

`src/data/counters.json` is **out of bounds for this ticket** (ticket, last line; T-007-05 and
T-008-02 hold it). Nothing here needs it.

**A survey of the pool's declared cookware, run for this research:**

- All 25 Instant Pot files: 21 declare `#Instant Pot{}` alone or with a sieve/sachet. **Two declare
  a second cooking pan**: `beef-bourguignon-instant-pot` (`#Instant Pot{}` + `#skillet{}`) and
  `pho-broth-instant-pot` (`#Instant Pot{}` + `#skillet{}` + `#spice sachet{}`).
- All 20 Slow Cooker files: **15 of 20 declare a `#skillet{}` or `#saucepan{}` beside the cooker** —
  the brown-first pattern is the norm on that shelf and is declared honestly there.
- The `#broiler{}`, `#oven{}` and `#hob` marks appear in the same array as pots. They are appliances,
  not things that go in a sink (`carnitas-instant-pot`, `chile-verde-slow-cooker`,
  `baked-turkey-wings-slow-cooker`).

That last point matters: any cross-check against `cookware` meets appliances in the same list as
vessels, and `docs/gaps/one-pot.md:178-185` ("The broiler argument") already records that this
distinction was left unsettled on purpose.

## 3. The three fields this one has to look like

### `slack` — the closest sibling, and the template

The path a `>> ` line takes, end to end:

| Stage | File:line | What happens |
| --- | --- | --- |
| Read | `scripts/normalise.mjs:212` | `const { slack, problem: slackProblem } = readSlack(metadata.slack)` |
| Promote | `scripts/normalise.mjs:215-220` | `PROMOTED` set; the key is `delete`d from loose `metadata` |
| Emit | `scripts/normalise.mjs:232-234` | `slack`, `slackProblem` on the returned object |
| Type | `src/lib/tree.ts:55-63` | `slack: Slack \| null`, `slackProblem?: string \| null` |
| Parse | `src/lib/slack.ts:64-94` | `readSlack()` — the only reader, pure, no I/O |
| Warn | `scripts/check-recipes.mjs:154` | `if (recipe.slackProblem) problems.push(...)` — **fails that file** |
| Fail | `scripts/parse-recipes.mjs:52-56` | throws, so a half-declared field never reaches a page |
| Render | `src/components/Timeline.astro:300-309` | `{slack && <dl class="slack">…}` |
| Test | `src/lib/slack.test.ts` | 142 lines: unit tests, then collection tests over `recipes.json` |
| Document | `README.md:73-93` | field, two example lines, the "leave it off" rule |

`readSlack` is worth reading closely (`src/lib/slack.ts:56-94`). Its house rules, stated in its own
header comment: **authored never derived**, and **the value is in the reason**. Its return shape is
`{ slack, problem }` — *whole or nothing, plus what to tell the person who wrote the line*. Absent
(`''`, `'   '`, `undefined`, `null`) is `{ slack: null, problem: null }` and is legal; malformed is
`{ slack: null, problem: '…' }` and is fatal. **There is no third state for the component to draw
an empty slot out of** — `src/lib/slack.test.ts:92-96` says exactly that, and it is why the render
is a single `&&` guard.

### `kit` and `dish` — the plain-string pair

`scripts/normalise.mjs:203-204`: `const dish = metadata.dish ?? slug; const kit = metadata.kit ?? null;`
No reader, no validation at file level. Their cross-file rule lives in `parse-recipes.mjs:191-208`
(one plain way per dish) and in `src/lib/collection.test.ts:58-75`.

### `tags`, `counters`, `aka`, `pairs-with` — the list fields

All four go through **`splitList()`** (`src/lib/meta.ts:4-10`): split on `,`, trim, drop empties.
Order and case are kept. `tags` alone is lowercased afterwards (`normalise.mjs:196`).

`pairs-with` is the precedent the ticket names for *derive, do not let the author state it twice*:
`parse-recipes.mjs:160-181` makes pairings mutual at build time, so only one file writes the line.
Labels are the same instinct — derived from the step, overridable by `>> step.N:`
(`normalise.mjs:131-133`, `tree.ts:128`).

## 4. Where the clock is, and what is already beside it

`src/components/Timeline.astro`, mounted from `src/pages/[slug].astro:108`, **under** the three
cook-mode panes so it stays on screen whichever pane is showing (`[slug].astro:104-107`).

Inside it, in render order:

1. `<h2>The clock</h2>`
2. `.stats` — two `.stat` wells: **Start to finish** and **Needs you** (`Timeline.astro:280-296`).
   Each is `<dt>` label / `<dd><b>figure</b><span class="sub">…</span></dd>`.
3. `.slack` — one full-width well, `<dt>If you get it wrong</dt>`, `<dd><b>Level</b> — reason</dd>`
   (`:300-309`). Its comment at `:263-268` states the render contract: *"null for most of the
   collection, which draws nothing at all rather than an empty slot."*
4. the axis, the rows, the legend.

The CSS for `.slack` (`:486-515`) is a copy of `.stat`'s well made full-width, with an explicit
note: **no colour keyed to the level**, because *"colour is the fourth signal, never the first."*

Two other places on the page carry facts:

- `.chips` (`[slug].astro:62-81`) — counters, `serves`, `recipe says <time>`, category.
- `.kit-list` (`[slug].astro:110-116`) — **`You'll need {recipe.cookware.join(' · ')}`**. This is
  the derived list rendered verbatim, and it is the surface a reader would most easily mistake for
  an answer to *what do I wash*.
- `.variants` (`[slug].astro:83-96`) — *"Also written for the Instant Pot, the plain way."* One
  sentence of links. `variants` is built in `parse-recipes.mjs:191-208` and typed at
  `tree.ts:68` as `{ slug, title, kit }[]` — **no other field travels with a variant today.**

## 5. The checker, and what "warns rather than fails" already means there

`scripts/check-recipes.mjs` has exactly two existing severities, and they are already separate:

- **`problems[]`** — printed under `FAIL`, increments `failed`, and `process.exit(1)` at `:249`.
- **`notes[]`** — printed under the `ok` line at `:183` (or appended to the fail block at `:192`),
  and **never touches `failed`**. Today its only producer is `cooklang: <warning>` at `:142`.

So an advisory check has a home already: push to `notes`. Confirmed by the exit expression at
`:249`: `process.exit(failed || (CAPS_FAIL_BUILD && overCap.length) ? 1 : 0)`.

The third mechanism is `CAPS` (`:41-58`) — length ceilings for five fields, enforced
(`CAPS_FAIL_BUILD = true`, `:70`). **The caps table is mirrored in `docs/knowledge/voice.md:135-141`
and that file says "Change the script, then change this."** `docs/knowledge/` is outside this
ticket's allowed paths (`scripts/`, `src/`, `README.md`, `recipes/**`), so adding a sixth cap here
would desynchronise a document I am not permitted to edit.

## 6. The generated data, and who reads it

`scripts/parse-recipes.mjs` walks `recipes/` via `findRecipes()` and writes
`src/generated/recipes.json` (not committed; `README.md:180`). Readers of that file:

- `src/pages/[slug].astro`, `index.astro`, `list.astro`, `menu/[counter].astro`, `search.json.ts`
- `src/lib/collection.test.ts:7`, `src/lib/slack.test.ts:2` — tests import it directly, which is
  how a field gets a collection-wide assertion without a fixture.

`src/lib/plan.ts` and `src/lib/shopping.ts` read `ingredientNames`/`steps` only; neither enumerates
recipe fields, so a new property does not reach them.

## 7. Naming: what a `.cook` file already looks like to a first-time reader

Existing `>> ` keys across the collection: `title`, `category`, `tags`, `servings`, `time`,
`counters`, `aka`, `pairs-with`, `dish`, `kit`, `slack`, `step.N`. Two of the twelve are hyphenated
(`pairs-with`, `step.N`), so a hyphen in a key is established. `>> time:` is the only key whose
value is free prose the site quotes rather than parses (`[slug].astro:45`).

The story (`S-008`, "What this adds") names the field **`washing-up`** and gives the table row:
*"`washing-up` — what is in the sink at the end."*

## 8. Constraints and assumptions I am carrying into Design

**Hard constraints, from the ticket:**

1. Authored, never derived. No formula over `cookware`, timers or steps may produce it.
2. The **count is derived from the list**; an author may never write the number separately.
3. Absent must render as nothing — no empty slot, no zero.
4. Zero is real and must be distinguishable **in the data** from absent.
5. The cookware cross-check **warns**, never fails.
6. Follow the `kit`/`dish`/`slack` path: `normalise.mjs` → `tree.ts` → `check-recipes.mjs` → render.
7. The plate you eat off does not count, and the README must say so.
8. Files outside `recipes/**` limited to `scripts/`, `src/`, `README.md`. **`src/data/counters.json`
   is forbidden.**

**Assumptions surfaced, to be settled in Design:**

- **What else besides the eating plate does not count.** The ticket names one exclusion; the
  collection needs a boundary, or two authors will disagree by one or two items on every line and
  the field stops comparing — the ticket's own stated failure mode. The knife and the chopping
  board are the live question: S-008's gate text says *"The pot and a chopping board"*, which
  reads as counting the board.
- **How the count survives a plural entry.** "two mixing bowls" as one comma-separated entry is one
  item and two things, and nothing in `splitList` can tell.
- **Whether `>> washing-up:` with an empty value is absent or zero.** Cooklang puts the key in
  `raw_metadata.map` with `''`; `slack` treats that as absent (`slack.ts:66`).
- **Whether the variant switcher shows it.** `variants` carries three fields today; adding a fourth
  touches `tree.ts`, `parse-recipes.mjs` and `[slug].astro`. The ticket asks for the argument
  either way, not a particular answer.
- **The Instant Pot worked example.** The acceptance criterion asks for *"one Instant Pot recipe
  that browns in a separate pan first."* From the §2 survey, **no Instant Pot file browns meat in a
  separate pan** — all 25 brown on Sauté in the pot. Two use a second pan for something else, and
  `pho-broth-instant-pot` toasts whole spices in a dry `#skillet{}` *before* the pressure cook.
  Design has to decide what honestly satisfies this rather than inventing a recipe that does.
