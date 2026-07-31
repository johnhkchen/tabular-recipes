/*
 * The symbols the table and the timeline use to say a thing in less space.
 *
 * Two rules hold the whole file up:
 *
 * 1. A symbol never replaces a word. Every icon carries a `label`, and iconSvg() is
 *    aria-hidden by default because the assumption is that the word is sitting right next
 *    to it. When a glyph really must stand alone, pass a title and it becomes the
 *    accessible name. A cook should never have to decode a picture.
 * 2. A symbol never invents information. iconForOperation() reads the verb the cook
 *    actually wrote; when it recognises nothing it returns the plain bowl rather than
 *    guessing at a method. matchOperation() returns null in that case, so a caller — or a
 *    test — can tell a real reading from the fallback.
 *
 * Drawing rules: 24x24 viewBox, stroke only, no fills, no fine detail. Everything is
 * drawn so it still reads at 16px with round caps and joins, lit from the top left.
 */
import type { Attention } from './time.ts';

export type IconName =
  | 'oven'
  | 'flame'
  | 'grill'
  | 'pot'
  | 'fridge'
  | 'freezer'
  | 'bowl'
  | 'stir'
  | 'whisk'
  | 'fold'
  | 'knife'
  | 'hand'
  | 'roll'
  | 'blend'
  | 'strain'
  | 'pour'
  | 'sprinkle'
  | 'brush'
  | 'spread'
  | 'layer'
  | 'pan'
  | 'rise'
  | 'rest'
  | 'hourglass'
  | 'thermometer';

export interface Icon {
  /** The `d` of a single <path>. Several subpaths, stroked, never filled. */
  path: string;
  /** What it means, in words. Never optional: the picture is the shorthand, not the point. */
  label: string;
}

/** What an unrecognised operation gets: a bowl, which says "do this to these" and no more. */
export const FALLBACK_ICON: IconName = 'bowl';

export const icons: Record<IconName, Icon> = {
  // A box with its door line, two dials and a window.
  oven: {
    path: 'M5 3.5h14a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Z M3.5 8.5h17 M6.5 6h.01 M9.5 6h.01 M7.5 11.5h9v6h-9Z',
    label: 'oven',
  },
  // One flame: the stove, a hot pan, anything with direct heat under it.
  flame: {
    path: 'M12 21c3.3 0 6-2.6 6-5.8 0-2.4-1.2-4.2-2.8-5.8-.3 1.3-1.1 2-2 2.2 1-3.4-.4-6.4-2.2-8.6.2 2.6-1.3 4-2.8 5.6C6.9 10.1 6 12 6 15.2 6 18.4 8.7 21 12 21Z',
    label: 'stovetop',
  },
  // A grate with heat under it.
  grill: {
    path: 'M3.5 8.5h17 M3.5 12.5h17 M5.5 8.5v4 M12 8.5v4 M18.5 8.5v4 M8 20.5c0-1.4 1.3-1.8 1.3-3.2 M14.7 20.5c0-1.4 1.3-1.8 1.3-3.2',
    label: 'grill',
  },
  // A pot with handles, a lid line and two wisps: anything wet and hot.
  pot: {
    path: 'M4 9.5h16v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9.5Z M2.5 9.5h19 M2.5 11.5h1.5 M20 11.5h1.5 M8.5 5.5c0 1.2-1.2 1.4-1.2 2.4 M12 4c0 1.4-1.2 1.6-1.2 2.6 M15.5 5.5c0 1.2-1.2 1.4-1.2 2.4',
    label: 'pot',
  },
  fridge: {
    path: 'M6.5 2.5h11a1.5 1.5 0 0 1 1.5 1.5v15.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V4a1.5 1.5 0 0 1 1.5-1.5Z M5 9h14 M8.5 5.5v2 M8.5 11.5v2.5',
    label: 'fridge',
  },
  // A snowflake, trimmed to three bars and two chevrons so it survives 16px.
  freezer: {
    path: 'M12 2.5v19 M4.2 7 19.8 17 M19.8 7 4.2 17 M9 5.2 12 8.2l3-3 M9 18.8 12 15.8l3 3',
    label: 'freezer',
  },
  bowl: {
    path: 'M2.5 11h19a9.5 9.5 0 0 1-19 0Z',
    label: 'bowl',
  },
  // The same bowl with a spoon in it, so the family reads as one set.
  stir: {
    path: 'M2.5 11h19a9.5 9.5 0 0 1-19 0Z M18.5 3.5 11.5 14.5',
    label: 'stir',
  },
  whisk: {
    path: 'M12 2.5v5.4 M12 7.9c-2.8 1.8-4.5 4.9-4.5 8a4.5 4.5 0 0 0 9 0c0-3.1-1.7-6.2-4.5-8Z M12 7.9v12.5',
    label: 'whisk',
  },
  // An arc coming over the top and turning down into the bowl.
  fold: {
    path: 'M19.5 15.5a7.5 7.5 0 0 0-15 0 M2.4 13.4 4.5 15.5l2.1-2.1 M4 20.5h16',
    label: 'fold in',
  },
  // Blade, handle, board.
  knife: {
    path: 'M3.5 6h11.5v6.5a2 2 0 0 1-2 2H3.5Z M15 8h5a1.6 1.6 0 0 1 0 3.2h-5 M4 18.5h16',
    label: 'knife work',
  },
  // Four fingers and a palm: time you have to be standing there.
  hand: {
    path: 'M6.5 14V7.5a2 2 0 0 1 4 0V4.5a2 2 0 0 1 4 0v3a2 2 0 0 1 4 0v6.5a6 6 0 0 1-12 0Z',
    label: 'hands on',
  },
  // A pin over a sheet of dough.
  roll: {
    path: 'M6.5 6.5h11a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 11.5V8a1.5 1.5 0 0 1 1.5-1.5Z M5 9.7H2 M19 9.7h3 M4 17.5c2.5-2 4.5-2 8 0s5.5 2 8 0',
    label: 'rolling pin',
  },
  blend: {
    path: 'M7 3.5h9.5l-1.3 12.2H8.3L7 3.5Z M6.2 3.5h11 M16.3 6.5h1.6a2.2 2.2 0 0 1 0 4.4h-1.2 M8 15.7h7.8l.6 3.4a1.4 1.4 0 0 1-1.4 1.7H8.8a1.4 1.4 0 0 1-1.4-1.7l.6-3.4Z',
    label: 'blender',
  },
  // A sieve with a handle, dripping.
  strain: {
    path: 'M3.5 10h13a6.5 6.5 0 0 1-13 0Z M16.5 10h4.5 M8 18.5v2 M12 19v2.2',
    label: 'strain',
  },
  // A drop over a dish.
  pour: {
    path: 'M12 2.8c2.1 2.6 3.1 4.4 3.1 5.6a3.1 3.1 0 0 1-6.2 0c0-1.2 1-3 3.1-5.6Z M4.5 13.5h15a7.5 7.5 0 0 1-15 0Z',
    label: 'pour',
  },
  // A shaker and what comes out of it.
  sprinkle: {
    path: 'M9 3.5h6l1 3.2-1.2 7.3H9.2L8 6.7l1-3.2Z M8.4 6.7h7.2 M8 17.2v.9 M11.6 18.7v.9 M15.2 17.2v.9 M9.8 21v.9 M13.8 21v.9',
    label: 'sprinkle',
  },
  // A pastry brush, bristles down.
  brush: {
    path: 'M12 2.5v6.5 M9 9h6v3H9Z M9.3 12h5.4l-.9 5.8h-3.6L9.3 12Z M4.5 21h15',
    label: 'brush on',
  },
  // A blade lying flat over a layer that has been smoothed.
  spread: {
    path: 'M5.5 13h11l3.5-6.5 M3.5 17c3-2 5.5-2 8.5 0s5.5 2 8.5 0 M3.5 20.5h17',
    label: 'spread',
  },
  layer: {
    path: 'M4 4.5h16v3.5H4Z M4 10.5h16v3.5H4Z M4 16.5h16v3.5H4Z',
    label: 'layer',
  },
  // A tin, lined.
  pan: {
    path: 'M4 8.5h16l-1.4 9.1a1.6 1.6 0 0 1-1.6 1.4H7a1.6 1.6 0 0 1-1.6-1.4L4 8.5Z M2.5 8.5h19 M8 5.5v3 M16 5.5v3',
    label: 'prepare the tin',
  },
  // Dough doming over the rim, and an arrow saying which way.
  rise: {
    path: 'M3.5 20h17 M6 20a6 6 0 0 1 12 0 M12 11V3.5 M9.2 6.3 12 3.5l2.8 2.8',
    label: 'rise',
  },
  // A moon: leave it alone.
  rest: {
    path: 'M12.4 3.4a6.4 6.4 0 0 0 8.2 8.2 8.6 8.6 0 1 1-8.2-8.2Z',
    label: 'rest',
  },
  hourglass: {
    path: 'M6.5 3.5h11 M6.5 20.5h11 M8 3.5v2.9c0 .8.4 1.6 1 2.1L12 11.2l3-2.7c.6-.5 1-1.3 1-2.1V3.5 M8 20.5v-2.9c0-.8.4-1.6 1-2.1l3-2.7 3 2.7c.6.5 1 1.3 1 2.1v2.9',
    label: 'waiting',
  },
  thermometer: {
    path: 'M14 14V5a2 2 0 0 0-4 0v9a3.8 3.8 0 1 0 4 0Z M12 8v6.5 M15.5 7h3 M15.5 10h3',
    label: 'temperature',
  },
};

/**
 * The verb a cook wrote, and what it looks like.
 *
 * Keys are single words, already lowercased and stripped of accents. The point of the
 * table is that it is a reading of the collection's actual labels, not a taxonomy — run
 * the coverage test in icons.test.ts and it will name any verb that has arrived since.
 */
const VERB_ICONS: Record<string, IconName> = {
  // Oven
  bake: 'oven', baking: 'oven', roast: 'oven', preheat: 'oven', prebake: 'oven',
  parbake: 'oven', reheat: 'oven', crisp: 'oven', blind: 'oven',

  // Direct heat
  fry: 'flame', saute: 'flame', sear: 'flame', brown: 'flame', sizzle: 'flame',
  griddle: 'flame', sweat: 'flame', render: 'flame', caramelize: 'flame', cook: 'flame',
  caramelise: 'flame', melt: 'flame', warm: 'flame', scramble: 'flame', pop: 'flame',
  toast: 'flame', blister: 'flame', flambe: 'flame', smoke: 'flame', singe: 'flame',
  // "crack the cream 5 min" — coconut cream fried until the oil splits out of it.
  crack: 'flame',

  // Fire underneath something you can see the bars of
  grill: 'grill', broil: 'grill', char: 'grill', torch: 'grill', barbecue: 'grill',

  // Wet heat
  simmer: 'pot', boil: 'pot', braise: 'pot', poach: 'pot', steam: 'pot', blanch: 'pot',
  parboil: 'pot', scald: 'pot', reduce: 'pot', stew: 'pot', bring: 'pot', mull: 'pot',
  infuse: 'pot', confit: 'pot',

  // Cold
  chill: 'fridge', refrigerate: 'fridge', marinate: 'fridge', brine: 'fridge',
  cure: 'fridge', pickle: 'fridge', retard: 'fridge',
  freeze: 'freezer', churn: 'freezer', thaw: 'freezer', defrost: 'freezer',

  // A bowl and something going round in it
  mix: 'bowl', combine: 'bowl', assemble: 'bowl', dissolve: 'stir', stir: 'stir',
  toss: 'stir', swirl: 'stir', loosen: 'stir', thicken: 'stir', ripple: 'stir',
  return: 'stir', slacken: 'stir', velvet: 'stir',
  whisk: 'whisk', beat: 'whisk', whip: 'whisk', cream: 'whisk', foam: 'whisk',
  emulsify: 'whisk', aerate: 'whisk', soften: 'whisk',
  fold: 'fold', fluff: 'fold',

  // Knife work
  chop: 'knife', slice: 'knife', cut: 'knife', dice: 'knife', mince: 'knife',
  julienne: 'knife', trim: 'knife', score: 'knife', slash: 'knife', shred: 'knife',
  grate: 'knife', zest: 'knife', peel: 'knife', core: 'knife', halve: 'knife',
  quarter: 'knife', carve: 'knife', debone: 'knife', butterfly: 'knife', divide: 'knife',
  portion: 'knife',

  // Your hands
  crumble: 'hand', knead: 'hand', shape: 'hand', braid: 'hand', pat: 'hand', press: 'hand', rub: 'hand',
  dimple: 'hand', pipe: 'hand', seal: 'hand', stuff: 'hand', tuck: 'hand', truss: 'hand',
  weight: 'hand', pinch: 'hand', stretch: 'hand', work: 'hand', crimp: 'hand',
  scoop: 'hand', mould: 'hand', thread: 'hand', tie: 'hand',

  // Rolling and flattening
  roll: 'roll', flatten: 'roll', laminate: 'roll', sheet: 'roll',

  // Machines that break things down
  blend: 'blend', puree: 'blend', pulse: 'blend', grind: 'blend', mash: 'blend',
  pound: 'blend', crush: 'blend', process: 'blend', mill: 'blend', whizz: 'blend',
  blitz: 'blend', bruise: 'blend',

  // Through a mesh
  strain: 'strain', drain: 'strain', sift: 'strain', rinse: 'strain', wash: 'strain',
  skim: 'strain', squeeze: 'strain', filter: 'strain', clarify: 'strain', wring: 'strain',

  // Liquid moving
  pour: 'pour', drizzle: 'pour', stream: 'pour', ladle: 'pour', thin: 'pour',
  splash: 'pour', spoon: 'pour', water: 'pour', slake: 'pour', deglaze: 'pour',
  dress: 'pour', perfume: 'pour', ribbon: 'pour', slide: 'pour',

  // Dry things landing on top
  sprinkle: 'sprinkle', scatter: 'sprinkle', season: 'sprinkle', salt: 'sprinkle',
  dust: 'sprinkle', dredge: 'sprinkle', garnish: 'sprinkle', flour: 'sprinkle',
  seed: 'sprinkle', finish: 'sprinkle', top: 'sprinkle', sugar: 'sprinkle',

  // Painted on
  brush: 'brush', glaze: 'brush', baste: 'brush', dip: 'brush', coat: 'brush',
  lacquer: 'brush', paint: 'brush', egg: 'brush',

  // Smoothed over
  spread: 'spread', frost: 'spread', ice: 'spread', smooth: 'spread', level: 'spread',

  // Stacked
  layer: 'layer', sandwich: 'layer', arrange: 'layer', nestle: 'layer', stack: 'layer',
  fill: 'layer', pack: 'layer', wrap: 'layer', cover: 'layer', line: 'pan',
  build: 'layer', lay: 'layer',

  // Getting the tin ready
  grease: 'pan', butter: 'pan', oil: 'pan',

  // Life in the dough
  rise: 'rise', risen: 'rise', prove: 'rise', proof: 'rise', ferment: 'rise',
  bloom: 'rise', autolyse: 'rise', activate: 'rise',

  // Leave it alone
  rest: 'rest', cool: 'rest', settle: 'rest', stand: 'rest', macerate: 'rest',
  wilt: 'rest', age: 'rest', mellow: 'rest', set: 'rest', sit: 'rest', leave: 'rest',

  // Waiting you can walk away from, measured
  soak: 'hourglass', steep: 'hourglass', wait: 'hourglass', overnight: 'hourglass',

  // On their own these say very little; see WEAK_VERBS, which reads past most of them.
  temper: 'thermometer', heat: 'flame', add: 'bowl', turn: 'stir',
  // "throw the bread in last" is do-this-to-these and nothing more specific is true.
  throw: 'bowl',
};

/**
 * Words that mean almost nothing on their own — "cover, chill overnight" is a picture of a
 * fridge, not of a lid. When the label opens with one of these we look further along the
 * line first, and only fall back on the weak verb's own icon if nothing better is said.
 */
const WEAK_VERBS = new Set(['add', 'cover', 'wrap', 'finish', 'turn', 'heat', 'top', 'work']);

/**
 * Words that are a verb at the front of a label and an ingredient anywhere else. "Butter a
 * pan" is a tin being greased; "stir in butter" is not. Only the opening word gets to read
 * these as instructions.
 */
const ONLY_AS_THE_OPENING_WORD = new Set([
  'flour', 'salt', 'sugar', 'butter', 'oil', 'cream', 'water', 'ice', 'seed', 'egg',
  'brine', 'pickle', 'glaze',
]);

/** Nouns that give away where an operation happens. Only ever read after the first word. */
const CONTEXT_ICONS: Record<string, IconName> = {
  oven: 'oven', broiler: 'grill', grill: 'grill', barbecue: 'grill',
  fridge: 'fridge', refrigerator: 'fridge', freezer: 'freezer',
  blender: 'blend', processor: 'blend', mortar: 'blend', mill: 'blend',
  sieve: 'strain', colander: 'strain', chinois: 'strain',
  wok: 'flame', skillet: 'flame', microwave: 'oven', steamer: 'pot',
};

/** Two- and three-word openings whose meaning is not the first word's. */
const PHRASE_ICONS: Record<string, IconName> = {
  'blind bake': 'oven',
  'egg wash': 'brush',
  'stir fry': 'flame',
  'deep fry': 'flame',
  'shallow fry': 'flame',
  'air fry': 'oven',
  'pan fry': 'flame',
  'water bath': 'pot',
  'set aside': 'rest',
  'let rest': 'rest',
  'let cool': 'rest',
  'let down': 'pour',
  'bring to': 'pot',
  'cut in': 'hand',
  'turn out': 'hand',
  'knock back': 'hand',
};

const deaccent = (word: string) => word.normalize('NFD').replace(/\p{M}/gu, '');

/** The words of a label, lowercased, unaccented, hyphens opened out. Numbers drop away. */
function words(label: string): string[] {
  return deaccent(label.toLowerCase()).replace(/[-–—]/g, ' ').match(/\p{L}+/gu) ?? [];
}

/*
 * Cooks write "risen", "chilled", "baking". Trying a couple of endings is cheap and keeps
 * the table from having to list every conjugation; nothing here changes a word's meaning.
 */
function stems(word: string): string[] {
  const out = [word];
  if (word.endsWith('s') && word.length > 3) out.push(word.slice(0, -1));
  if (word.endsWith('ed') && word.length > 3) {
    out.push(word.slice(0, -1), word.slice(0, -2), word.slice(0, -3));
  }
  if (word.endsWith('ing') && word.length > 4) {
    out.push(word.slice(0, -3), `${word.slice(0, -3)}e`);
  }
  return out;
}

function lookup(table: Record<string, IconName>, word: string): IconName | undefined {
  for (const stem of stems(word)) {
    const hit = table[stem];
    if (hit) return hit;
  }
  return undefined;
}

function phraseAt(parts: string[], from: number): IconName | undefined {
  for (const length of [3, 2]) {
    if (from + length > parts.length) continue;
    const hit = PHRASE_ICONS[parts.slice(from, from + length).join(' ')];
    if (hit) return hit;
  }
  return undefined;
}

/**
 * What an operation looks like, or null when nothing in it was recognised.
 *
 * Null is the honest answer for "season to taste in the manner of your grandmother": we do
 * not know what that looks like, and iconForOperation() will hand over a plain bowl rather
 * than pretend. Callers that want to know the difference — the coverage test, mostly — use
 * this; everything drawing a page uses iconForOperation().
 */
export function matchOperation(label: string): IconName | null {
  const parts = words(label);
  if (parts.length === 0) return null;

  const opening = phraseAt(parts, 0);
  if (opening) return opening;

  const first = lookup(VERB_ICONS, parts[0]!);
  if (first && !WEAK_VERBS.has(parts[0]!)) return first;

  // "cover, rise until doubled" — the second verb is the one worth drawing.
  for (let i = 1; i < parts.length; i += 1) {
    const phrase = phraseAt(parts, i);
    if (phrase) return phrase;
    const word = parts[i]!;
    if (stems(word).some((stem) => ONLY_AS_THE_OPENING_WORD.has(stem))) continue;
    const verb = lookup(VERB_ICONS, word);
    if (verb && !WEAK_VERBS.has(word)) return verb;
    const context = lookup(CONTEXT_ICONS, word);
    if (context) return context;
  }

  return first ?? null;
}

/** "bake at 350°F" -> 'oven'. Never throws; unrecognised work gets a plain bowl. */
export function iconForOperation(label: string): IconName {
  return matchOperation(label) ?? FALLBACK_ICON;
}

/** A hand for time you have to be there for, an hourglass for time you can walk away from. */
export function iconForAttention(attention: Attention): IconName {
  return attention === 'unattended' ? 'hourglass' : 'hand';
}

export interface IconSvgOptions {
  /** Rendered size in px. 16 is the floor these were drawn for. */
  size?: number;
  /**
   * Give the glyph an accessible name. Leave it off — the default — when a visible word
   * sits beside the icon, which is the case nearly everywhere.
   */
  title?: string;
  /** Extra classes on the <svg>. */
  className?: string;
  /** In viewBox units, so it thins out as the icon grows. */
  strokeWidth?: number;
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The icon as an SVG string, inheriting currentColor so it takes the ink of the text it
 * sits next to.
 *
 * Decorative by default: aria-hidden, because the word next to it is what gets read out.
 * Pass a title and it becomes an image with a name instead — the only two honest options,
 * since an unnamed glyph carrying meaning alone is not one.
 */
export function iconSvg(name: IconName, options: IconSvgOptions = {}): string {
  const icon = icons[name];
  if (!icon) throw new Error(`no icon named ${name}`);
  const { size = 16, title, className, strokeWidth = 1.75 } = options;

  const naming = title
    ? ` role="img" aria-label="${escapeAttr(title)}"`
    : ' aria-hidden="true" focusable="false"';
  const classes = className ? ` class="${escapeAttr(className)}"` : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"` +
    ` fill="none" stroke="currentColor" stroke-width="${strokeWidth}"` +
    ` stroke-linecap="round" stroke-linejoin="round"${classes}${naming}>` +
    `<path d="${icon.path}"/></svg>`
  );
}
