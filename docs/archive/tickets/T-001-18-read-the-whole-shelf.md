---
id: T-001-18
story: S-001
title: read-the-whole-shelf
type: task
status: done
priority: high
phase: done
depends_on: [T-001-17]
---

## Context

Fifteen tickets each saw one counter. This one reads the result as a whole collection and fixes
what only shows up from there. A previous pass of the same shape found a recipe living outside the
category tree, a dozen tag concepts each spelled two ways, and duplicate slugs waiting to collide
on a URL — none of them visible from inside a single folder.

Counter tickets were told to record, rather than make, any edit to a file another ticket owned.
Those hand-offs land here: read every work artifact under `docs/active/work/T-001-*/` for them.

## Acceptance Criteria

- **Slugs are unique.** `ls recipes/*/*.cook | xargs -n1 basename | sort | uniq -d` is empty. The
  slug is the URL, and `parse-recipes.mjs` — not the checker — is what enforces it.
- **No dish appears twice under two names.** Where one does, the weaker file is removed and its
  counters are merged into the survivor.
- **The recorded hand-offs are applied**: a counter added to an existing recipe's `counters:` line,
  a pairing that wanted writing on the other side.
- **Tag vocabulary is one vocabulary** — no concept spelled two ways across folders.
- `npm run verify` passes end to end.
- `docs/gaps/` is rewritten to reflect what is now on the shelf and what is still missing, so the
  next pass starts where this one stopped. The tally in `docs/gaps/README.md` matches reality.
- The review artifact states the recipe count per counter, before and after this story.
