---
id: S-014
title: put-it-online
type: story
status: open
priority: high
---

## Why

**Seven stories have landed since anything was published, and every one of them deliberately left
findings behind rather than fixing them in flight.**

That was right each time. A ticket that writes recipes should not also re-shelve counters; a
ticket that measures a gate should not also move the gate. The discipline is why the record is
trustworthy. But it means the collection is now carrying a season's worth of recorded-and-not-done
work in **77 work artifacts**, and nobody has read them as one thing.

This repo has done that pass three times before — T-001-18, T-002-09, T-003-07 — and each time it
found what no single ticket could see from inside its own folder. The category tree had drifted.
Twenty-four tag concepts were spelled two ways across 51 files. Fourteen recipes claimed to take
less time than their own timers added up to. None of those was visible to the ticket that caused
them.

**And none of it is online.** The site publishes from Cloudflare on a push to `main`, and
`main` has not moved since the work began. Nothing S-007 through S-013 produced — the cha chaan
teng, the air fryer shelf, the washing-up property, the filter, the scaling model — is visible at
`recipes.b28.dev`.

## What this story is, and what it is not

Three tickets: read everything, fix what is cheap and certain, publish.

**It is not a fixing spree.** The consolidation will surface more than can responsibly be fixed at
the end of a session, and the temptation is to clear the list. Most of what it finds belongs in a
later story with its own argument. **T-014-02 is deliberately bounded** — a fix qualifies only if
it is mechanical, verifiable, and does not require a judgement somebody would want to argue about.
Everything else stays recorded, which is what recorded is for.

**It is not a rewrite of the gap pages.** Each already describes its own shelf. This adds the one
document none of them can be: the cross-cutting list, ranked, with the ticket each finding came
from so a reader can go back to the evidence.

## The publish step is the irreversible one

`wrangler.jsonc` serves `./dist` at the custom domain **`recipes.b28.dev`**. Cloudflare runs
`npm run verify` itself before it deploys, which is why `.github/workflows/ci.yml` deliberately
does not run on push to `main` — the comment in that file says so plainly: *"Cloudflare already
runs verify there, and its run is the one that can actually stop a bad recipe from shipping."*

So **pushing to `main` is publishing.** There is no staging step and no approval gate between the
two. T-014-03 treats that as the serious act it is: everything verified before the push, and the
live site checked after it rather than assumed.

## Shape of the work

- **T-014-01** reads all 77 work artifacts and produces one ranked list. Depends on **T-008-05**,
  the last ticket still in flight, so its findings are included.
- **T-014-02** applies only the mechanical fixes from that list.
- **T-014-03** commits the board, pushes, and confirms the live site serves the new work.

## Conventions

Everything in `README.md` holds. Two things bind harder at the end of a session than at the start:

**Never fabricate a number**, and that now includes the consolidation's own counts. A ranked list
whose numbers were estimated rather than measured is worse than no list, because the next pass
will plan against it.

**Recorded is a legitimate outcome.** The five-gaps list in `docs/gaps/README.md` has never been a
list of things somebody is about to do. It is a list of things somebody established and chose not
to do yet, with the reason. Adding to it honestly is success, not deferral.
