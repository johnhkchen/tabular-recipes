---
id: T-001-10
story: S-001
title: taqueria
type: task
status: done
priority: medium
phase: done
depends_on: [T-001-01]
---

## Context

Fill out the **Taquería** menu. It currently holds **17 recipes, 12 of them its own** —
the rest are borrowed from other counters, which is legitimate but does not make a menu.

The board is a grid: a fixed protein list crossed with a fixed vehicle list, and the customer names the pair. Several proteins (al pastor, lengua, suadero) and most vehicles (torta, huarache, sope, mulita) are missing, so the grid has rows but few columns.

The work list is `docs/gaps/taqueria.md`, written after the whole collection was read as a set of
menus. It is ranked, most conspicuous absence first, and every dish is named the way a menu names
it. Work down it. Its "What it could not stock" section is not a to-do list: those are the items a
single table genuinely cannot express, and the reasons are given.

Two things to do before writing anything:

1. **Read `recipes/` rather than trusting the list.** The gap docs are stale in places — a pastry
   shell, two pickles, cornbread, char siu and a pâté were written after they were compiled.
2. **Check whether the dish already exists**: `ls recipes/*/<slug>.cook`. A dish that belongs to
   several counters is ONE recipe with several names in `counters:`, not one per counter. If it
   exists and only needs this counter added to it, that is an edit to a file another ticket owns —
   record it in the work artifact for T-001-18 instead of making it.

Write `.cook` files only, into whichever `recipes/<category>/` folder each dish belongs in. Use
an existing category where one fits; a genuinely new kind of thing may take a new category and
folder. Do not touch `src/` — the menu sections and the shopping aisles are T-001-17's.

## Acceptance Criteria

- **Taquería** shelves at least **24 recipes**, of which at least **18** name it
  and no other counter.
- The dishes at the top of `docs/gaps/taqueria.md` are written, in that order, as far as the count
  above reaches. Anything skipped is named in the work artifact with a reason.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs rather than sentence fragments.
- Every new recipe carries `title`, `category`, `tags`, `servings`, `counters` and — where
  people order it by another name — `aka`, including a form typed without diacritics.
- Every timer in every new file is named.
- Quantities are real for the stated servings, and the method is the canonical one for the dish
  rather than a shortcut wearing its name.
- Only `recipes/**` is modified by this ticket.
