# T-007-01 — Progress

All six plan steps executed in order. No deviations from `plan.md`; two small additions are noted
where they happened.

---

## Step 0 — Baseline captured ✅

```
$ node scripts/check-recipes.mjs > baseline-check.txt   # exit 0
all 658 file(s) draw a table.

$ node scripts/menu-sections.mjs > baseline-menu-sections.txt
every counter parsed cleanly.
```

`baseline-soup-pot.json` written from the pre-edit `counters.json` so "The Soup Pot is untouched"
could be measured rather than asserted.

`node` is not on the default PATH here; every command below ran under
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`.

---

## Step 1 — `src/data/counters.json` ✅ committed `f95a388`

One object appended after `slow-cooker`. `name: "Cha Chaan Teng"`, `slug: "cha-chaan-teng"`,
`blurb: "Pick a set by the time of day; the milk tea comes with it."`, `categories: []`, seven
sections all with `items: []`.

```
$ node -e '<schema assertion from plan.md §1>'
ok: 22 counters; last = cha-chaan-teng
sections: The set meals (常餐 · 早餐 · 下午茶餐) | The drinks counter | Toast and the bun case |
          Macaroni, noodles and things in soup | Rice plates | Sandwiches and buns | Also here

$ git diff src/data/counters.json | grep -c '^-[^-]'
0
$ git diff --stat src/data/counters.json
 src/data/counters.json | 36 ++++++++++++++++++++++++++++++++++++
 1 file changed, 36 insertions(+)
```

**Zero removed lines is the proof that The Soup Pot was not touched**, and the deep-equal assertion
against `baseline-soup-pot.json` passed alongside it.

*Addition to the plan:* also asserted the file still round-trips
`JSON.stringify(parse(raw), null, 2) + "\n"` byte for byte, so a later
`menu-sections.mjs --write` will not reformat the file as a side effect. Printed `SAME`.

---

## Step 2 — `.cook` demonstration ✅ (written, proven, deleted, never committed)

The throwaway file, `recipes/eggs/zz-counter-probe.cook`, in full:

```cooklang
>> title: Counter Probe
>> category: Eggs
>> tags: probe, throwaway
>> counters: Cha Chaan Teng
>> servings: 1
>> time: 10 min
>> step.1: beat the eggs with the milk
>> step.2: melt the butter over low heat
>> step.3: stir 4 min, off the heat while wet

Beat @eggs{3%large} with @evaporated milk{2%Tbs}(30 mL) and @table salt{1/4%tsp} until no ribbons of white are left.

Melt @unsalted butter{1%Tbs}(15 g) in a #nonstick pan{} over low heat.

Stir @&(~2)beaten eggs{} into @&(~1)butter{} ~cook{4%min}, pulling the curd across the pan and taking it off while it is still wet.
```

**Positive:**

```
$ node scripts/check-recipes.mjs recipes/eggs/zz-counter-probe.cook
  ok   recipes/eggs/zz-counter-probe.cook  4 rows x 3 cols

all 1 file(s) draw a table.
exit=0
```

**Negative control** — the same file with the counter name typo'd to `Cha Chaan Tengg`, to prove the
`ok` above came from the JSON edit and not from a lenient checker:

```
$ node scripts/check-recipes.mjs recipes/eggs/zz-counter-probe.cook
FAIL   recipes/eggs/zz-counter-probe.cook
       - unknown counter "Cha Chaan Tengg" — known: Bakery, Panadería, Taquería, Dim Sum Counter,
         Takeout Counter, Phở & Bánh Mì, Ramen Shop, Curry House, Thai Kitchen, Shawarma Counter,
         Pizzeria, Deli, Diner, Smokehouse, Meat and Three, The Bowl Shop, Instant Pot, One Pot,
         The Soup Pot, Japanese Home Cooking, The Slow Cooker, Cha Chaan Teng

1 of 1 file(s) would not draw a table.
```

`Cha Chaan Teng` appears at the end of the known list, which is the JSON edit showing through.

Deleted immediately:

```
$ rm recipes/eggs/zz-counter-probe.cook
$ git status --porcelain recipes/
(no output)
```

Not committed, and `recipes/` is clean.

---

## Step 3 — `docs/knowledge/counters.md` ✅ committed `97581b6`

Two edits: one Contents row after `Meat and Three`, and the `## Cha Chaan Teng` section inserted
after `## Meat and Three` and before `## Sources` — **not** at the end of the file, because the file
ends with `## Sources` and `## What could not be verified` and appending there would have put a
counter after the file's closing apparatus. That is the one place the plan's wording ("end of the
file") was wrong and the structure was followed instead.

*Addition to the plan:* a `**Cha Chaan Teng.**` bullet was added to the existing `## Sources`
section, listing every board and reference used and pointing at the gap page for the working. The
file's own convention is that each counter's sources are recorded there, and leaving the seventh
pass out would have been the only gap in it.

```
$ node -e '<vocabulary assertion from plan.md §3>'
vocab rows: 31
rows failing the two-spelling rule: 0
contents row: true
names Dim Sum Counter anchor: true
names Takeout Counter anchor: true
authentic used: false
西多士 not-a-french-toast line: true
羅宋湯 no-beetroot line: true
```

31 rows against a required 20. Every row's *Also called* cell carries Chinese characters **and** at
least one Latin-script alternative — checked mechanically, not by eye.

---

## Step 4 — `docs/gaps/cha-chaan-teng.md` ✅ committed `79f4226`

327 lines. Sections: header, `## What it has` (seven empty headings), `## What it is missing`
(24 ranked entries plus a `### The tea` sub-section), `## What this board borrows, and what it must
not` (an eight-row table), `## Components it would need`, `## What a table cannot hold`,
`## Sources`.

**One deviation, found by running the parser.** The first draft kept the `---` rule between the
`## What it has` block and the next heading, the way `pho-and-banh-mi.md` does. Because this block's
headings carry no slugs, that `---` became the trailing chunk's content and `menu-sections.mjs`
reported `unparsed: Also here: ---`. It was a note rather than a problem — the run still ended
`every counter parsed cleanly` — but the plan asked for no `unparsed` line, so the rule was removed.
Sibling pages are unaffected because their headings do carry slugs, which absorb the `---`.

```
$ node scripts/menu-sections.mjs | grep -A4 "Cha Chaan Teng"
  ok   Cha Chaan Teng: 0 sections, 0/0 placed

$ diff baseline-menu-sections.txt /tmp/ms2.txt
166a167
>   ok   Cha Chaan Teng: 0 sections, 0/0 placed
```

**One added line and nothing else** — no `unplaced`, no `listed but not shelved here`, no
`unparsed`, and the run's final tally is still `every counter parsed cleanly.`

```
$ node -e '<structural assertion from plan.md §4>'
headings match counters.json: true
ranked entries: 24
  named: club-sandwich / beef-chow-fun / french-toast / borscht / pineapple-bun /
         egg-custard-tart / lo-mein          (all seven)
  section ok: ## What it has / ## What it is missing / ## Components it would need /
              ## What a table cannot hold / ## Sources
```

---

## Step 5 — Whole-collection verification ✅

```
$ node scripts/check-recipes.mjs > /tmp/after-check.txt   # exit 0
$ diff baseline-check.txt /tmp/after-check.txt
(no output)  →  CHECK OUTPUT BYTE-IDENTICAL TO BASELINE

$ npm run verify
all 658 file(s) draw a table.
counters: 658 named, 0 inferred from category · timers in 635 · pairings 760
Test Files  9 passed (9)
     Tests  833 passed (833)
[build] 682 page(s) built

$ ls dist/menu/
bakery bowl-shop curry-house deli dim-sum-counter diner instant-pot japanese-home
meat-and-three one-pot panaderia pho-and-banh-mi pizzeria ramen-shop shawarma-counter
slow-cooker smokehouse soup-pot takeout-counter taqueria thai-kitchen
```

21 menu pages, and **no `cha-chaan-teng` page** — `getStaticPaths` in
`src/pages/menu/[counter].astro:16` filters on `menu.count > 0`, so the empty counter generates no
route and the page count is unchanged at 682. That is the designed behaviour and it is now
observed rather than assumed.

```
$ git status --porcelain
?? docs/active/stories/S-007-a-counter-you-can-shop-for.md
?? docs/active/tickets/T-007-0{1..5}-*.md
?? docs/active/work/T-007-01/
```

All three owned files are committed through `lisa commit-ticket`. Nothing under `src/`, `recipes/`,
`docs/knowledge/` or `docs/gaps/` is staged, modified or untracked. The remaining untracked entries
are the S-007 board files that predate this attempt and Lisa's own work directory.

---

## Commits

| SHA | Message | `--include` |
| --- | --- | --- |
| `f95a388` | Open the Cha Chaan Teng counter | `src/data/counters.json` |
| `97581b6` | Argue the Cha Chaan Teng into the counter reference | `docs/knowledge/counters.md` |
| `79f4226` | Write the Cha Chaan Teng work list | `docs/gaps/cha-chaan-teng.md` |

No ordinary `git add`, no `git add -A`, no ordinary `git commit`. Nothing left staged.

---

## Step 6 — Review

`review.md` and `review-disposition.json` written next, then `lisa check-disposition T-007-01`.
