# Finished board

Tickets and stories that are done. Lisa does not read this directory — `.lisa.toml` points at
`docs/active/` — which is the point.

Their work records stay where they were, in `docs/active/work/<ticket-id>/`, because the
remaining tickets are told to read them as a handoff. Only the ticket files moved.

## Why these were archived rather than left in place

T-002-05's completion seal failed on a lock race: two tickets went for
`.git/lisa-commit.guard` at `max_threads = 4`, it lost, and by the retry the reconciliation
deadline had passed. What made that stick rather than heal was the shape of the retry.

Every loop start re-attempted `MarkDoneKey` on the ticket, which calls `lisa complete-ticket`,
which refuses with:

```
Error: ticket T-002-05 has no changes in the requested include paths
```

**`complete-ticket` counts changes in `--work-dir` only** — a modified ticket file is not
enough. The work had already been committed, so the work directory was clean, so the command
could never succeed, so the ticket parked again. Each attempt also wrote a review disposition of
`block` whose reason was the text of that failed command rather than any judgement about the
twelve grain bowls, which were verified good throughout: `all 12 file(s) draw a table.`

Both completion tracks in `.lisa/completion-journal.jsonl` — the agent one (`attempt_id: 1`)
and the operator one (`attempt_id: operator`) — end at `rejected`, and the two seals that did
land (`bb5877c` at generation 2, `5a409c9` at generation 3) wrote no terminal journal record at
all. So the board and the journal disagreed permanently, and nothing on the board could be
edited to make them agree.

Archiving takes the ticket out of Lisa's view, which is the only thing that stops the retry.

## What to know if this recurs

The right move, from the moment a completion transport fails, is `lisa unblock` and then
letting the loop re-run the review phase — **not** a hand-made completion commit. The review
phase rewrites `review.md` and `review-disposition.json`, and those edits are what give the
seal something to commit. A hand-made commit removes exactly that and makes the state
unrecoverable through the ordinary commands.

Dependencies on archived tickets were removed from the four that remain, so the ordering that
still matters is intact:

```
T-002-08 ─┬─ T-002-09 ─┐
          └─ T-003-06 ─┴─ T-003-07
```
