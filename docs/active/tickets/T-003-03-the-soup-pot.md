---
id: T-003-03
story: S-003
title: the-soup-pot
type: task
status: done
priority: high
phase: done
depends_on: [T-003-01, T-003-02]
---

## Context

Write the soups a grandmother makes. Thirty-three soups are on the shelf and **not one of them
is a Cantonese 老火湯** — the genre where a pot of water, a piece of meat and a handful of dried
things sit for three hours untouched and come out as the thing the whole family drinks before
dinner.

`docs/gaps/soup-pot.md` ranks them and carries the logic of the genre. Read it before writing.

This shelf is the best fit for this site's clock that exists. Three hours of total time and ten
minutes of hands-on is exactly the bargain the whole story is about, and the table can show it
in a way prose never has.

## What makes these different from the 33 soups already here

**They are organised around what each ingredient is for.** That is not decoration, it is the
recipe's structure: the dried figs are there for one reason, the apricot kernels for another,
the pork shin for a third, and the reason it is not stirred is a reason. A cook who is told
"simmer three hours" has been given the least useful part.

So put the logic where a reader will find it. The table shows what goes in and when. `aka`
carries the names people say it by, in characters and in romanisation and in the plain-keyboard
spelling somebody would actually type. The one-line slack reason from T-003-02 is a good home
for what happens if it goes long — for most of these the honest answer is "very little," and
saying so is the point of the shelf.

**Research the genre properly, do not guess it.** These soups have standard pairings and a
seasonal logic, and inventing a plausible-sounding one produces something that reads right to
someone who has never had it and wrong to everyone who has. Where the work list names a soup,
cook it as it is actually cooked. Where you cannot establish that, write a different one — the
list is longer than your target.

**Do not medicalise.** These soups carry a traditional logic about what they do for a body.
Write that logic as what it is — the tradition's own reasoning, which is why the soup is made —
without restating it as a health claim the site would be asserting. "Made when someone has been
coughing" is honest. "Cures a cough" is not, and it is not what the tradition says either.

## Scope

Stay in the soups. The 滾湯 quick daily soups belong here too and are a different bargain —
twenty minutes, made nightly — so the shelf carries both and should say which is which.
Congee and rice soups are on the section list; `congee` already exists and needs shelving, not
rewriting.

## Acceptance Criteria

- At least **20** new `.cook` files, each naming `counters: The Soup Pot`.
- At least **12** are long-simmered soups of the 老火湯 kind, and at least **5** are quick daily
  soups.
- Every one carries `aka` with the characters, a romanisation, and a plain-keyboard spelling
  somebody would actually type.
- Every recipe declares its slack per T-003-02, with a reason that names a real failure.
- The dishes at the top of `docs/gaps/soup-pot.md` are written, in that order, as far as the
  count reaches. Anything skipped is named in the work artifact with a reason.
- The work artifact says, for each soup, where the method and the pairing came from. **Nothing
  is invented to fill a section.**
- Nothing is rewritten that exists. `congee` and any other found dish is recorded by slug for
  T-003-06 to shelve.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the label staircase reads as a cook's verbs.
- Every timer is named, and a three-hour simmer reads as unattended in the clock.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
