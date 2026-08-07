# T-007-05 — Structure

Four files change. No source code, no test, no `.cook`. Ordering matters in one place and is
called out.

---

## `src/data/counters.json`

One object changes: the `cha-chaan-teng` counter. `name`, `slug`, `blurb`, `categories` are
untouched. `sections` goes from seven empty titles to five populated ones.

```
sections: [
  { "title": "The drinks counter",                    items: 6 }
  { "title": "Toast and the bun case",                items: 4 }
  { "title": "Macaroni, noodles and things in soup",  items: 7 }
  { "title": "Rice plates",                           items: 6 }
  { "title": "Sandwiches and buns",                   items: 4 }
]
```

Removed titles: `The set meals (常餐 · 早餐 · 下午茶餐)`, `Also here` — both empty, both
unreproducible from the gap note (`design.md` §2).

No `notes` key is added to any section. Nothing outside the `cha-chaan-teng` object is touched —
in particular **One Pot's five sections and its four ghost slugs are left exactly as they are**,
because `docs/gaps/one-pot.md` is not owned here and correcting one half of a two-file drift makes
it worse.

The file's leading `"//"` comment is unchanged.

## `src/data/aisles.json`

Three pattern strings added, nothing removed, nothing reordered.

| Aisle | Insert after | Pattern |
| --- | --- | --- |
| `tins` (`patterns`) | `canned tuna` | `luncheon meat` |
| `world` (`patterns`) | `sriracha` | `satay sauce` |
| `world` (`patterns`) | `satay sauce` | `chili garlic sauce` |

Placement inside the array is cosmetic — `aisleFor()` scores every pattern in every aisle and
order only breaks exact ties — so each goes next to the products it sits beside on a real shelf.

`packs.sizes` is not touched. No `except` list is touched. No pattern is deleted.

## `docs/gaps/cha-chaan-teng.md`

Rewritten in four places; 60% of the file is left verbatim because it is the research the counter
was opened on.

| Block | Change |
| --- | --- |
| Header (`**0 recipes.**` … line 24) | Restated: 22 shelved, 5 borrowed, and what the page actually shows. |
| `## What it has` (lines 27–48) | **Replaced.** Five `**Title.** slug · slug` lines in the same order as `counters.json`, plus one plain-prose paragraph above them that is not bold-led so the parser ignores it. |
| `## What it is missing` (lines 50–154) | **Re-ranked** down to what is genuinely absent. Nineteen of the twenty-four ranks are written or shelved; five remain. Each surviving entry keeps its original prose and gains its old rank in parentheses. |
| `### The tea` (lines 155–184) | Kept verbatim, with one new lead-in sentence saying it is now the record behind `hong-kong-milk-tea` rather than an instruction. |
| `## What this board borrows` (lines 188–206) | Verdict column updated to what happened, and a row added for the drop described in `design.md` §1. |
| `## Components it would need` (lines 210–236) | **Re-cut** to the two that are still unwritten; the five that landed inside a dish say which file absorbed them. |
| `## What a table cannot hold` (lines 239–265) | Verbatim. Nothing S-007 did changed what a table can hold. |
| `## Sources` (lines 268–325) | Verbatim, minus the three cautions addressed to T-007-03/04, which are now spent. |

### Shape constraints the `## What it has` block must satisfy

`scripts/menu-sections.mjs` `parseSections()`:

- splits on `\n(?=\*\*)`, so every section is one paragraph starting at column 0 with `**`;
- cuts the title at the first ` — `, and strips a trailing `.`, `—` or `-`;
- splits the remainder on `·` and takes the first slug-shaped token of each piece;
- reports anything it could not parse.

So: no em-dash aside in a title, slugs separated by ` · `, and any prose in the block must not
begin a line with `**`. Line wrapping inside a section is safe (`\n+` is collapsed to a space).

## `docs/gaps/README.md`

| Block | Lines | Change |
| --- | --- | --- |
| Intro | 1–17 | The "one file here is no longer a counter page" note stays. The round-trip sentence stays and is re-verified. |
| `## Build state` | 19–30 | **Replaced** with numbers measured after this ticket. The "measured after T-007-02 and no later" caveat is deleted — it exists because this ticket had not run. |
| `### Retired counters` | 32–43 | Kept. Final paragraph rewritten: the board is 21 counters, all 21 stocked. |
| The fifteen-counter apology | 45–50 | **Deleted.** It exists only because the tally was stale. |
| The three 514-recipe repairs | 52–58 | Kept — still true, still a record. |
| `## The tally` | 60–94 | **Replaced.** 21 rows, no Soup Pot row, Cha Chaan Teng added, `was` re-derived against `096b1d4`, `Only here` recomputed and the correction stated. |
| `## What no single classifier could see` | 96–126 | Kept. The duplicate-name paragraph gains this pass's result. |
| `## The five gaps to fill first` | 128–153 | **Re-ranked.** Gap 5 closed and removed; four remain, one promoted from the runners-up. |
| `## Shelving notes for the maintainer` | 155–179 | Kept. Two bullets gain a line: the three non-food ingredient names are still there, and this pass adds the two aisle findings. |
| `## Recorded and not done` | 181–199 | Verbatim. |

## Files deliberately **not** changed

| File | Why it looks like it wants changing |
| --- | --- |
| `recipes/**/*.cook` (5 borrow candidates) | The only thing that would render the borrow. Forbidden by the last acceptance criterion. |
| `src/lib/counters.ts` | `menuFor()` line 81 is the drop. Not owned; changing it changes every counter. |
| `docs/gaps/one-pot.md` | Five sections behind `counters.json` since `88ca990`. Not owned. |
| `docs/gaps/soup-pot.md` | Correct as a record; `menu-sections.mjs` ignores gap notes with no counter. |
| `src/components/Timeline.astro`, `src/pages/[slug].astro` | Already modified in the working tree by something outside this ticket. |
| `src/styles/site.css` | T-004-03 owns the grid. `auto-fill` needs nothing at 21 cards. |

## Temporary artefact

`src/lib/zz-aisle-dump.test.ts` — a scratch probe that writes `(name, aisle, pattern)` for all
1074 ingredient names to `$DUMP_OUT`, and asserts its own resolver agrees with `aisleFor()` on
every one. It exists only to produce the before/after diff. It is **not committed** and is deleted
before the final verify, which is the run whose output `review.md` quotes.

## Ordering

1. `aisles.json` first, so the after-dump can be taken while `counters.json` still says nothing —
   the aisle diff is over the whole collection and does not depend on sections.
2. `cha-chaan-teng.md`'s `## What it has` next, then `counters.json` hand-edited to match, then
   the round-trip check. Doing the gap note first means the round-trip is a real test of the note
   rather than a transcription check.
3. `README.md` last: its Build state block quotes the final `npm run verify`, so it cannot be
   written until everything else is in.
