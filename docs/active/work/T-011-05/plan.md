# T-011-05 — Plan

Five steps. Steps 1-3 are commits; 4 and 5 are verification and evidence.

---

## Step 0 — the evidence, before the code

The criterion says the five-recipe list *"should be checked before the code is written, not
after."* Research §5 did that: `costOf()` was run over all 685 recipes at ×3 and ranked by
`elapsed.at − elapsed.written`, the minutes the page currently adds without saying so.

The five that will be reported in `before-after.md`, chosen as **the worst offenders the change
can actually speak about**, with the two larger ones that it cannot recorded alongside them
rather than dropped:

| Slug | now | after |
| --- | --- | --- |
| `mujaddara` | serves 6 → 18 | + *Three times as much is three times the chopping. The pot doesn't care.* |
| `gumbo` | serves 8 → 24 | + the same, and it is the collection's best-evidenced recipe |
| `air-fryer-chips` | serves 4 → 12 | + *It goes in three lots, and that costs you about 44 min.* |
| `air-fryer-chicken-wings` | serves 4 → 12 | + *It goes in three lots, and that costs you about 42 min.* |
| `beef-bourguignon-instant-pot` | serves 6 → 18 | + *It goes in six lots, and that is the only difference.* |

The numbers are re-read from the build in step 5 and the table is written from that run, not from
this one.

---

## Step 1 — `scaling-words.ts` and its tests

**Do**

1. Write `src/components/scaling-words.ts` to the shape in `structure.md` §1.
2. Write `src/components/scaling-words.test.ts` — the thirteen holds in `structure.md` §4.

**Order inside the file.** The finding union and `findingOf` first (the classification), then the
word helpers, then `wordsFor` (the phrasebook), then the table (`buildCostTable`, `readCost`),
then `eveningLine`. Header comment carries: why it is not in `src/lib/`, why `bounded` is tested
before `evidence`, and that no string here may contain notation.

**Verify** — `npx vitest run src/components/scaling-words.test.ts`. Green, and the two
whole-collection tests (no notation anywhere; every bounded recipe speaks) pass over all 685
files.

**Commit** — `lisa commit-ticket --ticket-id T-011-05 --message "Say what the multiplier costs"
--include src/components/scaling-words.ts --include src/components/scaling-words.test.ts`

---

## Step 2 — `PlanCosts.astro`

**Do**

1. Write `src/components/PlanCosts.astro` per `structure.md` §2.
2. Guard the serialisation: `JSON.stringify(table).replace(/</g, '\\u003c')`. An
   `application/json` script element is still terminated by `</script`, and a recipe title or a
   vessel name is author-written text. `<` is valid JSON and parses back to `<`.

**Verify** — `npm run build`, then confirm the island exists and parses:

```
node -e "const h=require('fs').readFileSync('dist/list/index.html','utf8');
  const m=h.match(/data-plan-costs[^>]*>([\s\S]*?)<\/script>/);
  const t=JSON.parse(m[1]);
  console.log(Object.keys(t.at).length, t.says.length, m[1].length)"
```

Expect 685 slugs, ~76 sentences, and a size in the region of 60 KB. **If it lands above 100 KB,
stop and reconsider** — `design.md` §6 records the 27 KB alternative and why it was rejected;
crossing that line would be a reason to re-argue it in `progress.md` rather than to ship it
quietly.

**Commit** — `--include src/components/PlanCosts.astro`

---

## Step 3 — `list.astro`

**Do**, in this order, so each is separately visible in the diff:

1. Frontmatter import and `<PlanCosts />` as the first child of `.list-page`.
2. `<p class="fine evening" data-evening hidden></p>` between the planned list and the doubling
   note.
3. Script: the island reader (`readTable`), the `costLine` builder, the two hooks inside
   `drawPlanned`, and the total.
4. The three style rules.

**The two things most likely to go wrong here**, both worth checking by hand before the scripted
checks run:

- **The redraw.** `drawPlanned` replaces every child on every change. The cost line must be built
  inside that function, from `item.multiplier`, not cached — press ×2 then ×3 and the sentence
  must change with the dial.
- **The `hidden` attribute.** `.list-page :global([hidden]) { display: none !important }` is
  already in the file, so setting `evening.hidden` is enough; do not also set `style.display`.

**Verify** — `npm run verify`. `astro build` catches the TypeScript, `vitest` catches the rest.

**Commit** — `--include src/pages/list.astro`

---

## Step 4 — the two gates

```
npm run verify          # check-recipes, parse-recipes, vitest, astro build
npm run verify:mobile   # build, check-overflow 375/390/768, check-touch
```

Both must exit 0. `verify:mobile` needs the Chrome on the machine; if it cannot launch one the
run reports exit 2 and that is a **block**, not a pass — the criterion names the command.

Expectations, so a surprise is recognised as one:

- `check-overflow` — nothing new. The cost line is prose inside `.what`, which is
  `flex: 1 1 14rem; min-width: 0`, so a long sentence wraps rather than pushing the row.
- `check-touch` — nothing new. Nothing added is interactive, and the four controls already at
  44px are untouched.
- `breakpoints.test.ts` — nothing new. No media query is added.

---

## Step 5 — the evidence

**The screenshot.** One picture, three cases. `docs/active/work/T-011-05/shot.mjs` drives the
same rig `check-overflow` uses (`scripts/browser.mjs`): serve `dist`, open `/list/`, write a plan
into `localStorage` under `tabular-recipes:plan`, reload, screenshot.

The three recipes, chosen so the picture makes the distinction the criteria ask for:

| Slug | at | what it must show |
| --- | --- | --- |
| `air-fryer-chicken-wings` | ×3 | **a vessel bounds it** — three lots, about 42 min |
| `gumbo` | ×3 | **nothing bounds it** — three times the chopping, the pot doesn't care |
| `beef-rendang` | ×3 | **we cannot say** — the servings line and *nothing else* |

`beef-rendang` is deliberate: it is the largest unwarned cost in the collection (+120 min at ×3)
and it is the one the page must still refuse to speak about. The blank beside two sentences is
what *"visibly different"* looks like, and putting the worst case in the silent slot is the
honest way to show it rather than the flattering one.

Shot at 390px (a phone, which is where a plan page is read) and again at 768px.

**`before-after.md`** — the five recipes, by slug, what the page said before and what it says
after, re-read from the built table. Plus the two the change cannot help and why, and the
whole-collection counts.

**`progress.md`** — written as the steps land, with any deviation and its reason.

---

## Testing strategy, stated once

| Level | What it covers | Where |
| --- | --- | --- |
| Unit | classification, wording, packing, the total | `scaling-words.test.ts`, run by `npm run verify` |
| Whole-collection | no notation on any of 685 recipes; every bounded recipe speaks; the round trip | the same file, iterating `recipes.json` |
| Build | the island exists, parses, and is the expected size | step 2's one-liner, and `npm run build` |
| Layout | no sideways scroll at 375/390/768; every control still 44px | `npm run verify:mobile` |
| By eye | the three cases are distinguishable; nothing at ×1 | the screenshot |

**Not covered by a test, and said out loud:** that the *right* sentence appears for a recipe
nobody has named in a test. The whole-collection tests bound what can go wrong (no notation,
nothing silent that should speak) but they do not read 685 sentences for sense. `before-after.md`
reads ten of them by hand and the screenshot reads three; the rest rests on the classifier having
nine branches and every branch having a named example.

---

## What would make this a block rather than a pass

- `npm run verify:mobile` cannot find a browser, or reports an overflow.
- The island crosses 100 KB.
- A phrasebook row is genuinely missing and the criteria forbid editing `docs/knowledge/`.
  (`design.md` §3 believes none is; if one turns out to be, Review says so and asks.)
