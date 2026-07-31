# T-003-01 — Design

Two jobs. Job 1 is thirty lines of JSON and four real decisions; Job 2 is three documents whose
shape decides whether three writers succeed. Options and rationale for each, then the
cross-cutting choices.

---

## Job 1 — the three counter entries

### D1.1 What `categories` gets

| Option | Effect |
| --- | --- |
| **A. `[]` on all three** | Nothing is inferred. The shelves stay empty until a recipe names them or T-003-06 lists a slug. |
| B. The Soup Pot gets `["Soups"]` | Would claim every soup that names no counter. Research §2: **0 counters are currently inferred from category** across 553 recipes, so it would claim nothing today and then silently swallow the next unclassified soup. |
| C. The Slow Cooker gets `["Stews & Braises"]` | Actively wrong: it asserts that a braise is a slow-cooker dish. T-003-06's criterion is *"shelves every recipe carrying `kit: Slow Cooker`, and nothing else"* — a category fallback is the one mechanism that can break that. |

**Chosen: A.** It matches all three T-002-01 siblings and nine of the fifteen S-001 counters, and
for The Slow Cooker it is the only option compatible with a downstream acceptance criterion.

### D1.2 The blurbs

The constraint is stated twice: the ticket ("about the bargain rather than the queue — what you
put in, and what you get back for it, keep the register out of it") and T-002-01's own §D1.4
("a one-line instruction to a visitor standing at the counter, second person or imperative, no
cuisine adjectives"). The story's table already states each bargain in one line, which is the
raw material.

| Counter | Rejected | Chosen |
| --- | --- | --- |
| The Soup Pot | "Slow-simmered Cantonese soups for the family table." — a cuisine description, and *slow-simmered* is a menu adjective, not an instruction. | **"Put it on, leave it alone for three hours, and it gets better."** |
| Japanese Home Cooking | "Balanced Japanese meals built from small make-ahead dishes." — accurate and unreadable; *balanced* is the health register the brand forbids. | **"Small dishes, made once, that add up to dinner all week."** |
| The Slow Cooker | "Set it in the morning for an evening meal." — close, but *set it* is appliance-manual English. | **"Fill it before you leave; dinner is waiting when you get back."** |

Each names what the visitor puts in and what comes back, in second person, with no register, no
cuisine adjective and no jargon. They sit beside *"Lock the lid and walk away; it gets there on
its own"* without repeating its shape.

One check applied: the story's own words were not copied verbatim. *"Put it on, walk away for
three hours, and it improves"* is the story's line; **improves** is a report about the food,
**gets better** is what a person says. Same for the other two.

### D1.3 The section titles

**Chosen: adopt the ticket's titles verbatim.** The ticket permits improvement; each was tested
and none earned the change.

- All eighteen pass the brand test already — "Braises, left alone all day", "Made ahead (作り置き)",
  "Quick daily soups (滾湯)" are plain, verb- or thing-forward, and say what the shelf holds.
- Non-English section names are established: Panadería prints *Pan Dulce* and *Pan Salado*,
  Taquería prints *Arroz y frijoles*, Phở & Bánh Mì prints *Phở (P)* and *Bánh mì (S)*. The
  English-first-then-real-name shape here — *Simmered things (煮物)* — is the same move, and it is
  wayfinding: 煮物 is the word a cook would look up.
- Two candidate rewrites, both rejected. *"Beans and pulses"* → *"Beans from dry"* would match the
  Instant Pot sibling exactly, but the slow cooker's bean story is **not** "from dry" (see D2.4 —
  it is the one place the machine is worse), so borrowing the sibling's title would state a claim
  the shelf cannot keep. *"What each thing is for"* → *"The dried-goods shelf"* reads more like a
  section of a menu but loses the entire point of the section, which is the reasoning rather than
  the packet.
- T-003-06 writes these titles into its own work. A rename now costs that ticket a round trip.

Two mechanical constraints checked against all eighteen: **no ` — ` in any title**
(`menu-sections.mjs:55` cuts a title there), and no title ends in a period.

### D1.4 Empty item lists, and the "Also here" question

The ticket requires empty lists; T-003-06 fills them. Verified safe in Research §2: a section
with zero resolved recipes is dropped at render and a counter with zero recipes generates no
page, so the three shelves are invisible until stocked.

T-003-06's criterion *"no counter renders an 'Also here' section"* is not a contradiction with
writing one now. `Also here` is the catch-all four existing counters use; it is written so that
T-003-06 has somewhere to put a borrowing that fits no other heading, and its criterion says the
end state should be that nothing needed it. If it ends up empty it disappears on its own. This is
recorded in each gap file so T-003-06 does not read the empty section as a mistake.

---

## Job 2 — the three work lists

### D2.1 Which gap-file shape

| Option | Assessment |
| --- | --- |
| **A. The S-002 shape** — `## What is already here`, plus the paragraph explaining why the heading is not `## What it has` yet | Correct by construction: `menu-sections.mjs` reads only `## What it has`, and every slug these three files list is shelved elsewhere. Parsing them would report each as *listed but not shelved here*. |
| B. The S-001 shape — `## What it has` | Would make `node scripts/menu-sections.mjs` report nineteen counters' worth of false mismatches the moment these files land. |

**Chosen: A**, with one correction to the inherited paragraph: the sibling files name **T-002-08**
as the ticket that renames the heading. For these three it is **T-003-06**. Copying that sentence
unchanged would send a writer to the wrong ticket.

### D2.2 How the Soup Pot's ranked list is ordered — the one that can break a writer

T-003-03 must produce ≥20 soups, of which **≥12 are 老火湯 and ≥5 are 滾湯**, and it is told to
write "the dishes at the top of `docs/gaps/soup-pot.md` … in that order, as far as the count
reaches."

| Option | What happens to T-003-03 |
| --- | --- |
| A. One list, strictly ranked by conspicuousness of absence | The most conspicuous absences are all 老火湯. A writer working top-down for 20 files gets ~18 老火湯 and 2 滾湯, and **fails the ≥5 滾湯 criterion while following instructions exactly**. |
| **B. Ranked inside genre blocks, with the reading order stated in the file** | The 老火湯 block is ranked 1–16 and comes first; the 滾湯 block is ranked separately; the file says in one sentence: *write the first twelve of the first block and the first five of the second, then keep going down the first block.* |
| C. Interleave to hit quotas | Produces a list whose order encodes an acceptance criterion rather than the shelf's own logic, and breaks the moment the criterion changes. |

**Chosen: B.** The ranking still carries the judgement — most conspicuous absence first inside each
genre — and the one sentence about reading order is the thing that stops a compliant writer from
failing. This is the single highest-leverage decision in the ticket.

### D2.3 How the Soup Pot carries "the logic, not just the names"

The ticket is explicit that a list of soup names without the reasoning "will read as nothing".
Three ways to carry it:

| Option | Assessment |
| --- | --- |
| A. A prose essay before the list | Read once, then skipped. A writer opens this file to find their next dish, not to read an introduction. |
| B. A reason per soup, inside the ranked entry | Necessary but not sufficient — the *shared* logic (why a pot is not stirred, why the solids are discarded, what 潤 means across ten different soups) gets restated ten times and drifts. |
| **C. Both: a short glossary of the recurring dried goods and the seasonal frame, then a reason per soup that leans on it** | The glossary is the section titled *What each thing is for* on the counter, so the file and the shelf agree. Each ranked entry then says what **this** pairing is for, in one clause, and does not re-teach 淮山 eleven times. |

**Chosen: C.** The glossary is the part T-003-03 cannot derive on its own and the part that makes
twenty tables consistent with each other.

**The framing rule, applied throughout:** the tradition's own reasoning is written as the
tradition's reasoning — *"made in a damp spring, for 袪濕"*, *"the pot a family drinks when someone
has been coughing"* — never as a claim the site asserts about a body. The ticket names this and
T-003-03 repeats it; the gap file has to model it, because a writer copies the register they are
handed.

### D2.4 What "helps more or less than pressure" looks like for The Slow Cooker

The criterion needs **≥20 existing dishes, each with its slug and a verdict**. Options for the
form:

| Option | Assessment |
| --- | --- |
| A. Prose paragraph per dish, like `instant-pot.md`'s ranks 1–12 | Beautiful at twelve entries, unreadable and unscannable at thirty, and the verdict gets buried in the sentence. |
| **B. A table: dish · slug · IP variant? · the machine helps *more* / *less* / *differently* than pressure · one clause of why** | Scannable, forces a verdict on every row, and makes the twelve three-way-choice candidates countable at a glance — which is exactly the number T-003-05 has to hit. |
| C. Two lists, "slow cooker wins" and "pressure wins" | Loses the dishes where the honest answer is *differently*, which is the interesting half — `carnitas` and `corned-beef` both live there. |

**Chosen: B**, with the twelve strongest given a short prose entry above the table, mirroring
`instant-pot.md`'s "the twelve that pay for the appliance" so the two files read as a pair.

The verdict vocabulary is fixed at three words so it can be scanned: **more**, **less**,
**differently**. Anything else invites a writer to hedge.

### D2.5 What the Japanese file's "shelve this / leave it" call rests on

The criterion: separate the existing Japanese recipes into *shelve this* and *this is restaurant
food, leave it*, **by slug**. The test has to be stated or T-003-06 will re-litigate it.

| Option | The test |
| --- | --- |
| A. By cuisine | Useless — all of them are Japanese. |
| B. By how hard the dish is | `gyoza` is easy and is still a thing you buy; `chashu` is easy and is a ramen part. |
| **C. By whether a home kitchen makes it as part of an ordinary dinner, rather than as an event or as a component of a restaurant dish** | Splits cleanly and matches the story's framing: the shelf is a labour outcome, not a cuisine. `dashi` and `miso-soup` are upstream of every dinner; `karaage` is a Saturday; the four ramens and three tares are parts of a bowl that exists to be sold. |

**Chosen: C**, stated in the file as the test, with a third bucket the criterion does not require
but T-003-06 needs: **both boards** — dishes genuinely cooked at home constantly *and* sold. That
is where `karaage`, `gyoza` and `okonomiyaki` land, and pretending otherwise would be a worse
answer than the one the criterion asks for.

### D2.6 Where the sources go

No file in `docs/gaps/` cites a URL today; `docs/knowledge/counters.md` carries all sourcing, in a
trailing block. Only the Soup Pot criterion demands sources.

| Option | Assessment |
| --- | --- |
| A. A source link on every ranked soup | Thirty links, most pointing at the same three pages, and it turns a work list into a bibliography. |
| **B. A trailing `## Where this came from` block naming each source and what it was used for, plus an inline link where one specific claim rests on one specific page** | Matches `counters.md`'s established shape, keeps the ranked list readable, and still lets T-003-03 follow any claim back. |

**Chosen: B.** Applied to all three files rather than only the Soup Pot — the Japanese ratios and
the slow-cooker times are exactly the numbers the story says must never be fabricated, so naming
where they came from is worth the six lines even where no criterion asks for it.

---

## Cross-cutting

### D3.1 Proving a `.cook` file passes

The criterion asks for a demonstration with a throwaway file, not committed. Chosen: write one
minimal but genuine recipe under `recipes/soups/` naming all three counter values in turn, run
`node scripts/check-recipes.mjs` against it, paste the output into `progress.md`, then delete it
and verify with `git status --porcelain` that nothing is left behind. A stub will not do —
`check-recipes.mjs` requires four metadata keys, ≥3 ingredient rows and ≥3 operations, so the
proof file has to be a real table or it fails for reasons unrelated to the counter name.

### D3.2 Order of work

`counters.json` first, then the proof file, then the three gap documents. The proof depends on the
JSON; nothing depends on the gap files. Committing the JSON before writing 500 lines of markdown
also means the ticket's riskiest edit is durable early.

### D3.3 What is deliberately not done here

- **No `>> counters:` line is added to any recipe.** `dashi`, `miso-soup` and `congee` are named in
  the gap files as shelving jobs for T-003-06; editing them here would modify a file outside the
  ticket's ownership and contradict "nothing is rewritten that exists".
- **No aisle patterns.** Dried Chinese soup goods and the Japanese pantry will need them; that is
  T-003-06 §3 and it is recorded in the gap files rather than acted on.
- **No `docs/gaps/README.md` update.** The tally there is a per-pass artifact of T-002-09 /
  T-003-07, and three shelves with zero recipes would add three zero rows to a table about what
  landed. Recorded as a note for T-003-07 instead.
