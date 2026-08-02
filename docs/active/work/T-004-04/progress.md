# T-004-04 — Progress

Three steps, three commits, all done. One deviation from the plan, recorded below with the
measurement that forced it.

---

## Step 1 — Timeline: a label appears only when its stretch can hold it — **done**

Commit `9eab256` — `src/components/Timeline.astro`.

- `LABEL_FITS_AT` + `fitsAt()` added beside `LABEL_AT`, with the measurement in the comment.
- `axis` entries carry `fitsAt`.
- The label moved into `<span class="stretch-label" data-fits={…}>`.
- `.stretch`: `font-size: 0.68rem` (was `clamp(0.6rem, 2.4vw, 0.68rem)`), plus
  `container-type: inline-size`; six `@container` rules under it.

`FLOOR_PX`, `LABEL_AT`, the grid template, the bars, the marks, the legend and every note are
untouched.

### Deviation: the thresholds were 3.2px too big on the first pass

Structure specified `23 / 33 / 39 / 55 / 61 / 65`, derived by adding the stretch's `0 0.1rem` of
side padding to each measured label width. Built it, and `bagels` at 768px lost a label whose
column was 56.2px wide against a 55px threshold — which should have kept it.

The cause: **a size container is queried on its content box**, so the 3.2px of padding is already
out of the number the browser tests. Adding it again double-counted. Confirmed by measurement
rather than by reading the spec: the column is 56.2px border-box, 53px content-box, and the
threshold that fired was the 55px one.

The table is now the measured text widths with no padding in them —
`20 / 30 / 36 / 52 / 58 / 61` — and the comment on both the constant and the rules says which box
the number is about, so nobody re-adds it. Re-measured after the fix: `pork-liver-pate` at 768px
went back to identical, `bagels` did not (see below).

### Verified

| check | result |
| --- | --- |
| `@container` survives the build | yes — lightningcss rewrites it to `@container (width<=20px)`, same meaning |
| labels that spill past their stretch, 375 / 545 / 704 / 1440 | **0 / 0 / 0 / 0** — as before the change |
| labels that stack to 2+ lines | **57 pages → 0** at 375px; 8 → 0 at 545; 2 → 0 at 704; 0 → 0 at 1440 |
| tallest axis strip anywhere | 38.7px → **17.2px**, the same at every width |
| charts left with no label at all | **0 of 635**, at 320, 375 and 545px |
| 1440px, 12 pages, PNG SHA-256 | **12 of 12 identical** |
| 768px, same 12 pages | 11 of 12 identical; `bagels` differs — one label |
| `npm run verify` | 9 files, 831 tests, 682 pages |

### The one page that changed at 768px

`bagels`, and only `bagels`: `1 hr 10 min` in a 53px content box. It needs 51.9px, so it fitted on
one line — but it is an 11-character label and the 11-character bucket is 58px, because the widest
11-character label the site can print (`8 hr 20 min`) needs 57.7px. The bucket rounds up, so this
one is held back with 1.1px to spare.

Counted across the whole collection: **one label of 1268 at 768px**, none at 1024px or 1440px, 15
at 375px. Its duration is printed beside its own row, which is the component's standing rule for
an unlabelled stretch. Left as-is deliberately — the alternative is a second key on the table
(Karla's `1` is ~2.9px narrower than its other digits, which is where the variance inside a
character count comes from), doubling the rule count to recover one label.

---

## Step 2 — CookModes: 44px where a wet hand lands — **done**

Commit `82e3b74` — `src/components/CookModes.astro`. Three `min-height: 2.75rem` declarations
inside the `@media (max-width: 34rem)` the component already had: `.mode`, `.tick`,
`.pane-foot .clay-button`.

| control | 320px | 375px | 545px |
| --- | --- | --- | --- |
| `.mode` × 3 | 40 → **44** | 40 → **44** | 40, unchanged |
| `.tick` (20 rows, `biryani`) | 42.8 → **44**, 11 under → **0** | 42.8 → **44**, 12 under → **0** | 42.8, unchanged |
| "Untick everything" | 33.7 → **44** | 33.7 → **44** | 33.7, unchanged |
| "Start over" | 33.7 → **44** | 33.7 → **44** | 33.7, unchanged |
| `.hit` (a cook step) | 260.3, untouched | 212.9, untouched | 161.6, untouched |
| the checkbox itself | 18.4 | 18.4 | 18.4 — the label around it is the target |

Screenshotted prep (`biryani`) and cook (`gigantes-plaki-instant-pot`, two steps ticked) at 375px
after: the segmented control, the group cards, the tick rows, the struck-through done steps, the
`NOW` badge and the reset buttons all read as before, one notch taller.

`npm run verify`: 9 files, 831 tests.

---

## Step 3 — AddToPlan: the button and the link — **done**

Commit `6bb4e9f` — `src/components/AddToPlan.astro`. Its first width query, `34rem`.

| control | 320px | 375px | 545px | 1440px |
| --- | --- | --- | --- | --- |
| "Add to the list" | 34.7 → **44** | 34.7 → **44** | 34.7 | 34.7 |
| "See the list" | 21.1 → **44** | 21.1 → **44** | 21.1 | 21.1 |

Still one line at 320px: 158.5 + 73.8px in a 296px row, screenshotted to confirm the pair did not
wrap into a taller block.

`npm run verify` now reports **832** tests, one more than before: `breakpoints.test.ts` runs one
case per file that contains a width query, and `AddToPlan.astro` has become such a file. It
passes — `34rem` is a named breakpoint.

---

## Step 4 — the whole-site checks — **done**

| check | command | result |
| --- | --- | --- |
| no body scroll, whole build | `node scripts/check-overflow.mjs` | **682 page views at 375px — nothing scrolls sideways** |
| no body scroll, six widths | same, `--width 320,414,545,768,1024,1440`, 12 pages | **72 page views — nothing scrolls sideways** |
| desktop parity | 12 pages × 1440 and 768, PNG SHA-256 vs the pre-change baseline | **23 of 24 identical**; 1440px is 12 of 12 |
| tests and build | `npm run verify` | 9 files, 832 tests, 682 pages |
| working tree | `git status --short` | no ticket-owned file staged, modified or untracked |

`src/styles/site.css` was read and left alone: its views section holds one rule, about the gap
between a pane and the clock under it, and nothing in it is width-dependent. Three files changed,
none created, none deleted.
