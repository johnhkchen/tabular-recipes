---
id: T-002-04
story: S-002
title: one-pot-dinners
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-01]
---

## Context

Fill the gaps on the **One Pot** shelf. Most of this counter already exists and just needs
shelving — ten recipes carry a `one-pot` tag today (`kitchari`, `jollof-rice`, `jambalaya`,
`pot-roast`, `beef-stew`, `chili-con-carne`, `dirty-rice`, `hungarian-goulash`, `irish-stew`,
`japanese-beef-curry`) and many more qualify without saying so. **T-002-08 does that shelving.
You do not.**

Your job is the dishes a one-pot menu obviously prints and this collection does not have.
`docs/gaps/one-pot.md` ranks them. Read it, then read `recipes/` rather than trusting it.

The shelf's four sections tell you what shape the gaps take:

- **Braises and stews** — well covered already. Expect few gaps.
- **Skillet dinners** — the thin one. A whole genre of weeknight cooking where protein,
  aromatics and a starch finish in the same pan.
- **Rice and grains that cook in** — where the liquid becomes the dish. Partly covered.
- **Soups that are the whole meal** — a soup with a starch and a protein in it, not a first
  course.

## What makes something belong here

One pot, one burner, one wash-up — and the constraint has to be real. A dish that needs a
separate pot of boiling water for pasta is not a one-pot dish, however it is marketed. A dish
where you brown in the pot, remove the meat to a plate, build a sauce and return the meat *is*
one pot; a plate is not a pot.

The honest test: at the end, how many things need washing? If the answer is more than the pot
and the tools you ate with, it does not go on this shelf.

This matters because the shelf is the whole promise. A cook who picks a recipe from it and
finds themselves washing a colander has been lied to, and that is worse than the shelf being
short.

## What not to write

**A dish that exists is not rewritten.** Beef stew is on the shelf. Jambalaya is on the shelf.
If a dish you were about to write already exists in any folder, it needs shelving rather than
writing — record the slug and the section it belongs under in your work artifact, and T-002-08
will place it. `ls recipes/*/<slug>.cook` before every file.

There is one genuine overlap to be careful about: **Instant Pot recipes are being written in
parallel** by T-002-02 and T-002-03. A pressure cooker is one pot, but those files are theirs.
Do not write a pressure-cooker anything.

## Acceptance Criteria

- At least **12** new `.cook` files, each naming `counters: One Pot`.
- At least **6** of them are skillet dinners, the section the collection is thinnest on.
- Every one genuinely uses one vessel from start to finish, and the work artifact says for each
  what the vessel is.
- The dishes at the top of `docs/gaps/one-pot.md` are written, in that order, as far as the
  count reaches. Anything skipped is named in the work artifact with a reason.
- Nothing is written that already exists under another name. Dishes found to exist are listed
  in the work artifact by slug and section, for T-002-08 to shelve.
- No pressure-cooker recipes — those are T-002-02's and T-002-03's.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs.
- Every timer is named. Every file carries `title`, `category`, `tags`, `servings`, `counters`,
  and `aka` where people say it another way.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
