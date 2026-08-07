# T-008-01 — Design

Nine decisions. Each is stated, the options are weighed against Research, one is chosen, and what
was rejected says why. The two that carry the ticket are **D3 (zero)** and **D5 (the boundary)**.

---

## D1 — The field name

| Option | Against it |
| --- | --- |
| `cleanup` | Category jargon. A cook says "the washing-up", not "the cleanup". |
| `sink` | Reads as a location, not as a list. `>> sink: the wok` is a riddle. |
| `to-wash` | Fine, but the story already named the field, and downstream tickets quote it. |
| **`washing-up`** | — |

**Chosen: `washing-up`.** It is the story's own word (`S-008`, "What this adds"), the hyphen has
precedent in `pairs-with`, and it reads as plain English to somebody opening a `.cook` file cold —
the first acceptance criterion. Research §7 confirms both.

## D2 — What the author writes

`>> washing-up: the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze`

A comma-separated list of things, in a cook's own words, through the same `splitList()`
(`src/lib/meta.ts:4`) that `tags`, `counters`, `aka` and `pairs-with` use. Order and case kept.

**One entry is one thing to wash.** That sentence is the whole contract between the line and the
count, and it is why the count can be derived at all.

Rejected: a count plus a list (`>> washing-up: 5 — the wok, …`). That is the exact failure the
ticket names — *"A recipe that says '2' and then lists three things has told two different
stories."* Rejected: YAML-ish nesting; cooklang metadata is one line, one string.

## D3 — Zero, and how it differs from absent

This is the decision with the most ways to get it wrong.

| Option | Behaviour | Verdict |
| --- | --- | --- |
| A. Empty value — `>> washing-up:` | `raw_metadata.map['washing-up'] === ''` | **Rejected.** Indistinguishable from a line the author started and abandoned, and `slack` already treats `''` as absent (`slack.ts:66`). Silent, and silence is what this field cannot afford. |
| B. `0` | Parses as a number | **Rejected.** The field is a list of things; permitting a number here is permitting the thing D2 exists to forbid. |
| C. A sentinel entry the author lists | e.g. `nothing` | — |

**Chosen: C, the sentinel word `nothing`, with `none` accepted as a synonym.**

```cooklang
>> washing-up: nothing
```

- In the data: `{ items: [], count: 0 }` — **declared, and empty.**
- Never declared: `null`.
- `washingUp !== null && count === 0` is zero; `washingUp === null` is absent. The two states are
  different types, not two readings of the same value, which is what "distinguishable in the data"
  has to mean if a test is to hold it.

The sentinel is matched case-insensitively on the **whole line only**. `nothing` inside a list —
`the jar, nothing` — is a malformed line, not a zero, because it is a typo wearing a keyword.

**A bare empty list is a hard error, not a quiet zero.** `>> washing-up: ,` and `>> washing-up:  `
produce `items.length === 0` out of `splitList`, and if that were allowed to mean zero, then a
line an author fumbled would silently claim the strongest thing the field can say. So the reader
distinguishes *absent* (key missing entirely → `null`) from *present but empty* (key there, no
items, not the sentinel → **problem**). Message names the sentinel, so the fix is one word.

## D4 — The shape in the data

```ts
export interface WashingUp {
  /** The things, in the author's own words and order. Empty is a real answer: nothing. */
  items: string[];
  /** items.length. Derived here and nowhere else, so the two can never disagree. */
  count: number;
}

export interface WashingUpReading {
  washingUp: WashingUp | null;   // null = never declared
  problem: string | null;        // null = absent (fine) or whole
}
```

`count` is stored rather than computed at each call site **because it is computed in exactly one
place** — the constructor of the only reader — and every consumer then reads the same number. The
alternative (no `count`, everyone calls `.items.length`) is equivalent but invites a second
derivation to appear later next to a `<b>` tag. Deriving once and carrying it is the same shape
`slack` uses for `level`/`reason` and `pairs-with` uses for the mutual set.

`{ washingUp, problem }` mirrors `SlackReading` exactly (`src/lib/slack.ts:47-51`), so the two
fields behave identically at every stage of the pipeline and a reader of `normalise.mjs` meets one
pattern twice rather than two patterns once.

## D5 — What counts, and what does not

The ticket gives one exclusion — *"Do not count the plate you eat off"* — and one reason:
*"Otherwise every recipe on the site declares one more thing than the next author thinks it should,
and the field stops comparing."*

**That reason applies to more than the plate.** A knife and a chopping board are used by almost
every recipe in the collection. If they count, then every line carries the same two items, the
number is inflated by a constant, and the comparison the field exists for — 1 versus 5 — is
unchanged in ordering and worse in legibility. Applying the ticket's own stated test, they are the
plate again.

**Chosen boundary, in the README's words:**

> Count the things that **hold food**: the pans, the pots, the bowls, the sieves, the racks, the
> machine parts. Do not count the plate you eat off, the knife and board you prepped on, or the
> spoon you stirred with. If every recipe on the site would list it, it does not go in the line.

Rejected alternative: *count anything that needs washing, and let the author judge.* That is the
inconsistency the ticket forecasts, one ticket earlier than it forecast it. T-008-03 annotates
several hundred files; two annotators disagreeing about boards makes the whole pool
non-comparable, and no check can catch it.

**Known consequence, flagged rather than hidden.** S-008's counter gate says *"`washing-up` of two
or fewer. The basket and a plate. The pot and a chopping board."* Under this boundary a board is
not counted, so the gate reads slightly looser than the story's illustration implies: a pot-plus-a-
board recipe scores **1**, not 2. That is T-008-05's to apply and this artifact says so out loud
rather than letting a later ticket discover it. The alternative — counting boards — makes the story
sentence literal at the cost of making every line on the site two items longer.

## D6 — Validation: what fails, and what only warns

**Fails the file** (`problems[]` in `check-recipes.mjs`, `throw` in `parse-recipes.mjs` — the same
two places `slackProblem` lands, Research §5):

| Line | Why it fails |
| --- | --- |
| `>> washing-up:` (nothing after the colon) | Half-declared. D3. |
| `>> washing-up: ,` / `, ,` | Same, wearing punctuation. |
| `>> washing-up: 2` | A number where the list goes. The one thing the ticket forbids by name. |
| `>> washing-up: 3, 2` | Same, spread over entries. |

Every message ends with a good line, because the point of the field is that a stranger can write
one: *"…e.g. `>> washing-up: the Dutch oven, a chopping board` — or `>> washing-up: nothing`."*
This is the same instinct as `slack.ts:88-89`.

**Warns only** (`notes[]` — printed, never increments `failed`; Research §5 proves the channel
exists and is already used):

1. **Cookware unaccounted for.** Every `#thing{}` in the file that is neither matched somewhere in
   the washing-up line nor a fixture. *"names #Dutch oven{} but the washing-up line does not
   mention it — either add it or it is something that is not washed."*
2. **A plural entry.** An entry beginning `two`/`three`/`2`/`3`… counts as one and means several,
   so the derived count understates. *"`two mixing bowls` counts as one thing; write them as two
   entries."* This one exists purely to defend the D2 contract, which is the ticket's central
   invariant, and it costs nine lines.

Both are advisory because **the interesting failure is the opposite direction and no check can
catch it** (the ticket's words): the bowls a recipe uses and never names. A checker that failed on
the direction it *can* see would spend its credibility on the cheap half.

**Fixtures — cookware that is never washed:** `oven`, `hob`, `stove`, `stovetop`, `range`, `grill`,
`broiler`, `smoker`, `microwave`, `fridge`, `freezer`, `worktop`, `counter`, `sink`. Matched on the
normalised name, substring-tolerant, so `#toaster oven{}` and `#outdoor grill{}` land correctly.
This list is deliberately short: it holds only what is bolted down or plugged in. Everything else
is the author's judgement, which is the whole premise of an authored field.

Matching is deliberately loose in both directions — `#Dutch oven{}` is accounted for by
*"the Dutch oven"* and by *"a Dutch oven, scraped"* — because a strict match would fire on
punctuation and an advisory that cries wolf gets ignored, which costs more than it saves.

## D7 — No length cap

`slack` has one (`CAPS['slack reason'] = 200`). This does not get one.

The reason is not that a long line is fine; it is that `CAPS` is mirrored in
`docs/knowledge/voice.md:135-141`, which says *"Change the script, then change this"* — and
`docs/knowledge/` is outside this ticket's permitted paths. Adding a sixth cap would leave that
table wrong, and a documented invariant broken quietly is worse than a cap deferred openly.

Recorded in Review as a follow-up for whoever owns `voice.md` next. The plural-entry warning (D6)
already catches the shape of abuse a cap would catch — a line trying to be a paragraph.

## D8 — The render

Beside the clock, as a fourth well under `slack`, in `src/components/Timeline.astro`. Same
full-width `.slack` treatment (Research §4), same `<dt>` / `<dd><b>…</b> — …</dd>` grammar, so the
four facts read as one family:

| | |
| --- | --- |
| Start to finish | *at least 1 hr 20 min* |
| Needs you | *about 35 min* |
| If you get it wrong | **Narrow** — once the chicken is tossed in the glaze… |
| **What you'll wash** | **Five things** — the wok, a bowl to velvet in, a dish to dredge in, … |

- **Heading: "What you'll wash."** Second person, verb-forward, a thing you would say. Rejected:
  "Washing-up" (the key, not a label), "In the sink" (a place), "Cleanup" (jargon).
- **The count leads in bold, the author's list follows.** The ticket says the *line* is a list and
  not a number — that is a rule about what the author writes. The render may show the derived
  count, and it is the whole payoff: *Five things* next to *One thing* is the comparison the shelf
  promises. Both are on screen, so neither can be checked without the other.
- **Number words to twelve, digits above.** "Five things" reads; "13 things" is a number by then
  anyway. `one thing` is singular.
- **Zero renders `Nothing to wash`, alone, with no dash and no list.** It is the strongest thing
  the field can say and it says it in three words.
- **Absent renders nothing at all** — one `{washingUp && …}` guard, exactly like `slack`
  (`Timeline.astro:300`). No empty slot, no zero, no "not declared".
- **No colour, no icon.** `Timeline.astro:488-491` states the rule for this panel and it holds here.

## D9 — The variant switcher — argued both ways, then decided

`src/pages/[slug].astro:83-96` renders *"Also written for the Instant Pot, the plain way."*
`variants` carries `{ slug, title, kit }` (`tree.ts:68`).

**For showing the count.** The ticket's own argument: *"a reader choosing between `beef-stew` and
`beef-stew-instant-pot` is choosing an evening."* That choice is made in that sentence, before the
reader has opened either page, and it is the only place on the site where two ways of cooking one
dish sit side by side. A washing-up count that only appears after you commit to a page arrives too
late to decide anything.

**Against.** The pool is annotated by T-008-03, not by this ticket; 650-odd files will carry
nothing for some time. A switcher reading *"Also written for the Instant Pot (3 things to wash)"*
next to a plain version that declares nothing invites the reader to conclude the plain one washes
none — the field's absent state leaking as a claim, which is precisely what D3 and D8 spend their
effort preventing.

**Chosen: show it, but only when every side has declared.** The current recipe and every variant in
the group must have a non-null `washingUp`; otherwise the sentence renders exactly as it does
today. All-or-nothing is the only rule that cannot produce a false comparison, and it degrades to
the current behaviour rather than to a worse one.

Cost: `variants` gains a fourth field, `washingUpCount: number | null`, set in
`parse-recipes.mjs:191-208` where the group is already in hand, and typed at `tree.ts:68`. Three
files, no new mechanism.

---

## The worked examples, chosen

Ten files. The acceptance floor is eight; the extra two are the zero and the variant pair, both of
which are load-bearing for a test.

| File | Line | Count | Why this one |
| --- | --- | ---: | --- |
| `ratatouille` | the Dutch oven | **1** | One Pot, and it genuinely washes one thing. The criterion's file. |
| `one-pot-pasta` | the deep skillet | **1** | One Pot; the pasta never meets a colander, which is that shelf's whole argument. |
| `shakshuka` | the cast-iron skillet | **1** | One Pot; it is served in the pan (`step.6`), so even the serving dish is not a second thing. |
| `general-tsos-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | **5** | One of the four. Declares one `#wok{}`. |
| `orange-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | **5** | Second of the four. |
| `sweet-and-sour-pork` | the wok, a bowl to marinate in, a dish to dredge in, a rack to drain on | **4** | Third of the four; the sauce is a separate recipe, so four not five. |
| `sesame-chicken` | (as Tso's) | **5** | Fourth of the four — completes the set the gaps page names. |
| `pho-broth-instant-pot` | the Instant Pot, a skillet for the spices, a fine sieve, the sachet cloth | **4** | **The Instant Pot example.** See below. |
| `beef-bourguignon-instant-pot` | the Instant Pot, a skillet for the garnish, a plate for the lardons | **3** | The other IP file with a second pan; the near half of the variant pair. |
| `beef-bourguignon` | the Dutch oven, a skillet for the garnish, a plate for the lardons | **3** | The far half, so D9's all-declared rule actually fires somewhere. |
| `memphis-dry-rub` | nothing | **0** | The zero. Names no cookware at all; a dry blend genuinely mixes in the jar it is kept in. |

**On "one Instant Pot recipe that browns in a separate pan first."** Research §2 surveyed all 25
Instant Pot files: **none browns meat in a separate pan** — every one browns on Sauté in the pot,
which is the machine's entire selling point. Two use a second pan for something else.
`pho-broth-instant-pot` **toasts whole spices in a dry `#skillet{}` before the pressure cook**
(step 3) — a separate pan, browning something, first — and is annotated as the example.
`beef-bourguignon-instant-pot` is annotated beside it because its second pan is the more familiar
shape (a garnish glazed apart). Neither is a fabrication and no recipe was altered to fit; if the
criterion wanted a brown-the-meat-elsewhere file, **The Slow Cooker shelf has fifteen of them**
(Research §2) and T-008-03 will reach them. Recorded in Review as the one place the letter of a
criterion and the collection disagree.
