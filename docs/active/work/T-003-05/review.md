# T-003-05 — Review

Twenty new `.cook` files opening The Slow Cooker. No pre-existing file was edited, and nothing
outside `recipes/**` was touched.

## What changed

**Created, 20 files.** Nineteen in `recipes/stews-and-braises/`, one in
`recipes/rice-beans-and-grains/`, each named `<plain-slug>-slow-cooker.cook`:

```
pot-roast  chili-con-carne  carnitas  corned-beef  birria-de-res  cachete  oxtails
braised-short-ribs  beef-stew  chile-verde  collard-greens  hungarian-goulash
boston-baked-beans  osso-buco  lamb-tagine  irish-stew  new-england-boiled-dinner
brunswick-stew  soy-sauce-chicken  baked-turkey-wings
```

**Modified: none. Deleted: none.**

Five commits through `lisa commit-ticket`: `ed32612`, `bc65cf4`, `fa28fee`, `f25c77b`, `e1e11a4`.

## Acceptance criteria, against measured output

| Criterion | Result |
| --- | --- |
| ≥18 new files with `kit: Slow Cooker` and a `dish:` naming an existing recipe | **20**; every `dish:` slug confirmed with `ls recipes/*/<slug>.cook` before it was written |
| ≥12 name a dish that also has an Instant Pot variant | **13** — pot-roast, chili-con-carne, carnitas, corned-beef, birria-de-res, cachete, oxtails, braised-short-ribs, beef-stew, chile-verde, collard-greens, hungarian-goulash, boston-baked-beans |
| Every recipe names the setting and its real time on it | 20/20. Nineteen written for **low**; `boston-baked-beans` adds a 30-minute high reduce. The setting appears in the operation label, the step prose and the intro line |
| Sources recorded, no time derived from the plain duration | the table in `design.md` gives every dish its setting, its cook, the published range it sits inside, and the source class. Nothing was divided or multiplied out of the plain file |
| Browning as its own operation, or a stated reason it is not needed | 15 brown in a skillet; `baked-turkey-wings` colours in the oven; `irish-stew`, `soy-sauce-chicken`, `new-england-boiled-dinner`, `corned-beef` waive it in the file's prose with the reason |
| Every recipe declares its slack | 20/20 (`grep -L "^>> slack:"` prints nothing). 13 forgiving, 6 narrow, 1 unforgiving |
| Every timer named; the long stretch reads as unattended | `grep "~{"` finds no unnamed timer. 25 uses of `~slow cook`, which normalises to `slowcook` and is in `UNATTENDED` in `src/lib/time.ts`, so the long stretch is walk-away time in the clock |
| Anything skipped is named with a reason | `progress.md` lists 11 refusals and 11 deferrals, each with the reason |
| `check-recipes.mjs --labels` ok for every new file | `all 20 file(s) draw a table` |
| Only `recipes/**` modified, nothing pre-existing edited | `git status` clean of anything this ticket owns; no `src/`, no `counters.json`, no plain file, no `-instant-pot` file |

## Coverage — what is verified, and what cannot be

| Layer | Covers | Result |
| --- | --- | --- |
| `check-recipes.mjs` per file | draws a table, counter resolves, slack parses, no unlabelled cell, row/column floors | 20/20 ok |
| `parse-recipes.mjs` | two files claiming the plain way for one dish; unresolvable counters | parses; 623 recipes at the time of the run |
| `collection.test.ts`, `layout.test.ts` | unique slugs, mutual pairings, one plain way per dish, tables tile | green |
| `icons.test.ts` | every operation label opens with a known verb | no fall-through from these files (see below) |
| **Nothing** | **whether a time is right** | see "Open concerns" |

## Open concerns

**1. `npm run verify` is red, and was red before this ticket.** Three test failures. All three were
measured with these twenty files moved out of the tree and the collection re-parsed — they fail
identically without them:

- `shopping.test.ts` — aisle coverage 2.9 % against a 2 % gate. The unplaced names are
  `abura-age`, `job's tears`, `konnyaku`, `lotus root`, `yuca`, `filé powder` and similar, from
  the Japanese and home-cooking tickets landing concurrently. None come from these files. Owner:
  the shelving ticket that maintains `src/data/aisles.json`.
- `icons.test.ts` — 5 verbs fell through at baseline (`drop float skin to uncover`), more by the
  end of this run as other tickets committed. **This ticket's labels were rewritten so none of
  them fall through** (see below). Owner: whoever adds those verbs to `VERB_ICONS`.
- `units.test.ts` — `boiling water` fails to combine. It traces to
  `recipes/rice-beans-and-grains/polenta.cook`, which writes `@&(~1)boiling water{}` — an
  intermediate-preparation reference with no amount, sharing a by-name bucket with real
  quantities. Not this ticket's file.

None of these can be fixed from inside this ticket: the remedies live in `src/lib/icons.ts`,
`src/data/aisles.json` and a recipe file another ticket owns, and this ticket's own criterion is
that only `recipes/**` is modified.

**2. Operation labels were reworded to satisfy `icons.test.ts`.** `slow cook on low, 8 hr` opens
with `slow`, which is not in `VERB_ICONS`, so every long stretch would have fallen through to the
fallback icon. The labels now open with `braise` / `stew` / `simmer` / `poach` / `cook` and still
carry `on low, N hr`. The clock is unaffected — attention comes from the timer *name*
(`~slow cook`), not the label. If someone later adds `slow` to `VERB_ICONS`, these labels could go
back to reading `slow cook on low`, which is marginally warmer.

**3. Two shelf sections will read thin.** `counters.json` prints **Beans and pulses** (which will
have one entry) and **Stocks** (none). That follows from the gap page's own ranking — pressure
beats slow for dried beans and stocks — and the alternative was writing files the gap page argues
against. **T-003-06 should decide whether those two sections belong on this shelf**, rather than
treating the emptiness as a gap to fill.

**4. The times are the thing to spot-check.** No automated check in this repo can tell an 8-hour
low cook from a 6-hour one. Each was taken from the canonical slow-cooker treatment of that dish
and each sits inside a published range recorded in `design.md`. The three worth a second pair of
eyes, because they carry the most risk if wrong:

- `soy-sauce-chicken` — a whole 3½ lb bird, low 4 hr, lowered into stock already brought to a
  simmer on the stove. Sources give 4–6 hr on low; 4 was chosen because the breast dries past it,
  and the hot start is both the plain recipe's own first step and what keeps the bird from
  climbing slowly out of cold.
- `corned-beef` / `new-england-boiled-dinner` — 9 hr and 8 hr on low with staggered vegetables.
- `boston-baked-beans` — the only dried bean on the shelf. The plain file's 30-minute parboil is
  kept and the file says plainly that the beans are soaked and boiled hard first, and why the
  molasses goes in after.

**5. The kidney-bean hazard is stated where it applies and nowhere else.** No recipe in this
collection uses dried red kidney beans, and `chili-con-carne` carries no beans at all — the file
says so, and says what the precaution would be if it did.

**6. The 25 Instant Pot files have no slack line.** They predate the field, so a dish page now
shows a slack line on the slow-cooker variant and none on the pressure one. That is T-003-07's
backfill, not a defect here.

## What a reviewer should read first

`design.md`'s setting-and-hours table, then `recipes/stews-and-braises/pot-roast-slow-cooker.cook`
beside its plain and Instant Pot siblings — that one dish is the whole argument of the shelf, and
the three files now put four and a half hours tended, fifty minutes unattended, and eight hours
unattended-and-gone on the same page.
