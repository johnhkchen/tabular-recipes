---
id: T-007-03
story: S-007
title: the-drinks-and-the-toast
type: task
status: done
priority: high
phase: done
depends_on: [T-007-01]
---

## Context

Write the half of the cha chaan teng that is drunk and the half that comes out of a toaster. Work
from the ranked list in `docs/gaps/cha-chaan-teng.md`, which T-007-01 wrote for you.

**`.cook` files in `recipes/` only.** You do not touch `src/`, `docs/gaps/**` or
`src/data/counters.json`. T-007-05 shelves what you write. Record anything the shelver needs — a
dish you found already existed, a section you think an item belongs in — in your work artifact
under `docs/active/work/T-007-03/`.

### 1. The drink is the reason this counter earned its slot

`docs/gaps/README.md` lists **"a drink that is brewed"** among the five gaps to fill first: three
drinks exist on this site and all three are poured cold. **港式奶茶 closes that gap**, and it is
the most important file in this ticket.

It is also the easiest one to write badly. The brew, the pull and the milk are three separate
decisions:

- **The blend.** Not one tea. A mix of grades — coarse leaf for body, fine dust for colour and
  astringency — and shops guard their ratio. Say it is a blend, give a ratio that a source
  supports, and say plainly that shops differ rather than presenting one number as the number.
- **The pull (撞茶).** The tea is poured through a cloth bag between two pots, repeatedly. That is
  not theatre — it aerates and it is why the texture is what it is. It has to be an operation in
  the table with a named timer, not a sentence in a note.
- **The milk.** Evaporated milk, not fresh, and the brand argument is real. Name what it does to
  the mouthfeel and let a reader substitute knowingly.

**Never fabricate a number.** A steeping time you could not source is worse than no file. If the
sources disagree, say the range in the file and pick the middle in the timer — that is honest and
it is what the collection already does elsewhere.

### 2. What to write

The list in `docs/gaps/cha-chaan-teng.md` is the authority and it ranks these; the shape below is
what this ticket expects to come back with. **Eight files minimum.**

**The drinks counter.** 港式奶茶 first. Then 鴛鴦 — coffee and milk tea together, and it consumes
the milk tea rather than re-deriving it, which is the whole reason to write the tea first. Then
the cold half of the board: 凍檸茶 (the lemon slices are muddled hard against the glass, and that
is the recipe), 檸樂煲薑 (Coke simmered with ginger and lemon, drunk hot, and the one item on this
board a Western reader will not believe until they read it), and whichever of 好立克 / 阿華田 /
紅豆冰 the work list ranked.

**Toast and the bun case.** 西多士 — two slices with peanut butter between them, egged, deep-fried,
butter on top, golden syrup poured over. **It is not `french-toast` and the file must say so**, in
`aka` and in the prose. 奶油多 — thick toast, butter, condensed milk, and it is three ingredients
and one operation, which is fine; not every table needs six columns. Then 菠蘿油, which is
`pineapple-bun` split warm with a cold slab of butter — check whether the work list called that a
new file or a note on the existing one, and do what it says.

`egg-custard-tart` already exists and is a shelving job, not yours.

### 3. Two things about this shelf that the tables have to carry

**These are set-meal items and the set is how they are ordered.** A 下午茶餐 is toast and a drink
for one price between three and six. The table cannot express a combo — that is a
what-a-table-cannot-hold entry T-007-01 should already have recorded — but the `aka` line can
carry the set name a person actually says, and it should.

**Evaporated and condensed milk are two different tins and the collection has neither.** Get the
names right in the ingredient rows, because T-007-05 has to find them an aisle and `condensed
milk` matching an `evaporated milk` pattern would be a silent wrong shelf.

## Acceptance Criteria

- At least **eight** new `.cook` files, all passing `node scripts/check-recipes.mjs`.
- `hong-kong-milk-tea` exists, is brewed, has the pull as a named operation with a timer, uses
  evaporated milk, and its blend and steeping figures are each traceable to a source cited in the
  work artifact. **No number in it is invented**; where sources disagree the file says the range.
- 鴛鴦 consumes the milk tea via `&`, rather than re-deriving a brew.
- The 西多士 file carries `french toast` in `aka`, and its prose says in one line what it is not.
- Every file names its counter with `>> counters: Cha Chaan Teng`, carries `aka` with characters,
  a Cantonese romanisation and the plain-keyboard spelling an English speaker would type, and
  names every timer.
- Every file is 5 to 16 ingredient rows and 3 to 6 operations, or the work artifact says why not.
- No file uses an ingredient that cannot be bought in an ordinary supermarket or an ordinary Asian
  grocery. If one does, it is written up rather than committed — that constraint is the entire
  point of this story.
- `slack` appears only where the file can name a real failure. A file with no honest failure to
  name leaves the line off.
- `npm run check` passes for the whole collection.
- Only `recipes/**/*.cook` and `docs/active/work/T-007-03/**` are modified.
