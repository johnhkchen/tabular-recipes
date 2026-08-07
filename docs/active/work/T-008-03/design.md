# T-008-03 — Design

One decision matters here and it is not a code decision: **what the counting convention is**, in
enough detail that 145 files can be read the same way by a person who was not in this session.
Everything else follows from it.

---

## 1. Scope: which files get read

| Option | What it is | Verdict |
| --- | --- | --- |
| **A — the ticket's 113** | One Pot 68 + Instant Pot 25 + Slow Cooker 20, as the ticket's arithmetic states | **Rejected.** One Pot is 73, not 68 (§3 of research). Taking 68 means picking five recipes to skip, and there is no honest rule for which five. |
| **B — the measured pool, 138** | The three shelves as the collection actually reports them, plus the 20 existing slugs the air-fryer gap page ranks | Chosen as the floor. |
| **C — B plus the 13 plain siblings** | …plus the plain half of every pool `kit:` dish that no pool shelf claims | **Chosen.** |
| **D — all 664** | Annotate the whole collection | **Rejected.** Out of proportion, and it would bury the findings this ticket exists to produce. The remaining 513 are a later pass. |

**C, because an acceptance criterion demands it.** *"A side-by-side table of washing-up counts for
every `dish` that has both a plain and a `kit:` file"* cannot be written if thirteen of those rows
have one side undeclared. Those thirteen files are `recipes/**/*.cook`, which is what this ticket
owns. **151 files, of which 6 already carry a line — 145 to write.**

## 2. How each line is arrived at

**Read the file. Count what a cook washes.** Not `cookware`, which counts what a recipe *names*
and has already been proved to undercount by a factor of five on the wok recipes.

The reading is the same three passes on every file:

1. **Vessels named as `#thing{}`** — the floor, minus fixtures (oven, hob, grill, smoker).
2. **Vessels in prose** — *"stir the glaze smooth in a bowl"*, *"rest them on a rack"*, *"turn it
   out onto a plate"*, *"strain into a container"*. This is where the missing two-thirds live.
3. **Vessels implied by an operation with no home** — a recipe that says *"drain the pasta"* has a
   colander whether or not it says so; one that says *"marinate overnight"* has a bowl or a bag.
   This pass is the one that needs judgement and it is where the convention below does its work.

## 3. The convention

This section is the deliverable the next annotator reads. Rules 1–5 are the ticket's, restated.
Rules 6–14 are ones this ticket had to invent or resolve, and each says why.

### Inherited from T-008-01's README entry and this ticket

1. **The plate you eat off does not count.** Nor does a serving bowl or platter. The test is the
   README's: *if every recipe on the site would list it, it does not go in the line.* A number
   inflated by the same constant everywhere has stopped comparing anything.
2. **A thing used twice is one thing if it is not washed between uses, two if it is.** A bowl the
   marinade came out of and the sauce goes into is two.
3. **Storage counts if the recipe ends by storing.** A stock that finishes in jars washes the jars.
4. **Machine parts count separately when they are washed separately.** An Instant Pot inner pot and
   its sealing ring are one thing; an air fryer basket and its crisper plate are two.
5. **Where a recipe genuinely cannot be counted without cooking it, leave the line off and say so.**
   An honest absence is a legitimate answer. A guess is not.

### Resolved or invented here

6. **The knife and the chopping board are not counted at all** — not as one thing, not as two.

   The ticket says *"a knife and a chopping board are one thing together, by convention"*. The
   README, written by T-008-01 from the same instruction that produced the plate rule, says
   *"do not count… the knife and board you prepped on"* and gives the reason: every recipe on the
   site would list it. **These two cannot both be applied.** The README wins, because it is the
   published contract, eleven files were already counted under it, and the ticket's own reason for
   the plate rule is the argument for the board.

   **The ticket's rule is kept for the case that survives the exclusion:** where a board is used as
   a *vessel* rather than as a prep surface — something rests on it, something is served off it,
   the recipe stages food on it between operations — it is one entry together with the knife, never
   two. In this pool that case does not arise; it is recorded so the next annotator has an answer.

   **This changes what S-008's gate admits, and T-008-05 must read it.** The story illustrates
   two-or-fewer as *"The pot and a chopping board"*; under this boundary that recipe scores 1.
   T-008-01 flagged the same thing in its own review §4.2. It is flagged twice now.

7. **Utensils are not counted.** Spoons, whisks, tongs, spatulas, ladles, slotted spoons, potato
   mashers, measuring cups, thermometers. Same test as the plate: universal, therefore not
   comparing anything. A `#potato masher{}` will draw a cross-check note; the note is correct to
   fire and correct to overrule.
8. **Disposables are not washed.** Foil, parchment, cling film, a paper towel, a disposable
   skewer. A muslin or a reusable spice sachet **is** washed — `pho-broth-instant-pot` already
   counts *"the spice sachet"*.
9. **A lid is part of its vessel.** A pot and its lid are one thing, a slow cooker crock and its
   lid are one thing, an Instant Pot's inner pot, lid and sealing ring are one thing. Rule 4 is
   about parts that are washed on a *different schedule* — a basket and a crisper plate come out of
   the machine as two objects that both need a brush. A lid comes off the same pot.
10. **A component that is its own recipe file washes its own things.** `sweet-and-sour-pork` is
    four rather than five because its sauce is a separate recipe poured in. A recipe that says
    *"serve with rice"* or *"with @cooked rice{}"* does not inherit the rice pot.
11. **A set of identical storage vessels filled in one action is one entry.** *"the storage jars"*,
    not one entry per jar. **Invented here, and the reason is the plate rule's reason:** a stock
    that yields three quarts fills three jars and one that yields two fills two, so counting them
    individually makes the number track the *yield* rather than the *method*, and the field exists
    to compare methods. The line says *"the storage jars"* and the count is 1.
12. **Straining is a thing.** A sieve, a colander, a chinois, a fat separator, a cheesecloth: each
    is one thing, and it is separate from the pot the liquid came from and the container it went
    into. This is where broths and stocks get expensive and it is the honest answer.
13. **The bowl a marinade is made in is a thing; a zip bag is not.** A file that says *"in a bowl"*
    gets a bowl. A file that says *"in a bag"* gets nothing, because a bag is a disposable. Where
    the file says neither and the marinade is a wet mix of several ingredients, **a bowl is
    counted** — the ingredients had to meet somewhere, and refusing to count it is a guess in the
    optimistic direction, which is exactly the direction `cookware` was already wrong in.
14. **A dish that only goes into the oven in the vessel it was mixed in has one thing.** But a
    tray, a rack, a roasting tin and a foil-lined tray with the foil removed are each a thing.
    `NEVER_WASHED` deliberately excludes trays and racks from the fixture list for this reason.

### The shape of an entry

- **The file's own noun**, so the cross-check stays quiet: *"the Dutch oven"* where the file marks
  `#Dutch oven{}`, *"the deep skillet"*, *"the slow cooker crock"*. `flatten()` matches by
  substring in either direction after dropping case, accents, punctuation and a leading article,
  so *"the Instant Pot"* accounts for `#Instant Pot{}` and *"the crock"* would **not** account for
  `#slow cooker{}`.
- **A purpose clause where a second vessel of the same kind exists** — *"a bowl for the glaze"*,
  *"a plate for the lardons"*. Two bare *"a bowl"* entries read as a typo; two purposed ones read
  as two things, which is what they are.
- **Lower case, no full stop, comma-separated.** No numbers, ever — a number anywhere in the line
  is a build failure by design.

## 4. Vocabulary: matching `cookware` versus writing naturally

| Option | Consequence |
| --- | --- |
| **Phrase every entry to match the file's `#thing{}` names** | The cross-check stays silent, but the line starts reading like a parts list, and the field is supposed to be *the words a cook would use out loud*. |
| **Write naturally and accept the notes** | 145 files × a loose substring match: dozens of permanent notes on every `npm run check`, which is how an advisory gets ignored. |
| **Chosen: the file's noun, in a cook's sentence** | *"the Dutch oven, a skillet for the garnish, a plate for the lardons"* — natural, and every `#thing{}` in the file lands inside one of the entries by substring. |

The residue is deliberate: a note that fires on a `#potato masher{}` or a `#tongs{}` is the check
telling the truth about a thing rule 7 excludes. **Those notes are findings, not failures** — the
acceptance criteria say so — and they get pasted into the work artifact with a line each on why
each one is overruled.

## 5. Uncountable-without-cooking: what qualifies

A recipe is uncountable only when **reading the steps cannot determine the vessels**, not when the
answer is merely arguable. Concretely: a step whose vessel depends on how much the food expands, or
on whether it fits, and the file does not say. *"It might be two batches"* is a real instance of
this and it is the one to watch for in a basket or a skillet recipe.

Anything answerable by reading is answered. **The expected number of uncountables in this pool is
zero or close to it**, because every file in it is a pot-and-hob recipe whose vessels are stated.
If it comes out at zero, that is reported as a number, not as an omission.

## 6. What is not decided here, on purpose

- **Nothing is re-shelved.** The list of One Pot recipes washing three or more is evidence for a
  later counter decision and is not one. `src/data/counters.json` is not touched.
- **`docs/gaps/one-pot.md` is not updated**, though this ticket will produce the numbers that
  belong in it. It is outside the permitted paths and the finding lives in the work artifact.
- **No bar of the gate moves**, and this ticket has no ability to move one — it writes lines and
  reports a count.

## 7. Order of work, and the one real risk

The risk is **T-008-04 writing new `.cook` files in the same tree while this ticket runs**. The
mitigation is mechanical and non-negotiable:

1. The 151-file list is pinned from the tree as it stands, in the work artifact.
2. Every `lisa commit-ticket` passes **exact** repository-relative paths from that list.
3. Nothing globs. No `git add`, no `-A`, no ordinary `git commit`.
4. Before Review closes, `git status` is read to confirm no ticket-owned file is left staged,
   modified or untracked — and that any file that appeared from T-008-04 was not touched.

The second risk is the collection tests in `src/lib/washing-up.test.ts`, which are **not** this
ticket's to edit. Read: they assert `count === items.length` over the declared set, at least one
zero, at least one 1, at least 8 declared, and `undeclared.length > 0`. Adding 145 lines keeps all
five true — 513 recipes stay undeclared and `memphis-dry-rub` stays the zero. **No test needs
changing, and if one does, that is a finding rather than a licence.**

## 8. Batching

Files are read and annotated in batches by shelf, because a shelf is a promise and reading it in
one pass is what makes the findings visible:

1. One Pot 73 — the shelf whose promise has never been checked.
2. Instant Pot 25 — bar 2 lives here.
3. The Slow Cooker 20 — the shelf T-008-01 said has fifteen brown-in-a-skillet files.
4. Gap candidates 20 + siblings 13 — the plain halves and the air-fryer commissioning list.

One commit per batch, each with exact paths. `npm run recipes` after each, so a malformed line is
caught inside the batch that wrote it rather than at the end of 145.
