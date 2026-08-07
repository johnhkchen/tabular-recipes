# T-010-02 — Plan

Six steps, four commits. Each step is verifiable on its own, and the verification for each is a
command with an expected result rather than a look.

`node` is not on the default PATH on this machine; every command below runs after
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` (the repo pins 24.18.1 in
`.node-version`).

---

## Step 1 — `src/components/dials.ts`

Write the module to the interface in `structure.md` §1: types, `DIALS`, `OFF`, `SHOW_PASSES`,
`SHOW_UNSAID`, `anySet`, `canAnswer`, `measure`, `verdict`, `readQuery`, `readSettings`,
`carriesState`, `searchString`, `figures`, `unsaidLine`, `tallyLine`.

Header paragraph explains the `src/components/` placement (D12) and states the two imports —
`formatDuration` from `src/lib/time.ts`, `BREAK_MINUTES` from `src/lib/schedule.ts` — as reads.

**Verify:** `npx tsc --noEmit` is not a script this repo has; the check is that
`vitest run` in step 2 imports it without a type error and `astro build` in step 5 bundles it.
Nothing to run alone.

## Step 2 — `src/components/dials.test.ts`

The four groups from `structure.md` §4. Written against the module, not against the page.

Two of them need the real collection. Import `GET` from `../pages/search.json.ts` and parse it,
the same boundary `src/pages/_search.json.test.ts` uses — so if T-010-01's endpoint ever changes
shape, this fails here too rather than in a browser.

**Verify:**

```
npx vitest run src/components/dials.test.ts
```

Expect: all pass. The three stop counts must come out **227/42/395**, **365/275/24** and
**6/5/653** — the numbers `design.md` argues from. A mismatch means either the module is wrong
or the collection moved, and both need saying out loud before anything is drawn.

**Commit 1:** `lisa commit-ticket --ticket-id T-010-02 --message "Three dials, and the three
answers they give" --include src/components/dials.ts --include src/components/dials.test.ts`

## Step 3 — `src/styles/site.css`

Delete the dead `.filters` / `.filter` block (lines 300–340). Add `.dials`, `.dial-set`,
`.dial-name`, `.dial`, `.dial button` and its four states, `.cannot-say`, `.results .unsaid`,
`.results .figures`, and the `min-height: 44px` rule inside the finder section's narrow block.

Rules, all of them checkable by reading:

- no hex colour; only the nine `--clay-*` tokens and `color-mix`;
- exactly one `@media`, and its value is `34rem`;
- the focus ring is the house one, character for character.

**Verify:**

```
npx vitest run src/styles/breakpoints.test.ts
grep -n '#[0-9a-fA-F]\{3,6\}' src/styles/site.css      # expect: no new lines
grep -c 'class="filter' src/ dist/ -r                   # expect: 0
```

**Commit 2:** `--include src/styles/site.css`

## Step 4 — `src/pages/index.astro`, markup

Import `DIALS`. Render the three dial sets inside `.finder`. Add `data-hits` to the existing
results list, the `.cannot-say` section, and empty `.nothing`.

The counter row, the masthead, the search label and the tally element keep their current markup;
only the tally's *text* moves into the script.

**Verify:**

```
npm run build
grep -c 'data-dial=' dist/index.html                    # expect: 12
grep -c 'role="group"' dist/index.html                  # expect: 3
grep -c 'aria-labelledby="dial-' dist/index.html        # expect: 3
grep -c 'data-dial' dist/miso-ramen/index.html          # expect: 0 — no other page moves
```

## Step 5 — `src/pages/index.astro`, script

Rewrite `render()` around `query` + `settings`, add `card()`, `paintDials()`, `syncUrl()`,
`say()`, and wire the three events plus the on-load read.

Behaviours to get right, each one an acceptance criterion:

1. no query and no dial → the page is what it was;
2. a dial press loads the index even with an empty box;
3. `replaceState` fires only under D7's policy;
4. the tally waits 350 ms after a keystroke and fires at once on a press;
5. the caps print their remainders;
6. `.nothing` says the right sentence for a query and for a dial.

**Verify:** `npm run verify` — expect the existing 935 tests plus the new ones, and 688 pages
built. Then by hand in a browser (see step 6's list), because none of this is reachable from
vitest.

**Commit 3:** `--include src/pages/index.astro`

## Step 6 — the browser checks and the by-hand pass

```
npm run verify:mobile
```

= `npm run build && node scripts/check-overflow.mjs --width 375,390,768 && node scripts/check-touch.mjs`

Expect both to exit 0: nothing scrolls sideways at 375, 390 or 768, and every control clears
44px. The twelve dial buttons are server-rendered and visible, so `check-touch` measures them
without any seeding.

**By hand, with Chrome at 375px**, driven through `scripts/browser.mjs`'s own plumbing or the
DevTools protocol directly, capturing what the criteria ask for:

| # | what | expected |
| --- | --- | --- |
| 1 | load `/`, press *15 min* on the standing dial | counters replaced; tally reads `227 match · 42 don't · 395 we can't say`; URL becomes `?standing=15` |
| 2 | screenshot that state | **all three answers in one image** — passes above, the cannot-say heading with 395, and the fail count in the tally |
| 3 | reload | same list, dial still pressed |
| 4 | paste the URL into a fresh tab | same list |
| 5 | type `beans` with the dial set | one narrowed list; URL becomes `?q=beans&standing=15` |
| 6 | clear the dial to *Any* | URL falls back to `?q=beans`; counters stay hidden because the query is live |
| 7 | clear the box too | URL is bare `/`; counter row back |
| 8 | Tab from the search box | reaches all twelve buttons; Space presses; focus ring visible |
| 9 | set *Things to wash → 1* | 4 pass, 653 under the heading, capped at 12 with `and 641 more we can't say for` |
| 10 | fresh load with no dial, type `miso` | **no URL write** — the pristine search behaviour is unchanged |

Screenshots and the by-hand transcript go in `progress.md`.

**Commit 4:** whatever step 5 left, if the by-hand pass turns up a fix.

---

## Testing strategy

**What gets a unit test:** everything in `dials.ts`. It is pure, it holds every decision that
could be wrong quietly, and it is the only part of this ticket a future reader can check without
a browser.

**What gets a property over the collection:** the three-way split at each documented stop, the
"no recipe passes on an unanswerable dial" invariant, and the exhaustive walk over all 64
settings combinations × 664 recipes. Cost is 42,496 verdicts, which is microseconds.

**What cannot be tested here, and is measured by hand instead:**

| gap | why | how it is covered |
| --- | --- | --- |
| the rendering | vitest drives no DOM in this repo and adding jsdom is a dependency this ticket does not get to take | the by-hand pass, screenshotted |
| `replaceState` | same | by-hand steps 1, 5, 6, 7, 10 |
| the 350 ms debounce | same | by-hand, and the number is a named constant |
| the live region actually announcing | no screen reader in this environment | by-hand keyboard pass + VoiceOver on the reviewer's machine; the markup is the same `aria-live="polite"` element that already worked |
| touch targets and overflow | needs a real browser | `npm run verify:mobile`, which is exactly that |

**The regression guard for everything else:** `npm run verify` runs `check-recipes`,
`parse-recipes`, the whole vitest suite (including `breakpoints.test.ts`, which reads `site.css`)
and a full `astro build` of 688 pages. Any page other than `/` changing is caught by step 4's
grep and by the build's page count.

---

## Verification criteria, mapped to the ticket

| criterion | verified by |
| --- | --- |
| three dials working with the search box | by-hand 5; `verdict()` composition tests |
| no composite score anywhere | the `DIALS` vocabulary test's regex; `verdict` returns three words |
| cannot-say shown and marked, all three states in one screenshot | by-hand 2 |
| labels plain, rejects recorded | `design.md` D9; the vocabulary test |
| longest-stretch decision argued | `design.md` D2, with the 91% / 18-recipe measurement |
| fourth dial argued | `design.md` D2 and D3 |
| URL state, reload, pasted link | by-hand 1, 3, 4, 5, 6, 7; codec round-trip tests |
| dials with no query does something deliberate | `design.md` D6; by-hand 1 |
| `npm run verify:mobile` | step 6 |
| `aria-live` announces; keyboard-only operable; say how it was tested | by-hand 8, written up in `review.md` |
| built with `b28-clay.css` primitives, no new colours | step 3's grep |
| counter row / search / recipe pages unchanged with no dial | by-hand 10; step 4's grep on `miso-ramen` |
| `npm run verify` passes | step 5 |
| only the owned files modified | `git status --porcelain` at the end of Review |

## Risks, and what happens if they bite

1. **The dials cost ~220px above the counter row at 375px.** Measured during step 6; if the
   front page stops reading as a front door the fallback is a tighter `.dial-name` and a smaller
   gap, not hiding the controls behind a disclosure — a control nobody finds is the problem
   S-010 opens with.
2. **Twelve tab stops before the results.** Accepted in D11 with the reason. If step 6 shows it
   is worse than expected, it is written down as a concern rather than fixed by inventing the
   site's second dial pattern in this ticket.
3. **`check-touch` counts a `<label>` alone.** Avoided by construction — the dial names are
   `<span id>`. Step 6 proves it.
4. **The stop counts drift when the collection grows.** That is what the property test is for; a
   drift fails a test with the old and new numbers in the message, which is the intended
   behaviour, not a flake.
