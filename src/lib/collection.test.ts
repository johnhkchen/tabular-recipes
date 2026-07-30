/*
 * Invariants that only hold across the whole collection, and that no single .cook file can
 * be checked for on its own. scripts/parse-recipes.mjs enforces most of them while it
 * builds; these tests are what stops the enforcement itself from quietly regressing.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import countersFile from '../data/counters.json';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const counterNames = new Set(countersFile.counters.map((c) => c.name));
const bySlug = new Map(all.map((r) => [r.slug, r]));

describe('the collection', () => {
  it('has a recipe at all', () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it('gives every recipe a unique slug, because the slug is the URL', () => {
    expect(bySlug.size).toBe(all.length);
  });

  it('leaves no recipe without a counter', () => {
    const homeless = all.filter((r) => r.counters.length === 0).map((r) => r.slug);
    expect(homeless).toEqual([]);
  });

  it('only names counters that exist', () => {
    const unknown = all.flatMap((r) => r.counters.filter((c) => !counterNames.has(c)));
    expect([...new Set(unknown)]).toEqual([]);
  });
});

describe('pairings', () => {
  it('point at recipes that are here', () => {
    const dangling = all.flatMap((r) => r.pairsWith.filter((slug) => !bySlug.has(slug)));
    expect([...new Set(dangling)]).toEqual([]);
  });

  it('are mutual, whether or not both files said so', () => {
    const oneWay: string[] = [];
    for (const recipe of all) {
      for (const other of recipe.pairsWith) {
        if (!bySlug.get(other)?.pairsWith.includes(recipe.slug)) {
          oneWay.push(`${recipe.slug} -> ${other}`);
        }
      }
    }
    expect(oneWay).toEqual([]);
  });

  it('never pair a recipe with itself', () => {
    expect(all.filter((r) => r.pairsWith.includes(r.slug)).map((r) => r.slug)).toEqual([]);
  });
});

describe('equipment variants', () => {
  it('agree with their siblings about which dish they are', () => {
    for (const recipe of all) {
      for (const variant of recipe.variants) {
        expect(bySlug.get(variant.slug)?.dish, `${variant.slug} vs ${recipe.slug}`).toBe(recipe.dish);
      }
    }
  });

  it('leave at most one plain way to cook a dish', () => {
    const plainPerDish = new Map<string, string[]>();
    for (const recipe of all.filter((r) => !r.kit)) {
      plainPerDish.set(recipe.dish, [...(plainPerDish.get(recipe.dish) ?? []), recipe.slug]);
    }
    const ambiguous = [...plainPerDish.entries()].filter(([, slugs]) => slugs.length > 1);
    expect(ambiguous).toEqual([]);
  });
});

describe('the timeline data', () => {
  it('never claims four unbroken hours of your attention', () => {
    // If it does, either a timer needs a name or an operation label needs fixing.
    const suspect = all.flatMap((r) =>
      r.steps.flatMap((s) =>
        s.timers
          .filter((t) => t.attention === 'hands-on' && (t.minutes ?? 0) >= 240)
          .map((t) => `${r.slug}: ${t.text}`),
      ),
    );
    expect(suspect).toEqual([]);
  });

  it('reads a duration off every timer it found', () => {
    const unreadable = all.flatMap((r) =>
      r.steps.flatMap((s) => s.timers.filter((t) => t.minutes === null).map((t) => `${r.slug}: ${t.text}`)),
    );
    expect(unreadable).toEqual([]);
  });
});
