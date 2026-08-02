# T-004-06 — Structure

Eight files: three created, five modified. Every one is named against the criterion it serves.

---

## The whole list

| file | action | serves |
| --- | --- | --- |
| `scripts/browser.mjs` | **created** | the regression net — one copy of the plumbing |
| `scripts/check-touch.mjs` | **created** | "tap targets ≥44px on every interactive element", across the whole build |
| `docs/gaps/mobile.md` | **created** | "`docs/gaps/mobile.md` exists and ranks what is still wrong" |
| `scripts/check-overflow.mjs` | modified | imports the extracted plumbing; gains the build-moved guard |
| `package.json` | modified | one script: `verify:mobile` |
| `src/styles/site.css` | modified | three tap-target rules, the variant spacing, the corrected `snug` arithmetic |
| `src/pages/list.astro` | modified | one tap-target rule (`.planned h3 a`) |
| `docs/gaps/README.md` | modified | one line, if it indexes the directory |

Not touched, and each for a stated reason:

- `src/styles/b28-clay.css` — **vendored** from b28.dev. A local edit is lost at the next
  `just sync-kit`. The `.clay-button` floor goes in `site.css` instead.
- `src/pages/[slug].astro` — the variant fix is CSS-only by design (design.md §3), so the markup
  stays and the desktop stays byte-identical.
- `src/pages/index.astro` — the "Press `/`" tally is recorded, not rewritten (design.md §6).
- `src/pages/404.astro` — its defect is `.clay-button`'s height, which is a stylesheet property.
  The page's fifteen lines are already correct.
- `src/components/*.astro` — every one of them already meets the floor at `narrow`.
- `src/styles/breakpoints.test.ts` — no new number is written, so it needs no change. It is the
  proof that criterion 3 holds, and a check you edited is not a check.

---

## `scripts/browser.mjs` — created

The plumbing `check-overflow.mjs` invented, lifted out unchanged so a second checker can use it.
No behaviour is added except the build-moved guard.

**Exports**

```
serve(dir)          -> { server, port }          static file server, directory-index aware
pages(dir)          -> string[]                  every .html under dir, _astro skipped
launch()            -> { child, wsUrl }          headless Chrome, temp profile
Cdp                 class                        send-by-id, resolve-by-id, events by method
open(wsUrl)         -> { send, evaluate, on, go } one attached target, viewport-settling `go`
watchBuild(dir)     -> { moved() }               newest mtime at open, compared on demand
CHROME, BY_HAND                                  the binary path and the by-hand procedure
```

`go(url, metrics)` carries the one piece of hard-won knowledge in the file: an
`Emulation.setDeviceMetricsOverride` issued while a navigation is in flight is silently dropped
and the page then measures itself at Chrome's 980px fallback. It re-asserts and re-checks up to
five times and reports whether the viewport held.

**Boundary.** `browser.mjs` knows about browsers and files. It knows nothing about overflow, tap
targets, recipes or this site. Neither checker imports the other.

## `scripts/check-overflow.mjs` — modified

Everything a caller sees stays: the flags (`--width`, `--root`, `--shots`, bare routes), the
`PROBE`, the `BY_HAND` text, the output lines, and the exit codes (0 clean / 1 scrolls / 2 could
not look).

Two changes only:

1. the ~120 lines of server + launcher + `Cdp` + `go` are replaced by an import;
2. after the sweep, `watchBuild(root).moved()` is consulted. If `dist/` changed under the run the
   result is discarded with a message naming the cause, and the exit is **2**, not 1.

The regression test for this refactor is the sweep itself: 2046 page views must report exactly
what they report today.

## `scripts/check-touch.mjs` — created

Same shape as its sibling — a CLI, a `PROBE` string, three exit codes, no dependencies, not
imported by the site.

```
node scripts/check-touch.mjs                    # every page, 375px and 390px
node scripts/check-touch.mjs --width 375        # one width
node scripts/check-touch.mjs /miso-ramen/       # a few pages
```

**What it asserts, per page.** Four claims, each traceable to a ticket that asked for it:

| # | claim | asked for by |
| --- | --- | --- |
| 1 | every visible interactive element is ≥44px tall | this ticket's criterion |
| 2 | the shortest rendered `<td class="cell">` is ≥44px | T-004-02, "the floor is explicit but nothing enforces the result" |
| 3 | `data-more` is set exactly when `.table-scroll` overflows | T-004-02, "the affordance's whole claim" |
| 4 | `.cell--ingredient` computes `sticky` below 44rem, `static` above | T-004-02 |

Claim 4 needs a width on each side of the breakpoint, so the default run is 375px and 390px for
claims 1–3 and one extra pass at 768px for claim 4's negative half.

**The exemptions, written into the file's header so they can be argued with.** A checker whose
exemption list is undocumented is a checker that will be quietly widened by the next person.

- an element clipped to 1×1 (`clip-path: inset(50%)`) is hidden, not small — `.skip` and
  `.scale-word` are reachable and correct;
- a bare `input[type=checkbox]` inside a `<label>` is not the target; the label is. The label is
  measured and the input is not;
- an element inside `[hidden]`, or with zero box, is not on the page.

Nothing else is exempt. In particular the pages that fail today are not exempted — the fixes in
§`site.css` below are what make it green, and the ordering in `plan.md` proves it in both
directions.

## `package.json` — modified

One line added to `scripts`. `verify` is untouched:

```
"verify:mobile": "npm run build && node scripts/check-overflow.mjs --width 375,390,768 && node scripts/check-touch.mjs"
```

---

## `src/styles/site.css` — modified

Five edits, four of them additive rules inside existing `@media (max-width: 34rem)` blocks or
beside the section they belong to. **No rule outside a media query is added or changed**, which
is what makes "the desktop is unchanged" a structural property rather than a hope.

| # | where | what |
| --- | --- | --- |
| 1 | the breakpoint block, `~14` | `snug`'s description and the 7-column row corrected to the measured 46rem, with the 705–735px band named |
| 2 | the recipe page's trimmings, in the `34rem` block at `:630` | `.variants a + a { margin-inline-start: 1.1rem }` |
| 3 | a new two-rule section, "the kit's button on a phone" | `.clay-button { min-height: 44px; … }` at `34rem` |
| 4 | the source section, a new `34rem` block at the end of it | `.source summary` padding + `min-height` |
| 5 | comments | the measured numbers beside each of the above |

Edit 3 needs a home. `.clay-button` belongs to the vendored kit and has no section here, so it
gets its own, placed **after** the page furniture and before the finder — the same position in
the file as the shell rules it behaves like. Its comment says why the rule is here and not in
`b28-clay.css`, because that is the first question the next reader will have.

Edit 4 goes at the end of the source section, following the file's own rule: *put the query
beside the rules it changes, at the end of that section*.

## `src/pages/list.astro` — modified

One rule, appended inside the existing `@media (max-width: 34rem)` block at `:457`, beside the
four controls T-004-05 raised for the same reason:

```
.list-page :global(.planned h3 a) { display: inline-flex; align-items: center; min-height: 44px; }
```

Nothing else in the file changes. `SHORT_SCALE` is **not** moved to `src/lib/shopping.ts`,
though this ticket could: it is a refactor with no width in it, it would put `shopping.ts` and
its 100-plus tests in the diff of a verification ticket, and T-004-05's concern already records
where it belongs.

---

## `docs/gaps/mobile.md` — created

The first file in that directory that is not about a counter, so it opens by saying what it is.

**Shape.** A short preamble (what this is, when it was measured, against which build), then the
ranked list, then a closing section naming what is *not* in the list because it was fixed.

Each entry: **what a person holding a phone experiences** → where in the code → the measurement
→ what fixing it would take → *mitigation* or *cure*. Ranked by cost to that person.

**The ranking, decided here so the writing is not where it gets decided:**

1. a tablet in portrait gets the mouse drawing — every touch rule is off above 544px
2. a 7-column table still hides four columns behind a sideways scroll; the pinned column is a
   mitigation, not a cure
3. the clock at an extreme ratio is one bar and three slivers
4. "Press `/` to search 658 recipes" on a device with no keyboard
5. the two variant links are 24px apart, not on separate lines
6. `/list/`'s pack hint is hover-only, and a thumb has no hover
7. 63 lines of dead stylesheet on every page
8. the 705–735px band where the widest tables scroll unpinned
9. the vendored kit has no touch floor of its own — a change for b28.dev, not here

## `docs/gaps/README.md` — modified

Read first. If it indexes the directory, `mobile.md` is added to the index with a one-line
description; if it does not, this file is not touched and the structure list above loses a row.

---

## Ordering that matters

1. `browser.mjs` and the `check-overflow.mjs` refactor land **first**, and the 2046-page sweep
   re-runs green before anything else is written. Everything downstream is measured with this
   tool; a tool changed halfway through invalidates the measurements taken before it.
2. `check-touch.mjs` lands **before** the CSS fixes, and its first run is expected to **fail**
   with exactly the three findings from research. A check that has never failed is not known to
   work.
3. The CSS and `list.astro` fixes land next, and turn that run green.
4. The desktop before/after comparison runs **last**, against the final build, because it is the
   claim about the finished state.
5. `docs/gaps/mobile.md` is written last, so its numbers are the ones that survived.
