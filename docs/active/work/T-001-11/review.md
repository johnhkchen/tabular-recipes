# T-001-11 — Review

The Shawarma Counter goes from 21 recipes to 44, and from nothing on the spit to four
proteins, the rice under them, the sauces over them, and the mezze list around them.

## What changed

**23 files created. 0 modified. 0 deleted.** All under `recipes/`. Four commits, all through
`lisa commit-ticket`.

| Commit | Files |
| --- | --- |
| `d39dbea` | `spice-blends-and-marinades/shawarma-spice` · `dressings-and-dips/labneh` · `dressings-and-dips/white-sauce` · `sauces-and-gravies/pomegranate-molasses` · `toppings-and-pickles/sumac-onions` · `sauces-and-gravies/attar` |
| `b13490a` | `smoked-and-grilled/chicken-shawarma` · `smoked-and-grilled/gyro-meat` · `fried-and-crispy/falafel` · `rice-beans-and-grains/yellow-rice` · `smoked-and-grilled/shish-tawook` · `smoked-and-grilled/kafta` |
| `a2559cd` | `salads/fattoush` · `toppings-and-pickles/kabis` · `fried-and-crispy/batata-harra` · `rice-beans-and-grains/ful-medames` · `fried-and-crispy/kibbeh` |
| `837c5e6` | `flatbreads-and-pancakes/manakish` · `flatbreads-and-pancakes/lahm-bi-ajeen` · `dumplings-and-rolls/fatayer` · `dumplings-and-rolls/sambousek` · `bars-and-brownies/baklava` · `cookies/maamoul` |

No new folder was needed. `src/` was not touched — `src/data/counters.json` still prints the
counter's old section list, and that file is T-001-17's.

## Acceptance criteria, one at a time

**1. ≥26 shelved, ≥18 exclusive.**

```
$ grep -rl "Shawarma Counter" recipes/ | wc -l
44
$ grep -h '^>> counters:' $(grep -rl "Shawarma Counter" recipes/) \
    | sed 's/>> counters: *//' | grep -c '^Shawarma Counter$'
36
```

44 against a floor of 26; 36 against a floor of 18. Twenty-one of the twenty-three new files
name this counter alone. The two that name a second are `manakish` and `baklava`, both at
`Shawarma Counter, Bakery`, and both because `docs/gaps/bakery.md` asks for them in writing
(lines 69 and 79 — baklava's entry reads "*see also Shawarma Counter*").

**2. The top of the gap doc written, in order; skips named with reasons.**

Written in ranked order: item 1 chicken shawarma, 2 gyro meat, 3 falafel, 5 yellow rice,
6 shish tawook and kafta, 7 labneh, 8 fattoush, 9 kabis, 10 batata harra, 11 ful medames,
12 kibbeh, 13 all four bakery items, 14 both sweets. Plus five components items 1–14 assume
and cannot state (`shawarma-spice`, `white-sauce`, `pomegranate-molasses`, `sumac-onions`,
`attar`).

**Item 4, `chicken-over-rice`, was deliberately not written.** The gap doc lists it as
missing and *also* rules it out in "What it could not stock": "*'Chicken over rice' is three
finished tables and a scoop … a table cannot express a permutation.*" The ticket states that
section is not a to-do list, so the reasoned entry wins. What is written instead is every
table the plate is a scoop of. **This is the one judgement call in the ticket a reviewer
should check.** Full skip list with reasons in `progress.md`.

**3. `check-recipes.mjs --labels` reports ok; labels read as a cook's verbs.**

All 23 report `ok`. Column counts 4–6, row counts 3–16. No `cooklang:` warnings. The full
collection also passes: `all 434 file(s) draw a table.` Sample staircase:

```
  ok   recipes/smoked-and-grilled/gyro-meat.cook  9 rows x 6 cols
       wring the onion dry
         process to a smooth paste 3 min
           press into the tin, bake 1 hr in a water bath
             weight and chill 4 hr
               slice thin, crisp 2 min
```

**4. `title`, `category`, `tags`, `servings`, `counters`, and `aka` where relevant.**

All six present in all 23 files, verified by sweep. `aka` is generous throughout and carries
the transliteration spread `docs/knowledge/counters.md` records as least stable at this
counter. Every list has a diacritic-free form; the only three diacritics used (`döner`,
`köfte`, `döner spice`) each sit beside their plain spelling.

**5. Every timer named.**

`grep -n '~{'` over the 23 files returns nothing. All 62 timers are named, and — the part a
grep does not cover — every name is in `UNATTENDED` or `HANDS_ON` in `src/lib/time.ts`.
That matters because an unrecognised name is treated as no name at all; `~blind bake` is the
recorded example. Names used: bake, beat, chill, cool, drain, dry, fry, grill, knead,
marinate, prove, rest, roast, sear, simmer, soak, stand, steam, toast.

**6. Real quantities; the canonical method, not a shortcut wearing the name.**

Quantities are scaled to each file's stated `servings`. The methods that most invite a
shortcut were written the long way and the prose says why:

- **`falafel`** — dried chickpeas soaked 24 hours and ground **raw**. Canned chickpeas are
  named in the file as the thing that does not work and why.
- **`gyro-meat`** — the meat is processed to a paste for three minutes. This is the step home
  versions skip and it is why their loaf crumbles instead of slicing.
- **`batata-harra`** — tossed off the heat. Cooking the garlic and cilantro is named as the
  version that is not the dish.
- **`maamoul`** — the semolina rests twelve hours with the butter before any liquid.
- **`baklava`** — cut before baking; cold syrup onto the hot tray, with the reason.
- **`kabis`** — the pink is one beet wedge bleeding over four days, not dye.
- **`yellow-rice`** — turmeric, not saffron, as the gap doc insists.

**7. Only `recipes/**` modified.**

`git status --porcelain` shows no `recipes/` entry. The remaining entries are Lisa's own —
other tickets' frontmatter and work directories — and none of them was touched by this
ticket.

## The two spit recipes

The gap doc rules out the spit itself (no final operation; the stack never finishes) but says
the home versions "are writable and worth writing, and they are a different dish." Both were
written, and deliberately as **two different methods** rather than one method twice:
`chicken-shawarma` marinates whole thigh pieces, presses them into a loaf tin, roasts, shaves
and crisps; `gyro-meat` emulsifies ground lamb and beef to a paste, bakes it in a water bath,
weights it cold, then slices and crisps. They share no step after the marinade.

Each carries its "this is not the spit" caveat in the prose of the step where the tin
replaces the cone — following `al-pastor`, which was edited during this ticket's Research to
move exactly that caveat out of a `>> note:` field and into the step. No file here uses
`>> note:`.

## Test coverage and gaps

There are no unit tests for recipe content and this ticket adds none; `scripts/check-recipes.mjs`
is the harness and it is what the criteria name. What it does and does not cover:

**Covered mechanically** — metadata presence, counter names against `src/data/counters.json`,
cooklang parse warnings, tree construction, tiling errors, the row/column floors, and empty
operation labels.

**Not covered, and checked by reading** — that a quantity is right for the servings; that a
method is canonical; that a label reads as a verb rather than merely being non-empty; that
`aka` is complete. These were read file by file, and they are where a human reviewer's time
is best spent. The `--labels` staircases in `progress.md` are the artifact for the third.

**A gap worth naming:** nothing in the repo enforces "every timer is named" — that criterion
lives only in this ticket. A recipe with `~{30%min}` passes `check-recipes.mjs` cleanly, and
`hummus`, `toum` and `pita-bread` all have unnamed timers today. Those are other tickets'
files and were left alone, but the collection is now in two states on this point.

## Open concerns

1. **The `chicken-over-rice` judgement**, above. If a maintainer reads the gap doc's item 4
   as binding over its own could-not-stock section, that is one more file to write, and the
   four tables it needs are already on disk.
2. **The Greek set is deferred, not refused.** `docs/knowledge/counters.md` says that if
   avgolemono, spanakopita, saganaki and loukoumades accumulate, the counter should **split
   into a Gyro Shop**. This ticket stopped at item 14, the last unambiguously Levantine item,
   rather than making that call on its own. It is a live decision for T-001-17 or a
   maintainer.
3. **`pomegranate-molasses` sits at exactly three ingredient rows**, the checker's floor.
   That is what the dish has, and padding it would have been dishonest — but it is the file
   most likely to trip a future tightening of that gate.
4. **`muhammara` still takes pomegranate molasses as a plain ingredient row** rather than
   pointing at the recipe now written for it. That file belongs to another ticket and was
   correctly not edited; the link is T-001-17's or T-001-18's to make.

## Handoff

Nothing is blocked and nothing is half-finished. The counter has a spit with four things on
it, the rice and sauces that go under and over them, the mezze list's cold half and its
bakery half, and two sweets. The board's remaining hole is Greek, and the reason it was left
is written down rather than forgotten.
