# T-013-01 — Plan

Seven steps. One commit, because the deliverable is one file and a half-written argument is not a
reviewable unit.

---

## Step 1 — Write the opening, the contents table, and *what an occasion is not*

Thesis sentence; the archetypes-not-taxonomies rule carried from `counters.md:9-13` with attribution;
the four sibling cross-links that stand in for the folder index; the negative definition (not a
theme, not a cuisine, not a mood, not a season with recipes attached).

**Verify:** criterion 7 is met by the negative definition alone. The four links resolve as relative
paths from `docs/knowledge/`.

## Step 2 — Write §1, the selling rule

The rule as one sentence. Four kinds of evidence, each with a real instance from `research.md` §5
and a stated weakness. The *what is not evidence* paragraph. The candidates table with three
rejections. The second gate.

**Verify:** count the kinds — must be four or more. Count the rejections — must be at least one;
three are carried. Confirm each rejection names what was searched for and not found, rather than
asserting absence.

## Step 3 — Write §2, the three axes

Three verdicts with reasons. The *type of day* entry names S-010 and the three dials, records that
the axis passes the selling test, and states the cost in both directions with the accepted one
identified.

**Verify:** three axes, three verdicts, each with a reason. The S-010 overlap is addressed
explicitly rather than implied.

## Step 4 — Write §3, the profile — the ticket's real work

In order: the field table (symbol, module, coverage); the profile shape; corner one worked; corner
two worked; the inversion table; what the collection did to it; the missing fields.

Every figure comes from `structure.md`'s data table. No number is written that is not in it.

**Verify:**
- Both corners worked in full — gates, signed weights, arithmetic, ranking, and what is wrong.
- The inversion is visible in one table with both rank positions.
- Every named field exists in `src/lib/`; check each against the module.
- Missing fields are named with what each would take and no more.
- The sign-flip finding is stated with its worked instance (`green-beans`, 13 assumed of 19.5).

## Step 5 — Write §4, the namespace

Both cases at comparable length, the decisive test, the decision, the cost list.

**Verify:** the *for* case is put at its strongest rather than as a straw man. The cost is a list of
what would have to change, not a proposal for how.

## Step 6 — Write Sources and What could not be verified

Sources grouped as `counters.md` groups them. The unverifiable section carries: the selling pass's
sample bias, the mooncake correction, what was not looked at, and which numbers will drift.

**Verify:** every domain listed was actually read in this pass. Nothing is cited that was not.

## Step 7 — Check, then commit

```sh
npm run verify                        # must stay green
```

Then, and only through Lisa's transaction:

```sh
lisa commit-ticket --ticket-id T-013-01 \
  --message "Settle what makes an occasion real" \
  --include docs/knowledge/occasions.md
```

**Verify:** `git status --porcelain` shows no ticket-owned file staged, modified or untracked
afterwards. Files belonging to other threads on this branch — `docs/gaps/filter.md`,
`docs/active/work/T-012-02/`, the untracked story and ticket files — are **not** this ticket's and
are never passed to `--include`.

---

## Testing strategy

**There are no unit tests, and that is the correct answer rather than a gap.** The deliverable is a
knowledge file. Nothing imports it, no checker parses it, and a test asserting that a paragraph
exists would be a test of the diff. `T-011-01` and `T-012-01` — the two closest precedents, both
knowledge files — shipped the same way.

What replaces tests is four checks a reviewer can repeat:

| Check | How | Passes when |
| --- | --- | --- |
| **The build is unaffected** | `npm run verify` | Green, and identical to before the change |
| **Every field named exists** | Grep each field name and module path against `src/lib/` | Every one resolves; no field is described that the code does not have |
| **Every figure is reproducible** | Rebuild the numbers from `src/generated/recipes.json` with `buildSchedule` and `costOf` | Each figure in §3 matches |
| **Links and anchors** | Follow every relative link; match every `#anchor` to a heading | All resolve |

The figures were produced by a throwaway probe run under `vitest` against the built collection and
**deleted before any commit**. It is not part of the deliverable and leaves no file behind; the
recipe for reproducing it is `costOf(recipe, 12, buildSchedule(recipe))` over the seventeen slugs
listed in `research.md` §7.

## Risks, and what each would cost

| Risk | Cost if it lands | Mitigation |
| --- | --- | --- |
| **The file recommends a feature** | It stops being the thing later work can be tested against — `cooks.md` says so in its own closing rule | Missing fields are named with what each would take, and nothing beyond. Checked in step 4 |
| **A weight reads as a measurement** | The repo's cardinal rule breached in a knowledge file | The weights section says out loud that a rate is the occasion's preference and the field it multiplies is the measurement |
| **Register drift into magazine English** | S-013 names this as the specific failure this story invites | §3 and §4 read against `voice.md`'s three house tests in step 4 and step 5 |
| **Pre-empting T-012-02** | Two files with two different shelf-supply numbers on one branch | No shelf-supply count is quoted. The seventeen-recipe set is a worked example, not a survey |
| **A stale figure quoted as current** | The file ages badly and quietly | Every count carries its date and its population. The closing section says which will drift |

## What is out of scope, restated so it is not drifted into

No occasion is opened. No counter is opened. No property is added. No `.cook` file is touched, not
even to add the `keeps` line that `cranberry-sauce` obviously wants. No code. No `README.md`. No
`docs/gaps/` page. T-013-02 owns modelling the meal rather than the dish; T-013-03 owns proving the
method on two occasions and reporting whether the shelf can feed them.
