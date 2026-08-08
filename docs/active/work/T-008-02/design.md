# T-008-02 — Design

Eight decisions, each weighed against what `research.md` measured rather than against what the
ticket assumed. Where the measurement contradicts the ticket, the measurement wins and the
contradiction is written down rather than smoothed over.

---

## D1. The blurb

**Chosen: `Plug one in, eat, and wash two things.`**

Options weighed:

| | Blurb | Why not |
| --- | --- | --- |
| a | Plug one in, eat, wash two things. | S-008's own phrase. Three bare imperatives; the other three appliance blurbs are sentences. |
| b | **Plug one in, eat, and wash two things.** | **Chosen.** |
| c | One machine does it, and there are two things in the sink. | States the bargain from the sink backwards. Truthful, flat, and buries the verb. |
| d | Plug it in at half past six and eat by seven. | Invents a clock. The gate says 45 minutes; a blurb saying thirty is a fabricated number. |

The register is set by the three shelves this one sits beside — *"Lock the lid and walk away; it
gets there on its own"*, *"Everything goes in one pan, and that is the only pan to wash"*, *"Fill
it before you leave; dinner is waiting when you get back"*. All three say **what you put in and
what you get back**, in one sentence, with no instruction aimed at a customer at a window. (b) is
the story's own words with the conjunction the house style uses. It keeps the register out of it
and it is the whole gate compressed: *one* machine, *two* things, and eating in between.

## D2. Section titles — four kept, one replaced, and the replacement argued

The ticket offered five as intent and invited better wording. Four survive unchanged. The fifth
does not.

**Dropped: *Also here*.** `docs/gaps/one-pot.md` is explicit about why, and it is the page this
shelf argues with:

> This menu has no *Also here* section to sweep a stray into, and that is deliberate — a shelf
> whose items land in *Also here* has section titles that do not match what is on it.

Two other counters carry one (Panadería, Deli) and in both it holds **borrows** — things shelved
primarily elsewhere. **This shelf cannot borrow.** It is a gate, and `research.md` §3 measured that
not one of the 664 existing recipes passes it. Every item here will be written for it by T-008-04.
An *Also here* on a shelf that admits nothing from outside is a bucket built before there is
anything to put in it, and by the time there is, it will be a section title that gave up.

**Added: *Vegetables that go crisp*.** The ranked list in §D6 has a band of nine — cauliflower,
sprouts, broccoli, sweet potatoes, chickpeas, batata harra, corn, courgette, padrón peppers — that
has nowhere honest to go. It is not *Straight out of the basket*, which is the deep-fry
replacements. It is not *Sheet-pan-shaped*, which is a protein and its vegetable in one load. It is
the machine's second-best case after frozen food and it is nine items; folding it into either
neighbour would mislabel it.

**The five, in menu order:**

1. **Straight out of the basket** — what a deep fryer used to do. Wings, karaage, falafel, chips.
2. **Start to finish in the pot** — the pressure half, and the only section that is not the fryer.
3. **Sheet-pan-shaped, in the basket** — a protein and its vegetable, one load, one thing to wash.
4. **Vegetables that go crisp** — the roast-vegetable band.
5. **Frozen things, done properly** — the packet, which is what the machine is genuinely best at.

Order is menu order: the thing people came for first, the pot second because it is the other half
of the counter's name, then the two vegetable-shaped sections, then the freezer. Empty `items`
arrays throughout; T-008-05 fills them.

## D3. No `categories` fallback

Not a judgement call — the ticket forbids it and the reason is the whole shelf. `menuFor()` would
otherwise drop every recipe of a matching category onto a counter whose entire claim is that its
membership was *measured*. Thirteen of the twenty-one counters already carry `"categories": []`,
including all three appliance shelves, so this is the majority shape rather than an exception.

## D4. Where the gate is written down, given that the page has nowhere to put it

The ticket says *"write this into the counter's own page copy"*. `src/pages/menu/[counter].astro`
renders exactly two pieces of prose: `counter.blurb`, and a section's `notes`. There is no
long-copy field, and the page will not build at all until T-008-05 shelves something
(`getStaticPaths` filters on `menu.count > 0`).

**Chosen: all three surfaces, each carrying what it can hold.**

- **The blurb** carries the bargain in one sentence (D1).
- **One section-level note** on *Straight out of the basket* carries the gate itself in one
  sentence. A note with no `of` is legal and prints under the heading
  (`scripts/parse-recipes.mjs:138`), the cap is 120 characters
  (`scripts/parse-recipes.mjs:101`), and the sentence fits:
  *"Everything here washes two things or fewer, cooks in one plug-in machine, and is on the table
  in 45 minutes."* — 107.
- **`docs/knowledge/counters.md`** carries it in full, as a numbered rule, with how each bar is
  measured. This is the copy that matters: the ticket's reason for writing it down is that *"a rule
  nobody can read becomes a judgement within a year"*, and the reference file is the thing a person
  reads a year later.

**Rejected: the note only.** 120 characters cannot say how a bar is measured, and a bar whose
measurement is unstated is the judgement the ticket is trying to prevent.

**Known cost, recorded rather than hidden:** `node scripts/menu-sections.mjs --write` drops every
hand-written `notes` block, including this one. It already drops eleven others and
`docs/gaps/README.md` warns about it. This ticket does not run `--write`, and the gap page repeats
the warning for T-008-05.

## D5. `counters.md` — the entry's shape, and the vocabulary table problem

The file's preamble says **every counter below carries a vocabulary table**, and gives the reason:
the menu word is how a person who ate a thing finds the recipe for it, and *"that table is the
source for `>> aka:` lines"*.

**This counter has no board and therefore no menu words.** Nobody has ever ordered "the air fryer
one" at a window. Three ways out were weighed:

| | Approach | Verdict |
| --- | --- | --- |
| a | Omit the table, and say why | Honest, but leaves T-008-04 with no `aka` source, and the writer ticket needs one. |
| b | A table of dish names as blogs and packets print them | **Chosen.** |
| c | Invent a menu | Refused. There is no shop; a fabricated board is the worst thing this file could contain. |

(b) is defensible because the search terms are real even though the board is not: a person types
*air fryer wings*, *airfryer chips*, *actifry*, *frozen chips air fryer*. Those are the names on the
packet, the appliance box and the search bar, which is this shelf's equivalent of a board. The
table's third column keeps its job unchanged — say plainly what the thing is.

**No precedent exists either way**, because `counters.md` has entries for sixteen of twenty-one
counters and **all five it is missing are the appliance-and-format shelves** — The Bowl Shop,
Instant Pot, One Pot, Japanese Home Cooking, The Slow Cooker. This entry will be the first
appliance counter in the file. That gap is recorded in the gap page as a finding for whoever writes
the next one; **backfilling five entries is not this ticket's scope** and would be five unreviewed
essays smuggled into a ticket about one counter.

**Contents table:** one row, appended last, matching the counter's position in `counters.json`.

## D6. Combined or separate — and the answer the numbers actually gave

The ticket asked for the case to be made with numbers, and named the failure mode: *"a counter that
is 90% borrowed from Instant Pot is a filter wearing a shelf's clothes."*

**Measured, the overlap is 0%.** Not 90, not 40. Zero, out of a candidate pool of 118.

| Shelf | Recipes | Clear the gate |
| --- | --: | --: |
| One Pot | 73 | 0 |
| Instant Pot | 25 | 0 |
| The Slow Cooker | 20 | 0 |

**Chosen: Separate — and separate for a reason nobody predicted.**

One Pot fails on **bar 2**, unanimously and for a reason that has nothing to do with effort: its 73
are hob and oven dishes and not one names a plug-in machine that cooks. Its *fast* end is where
this hurts — `western-omelette` at 3 minutes elapsed, `egg-foo-young` at 3, `jalfrezi` at 7 — three
recipes that would walk any speed test and are excluded by the machine, correctly, because the
shelf's promise is *plug one in*.

Instant Pot fails on **bar 3**, unanimously. Its shortest recipe is `collard-greens-instant-pot` at
60 minutes by its own `>> time:` and 46 by the derived critical path, and the derived figure is a
floor with two untimed operations in it. Four of the 25 fail bar 2 as well.

So the two shelves are not competitors to be carved away from — they are **disjoint**. The honest
statement of the archetype is therefore not *"a filter over the other shelves"* but *"a shelf whose
entire stock has to be written"*, and the risk this ticket hands S-008 is the **opposite** of the
one the ticket braced for: not redundancy, but an empty shelf with twenty-plus recipes of work
under it.

**Rejected: combined into Instant Pot.** It would put a 3½-hour tonkotsu broth and a 12-minute
basket of wings under one heading, which is the thing the gate exists to stop.

**Rejected: loosening any bar.** Bar 3 at 90 minutes would admit 21 of the 25 Instant Pot recipes
and make the shelf look healthy overnight. That is precisely the move S-008 forbids — *"a shelf
that admits a 90-minute recipe to look fuller has become the thing this story exists to fix"* — and
the acceptance criteria say so a second time. The number stays 45 and the page says 0.

## D7. How the ranked list is ranked, and the `kit:` decision per item

**Ranking rule, stated at the top of the list so a writer cannot mistake it:** a dish ranks by
whether it clears the gate first and by how famous it is last. In order —

1. How many things it puts in the sink. A marinade bowl plus a dredging station plus the basket is
   three and it does not belong here whatever it tastes like.
2. Whether one machine does all of it. A hob-then-basket dish is out.
3. Whether it lands under 45 minutes including preheat and any rest.
4. Only then, whether anyone wants it.

That rule demotes several of the dishes an air fryer is famous for — tonkatsu and korokke each need
flour, egg and panko in three dishes before the basket sees them — and it promotes things nobody
puts on a list, like a tray of sprouts.

**The `kit:` call, per item, by slug.** `scripts/parse-recipes.mjs:198` throws when two files share
a `dish` and neither declares `kit`, so this is a build error if it is written backwards, and the
writer will hit it blind. The rule the list applies:

- **A basket version of a dish already here** → `>> dish: <existing-slug>` + `>> kit: Air Fryer`.
  Confirmed present and claimable: `karaage`, `falafel`, `french-fries`, `onion-rings`,
  `hush-puppies`, `fried-chicken`, `crispy-chickpeas`, `crisped-marinated-tofu`, `seared-halloumi`,
  `crispy-roast-potatoes`, `roasted-cauliflower`, `charred-broccoli`, `roasted-brussels-sprouts`,
  `roasted-sweet-potatoes`, `batata-harra`, `samosa`, `onion-bhaji`, `crab-rangoon`, `egg-rolls`,
  `blackened-salmon`, `chicken-tikka`, `shish-tawook`, `kafta`, `seekh-kabab`, `meatballs`,
  `garlic-knots`, `potato-knish`, `siu-yuk`, `chicken-shawarma`.
- **A dish with no plain counterpart** → no `dish` line, no `kit` line. Confirmed absent: chicken
  wings, tonkatsu, korokke, bacon, latkes, arancini, mozzarella sticks, jalapeño poppers, corn
  dogs, scotch eggs, churros, doughnuts, fish and chips, corn ribs, padrón peppers, and every
  pressure-side dish (dal, a pot of rice, hard-boiled eggs, steel-cut oats).

**The trap worth naming loudly:** *fresh chips* is `french-fries` with a kit line, and *frozen
chips* is not — a bag of frozen chips is a different dish with a different method, not a variant of
a recipe that starts by cutting a potato. Getting that one backwards is the likeliest error on the
page and it is called out in place.

## D8. Bar 3's evidence, and how the page reports it

The ticket instructed: *"go and look at how `>> time:` and the clock actually behave on the
existing 25 Instant Pot recipes before you write '45 minutes' as if it were obvious."*

**Done, and it inverted the expected finding.** The ticket expected `>> time:` to understate,
because a pressure time is not the whole clock. On these 25 files `>> time:` is **greater than or
equal to** the derived critical path on all 25. T-002-01 taught `src/lib/time.ts` the four pressure
timer names before a single recipe existed, and T-002-02/03's writers used them —
`docs/gaps/instant-pot.md` counts 42 pressure-and-release tasks across the 25, every one reading as
unattended and every one carrying `confidence: stated`. The come-up and the release are already in
both numbers.

**Both readings are reported, and neither is presented as the truth.** `>> time:` is the author's
claim about the whole dish. The derived elapsed is a **floor**: `schedule.ts` gives an untimed
operation 0 minutes on purpose, so a file with untimed prep reads shorter than it cooks. The page
prints both columns and says which is which, because a single number here would be exactly the kind
of invented figure the story forbids.

**Chosen presentation:** a full 25-row table in the gap page, sorted by the derived elapsed, with
`>> time:`, elapsed, untimed-operation count, and a pass/fail mark per bar. A reader can check any
row against the file. A summary line alone would ask them to take it on trust, and the acceptance
criterion says *measured off the built site rather than estimated*.
