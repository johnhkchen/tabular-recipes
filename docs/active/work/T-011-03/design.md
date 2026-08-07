# T-011-03 — Design

One decision decides this ticket: **what counts as the file having determined a capacity.** Every
other choice — the arithmetic, the wording, the count — falls out of it.

---

## The decision

**A capacity is written only when the file's own words pin the vessel's limit.** Two ways a file
can do that, and nothing else counts:

1. **It states a batch count at the written size.** *"in two batches"*, *"in three batches"* →
   `c = ceil(s / N)`, verified to reproduce `ceil(s/c) = N`.
2. **It names the vessel's size and says what a smaller one costs.** Only S-008's air fryer line
   does this: *"Written for a preheated 5.7 L basket … A 3.5 L basket is two batches, not more
   minutes."* → the quantity is one load of the named basket, so `c = s`.

Everything else is listed with its reason and gets nothing. **46 of 685 files, 6.7%** — 7.0% of the
ticket's 658 — against the quarter that would signal over-annotation.

### Why this line and not another

The rule is the ticket's own two sentences made mechanical:

> A capacity is a real number about a real pan. Where a file's prose gives a batch count, the
> arithmetic is the source. Where it does not, the capacity comes from the vessel's size stated in
> the file, or it does not come at all.

Batch count, or stated vessel size. The rule adds nothing to that; it only says which files clear
it. And it satisfies the criterion that no capacity comes from servings alone by construction:
every number here is `s ÷ a batch count the author wrote`, or `s` where the author wrote that the
quantity is one load of a machine they sized. **Remove `>> servings:` from any of these 46 files
and the sentence the capacity was read from is still there.**

### What the rule costs

It refuses two groups the ticket's §2 would call bounded, and both refusals are the point:

- **`in batches` with no count** (11 files: `karaage`, `french-fries`, `chile-verde` and its two
  variants, `braised-short-ribs-slow-cooker`, `lamb-tagine-slow-cooker`, `sambousek`,
  `onion-bhaji`, `kibbeh`, `nixtamalised-masa`, `falafel`). The vessel binds. The number is not in
  the file, and picking one is inventing. `scaling.md` §7 says the same of `karaage` — *"the body
  says 'in batches' without saying how many."*
- **`one layer` in an unsized vessel** (13 files). *One layer* says the amount fits. It does not
  say the pan is full, and the difference is the whole number. `roasted-brussels-sprouts` spreads
  1½ lb of halved sprouts cut-side-down on a half sheet that would take three times that; writing
  `capacity: 4` there is the ticket's own forbidden move — *"it serves 4 and uses a pan, so the pan
  holds 4"* — wearing a load statement's clothes.

**It is also the finding worth carrying out of this ticket.** The 21 air fryer files are
annotatable for one reason: S-008 made every file state the machine it was written for. Nothing
else in the collection does, so nothing else can be annotated without cooking it. That is a
one-sentence fix per file — *"written for a 13×18-in sheet pan"* — and it is the unlock for sheet
pans, steamers and steels. It is not this ticket's to make.

---

## Options considered

### A. Annotate every file whose prose mentions batching *(rejected)*

The ticket opens with *"Start there"* on 55 files, so this is the reading closest to the brief. It
fails on the eleven that say `in batches` with no count: converting those needs a batch count the
file does not have, and the ticket's own §3 forbids supplying one. Taking A would mean either
inventing eleven numbers or arriving at exactly this design for eleven files anyway. The AC
anticipates it — *"or is listed as a case where the prose did not determine one, with the reason."*

### B. Annotate every area-bounding vessel *(rejected)*

119 files name a sheet pan, a steamer, a griddle, an iron, a steel, a grill or a basket. It is
17% of the collection and every one of them is a surface where crowding changes the dish. It fails
on measurement, not on principle: for 98 of the 119 the file never says how full the vessel is, so
the number would come from the servings — which is the one derivation the AC forbids by name, and
the one that *"would silently declare that nothing ever batches"* by declaring that everything
does. The ticket's own warning applies directly: *a sheet pan of cookies is bounded and a sheet pan
under a single chicken is not*, and nothing in the file tells you which one you are looking at.

### C. Annotate only where the vessel costs real minutes *(rejected)*

`scaling.md` §2 ends by saying the wait-versus-work test *"should save T-011-03 most of the 55
files that mention batching"*, which reads as a licence to skip every browning pan. It would cut
the set to the 21 baskets plus `wonton-soup`.

Rejected because it confuses **whether the fact is true** with **how much it costs**. `scaling.md`
§3 works `beef-with-broccoli` end to end, finds the wok costs exactly zero minutes, and concludes:
*"A capacity here is worth declaring so a cook is told to use two goes, not because it moves the
clock."* The field records what the vessel holds. The cost function decides what to say about it,
and T-011-05 decides whether to say anything — *"It goes in six lots, and that is the only
difference"* is a real sentence in §6's phrasebook.

### D. The chosen rule — the file pins the limit, or it gets nothing

Keeps every number traceable to a sentence in its own file. Lands at 6.7%. Refuses the two groups
above and says why in `progress.md`, file by file.

---

## The arithmetic

`c = ceil(s / N)` — servings, divided by the loads the author says it takes, rounded up to a whole
serving.

**Why rounded up.** You cannot put two-thirds of a serving in a pan, and `2.7` is a number nobody
measured. Rounding up is checked, not assumed: every row is verified to satisfy `ceil(s/c) = N`, so
the capacity reproduces the author's own batch count at the written size. Where it could not — no
row here, but `s = 4, N = 3` is the shape — a one-decimal value would be used instead.

**Its error, stated.** `carnitas-instant-pot` is `s = 8, N = 3`, so the true load is 2.67 and the
line says 3. At 24 servings that is 8 loads where 2.67 would give 9. The direction is towards a
*quieter* evening, which is the wrong way round for this repo — it is one load in eight, it is
`scaling.md` §4.5's oven-recovery error over again, and it is smaller than that one.

**Worked, per file, in `progress.md`.** 46 rows, each with its quoted sentence, its `s`, its `N`,
its arithmetic and its measured effect at 12 servings.

## The wording

```cooklang
>> capacity: 2 — the wok, sear
>> capacity: 4 — one 5.7 L air fryer basket, roast, air fry
>> capacity: 2 — four cups of oil in the wok, fry
```

**The vessel is the author's own words**, and it is specific enough for a reader to correct against
their own kitchen — `scaling.md` §4.2's whole point. `one 5.7 L air fryer basket` is the size the
file was written for. `four cups of oil in the wok` names the oil rather than the wok, because on
the deep-fry files the oil is what binds (below).

**Two operations on the basket files, and this is load-bearing.** The step says `roast`, the timer
says `~air fry{21%min}`, and a capacity that names only `roast` binds the step, passes every check,
and **charges nothing** — measured, 21 minutes at twelve servings instead of 63. Naming both is not
belt-and-braces: `roast` is what makes the line legible to a person reading the file, `air fry` is
what makes the minutes land. Both are words the file itself uses.

Everywhere else one word does both jobs, because the label and the timer agree: `sear`, `brown`,
`fry`, `boil`.

## The four deep-fry files: the pan or the oil?

**The oil, and its temperature — not the wok's floor.** Three things say so:

1. The neighbours state the mechanism where these four only imply it. `fried-chicken`: *"let the
   fat climb back to 325°F between them."* `french-fries`: *"in batches small enough that the oil
   does not drop below 350°F."*
2. `docs/gaps/one-pot.md` describes them as *"four cups of peanut oil double-fried in two batches"*
   — the oil is the subject of the sentence.
3. The arithmetic agrees. `scaling.md` §7 prices `karaage`'s oil bath at **zero minutes** at twelve
   servings, because what repeats is 90 seconds of frying, not a wait. Measured here: all four come
   out at `costMinutes = 0`, elapsed 37 → 51 at twelve, and every one of those extra minutes is
   frying that was going to happen anyway.

So the vessel is written as `four cups of oil in the wok`. A cook with a bigger pot of oil does not
get more capacity; a cook with a *deeper* one does, and naming the oil is what lets them see that.

## What this cannot settle

- **A capacity is a fact about one kitchen** (`scaling.md` §4.2). Every one of these 46 numbers is
  right for the vessel the file names and wrong for a smaller one. Naming the vessel is the whole
  mitigation and it is already the field's design.
- **The 98 area-bounded files that say nothing.** Left off, listed, and the reason is one sentence
  their authors could add.
- **Whether a cook doubling a recipe buys a second pan.** The model assumes one vessel. For a
  basket that is the machine and it is certain; for a skillet it is a household guess. This is why
  the browning group's capacity costs nothing on the clock — the error, wherever it lands, cannot
  reach the elapsed figure through a hands-on operation.
