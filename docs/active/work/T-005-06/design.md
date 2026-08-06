# T-005-06 · Design — the prose nobody reads

844 bodies to read, 656 of them over the cap, in 27 folders. The editorial decision is
already made by the story (*cut the defence, keep the instruction*), so what is left to
design is **which bodies are in scope**, **how a judgement is recorded**, **how the edit
reaches the file without being able to touch anything else**, and **what proves it**.

Six questions. Rejected options first each time, because on this ticket the rejected option
is usually the fast one.

---

## 1. Which bodies are in scope

### Rejected — all 2782 overridden bodies

It is the literal reading of *"only steps that already have a `>> step.N:` override"*, and it
is 278,833 characters. 1938 of those bodies are a single sentence under 150 characters —
T-005-01 measured the mechanical first sentence at p50 71 / p90 131, and that is what these
are. Reading 1938 bodies to change none of them spends the ticket's whole budget on the part
that is already right, and the risk is not zero: every body opened is a body that can be
mistyped.

### Rejected — whole folders, largest first

The ticket offers this explicitly, and it is the correct fallback if the reading runs out.
As a *first* plan it is worse than it looks: `soups` and `stews-and-braises` are 164 of the
656 over-cap bodies, so three folders in, the report is still two thirds full and the
remaining twenty-four folders are named as unreached. A boundary drawn by folder says
nothing about whether the sentences left behind are essays or steps.

### Chosen — every body that is over the cap or longer than one sentence

**844 bodies: the 656 over 150 characters, plus the 188 under the cap that are more than one
sentence.**

The claim this boundary makes is precise and checkable: *a body that is one sentence and
under the cap contains no defence, because a defence is a second sentence.* The 25
under-100 two-sentence bodies and the 161 in the 100-150 band are cheap to read and are the
tail of exactly the same phenomenon — leaving them would mean the collection still had
justification prose in it the day T-005-07 closes the gate.

The 1938 untouched bodies are then a **stated** boundary, not a silent one, and it is one
line to verify:

```
$ node split-bodies.mjs counts | grep '1 sentence'
 1662  under 100 · 1 sentence
  276  100-150 · 1 sentence
```

If the reading does run out, the fallback is the ticket's: finish whole folders, and name the
unreached ones in `progress.md`. Folders are the unit of work inside the chosen boundary, so
the fallback costs nothing to keep available.

## 2. What a judgement is, and how it is recorded

### Rejected — 656 Edit calls against the .cook files

Every one is an opportunity to touch a neighbouring line, and the last acceptance criterion
(*no metadata line, no component, no data file*) would then be a claim about 656 diffs rather
than a property of the work. T-005-04 and T-005-05 both rejected this on the same ground and
both were right.

### Rejected — write out the full new paragraph for every body

This is what T-005-05 did (`rows-after.tsv`, 232 rows). At 232 rows it is the right shape. At
844 rows, each carrying 150-500 characters of cooklang with `@pork trotters{2%lb}(900 g;
split lengthways by the butcher)` in the middle of it, retyping is the single largest source
of risk in the ticket — a mistyped quantity is a silently wrong recipe, and it would pass
every structural check because the structure is fine.

### Chosen — a keep-mask over the sentences, with an explicit rewrite only where needed

`split-bodies.mjs` splits each body into sentences, verified as a round trip over all 2782
(`0 splitter failure(s)`). A judgement is then:

```
path <TAB> stepIndex <TAB> keep <TAB> rewrite
recipes/vegetables-and-sides/charred-broccoli.cook	1	0	
recipes/soups/tonkotsu-broth-instant-pot.cook	2	0,2	
recipes/salads/som-tum.cook	0	0	Pound @…{} to a rough paste in a tall clay mortar.
```

- `keep` — the sentence indices that stay, in order. The common case, and it **cannot mistype
  a quantity**, because the kept text is sliced out of the file rather than retyped.
- `rewrite` — a full replacement paragraph, used only when a sentence has to be edited in
  place: a defence welded onto an instruction with a semicolon, or a cut sentence carrying an
  ingredient that has to move to a kept one. Expected on the ~94 bodies that stay over cap
  after tail-dropping, plus a share of the 70 single-sentence ones.

**`keep` and `rewrite` are mutually exclusive per row**, so there is exactly one way a body
can be changed and one thing to review.

Measured cost of the split: dropping only markup-free tail sentences already brings **492 of
the 586** over-cap multi-sentence bodies under 150. So roughly four in five judgements are a
keep-mask, and the retyping risk is confined to the fifth.

## 3. The rule the judgement follows

The ticket's test, unchanged: **does this change what I do at the stove?**

Applied sentence by sentence, four working rules — the same four T-005-05 settled on, with
one addition this field needs.

**1 · Stays.** A verb, a quantity, a doneness cue, a named failure with a moment attached, or
a piece of technique the 70-character label physically cannot hold. *"scrub every bone under
the tap until nothing brown or grey clings to it"* is the ticket's example and it is the rule:
it is the difference between white broth and grey and it exists nowhere else.

**2 · Goes — the comparison.** The subject is another recipe, another method, or what other
people do. *"Less water than the stovetop version on purpose"*, *"Stir them at the halfway
mark as most recipes tell you to and you get thirty-two evenly beige sprouts"*, *"Every other
sauce on this board wants brown onions."* This is the largest category and it is the story's
whole diagnosis: the body is arguing with a comparison the reader did not make.

**3 · Goes — the defence of the recipe's existence.** *"This is where the flavour of the dish
actually lives"*, *"which is the whole difference between this and the same six things cold"*.
A reader who is on the page has already been persuaded.

**4 · Goes — provenance and vocabulary.** *"Chín nạm gầu gân sách and bò viên are six more
ways to order the same bowl"*. T-005-05 moved this kind of sentence to a counter menu where
the comparison is visible. **This ticket does not**: `counters.json` is not in its file list,
and the last acceptance criterion says no data file. Anything genuinely worth relocating is
recorded as a finding, not moved.

**The addition — the sentence that is half instruction.** *"Twenty-two minutes untouched: the
cut face goes to mahogany and the round back stays green, which is the whole contrast. Stir
them at the halfway mark as most recipes tell you to and you get thirty-two evenly beige
sprouts."* The first clause is a doneness cue; the rest is rule 2. This is what `rewrite`
exists for, and it is why a pure keep-mask scheme would not have been enough.

**Aim, not cap.** The cap is 150. `voice.md` and the story both say the body should read as
what to do. A body that genuinely carries two instructions may sit near 150; most land far
under it, and the aim is the instruction, not the number.

## 4. How the edit reaches the file

`apply-bodies.mjs`, built on the T-005-04/05 pattern: **validate everything, then write, or
write nothing at all.**

Locating the paragraph is settled by research: the Nth non-metadata block is step N, checked
against the parser over all 658 files by count and by ingredient content
(`map-steps.mjs`, `0 disagreement(s)`).

The applier refuses, writing nothing, on any of:

| Guard | Why |
| --- | --- |
| path outside `recipes/`, or not `.cook` | file ownership |
| duplicate `path + stepIndex` | two judgements on one body |
| the file's current sentence split does not match the table's | a stale table cannot overwrite a body someone else moved |
| `keep` is empty, or every kept sentence is dropped | a body may not be emptied (§5) |
| the ordered **token sequence** differs before and after | §6 — the arithmetic proof, made a precondition |
| the file's block count changes | renumbering every later `>> step.N:` |
| the file's `>> step.N:` key set or any of its values changes | *"no `>> step.N:` line is added, removed or changed"* |
| any step's `labelOverride`, `ingredients`, `refs` or `timers` differ after re-parsing | the whole of §6, per file, from the parser rather than from a regex |

The last guard is the strong one and it is cheap: the applier re-runs `normalise()` on the
edited source in memory and deep-compares every step against the original. A body edit that
changed anything a reader can see fails here, names the file, and the file is restored.

**Steps without an override are unreachable by construction** — the applier only ever
addresses a block whose step has `labelOverride !== null`, and a judgement naming any other
step is rejected before writing.

## 5. May a body be emptied?

No, and the reason is structural rather than editorial.

A body **is** the step. Deleting the paragraph deletes the step, and
`normalise.mjs:112-119` numbers steps by position, so removing one silently re-points every
`>> step.N:` line below it — which is the third acceptance criterion, broken in a way that
does not raise an error. It is the same wall T-005-05 hit at its §2 and the same answer.

So every judgement keeps at least one sentence. A body whose every sentence is defence — a
prose-row step whose paragraph is pure argument — is **recorded as a finding**, and the
shortest instruction-bearing clause in it is kept. There are at most a handful; the 5
over-cap single-sentence bodies carrying no markup at all are where they will be.

## 6. What proves it

Five artifacts, all generated, all diffed, all in this directory.

| Proof | Command | Criterion |
| --- | --- | --- |
| **every operation cell label byte-identical** | `dump-bodies.mjs labels` | the ticket's main safety property |
| **ingredients, timers, quantities identical** | `dump-bodies.mjs data` | the arithmetic proof |
| **the merge tree did not move** | `dump-bodies.mjs cols` | inherited from T-005-05 |
| **no `>> step.N:` line added, removed or changed** | `dump-bodies.mjs meta` | criterion 3 |
| **the caps** | `npm run check` | `step body 656 → 0` |

`labels` prints one line per node per recipe — every operation label *and* every header and
footer row, in tree order. 3470 lines. The criterion asks for byte-identity of operation
cells; this covers those plus the prose rows T-005-05 just set, so a body edit that leaked
into a full-width row is caught too.

`data` prints, per step, the refs in order and every ingredient as
`name|quantity|note|amount.value|amount.unit`, every timer as `name|text|minutes|attention`,
plus the recipe's whole `cookware` and `ingredientNames` lists. 4786 lines. This is wider
than the ticket asks in three deliberate places, all named in research §4:

- **refs in order**, because `@&(~1)x{}` is a tree edge, not an ingredient, and reordering two
  of them inside one step moves columns without changing any count;
- **cookware**, because `#pan{}` lives in the bodies too and is printed on the page;
- **`amount.value` and `amount.unit`**, because those are what the shopping list adds up, and
  they are a different code path from the display quantity.

A `diff` on any of the four is expected to be empty. Not "small" — empty.

### Why the check is run twice

The applier's per-file re-parse guard and the collection-wide diffs are the same property
checked at two scales. The guard is what makes a bad judgement fail *at the file that caused
it*, with the file restored; the diffs are what makes the ticket's claim verifiable by
someone who does not trust the applier. Neither replaces the other.

## 7. Order of work, and the commit boundary

Folder by folder, largest over-cap count first: `soups` (89), `stews-and-braises` (75),
`rice-beans-and-grains` (68), `salads` (58), then the tail, grouped so no commit is trivially
small.

One `lisa commit-ticket` per group, with exact `--include` paths. A failure loses one
folder's judgement, not the ticket. The four baseline dumps and `report-before.txt` are
captured before the first edit and never regenerated, so the proof cannot drift under the
work it is proving.

`src/generated/recipes.json` is untracked (research §10.1) and is regenerated between groups
so each folder's dumps are taken against the tree as it then stands. It is never committed
and never passed to `--include`.
