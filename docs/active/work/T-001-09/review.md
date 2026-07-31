# T-001-09 — Review

**32 recipe files created. 0 modified. 0 deleted. Nothing outside `recipes/**`.**
The Curry House goes from **15 shelved to 47**, all 47 naming it and no other counter, against
an acceptance floor of 22 and 20.

---

## What changed

Nine commits, each a self-contained unit that passed the checker before it landed.

| Commit | What it added |
| --- | --- |
| `8bb0e03` | `ginger-garlic-paste`, `onion-tomato-masala` |
| `e47bc27` | `makhani-gravy`, `vindaloo-paste`, `paneer`, `birista` |
| `0d81266` | `butter-chicken`, `korma`, `rogan-josh` |
| `a47f36c` | `bhuna`, `dopiaza`, `jalfrezi`, `karahi` |
| `aae42b0` | `madras`, `vindaloo`, `dansak`, `patia` |
| `a8c4de7` | `balti`, `passanda`, `palak-paneer` |
| `4c216f1` | `papadom`, `mango-chutney`, `lime-pickle`, `mint-chutney`, `kachumber`, `raita` |
| `1124a79` | `samosa`, `onion-bhaji`, `chicken-tikka`, `seekh-kabab` |
| `cb171ad` | `biryani`, `pilau-rice` |

By folder: 13 in `stews-and-braises/`, 5 in `dressings-and-dips/`, 2 in `sauces-and-gravies/`,
2 in `spice-blends-and-marinades/`, 2 in `flatbreads-and-pancakes/`, 2 in
`rice-beans-and-grains/`, 2 in `smoked-and-grilled/`, 1 each in `dumplings-and-rolls/` and
`salads/`. **No new category folder was needed.**

### The three things the ticket actually complained about

1. **"The sauce list has two entries."** It has fifteen. All thirteen printed lines from the
   ranked list — butter chicken, korma, rogan josh, bhuna, dopiaza, jalfrezi, madras, vindaloo,
   dansak, karahi, balti, passanda, patia — are written, plus the two that were already there.
2. **"Ten printed lines rest on one onion-tomato masala base that does not exist yet."** It
   exists: `recipes/sauces-and-gravies/onion-tomato-masala.cook`, and nine of the new sauces
   carry it as an ingredient row rather than re-deriving it in three steps each.
3. **"The chutney tray has none. There are no starters at all."** The tray is
   `papadom` + `mango-chutney` + `lime-pickle` + `mint-chutney` + `kachumber`, wired to each
   other through `pairs-with`; the starters are `samosa`, `onion-bhaji`, `chicken-tikka` and
   `seekh-kabab`. `raita` is beside them.

`madras-curry-powder` and `tandoori-marinade` — two components that had been sitting on the
shelf with nothing under them — now each have their dish.

## Test coverage

There are no unit tests to write here: this ticket adds data, not code, and the code that
reads it (`src/lib/tree.ts`, `layout.ts`, `label.ts`, `time.ts`) is untouched and already
tested. The equivalent of a test suite is `scripts/check-recipes.mjs`, which parses each file,
builds its merge tree, lays out the grid and asserts that every cell tiles exactly once.

| Check | Command | Result |
| --- | --- | --- |
| every file draws a table | `node scripts/check-recipes.mjs` | `all 410 file(s) draw a table.` |
| label staircases | `--labels` on each batch | read at every one of the nine steps |
| shelved count | `grep -rl "Curry House" recipes/ \| wc -l` | **47** |
| exclusivity | `grep -h '^>> counters:' <those 47> \| sort \| uniq -c` | one line, `47 >> counters: Curry House` |
| every timer named | `grep -n '~{'` over the 32 | no output |
| required metadata | `title`/`category`/`tags`/`servings`/`counters`/`aka`/`pairs-with`/`time` on each of the 32 | none missing |
| `pairs-with` resolves | `npm run recipes` | `parsed 410 recipe(s) … pairings 347` |
| scope | `git status --short -- recipes/ src/` | empty |

410 rather than Research's 325: other tickets are landing on the same branch concurrently.
Everything passing means nothing here broke anything theirs, and nothing theirs broke this.

**The gap the checker cannot close** is whether the quantities are right for the stated
servings and whether the method is the canonical one rather than a shortcut wearing the name.
No tool tests that. What was done instead: each file was written to the thing that actually
distinguishes the dish, and the distinguishing fact is stated in the file's closing prose row
where a reader will see it — bhunao is twenty minutes of frying down, do-piaza is onions
twice, dum is the sealed lid, a samosa is fried at 300°F and not 375°F, mustard oil is heated
to smoking and cooled, pasanda is the cut. Those closing rows are the honest audit trail.

## Open concerns

**1. The counter page will not print these until T-001-17 runs.** `src/data/counters.json`
still lists the eight old sections (two sauces, four breads, and so on). That file is
T-001-17's and this ticket is forbidden to touch it. The 32 files *are* shelved — the build
reads `counters:` off each recipe — but the Curry House's printed section list is now badly
out of date, and nothing here can fix it. **This is the one thing a human should know.**

**2. Ranked items 12–20 are deliberately not written.** Named with reasons in `structure.md`
§5, repeated here in short:

- **12, the vegetable column** (saag aloo, bombay aloo, bhindi bhaji, aloo gobi, baingan
  bharta) — five files, below the line drawn at item 11, with the count already at more than
  twice the floor.
- **13, the naan variants** (garlic, keema, peshwari, tandoori roti, poori) — `naan` already
  exists and carries `dish:`/`kit:` machinery built for exactly this. Using it well is a
  bigger decision than five files.
- **14–19, the tiffin grid** (sambar, coconut chutney, idli, medu vada, uttapam, rava dosa, ven
  pongal, curd rice, upma, tamarind rice, bisi bele bath) — the gap doc says these become their
  own **Dosa Counter**, and they stand on a dosa/idli batter it also flags as the one
  preparation the build refuses to split four ways. Writing them onto a curry-house shelf would
  pre-empt a board decision.
- **16–17, 20** (gulab jamun; mango lassi, masala chai, filter kaapi; rava kesari, mysore pak) —
  below the line. `drinks/` has one file in it, and three drinks plus a `chai-masala` under
  them is a shelf decision.
- **phal** — the reference says it exists mainly as a dare, and its entire content is "the
  madras with four times the chile": a table identical to `madras` in every cell but one.

**3. Four components in the gap doc are not files, on purpose.** `ghee` (one ingredient) and
`tamarind pulp` (two) fall below the checker's `rowCount < 3` floor and cannot be files here;
both are written inline where used. `cashew paste` and `Kashmiri chile paste` are folded into
`korma` and `rogan-josh` — pulled out, each dish reduces to "simmer the paste in cream" and
stops being a recipe.

**4. Nothing for T-001-18.** All 68 ranked and component names were checked against the 325
basenames present at Research and none existed, so there is no case of "a dish that exists and
only needs this counter added". T-001-18's artifact gets no entry from this ticket.

**5. `chana-masala` could now consume the base.** It derives an onion-tomato masala inline
across its steps 2–4 — the exact duplication `onion-tomato-masala` exists to end. That file
belongs to another ticket, so it was left alone. Someone should pick it up.

**6. The tandoor problem is stated, not solved.** `chicken-tikka` and `papadom` both say in
prose what the home version costs against the real thing (480°C clay wall; shop-bought dried
papadoms are what every curry house actually uses). `naan`, which the gap doc says should
declare which one it is, was not touched — it is not this ticket's file.

## Known limitations

- **Sameness risk across ten sauce lines** was the design's central worry. Mitigated by writing
  each to its own method and by reading the `--labels` staircases of `bhuna`/`dopiaza`/
  `jalfrezi`/`karahi` side by side at step 4 and `madras`/`vindaloo`/`dansak`/`patia` at step 5.
  It is a judgement, not a measurement, and it is the thing worth a reviewer's eye.
- **`kachumber` sits exactly on the `colCount` floor** at 10 rows × 3 columns. It is a salad
  with one real operation; the two preparation steps that save it (onion in ice water, cucumber
  and tomato salted and drained) are genuine technique, not padding.
- **The sauce-across-protein grid is prose, not structure.** Every sauce's closing row says
  what else the sauce runs across and what changes — the only place the build lets that fact
  live. Search still works, because the protein names are in `aka`.
- **The diacritics criterion is satisfied trivially.** No title and no `aka` entry in the 32
  contains a non-ASCII character, so every name is already a form typed without diacritics.
  Where a dish has genuinely competing English spellings, they are all in `aka` — poppadom /
  papadum / papad, dhansak / dansak, pasanda / passanda, kadai / karahi, bhoona / bhuna.

## What a reviewer should look at first

1. `recipes/sauces-and-gravies/onion-tomato-masala.cook` — nine files stand on it.
2. The four staircases from commit `a47f36c` read together. If those read the same, the shelf
   has one recipe on it four times.
3. `recipes/rice-beans-and-grains/biryani.cook` — three branches merging at the layering step,
   the only non-trivial tree in the ticket.
