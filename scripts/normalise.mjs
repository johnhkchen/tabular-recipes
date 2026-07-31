/*
 * The bridge between cooklang and the table: parses one .cook file and flattens it to
 * the plain shape src/lib/tree.ts expects. The only place the WASM parser is touched,
 * shared by the build (parse-recipes.mjs) and the checker (check-recipes.mjs).
 */
import { Parser } from '@cooklang/cooklang';
import { splitList } from '../src/lib/meta.ts';
import { readSlack } from '../src/lib/slack.ts';
import { minutesOf, readTimers } from '../src/lib/time.ts';

/* ---- quantity formatting -------------------------------------------------- */

function fmtNumber(n) {
  if (n == null) return '';
  if (n.type === 'fraction') {
    const { whole, num, den } = n.value;
    const frac = num ? `${num}/${den}` : '';
    return [whole || '', frac].filter(Boolean).join(' ') || '0';
  }
  const x = typeof n.value === 'number' ? n.value : Number(n.value);
  if (!Number.isFinite(x)) return '';
  return Number.isInteger(x) ? String(x) : String(Math.round(x * 1000) / 1000);
}

function fmtValue(v) {
  if (v == null) return '';
  if (v.type === 'text') return String(v.value);
  if (v.type === 'range') return `${fmtNumber(v.value?.start)} to ${fmtNumber(v.value?.end)}`;
  if (v.type === 'number') return fmtNumber(v.value);
  return '';
}

/*
 * Spelled-out units take an -s when there is more than one; abbreviations never do, which
 * is why tsp, Tbs, oz, lb, g and mL are deliberately absent. Written-out unit names that
 * are really descriptions ("large", "medium") are absent for the same reason.
 */
const PLURALISED = new Set([
  'cup', 'clove', 'sprig', 'stalk', 'slice', 'can', 'ear', 'head', 'sheet', 'strip',
  'piece', 'pod', 'stick', 'tablespoon', 'teaspoon', 'pound', 'ounce', 'quart', 'pint',
  'gallon', 'bunch', 'handful', 'pinch', 'drop', 'dash', 'wedge', 'rib', 'fillet', 'link',
  'square', 'packet', 'bulb', 'thigh', 'breast', 'wing', 'shell', 'knob', 'jar', 'bottle',
]);
const IRREGULAR = { leaf: 'leaves', loaf: 'loaves', half: 'halves' };

/** The biggest number in a quantity, so "2 to 3 cups" pluralises and "1 cup" does not. */
function numericOf(v) {
  if (v == null) return null;
  if (v.type === 'range') return numericOf({ type: 'number', value: v.value?.end });
  if (v.type !== 'number') return null;
  const n = v.value;
  if (n?.type === 'fraction') {
    const { whole = 0, num = 0, den = 1 } = n.value ?? {};
    return whole + (den ? num / den : 0);
  }
  return typeof n?.value === 'number' ? n.value : null;
}

function pluralise(unit, value) {
  const count = numericOf(value);
  if (count === null || count <= 1) return unit;
  const lower = unit.toLowerCase();
  if (IRREGULAR[lower]) return IRREGULAR[lower];
  return PLURALISED.has(lower) ? `${unit}s` : unit;
}

export function fmtQuantity(q) {
  if (!q) return '';
  const value = fmtValue(q.value);
  if (!q.unit) return value;
  const unit = pluralise(q.unit, q.value);
  // "350°F" and "50%" close up; "4 oz" and "1/4 tsp" keep the space.
  const joiner = /^[^\p{L}]/u.test(unit) ? '' : ' ';
  return [value, unit].filter(Boolean).join(value ? joiner : '');
}

/*
 * A step with its ingredients removed is the raw material for the cell label: "Fold in
 * @flour{}, @cocoa{} to @&(~1)batter{}" becomes "Fold in , , and to .". Cookware,
 * temperatures and timers stay, because that is what a cook needs to read in the cell.
 * cleanLabel() in src/lib/label.ts does the tidying — it is pure, so it is tested.
 */
function stripIngredients(items, recipe) {
  let text = '';
  for (const item of items) {
    if (item.type === 'text') text += item.value;
    else if (item.type === 'cookware') text += recipe.cookware?.[item.index]?.name ?? '';
    else if (item.type === 'timer') text += fmtQuantity(recipe.timers?.[item.index]?.quantity);
    else if (item.type === 'inlineQuantity') text += fmtQuantity(recipe.inline_quantities?.[item.index]);
  }
  return text;
}

const titleCase = (slug) =>
  slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * @param {string} source  contents of a .cook file
 * @param {{slug: string, path: string, folder?: string}} where
 */
export function normalise(source, { slug, path: relPath, folder }) {
  const parser = new Parser();
  const result = parser.parse_full(source, true);
  const payload = typeof result === 'string' ? result : (result.value ?? result);
  const recipe = typeof payload === 'string' ? JSON.parse(payload) : payload;

  const metadata = { ...(recipe.raw_metadata?.map ?? {}) };
  const steps = [];
  const ingredientNames = new Set();
  const cookware = new Set();

  for (const section of recipe.sections ?? []) {
    for (const content of section.content ?? []) {
      if (content.type !== 'step') continue;
      const items = content.value.items ?? [];
      const index = steps.length;

      const ingredients = [];
      const refs = [];
      const timers = [];
      /*
       * The operation these timers belong to, so an unnamed "3 hr" in a braise is not
       * mistaken for three hours of standing there. Read the override when there is one:
       * the raw text of a step whose label was overridden is usually mangled, which is
       * exactly why it was overridden.
       *
       * Read once the step is whole, not timer by timer as they come: a step with two of
       * them — "knead 8 min, then rise 2 hours" — is two operations in one sentence, and
       * each timer may only answer for its own half. See readTimers().
       */
      const rawLabel = stripIngredients(items, recipe);
      const labelOverride = metadata[`step.${index + 1}`] ?? null;
      const operationLabel = labelOverride ?? rawLabel;

      for (const item of items) {
        if (item.type === 'cookware') {
          const name = recipe.cookware?.[item.index]?.name;
          if (name) cookware.add(name);
          continue;
        }
        if (item.type === 'timer') {
          const timer = recipe.timers?.[item.index];
          if (timer) {
            timers.push({
              name: timer.name ?? null,
              text: fmtQuantity(timer.quantity),
              minutes: minutesOf(numericOf(timer.quantity?.value), timer.quantity?.unit ?? null),
            });
          }
          continue;
        }
        if (item.type !== 'ingredient') continue;
        const ing = recipe.ingredients[item.index];
        const relation = ing.relation?.relation;
        // An intermediate reference (@&(~1)x{}) is an edge to another step, not an ingredient.
        if (relation?.type === 'reference' && ing.relation?.reference_target === 'step') {
          refs.push(relation.references_to);
          continue;
        }
        const quantity = fmtQuantity(ing.quantity);
        ingredientNames.add(ing.name.toLowerCase());
        ingredients.push({
          name: ing.name,
          quantity,
          note: ing.note ?? null,
          display: [quantity, ing.note ? `(${ing.note})` : '', ing.name].filter(Boolean).join(' '),
          /*
           * The same amount as a number, so a shopping list can add two recipes together.
           * `quantity` above is for reading; this is for arithmetic. A range gives its top
           * end, because the point of the number is knowing how much to buy.
           */
          amount: {
            value: numericOf(ing.quantity?.value),
            unit: ing.quantity?.unit ?? null,
          },
        });
      }

      for (const [i, reading] of readTimers(timers, operationLabel).entries()) {
        Object.assign(timers[i], reading);
      }

      steps.push({
        index,
        rawLabel,
        labelOverride,
        ingredients,
        refs,
        timers,
      });
    }
  }

  const title = metadata.title ?? titleCase(slug);
  const category = metadata.category ?? (folder ? titleCase(folder) : 'Other');
  const tags = splitList(metadata.tags).map((t) => t.toLowerCase());

  /*
   * A dish can be cooked more than one way — a braise and its pressure-cooker version are
   * two files with two different trees. `dish` is what they have in common; `kit` is the
   * equipment that makes this one different. A file with no kit is the plain way to do it.
   */
  const dish = metadata.dish ?? slug;
  const kit = metadata.kit ?? null;

  /*
   * How much room the recipe leaves you. Authored, never worked out from the timers — a
   * five-minute custard is less forgiving than a six-hour braise. A line that is there but
   * not whole reads as no slack at all and hands back the reason why, which check-recipes
   * prints and parse-recipes throws on, so a half-declared field never reaches a page.
   */
  const { slack, problem: slackProblem } = readSlack(metadata.slack);

  // Authoring directives and anything promoted to its own field are not recipe facts.
  const PROMOTED = new Set([
    'title', 'category', 'tags', 'counters', 'dish', 'kit', 'aka', 'pairs-with', 'slack',
  ]);
  for (const key of Object.keys(metadata)) {
    if (/^step\.\d+$/.test(key) || PROMOTED.has(key)) delete metadata[key];
  }

  return {
    slug,
    path: relPath,
    title,
    category,
    tags,
    // Filled in from src/data/counters.json when the file names none.
    counters: splitList(recipe.raw_metadata?.map?.counters),
    dish,
    kit,
    /** `>> slack: forgiving — an extra hour in the pot changes little`, or null. */
    slack,
    slackProblem,
    /*
     * What people call it when they order it. A cook looking for the pâté in their bánh mì
     * does not know to search for "pork liver pâté", so the menu vocabulary has to be
     * searchable too.
     */
    aka: splitList(recipe.raw_metadata?.map?.aka),
    pairsWith: splitList(recipe.raw_metadata?.map?.['pairs-with']),
    ingredientNames: [...ingredientNames].sort(),
    cookware: [...cookware].sort(),
    metadata,
    steps,
    warnings: (recipe.warnings ?? []).map(String),
  };
}
