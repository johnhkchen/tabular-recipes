---
id: T-008-03
story: S-008
title: annotate-the-candidate-pool
type: task
status: done
priority: high
phase: done
depends_on: [T-008-01, T-008-02]
---

## Context

The gate is written and the property exists. **Nothing has been measured against either**, because
no recipe on the site declares what is in the sink. Annotate the pool the new shelf draws from.

This is the ticket that decides whether S-008's counter is real. It is also the one that pays off
regardless: One Pot has promised *"that is the only pan to wash"* for two stories and has never
been able to prove it about a single file.

**You own the `>> washing-up:` line in `recipes/**/*.cook` and nothing else.** T-008-04 is writing
new air fryer files in the same tree in parallel — those arrive with the line already on them and
are not yours to edit. You do not touch `src/`, `docs/gaps/**` or `src/data/counters.json`.

### 1. The pool

Every recipe shelved at **One Pot** (68), **Instant Pot** (25) and **The Slow Cooker** (20), plus
whatever the new counter's gap page ranked as an existing candidate. Deduplicate — a recipe on two
of those shelves is annotated once.

Read T-008-01's eight worked examples first. They set what a good line reads like, and two of them
are deliberately the hard case.

### 2. How to count

**Read the file and count what a cook washes.** Not what the `cookware` list says — that list is
derived from the `#thing{}` marks and `docs/gaps/one-pot.md` already proved it undercounts. The
four wok recipes it caught are the reference case: one `#wok{}` declared, five things in a real
sink.

The rules, and they need to be applied the same way 113 times or the field stops comparing:

- **The plate you eat off does not count.** T-008-01's README entry says so; hold to it.
- **A thing used twice is one thing** if it is not washed between uses, two if it is. A bowl the
  marinade came out of and the sauce goes into is two.
- **A knife and a chopping board are one thing together**, by convention, and say so in the work
  artifact so the next annotator does the same.
- **Storage counts if the recipe ends by storing.** A stock that finishes in jars washes the jars.
- **The machine's parts count separately when they are washed separately.** An Instant Pot inner
  pot and its sealing ring are one thing; an air fryer basket and its crisper plate are two, and
  this is exactly the sort of detail that decides whether the new shelf is honest.

**Where a recipe genuinely cannot be counted without cooking it, leave the line off and say so.**
An honest absence is a legitimate answer and the render handles it. A guess is not, and this whole
field exists because a guess was what `cookware` was giving us.

### 3. What to expect, and what to report

Three findings this ticket is likely to produce, and all three are worth more than the annotation
itself. Put them in the work artifact under their own headings:

**One Pot recipes that are not one pot.** `docs/gaps/one-pot.md` names `boston-baked-beans`,
`gigantes-plaki` and `baked-ziti` as one vessel across two appliances, and lists 61 candidates it
threw off by hand. Expect more. **Do not re-shelve anything** — that is a counter decision and it
is not this ticket's — but list every One Pot recipe whose washing-up is three or more, by slug,
with its count. That list is the evidence a later pass needs.

**Instant Pot recipes that brown in a separate pan.** Sauté mode is in the same pot; a skillet is
not. Which is which is invisible today and decides bar 2 of the new gate.

**Whether the plain-versus-kit comparison actually changes.** For every `dish` with two files, put
the two counts side by side. If `beef-stew` and `beef-stew-instant-pot` wash the same three
things, that is a real and slightly deflating finding about the whole kit axis, and it should be
said rather than buried.

## Acceptance Criteria

- Every recipe in the pool either carries a `>> washing-up:` line or is listed in the work
  artifact as uncountable-without-cooking, with the reason. **Target: at least 100 annotated.**
- The counting rules above are restated in the work artifact as the convention for the next
  annotator, including any rule this ticket had to invent.
- The four recipes `docs/gaps/one-pot.md` names — `general-tsos-chicken`, `orange-chicken`,
  `sesame-chicken`, `sweet-and-sour-pork` — are annotated and their counts are three or more. If
  any comes out at two, that is a finding, not a rounding.
- A ranked list of **every One Pot recipe whose washing-up is three or more**, by slug with its
  count. Nothing is re-shelved.
- A list of every Instant Pot recipe that browns outside the pot, by slug.
- A side-by-side table of washing-up counts for every `dish` that has both a plain and a `kit:`
  file, with a sentence on what it shows.
- A count of how many pool recipes clear all three bars of the gate in
  `docs/gaps/air-fryer-and-pot.md`. **State the number even if it is small.**
- No line other than `>> washing-up:` changes in any file. Show it: a diff limited to added lines.
- The cookware cross-check warning from T-008-01 is run over the whole collection and its output
  is pasted into the work artifact. Warnings are findings, not failures.
- `npm run verify` passes.
- Only `recipes/**/*.cook` and `docs/active/work/T-008-03/**` are modified.
