# T-012-01 — Review

## What changed

| Path | Change | Lines |
| --- | --- | --: |
| `docs/knowledge/cooks.md` | created | 326 |

One commit: `05308ec` — *Write down who is actually cooking*.

No code, no `.cook` file, no property, no `README.md`, no `src/`, no `scripts/`, no JSON. The build
does not read `docs/knowledge/`, so nothing about `npm run verify` changes.

## The eight acceptance criteria, against evidence

| # | Criterion | Verdict | Evidence |
| --: | --- | --- | --- |
| 1 | Exists, in the shape of the folder, linked from wherever the folder is indexed | **met, with one stated interpretation** | File present. Shape follows `voice.md`/`scaling.md`: title, bolded thesis, named sections, tables for the dense parts, a closing scope section. The index half is argued below |
| 2 | Each written as situation and constraints, led by its contradiction, no name/photograph/job title | met | Each of the three sections opens with a bolded **The contradiction:** paragraph before the situation. Headings are situations — *Cooking for the day*, *The family rotation*, *Holiday guests*. No person is named and none is given an occupation |
| 3 | Every detail traces, every assumption marked, no fourth | met | Every factual clause traced to S-012 or the ticket, clause by clause. Six unanswered questions collected in §"What the three did not say", written as questions rather than filled in. The opening states there is no fourth and names the tempting one |
| 4 | Per person, what they need to know and which field answers it, by name | met | Three tables, 8 / 7 / 8 rows. Fields named as the repo names them: `>> servings:`, `>> slack:`, `>> washing-up:`, `>> counters:`, `>> pairs-with:`, `>> kit:`, and `handsOnMinutes`, `totalMinutes`, `unattendedMinutes`, `longestHandsOnMinutes`, `assumedHandsOnMinutes`, `untimedCount`, `lanes`, `criticalPath`, `MULTIPLIERS`, `isMoreThanAJar()`. Every one verified against the source |
| 5 | A section naming what is missing, four items, what each would take, no proposals or ranking | met | Four numbered entries, each closing with **What it would take**. The section states in its own words that the numbers are not an order and that T-012-02 ranks. No proposed field, dial or page appears anywhere |
| 6 | The `schedule.ts` finding stated explicitly — a bug for two, a feature for the third | met | §"What is missing" entry 3, with both quotations: the assumption at `src/lib/schedule.ts:63-66` and the same file's correction of it for `longestHandsOnMinutes` at `306-322`. The sentence *"That assumption is wrong for the first two and right for the third"* is in bold |
| 7 | Written so a later ticket gets a clear pass or fail; demonstrate on S-010's dials or S-011's capacity | met | §"Holding a design against these" runs S-010's three dials against all three and returns passes / fails / cannot say — one of each — then applies the method to capacity in a paragraph, then states the rule a later ticket uses |
| 8 | Only `docs/knowledge/cooks.md` and `docs/active/work/T-012-01/**` | met | `git status --short`: the only paths this ticket owns are the committed file and the work directory |

## The one interpretation a reviewer should check

Criterion 1 asks for the file to be *"linked from wherever that folder is indexed."* Criterion 8
restricts the change to `docs/knowledge/cooks.md` and the work directory. Those collide only if the
folder is indexed somewhere, and it is not:

- There is no `docs/knowledge/README.md`. `docs/gaps/` has an index; `docs/knowledge/` does not.
- `README.md:15` names `docs/knowledge/counters.md` in a prose sentence about how the site is
  arranged by counter, and names no other file in the folder. Its "How it fits together" table
  indexes `recipes/`, `src/` and `scripts/` and has no `docs/` row.
- `voice.md` and `scaling.md` are linked from nowhere outside `docs/active/`. `git show --stat` on
  their creating commits (`937ca8a`, `2a118e5`) shows each added exactly one file.

So the criterion's condition is unmet and criterion 8 is unconditional. `cooks.md` instead
cross-links its three siblings from its opening, which is the folder's actual convention
(`voice.md:189` links out the same way). **If the intent was a one-line `README.md` edit, that is a
one-line follow-up and this file is otherwise unaffected** — it is called out here rather than done
silently because doing it would have broken the ticket's own scope line.

## Test coverage

There is none to add, and that is the right answer rather than a gap. The deliverable is prose; the
build does not read `docs/knowledge/`; `scripts/menu-sections.mjs` machine-reads `docs/gaps/`, not
this folder. Writing a test that asserts a heading exists would test the test.

What was checked instead:

- **Clause tracing against S-012 and the ticket**, which is the real protection for criterion 3. A
  persona file's failure mode is a fluent invented detail, and no command catches that.
- **Field-name verification** against `README.md`, `src/lib/schedule.ts`, `src/lib/plan.ts`,
  `src/lib/shopping.ts`, `src/data/staples.json` and `src/pages/search.json.ts`. A named field that
  does not exist would make the file worse than silence — the same argument S-011 makes about a
  fabricated capacity.
- **Counts re-taken in one pass** on 7 August 2026 so no two sentences disagree: 685 recipe files,
  `>> slack:` 416, `>> washing-up:` 177, `>> pairs-with:` 434, `>> kit:` 58, `>> capacity:` 0,
  `>> keeps:` 0, 31 staples.
- **Links and anchors**: six relative links resolve; four in-page anchors match their headings; one
  `#` heading; no trailing whitespace.

`npm run verify` was deliberately not run. Nothing in this ticket can affect it, and the branch
carries other tickets' in-flight changes to `scripts/normalise.mjs` and `src/lib/tree.ts`, so a
result from it would be a statement about their work, not this one.

## Open concerns

1. **The counts will drift, and the file says so.** 685 files today; 658 when S-012 measured the
   shelf. Field coverage moves under T-008-05 and T-011-03. The file dates its numbers and attributes
   the shelf measurement to S-012 rather than restating it as current, which is the honest handling,
   but a reader in three months should re-take them rather than quote them.
2. **`capacity` and `keeps` are described from their tickets, not from code.** Both are at phase
   `plan`. The file marks them **not built** with their ticket IDs everywhere they appear. If either
   design changes shape, the two rows and one paragraph mentioning them need a look.
3. **The demonstration is against T-010-02, which is itself at phase `review`.** The dials as
   described — three, no difficulty score, three answers rather than two — are S-010's settled
   argument and the ticket's own brief, so the verdict does not depend on the implementation's final
   details. If T-010-02 lands materially different, the demonstration is the section to re-check.
4. **The *fails* verdict on the family rotation is a real finding, not a rhetorical one.** It says a
   built feature is aimed at one of three readers. That is what the file is for, and it is the kind
   of sentence a later story may want to argue with. It is confined to the demonstration section and
   makes no recommendation, which keeps it inside the ticket's no-designing rule.
5. **Length ran over the plan**: 326 lines against a 220–280 target, from the per-person tables and
   the second `schedule.ts` quotation. Recorded in `progress.md` with the reasoning. Well inside the
   folder's range (`voice.md` 190, `scaling.md` 521, `counters.md` 1160).

## Nothing needs human attention before completion

No critical issues. The one judgement call — criterion 1's index link — is documented above with its
evidence and is cheap to reverse.
