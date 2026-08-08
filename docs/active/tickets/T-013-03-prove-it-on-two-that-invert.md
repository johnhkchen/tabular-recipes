---
id: T-013-03
story: S-013
title: prove-it-on-two-that-invert
type: task
status: done
priority: high
phase: done
depends_on: [T-013-01, T-013-02, T-012-02]
---

## Context

Run the method on two occasions and report whether it works. **This opens no counter, writes no
recipe, and changes no code.**

Two, not one, and **specifically two that invert each other** — because a method demonstrated on a
single occasion has not been shown to be about occasions at all. It may just be a difficulty
filter with a season written on it, and one example cannot tell the difference.

- **The big family holiday meal, cooked alone.** Flat scaling, keeps for days, out of the oven in
  the last hour, hands off to a helper, forgiving. The occasion T-013-02's model was built for.
- **A dumpling party for friends.** Nearly every dial reversed. **Hands-on time is the feature**,
  because the labour is the party; many hands, low skill floor per unit, a long forgiving assembly,
  and a dish that is worse alone.

If one profile ranks well and the other returns nonsense, **that is the finding and this ticket
reports it rather than tuning until both look good.** A profile shape adjusted to flatter its
examples has proved nothing.

### 1. Establish both, by the rule

`docs/knowledge/occasions.md` says an occasion is real if somebody sells for it. Apply it to both
rather than assuming, and gather the evidence the way `docs/gaps/soup-pot.md` gathered its sources
— linked, and saying what each one established.

The holiday meal has abundant evidence: caterers' menus, supermarket pre-order sheets, the
restaurant that opens one night. **The dumpling party is the harder case and worth the effort** —
the evidence is dumpling-making kits, restaurant classes, the frozen aisle, and shops selling
wrappers by the packet. If it turns out nobody sells for it, that is a real result and it means the
occasion is a hobby rather than a moment.

### 2. Rank the shelf against each profile

Run the hall-of-fame profile over the whole collection, twice, and produce two ranked lists.

Then check them as a cook, because that is the only test that matters:

- **Does the top of each list read as obviously right?** If the holiday list opens with something
  nobody would serve, the profile is weighting the wrong field.
- **Do the two lists genuinely differ?** Compute the overlap. **A high overlap means the profiles
  are not doing any work** and the whole method reduces to *easy is good*. Say the number.
- **Does the dumpling party's list contain the dish the holiday list ranks worst?** It should. That
  single inversion is the strongest evidence the system is real, and if it does not happen, say so.

### 3. Report whether the shelf can feed either

**T-012-02 is the reason this waits**, and its reading may well have concluded that food has to be
written before features are worth building. Take that answer seriously here.

For each occasion: how many recipes clear its profile at all, how many are genuinely good rather
than merely admissible, and what is conspicuously missing. The collection has fifteen dumpling
files and roughly eight non-starch vegetable sides — **one of these two occasions is probably much
better served than the other**, and which is a fact worth knowing before either becomes a shelf.

If the honest answer is *neither shelf should open yet*, say it. That is the same conclusion S-007
reached about The Soup Pot from the other direction, and it was right.

### 4. Diagnose the holiday meal for real

Take the top of the holiday ranking, build the meal a household would actually cook from it, and
run T-013-02's model over it. **Paste the diagnosis.**

That output — *your oven is oversubscribed between 4:30 and 5:30; seventy minutes of hands-on work
falls in the last forty-five* — is the thing S-013 claims no cookbook can produce. Either it reads
as the explanation of a real afternoon, or the claim is overstated and this ticket says which.

### 5. Recommend, do not open

End with what it would take to open each as a shelf: which recipes exist, which need writing,
which fields are missing, and whether the namespace decision from T-013-01 holds up now that there
are two real examples to test it against.

**Do not add an entry to `src/data/counters.json`.** Two other stories hold that file and an
occasion shelf is a later story's, argued from this ticket's evidence.

## Acceptance Criteria

- Both occasions are established against the *somebody sells for it* rule, with linked sources
  saying what each established, **or reported as failing it**.
- Both hall-of-fame profiles are run over the whole collection and produce ranked lists, by slug.
- **The overlap between the two lists is computed and stated as a number.** A high overlap is
  reported as a failure of the method, not explained away.
- The inversion test is run: whether the dumpling party's list contains what the holiday list ranks
  worst. Result stated either way.
- Both lists are read as a cook, with a verdict on the top ten of each.
- For each occasion: how many recipes clear the profile, how many are genuinely good, and what is
  missing — cross-referenced against T-012-02's reading.
- A realistic holiday meal is assembled from the ranking and **T-013-02's diagnosis is pasted in
  full**, with a sentence on whether it explains a real afternoon.
- A recommendation for each occasion: open it, open it after writing food, or do not open it —
  argued, with what it would take.
- The namespace decision from T-013-01 is re-tested against two real examples and confirmed or
  challenged.
- **No counter is opened, no recipe written, no `src/` file changed, no `.cook` file touched.**
  Only `docs/gaps/**` and `docs/active/work/T-013-03/**`.
