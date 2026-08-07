# T-008-01 — Review

`washing-up` exists end to end: a recipe declares the things that go in the sink, the count is
derived from that list and nowhere else, zero is a real answer distinguishable from silence, the
checker refuses a malformed line and warns about a cookware gap, and the fact renders beside the
clock. `npm run verify` exits 0 — 664 files check, 867 tests pass, 688 pages build.

Two things a reviewer should read before the diff: **§4 open concern 1**, where the letter of one
acceptance criterion and the collection disagree, and **§4 open concern 2**, the boundary decision
that changes what S-008's counter gate will admit.

---

## 1. What changed

**New (2 files, 213 lines):**

| File | What it owns |
| --- | --- |
| `src/lib/washing-up.ts` | The type, the only reader, the printed word, and the two advisory checks. Pure — no `fs`, no parser, no Astro. |
| `src/lib/washing-up.test.ts` | 28 tests: 17 unit, 7 collection, 4 that spawn the checker. |

**Modified (7 files):**

| File | Change |
| --- | --- |
| `scripts/normalise.mjs` | Reads `>> washing-up:`, promotes the key out of loose metadata, emits `washingUp` + `washingUpProblem`. |
| `src/lib/tree.ts` | Types both, and adds `washingUpCount` to `variants[]`. |
| `scripts/parse-recipes.mjs` | Throws on a malformed line; fills `washingUpCount`; counts declarations in the summary. |
| `scripts/check-recipes.mjs` | Malformed → `problems` (fails). Cookware gap and plural entry → `notes` (prints, exit 0). |
| `src/components/Timeline.astro` | The fourth well, *What you'll wash*, under `slack`. CSS shared with `.slack` by selector list. |
| `src/pages/[slug].astro` | The variant switcher carries counts, but only when every side has declared. |
| `README.md` | The authoring contract: two example lines, the derived-count rule, the boundary, the plate rule. |

**Annotated (11 `.cook` files):** `ratatouille`, `one-pot-pasta`, `shakshuka`,
`general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork`,
`pho-broth-instant-pot`, `beef-bourguignon-instant-pot`, `beef-bourguignon`, `memphis-dry-rub`.

**Deleted:** nothing. **Not touched:** `src/data/counters.json` (T-007-05 / T-008-02 hold it),
`docs/knowledge/voice.md` (outside permitted paths — see §4.3).

Seven commits, all through `lisa commit-ticket` with exact `--include` paths. Nothing ticket-owned
is left staged, modified or untracked.

## 2. The design in one paragraph each

**Authored, never derived.** No code path reads `cookware`, timers or steps to produce a value.
The evidence for why is reproduced from the files rather than quoted: the four wok recipes declare
exactly `['wok']` and each washes four or five things, and `beef-bourguignon` never names the
skillet its garnish is glazed in. Two-thirds of what those files wash is invisible to the parser.

**The count is `items.length`, taken in one function.** An author has nowhere to write a number,
and a line that states one is a build error. A collection test asserts `count === items.length` for
every declared recipe, so the derivation cannot regress into a second source.

**Absent, zero and malformed are three states with three values.** `null` never declared;
`{ items: [], count: 0 }` washes nothing; a problem string for a line that is there but not whole.
Crucially, `>> washing-up:` with an empty value is a **failure**, not a quiet zero — the strongest
claim the field can make must not be reachable by fumbling a line. This is the one place the reader
deliberately differs from `readSlack`, which folds empty into absent.

**The cross-check warns.** A file naming a `#Dutch oven{}` its line forgets gets a note and still
prints `ok`. It cannot fail the build, because a foil-lined tray is a real answer — and because the
failure that matters runs the other way and no check can see it.

## 3. Test coverage

| Acceptance criterion | Evidence |
| --- | --- |
| a list parses to the right count | `readWashingUp` unit tests over the real lines: 5, 4, 1; collection test asserts `count === items.length` across all 11 |
| zero parses and is not absent | unit: `nothing` / `None` / `NOTHING` / `nothing.` → `{items:[],count:0}` and `not.toBeNull()`; collection: `memphis-dry-rub` |
| a malformed line fails | unit: 4 empty-ish, 4 numeric, 1 stray-sentinel case; integration: exit **1** for `>> washing-up: 2` and for `>> washing-up:` |
| an undeclared recipe renders nothing | collection: 653 recipes are `null`; built HTML: `grep -c "What you'll wash" dist/beef-stew/index.html` → **0** |
| the cross-check warns without failing | integration: fixture naming `#Dutch oven{}` with a line omitting it → **exit 0**, `ok`, and the advisory text |
| the variant switcher cannot lie | collection: every `variants[].washingUpCount` equals its sibling's actual value or `null`; built HTML: `beef-stew` sentence unchanged |
| ≥8 worked examples | 11, including one One Pot washing one thing, **three** of the four wok recipes plus the fourth, and a zero |

**Gaps I would flag to a reviewer:**

- **The render itself is not unit-tested.** Astro components have no test harness in this repo —
  `slack` has the same gap and for the same reason. It is covered by asserting the *data* the one
  `&&` guard reads, plus `grep` over built HTML during implementation. A regression that removed
  the markup would pass the suite.
- **`washingUpWord` above twelve is untested against a real recipe** — no line has thirteen
  entries and probably none should.
- **No test pins the README example lines to what the parser accepts.** If the two drifted, nothing
  would notice.

## 4. Open concerns

### 1. One acceptance criterion asks for a recipe the collection does not contain

The criterion: *"…and **one Instant Pot recipe that browns in a separate pan first**."*

I surveyed all 25 files carrying `kit: Instant Pot`. **None browns meat in a separate pan** — every
one browns on Sauté in the pot, which is the machine's whole selling point. Only two name a second
pan at all. What I annotated instead:

- **`pho-broth-instant-pot`** toasts whole spices in a dry `#skillet{}` *before* the pressure cook.
  A separate pan, browning something, first. This is the closest honest match and I am claiming it
  satisfies the criterion, while saying plainly that the criterion most likely meant meat.
- **`beef-bourguignon-instant-pot`** is annotated beside it because its second pan is the familiar
  shape — a garnish glazed apart while the pot is full.

No recipe was altered to fit and none was invented. If a brown-the-meat-elsewhere example is
wanted, **The Slow Cooker shelf has fifteen of them** (15 of 20 files declare a `#skillet{}` or
`#saucepan{}` beside the cooker), and T-008-03 annotates that shelf. **A human should decide
whether that is acceptable or whether T-008-03 should carry the example instead.** It does not
block anything downstream: the mechanism, the tests and the standard for later tickets are all in
place either way.

### 2. The boundary changes what S-008's gate will admit

The ticket names one exclusion — the plate you eat off — and gives the reason: a thing every
recipe would list stops the field comparing. I applied that reason to the knife and the chopping
board too, and the README says so: *count what holds food; if every recipe on the site would list
it, it does not go in the line.*

**S-008's counter gate illustrates two-or-fewer as *"The pot and a chopping board."*** Under this
boundary that recipe scores **1**, not 2, so the gate reads looser than the story's sentence
implies. The alternative — counting boards — makes every line on the site two items longer and
leaves the comparison unchanged in ordering. **T-008-05 applies the gate and should read this
before it does.** Flagged here rather than discovered there.

### 3. The line has no length cap, and that is a deferral

`slack` has `CAPS['slack reason'] = 200` in `scripts/check-recipes.mjs`. This field has none —
not because a runaway line is fine, but because `CAPS` is mirrored in `docs/knowledge/voice.md`,
which instructs *"Change the script, then change this"*, and `docs/knowledge/` is outside this
ticket's permitted paths. Adding a sixth cap would have left that table silently wrong.

**Follow-up for whoever owns `voice.md` next:** decide a cap, add it to `CAPS`, add the row.
The longest line written so far is 91 characters (`general-tsos-chicken`), so nothing is close to
a problem yet. The plural-entry warning already catches the shape of abuse a cap would catch.

### 4. Smaller notes

- **The plural warning is a guess about English.** `two mixing bowls` is flagged; `a bowl for two
  eggs` is not, because it does not start with the number. It is advisory precisely because it is
  a heuristic.
- **The cross-check's matching is loose in both directions** — `#skillet{}` is accounted for by
  *"the cast-iron skillet"* and vice versa. That is deliberate: an advisory that fires on
  punctuation gets ignored, and an ignored warning costs more than it saves. It will occasionally
  accept a coincidental substring.
- **`NEVER_WASHED` matches whole names only.** This was a word match in Design and would have
  excused `#Dutch oven{}` for containing "oven" — the exact vessel the field exists to talk about.
  Caught before the module had a consumer and pinned by a test.
- **`npm run verify:mobile` was not run.** It drives a browser and is not part of `npm run verify`.
  The new panel reuses `.slack`'s rules by selector list and introduces no new layout, so nothing
  should move — but nobody has measured it at 375px.

## 5. What a later ticket inherits

- **The standard.** Eleven lines, with counts from 0 to 5, and `progress.md` records how each was
  read off its file's steps rather than off its `cookware` array. T-008-03 copies these.
- **The mechanism.** A new annotation needs one line in a `.cook` file. No code changes.
- **The switcher.** As soon as both halves of a dish declare, the comparison appears on both pages
  automatically. `beef-bourguignon` already demonstrates it.
- **The tally.** `npm run recipes` prints `washing-up in N`, so annotation progress is visible on
  every build.
