/*
 * The bridge between cooklang and the table: parses one .cook file and flattens it to
 * the plain shape src/lib/tree.ts expects. The only place the WASM parser is touched,
 * shared by the build (parse-recipes.mjs) and the checker (check-recipes.mjs).
 */
import { Parser } from '@cooklang/cooklang';

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

  for (const section of recipe.sections ?? []) {
    for (const content of section.content ?? []) {
      if (content.type !== 'step') continue;
      const items = content.value.items ?? [];
      const index = steps.length;

      const ingredients = [];
      const refs = [];
      for (const item of items) {
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
        });
      }

      steps.push({
        index,
        rawLabel: stripIngredients(items, recipe),
        labelOverride: metadata[`step.${index + 1}`] ?? null,
        ingredients,
        refs,
      });
    }
  }

  const title = metadata.title ?? titleCase(slug);
  const category = metadata.category ?? (folder ? titleCase(folder) : 'Other');
  const tags = (metadata.tags ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // Authoring directives and things with their own field are not recipe facts.
  for (const key of Object.keys(metadata)) {
    if (/^step\.\d+$/.test(key) || key === 'title' || key === 'category' || key === 'tags') {
      delete metadata[key];
    }
  }

  return {
    slug,
    path: relPath,
    title,
    category,
    tags,
    ingredientNames: [...ingredientNames].sort(),
    metadata,
    steps,
    warnings: (recipe.warnings ?? []).map(String),
  };
}
