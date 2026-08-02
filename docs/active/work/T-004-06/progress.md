# T-004-06 — Progress

Five commits, eight files. The plan ran in order; two things came out differently from the plan
and both are recorded below with what changed and why.

---

## Step 1 — the plumbing, extracted and guarded ✅

`scripts/browser.mjs` created; `scripts/check-overflow.mjs` rewritten to import it. Its flags,
its `PROBE`, its output lines and its three exit codes are unchanged.

**Verified, all four ways the plan named:**

| check | result |
| --- | --- |
| the 2046-page regression | `2046 page views at 375px, 390px, 768px — nothing scrolls sideways.` — character for character what it printed before the refactor |
| bare routes still work | `3 page views at 375px — nothing scrolls sideways.` |
| `CHROME_BIN=/nonexistent` | prints the by-hand procedure, exits 2 |
| the build-moved guard | `touch dist/index.html` mid-run → *"dist/ changed while this was reading it … Nothing above is evidence either way."*, **exit 2**, not 1 |

Commit `6cb4436` — *Put the browser plumbing in one file, and say when the build moved*

## Step 2 — the touch check, failing first ✅

`scripts/check-touch.mjs` created, `verify:mobile` added to `package.json`. `verify` untouched.

**It failed on the first run, which is the point.** Named, on a build with the three known
defects still in it:

```
SHORT    375px  /404.html      <a.clay-button> is 41.4px, wants 44  "Back to the recipes"
SHORT    375px  /miso-ramen/   <summary> is 24px, wants 44  "See how it is written"
SHORT    375px  /list/         <a> is 22px, wants 44  "Miso Ramen"  (×7 here)
```

### Deviation 1 — the checker found a fourth thing, and it was the checker

The first run also reported `<label.search> is 19px` on the front door. It is not a defect: the
finder is a 19px inline `<label>` wrapped around a 50px input, and a tap on either lands on the
input.

The first draft had an exemption saying *"a bare checkbox inside a label is not the target — the
label is"*, written for CookModes' 18.4px checkbox in a 44px row. That rule is right in one
direction and wrong in the other, and the finder is the other direction.

**Fixed by modelling instead of exempting.** A label and its control are **one** target, so the
checker measures the **union** of the two boxes and counts it once, under the label. Both cases
come out right and the exemption list got shorter, not longer:

| | label | control | union | verdict |
| --- | --- | --- | --- | --- |
| CookModes' tick | 44px | 18.4px | 44px | passes, on the row |
| the finder | 19px | 50.5px | 50.5px | passes, on the input |

It handles `for=` as well as wrapping. This is a better check than the one the plan described,
and it exists because the plan required running it before trusting it.

Commit `869090d` — *Check every target a thumb has to hit, on every page, in a browser*

## Step 3 — the three tap targets and the variant spacing ✅

| file | rule | before → after at 375px |
| --- | --- | --- |
| `site.css`, the source section | `.source summary` padding + `min-height` | 24px → 44.2px, on 658 pages |
| `site.css`, a new "the kit's button, on a phone" section | `.clay-button` floor | 41.4px → 44px |
| `site.css`, the trimmings' `narrow` block | `.variants a + a` margin | gap 6.6px → **24.2px** |
| `list.astro`, its `narrow` block | `.planned h3 a` | 22px → 44px |

**Verified.** `check-touch.mjs` green where it had been red; the variant gap re-measured on
`boston-baked-beans` at 375px at 24.2px; `npm run verify` still 9 files / 832 tests / 658 recipes
/ 682 pages.

Commit `4028569` — *Give the source, the 404 button and the list's titles a thumb, and part the
two variants*

## Step 4 — the `snug` arithmetic ✅

Comment only. The block now says the widest recipes first fit at **736px ≈ 46rem**, names the
705–735px band where they travel up to 14px unpinned, keeps `44rem`, and says why it was not
moved. `breakpoints.test.ts` still reads the declaration lines: 7 passed.

Commit `8261b22` — *Say where the widest table really stops fitting, not where it was predicted
to*

### Deviation 2 — the order of two commits, not their content

Steps 3 and 4 both edit `site.css`, and `lisa commit-ticket --include` takes whole paths, so they
could not be staged apart in one pass. The tap-target edit was committed with the block comment
temporarily reverted, then the comment was restored and committed on its own. The tree at
`8261b22` is exactly the tree that was tested; the two commits are separable in history because
the house style keeps a comment correction its own commit (`45eda6a` did the same in T-004-03).

## Step 5 — the proofs 🔄

**5a / 5b — the whole build.** Running.

**5c — desktop unchanged at 1440px, against `02b65e8` (the parent of T-004-01's first commit).**
Worktree built, twelve pages shot at 1440px and 768px on the before side: 24 shots, and the
pre-story build is itself clean at both widths. The after side runs once the whole-build checks
release the build.

**5c, the populated list — measured rather than skipped.** `/list/` screenshots as its empty
state, so the same seven-recipe plan was measured at 1440px on both sides:

| | before `02b65e8` | after | |
| --- | --- | --- | --- |
| page height | 5575px | **5575px** | identical |
| lines drawn | 58 | **58** | identical |
| first row height | 60.3px | **60.3px** | identical |
| the planned title link | 22px | **22px** | identical — this ticket's fix is narrow-only |
| a line reads | `1 cup bean sprouts for Miso Ramen` | `bean sprouts 1 cup for Miso Ramen` | **changed** |
| aisle heading `position` | `static` | `sticky` | **changed** |

Both changes are T-004-05's, both are the two things its `note` disposition told the board about,
and neither is this ticket's. Reported rather than hidden behind an empty page.

Also checked, because the badge could have leaked: `.scale-short` computes `display: none` and
0px at 1440px, and `.scale-word` draws its full 71.9px phrase. The short form is a phone-only
thing and stayed one.

## Step 6 — `docs/gaps/mobile.md` 🔄

Written, nine ranked entries, plus what S-004 fixed and what the automated net does not catch.
Line references re-checked against the tree after the `site.css` edits moved them
(`.filters` 300–340, `.shelf-group` 720–741). Held back from commit until steps 5a–5c land, so
every number in it is one that survived.

---

## Files, and why each

| file | action | why |
| --- | --- | --- |
| `scripts/browser.mjs` | created | one copy of the server, the launcher, the CDP client and the viewport-settling navigate; plus the build-moved guard two tickets wanted |
| `scripts/check-touch.mjs` | created | the criterion "tap targets ≥44px on **every** interactive element" over the whole build, plus the three table promises T-004-02 named |
| `docs/gaps/mobile.md` | created | the ticket's own deliverable |
| `scripts/check-overflow.mjs` | modified | imports the plumbing; reports a moved build as "could not look" rather than as a fault |
| `package.json` | modified | one line, `verify:mobile`. `verify` unchanged, so it still runs without a browser |
| `src/styles/site.css` | modified | three tap-target rules, the variant spacing, the corrected arithmetic — every rule inside a `max-width` query |
| `src/pages/list.astro` | modified | the recipe title link in the plan block, 22px → 44px at narrow |
| `docs/active/tickets/T-004-06-…md` | **not** modified by me | Lisa's phase field |

Deliberately not touched: `b28-clay.css` (vendored — a local edit dies at the next
`just sync-kit`), `[slug].astro` (the variant fix is CSS so the desktop stays byte-identical),
`index.astro` (the "Press `/`" tally is recorded, not rewritten), `404.astro` (its defect was a
stylesheet property), `breakpoints.test.ts` (no new number was written, and a check you edited is
not a check).
