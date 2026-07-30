/*
 * Two things are being checked here, and they are the two ways an icon set goes wrong.
 *
 * That the drawings are real: valid path data, inside the 24x24 box, stroke-only, and each
 * one carrying a word so nothing is condensed past legibility.
 *
 * That the mapping covers the collection: every distinct verb the 249 recipes actually open
 * an operation with gets a reading. The last test prints anything that falls through to the
 * plain bowl, so a verb that arrives with a new recipe says so by name instead of quietly
 * turning into a bowl on the page.
 */
import { describe, expect, it } from 'vitest';
import recipes from '../generated/recipes.json';
import {
  FALLBACK_ICON,
  icons,
  iconForAttention,
  iconForOperation,
  iconSvg,
  matchOperation,
  type IconName,
} from './icons.ts';
import type { RawRecipe } from './tree.ts';

const all = recipes as unknown as RawRecipe[];
const names = Object.keys(icons) as IconName[];

/** Every operation label in the collection, as it is drawn in a cell. */
const operationLabels = all.flatMap((recipe) =>
  recipe.steps.map((step) => step.labelOverride ?? step.rawLabel),
);

/** The word each operation opens with — the verb the icon has to answer to. */
const leadingVerbs = [...new Set(
  operationLabels
    .map((label) => label.trim().toLowerCase().match(/^[\p{L}]+(?:-[\p{L}]+)?/u)?.[0])
    .filter((verb): verb is string => Boolean(verb)),
)].sort();

/*
 * A path walker that follows the pen without solving any curves: it takes the endpoint of
 * every command and ignores how a curve bulges on its way there. That is enough to catch a
 * coordinate that has wandered out of the box, which is the mistake hand-written path data
 * actually makes, so the bounds it checks are the box plus a little slack for the bulges.
 */
const ARITY: Record<string, number> = {
  m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7, z: 0,
};

function endpoints(d: string): { x: number; y: number }[] {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/g) ?? [];
  const points: { x: number; y: number }[] = [];
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let command = '';
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i]!;
    if (/[a-zA-Z]/.test(token)) {
      command = token;
      i += 1;
      if (command.toLowerCase() === 'z') {
        x = startX;
        y = startY;
        points.push({ x, y });
        continue;
      }
    }
    if (!command) throw new Error(`path starts with a number: ${d}`);

    const lower = command.toLowerCase();
    const arity = ARITY[lower];
    if (arity === undefined) throw new Error(`unknown path command "${command}" in ${d}`);
    const args = tokens.slice(i, i + arity).map(Number);
    if (args.length < arity || args.some(Number.isNaN)) {
      throw new Error(`"${command}" is short of arguments in ${d}`);
    }
    i += arity;

    const relative = command === lower;
    if (lower === 'h') x = relative ? x + args[0]! : args[0]!;
    else if (lower === 'v') y = relative ? y + args[0]! : args[0]!;
    else {
      const [dx, dy] = lower === 'a'
        ? [args[5]!, args[6]!]
        : [args[arity - 2]!, args[arity - 1]!];
      x = relative ? x + dx : dx;
      y = relative ? y + dy : dy;
    }

    if (lower === 'm') {
      startX = x;
      startY = y;
      // A moveto with extra pairs is an implicit lineto, in the same relativity.
      command = relative ? 'l' : 'L';
    }
    points.push({ x, y });
  }
  return points;
}

describe('the icons themselves', () => {
  it('draws something for every name it declares', () => {
    expect(names.length).toBeGreaterThan(13);
    for (const name of names) {
      expect(icons[name].path.startsWith('M'), `${name} should start with a moveto`).toBe(true);
    }
  });

  it('gives every icon a word, because a glyph alone is not an answer', () => {
    for (const name of names) {
      expect(icons[name].label.trim().length, `${name} needs a label`).toBeGreaterThan(0);
    }
    const labels = names.map((name) => icons[name].label);
    expect(new Set(labels).size, 'two icons should not claim the same words').toBe(labels.length);
  });

  it('writes path data a browser can follow', () => {
    for (const name of names) {
      expect(() => endpoints(icons[name].path), name).not.toThrow();
      expect(endpoints(icons[name].path).length, name).toBeGreaterThan(1);
    }
  });

  it('stays inside the 24x24 box, so nothing is clipped at 16px', () => {
    for (const name of names) {
      for (const { x, y } of endpoints(icons[name].path)) {
        expect(x, `${name} runs off the side at x=${x}`).toBeGreaterThanOrEqual(-0.5);
        expect(x, `${name} runs off the side at x=${x}`).toBeLessThanOrEqual(24.5);
        expect(y, `${name} runs off the top or bottom at y=${y}`).toBeGreaterThanOrEqual(-0.5);
        expect(y, `${name} runs off the top or bottom at y=${y}`).toBeLessThanOrEqual(24.5);
      }
    }
  });

  it('carries no colour of its own — stroke only, so it inherits the ink', () => {
    for (const name of names) {
      const svg = iconSvg(name);
      expect(svg).toContain('viewBox="0 0 24 24"');
      expect(svg).toContain('stroke="currentColor"');
      expect(svg).toContain('fill="none"');
      expect(svg, `${name} should not name a colour`).not.toMatch(/#[0-9a-f]{3}|rgb\(/i);
      expect(svg, `${name} should not fill anything`).not.toMatch(/fill="(?!none)/);
    }
  });
});

describe('iconSvg', () => {
  it('is silent to a screen reader by default, because the word beside it is not', () => {
    const svg = iconSvg('oven');
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain('focusable="false"');
    expect(svg).not.toContain('aria-label');
  });

  it('takes an accessible name when the glyph has to stand on its own', () => {
    const svg = iconSvg('hourglass', { title: 'time you can walk away from' });
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="time you can walk away from"');
    expect(svg).not.toContain('aria-hidden');
  });

  it('escapes what it is given rather than letting it into the markup', () => {
    const svg = iconSvg('pot', { title: 'a "hot" <pot> & lid', className: 'a"b' });
    expect(svg).toContain('aria-label="a &quot;hot&quot; &lt;pot&gt; &amp; lid"');
    expect(svg).toContain('class="a&quot;b"');
  });

  it('sizes and thins on request', () => {
    const svg = iconSvg('flame', { size: 32, strokeWidth: 1.5 });
    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain('stroke-width="1.5"');
  });
});

describe('iconForAttention', () => {
  it('separates time you spend from time you merely wait out', () => {
    expect(iconForAttention('hands-on')).toBe('hand');
    expect(iconForAttention('unattended')).toBe('hourglass');
    expect(icons[iconForAttention('hands-on')].label).toBe('hands on');
  });
});

describe('iconForOperation', () => {
  it('reads the verb the cook wrote', () => {
    expect(iconForOperation('bake at 350°F')).toBe('oven');
    expect(iconForOperation('Preheat the oven to 350°F (175°C).')).toBe('oven');
    expect(iconForOperation('simmer 15 min')).toBe('pot');
    expect(iconForOperation('chill 4 hr, then invert')).toBe('fridge');
    expect(iconForOperation('Whisk  with , , and .')).toBe('whisk');
    expect(iconForOperation('knead 8 min')).toBe('hand');
    expect(iconForOperation('Chop , ,  to a gremolata.')).toBe('knife');
    expect(iconForOperation('purée until completely smooth')).toBe('blend');
    expect(iconForOperation('strain, then chill over ice')).toBe('strain');
    expect(iconForOperation('rise 1 hour')).toBe('rise');
    expect(iconForOperation('Line an 8x8-in pan with parchment.')).toBe('pan');
  });

  it('reads a hyphenated verb as one word', () => {
    expect(iconForOperation('stir-fry 3 min')).toBe('flame');
    expect(iconForOperation('egg-wash, salt, bake 450°F 14 min')).toBe('brush');
    expect(iconForOperation('blind bake 350°F (175°C) 20 min, weights out')).toBe('oven');
  });

  it('looks past a word that says nothing on its own', () => {
    expect(iconForOperation('cover, rise until doubled')).toBe('rise');
    expect(iconForOperation('cover, chill overnight')).toBe('fridge');
    expect(iconForOperation('Wrap  and chill for 1 hour.')).toBe('fridge');
    expect(iconForOperation('Heat the oven to 350°F and line a baking sheet.')).toBe('oven');
    expect(iconForOperation('add flour and salt, knead 10 min, rise 1 hour')).toBe('hand');
    // …and keeps its own reading when nothing better is said.
    expect(iconForOperation('top with mitsuba')).toBe('sprinkle');
    expect(iconForOperation('cover')).toBe('layer');
  });

  it('takes the conjugation a cook happens to write', () => {
    expect(iconForOperation('baked until dark')).toBe('oven');
    expect(iconForOperation('simmering, uncovered')).toBe('pot');
    expect(iconForOperation('chilled 8 hr')).toBe('fridge');
  });

  it('hands over a plain bowl rather than guessing', () => {
    expect(matchOperation('wibble the flumph')).toBeNull();
    expect(iconForOperation('wibble the flumph')).toBe(FALLBACK_ICON);
    expect(icons[FALLBACK_ICON]).toBeDefined();
  });

  it('never throws, whatever it is handed', () => {
    for (const label of ['', '   ', '—', '350°F', '1/4', '...', '~', 'ç']) {
      expect(() => iconForOperation(label), JSON.stringify(label)).not.toThrow();
      expect(names).toContain(iconForOperation(label));
    }
  });
});

describe('the collection', () => {
  it('has operations to look at', () => {
    expect(operationLabels.length).toBeGreaterThan(100);
    expect(leadingVerbs.length).toBeGreaterThan(50);
  });

  it('gives every operation in every recipe a real icon', () => {
    for (const label of operationLabels) {
      const name = iconForOperation(label);
      expect(names, `${JSON.stringify(label)} -> ${name}`).toContain(name);
    }
  });

  it('recognises every verb the recipes open an operation with', () => {
    const fellThrough = leadingVerbs.filter((verb) => matchOperation(verb) === null);
    if (fellThrough.length > 0) {
      console.log(
        `${fellThrough.length} verb(s) fall through to the ${FALLBACK_ICON}: ` +
        `${fellThrough.join(', ')}\n` +
        'Add them to VERB_ICONS in src/lib/icons.ts, or leave them here deliberately.',
      );
    }
    expect(fellThrough).toEqual([]);
  });

  it('does not lean on one icon for everything', () => {
    const used = new Set(operationLabels.map((label) => iconForOperation(label)));
    expect(used.size).toBeGreaterThan(12);
  });
});
