---
id: T-003-04
story: S-003
title: japanese-home-cooking
type: task
status: done
priority: high
phase: done
depends_on: [T-003-01, T-003-02]
---

## Context

Write the Japanese food people actually cook at home. The site already has Japanese food and
**all of it is restaurant food**, arrived through the Ramen Shop: `karaage`, `gyoza`,
`okonomiyaki`, `chawanmushi`, four ramens, three tares, `japanese-beef-curry`,
`japanese-milk-bread`, `castella`.

Missing entirely: nikujaga, shōgayaki, oyakodon, tamagoyaki, kinpira, hijiki, ohitashi,
sunomono, buri daikon, saba shioyaki, takikomi gohan, nimono, korokke, hambāgu, omurice.
The entire home canon.

`docs/gaps/japanese-home.md` ranks them and says which existing recipes are the foundation of
this shelf (`dashi` and `miso-soup` are — they need **shelving, not rewriting**) and which are
restaurant food that stays where it is.

## Why this shelf belongs in this story

一汁三菜 — one soup, three sides — is not a serving suggestion, it is **a system for getting a
balanced dinner out of a small kitchen on a weeknight**, and it works by making the parts small,
repeatable and mostly made ahead. 作り置き, the Sunday batch of small sides that live in the
fridge all week, is the same idea. That is a labour outcome, arrived at by a whole country over
a long time, and almost none of it is written properly in English.

Write it as the system it is, not as a list of dishes that happen to be Japanese. Where a side
is made on Sunday and eaten Thursday, say so — that is the recipe's whole point, and the slack
property from T-003-02 is where it goes: how long it actually keeps, and how you know when it
has not.

## What the shelf needs

The section list from `counters.json`, and roughly what belongs in each:

- **The soup and the rice** — the base of every meal. `dashi` and `miso-soup` exist; what is
  missing is the rice itself done properly, and the variations on the soup.
- **Simmered things (煮物)** — nikujaga, buri daikon, chikuzenni, kabocha no nimono. The heart
  of the shelf, and the most under-documented.
- **Grilled and pan-fried mains** — shōgayaki, saba shioyaki, teriyaki done the home way rather
  than the sauce-from-a-bottle way.
- **Small sides (小鉢)** — kinpira, hijiki, ohitashi, sunomono. Tiny recipes, and correct: four
  ingredients and three operations is what these are.
- **Made ahead (作り置き)** — what keeps, and for how long.
- **Rice bowls and one-plate suppers** — oyakodon, gyūdon, katsudon, omurice, takikomi gohan.

A small recipe is not a lesser recipe. A kinpira is five ingredients and three operations and
it is exactly what a cook needs to be told.

## Two things to get right

**Dashi is upstream of nearly everything here** and it exists. Reference it in `pairs-with:`
rather than re-teaching it inside each table. A simmered dish whose table spends three rows
making dashi has spent its rows badly.

**Seasoning ratios are the content.** Japanese home cooking is built on ratios — the standard
proportions of soy, mirin, sake and dashi that a home cook knows by heart and that make the
difference between the dish and an approximation. Get them right and state them as real
quantities. This is where "never fabricate a number" bites hardest on this shelf.

## Acceptance Criteria

- At least **22** new `.cook` files, each naming `counters: Japanese Home Cooking`.
- Every section of the counter has at least **3** recipes, and 煮物 and 小鉢 have at least **5**
  each — those are the two the collection is most missing.
- Every recipe declares its slack per T-003-02, with a reason naming a real failure. For
  made-ahead sides, that includes how long it actually keeps.
- Every file carries `aka` with the characters, a romanisation, and the plain-keyboard spelling
  someone would type.
- Nothing re-teaches `dashi`; it is referenced in `pairs-with:` instead.
- Nothing is rewritten that exists. Found dishes are recorded by slug for T-003-06 to shelve.
- Seasoning ratios are the canonical ones, and the work artifact says where they came from.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the label staircase reads as a cook's verbs.
- Every timer is named. Every file carries `title`, `category`, `tags`, `servings`, `counters`.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
