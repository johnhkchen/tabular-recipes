# T-002-06 — Design

Research says the shelf has no leafy salad, the checker will take almost any well-formed tree,
and the real constraints are the icon verb table, the one-parent tree rule, and the ban on
re-teaching a dressing. What is left to decide is **which salads, and what shape each one
takes**.

---

## Decision 1 — What counts as a salad worth a table

### Options

**A. Leaf-plus-dressing, twelve of them.** House salad, chopped salad, Greek, Caesar, kale,
spinach — write them as the board prints them, three or four ingredients each, dressing named in
`pairs-with:`.

**B. Only salads with a made component.** Every file must contain something the cook produces:
croutons baked, nuts candied, bacon rendered, chickpeas crisped, a vegetable roasted, an egg
jammy, an onion pickled, a leaf massaged.

**C. Salads as assemblies of existing recipes.** `pairs-with: caesar-dressing, sour-dill-pickles`
and a step that says "arrange".

### Chosen: B

The ticket states it outright ("at least three operations that are not tossing, and at least one
made component or cooked element") but the checker enforces it independently and that is the
more interesting reason. `colCount >= 3` means at least two chained operations, and
`rowCount >= 3` means at least three ingredient rows — a leaf-plus-dressing salad has one
operation over four leaves and **fails the check as "only one operation — nothing merges, so the
table is a list."** Option A is not merely thin; it does not build.

Option C fails the same way and additionally fails the ticket's no-duplication rule by being
nothing but references.

The design rule that falls out, and that every file below is checked against:

> **Two of the columns are made, not bought.** One branch of the tree cooks something (croutons,
> bacon, chickpeas, nuts, a roasted vegetable, an egg); one branch cures or macerates something
> ahead (pickled onion, salted tomato, massaged kale, shaved fennel in acid); the last operation
> brings them together. That is three columns, which is a table, and it is also what makes the
> salad worth eating.

## Decision 2 — Dressings: reference, or build in the bowl

### Options

**A. Always `pairs-with:`.** Never a dressing ingredient in a salad file.

**B. Always build in the bowl.** Ignore the drawer; every salad dresses itself.

**C. Reference by default; build in the bowl only where the building is the method.**

### Chosen: C

The ticket allows exactly this and the collection already demonstrates both halves.
`fattoush` whisks its own sumac dressing in step 2 because the pomegranate-molasses ratio *is*
the recipe; `larb-gai` dresses off the heat because the warmth is the point.

The line this design draws:

- **Reference** when the drawer holds that dressing under its own name and the salad merely
  receives it: `caesar-dressing`, `blue-cheese-dressing`, `green-goddess-dressing`,
  `goma-dare`, `ranch-dressing`, `basic-vinaigrette`.
- **Build in the bowl** only when the dressing cannot exist away from the salad — a warm bacon
  vinaigrette made in the pan the bacon rendered in, a panzanella dressed by the juice the
  salted tomatoes gave up, a Greek salad dressed by oregano oil poured over warm feta. In each
  case the dressing is a *step of this dish*, not a jar. None of these three exists in
  `dressings-and-dips/`, so nothing is re-taught either way.

A dressing referenced in `pairs-with:` is never also listed as ingredients. That is the
operational form of "do not rewrite the dressings."

## Decision 3 — Which twelve, and in what order

The gaps page ranks only three salads (6 Kale Caesar, 7 Shaved Brussels, 13 chopped salad, the
last of which Goop prints as three distinct items). The ticket says to write the top of that
list **in that order, as far as the count reaches** — so ranks 6, 7 and 13 come first and the
artifact must name what the rest came from.

The rest come from the same reading the gaps page was built on: the American composed-salad
board that every one of these counters also prints, and that has zero representation on the
site. Ordered by how conspicuously a cook would miss them.

| # | Slug | Source | The made component | Dressing |
| --: | --- | --- | --- | --- |
| 1 | `kale-caesar` | gaps rank 6 | sourdough croutons baked in the parmesan fat; massaged kale | `pairs-with: caesar-dressing` |
| 2 | `shaved-brussels-salad` | gaps rank 7 | hazelnuts toasted; sprouts shaved and stood in lemon | built — lemon and pecorino in the bowl |
| 3 | `italian-chopped-salad` | gaps rank 13 (*The Goop Father*) | chickpeas crisped; everything cut to one size | built — red wine and oregano |
| 4 | `chinese-chicken-salad` | gaps rank 13 (*Brentwood*) | wonton strips fried; chicken poached and pulled | `pairs-with: goma-dare` |
| 5 | `harvest-chopped-salad` | gaps rank 13 (*Fall Harvest*) | squash roasted; pecans candied | `pairs-with: basic-vinaigrette` |
| 6 | `cobb-salad` | the board | bacon rendered; eggs jammy; chicken poached | `pairs-with: blue-cheese-dressing` |
| 7 | `wedge-salad` | the board | bacon rendered; shallots quick-pickled | `pairs-with: blue-cheese-dressing` |
| 8 | `greek-salad` | the board (horiatiki) | tomatoes salted; onion macerated; feta under warm oregano oil | built |
| 9 | `panzanella` | the board | bread torn and crisped in oil | built — the tomato juice is the dressing |
| 10 | `spinach-salad` | the board | bacon rendered, mushrooms seared in the fat, dressing built in the pan | built — warm bacon vinaigrette |
| 11 | `salade-nicoise` | the board | potatoes boiled, beans blanched, eggs jammy, tuna seared | built — lemon and mustard |
| 12 | `roasted-beet-salad` | the board (gaps rank 21 names the hole) | beets roasted in salt; walnuts candied; goat cheese marinated | `pairs-with: basic-vinaigrette` |

Twelve rather than ten, because two of the twelve are the same technique family (`cobb` and
`wedge` both render bacon; `spinach` renders it again into a dressing) and the ticket's floor is
ten — writing twelve leaves room to drop one at Review if it turns out thin, without going under.

### What is deliberately not written here

- **A plain house salad or a plain Caesar.** One operation over leaves. Fails the checker,
  fails the ticket, and `caesar-dressing` plus a bag of romaine is not a recipe. The kale
  version is written instead because massaging and croutons give it a tree.
- **The Harvest Bowl** (gaps rank 8), **quinoa/farro/wild rice** (rank 4), **teriyaki bowl**
  (19), **warm grain base** (22) — T-002-05's.
- **Roasted sweet potato, charred broccoli, roasted cauliflower, crispy chickpeas, pickled red
  onion, whipped feta, the seven-minute egg, sesame kale, toasted seeds, pulled chicken**
  (ranks 1, 2, 3, 9, 10, 11, 16, 17, 18, 20) — T-002-07's, as standalone component recipes.
  Several of those techniques appear *inside* a salad here (a salad that roasts its own squash,
  crisps its own chickpeas, pickles its own shallot), which is not duplication: the component
  recipe teaches the component, and the salad's version is one branch of a larger tree with the
  quantity and cut this salad wants.
- **Lemon herb tahini, Greek vinaigrette, balsamic, carrot-ginger** (ranks 12 and the components
  list) — dressings, and this ticket does not write dressings.

## Decision 4 — Where the files live and what they are called

### Options

**A. `recipes/salads/`, alongside the ten that exist.**
**B. A new folder, `recipes/leafy-salads/`.**

### Chosen: A

`category` falls back to the title case of the folder, so a new folder invents a 28th category
for no gain, and `recipes/salads/` is exactly what these are. The acceptance criterion's check
command is `recipes/*/<slug>.cook`, which is folder-agnostic. Every new file states
`category: Salads` explicitly, as all ten existing ones do.

Slugs are the board name, kebab-cased, singular where the board is singular. `aka:` carries the
rest — the generic ("chopped salad", "house salad"), the specific ("the Goop Father"), the
misspellings ("nicoise", "niçoise", "panzanela"), and the thing people actually type.

## Decision 5 — Tree shape

Every recipe is the same shape, varied by how many branches feed the trunk:

```
  ingredients ──▶ [make the component]  ──┐
  ingredients ──▶ [cure/macerate ahead] ──┼──▶ [dress / toss / arrange]  = the root
  ingredients ─────────────────────────────┘
```

Constraints this respects, from Research:

- **One parent per step.** Each `@&(~n)` preparation is consumed exactly once. Where a salad
  wants a component in two places (croutons on top *and* in the toss), it goes in one place —
  the tree cannot say otherwise and the recipe is not worse for it.
- **One root.** The last step consumes every loose branch. Written last, checked by eye against
  the branch list before running the checker.
- **Header rows** (a step with no ingredients and no refs) carry the oven preheat and the closing
  note, exactly as `beef-stew` does. They draw no icon and take no verb constraint, so the
  "serve it within ten minutes" note lives there rather than being crushed into a cell.

## Decision 6 — Labels

Every step gets a `>> step.N:` override. Two reasons, both from Research: the derived label from
a real sentence is usually mangled, and the leading word of the label is asserted against
`VERB_ICONS` across the whole collection by `icons.test.ts`, which this ticket may not edit.

So the label vocabulary is fixed in advance, and every label opens with one of:

> roast · bake · toast · fry · sear · render · crisp · char · blanch · boil · poach · simmer ·
> pickle · marinate · chill · massage→**rub** · chop · slice · shred · grate · halve · quarter ·
> tear→**throw** · whisk · toss · stir · mix · combine · fold · dress · drizzle · pour · spoon ·
> scatter · sprinkle · season · salt · arrange · layer · lay · nestle · stack · pack · drain ·
> rinse · squeeze · stand · rest · macerate · wilt · cool · soak

Two words a salad writer reaches for are **not** in the table and are recorded here so the
Implement phase does not rediscover them: **`massage`** (kale) and **`tear`** (bread, leaves).
`rub` carries the massage — it is the same hand doing the same thing — and `throw` is already
the collection's word for bread going in last (`fattoush` step 5). Neither is a compromise in
meaning.

`--labels` is run on every file and the printed staircase read as prose before the file is
considered done; a label that reads like a fragment gets reworded even when the checker is
happy.

## Decision 7 — Verification

Three gates, run in this order:

1. `node scripts/check-recipes.mjs --labels recipes/salads/<slug>.cook` per file, as it is
   written. Catches the tree, the tiling, the counter name, the missing metadata and the empty
   label.
2. `node scripts/check-recipes.mjs` over the whole collection once all twelve exist. Catches
   nothing new for these files but proves nothing else was disturbed.
3. `npx vitest run` at the end. This is the only gate that sees the icon verb table, the
   pairing mutuality and the dangling-slug check, and it is the one that fails if a
   `pairs-with:` slug was mistyped or a label opened with `massage`.

Gate 3 runs against `src/generated/recipes.json`, so `npm run build`/`parse-recipes` has to
regenerate before the tests mean anything for new files. That ordering is Plan's problem; it is
recorded here because getting it wrong produces a green test run that proves nothing.

A fourth, human gate: every `pairs-with:` slug is confirmed with `ls recipes/*/<slug>.cook`
before it is written, not after.
