---
id: T-001-06
story: S-001
title: panaderia
type: task
status: done
priority: critical
phase: done
depends_on: [T-001-01]
---

## Context

Fill out the **Panadería** menu. It currently holds **9 recipes, 0 of them its own** —
the rest are borrowed from other counters, which is legitimate but does not make a menu.

Nine recipes and NOT ONE IS ITS OWN — every item is borrowed from the Bakery or the Taquería, so the page has no menu at all. Conchas, orejas, cuernos and fruit empanadas were on every single shop list the research read; the savoury rack (bolillo, telera) is empty too. This is the loudest absence on the site.

The work list is `docs/gaps/panaderia.md`, written after the whole collection was read as a set of
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

- **Panadería** shelves at least **18 recipes**, of which at least **12** name it
  and no other counter.
- The dishes at the top of `docs/gaps/panaderia.md` are written, in that order, as far as the count
  above reaches. Anything skipped is named in the work artifact with a reason.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs rather than sentence fragments.
- Every new recipe carries `title`, `category`, `tags`, `servings`, `counters` and — where
  people order it by another name — `aka`, including a form typed without diacritics.
- Every timer in every new file is named.
- Quantities are real for the stated servings, and the method is the canonical one for the dish
  rather than a shortcut wearing its name.
- Only `recipes/**` is modified by this ticket.
