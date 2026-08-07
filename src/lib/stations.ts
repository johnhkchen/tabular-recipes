/*
 * Which appliance a step occupies, and at what temperature.
 *
 * A meal is several recipes competing for one oven and a handful of burners, and nothing in the
 * data says which step is in which. `RawRecipe.cookware` is every `#pan{}` the file names, flattened
 * into ONE recipe-level list by scripts/normalise.mjs — a step has ingredients, refs and timers, and
 * no vessel. So the question has to be put to the step's own words, which means this file is a
 * reading of English and is wrong sometimes.
 *
 * IT IS SEPARATE FROM meal.ts FOR THAT REASON. The arithmetic over there is exact given this
 * attribution; this is the part that guesses, and a guess should not get to borrow the credibility
 * of the sums built on it. Measured over the 685 generated recipes, August 2026:
 *
 *  - `cookware` MISSES A THIRD. 122 of 393 oven-looking steps are in files whose cookware names
 *    nothing oven-ish at all. baked-turkey-wings roasts 45 minutes and braises 90 and its cookware
 *    is `[]`. So cookware cannot be the gate.
 *  - A TEMPERATURE IS NOT AN OVEN. 354 steps carry one in the oven band and 35 of them are a pan of
 *    oil — crab-rangoon "fry 350°F (175°C) 3 min", samosa "fry 15 min at 300°F",
 *    buttermilk-pancakes "griddle at 375°F". So a temperature alone cannot be the signal either. A
 *    VERB is, and the temperature only gives it a number.
 *  - AN APPLIANCE IS NOT A STATION. air-fryer-sweet-potatoes says "roast in the basket 200°C" —
 *    roast, with a temperature, and not the oven. 21 air-fryer, 24 Instant Pot, 20 slow-cooker, 9
 *    smoker and 4 charcoal-grill files each have their own box, and a box is not contended for.
 *  - 34 OVEN STEPS NEVER SAY A TEMPERATURE, and 4 more only say it in a header. A missing
 *    temperature reads null and null clashes with nothing. Inventing one would be worse than not
 *    knowing.
 *
 * The hob has no `400°F`. Nothing in a simmer marks it as a burner, so the hob reading is a verb and
 * nothing else, and 149 of 870 hob-verb steps are in files naming no hob-ish cookware —
 * mashed-potatoes, whose cookware is `["ricer"]`, plainly simmers for twenty minutes. THOSE ARE
 * COUNTED ANYWAY. Gating on cookware would drop a sixth of the real hob demand and tell a cook the
 * afternoon is fine when it is not, and schedule.ts already settled which way to be wrong: where it
 * errs it errs towards a busier evening, which warns a tired cook rather than reassuring one.
 *
 * Nothing here renders and nothing returns a string a page could print.
 */
import type { RawRecipe, RawStep } from './tree.ts';

/**
 * The two things a meal runs out of. An appliance is deliberately NOT one: an Instant Pot is a box
 * somebody bought and it holds what it holds, whereas the oven and the burners are shared and
 * finite, and sharing is the whole subject.
 */
export type Station = 'oven' | 'hob';

/** Where a temperature came from, which is what the reading's confidence turns on. */
export type TemperatureSource = 'step' | 'header' | 'none';

export interface Occupancy {
  station: Station;
  /** °C. Null when nothing in the file said, and null is compatible with everything. */
  celsius: number | null;
  temperatureSource: TemperatureSource;
}

/**
 * How far apart two oven temperatures can be and still share the oven.
 *
 * 350°F and 375°F are fifteen degrees apart in Celsius and every cook alive splits that difference.
 * 180 and 230 are fifty and nobody does. The constant sits between the two because that is where the
 * question is, and it is doing real work rather than sitting somewhere nothing ever reaches: the
 * worked meal in docs/active/work/T-013-02 puts 165, 175, 190, 205 and 220 in one oven, and the
 * value decides four of those ten pairs.
 */
export const OVEN_TOLERANCE_C = 15;

/**
 * Whether two dishes can share the oven.
 *
 * NULL AGREES WITH EVERYTHING. A step that never said its temperature is not a step at some secret
 * temperature that happens to clash — it is a step we cannot rule on, and ruling anyway would put a
 * clash on the page on our say-so. The reading's confidence is what carries the doubt instead.
 */
export function temperaturesAgree(a: number | null, b: number | null): boolean {
  if (a === null || b === null) return true;
  return Math.abs(a - b) <= OVEN_TOLERANCE_C;
}

/* ---- reading the words ----------------------------------------------------- */

/**
 * Every oven temperature in a piece of text, in °C.
 *
 * The bands are what keep the other numbers in a recipe out: 165°F is a meat thermometer, 40°C is a
 * proving cupboard, and 2% is salt. A step usually writes both units — "400°F (205°C)" — so the two
 * readings land within a degree of each other after conversion, and the lowest is taken so one step
 * reports one number rather than an argument with itself.
 */
export function celsiusIn(text: string): number[] {
  const out: number[] = [];
  for (const match of text.matchAll(/(\d{2,3})\s*°?\s*([FC])\b/g)) {
    const value = Number(match[1]);
    if (match[2] === 'F' && value >= 200 && value <= 600) out.push(Math.round(((value - 32) * 5) / 9));
    if (match[2] === 'C' && value >= 90 && value <= 320) out.push(value);
  }
  return out;
}

/**
 * A box of its own. A step naming one is at no station, whatever else it says.
 *
 * `basket` is here because the air-fryer files say "roast in the basket" and that word is the only
 * thing separating them from a sheet pan.
 *
 * DEEP-FRYING IS NOT HERE, deliberately. A pot of oil at 350°F reads exactly like an oven at 350°F,
 * but it sits on a burner and takes one up — hong-kong-french-toast and crab-rangoon are hob work,
 * not a box of their own, and the oven reading already refuses them because they name no oven verb.
 */
const APPLIANCE =
  /\b(air[\s-]?fry\w*|basket|smoke|smokes|smoker|smoked|smoking|grill\w*|slow[\s-]cooker|instant[\s-]pot|pressure[\s-]cooker|waffle[\s-]iron|microwave)\b/i;

/** roast, bake, broil — and the bare word `oven`, once `dutch oven` has been taken out of it. */
const OVEN_VERB =
  /\b(roast|roasts|roasted|roasting|bake|bakes|baked|baking|broil|broils|broiled|broiling|broiler|oven)\b/i;

const HOB_VERB =
  /\b(simmer\w*|boil\w*|fry|fries|fried|frying|saut\w*|sear|sears|seared|searing|sweat\w*|steam\w*|reduc\w*|poach\w*|blanch\w*|scald\w*|deglaz\w*|griddl\w*|parboil\w*|render\w*)\b/i;

/**
 * A pan that lives on a burner. Both a hob signal and a guard on the oven, and the guard is the
 * more important half.
 *
 * hot-water-cornbread says "heat in a 10-in cast-iron skillet to 350°F (175°C)": an oven-band
 * temperature, no frying word, and emphatically not the oven. What separates it from
 * baked-turkey-wings' "braise covered at 325°F" is that it says which pan it is in.
 *
 * `DUTCHPOT` is here because maskFalseOvens() puts it there, and hush-puppies heats 350°F of oil in
 * one. It does NOT stop no-knead-bread baking in the same pot at 450°F: see the temperature clause
 * in readStations() below, which is exactly the difference between a pot on a burner and a pot in
 * the oven.
 */
const HOB_PAN =
  /\b(skillet|wok|griddle|comal|saucepan|stockpot|kettle|karahi|tawa|DUTCHPOT)\b/i;

/** The looser one, used only where a bare `pan` or `pot` is enough to doubt an oven reading. */
const PAN_WORD = /\b(pot|pan)\b/i;

/**
 * The three ways this collection writes the oven's words and means something else.
 *
 * A Dutch oven is a pot, and it is the commonest way to read `oven` and mean a pan. Baking powder
 * and baking soda are chemistry — the parser strips ingredient marks out of `rawLabel`, so they only
 * reach here through a hand-written `>> step:` label, but "fold in the baking powder" is not the
 * oven and one such label would put a dish in it for the length of a fold.
 */
const maskFalseOvens = (text: string): string =>
  text
    .replace(/dutch\s+oven/gi, 'DUTCHPOT')
    .replace(/bak(?:ing|e)\s+(?:powder|soda)/gi, 'LEAVENING')
    .replace(/bakery/gi, 'SHOP');

/** Everything a step says: the label a cook reads, the sentence it came from, and its timer names. */
const textOf = (step: RawStep): string =>
  [step.labelOverride ?? '', step.rawLabel ?? '', ...step.timers.map((timer) => timer.name ?? '')]
    .filter(Boolean)
    .join(' ');

/** The steps that become tasks. The others are the full-width rows above and below the table. */
const isOperation = (step: RawStep): boolean => step.ingredients.length > 0 || step.refs.length > 0;

/**
 * Vessels that are their own box. Used for ONE thing — suppressing the hob on a recipe that owns no
 * pan at all — and never as a positive signal for anything, because 122 oven steps would be lost.
 */
const APPLIANCE_VESSEL =
  /\b(air fryer|instant pot|slow cooker|pressure cooker|smoker|grill|rice cooker|waffle iron|microwave|bread machine)\b/i;

/**
 * True when every vessel the recipe names is its own box, so a "simmer" in it is not a burner.
 *
 * A recipe naming NOTHING is not one of these — most files name no cookware at all, and reading
 * silence as "it must be an appliance" would delete the hob from two thirds of the collection.
 */
const appliancesOnly = (recipe: RawRecipe): boolean =>
  recipe.cookware.length > 0 && recipe.cookware.every((item) => APPLIANCE_VESSEL.test(item));

/* ---- the reading ----------------------------------------------------------- */

/**
 * One reading per operation step, keyed by `RawStep.index` — the same number a `Task.id` carries as
 * `s{index}`, so a caller holding a schedule can look a task up without translating anything.
 *
 * A step at no station is ABSENT from the map rather than present with a null station. The two would
 * be the same lookup and different claims, and this file has enough places to be wrong already.
 *
 * Precedence, and the order is the argument:
 *
 *  1. AN APPLIANCE STOPS THE READING. Its own box, contended for by nobody.
 *  2. AN OVEN VERB IS THE OVEN — roast, bake, broil, or the word itself — UNLESS the step names a
 *     burner pan and no temperature. That exception is one class of sentence: massaman-curry-paste
 *     dry-roasts its spices "in the same dry skillet", and a `~roast{}` timer over a skillet with no
 *     temperature on it is a burner. A temperature buys the reading back, which is what keeps
 *     no-knead-bread's "bake in a Dutch oven 450°F" in the oven where it belongs.
 *  3. AN OVEN-BAND TEMPERATURE IN A STEP THAT NAMES NEITHER A FRYING WORD NOR A PAN IS THE OVEN.
 *     This exists for one real sentence — baked-turkey-wings' "braise covered at 325°F (165°C) for
 *     90 min" — and for the class it stands for: a braise is on the hob or in the oven depending on
 *     nothing but the temperature, because 165°C is not a burner setting. The two guards are what
 *     keep crab-rangoon's "fry 350°F" and hot-water-cornbread's "heat in a cast-iron skillet to
 *     350°F" out.
 *  4. A HOB VERB, OR A BURNER PAN, IS A BURNER.
 *
 * Oven before hob so a braise that starts in a Dutch oven on the burner and finishes in the oven is
 * charged once, to the scarcer of the two.
 */
export function readStations(recipe: RawRecipe): Map<number, Occupancy> {
  const out = new Map<number, Occupancy>();

  // A preheat is a header — no ingredients, no refs — and it is where a temperature often lives.
  const headerTemperatures = recipe.steps
    .filter((step) => !isOperation(step))
    .flatMap((step) => celsiusIn(textOf(step)));
  const fromHeader = headerTemperatures.length > 0 ? Math.min(...headerTemperatures) : null;

  const noBurners = appliancesOnly(recipe);

  for (const step of recipe.steps) {
    if (!isOperation(step)) continue;
    const text = maskFalseOvens(textOf(step));
    if (APPLIANCE.test(text)) continue;

    const own = celsiusIn(text);
    const onABurnerPan = HOB_PAN.test(text);
    const inTheOven =
      (OVEN_VERB.test(text) && (own.length > 0 || !onABurnerPan)) ||
      (own.length > 0 && !HOB_VERB.test(text) && !onABurnerPan && !PAN_WORD.test(text));

    if (inTheOven) {
      if (own.length > 0) {
        out.set(step.index, {
          station: 'oven',
          celsius: Math.min(...own),
          temperatureSource: 'step',
        });
      } else if (fromHeader !== null) {
        out.set(step.index, { station: 'oven', celsius: fromHeader, temperatureSource: 'header' });
      } else {
        out.set(step.index, { station: 'oven', celsius: null, temperatureSource: 'none' });
      }
      continue;
    }

    if (!noBurners && (HOB_VERB.test(text) || onABurnerPan)) {
      out.set(step.index, { station: 'hob', celsius: null, temperatureSource: 'none' });
    }
  }

  return out;
}
