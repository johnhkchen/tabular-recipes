# T-005-03 · Progress

Three files modified, two commits, one deviation from the plan (forced by a ticket running
alongside this one). Every step's proof is the command output, quoted.

---

## Step 1 — the five notes · **done**

`src/data/counters.json`. Three of `The Slow Cooker`'s four sections gained `notes`; the
file's `"//"` header gained the paragraph explaining what a note is and warning that
`menu-sections.mjs --write` discards them.

```
 119 (group)                                The Slow Cooker / Braises, left alone all day
 118 baked-turkey-wings-slow-cooker         The Slow Cooker / Braises, left alone all day
 111 new-england-boiled-dinner-slow-cooker  The Slow Cooker / Braises, left alone all day
 113 boston-baked-beans-slow-cooker         The Slow Cooker / Beans and pulses
  84 soy-sauce-chicken-slow-cooker          The Slow Cooker / Whole birds and big cuts
total notes: 5 | over 120: 0
```

`npm run verify` exit 0, and `diff -r baseline dist` came back **IDENTICAL** — as designed:
at this point nothing reads the key, so writing it had to be a no-op.

## Step 2 — the validator · **done**

`scripts/parse-recipes.mjs`, a new block between counters and pairings, plus `NOTE_CAP = 120`.

Every failure path was fired against the real data file rather than asserted. Six injections,
each restored before the next:

```
════════ notes-not-a-list
Error: src/data/counters.json: The Slow Cooker / "Beans and pulses" has "notes" that is
not a list. It is a list of { of?, note }.

════════ note-with-no-text
Error: src/data/counters.json: The Slow Cooker / "Beans and pulses" has a note with no
"note" text: {"of":"boston-baked-beans-slow-cooker"}
  a note is { "note": "one sentence" }, with an optional "of": "<slug>".

════════ over-cap
Error: src/data/counters.json: The Slow Cooker / "Beans and pulses" has a note of
121/120 characters:
  xxxxxxxxxx…
  Shelf talk is one sentence. docs/knowledge/voice.md says why.

════════ slug-not-in-section       (a one-character typo in the slug)
Error: src/data/counters.json: The Slow Cooker / "Beans and pulses" has a note on
"boston-baked-beans-slowcooker", which the section does not list.
  the section lists: boston-baked-beans-slow-cooker

════════ slug-not-shelved-here     (listed in the section, but its >> counters: says otherwise)
Error: src/data/counters.json: The Slow Cooker / "Beans and pulses" has a note on
"miso-ramen", which is not shelved at this counter, so neither the item nor its note ever
renders.
  miso-ramen is at: Ramen Shop
  Give it a >> counters: line naming The Slow Cooker, or move the note.

════════ section-title-typo        (a real note filed under the wrong heading)
Error: src/data/counters.json: The Slow Cooker / "Stocks" has a note on
"boston-baked-beans-slow-cooker", which the section does not list.
  the section lists: (nothing)
```

Every one names the counter, the section and the slug, which is the acceptance criterion.

Exit codes: `node scripts/parse-recipes.mjs` → **1**, `npm run verify` → **1**. Restored →
`npm run verify` → **0**.

The last case is the one that was not in the ticket's list and is worth keeping: attaching a
note to the wrong section is the mistake a person will actually make, and it fails on the
`items` check with the section's real contents printed underneath.

**Commit A — `c3f495c`** · `src/data/counters.json`, `scripts/parse-recipes.mjs`.

## Step 3 — the renderer · **done**

`src/pages/menu/[counter].astro`. Frontmatter gained a local `ShelfNote` shape and two
lookups (`aboutSection`, `aboutItem`) matched by section title; the template gained two
guarded lines; a `<style is:global>` with two rules was appended.

`npm run build` → 682 pages.

## Step 4 — byte-identity · **done, and the baseline had to be retaken**

### Deviation from the plan

The Step 0 baseline was taken before **T-005-04** — which runs alongside this ticket on the
same branch — landed its `slack:` rewrites. Diffing against it showed 38 recipe pages moved,
none of them anything to do with this ticket:

```
702c702
< …over-beaten whites go grainy and will not fold; the tin is never greased and the cake
  cools upside down, since a cake turned out warm collapses under its own weight…
---
> …over-beaten they go grainy, will not fold, and no oven puts the air back
```

So the baseline was retaken with **only** `[counter].astro` reverted, everything else left
exactly as it stands, and the two builds bracketed by a hash of `src/generated/recipes.json`
to prove no `.cook` file moved between them:

```
recipes.json identical across the two builds: a35a18c3568406d71bb94a7faf6ecffbdb8e54e8
```

That isolates this ticket's change from a ticket working in the same tree.

### The result

Every file in `dist` that differs — 21 of 682, all menu pages:

```
menu/bakery  bowl-shop  curry-house  deli  dim-sum-counter  diner  instant-pot
japanese-home  meat-and-three  one-pot  panaderia  pho-and-banh-mi  pizzeria
ramen-shop  shawarma-counter  slow-cooker  smokehouse  soup-pot  takeout-counter
taqueria  thai-kitchen
```

The 661 recipe, index, list and 404 pages are byte-identical, and `dist/_astro/*.css` keeps
its filenames — the shared bundle was not rehashed.

**The whole of what was added to a note-less menu page** is one element, quoted in full:

```html
<style>.menu-note{color:var(--clay-ink-soft);margin:-.35rem 0 .9rem;font-size:.84rem;line-height:1.45}.item-note{color:var(--clay-ink-soft);margin:.2rem 0 0;font-size:.84rem;font-style:italic;line-height:1.45}
</style>
```

Removing that one element and re-comparing:

```
byte-identical after removing that <style>: 20 of 21
still different: slow-cooker
```

And without removing anything at all, `<body>` onwards:

```
bakery:    base=2cf7fa5419e8 new=2cf7fa5419e8  IDENTICAL
bowl-shop: base=81e28c7a396d new=81e28c7a396d  IDENTICAL
```

So: a counter with no notes renders a byte-identical body, and its head gains the one
`<style>` above. That is the entire difference, and design §5 says what the two alternatives
would have cost instead (all 682 pages, or a `data-astro-cid-*` on every element).

## Step 5 — the markup, read · **done**

Group note, between `</h2>` and `<ul>`:

```html
<h2>Braises, left alone all day</h2><p class="menu-note">Every one is written for low and
six to eight hours. Nothing browns in a sealed crock, so colour comes before or after.</p><ul>
```

Item note, inside the `<li>`, after `</a>`:

```html
…crockpot smothered turkey wings</span></a><p class="item-note">The only one here that
browns before the pot: a wing is an awkward shape to turn in a pan, and a sheet tray does
four.</p></li>
```

The four anchors' own markup, compared against the baseline character for character:

```
baked-turkey-wings-slow-cooker:        IDENTICAL
new-england-boiled-dinner-slow-cooker: IDENTICAL
boston-baked-beans-slow-cooker:        IDENTICAL
soy-sauce-chicken-slow-cooker:         IDENTICAL
```

The link's accessible name did not grow, and the 44px target T-004-03 measured is the same
element it was.

## Step 6 — `npm run verify` · **done**

```
npm run verify exit=0
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories
Test Files  9 passed (9)
     Tests  832 passed (832)
682 page(s) built
```

### The cap report moved, and not because of this ticket

Planned proof was *the cap report is unchanged from T-005-01's 1209/499*. It is not:

```
T-005-01:  1209 field(s) over cap in 499 file(s) — 92,947 characters over
            operation cell 0 · step body 656 · prose row 232 · slack reason 304 · ingredient note 17
now:       1129 field(s) over cap in 443 file(s) — 89,573 characters over
            operation cell 0 · step body 656 · prose row 232 · slack reason 224 · ingredient note 17
```

Only `slack reason` moved, 304 → 224. That is T-005-04's field and T-005-04's work. **`prose
row` is unchanged at 232**, which is this ticket's field, and it is the number that would
have moved had a `.cook` file been edited here.

Replacement proof, since the report is no longer a control: `git status --porcelain recipes/`
is empty, and no `.cook` path appears in either `lisa commit-ticket` call.

## Step 7 — `npm run verify:mobile` · see review

First run exited **2** — *"could not look"*, not a failure and not a pass:

```
dist/ changed while this was reading it — a build running alongside, most likely.
Nothing above is evidence either way. Re-run against a build standing still.
```

That is the same concurrency as Step 4: `npm run verify:mobile` begins with `npm run build`,
and another ticket's build was writing `dist/` at the same time. The script's own guard caught
it and refused to report, which is the right behaviour.

Re-run against a frozen copy of the build, using the `--root` both scripts already accept, so
nothing can move underneath it. Result in `review.md`.

## Step 8 — the handoff to T-005-05

### The four sentences that moved — do not move these again

| Recipe | From | Was | Went to | Now |
| --- | --- | ---: | --- | ---: |
| `boston-baked-beans-slow-cooker` | header row, sentence 1 | 730 (whole row) | The Slow Cooker / Beans and pulses | 113 |
| `baked-turkey-wings-slow-cooker` | header row, sentence 1 | 563 | The Slow Cooker / Braises, left alone all day | 118 |
| `new-england-boiled-dinner-slow-cooker` | header row, sentence 1 | 544 | The Slow Cooker / Braises, left alone all day | 111 |
| `soy-sauce-chicken-slow-cooker` | header row, sentence 1 | 543 | The Slow Cooker / Whole birds and big cuts | 84 |

What was taken, precisely, so T-005-05 can strike the right words and keep the rest:

- **beans** — *"A crock is the closest vessel to a bean pot there is, and this is the one bean
  dish on the shelf where slow beats pressure outright."* The rest of that 730-character row
  is cooking (the parboil, the two things a crock cannot do) and **stays**, cut to cap.
- **turkey wings** — *"this is the only file on the shelf that browns somewhere other than a
  skillet, because a wing is an awkward shape to turn in a pan and a sheet tray does all four
  at once."* The rest — *do not skip it*, *straight into the crock they steam*, the gravy
  reduction — is cooking and **stays**.
- **boiled dinner** — *"This is the one file on the shelf that is not leave-it-and-go … which
  is exactly why the dish belongs here rather than in a pressure cooker."* *Nothing is browned
  and nothing should be* is cooking and **stays**.
- **soy sauce chicken** — *"The shortest cook on the shelf, at four hours, and the only one
  where longer is actively worse … much closer than pressure, which tightens a whole bird."*
  *Nothing is browned and nothing may be: colour comes from dark soy* is cooking and **stays**.

**The group note on `Braises, left alone all day` was not moved from anywhere.** It was
written for the section out of what its eighteen files have in common. No recipe lost it, and
T-005-05 owes nothing for it.

### The other 31 shelf-talk rows, as a starting list

Found by reading all 393 prose rows for shelf-comparison vocabulary (research §6). Not moved
here — this ticket built the destination and proved it with the four the criteria named.
`counter / section` is where each would land.

| Recipe | Row | Chars | Counter / section |
| --- | --- | ---: | --- |
| `braised-short-ribs-slow-cooker` | header | 330 | The Slow Cooker / Braises, left alone all day |
| `cachete-slow-cooker` | header | 298 | The Slow Cooker / Braises, left alone all day |
| `carnitas-slow-cooker` | header | 432 | The Slow Cooker / Braises, left alone all day |
| `collard-greens-slow-cooker` | header | 352 | The Slow Cooker / Braises, left alone all day |
| `corned-beef-slow-cooker` | header | 411 | The Slow Cooker / Braises, left alone all day |
| `irish-stew-slow-cooker` | header | 473 | The Slow Cooker / Braises, left alone all day |
| `lamb-tagine-slow-cooker` | header | 372 | The Slow Cooker / Braises, left alone all day |
| `osso-buco-slow-cooker` | header | 384 | The Slow Cooker / Braises, left alone all day |
| `ching-bo-leung-soup` | header | 312 | The Soup Pot / Old-fire soups (老火湯) |
| `corn-carrot-pork-bone-soup` | header | 158 | The Soup Pot / Old-fire soups (老火湯) |
| `dried-bok-choy-pork-lung-soup` | header | 390 | The Soup Pot / Old-fire soups (老火湯) |
| `overlord-flower-soup` | header | 214 | The Soup Pot / Old-fire soups (老火湯) |
| `peanut-black-eyed-pea-chicken-feet-soup` | header | 177 | The Soup Pot / Old-fire soups (老火湯) |
| `sha-shen-yu-zhu-soup` | header | 195 | The Soup Pot / Old-fire soups (老火湯) |
| `crucian-carp-tofu-soup` | header | 297 | The Soup Pot / Quick daily soups (滾湯) |
| `tomato-potato-beef-soup` | header | 294 | The Soup Pot / Quick daily soups (滾湯) |
| `braised-short-ribs-instant-pot` | header | 237 | Instant Pot / Braises that took all afternoon |
| `collard-greens-instant-pot` | header | 295 | Instant Pot / Braises that took all afternoon |
| `oxtails-instant-pot` | header | 234 | Instant Pot / Braises that took all afternoon |
| `corned-beef-instant-pot` | header | 276 | Instant Pot / Whole birds and big cuts |
| `balti` | footer | 412 | Curry House / The sauce list **and** One Pot / Braises and stews |
| `madras` | footer | 489 | Curry House / The sauce list **and** One Pot / Braises and stews |
| `fresh-egg-pasta` | footer | 587 | Pizzeria / Primi |
| `white-pizza` | footer | 587 | Pizzeria / By the slice |
| `panzanella` | footer | 276 | The Bowl Shop / Leafy salads |
| `tortilla-espanola` | header | 271 | One Pot / Skillet dinners |
| `mentsuyu` | header | 187 | Japanese Home Cooking / Made ahead (作り置き) |

Twenty-seven rows in 27 recipes, plus the four moved above = 31. (The remaining four of the
35 in research §6 are the ones this ticket moved.)

**Two things in that table T-005-05 should read before it starts.**

1. **`balti` and `madras` sit at two counters each.** A note lives on one section of one
   counter, so a sentence about a dish shelved twice has to be filed at the counter where the
   comparison is true. *"the one thing here that no other line on this list does"* is about
   `Curry House / The sauce list`, not about One Pot.
2. **The Instant Pot rows are the mirror image of the slow cooker ones.** Every one is
   *"pressure does X, the plain way does Y"*, and the slow cooker file for the same dish says
   the same comparison from the other side — `collard-greens`, `corned-beef`,
   `braised-short-ribs` and `oxtails` all have both. Moving both to their own counters is
   right; writing the same sentence twice is not.

## Files touched

| File | Commit |
| --- | --- |
| `src/data/counters.json` | `c3f495c` |
| `scripts/parse-recipes.mjs` | `c3f495c` |
| `src/pages/menu/[counter].astro` | Commit B, below |

`src/styles/site.css`, `src/lib/counters.ts`, `scripts/check-recipes.mjs`,
`scripts/menu-sections.mjs`, `docs/knowledge/voice.md` and every `.cook` file are unmodified.
