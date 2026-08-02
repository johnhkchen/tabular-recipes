/*
 * One vocabulary of widths, enforced.
 *
 * S-004 splits the phone work across six tickets and five of them write media queries. The
 * comment block at the top of site.css says which two numbers they may write; this says it
 * again in a way that fails the build, because a convention nobody can break is the only kind
 * that survives six tickets.
 *
 * The set is read out of that comment block rather than repeated here, so the two cannot drift.
 *
 * This reads CSS with a regex, deliberately: parse5 is in node_modules only because Astro
 * depends on it, and reaching for it would be taking a dependency without saying so. Two things
 * the scan therefore cannot see — a width query arriving through @import, and one nested inside
 * @supports. Neither exists anywhere in this repository; if one ever does, this file is where
 * to notice it.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = new URL('..', import.meta.url).pathname;
const BLOCK = join(SRC, 'styles/site.css');

/* Files that can carry CSS: stylesheets, and the <style> blocks inside Astro components. */
function sources(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) sources(path, found);
    else if (entry.name.endsWith('.css') || entry.name.endsWith('.astro')) found.push(path);
  }
  return found;
}

/*
 * Comments come out first. The block above this file's subject writes `@media (max-width: …)`
 * inside a comment to explain itself, and a scan that counts prose finds breakpoints in the
 * documentation of breakpoints.
 */
function css(path: string): string {
  const text = readFileSync(path, 'utf8');
  const style = path.endsWith('.css')
    ? text
    : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  return style.replace(/\/\*[\s\S]*?\*\//g, '');
}

/*
 * Every (min-width: …) / (max-width: …) that sits in an @media *condition*. A width in an
 * ordinary declaration is not a breakpoint — `.recipe-table { min-width: 30rem }` is the table
 * saying how narrow it can be drawn, and `.masthead p { max-width: 34rem }` is a line length.
 */
function widthQueries(text: string): { value: string; feature: string }[] {
  const out: { value: string; feature: string }[] = [];
  for (const media of text.matchAll(/@media([^{]+)\{/g)) {
    for (const feature of media[1].matchAll(/\(\s*(min|max)-width\s*:\s*([^)]+?)\s*\)/g)) {
      out.push({ feature: `${feature[1]}-width`, value: feature[2] });
    }
  }
  return out;
}

/* The block's own declaration lines: "  snug     max-width: 44rem   [reserved]  …" */
function named(): { name: string; value: string; inUse: boolean }[] {
  const block = readFileSync(BLOCK, 'utf8');
  const lines = [...block.matchAll(/^\s*\*\s+(\w+)\s+max-width:\s*([\d.]+rem)\s+\[(in use|reserved)\]/gm)];
  return lines.map((m) => ({ name: m[1], value: m[2], inUse: m[3] === 'in use' }));
}

const breakpoints = named();
const allowed = new Set(breakpoints.map((b) => b.value));
const files = sources(SRC).map((path) => ({ path, queries: widthQueries(css(path)) }));

describe('the breakpoint block at the top of site.css', () => {
  it('declares a set that can be read back out of it', () => {
    expect(breakpoints.length).toBeGreaterThan(0);
    expect(breakpoints.map((b) => b.name)).toEqual(['snug', 'narrow']);
    expect([...allowed]).toEqual(['44rem', '34rem']);
  });

  it('marks as [in use] only the names something actually writes', () => {
    const written = new Set(files.flatMap((f) => f.queries).map((q) => q.value));
    for (const bp of breakpoints) {
      if (bp.inUse) {
        expect(written, `${bp.name} is tagged [in use] but no media query writes ${bp.value}`)
          .toContain(bp.value);
      }
    }
  });
});

describe('every width query in the codebase', () => {
  const all = files.flatMap((f) => f.queries.map((q) => ({ ...q, path: f.path })));

  it('finds the queries there are to find', () => {
    /* A guard on the scan itself: if this drops to zero, the regex broke, not the CSS. */
    expect(all.length).toBeGreaterThan(0);
  });

  it.each(files.filter((f) => f.queries.length > 0).map((f) => f.path))(
    'writes only a named breakpoint — %s',
    (path) => {
      const file = files.find((f) => f.path === path)!;
      for (const q of file.queries) {
        expect(
          allowed,
          `${path} writes (${q.feature}: ${q.value}). The set is ${[...allowed].join(' and ')}, ` +
            `declared at the top of src/styles/site.css. Use one of those, or change the block ` +
            `and say why. (If this is b28-clay.css, the kit is vendored from b28.dev — reconcile ` +
            `there rather than here.)`,
        ).toContain(q.value);
      }
    },
  );
});
