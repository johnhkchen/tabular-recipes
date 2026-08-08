# T-007-01 — Plan

Six steps. Each is independently verifiable and three of them end in a `lisa commit-ticket`.

`node` is not on the default PATH in this shell. Every command below assumes
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` has been run first.

---

## Step 0 — Capture the baseline

Before any edit, record what must not change, so "unchanged" is a measurement rather than a claim.

```
node scripts/check-recipes.mjs > .lisa/attempts/T-007-01/1/work/baseline-check.txt
node -e 'const c=require("./src/data/counters.json").counters;
         require("fs").writeFileSync(".lisa/attempts/T-007-01/1/work/baseline-soup-pot.json",
           JSON.stringify(c.find(x=>x.slug==="soup-pot"),null,2))'
git status --porcelain
```

**Verify:** the check output ends `all 658 file(s) draw a table.` with no over-cap block, and
`git status` shows only the three untracked S-007 board files that were already there.

**No commit.** These are scratch files inside the attempt directory, not repository work.

---

## Step 1 — Add the counter to `src/data/counters.json`

Append the entry from `structure.md` §1 after `slow-cooker`. Hand-edit rather than script it, so
the surrounding formatting is untouched.

**Verify, in order:**

```
node -e 'const f=require("./src/data/counters.json");
         const c=f.counters, n=c.at(-1);
         console.assert(c.length===22, "count");
         console.assert(n.slug==="cha-chaan-teng" && n.name==="Cha Chaan Teng");
         console.assert(Array.isArray(n.categories) && n.categories.length===0, "categories must be empty");
         console.assert(n.sections.length===7 && n.sections.every(s=>s.items.length===0), "sections");
         const before=require("./.lisa/attempts/T-007-01/1/work/baseline-soup-pot.json");
         console.assert(JSON.stringify(c.find(x=>x.slug==="soup-pot"))===JSON.stringify(before), "SOUP POT MOVED");
         console.log("ok", c.length, "counters")'
git diff --stat src/data/counters.json
git diff src/data/counters.json | grep -c '^-[^-]'
```

The last command must print `0`: **no line is removed from this file**, which is the strongest
mechanical statement of "The Soup Pot is untouched by this ticket."

```
node scripts/check-recipes.mjs | tail -3
```

must still say `all 658 file(s) draw a table.`

**Commit:**
`lisa commit-ticket --ticket-id T-007-01 --message "Open the Cha Chaan Teng counter" --include src/data/counters.json`

---

## Step 2 — Prove a `.cook` file can name the counter, then delete it

The acceptance criterion is *"A `.cook` file naming `counters: Cha Chaan Teng` passes its check.
Demonstrate it in the work artifact with a throwaway file; do not commit it."*

Write `recipes/eggs/zz-counter-probe.cook` — a real, minimal, table-drawing file (≥3 ingredient rows,
≥3 operations, all four required metadata keys) whose only purpose is the `>> counters:` line. Run:

```
node scripts/check-recipes.mjs recipes/eggs/zz-counter-probe.cook
```

**Verify:** the line begins `  ok   recipes/eggs/zz-counter-probe.cook` with a `rows x cols` count
and no `unknown counter` problem. Copy the file and the exact output into `progress.md` verbatim —
that transcript **is** the artifact the criterion asks for.

Then, and in the same step so it cannot be forgotten:

```
rm recipes/eggs/zz-counter-probe.cook
git status --porcelain recipes/
```

must print nothing.

Negative control worth running while the probe exists: change the counter name to
`Cha Chaan Tengg` and confirm the checker fails with `unknown counter`. That proves the `ok` came
from the JSON edit and not from the checker being lenient.

**No commit** — nothing repository-owned changed in this step.

---

## Step 3 — Write the `## Cha Chaan Teng` entry in `docs/knowledge/counters.md`

Two edits: the Contents row, and the section at the end of the file.

Write the vocabulary table to ≥ 20 rows against the plan in `structure.md` §2b, drawing every name
from the boards in `research.md` §3 and never from memory.

**Verify:**

```
node -e '
const md=require("fs").readFileSync("docs/knowledge/counters.md","utf8");
const sec=md.slice(md.indexOf("## Cha Chaan Teng"));
const rows=sec.split("\n").filter(l=>/^\|/.test(l)).slice(2);   // drop header + separator
console.log("rows:", rows.length);
const bad=rows.filter(r=>{
  const also=r.split("|")[2]||"";
  const hasCJK=/[㐀-鿿]/.test(also);
  const parts=also.split(",").map(s=>s.trim()).filter(Boolean);
  const hasLatinAlt=parts.some(p=>/^[\x20-\x7E]+$/.test(p));
  return !(hasCJK && hasLatinAlt);
});
console.log("rows failing the two-spelling rule:", bad.length);
bad.forEach(r=>console.log("  ", r.slice(0,90)));
console.log("contents row present:", /\[Cha Chaan Teng\]\(#cha-chaan-teng\)/.test(md));
'
```

**Expected:** `rows: >= 20`, `rows failing: 0`, `contents row present: true`.

Read the entry once more against three things by eye: no "authentic"; the Dim Sum Counter and the
Takeout Counter are both named with working anchors; 西多士 and 羅宋湯 each carry a *what it is not*
sentence.

**Commit:**
`lisa commit-ticket --ticket-id T-007-01 --message "Argue the Cha Chaan Teng into the counter reference" --include docs/knowledge/counters.md`

---

## Step 4 — Write `docs/gaps/cha-chaan-teng.md`

Structure per `structure.md` §3. The four things that must be right, in the order they are easiest
to get wrong:

1. **Rank by cookable-tonight.** Ranks 1-8 need a saucepan, a pan or a toaster. A wok, a deep-fryer
   or one-shop-across-town pushes an entry down.
2. **All seven slugs** get a verdict with a reason, and the two *write a new file* rows say what the
   new file must declare it is not.
3. **The tea section reports ranges and attributes them.** No modal number stated flatly.
4. **Components named once** — the tea base, the tomato sauce, the curry, the satay beef — with the
   dishes each feeds.

**Verify:**

```
node scripts/menu-sections.mjs | grep -A3 "Cha Chaan Teng"
```

**Expected:** `ok   Cha Chaan Teng: 0 sections, 0/0 placed` and **no** `listed but not shelved
here`, **no** `unplaced`, **no** `unparsed:` line under it. The whole run's `N counter(s) need a
look` tally must not increase over the baseline.

Then a structural assertion:

```
node -e '
const fs=require("fs"), md=fs.readFileSync("docs/gaps/cha-chaan-teng.md","utf8");
const titles=require("./src/data/counters.json").counters.find(c=>c.slug==="cha-chaan-teng")
  .sections.map(s=>s.title);
const block=md.split("## What it has")[1].split(/\n## /)[0];
const heads=[...block.matchAll(/^\*\*(.+?)\*\*/gm)].map(m=>m[1].replace(/\.$/,""));
console.log("titles match counters.json:", JSON.stringify(heads)===JSON.stringify(titles));
console.log("heads:", heads);
const ranked=(md.match(/^\d+\.\s/gm)||[]).length;
console.log("ranked entries:", ranked);
for (const s of ["club-sandwich","beef-chow-fun","french-toast","borscht","pineapple-bun","egg-custard-tart","lo-mein"])
  console.log(md.includes(s) ? "  named: "+s : "  MISSING: "+s);
for (const h of ["## What it has","## What it is missing","Components","cannot hold","Sources"])
  console.log(md.includes(h) ? "  section ok: "+h : "  MISSING SECTION: "+h);
'
```

**Expected:** titles match `true`; ranked entries ≥ 20; all seven slugs named; all five sections
present.

Note the one place this assertion is in tension with the parser: the seven slugs are named in the
*borrows* section, which is **after** `## What it has`, so `menu-sections.mjs` never sees them. Both
checks above must pass together — that is the proof they do not collide.

**Commit:**
`lisa commit-ticket --ticket-id T-007-01 --message "Write the Cha Chaan Teng work list" --include docs/gaps/cha-chaan-teng.md`

---

## Step 5 — Whole-collection verification

```
node scripts/check-recipes.mjs > /tmp/after-check.txt; echo "exit=$?"
diff .lisa/attempts/T-007-01/1/work/baseline-check.txt /tmp/after-check.txt && echo "check output identical"
npm run verify
git status --porcelain
```

**Expected:**

- `check-recipes` exits 0 and its output is **byte-identical** to the baseline. The criterion is
  *"reports ok for the whole collection, unchanged"*, and identical output is the literal reading.
- `npm run verify` green end to end: 658 files draw a table, 658 recipes parse, 825 tests in 8
  files, 682 pages build.
- `git status --porcelain` shows **no** modified, staged or untracked file under `src/`,
  `recipes/`, `docs/knowledge/` or `docs/gaps/` — the three owned files are committed, the probe is
  deleted, and the only remaining untracked entries are the S-007 board files that predate this
  attempt (`docs/active/stories/S-007-*.md`, `docs/active/tickets/T-007-0*.md`) plus this attempt's
  own `.lisa/` scratch.

If `npm run verify` fails for a reason unrelated to these three files, record it in `progress.md`
and treat it as a Review blocker rather than fixing it here — it would be outside this ticket's
ownership.

---

## Step 6 — Review artifacts

`review.md` (~200 lines): what changed file by file, what was verified and with which command and
what it printed, the criteria table with evidence against each, and the open concerns —
specifically:

- `menu-sections.mjs --write` would today **drop all seven sections** from the new counter, because
  the parser only emits a section that found a slug. That is correct behaviour for an unfilled
  shelf and is the same state `soup-pot.md` described for itself, but `docs/gaps/README.md` claims
  the parser reproduces `counters.json` byte for byte, and that claim is now false for one counter
  until T-007-05 shelves items. Say so plainly and name the ticket that closes it.
- The Contents table in `docs/knowledge/counters.md` still lists 15 of 22 counters. Out of scope,
  named for whoever wants it.
- Cantonese romanisations in the vocabulary table are written without tone marks and were compiled
  from the sources cited, not from a dictionary pass — the same caution `soup-pot.md` gives.

`review-disposition.json`: `{"disposition":"pass","reason":null}` if every criterion has evidence,
otherwise a block with a one-sentence `ask` naming what a person must do.

Then `lisa check-disposition T-007-01`, and correct anything it reports.

---

## Testing strategy, stated once

There is no unit test to add: this ticket changes one data file and two prose files, and the
behaviour it introduces (a counter name being accepted) is already covered by
`src/lib/collection.test.ts` and by the two validators. The testing here is therefore

- **a schema assertion** on the new JSON entry (step 1),
- **an end-to-end probe** that a real `.cook` file naming the counter passes the real checker, plus
  a negative control that a typo'd name fails (step 2),
- **a format assertion** on the vocabulary table against the criterion that is hardest to eyeball —
  every row carrying two kinds of spelling (step 3),
- **a parser round-trip** proving the gap page's headings equal the JSON's titles (step 4),
- **a byte-identical diff** of the whole-collection check against a pre-change baseline (step 5).

Each of the five maps to exactly one acceptance criterion, and each fails loudly rather than
silently.
