# T-002-04 — Plan

Five commits, each a shelf section's worth of files, each verified before it lands.

## Verification, defined once

For every file written:

```
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook
```

Passing means all of:

1. `ok <path>  R rows x C cols` with `R ≥ 3` and `C ≥ 3` — the file draws a table.
2. No `cooklang:` warning lines under it. A warning is a parse complaint (unclosed `{}`, a stray
   `@`), and a file that warns is a file that will render wrong.
3. The printed staircase is verbs: every line reads as an operation a cook does
   ("brown 8 min", "simmer covered 25 min"), not as a stripped sentence fragment.
4. The header line in brackets is the intended prose, so the header/footer split landed where it
   was meant to.

Plus, per file, read by eye against the ticket's own tests:

5. One vessel named with `#…{}` and no second one anywhere in the file.
6. Every timer named (`grep -c '~{' <file>` must be 0).
7. Metadata present: `title`, `category`, `tags`, `servings`, `counters: One Pot`, and `aka`
   unless the dish has genuinely no other name.
8. No pressure cooker, no Instant Pot, no `>> kit:` line.

Sweep checks at the end of implementation, over all fourteen at once:

```
node scripts/check-recipes.mjs --labels recipes/stews-and-braises/chicken-and-dumplings.cook ... (all 14)
grep -L '>> counters: One Pot' <all 14>        # must print nothing
grep -l '~{' <all 14>                          # must print nothing
grep -riE 'pressure|instant pot|>> kit:' <all 14>   # must print nothing
git status --porcelain recipes/               # must list exactly 14 files, all new
```

There are no unit tests to write: `.cook` files are data, and `check-recipes.mjs` is the test
harness the repository already has for them. `npm run verify` (parse + test + build) is the
integration check; it is run once at the end, and it is read for *new* failures only, since two
other agents are writing to this branch at the same time.

## Step 1 — Braises and stews (3 files)

`recipes/stews-and-braises/chicken-and-dumplings.cook` (rank 1),
`recipes/stews-and-braises/new-england-boiled-dinner.cook` (rank 14),
`recipes/stews-and-braises/ratatouille.cook` (rank 16).

Rank 1 first because it is the gap file's single most conspicuous hole. Verify all three, then:

```
lisa commit-ticket --ticket-id T-002-04 --message "Three one-pot braises: dumplings, boiled dinner, ratatouille" \
  --include recipes/stews-and-braises/chicken-and-dumplings.cook \
  --include recipes/stews-and-braises/new-england-boiled-dinner.cook \
  --include recipes/stews-and-braises/ratatouille.cook
```

## Step 2 — The six skillet dinners

`recipes/eggs/shakshuka.cook` (4), `recipes/pasta/skillet-lasagna.cook` (9),
`recipes/eggs/tortilla-espanola.cook` (10),
`recipes/stews-and-braises/chicken-cacciatore.cook` (11),
`recipes/noodles/beef-stroganoff.cook` (12),
`recipes/stews-and-braises/sausage-and-peppers.cook` (13).

This is the acceptance criterion the shelf is thinnest against, so it is one commit and it is
verified as a set: the six must all pass, and each must name a skillet and only a skillet.

Two files carry a specific risk to check by eye:

- `beef-stroganoff` — the noodles must cook **in** the pan (Design 3). If the file ever reads
  "serve over noodles", it is wrong.
- `sausage-and-peppers` — must not collapse to one operation (Design 9). `C ≥ 5` in the check
  output is the signal that it did not.

Commit with all six `--include` paths.

## Step 3 — Rice and grains that cook in (3 files)

`recipes/rice-beans-and-grains/arroz-con-pollo.cook` (3),
`recipes/rice-beans-and-grains/paella.cook` (7),
`recipes/pasta/one-pot-pasta.cook` (8).

Specific checks: the rice goes in dry and finishes in the pot's own liquid in all three; `paella`
says do not stir for the last stretch and claims nothing further about the socarrat.

## Step 4 — Soups that are the whole meal (2 files)

`recipes/soups/gumbo.cook` (2), `recipes/soups/sancocho.cook` (15).

`gumbo` is the one with the roux in it. Its specific checks:

- the roux timer is `~stir{…}` — hands-on, per `time.ts` (Design 4);
- the roux and the trinity are steps in the gumbo pot, not references to files that do not exist;
- no ingredient named `roux` or `sofrito` (there is no such file to link to).

## Step 5 — Sweep, then progress

Run the sweep checks above. Then write `progress.md` with, for every file: rank, slug, vessel,
section for T-002-08, and confirmation of the check output; and for every skip: rank, dish,
reason. Commit nothing further — `progress.md` and the other phase artifacts are Lisa's to
publish.

## Rollback

Each step is new files only, so backing one out is deleting the files it added; nothing existing
is touched and no other ticket's work can be disturbed by an `--include` list that names only
paths created in that step.

## Risks and how each is handled

| risk | handling |
|------|----------|
| A dish turns out to exist under a name the research grep missed | `ls recipes/*/<slug>.cook` immediately before writing each file; if it hits, the file is not written and the slug plus section go in `progress.md` for T-002-08. |
| A file fails the 3-column floor | Rewrite as the operations a cook actually performs, in order; never pad with a fake step. If it cannot honestly reach three columns it is not written, and the skip is recorded. |
| `>> step.N:` numbering drifts after an edit | The `--labels` output prints the staircase in order; a mismatch shows as a label on the wrong rung, and the header line proves step 1 landed as the header. |
| The other two agents' commits collide | `--include` names only files created here; `check-recipes.mjs` writes nothing; `npm run verify` is read for new failures only. |
| Rank 5 and rank 6 skips are read as under-delivery | Both are named with reasons in `progress.md` and `review.md`, and the count still reaches 14 against a floor of 12. |
