# T-013-03 — Progress

All twelve steps of `plan.md` ran. Two commits through `lisa commit-ticket`. Four deviations, each
recorded below with why.

---

## Steps

| Step | State | Evidence |
| --- | --- | --- |
| 0 — baseline | done | `npm run recipes` → 685 recipes, 27 categories, md5 `f83cf3586331856f919bb747b3c0476a`. `git status` baseline captured |
| 1 — `menu-sections.mjs` before | done | 175 lines, `menu-sections-before.txt` in the attempt directory |
| 2 — transcription, **stop-the-line** | **passed** | `chili-con-carne = −95.0` reproduced. The party's `unforgiving` term never fires |
| 3 — rank all 685 twice | done | 592/93/0 and 234/93/358. Deterministic across two runs |
| 4 — overlap, inversion, the seventeen, **stop-the-line** | **passed with a finding** | Every score `occasions.md` printed reproduces exactly. §3.5's *table* is internally inconsistent — see deviation 3 |
| 5 — establish both occasions | done | Eight searches, four fetches. Four kinds for the holiday, three for the party |
| 6 — coverage | done | *Genuinely good* rule declared in `plan.md` before any number was read |
| 7 — the meal | done | Plate A at 1 and 2 cooks, Plate B (gated centrepiece), Plate C (upper bound) |
| 8 — write the report | done | `docs/gaps/two-that-invert.md`, 887 lines |
| 9 — save the output | done | `docs/active/work/T-013-03/ranking-output.txt` |
| 10 — `npm run verify` | done | 20 test files, **1,218 tests passed**, 685 recipes parsed, 710 pages built, 0 parser warnings |
| 11 — `menu-sections.mjs` after, **stop-the-line** | **passed** | `diff` empty. The new `docs/gaps/` page is inert |
| 12 — commit and hand off | done | `4c5c791` (script + output), `3fc4b57` (report). No ticket-owned file left staged, modified or untracked |

---

## Deviations from the plan

### 1. A third and fourth plate were added, and the fourth is the load-bearing one

`plan.md` §7 called for one plate at one and two cooks. Plate A's diagnosis came back with
**exactly one finding** and 19.5 total hands-on minutes, and two cooks changed nothing. That is a
result, but on its own it cannot distinguish *the model has nothing to say* from *the model cannot
say anything*.

So two more runs were added:

- **Plate B** — the same six with `smoked-turkey-breast` substituted for `pot-roast`. It tests
  `occasions.md` §3.3's claim that *the gate belongs to the plate, not to each dish*. Result: the
  finding list is **empty**, and nothing in `meal.ts` reads `slack`, so the plate-level gate §3.3
  proposed does not exist yet. That is a named gap between S-013's two halves and it was worth
  finding.
- **Plate C** — the six dishes in the whole collection with the most hands-on minutes at twelve
  servings. **Not a meal and not proposed as one; an upper bound.** It produces five `hob-crowded`
  findings and a `hands-pile-up` of 942 cook-minutes wanted against 83 available. That is what
  separates the two readings above: **`meal.ts` produces every finding kind it claims to, on real
  files. Plate A's near-silence is the collection, not the model.**

Without Plate C the report's §6 would have been an unsupported accusation against `meal.ts`.

### 2. The plate's vocabulary search was rewritten after it produced a wrong absence

The first version matched slugs and tags only, and the report claimed **"Stuffing. Zero files."**
It is wrong: `cornbread-dressing` is the collection's stuffing and says so only in its `aka` list
(*"cornbread stuffing"*, *"sage dressing"*). The script now reads slug, title, `aka` and tags, and
the candidate pool went from 49 to 91.

This changed the recommendation's headline number — **six missing recipes became five** — and it is
called out in the report's own §5.1 rather than quietly fixed, because *reporting an absence that
is not real* is the exact failure mode the rest of the document is about.

### 3. `occasions.md` §3.5's table does not obey `occasions.md`'s own gates

Not a deviation in the work, but the plan's step 4 said an unreproduced row must be explained
rather than discovered late. Every **score** the file printed reproduces exactly, including §3.6's
corrected party list (`gyoza` 60.0, `samosa` 24.5, `egg-rolls` 23.25, `ham-sui-gok` 10.5,
`char-siu-bao` 0.0 — five ranked, twelve cannot say).

What does not reproduce is §3.5's combined seventeen-row **table**, which ranks four recipes its own
gates reject: `smoked-turkey-breast` at #2 and `turkey-brine` at #3 are listed as *gated* in §3.3's
table two sections earlier, and `siu-mai` at #6 and `xiao-long-bao` at #8 are `unforgiving`. The
table is a ranking of scores with the gate not applied.

**Reported in the document's §9.2. `occasions.md` was not edited** — it belongs to whoever
maintains it, and its own closing invites the correction.

### 4. `capacity` has moved from 0 to 46 since `occasions.md` was written

`occasions.md` §3.1 records **0 capacities declared, of 685**. It is now 46, annotated on this
branch by other work while that file sat unchanged. This was not planned for and turned out to be
the best available evidence for §8's namespace re-test: the file argued that occasion membership
*moves* where counter membership does not, and it moved.

---

## What the run found, in one place

| | Holiday meal | Dumpling party |
| --- | ---: | ---: |
| ranked | 592 · 86.4% | 234 · 34.2% |
| rejected (`slack: unforgiving`) | 93 | 93 |
| cannot say | 0 | 358 (all `evidence: unknown`) |
| distinct scores | 136 over 592 | 108 over 234 |
| largest tie group | **161 all at 0** | 11 at 36 |
| genuinely good (≥ 2 fields declared) | 241 · 41% | 163 · 70% |
| all four fields declared | **35** | **35** |

- **Top-ten overlap: 0 of 10.** Jaccard over ranked sets 0.395. **Spearman ρ = −0.591** over the 234
  both profiles rank.
- **Inversion: passes.** The holiday list's worst-ranked recipe (`patty-melt`, #592) is the party's
  **#1**. Six of the holiday's worst ten are in the party's top ten; the other four are *cannot say*
  rather than ranked anywhere near them.
- **The holiday top ten reads right** — a four-way tie of big forgiving braises, `pot-roast` and
  `braised-short-ribs` among them.
- **The party top ten does not** — a patty melt, fried shallots and two one-serving sandwiches,
  because at a fixed target of twelve the profile partly ranks by how small a batch the file was
  written for. `birista` declares `>> servings: 1 1/2 cups`, which `servingsOf()` reads as 1.
- **The plate's diagnosis is one true sentence**: `pot-roast` at 149 °C against
  `roasted-brussels-sprouts` at 218 °C in the last 22 minutes. 19.5 hands-on minutes over the whole
  afternoon, 13 of them a fallback. **Median standing at twelve servings across the collection is
  5.0 minutes and 42% report zero**, so S-013's promised sentence is one this collection cannot say.

---

## Files

| Path | Change | Commit |
| --- | --- | --- |
| `docs/active/work/T-013-03/rank-the-shelf.ts` | new, 665 lines | `4c5c791` |
| `docs/active/work/T-013-03/ranking-output.txt` | new, 1,208 lines | `4c5c791` |
| `docs/gaps/two-that-invert.md` | new, 887 lines | `3fc4b57` |

**Nothing modified, nothing deleted.** Not `src/data/counters.json`, not any `.cook` file, not any
`src/` file, not `docs/knowledge/occasions.md`, not `docs/gaps/README.md`.
`src/generated/recipes.json` was regenerated by `npm run recipes` and is gitignored build output.

`menu-sections-before.txt`, `menu-sections-after.txt` and `git-status-before.txt` live in the
attempt directory only and are deliberately not committed — they are scaffolding for the step-11
check, not deliverables.
