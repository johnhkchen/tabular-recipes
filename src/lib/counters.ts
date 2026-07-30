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
 * The menu for one counter: its recipes, grouped by category and ordered so the biggest
 * section leads, the way a menu puts what the place is known for at the top.
 */
export function menuFor(counter: Counter, all: RawRecipe[]): Menu {
  const mine = all.filter((r) => r.counters.includes(counter.name));
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
