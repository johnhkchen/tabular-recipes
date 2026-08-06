# T-006-01 · Structure — two files, one rendered string, one stale comment

The blueprint. No new modules, no new interfaces, no new files in `src/`.

---

## Files touched

| file | change | rendered? |
| --- | --- | --- |
| `src/pages/[slug].astro` | one string literal, line 42 | **yes** — all 658 pages |
| `src/components/Timeline.astro` | one comment clause, lines 225–226 | no |

## Files deliberately not touched

| file | why |
| --- | --- |
| `src/styles/site.css` | the chip label is unstyled and inherits; `.chips` is `flex-wrap: wrap`, so a longer label wraps. The ticket permits this file; nothing needs it. |
| `src/lib/schedule.ts` | out of scope by the ticket; neither figure is recomputed |
| `recipes/**/*.cook` | out of scope; T-006-02 owns the 14 |
| `src/lib/*.test.ts` | nothing in the suite reads the chip label — see §4 |

---

## 1. `src/pages/[slug].astro` — the one rendered change

**Line 42, inside the `facts` array (lines 40–44).**

Before:

```js
const facts = [
  recipe.metadata.servings && { label: 'serves', value: recipe.metadata.servings },
  recipe.metadata.time && { label: 'about', value: recipe.metadata.time },
  { label: '', value: recipe.category },
].filter(Boolean) as { label: string; value: string }[];
```

After:

```js
const facts = [
  recipe.metadata.servings && { label: 'serves', value: recipe.metadata.servings },
  // The label is the whole attribution: the value is the author's `>> time:`, quoted, and this
  // says so. It was "about", which read as the site hedging a number it had not worked out —
  // and put the same word on the page twice, meaning something else in the clock's "Needs you".
  recipe.metadata.time && { label: 'recipe says', value: recipe.metadata.time },
  { label: '', value: recipe.category },
].filter(Boolean) as { label: string; value: string }[];
```

**Shape of the change:** a string literal in the `label` field. No type change — `facts` is
already `{ label: string; value: string }[]`. No change to the render at lines 70–77, which
already prints `{fact.label && \`${fact.label} \`}` followed by `<b>{fact.value}</b>`.

**Comment added: 3 lines.** Comments are stripped by `measure-pages.mjs` before counting and are
not shipped by Astro's frontmatter compilation at all, so they cost the reader nothing. They exist
because the next person to read line 42 needs to know that the label slot is doing attribution
work and must not drift back into a hedge.

**Rendered delta, exactly:**

| | text a reader meets | chars |
| --- | --- | ---: |
| before | `about 24 hr` | 11 |
| after | `recipe says 24 hr` | 17 |

The label token: `about` (5) → `recipe says` (11). **+6 characters, on all 658 pages**, so the
mean moves by exactly 6: 2823 → 2829.

**Strings added, quoted, with counts** (the acceptance criterion asks for this list):

| string | characters |
| --- | ---: |
| `recipe says` | **11** |

That is the whole list. One string. Nothing else rendered is added, moved or removed anywhere.

`voice.md` check on it: *would a friend say it at a kitchen table* — "recipe says four hours", yes.
*Does it change how you cook it* — yes: it tells you which of the two totals to plan the afternoon
around. *Say it once* — it is said once, on one figure, and the word it replaces is not
reintroduced anywhere. Two words, inside the ticket's "two or three words per figure".

---

## 2. `src/components/Timeline.astro` — the comment that stops being true

**Lines 219–227**, the block arguing why `Needs you` says `about`:

```
 * The hands-on figure is fuzzy rather than short, so it takes the other word.
 *
 * It is wrong in both directions at once: untimed steps leave minutes out of it, and hands-on
 * is the fallback whenever a step says nothing about whether you can leave — french onion
 * soup's 50-minute caramelise is in there on our say-so alone. A floor word would claim a
 * direction we do not have; "about" is the honest shape of the number, and it is the word the
 * page already uses for the author's own time in the chips above.
```

The final clause — *"and it is the word the page already uses for the author's own time in the
chips above"* — is false after §1. The chip no longer uses it.

**The change:** replace that clause with the fact that replaces it — that `about` is now the
page's word for a figure the site worked out, and the chip says whose the other one is. The rest
of the paragraph is untouched, because untimed-steps-leave-minutes-out and hands-on-is-the-
fallback are both still true and are the actual argument.

Rewritten tail:

```
 * direction we do not have; "about" is the honest shape of the number. The chip above no longer
 * shares the word — it says "recipe says", because quoting the author is not hedging — so
 * "about" now means one thing on the page: a figure this panel worked out.
```

**Zero rendered characters.** This is inside the Astro frontmatter comment block at the top of the
component and never reaches the HTML.

**No other line of `Timeline.astro` changes.** In particular:

- `:214` `totalText` and `:228–232` `handsOnFigure` are untouched — these produce the two strings
  the acceptance criterion requires to be byte-identical.
- `:274` `<h2>The clock</h2>` is untouched — the rejected option C.
- `:196–201`, the comment recording that the author's `>> time:` is deliberately not printed in
  the panel, stays exactly as it is. It is still true and it is still the reason the panel needs
  nothing.

---

## 3. Ordering

The two edits are independent — one is rendered, one is a comment — so ordering is a
readability choice, not a correctness one. They ship as **one commit**, because the comment is
only correct in the presence of the code change and vice versa. Splitting them would leave one
commit in the history where the source contradicts itself.

Order within the change:

1. `[slug].astro:42` — the label.
2. `Timeline.astro:225–226` — the comment.
3. Build, measure, diff, verify.

---

## 4. Verification surface

There is no `.astro` test harness in this repository (research §5), so the checks are against the
built site and the existing suites.

| check | what it establishes | how |
| --- | --- | --- |
| figure diff, 658 pages | neither figure changed value | before/after TSV of chip time + `Start to finish` + `Needs you`, per slug; column 3 and 4 must be **identical**, column 2 must differ only by `about ` → `recipe says ` |
| `measure-pages.mjs` | the cost, in characters | mean must land on **2829** (2823 + 6) |
| ten-string grep | S-005's deleted sentences are still gone | `--count` for each of T-005-02's ten strings over the built site; all **0** |
| `npm run verify` | check-recipes, parse, vitest, astro build | exit 0 |
| `npm run verify:mobile` | 375/390/768 no sideways scroll, 44px touch targets | exit 0 |

**No new test file.** The one code change is a string literal in a template with no logic; there
is no pure function to unit-test and no renderer to render a component into. Adding a component
test harness would mean a new devDependency, which is outside a ticket permitted three files. This
matches T-005-02's precedent for the same surface, and the built-site diff is the stronger check
for the claim actually being made — *these 1316 strings did not move* is a property of 658 pages,
not of a fixture.

**A note on the "byte-identical" proof and the 23.** The 23 chip-only pages render no
`Start to finish` and no `Needs you` at all (the `timesNothing` branch). The diff records their
absence as `-` in both columns, so a page that gained or lost a stat block would show up as a
changed row rather than as a silently skipped one.

---

## 5. What a reviewer should look at, in order

1. `src/pages/[slug].astro:42` — the one string that reaches a reader.
2. `docs/active/work/T-006-01/design.md` §"Why A" — the argument that the clock panel attributes
   itself by showing its work, which is the only judgement call in this ticket.
3. `review.md`'s open concern — option D, `The clock, from the steps`, +16 characters, and why it
   was not taken.
