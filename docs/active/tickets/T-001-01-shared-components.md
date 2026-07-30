---
id: T-001-01
story: S-001
title: shared-components
type: task
status: open
priority: high
phase: ready
depends_on: []
---

## Context

Five components appear in more than one counter's "Components it would need" list. Written
once here, they are referenced by every counter that needs them; written separately by each
counter's ticket, they become the same recipe under two names, which is exactly the cleanup a
previous pass had to do by hand.

From `docs/gaps/`, wanted by two counters each:

- **nixtamalised masa** — Panadería and Taquería
- **crema mexicana** — Panadería and Taquería
- **queso fresco** — Panadería and Taquería
- **red bean paste** — Bakery and Dim Sum Counter
- **lotus seed paste** — Bakery and Dim Sum Counter

Check the folder before writing: `ls recipes/*/<slug>.cook`. Some of what the gap docs list as
missing has been written since they were compiled.

Every counter ticket in this story depends on this one, so keep it tight — these five, and
anything you find is genuinely shared by two or more of the ranked lists.

## Acceptance Criteria

- Each component exists as one `.cook` file, with `counters:` naming every counter that wants it.
- `node scripts/check-recipes.mjs --labels <the new files>` reports ok for each.
- Every timer is named, so the clock under the table reads them as stated rather than inferred.
- No file outside `recipes/` is modified. `src/data/counters.json` belongs to T-001-17.
- The work artifact names which counters each component was written for.
