/*
 * A counter is where you would buy the thing if you were not making it, and its page is a
 * menu. Recipes sit at several counters, so this is a grouping over a many-to-many, not a
 * tree walk.
 */
import countersFile from '../data/counters.json';
import type { RawRecipe } from './tree.ts';

export interface Counter {
  name: string;
  slug: string;
  blurb: string;
  /** Fallback only: categories whose recipes land here when a file names no counter. */
  categories: string[];
  /**
   * The sections this counter's menu actually prints, in the order it prints them — Salsas
   * and Fillings, not "Sauces & Gravies". Extracted from the gap notes by
   * scripts/menu-sections.mjs; a counter without them falls back to grouping by category.
   */
  sections?: { title: string; items: string[] }[];
}

export const counters: Counter[] = (countersFile as { counters: Counter[] }).counters;

export const counterBySlug = new Map(counters.map((c) => [c.slug, c]));
export const counterByName = new Map(counters.map((c) => [c.name, c]));

/*
 * A menu item needs a line under its name, and the honest one is what is actually in it.
 * These are the things nobody reads a menu to find out about.
 */
const ASSUMED = [
  'water', 'salt', 'table salt', 'kosher salt', 'sea salt', 'fine sea salt',
  'black pepper', 'freshly ground black pepper', 'ground black pepper', 'white pepper',
  'ice', 'ice water', 'cold water', 'warm water', 'boiling water',
];

/** The three or four things a person would want to know are in it. */
export function principalIngredients(recipe: RawRecipe, limit = 4): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const step of recipe.steps) {
    for (const ingredient of step.ingredients) {
      const key = ingredient.name.toLowerCase();
      if (ASSUMED.includes(key) || seen.has(key)) continue;
      seen.add(key);
      out.push(ingredient.name);
      if (out.length === limit) return out;
    }
  }
  return out;
}

export interface MenuSection {
  title: string;
  items: RawRecipe[];
}

export interface Menu {
  counter: Counter;
  sections: MenuSection[];
  count: number;
}

/**
 * The menu for one counter.
 *
 * Where the counter names its own sections, those are used in the order given, because a
 * menu's order is part of what it says. Where it does not, we fall back to grouping by
 * category with the biggest group first — which reads like a directory, not a menu, and is
 * only ever a stopgap.
 *
 * **A section orders what a shelf already holds; it cannot put a recipe on one.** Membership
 * is the recipe's own `>> counters:` line and nothing else, so a slug listed here whose file
 * does not name this counter is a mistake in one of the two, and this throws with the slug
 * named. It used to be dropped instead — quietly, with the page still adding up, which is how
 * nine of them survived two stories.
 */
export function menuFor(counter: Counter, all: RawRecipe[]): Menu {
  const mine = all.filter((r) => r.counters.includes(counter.name));
  const bySlug = new Map(mine.map((r) => [r.slug, r]));

  if (counter.sections?.length) {
    /*
     * Two lookups, deliberately not one. Membership is decided against `mine`; the diagnostic
     * for a slug that fails is read off `all`, because "shelved at Takeout Counter" is the
     * sentence that tells someone which of the two files to fix.
     */
    const missing: string[] = [];
    const sections = counter.sections
      .map(({ title, items }) => ({
        title,
        items: items.flatMap((slug) => {
          const recipe = bySlug.get(slug);
          if (recipe) return [recipe];
          const elsewhere = all.find((r) => r.slug === slug);
          missing.push(
            `  "${title}" — ${slug} ` +
              (elsewhere
                ? `(shelved at ${elsewhere.counters.join(', ')})`
                : '(no recipe has that slug)'),
          );
          return [];
        }),
      }))
      .filter((section) => section.items.length > 0);

    if (missing.length) {
      throw new Error(
        `${counter.name} lists ${missing.length} recipe(s) that do not name this counter:\n` +
          `${missing.join('\n')}\n` +
          'A section orders what a shelf already holds; it cannot put a recipe on one.\n' +
          `Either add "${counter.name}" to that file's >> counters: line, or drop the slug\n` +
          'from src/data/counters.json. docs/knowledge/counters.md#sections says why.',
      );
    }

    // Anything the sections forgot still has to appear, or the menu quietly loses a dish.
    const placed = new Set(sections.flatMap((s) => s.items.map((r) => r.slug)));
    const rest = mine.filter((r) => !placed.has(r.slug));
    if (rest.length) sections.push({ title: 'Also', items: rest });

    return { counter, sections, count: mine.length };
  }

  const byCategory = new Map<string, RawRecipe[]>();
  for (const recipe of mine) {
    byCategory.set(recipe.category, [...(byCategory.get(recipe.category) ?? []), recipe]);
  }

  const sections = [...byCategory.entries()]
    .map(([title, items]) => ({
      title,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.items.length - a.items.length || a.title.localeCompare(b.title));

  return { counter, sections, count: mine.length };
}

/** Every counter with something on it, biggest first. */
export function menus(all: RawRecipe[]): Menu[] {
  return counters
    .map((counter) => menuFor(counter, all))
    .filter((menu) => menu.count > 0)
    .sort((a, b) => b.count - a.count || a.counter.name.localeCompare(b.counter.name));
}
