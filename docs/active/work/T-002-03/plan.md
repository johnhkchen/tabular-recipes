# T-002-03 — Plan

Twelve files, four commits, three verification gates. Each step is verifiable on its own and
nothing before the last step touches anything outside `recipes/`.

## Step 0 — Confirm every `dish:` slug exists

Not optional and not assumable: a `dish:` naming nothing produces a lonely variant with no
build error (Research §1).

```sh
ls recipes/*/tonkotsu-broth.cook recipes/*/pho-broth.cook recipes/*/chintan-broth.cook \
   recipes/*/chicken-broth.cook recipes/*/ham-hock-stock.cook recipes/*/ful-medames.cook \
   recipes/*/cuban-black-beans.cook recipes/*/refried-beans.cook recipes/*/congee.cook \
   recipes/*/borscht.cook recipes/*/boston-baked-beans.cook recipes/*/gigantes-plaki.cook
```

**Pass:** twelve lines, seven under `soups/` and five under `rice-beans-and-grains/`.
**Already run in Research**, and re-run at the top of Implement so the record shows it
against the files as written.

## Step 1 — The five stocks and broths

Write, in gaps order:

1. `recipes/soups/tonkotsu-broth-instant-pot.cook`
2. `recipes/soups/pho-broth-instant-pot.cook`
3. `recipes/soups/chintan-broth-instant-pot.cook`
4. `recipes/soups/chicken-broth-instant-pot.cook`
5. `recipes/soups/ham-hock-stock-instant-pot.cook`

Per `structure.md` §1–5. The two judgement calls land here: tonkotsu's uncovered
emulsifying boil (D4) and chicken broth's 20-minute settle in place of an 8 hr chill (D5).
Both must be argued in the file's own prose, not only in the artifacts.

**Verify:**

```sh
node scripts/check-recipes.mjs --labels recipes/soups/tonkotsu-broth-instant-pot.cook \
  recipes/soups/pho-broth-instant-pot.cook recipes/soups/chintan-broth-instant-pot.cook \
  recipes/soups/chicken-broth-instant-pot.cook recipes/soups/ham-hock-stock-instant-pot.cook
```

**Pass:** five `ok`, each 5–16 rows × 4–7 cols (a file's op count plus the ingredient
column), and each staircase reading as a cook's verbs — `pressure cook 90 min`, not a
sentence fragment. Fix with `>> step.N:` overrides where a derived label reads badly.

**Commit:** `lisa commit-ticket --ticket-id T-002-03 --message "Put the stockpot under a lid" --include <the five paths>`

## Step 2 — The four beans that skip the soak

6. `recipes/rice-beans-and-grains/ful-medames-instant-pot.cook`
7. `recipes/rice-beans-and-grains/cuban-black-beans-instant-pot.cook`
8. `recipes/rice-beans-and-grains/refried-beans-instant-pot.cook`
9. `recipes/rice-beans-and-grains/boston-baked-beans-instant-pot.cook`

Per `structure.md` §6–8, §11. The specific things to get right, each of which is a way to
hurt somebody or to lie:

- **Times are from the chart, at the top of the published range** — fava 45, black 30,
  pinto 40, navy 30. None derived from the plain file's 1 hr 30.
- **Soaked/unsoaked is stated in the ingredient row**, e.g.
  `@dried pinto beans{1%lb}(450 g; dry, not soaked)`, because the two are different
  numbers and a reader who soaks anyway and cooks 40 minutes gets mush.
- **Acid and sugar go in after the pressure legs**, with the reason in the step.
- **Natural release on every one.** No `~quick release` in this ticket at all (D7).

**Verify:** same `check-recipes.mjs --labels` over the four paths. Additionally read back
each file and confirm the ingredient row says dry/unsoaked in words.

**Commit:** `lisa commit-ticket --ticket-id T-002-03 --message "Beans from dry, no soak" --include <the four paths>`

## Step 3 — The porridge and the soup

10. `recipes/soups/congee-instant-pot.cook`
11. `recipes/soups/borscht-instant-pot.cook`

Per `structure.md` §9–10. Congee carries the never-quick-release line as a safety
instruction. Borscht keeps its vegetables out of the pressure leg entirely and is the file
closest to README's 16-row ceiling — count the rows in the `check-recipes.mjs` output
rather than by eye.

**Verify:** `check-recipes.mjs --labels` over both. Borscht must report ≤ 16 rows and ≤ 6
operations; if it exceeds either, drop the parsnip-tier ingredients rather than merging two
operations, because merging is what makes an unreadable cell.

**Commit:** `lisa commit-ticket --ticket-id T-002-03 --message "The porridge and the beet pot" --include <the two paths>`

## Step 4 — The one bean that keeps its soak

12. `recipes/rice-beans-and-grains/gigantes-plaki-instant-pot.cook`

Per `structure.md` §12. Separated into its own step and its own commit precisely because it
is the exception the ticket asks a writer to think about, and a reviewer should be able to
read it alone.

**Verify:** `check-recipes.mjs --labels`; confirm the soak is `~soak{12%hr}`, that
`src/lib/time.ts` has `soak` in UNATTENDED (it does), and that step 1's prose gives the
reason rather than merely stating the soak.

**Commit:** `lisa commit-ticket --ticket-id T-002-03 --message "The one soak the pot does not take away" --include <the path>`

## Step 5 — Collection-level verification

`check-recipes.mjs` sees one file at a time. It cannot catch a `dish:` typo, a counter name
that does not resolve, a dead `pairs-with`, or two plain files sharing a dish. Only the
whole-collection parse can.

```sh
npm run recipes     # scripts/parse-recipes.mjs -> src/generated/recipes.json
```

**Pass:** exits 0, and the summary line's recipe count is the previous count + 12.
**Then** confirm the switch actually exists on both sides for a sample:

```sh
node -e "const r=require('./src/generated/recipes.json');
  const v=r.filter(x=>x.kit==='Instant Pot');
  console.log(v.length, v.every(x=>x.variants.length>0));
  console.log(r.find(x=>x.slug==='cuban-black-beans').variants);"
```

**Pass:** `12 true`, and the plain `cuban-black-beans` lists its Instant Pot sibling.

```sh
npm run verify      # parse + vitest + astro build
```

**Pass:** green. This runs `src/lib/collection.test.ts`, which is the only check on "at most
one plain way per dish" and "variants agree about which dish they are". `src/generated/` is
gitignored, so this leaves nothing to commit.

## Step 6 — Ownership check before Review

```sh
git status --porcelain recipes/
```

**Pass:** exactly twelve lines, all of them already committed by Steps 1–4 (so: no output
at all after the four commits). Anything modified rather than added means a plain file was
edited, which fails the last acceptance criterion outright.

```sh
git diff --stat HEAD -- . ':!docs/active/work' ':!.lisa'
```

**Pass:** empty.

## Testing strategy

There is no unit test to write. This ticket adds data, and the repo's tests are already the
right ones:

| What could go wrong | What catches it |
| --- | --- |
| A file does not draw a table (split, two endings, dangling `~1`) | `check-recipes.mjs`, per file |
| A cell label reads as a mangled fragment | `check-recipes.mjs --labels`, read by a human |
| `dish:` names a slug that does not exist | Step 0 `ls`, then Step 5's variant probe |
| Two plain files share a dish | `parse-recipes.mjs:117`, and `collection.test.ts:67` |
| `counters: Instant Pot` misspelled | `parse-recipes.mjs:52-60` throws |
| `pairs-with` points at nothing | `parse-recipes.mjs:86-91` throws |
| A pressure timer reads as hands-on | `src/lib/time.ts` UNATTENDED — verified by the exact timer strings, and spot-checked in `recipes.json` |
| Duplicate slug | `parse-recipes.mjs:32-37` throws |
| A wrong pressure time | **Nothing automated.** Only the sourcing discipline in D2 and the per-dish record in `progress.md`. |

That last row is the reason `progress.md` records a source per number rather than a tick.

## Rollback

Each commit is one coherent group of new files and nothing else. Reverting any of the four
removes those files and leaves the other groups, the plain recipes, and every other ticket's
work untouched, because no file outside `recipes/` is written and no existing file is
edited.
