---
id: S-005
title: talking-to-a-cook
type: story
status: open
priority: high
---

## Why

Read a recipe page out loud and you hear two voices. One of them is not talking to a cook.

Here is `ching-bo-leung-soup`, the wordiest page on the site, with the collapsed source dump
excluded:

> One of the 4 steps never says how long it takes, so both numbers are floors. Nothing here
> says whether you can walk away, so all 10 min of it is counted as time you are standing over
> it. The recipe itself says 3 hr 30 min.

> Start to finish is the longest chain through the table, so branches that overlap are counted
> once. That is why the waits add up to more than the clock — and it only holds if you get them
> going together.

> The minutes are always the recipe's own; a dashed edge means we worked out from the step
> whether you have to be there, and a dotted one means nothing was said, so we assumed you are
> standing over it.

None of that is about soup. It is the site explaining its own inference to somebody holding a
packet of dried lotus seeds. Every sentence is *true* — that is why it was written — but truth
about the data model is not what a cook came for, and printing it in the same voice as the
recipe makes the reader do the sorting.

### How far it reaches

Counted across the built site, 658 recipe pages:

| | |
| --- | --- |
| Pages saying "so both numbers are floors" | **577** |
| Pages explaining the dashed and dotted edges | **307** |
| Pages saying "the shortest stretches keep a sliver" | **531** |
| Pages saying "the recipe itself says …" | **658** |

And in the recipe files themselves:

| | |
| --- | --- |
| `slack:` reasons over 200 characters | **333 of 397 declared** |
| Full-width prose rows above the table | 286, mean 135 chars, **max 757** |
| Full-width prose rows below the table | 107, **mean 276 chars** |
| Recipes carrying a prose row over 120 chars | **183** |
| Operation cell labels | 3077, mean 25, max 70 — **healthy, leave alone** |

A full-width prose row renders **three times** on one page, once in each of the table, prep and
cook views. So `boston-baked-beans-slow-cooker` opens with 757 characters of essay, paid three
times, before anybody puts a bean in a pot.

### The thing underneath

The measurement that explains the rest. A `>> step.N:` line overrides the operation label, and
when it does, **the step's written prose is discarded and never rendered anywhere** — except
inside the collapsed `See how it is written` block, where it appears as raw cooklang with
`@&(~1)scrubbed bones{}` in it.

**1501 steps across 474 recipes are in that state. 228,000 characters that no reader sees.**

That is the mechanism. The files were written as prose essays; when the essay would not fit an
operation cell, a `step.N:` label was bolted on to rescue the table; the essay stayed, unread
and unchecked, and kept growing because nothing it could break was visible. The two voices on
the page are the essay leaking out at the edges — into the headnote, into `slack:`, into the
chrome — wherever the table did not catch it.

So the wordiness is a symptom. The cause is that a recipe file has been written for a reader who
does not exist.

## What changes

**Two decisions, already settled, that the tickets carry out.**

**1. The site stops explaining itself.** The honesty moves into the number, not a paragraph
beside it. `about 3 hr 30 min` instead of `3 hr 30 min` plus four sentences saying why it might
not be. A cook who wants to know how the timings are worked out is not on this page; a cook who
wants to make dinner is.

**2. Shelf talk goes to the shelf.** Anything comparing a recipe to its shelf-mates — *"this is
the one bean dish on the shelf where slow beats pressure outright"* — is a real observation in
the wrong room. It belongs on the counter's menu, where the comparison is with something the
reader can see. What stays on the recipe page is only what changes how you cook it.

## What this story does not do

- **It does not delete knowledge, it relocates or shortens it.** Every cut has to name where the
  fact went or why it was not worth keeping. A ticket that cannot say either has not finished.
- **It does not touch operation cell labels.** They are the one surface that already works —
  3077 of them, mean 25 characters. Measured, healthy, left alone.
- **It does not rewrite 1501 step bodies into good prose.** Cutting unread text to a cap is a
  day's work; rewriting every recipe as a well-voiced essay is a different project. This story
  cuts and enforces; if a body wants rewriting later, the cap will be there to keep it honest.
- **It does not change what the table shows.** No structural change to the merge tree, the
  timeline, or the views. Only what words appear around them.

## Why the recipe files are edited in a chain, not in parallel

Three tickets edit `.cook` files: the `slack:` lines, the prose rows, and the discarded bodies.
They touch different *fields* but the same *files*, and a ticket commits whole files. Two of them
running at once means one silently drops the other's work.

So `T-005-04 → T-005-05 → T-005-06` is a chain on purpose. It is the long pole. Do not
"optimise" it into a fan-out later without changing how the commits are scoped.

`T-005-02` (the clock) and `T-005-03` (the menu) touch no recipe files at all and run alongside
the whole chain.

## The shape

```
                    ┌── 02  the clock stops explaining itself ───────────────┐
                    │       Timeline · CookModes · no recipe files           │
                    │                                                        │
01  what a recipe ──┼── 03  a place for shelf talk ──┐                       │
    may say         │       counters.json · the menu │                       │
    the rule, and   │                                ▼                       ▼
    the ruler       └── 04  slack in one breath ──► 05  the rows ──► 06  the prose ──► 07  read it
                            397 .cook files             above and         nobody reads      all again
                                                        below                               closes the gate
                            └────────── one file at a time ──────────┘
```

Critical path is five: `01 → 04 → 05 → 06 → 07`. Tickets 02 and 03 run alongside all of it.

## Done looks like

A cook opens any recipe on this site and reads only two kinds of sentence: what to do, and what
happens if they get it wrong. Nothing on the page explains how the page was built. The counter
menus got more interesting, because that is where the comparisons went. And `npm run check`
fails the build if anybody writes a 757-character headnote again.
