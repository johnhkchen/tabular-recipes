# What the site still does badly on a phone

Not a counter page. Every other file in this directory is about what one shelf is missing; this
one is about what the *site* is missing when you open it on the thing most people will open it
on.

Written at the end of S-004, after six tickets took the site from **two** width queries to
**thirteen** — ten in `src/styles/site.css`, one each in `list.astro`, `AddToPlan.astro` and
`CookModes.astro`, and all of them one of the two numbers named at the top of `site.css`.

Everything below was measured in a headless Chrome against the built site, at 375px (the
narrowest phone still in real use), 390px (the common modern one) and 768px (a tablet in
portrait). The commands are in `package.json` under `verify:mobile`.

**Ranked by what it costs a person holding a phone**, not by how hard it is to fix. Each entry
says what happens, where, the measurement, what a fix would take, and whether what is there now
is a *mitigation* or a *cure*. Some of these are real and hard; saying so plainly is the point,
so that the next pass starts from an honest list instead of re-deriving it.

---

## 1. A tablet in portrait gets the mouse drawing

**What happens.** Every touch rule in the site is written under `max-width: 34rem`. At 768px —
an iPad in portrait, a touchscreen with no mouse anywhere near it — none of them apply. The
whole page reverts to targets sized for a pointer.

**Measured at 768px:**

| control | height |
| --- | --- |
| `.chips a` — the counter a dish came from | 15px |
| `.to-list` — "See the list" | 21.1px |
| `.back` — "← all counters" | 24px |
| `.source summary` | 24px |
| `.site-bar a` — "Your list", on every page | 24.5px |
| `.clay-button.toggle` — "Add to the list" | 34.7px |
| `.mode` — the Table / Prep / Cook switch | 40px |
| `label.tick` — a step in the prep view | 42.8px |

**What a fix takes.** S-004 chose *width* as the axis, and every ticket followed it. The truer
test is the input: `@media (pointer: coarse)`. T-004-05 considered it and rejected it for two
stated reasons — it introduces a second vocabulary into a file whose whole criterion was not
having one, and it lies to a desktop with a touchscreen. Both hold. Changing the axis is a
story-level decision, not a stylesheet edit: it would mean every 44px rule in six files moving
from a width query to an input query, or being duplicated in both.

**Mitigation or cure:** neither. This is untouched ground, and it is first on the list because it
is a whole class of device, not a corner of one page.

---

## 2. A seven-column recipe still hides four columns behind a sideways scroll

**What happens.** `miso-ramen` at 375px draws its 7 columns into a table **565px** wide, inside a
box **327px** wide. The ingredient column is pinned and the operations scroll under it; the table
says so with a fading edge and a line of text. You can read it. You cannot see it.

**Measured at 375px**, both sides built and measured the same way — before is the site as it
stood at `02b65e8`, the commit S-004 started from:

| recipe | before | after | |
| --- | --- | --- | --- |
| `miso-ramen` | 332px | **238px** | −28% |
| `pastrami` | 327px | **231px** | −29% |
| `beef-stew-slow-cooker` | 269px | **184px** | −32% |
| `conchas` | 161px | **0px** | it fits now |

Better by roughly a third, and still four columns you have to go and find.

**Say it plainly: the sticky column is a mitigation, not a cure.** It fixes the *worst* thing
about a wide table on a narrow screen — losing which row you are reading — and it does not make
the table fit. Nothing makes a 7-column merge tree fit in 375px while it is still a table, and
S-004's founding decision was that it stays a table, because the shape is the information. 23 of
658 recipes are 7 columns; 496 are five or wider.

**What a fix would take.** Not a fix — a different product for a narrow screen. A column the
reader can fold, or a two-finger zoom that keeps the pinned column, or drawing the merge tree
vertically instead of horizontally. All three are new designs, and each risks the thing S-004
protected: a mobile layout that dissolves the table has removed the site and left a recipe app.

**Mitigation or cure:** mitigation, deliberately.

---

## 3. The clock at an extreme ratio is one bar and three slivers

**What happens.** A recipe whose steps span 5 days and 20 minutes has to draw both on one axis.
The long one takes the axis; the short ones sit at the 11px floor with no room for a label.

**Measured at 375px:**

| recipe | total | the axis |
| --- | --- | --- |
| `pastrami` | 5 days 10 hr | 285.9px "5 days", then 11px, 14.3px, 11px — three unlabelled |
| `beef-stew-slow-cooker` | 8 hr 45 min | 11px, 295.8px "8 hr", 15.4px |
| `tonkotsu-broth` | 9 hr 30 min | 17px, 271.3px "8 hr", 33.9px "1 hr" |

**It is not a width problem.** `pastrami` still has an 11px stretch in a 768px window and would
in a 1440px one. It is a ratio problem: 5 days against 20 minutes is 360:1, and no axis draws
that legibly at any width.

**The mitigation is real.** Every row underneath prints its own duration and its own start
(`Timeline.astro:340–358`), so no step's length is only on the axis. Nothing is lost; it is just
not *drawn*.

**What a fix would take.** A broken axis — a visible cut through the long wait, the way a bar
chart breaks a scale — or a log axis, which would misstate the one thing the drawing is for. The
first is honest and is real work; the second is worse than what is there.

**Mitigation or cure:** mitigation, and the honest kind.

---

## 4. "Press `/` to search 658 recipes", on a device with no keyboard

**What happens.** The front door's tally offers a keyboard shortcut, in a real `<kbd>`, to a
phone. It is the first line under the search box on the first page anyone sees.

**Where.** `src/pages/index.astro:48`, and the script at `:105` writes the same sentence back
whenever the query is cleared — so it is in two places, and a CSS-only fix would be undone the
first time someone empties the box.

**What a fix takes.** Split the sentence in the markup and in the script so the shortcut is its
own element, hide that element at `narrow`, and choose the words a phone should read instead.
The last part is the real work: it is a front-page line, and the site's voice is deliberate about
what a visitor is told to do.

**Mitigation or cure:** neither; untouched. T-004-01 owned the shell and the finder, found this,
and recorded it as copy rather than layout. That judgement is kept here.

---

## 5. The two variant links are 24px apart, not on separate lines

**What happens.** "Also written for *Instant Pot*, *Slow Cooker*." is a sentence, and the two
links in it are neighbours. Both are 44px tall. On a phone they now sit 24.2px apart, up from
6.6px — enough to aim between, not enough to be separate things.

**Where.** `src/pages/[slug].astro:82–91`; the spacing rule is `site.css`, in the `narrow` block
under the recipe page's trimmings.

**What a fix takes.** The sentence becoming a list — which is markup, and markup changes the
desktop, which S-004 forbade and T-004-06's criteria forbade again. Whoever lifts that
constraint gets a clean fix; until then the spacing is what there is.

**Mitigation or cure:** mitigation. It is on the switch that decides whether you are cooking a
dish in a pot, an Instant Pot or a slow cooker, which is why it is on this list at all.

---

## 6. The shopping list's pack hint cannot be reached by a thumb

**What happens.** A line that says "part of a pack" carries the detail — *"this uses most of one
— a 2 lb bag"* — in a `title` attribute. A `title` is a hover affordance, and a phone has no
hover. On paper it prints; on a phone it is unreachable.

**Where.** `src/pages/list.astro`, the `.scale` button's `title`.

**What a fix takes.** Putting the phrase on the row costs a line per item on a page that is
already 6 694px long at 375px with seven recipes on it. Putting it in `.from` mixes two unrelated
notes. Neither is obviously right, which is why it is still here.

**Mitigation or cure:** neither. T-004-05 called this the one thing on that page a phone still
cannot get at, and it is still true.

---

## 7. Sixty-three lines of stylesheet that style nothing

**What happens.** Every phone downloads rules for markup no page emits.

| block | lines | what it styles |
| --- | --- | --- |
| `.filters` / `.filter` / `.filter--clear` | `site.css:300–340`, 41 lines | a pressable shelf label — *"Pressed means showing only this"* |
| `.shelf-group` and descendants | `site.css:720–741`, 22 lines | a titled group of cards |

Confirmed twice: zero occurrences of either in the 682-page build, and no mention in any `.astro`
file. Found by T-004-01, re-confirmed by T-004-03, left by both.

**Why it is still here.** The choice is not "delete or keep". It is **does the front door get a
filter row?** — 21 counters and a search box, and no way to say "only the ones I can cook
tonight". Deleting the CSS answers that question silently, in the wrong direction. Building the
row is a feature.

**What a fix takes.** One decision, then either 63 lines deleted or a control built. Recorded
here with the line numbers so the next person makes that decision once rather than re-deriving
it a third time.

**What it costs, measured.** 12 rules survive into the built stylesheet: 1 264 bytes minified,
and **178 bytes gzipped** out of the 3 501 the whole sheet comes to. So it is 5% of one file, on
one request, once. Real, and small.

**Mitigation or cure:** neither. Costs bytes, not usability, which is why it is seventh and not
first.

---

## 8. A 32px band where the widest tables scroll unpinned

**What happens.** Between 705px and 735px, the two 7-column recipes travel up to 14px sideways
with the ingredient column no longer pinned — the pinning stops at `44rem` (704px) and the table
does not actually fit until about 736px.

**Measured:** `miso-ramen` 27px of travel at 704px (pinned), 14px at 720px (not pinned), 0 at
736px. `pastrami`: 22px, 9px, 0.

**Why it is left.** Moving `snug` to 46rem recovers those 14px and, in exchange, applies the
phone cell floor and the pinned column to a 736px window — restyling a band nobody has read a
recipe in, to fix a scroll too short to hide a column. The arithmetic is now corrected in the
breakpoint block at the top of `site.css`, so the next reader finds the measured number.

**Mitigation or cure:** neither needed, probably. Listed because it is the one place the
stylesheet's stated intent and the browser's behaviour do not line up, and a reader who finds
that on their own should find it written down first.

---

## 9. The shared kit has no touch floor of its own

**What happens.** `.clay-button` from `b28-clay.css` is 41.4px — sized by `padding: 0.7em 1.4em`
with nothing underneath it. Every consumer of the kit that wanted a thumb had to write its own
floor: `AddToPlan.astro`, `CookModes.astro`, and now `site.css` for everything else.

**Where the fix belongs.** Not here. `src/styles/b28-clay.css` is **vendored** from
`https://b28.dev/kit/b28-clay.css` and re-synced by `just sync-kit`; a local edit is lost at the
next sync and desynchronises the other frontends built on the same kit. If the kit should carry a
44px floor at narrow widths, that is a change at b28.dev, and it would benefit every site that
vendors it.

**Mitigation or cure:** worked around, three times, in three files.

---

## What is not on this list, because S-004 fixed it

So the ranking above is read as *what is left*, not as *what is wrong*.

- **Nothing scrolls sideways.** 682 pages × three widths = 2046 page views, clean. The `<body>`
  does not move on any page at any of the three widths, and the one surface that must scroll —
  the table — does it inside `.table-scroll`, which is the pattern the whole story is built on.
- **Every interactive element is 44px on a phone.** Checked across the whole build at 375px and
  390px, not sampled, by `scripts/check-touch.mjs`.
- **The ingredient column stays put** while the operations scroll, on every recipe, including a
  20-row `biryani` and a 7-column `miso-ramen`.
- **The table says when it continues past the edge**, and only when it does.
- **The front door is a third shorter** on a phone; the menus, deliberately, are not.
- **The clock says something true at 375px** — durations, per row, always.
- **The shopping list is usable standing up**: name first, aisle heading stuck to the top, every
  row a thumb's height.
- **The 404 page** — which no ticket owned — was read, and its one button raised to 44px.

## What the automated net does not catch

`npm run verify:mobile` runs two browser checks over the whole build: no sideways scroll, and
every target 44px plus the table's three narrow-width promises. It does **not** watch:

- the aisle heading staying stuck while its aisle lasts;
- a crossed-off cell staying opaque while the operations scroll under it;
- the edge cue's gradient actually being drawn;
- the front door's teaser staying hidden.

All four are visual, and asserting them costs more than it protects. A green `verify:mobile` is
not "the phone layout is correct"; it is "the four things that can be checked are still true".

Two more things it cannot do, worth knowing before trusting a green run:

- **Nothing runs it for you.** It needs a browser, which is why it is not inside `npm run verify`
  — that command has to keep working on a machine without Chrome. So the net catches a
  regression when someone asks it to and not before.
- **The desktop-unchanged proof is a procedure, not a check.** It needs two builds and a git
  worktree. The method is written out in T-004-06's review; nothing in the repository runs it.
