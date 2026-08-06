# What the site still gets wrong when it talks to a cook

Not a counter page. Every other file in this directory except [mobile.md](mobile.md) is about
what one shelf is missing; this one is about what the *writing* still does badly, on every page.

Written at the end of S-005, after seven tickets took every sentence about how the site works out
its own numbers off the recipe pages, brought four of the five word caps to zero, and moved the
shelf comparisons to the counter menus. In figures, measured before the story began and again
after it:

| | before | after |
| --- | ---: | ---: |
| visible characters a page — mean | 3487 | **2823** |
| median | 3376 | **2766** |
| the wordiest page | 6219 | **4474** |
| the whole collection | 2,294,301 | **1,857,209** |
| `slack:` reasons over 200 characters | 304 of 397 | **0** |
| full-width prose rows over 120 | 232 of 393 | **0** |
| step bodies over 150 | 656 | **0** |
| ingredient notes over 80 | 17 | **0** |
| characters in bodies no reader ever sees | 278,833 | **172,003** |

Everything below was measured against the built site with `node scripts/measure-pages.mjs`, which
is the story's own counting method written down — `<main>`, the collapsed source block dropped,
tags stripped, entities decoded, whitespace collapsed. Run it against a build of `1ae1165` and it
reproduces the story's published figures to within four characters in six thousand.

**Ranked by what it costs somebody standing in a kitchen**, not by how hard it is to fix. Each
entry says what happens, where, the measurement, what a fix would take, and whether what is there
now is a *mitigation* or a *cure*. Some of these are real and hard; saying so plainly is the
point, so the next pass starts from an honest list instead of re-deriving it.

---

## 1. Fifteen recipes are missing a step you have to do

**What happens.** A cooking instruction — an imperative verb, a thing to do it to, and a duration
or a doneness cue — is printed as a full-width aside above or below the table instead of being an
operation in it. *Rest 10 min before cutting.* *Cool fully before slicing.* *Drain on a rack, not
paper.* The table, which is the whole site, does not know the step exists.

`pasta/fresh-egg-pasta` is the clearest case, and reading the built page makes it sharper than
the list does. Its last line is:

> Toss it into the pan of sauce with a splash of that water and keep it moving over the heat for
> half a minute.

In the **cook view that line is numbered step 6** and you tick it off like any other step. In the
table it has no column, no timer and no ingredients. The site already treats it as a step
everywhere except the one place that would make it true.

**Measured.** Fifteen, found by T-005-05 and listed in full in
`docs/active/work/T-005-05/review.md` §5 with the verb and the operation hiding in each. Most are
a rest or a cool at the end:

| | |
| --- | --- |
| `pasta/fresh-egg-pasta` | toss the drained pasta in the sauce with its water, 30 sec |
| `stews-and-braises/meatloaf`, `noodles/macaroni-and-cheese` | rest 10 min before cutting |
| `custards-and-puddings/peach-cobbler` | cool 30 min before spooning out |
| `custards-and-puddings/sweet-potato-pie` | cool fully before cutting |
| `fried-and-crispy/fried-chicken` | drain on a rack, not paper |
| `fried-and-crispy/fried-okra` | salt the moment it leaves the fat |
| `soups/dashi` | simmer the spent kombu again, 10 min, for niban dashi |
| `stews-and-braises/meatballs` | fry a test teaspoon and taste before rolling the rest |
| `rice-beans-and-grains/butter-beans` | mash a ladleful against the pot and stir it back in |
| `eggs/tortilla-espanola` | rest 5 min before cutting |
| `pasta/skillet-lasagna` | push the noodles under, one stir at 10 min |
| `sauces-and-gravies/cream-gravy` | thin with a splash more milk at the last moment |
| `vegetables-and-sides/creamed-corn` | loosen with a splash of water if it tightens |
| `soups/ham-hock-stock` | stir the picked meat back into the pot the stock goes to |

Two more are timing qualifiers on an operation that does exist and should not be double-counted:
`breads/garlic-knots` and `soups/sancocho`. Eight further candidates were checked against the
operation labels above them and rejected, which is why this list is fifteen and not twenty-three.

**What a fix takes.** Promoting one changes the merge tree — the column count, the rowspans, and
every mobile measurement S-004 took against them. S-005 forbade structural change by name and
proved across all 658 recipes that none happened. So this is a story, not a follow-up commit: it
means re-tiling fifteen tables, re-checking them at 375px, and deciding what a `rest` operation
with no ingredients looks like in a column.

**Mitigation or cure:** neither. The prose was shortened, not moved. Every one of the fifteen
still says what to do; it just says it somewhere the table cannot see.

---

## 2. Two different totals for how long it takes, on 601 pages

**What happens.** The chip under the title prints the recipe author's own `>> time:`. The clock
lower down prints what the table works out from the steps. They are different numbers, and since
S-005 nothing on the page says which is which.

`soups/dried-bok-choy-pork-lung-soup` reads `about 4 hr 30 min` at the top and `at least 3 hr
30 min` in the clock. `sandwiches-and-rolls/grilled-cheese` says `about 15 min` and `at least
7 min` — a factor of two, on a page with three steps.

This is a fair cost of a right decision. T-005-02 deleted *"The recipe itself says 3 hr 30 min."*
from all 658 pages because the chip already prints it, and that reasoning is sound. What went
with the sentence was the only thing that told a reader the two figures were **different
measurements of different things** rather than one of them being wrong.

**Measured**, on the built site as it stands:

| | |
| --- | ---: |
| pages printing both figures | **619** of 658 |
| where the two disagree | **601** |
| where they are 30 minutes or more apart | **181** |
| widest | `sourdough-boule` — chip `about 24 hr`, clock `16 hr 15 min` |

**What a fix takes.** A decision, then about four lines. Either the two figures are labelled so
the difference is legible (*the recipe says* / *the table works out*), or the author's figure
stops being printed on pages where the table has a full chain, or the chip carries the computed
one and the author's `>> time:` becomes a check the parser makes rather than something a reader
sees. All three are `[slug].astro:42` and `Timeline.astro`. None of them is a paragraph, which is
the constraint that matters.

**Mitigation or cure:** neither, and it is second on the list because a wrong total is how
somebody starts a four-hour soup at six o'clock.

---

## 3. `See how it is written` shows the source code

**What happens.** Every recipe page ends with a disclosure labelled in plain English. A reader
who opens it — the curious one, the one the site was built for — gets the `.cook` file:

> Return `@&(~1)scrubbed bones{}` to the pot with `@water{2 1/2%qt}(2.4 L)`, lock the lid and
> `~pressure cook{90%min}` at high pressure.

Sigils, braces, percent signs and reference indices. It is the one place on the site that answers
*how does this work*, and it answers in a language nobody was taught.

**Measured.** `src/pages/[slug].astro:132-135`, on **all 658** recipe pages, mean **1292
characters** of raw source — 46% again on top of the 2823 characters a reader otherwise meets.
Every figure in this file and in the story excludes it, because counting it would measure the
recipe twice: the story's own method drops `<details class="source">` before measuring, and so
does `scripts/measure-pages.mjs`.

No ticket in S-005 owned it. It is the last place the two voices the story was about still meet:
the recipe, and the machinery that renders it.

**What a fix takes.** Either render the source as something readable — the same parse the table
already does, printed as sentences with the ingredients marked rather than escaped — or relabel
the disclosure so it stops promising a recipe (*See the file this page is built from*), or drop
it. The first is a component and a design decision about what a reader should learn; the second
is a string; the third is a deletion nobody has argued for.

**Mitigation or cure:** neither. Untouched ground.

---

## 4. The shelf talk arrived at the counter and is 5% of the page

**What happens.** S-005's second decision was that a comparison between dishes belongs on the
counter's menu, where you can see both. It works — *the shortest braise here at six hours, and
the one where longer is actively worse* is a real sentence in the right room. But the menu it
landed on prints, under every dish, a line of search vocabulary:

> **Beef Stew, Slow Cooker** · Slow Cooker · beef chuck, all-purpose flour, vegetable oil, yellow
> onions · *beef stew · slow cooker beef stew · crockpot beef stew · crock pot stew*

That last line is the `aka` list. It exists so the front-page search finds a dish under any name,
which is a good reason for the data to exist and not a reason to print it four names deep on a
menu. And on The Slow Cooker's page, all twenty cards also print the words *Slow Cooker* under
the title.

**Measured** across the 21 counter menus, 855 cards:

| | characters |
| --- | ---: |
| the *also called* line | **69,387** — 81 a card, on every card |
| the ingredient line | 49,664 |
| the dish name | 13,002 |
| **the shelf talk** | **3,880**, on **40** of 855 cards |

**What a fix takes.** The `aka` line does not have to be visible to be searchable — the search
index is built from `search.json.ts`, not from the rendered menu. Hiding it, truncating it, or
moving it behind the card is a component change in `menu/[counter].astro` and a decision about
whether a menu is for browsing or for finding. Writing more notes is the other half and it is
writing, not code: 815 cards have nothing to say about themselves.

**Mitigation or cure:** the relocation is a cure for the recipe page and a mitigation for the
reader — the sentence is in the right room and the room is loud.

---

## 5. 172,003 characters nobody reads, and the overrides that made them

**What happens.** A `>> step.N:` line replaces a step's own words in the operation cell, and the
words it replaces are rendered nowhere at all — except inside the source disclosure of finding 3,
as raw cooklang. This is the mechanism S-005 was written to explain: the files were written as
essays, the essays would not fit a cell, a `step.N:` was bolted on to rescue the table, and the
essay stayed, unread and unchecked, and kept growing because nothing it could break was visible.

**Measured.**

| | before S-005 | now |
| --- | ---: | ---: |
| steps carrying a `>> step.N:` line | 2782 in 637 recipes | **2782 in 637 recipes** |
| characters in their bodies | 278,833 | **172,003** |
| over the 150 cap | 656 | **0** |

**The number came down by 38% and the mechanism is untouched.** Not one override was removed. A
cap now stops a body growing past a sentence, which is the point of the cap, and it does nothing
about the fact that the sentence is invisible.

T-005-06 asked the next question and answered it narrowly: **four** bodies would now make a good
label on their own, not the 234 a naive test suggests, because a body carrying `@ingredient{}`
markup renders as a fragment (`rinse and 2 hr`). Its recommendation is to leave those four alone.
It also found **46 prose-row bodies that came out as a fragment of context**, harmless because
for a prose-row step the `step.N` line *is* the row on the page.

**What a fix takes.** The real question is whether a `>> step.N:` line should exist at all, or
whether a step should be written so its own first sentence *is* the label. That is the rewrite
S-005 explicitly excluded — *"it does not rewrite 1501 step bodies into good prose"* — and it is
2782 judgements. The cheaper half is a checker: a body whose text is never rendered and never
read is a thing a script could refuse to accept past a certain size, which is what the 150 cap
now is.

**Mitigation or cure:** mitigation, and the honest kind. The unread text is shorter. It is still
unread.

---

## 6. One shelf now says the same thing two ways, because a cap decided which

**What happens.** T-005-07 brought 17 over-cap ingredient notes under 80 characters, and four of
them lost a Chinese tonic word — 健脾, 祛濕, 潤燥 — which went to a section note on
*The Soup Pot · Old-fire soups (老火湯)*:

> Each dried thing goes in for a word — 潤 to moisten, 祛濕 to clear damp, 健脾 for the stomach,
> 潤燥 for a dry autumn.

**Fifteen notes in twelve recipes on the same shelf still carry one**, because they were already
under 80 and nothing asked them to change. `ching-bo-leung-soup` alone prints three: *waai saan —
健脾, the spleen-and-stomach word*, *baak hap; 安神, the calm-and-sleep word*, *ji mai; 祛濕 — the
damp word*.

So the rule that decided which notes lost the vocabulary was a character count, not the voice.
Read the shelf end to end and it is inconsistent in a way no single page shows.

**What a fix takes.** A decision, then fifteen edits. Either the tonic word is per-ingredient
information a cook wants beside the amount — in which case the four cut notes should get theirs
back inside 80 characters — or it is shelf talk, in which case the section note is the only place
it belongs and fifteen notes lose a clause. `voice.md` leans to the second: an ingredient note is
*which one to buy, and how to cut it*, and *what it does for the dish* is named as what does not
go there.

**Mitigation or cure:** neither. It is a small inconsistency, deliberately not tidied in the pass
that created it, because guessing which way it should go is how a shelf ends up half-converted
twice.

---

## 7. Four things a ticket recorded and no ticket owned

Small, real, and each already argued somewhere. Collected here so they stop being findings in a
work artifact nobody opens.

- **78 `slack:` lines sit above the aim of about 120.** All under the 200 cap; `p50 111 · p90 126
  · p99 141 · max 151`, so it is a thin tail, not a second population. T-005-04 declined to cut
  them because several legitimately carry two facts — `cha-lua`'s 50°F **and** 165°F. Recorded in
  its review, open concern 3.
- **Nine recipes rated `forgiving` now read as having no give.** `do-chua`, `corned-beef` ×2,
  `braised-short-ribs-slow-cooker`, `chashu`, `lo-mai-gai`, `rice-pudding`, `potato-knish`,
  `smoked-pork-ribs`. Each is two-legged: the dish is patient and one step in it is not, and the
  field has room for one fact. Re-rating is a one-word change per file and belongs to a person.
- **`src/lib/counters.ts` still types a section as `{ title, items }`**, with no `notes` field,
  and `menu/[counter].astro` carries a local cast around it. Three tickets have now written data
  through that gap — T-005-03, T-005-05 and T-005-07 — and 43 notes depend on a validator in
  `parse-recipes.mjs` rather than on a type.
- **A sentence can end up on a menu and on the page it came from.** Two did:
  `new-england-boiled-dinner-slow-cooker` and `corn-carrot-pork-bone-soup`, found and fixed by
  T-005-07. Nothing prevents the third. The check is cheap — every `of:` note against the visible
  text of the page it names, compared on shared four-word runs — and it lives in no script.

---

## What this story did not fix

Said plainly, because the next pass should start from an honest list.

1. **It did not put the missing operations in the table.** Fifteen recipes still carry a cooking
   step as an aside. Finding 1, and it is the one that can cost somebody a dinner.
2. **It did not make the two clocks agree, or say why they differ.** 601 pages print two totals.
   It deleted the sentence that explained them without replacing what the sentence did.
3. **It did not touch the source disclosure.** 658 pages still answer *see how it is written*
   with `@&(~1)scrubbed bones{}`.
4. **It did not rewrite the 2782 step bodies, and it never said it would.** They are 38% shorter
   and exactly as invisible.
5. **It did not make the counter menus worth reading.** It sent the shelf talk there and 815 of
   855 cards still have nothing to say about themselves.
6. **It did not settle the Cantonese tonic vocabulary.** A cap decided, and it decided
   inconsistently across one shelf.
7. **It did not add a test for any of this.** Four caps are enforced by
   `scripts/check-recipes.mjs` and that is the whole automated net. No check can tell whether a
   shortened sentence still says the useful thing; **1466 fields across four tickets were judged
   by hand** — 373 `slack:` lines, 232 prose rows, 844 step bodies and 17 ingredient notes — and
   the judgements are published as data in `docs/active/work/T-005-0*/`.

What it did fix is at the top of this page, and it is most of what it set out to do. The two
voices the story opened with are down to one on the recipe pages. The remaining seven items are
what is left when the easy half is done.
