---
id: T-009-03
story: S-009
title: take-the-numbers-away
type: task
status: done
priority: high
phase: done
depends_on: [T-009-02]
---

## Context

Remove `>> step.N:` from the format, so the fragile form cannot come back. Two forms that mean the
same thing is how a convention drifts — this repo has watched it happen once already, with 24 tag
concepts spelled two ways across 51 files, recorded in `docs/gaps/README.md`.

**Read T-009-02's list of unmigrated files first.** If any file still uses the numbered form, this
ticket either migrates it by hand — with the same before-and-after label proof, per file — or it
does not remove the form and says why. **Do not delete a form that something still uses**, and do
not quietly rewrite a file the codemod refused to touch without looking at it.

### 1. Remove the reader, reject the syntax

Take the `step.N` path out of `scripts/normalise.mjs`, including the `/^step\.\d+$/` cleanup that
deletes those keys from loose metadata.

Then make `scripts/check-recipes.mjs` **fail** on a `>> step.N:` line, with a message that shows
the same label written the new way. Somebody will type the old form from muscle memory — the
error message is the documentation they will actually read, so write it as such.

Point them at the fixer from T-009-02 by name. A checker that says *run this to fix it* is worth
more than one that only says no.

### 2. Rewrite the documentation, and voice.md is the one that matters

`step.N` is taught in nine places:

| File | Where |
| --- | --- |
| `README.md` | line 153, the authoring contract's rule 5 |
| `docs/knowledge/voice.md` | seven places — the register table, the throws-your-paragraph-away argument, the worked 132-character example, the length table |
| `scripts/check-recipes.mjs` | an error message offering `>> step.N:` as the fix |

**voice.md carries an argument, not just a syntax.** It explains that an override throws the
step's own words away — not shortens, throws away — and it works a real 132-character example
down to 55. That argument is unchanged by this story and every word of it must survive the
rename. **Rewriting the syntax and losing the argument is the failure mode here**, and it is
easy to do by find-and-replace.

Also fix the comments that outlive the syntax: `src/lib/tree.ts:35`, `src/lib/time.ts:152`,
`src/lib/time.test.ts:131` and `scripts/check-recipes.mjs:46` all name `step.N` in prose. A
comment describing a syntax that no longer exists is worse than no comment.

### 3. Close the recorded defect

`docs/gaps/README.md` has carried this under *Recorded and not done* since T-001-08:

> **`>> step.N:` counts prose steps as well as operations**, which is undocumented, silently
> mislabels a file rather than failing it, and cost three files a round trip.

It is now fixed, by removal rather than by repair. Move it out of that list and say so — that
section is where the next pass looks for work, and an item that is done but still listed costs
somebody an afternoon finding out.

While you are in that file, add what S-009 chose **not** to fix, so the next person does not have
to rediscover the reasoning: `@&(~N)` relative references, 2,401 uses, 373 of them `~2` or deeper,
left alone because they fail loudly — a mis-pointed relative reference usually stops the tree
merging, which is a build error, not a wrong page.

## Acceptance Criteria

- No `.cook` file in the collection uses `>> step.N:`, and the count is zero, shown.
- `scripts/normalise.mjs` no longer reads or special-cases the `step.N` key.
- `scripts/check-recipes.mjs` **fails** on a `>> step.N:` line with a message that shows the same
  label written inline and names the fixer script. Show the message.
- Any file T-009-02 could not migrate is migrated here by hand, each with its own before-and-after
  label comparison, **or** the numbered form is left in place and this ticket explains why. Not
  both, and not silence.
- `README.md` rule 5 teaches only the inline form.
- `docs/knowledge/voice.md` teaches only the inline form in all seven places, **and its argument
  about a label throwing the step's own words away is intact** — the 132-character worked example
  and both length tables still say what they said. Show a diff limited to the syntax.
- The prose comments in `src/lib/tree.ts`, `src/lib/time.ts`, `src/lib/time.test.ts` and
  `scripts/check-recipes.mjs` no longer describe a syntax that does not exist.
- The `step.N` entry is out of *Recorded and not done* in `docs/gaps/README.md`, marked as closed
  by removal, and the `@&(~N)` decision is recorded there with its reasoning.
- Every operation label on every page is unchanged from the end of T-009-02. Same dump, same
  diff, pasted.
- Tests cover: a `step.N` line fails the check, and the inline form still works everywhere.
- `npm run verify` passes.
- Only `scripts/`, `src/`, `README.md`, `docs/knowledge/voice.md`, `docs/gaps/README.md`, any
  hand-migrated `.cook` files and `docs/active/work/T-009-03/**` are modified.
