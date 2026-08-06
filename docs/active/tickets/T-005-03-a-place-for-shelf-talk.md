---
id: T-005-03
story: S-005
title: a-place-for-shelf-talk
type: task
status: done
priority: high
phase: done
depends_on: [T-005-01]
---

## Context

T-005-05 has to move sentences like this off 183 recipe pages:

> A crock is the closest vessel to a bean pot there is, and this is the one bean dish on the
> shelf where slow beats pressure outright.

That sentence is worth keeping. It is a comparison between things on a shelf, and it is being
made on a page that shows one of them. **This ticket builds the shelf it belongs on**, so that
when T-005-05 starts cutting there is somewhere for the good parts to land.

Build the destination and prove it with real content. Do not wait for T-005-05 to supply words —
move a handful yourself, from the worst offenders, and leave the rest to it.

### What the menu can hold today

`src/data/counters.json` — 21 counters, and every one has exactly these keys:

```
name · slug · blurb · categories · sections[{ title, items[] }]
```

`blurb` is one line under the counter's name. A section has a `title` and a list of slugs and
nothing else. `src/pages/menu/[counter].astro` (96 lines) renders name, blurb, count, then
sections as `<h2>` plus a list of links.

So there is no room for a sentence about *why these dishes are grouped* or about *one item
against its neighbours*. That room is what this ticket adds.

### The design question

Two different kinds of sentence are coming off the recipe pages, and they may not want the same
home:

- **About a group.** *"Braises, left alone all day"* — the section has a title but nothing that
  says what makes these the ones. This is the natural fit for a note on a section.
- **About one dish against the others.** *"the one bean dish on the shelf where slow beats
  pressure"* — this is about `boston-baked-beans-slow-cooker` specifically, and it is most useful
  read next to the item, not at the top of a group of one.

Decide whether that is one field or two. **One is likely better** — a second field is a second
thing to keep filled across 21 counters and 658 items, and the sections are small enough that a
group note can carry a named dish. But the data should decide it: read the 183 recipes'
prose rows before choosing, and say in the work artifact which sentences you were fitting.

Whatever the shape, it must be optional. Most sections will have nothing, and a counter with no
notes should render exactly as it does today.

### Constraints

- The menu is **a menu, not a shop.** The comment at `[counter].astro:44` is load-bearing: no
  buttons, no controls, and the only browser-written mark is "on your list". A note is words, not
  a widget.
- **Validate the new field where counters are already validated.** `parse-recipes.mjs` and
  `check-recipes.mjs` both check counter names today. A note pointing at a slug that is not in
  the section, or a section that does not exist, should fail the same way a bad counter name
  does.
- **The cap from T-005-01 applies here too.** A menu note that runs 400 characters has moved the
  problem, not fixed it. If the counter page needs a different cap than the recipe page, say why
  and add it to `voice.md`.
- T-004-03 fixed this page for narrow screens. Do not break it: a note has to render at 375px
  without pushing the body sideways, and the two largest menus — The Bowl Shop (103 recipes) and
  Bakery (107) — are the ones to test against.

## Acceptance Criteria

- `counters.json` carries a place for shelf talk, optional, with the choice between one field and
  two made from the actual sentences and recorded in the work artifact.
- `menu/[counter].astro` renders it. A counter with no notes renders byte-identically to today —
  show this rather than asserting it.
- The new field is validated where counter names are validated: a note attached to a section or
  slug that does not exist fails the check with a message that says which counter and which slug.
- At least four notes are moved from real recipes as proof, drawn from the longest prose rows —
  `boston-baked-beans-slow-cooker` (757 chars), `baked-turkey-wings-slow-cooker` (578),
  `new-england-boiled-dinner-slow-cooker` (567), `soy-sauce-chicken-slow-cooker` (558). The
  matching recipe files are **not** edited here; T-005-05 owns them. Record which sentence went
  where so T-005-05 does not move it twice.
- The T-005-01 cap applies to menu notes, or `voice.md` says why the number differs.
- Renders at 375px with no horizontal scroll on the body, checked on The Bowl Shop and Bakery.
  `npm run verify:mobile` passes.
- `npm run verify` passes.
- Only `src/data/counters.json`, `src/pages/menu/[counter].astro`, and whichever of
  `scripts/parse-recipes.mjs` / `scripts/check-recipes.mjs` does the validating are modified. No
  `.cook` file is touched.
