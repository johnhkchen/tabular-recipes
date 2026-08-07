/*
 * T-012-02 — the whole shelf, read against docs/knowledge/cooks.md's three cooks.
 *
 * Produces every number in docs/gaps/what-the-shelf-offers.md. Reads
 * src/generated/recipes.json, src/data/staples.json and src/lib/schedule.ts; writes nothing.
 *
 *   PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" \
 *     node docs/active/work/T-012-02/read-the-shelf.ts
 *
 * Node 24 strips the types natively, so this runs with no build step and imports the site's own
 * buildSchedule() rather than reimplementing it.
 *
 * THE VOCABULARY TABLES BELOW ARE THE REVIEWABLE SURFACE. Every classification decision is a line
 * in one of them, not a regex inside a function, so a reader who disagrees with "frozen peas is a
 * vegetable and not a pulse" can point at the line that says so. Same reason src/data/staples.json
 * writes its `except` lists out longhand instead of tuning a matcher.
 */
import { readFileSync } from 'node:fs';
import { buildSchedule, BREAK_MINUTES, type Schedule, type Task } from '../../../../src/lib/schedule.ts';
import { readTimers } from '../../../../src/lib/time.ts';
import { matchesStaple } from '../../../../src/lib/units.ts';

const R: any[] = JSON.parse(readFileSync('src/generated/recipes.json', 'utf8'));
const STAPLES: any = JSON.parse(readFileSync('src/data/staples.json', 'utf8'));

/* ------------------------------------------------------------------ matching

 * Whole consecutive words, the same predicate shape matchesStaple() uses in src/lib/units.ts —
 * so "corn" does not claim "cornstarch" and "bean" does not claim "bean sprouts" unless a table
 * says it does. Plain substring matching gets both of those wrong.
 */
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9À-￿]+/g, ' ').trim().split(' ');
function hasWords(name: string, pattern: string): boolean {
  const n = words(name), p = words(pattern);
  for (let i = 0; i + p.length <= n.length; i++) {
    if (p.every((w, j) => n[i + j] === w)) return true;
  }
  return false;
}
const any = (name: string, patterns: string[]) => patterns.some((p) => hasWords(name, p));

/* ------------------------------------------------------------- the vocabulary

 * Band A  plant food ....... a vegetable, fruit, fungus, seaweed or fresh legume — the thing on
 *                            the plate that a person would call a vegetable or a fruit.
 * Band B  herbs ............ eaten by the sprig, seasoning by weight.
 * Band C  pulse/grain/nut .. plant food, and not what "breadth of plants" is asking about.
 * Band D  process .......... spice, flour, sugar, oil, vinegar, extract, leavening, sauce, drink.
 *                            Plants botanically; not plants on a plate.
 *
 * Rules are tried IN ORDER and the first match wins, so a specific rule sits above the generic
 * deny rule it has to beat: "coconut milk" before "milk", "bean sprouts" before "beans".
 */
type Band = 'A' | 'B' | 'C' | 'D';
interface Rule {
  /** Canonical name. Several rules may share one — that fold is the point. */
  is: string;
  band: Band;
  m: string[];
  /** A heavy starch, in the sense persona one means: the thing you eat instead of a vegetable. */
  starch?: boolean;
  /** An aromatic. Band A, but a dish is never "built on" one. */
  aromatic?: boolean;
  /** Not a plant at all: animal, dairy, or another recipe on this shelf. */
  kind?: 'animal' | 'dairy' | 'composite';
}

const RULES: Rule[] = [
  /* --- composites: another recipe on this shelf, appearing as one line in a table ---------- */
  { is: 'composite', band: 'D', kind: 'composite', m: [
    'onion-tomato masala', 'ginger-garlic paste', 'char siu', 'chāshū', 'chashu', 'đồ chua',
    'nước chấm', 'birria braising liquid', 'makhani gravy', 'basil pesto', 'hong kong milk tea',
    'pizza dough', 'croissant dough', 'sicilian pan dough', 'stiff flour dough', 'hojaldre',
    'all-butter pie crust', 'pie crust', 'blind-baked tart shells', 'frangipane', 'attar',
    'masa para pan dulce', 'costra de azúcar', 'relleno de piña', 'nixtamalised masa',
    'marinara sauce', 'onion gravy', 'house brown sauce', 'chintan broth', 'tonkotsu broth',
    'boiling phở broth', 'shio tare', 'shoyu tare', 'miso tare', 'mayu', 'ajitama', 'goma dare',
    'al pastor adobo', 'tandoori marinade', 'shawarma spice', 'turkey brine', 'berbere',
    'niter kibbeh', 'japanese curry roux', 'massaman curry paste', 'panang curry paste',
    'thai red curry paste', 'thai yellow curry paste', 'vindaloo paste', 'achiote paste',
    'pad thai sauce', 'satay sauce', 'sweet and sour sauce', 'nước mắm', 'tahini sauce',
    'scallion oil', 'ginger scallion oil', 'annatto oil', 'basic vinaigrette',
    'balsamic vinaigrette', 'blue cheese dressing', 'caesar dressing', 'ranch dressing',
    'hollandaise', 'okonomiyaki sauce', 'barbecue sauce', 'teriyaki sauce', 'chả lụa',
    'cha lua', 'thịt nguội', 'pork liver pâté', 'leftover pizza', 'birista', 'fried shallots',
    'cooked brisket', 'chopped smoked pork', 'boiling water for the paste', 'sugar syrup',
    'miel de piloncillo', 'dulce de leche', 'taco seasoning', 'cajun seasoning',
  ] },

  /* --- plant food that a deny rule would otherwise swallow -------------------------------- */
  { is: 'coconut', band: 'A', m: [
    'coconut milk', 'coconut cream', 'coconut water', 'shredded coconut', 'desiccated coconut',
    'toasted coconut flakes', 'unsweetened grated coconut', 'sweetened shredded coconut',
    'shredded sweetened coconut',
  ] },
  { is: 'bean sprouts', band: 'A', m: ['bean sprouts'] },
  { is: 'green bean', band: 'A', m: ['green beans', 'flat green beans', 'long beans'] },
  { is: 'snow pea', band: 'A', m: ['snow peas'] },
  { is: 'pea', band: 'A', m: ['frozen peas'] },
  { is: 'mustard greens', band: 'A', m: ['mustard greens'] },
  { is: 'corn', band: 'A', starch: true, m: [
    'corn kernels', 'fresh corn', 'sweetcorn', 'corn on the cob', 'dried field corn',
    'corn tortillas', 'masarepa', 'masa harina', 'hominy', 'stone-ground grits',
  ] },

  /* --- band D: process. Applied before the plant tables, per design §2. ------------------- */
  { is: 'salt', band: 'D', m: [
    'salt', 'salted water', 'pretzel salt', 'pickling salt', 'pink curing salt', 'flaky salt',
  ] },
  { is: 'pepper', band: 'D', m: [
    'black pepper', 'white pepper', 'peppercorns', 'black peppercorns', 'white peppercorns',
    'cracked black peppercorns', 'sichuan peppercorns', 'ground sansho pepper', 'aleppo pepper',
  ] },
  { is: 'chile, dried or ground', band: 'D', m: [
    'chile powder', 'chili powder', 'chilli powder', 'ground dried chile', 'cayenne',
    'red pepper flakes', 'red chile flakes', 'crushed red pepper', 'chili sauce',
    'chili garlic sauce', 'shichimi togarashi', 'harissa', 'doubanjiang', 'sriracha',
    'chipotles in adobo', 'pickled jalapeños', 'toasted chile powder', 'achiote powder',
  ] },
  { is: 'spice', band: 'D', m: [
    'cumin', 'coriander seed', 'coriander seeds', 'ground coriander', 'cinnamon', 'cassia bark',
    'cardamom', 'cloves', 'nutmeg', 'mace', 'allspice', 'star anise', 'anise', 'fennel seed',
    'fennel seeds', 'ground fennel', 'caraway', 'mustard seed', 'mustard seeds', 'nigella seeds',
    'ajwain', 'asafoetida', 'sumac', 'saffron', 'turmeric', 'paprika', 'garam masala',
    'curry powder', 'ras el hanout', "za'atar", 'chaat masala', 'amchur', 'mahlab',
    'filé powder', 'pickling spice', 'poultry seasoning', 'everything seasoning', 'mixed spice',
    'pumpkin pie spice', 'five-spice powder', 'chinese five-spice powder', 'celery seed',
    'fenugreek seeds', 'ground ginger', 'ground dried ginger', 'granulated garlic',
    'garlic powder', 'onion powder', 'madras curry powder', 'mild curry powder',
    'poppy seeds', 'dried marjoram', 'dried savory', 'mexican cinnamon',
  ] },
  { is: 'flour and starch', band: 'D', m: [
    'flour', 'atta', 'semolina', 'cornstarch', 'corn starch', 'cornflour', 'cornmeal',
    'potato starch', 'wheat starch', 'tapioca starch', 'small pearl tapioca', 'poha',
    'vital wheat gluten', 'kansui', 'panko', 'breadcrumbs', 'matzo meal', 'graham cracker crumbs',
    'vanilla wafers', 'crisp rice cereal', 'toasted rice cereal', 'wonton wrappers',
    'round wonton wrappers', 'egg roll wrappers', 'rice paper wrappers', 'filo pastry',
  ] },
  { is: 'not food', band: 'D', m: ['skewers', 'oak or hickory wood'] },
  { is: 'sugar and syrup', band: 'D', m: [
    'sugar', 'jam', 'molasses', 'honey', 'golden syrup', 'maple syrup', 'corn syrup', 'jaggery',
    'piloncillo', 'maltose', 'maltose syrup', 'barley malt syrup', 'marshmallow creme',
    'mini marshmallows', 'toffee bits', 'butterscotch chips', 'pomegranate molasses',
  ] },
  { is: 'cocoa and chocolate', band: 'D', m: [
    'cocoa', 'cocoa powder', 'chocolate', 'chocolate chips', 'chocolate syrup',
    'milk chocolate bars', 'dark chocolate batons', 'espresso powder',
  ] },
  { is: 'fat and oil', band: 'D', m: [
    'oil', 'lard', 'shortening', 'ghee', 'schmaltz', 'tallow', 'duck fat', 'bacon fat',
    'bacon drippings', 'rendered fat', 'frying fat', 'lamb fat', 'chicken fat', 'pork fatback',
    'diced pork fatback', 'sliced pork fatback', 'clarified butter',
  ] },
  { is: 'vinegar', band: 'D', m: ['vinegar'] },
  { is: 'fermented seasoning', band: 'D', m: [
    'soy sauce', 'miso', 'awase miso', 'fish sauce', 'oyster sauce', 'shrimp paste',
    'worcestershire sauce', 'hoisin sauce', 'ketchup', 'mayonnaise', 'japanese mayonnaise',
    'mustard', 'maggi seasoning', 'fermented black beans', 'fermented red bean curd',
    'black vinegar', 'sesame paste', 'tahini', 'peanut butter', 'capers', 'prepared horseradish',
    'dried shrimp', 'dried scallop', 'katsuobushi', 'dashi', 'tomato paste', 'red bean paste',
    'hot sauce', 'tamarind concentrate', 'tamarind water', 'seedless tamarind pulp',
  ] },
  { is: 'extract, leavening and additive', band: 'D', m: [
    'extract', 'yeast', 'active sourdough starter', 'ersho', 'baking powder', 'baking soda',
    'cream of tartar', "baker's ammonia", 'gelatin', 'liquid rennet', 'ascorbic acid',
    'cal', 'pickling lime', 'food colouring', 'custard powder', 'malted milk powder',
    'nonfat dry milk', 'vanilla bean', 'rose water', 'orange blossom water', 'dried rosebuds',
    'pandan leaf', 'banana leaves', 'dried lotus leaves', 'grape leaves',
  ] },
  { is: 'drink and alcohol', band: 'D', m: [
    'wine', 'sake', 'mirin', 'shaoxing wine', 'brandy', 'rum', 'kirsch', 'whisky', 'vodka',
    'marsala', 'sherry', 'lager', 'burgundy', 'cola', 'seltzer', 'tea bags', 'black tea',
    'coffee', 'espresso', 'ice', 'iced water', 'water',
  ] },
  { is: 'bread, noodle and rice, cooked or bought', band: 'D', starch: true, m: [
    'bread', 'rolls', 'buns', 'baguette slices', 'english muffins', 'challah', 'pita bread',
    'day-old sourdough', 'day-old croissants', 'day-old skillet cornbread', 'noodles',
    'spaghetti', 'ziti', 'ditalini', 'elbow macaroni', 'lasagna noodles', 'vermicelli',
    'broken vermicelli', 'glass noodles', 'frozen chips', 'frozen spring rolls', 'menma',
    'salted bamboo shoots', 'preserved radish', 'naruto maki', 'kamaboko', 'tenkasu',
    'beni shoga', 'aonori', 'nori', 'toasted nori', 'laver',
  ] },

  /* --- band C: pulses, grains, nuts, seeds ------------------------------------------------ */
  { is: 'chickpea', band: 'C', m: ['chickpeas', 'gram flour', 'chickpea flour', 'roasted gram flour'] },
  { is: 'navy bean', band: 'C', m: ['dried navy beans'] },
  { is: 'black bean', band: 'C', m: ['black beans'] },
  { is: 'pinto bean', band: 'C', m: ['pinto beans'] },
  { is: 'fava bean', band: 'C', m: ['fava beans'] },
  { is: 'gigante bean', band: 'C', m: ['gigante beans'] },
  { is: 'adzuki bean', band: 'C', m: ['adzuki beans'] },
  { is: 'black-eyed pea', band: 'C', m: ['black-eyed peas'] },
  { is: 'lima bean', band: 'C', m: ['lima beans'] },
  { is: 'cannellini bean', band: 'C', m: ['cannellini beans'] },
  { is: 'bean, unspecified', band: 'C', m: ['dried beans'] },
  { is: 'lentil', band: 'C', m: ['lentils'] },
  { is: 'urad dal', band: 'C', m: ['urad dal', 'urad dal flour'] },
  { is: 'toor dal', band: 'C', m: ['toor dal'] },
  { is: 'mung dal', band: 'C', m: ['split mung dal'] },
  { is: 'split pea', band: 'C', m: ['green split peas'] },
  { is: 'soy bean (tofu)', band: 'C', m: [
    'firm tofu', 'extra-firm tofu', 'silken tofu', 'soft tofu', 'abura-age', 'paneer-substitute',
  ] },
  { is: 'rice', band: 'C', starch: true, m: [
    'rice', 'idli rice', 'broken rice', 'glutinous rice', 'sushi rice', 'bomba rice',
    'arborio rice', 'basmati rice', 'jasmine rice', 'brown rice', 'wild rice', 'cooked rice',
  ] },
  { is: 'oat', band: 'C', starch: true, m: ['rolled oats'] },
  { is: 'barley', band: 'C', starch: true, m: ['pearl barley'] },
  { is: 'farro', band: 'C', starch: true, m: ['pearled farro'] },
  { is: 'quinoa', band: 'C', starch: true, m: ['quinoa'] },
  { is: 'amaranth', band: 'C', starch: true, m: ['amaranth'] },
  { is: 'bulgur', band: 'C', starch: true, m: ['bulgur'] },
  { is: 'buckwheat', band: 'C', starch: true, m: ['buckwheat'] },
  { is: 'teff', band: 'C', starch: true, m: ['teff'] },
  { is: 'walnut', band: 'C', m: ['walnuts'] },
  { is: 'pecan', band: 'C', m: ['pecans'] },
  { is: 'almond', band: 'C', m: ['almonds', 'almond flour', 'ground almonds'] },
  { is: 'pistachio', band: 'C', m: ['pistachios'] },
  { is: 'hazelnut', band: 'C', m: ['hazelnuts'] },
  { is: 'cashew', band: 'C', m: ['cashews'] },
  { is: 'peanut', band: 'C', m: ['peanuts'] },
  { is: 'pine nut', band: 'C', m: ['pine nuts'] },
  { is: 'sesame', band: 'C', m: ['sesame seeds'] },
  { is: 'sunflower seed', band: 'C', m: ['sunflower seeds'] },
  { is: 'hemp seed', band: 'C', m: ['hemp seeds'] },
  { is: 'lotus seed', band: 'C', m: ['lotus seeds'] },

  /* --- band B: herbs and the aromatics bought by the sprig -------------------------------- */
  { is: 'cilantro/coriander leaf', band: 'B', m: [
    'cilantro', 'cilantro leaves', 'cilantro stems', 'coriander root', 'coriander leaves',
    'fresh coriander',
  ] },
  { is: 'parsley', band: 'B', m: ['parsley'] },
  { is: 'mint', band: 'B', m: ['mint'] },
  { is: 'basil', band: 'B', m: ['basil'] },
  { is: 'dill', band: 'B', m: ['dill', 'fresh dill'] },
  { is: 'chive', band: 'B', m: ['chives'] },
  { is: 'thyme', band: 'B', m: ['thyme'] },
  { is: 'rosemary', band: 'B', m: ['rosemary'] },
  { is: 'sage', band: 'B', m: ['sage'] },
  { is: 'tarragon', band: 'B', m: ['tarragon'] },
  { is: 'oregano', band: 'B', m: ['oregano'] },
  { is: 'bay', band: 'B', m: ['bay leaf', 'bay leaves'] },
  { is: 'mitsuba', band: 'B', m: ['mitsuba'] },
  { is: 'curry leaf', band: 'B', m: ['curry leaves'] },
  { is: 'fenugreek leaf', band: 'B', m: ['kasuri methi', 'dried fenugreek leaves'] },
  { is: 'avocado leaf', band: 'B', m: ['avocado leaves'] },
  { is: 'lemongrass', band: 'B', m: ['lemongrass'] },
  { is: 'galangal', band: 'B', m: ['galangal'] },

  /* --- band A: the plant food ------------------------------------------------------------- */
  { is: 'onion', band: 'A', aromatic: true, m: ['onion', 'onions'] },
  { is: 'garlic', band: 'A', aromatic: true, m: ['garlic'] },
  { is: 'shallot', band: 'A', aromatic: true, m: ['shallot', 'shallots'] },
  { is: 'scallion', band: 'A', aromatic: true, m: ['scallion', 'scallions', 'yellow chives'] },
  { is: 'ginger', band: 'A', aromatic: true, m: ['ginger', 'fresh turmeric'] },
  { is: 'chile, fresh', band: 'A', aromatic: true, m: [
    'chile', 'chiles', 'chilli', 'jalapeño', 'jalapeños', 'pepperoncini', 'padrón peppers',
  ] },
  { is: 'leek', band: 'A', m: ['leeks'] },
  { is: 'celery', band: 'A', m: ['celery'] },
  { is: 'carrot', band: 'A', m: ['carrot', 'carrots'] },
  { is: 'tomato', band: 'A', m: ['tomato', 'tomatoes'] },
  { is: 'tomatillo', band: 'A', m: ['tomatillos'] },
  { is: 'bell pepper', band: 'A', m: [
    'bell pepper', 'bell peppers', 'green pepper', 'cubanelle pepper', 'roasted red peppers',
  ] },
  { is: 'cabbage', band: 'A', m: ['cabbage'] },
  { is: 'brussels sprout', band: 'A', m: ['brussels sprouts'] },
  { is: 'broccoli', band: 'A', m: ['broccoli'] },
  { is: 'chinese broccoli', band: 'A', m: ['chinese broccoli'] },
  { is: 'cauliflower', band: 'A', m: ['cauliflower'] },
  { is: 'kale', band: 'A', m: ['kale'] },
  { is: 'spinach', band: 'A', m: ['spinach'] },
  { is: 'collard greens', band: 'A', m: ['collard greens'] },
  { is: 'bok choy', band: 'A', m: ['bok choy'] },
  { is: 'lettuce', band: 'A', m: ['lettuce', 'romaine', 'romaine heart'] },
  { is: 'arugula', band: 'A', m: ['arugula'] },
  { is: 'radicchio', band: 'A', m: ['radicchio'] },
  { is: 'cucumber', band: 'A', m: ['cucumber', 'cucumbers', 'dill pickle', 'dill pickle chips'] },
  { is: 'daikon', band: 'A', m: ['daikon', 'kiriboshi daikon'] },
  { is: 'radish', band: 'A', m: ['radishes'] },
  { is: 'turnip', band: 'A', m: ['turnip', 'turnips'] },
  { is: 'parsnip', band: 'A', m: ['parsnip'] },
  { is: 'beet', band: 'A', m: ['beets', 'raw beet'] },
  { is: 'jicama', band: 'A', m: ['jicama'] },
  { is: 'burdock root', band: 'A', m: ['burdock root'] },
  { is: 'lotus root', band: 'A', m: ['lotus root'] },
  { is: 'lily bud', band: 'A', m: ['dried lily buds'] },
  { is: 'eggplant', band: 'A', m: ['eggplant', 'eggplants'] },
  { is: 'zucchini', band: 'A', m: ['zucchini'] },
  { is: 'summer squash', band: 'A', m: ['yellow summer squash'] },
  { is: 'winter squash', band: 'A', m: [
    'butternut squash', 'kabocha', 'delicata squash', 'pumpkin', 'pumpkin puree', 'pumpkin purée',
  ] },
  { is: 'okra', band: 'A', m: ['okra'] },
  { is: 'bamboo shoot', band: 'A', m: ['bamboo shoots'] },
  { is: 'konjac', band: 'A', m: ['konnyaku', 'ito konnyaku'] },
  { is: 'potato', band: 'A', starch: true, m: ['potato', 'potatoes'] },
  { is: 'sweet potato', band: 'A', starch: true, m: ['sweet potatoes'] },
  { is: 'taro', band: 'A', starch: true, m: ['taro'] },
  { is: 'yuca', band: 'A', starch: true, m: ['yuca'] },
  { is: 'plantain', band: 'A', starch: true, m: ['plantain'] },
  { is: 'avocado', band: 'A', m: ['avocado', 'avocados'] },
  { is: 'olive', band: 'A', m: ['olives'] },
  { is: 'green papaya', band: 'A', m: ['green papaya'] },
  { is: 'mango', band: 'A', m: ['mango', 'mangoes'] },
  { is: 'pineapple', band: 'A', m: ['pineapple'] },
  { is: 'apple', band: 'A', m: ['apple', 'apples'] },
  { is: 'asian pear', band: 'A', m: ['asian pear'] },
  { is: 'banana', band: 'A', m: ['bananas'] },
  { is: 'peach', band: 'A', m: ['peaches'] },
  { is: 'cherry', band: 'A', m: ['sweet cherries', 'maraschino cherries'] },
  { is: 'raspberry', band: 'A', m: ['raspberries'] },
  { is: 'cranberry', band: 'A', m: ['cranberries'] },
  { is: 'date', band: 'A', m: ['dates'] },
  { is: 'grape (raisin)', band: 'A', m: ['raisins', 'sultanas', 'currants'] },
  { is: 'apricot', band: 'A', m: ['apricots'] },
  { is: 'lemon', band: 'A', m: ['lemon', 'lemons', 'preserved lemon'] },
  { is: 'lime', band: 'A', m: ['lime', 'limes', 'makrut lime', 'kaffir lime'] },
  { is: 'orange', band: 'A', m: ['orange', 'sour orange', 'candied orange peel'] },
  { is: 'mandarin', band: 'A', m: ['dried tangerine peel', 'dried mandarin peel'] },
  { is: 'yuzu', band: 'A', m: ['yuzu'] },
  { is: 'pomegranate', band: 'A', m: ['pomegranate juice'] },
  { is: 'mushroom', band: 'A', m: ['mushroom', 'mushrooms', 'shiitake', 'kikurage'] },
  { is: 'kombu', band: 'A', m: ['kombu'] },
  { is: 'wakame', band: 'A', m: ['wakame'] },
  { is: 'hijiki', band: 'A', m: ['hijiki'] },

  /* --- animal and dairy: not plants, and named so the residue stays small ----------------- */
  { is: 'dairy/egg', band: 'D', kind: 'dairy', m: [
    'butter', 'milk', 'cream', 'buttermilk', 'yogurt', 'sour cream', 'cream cheese', 'cheddar',
    'parmesan', 'parmigiano-reggiano', 'pecorino', 'pecorino romano', 'mozzarella', 'feta',
    'goat cheese', 'blue cheese', 'gruyère', 'provolone', 'swiss cheese', 'american cheese',
    'halloumi', 'paneer', 'queso fresco', 'cotija', 'ricotta', 'egg', 'eggs', 'egg yolk',
    'egg yolks', 'egg white', 'egg whites', 'century eggs', 'french vanilla ice cream',
  ] },
  { is: 'animal', band: 'D', kind: 'animal', m: [
    'beef', 'pork', 'chicken', 'lamb', 'veal', 'turkey', 'duck', 'bacon', 'pancetta', 'ham',
    'sausage', 'sausages', 'salami', 'bologna', 'brisket', 'oxtail', 'trotters', 'marrow', 'tripe',
    'small intestine', 'tongue', 'liver', 'livers', 'skin', 'feet', 'carcasses',
    'backs and wings', 'wings', 'drumsticks', 'shrimp', 'prawns', 'crab', 'clams', 'clam juice',
    'tuna', 'salmon', 'cod', 'mackerel', 'yellowtail', 'whitefish', 'carp', 'anchovy fillets',
    'seafood', 'lap cheong', 'linguiça', 'andouille', 'chorizo', 'luncheon meat', 'pork roll',
    'corned beef', 'pastrami', 'dried beef', 'stock', 'broth', 'salt pork', 'salt cod',
    'steak', 'chuck', 'shin', 'shank', 'shanks', 'short ribs', 'spare ribs', 'rib tips',
    'neck bones', 'ham hock', 'ham hocks', 'cube steaks', 'eye of round', 'sirloin', 'loin',
    'cheeks', 'belly', 'shoulder', 'breast', 'breasts', 'thigh', 'thighs', 'fillet', 'fillets',
    'collar', 'heads and shells', 'minced beef', 'lean pork', 'horse mackerel',
  ] },
];

interface Classified { is: string; band: Band; starch: boolean; aromatic: boolean; kind?: string }
const CACHE = new Map<string, Classified | null>();
function classify(name: string): Classified | null {
  if (CACHE.has(name)) return CACHE.get(name)!;
  let out: Classified | null = null;
  for (const rule of RULES) {
    if (any(name, rule.m)) {
      out = { is: rule.is, band: rule.band, starch: !!rule.starch, aromatic: !!rule.aromatic, kind: rule.kind };
      break;
    }
  }
  CACHE.set(name, out);
  return out;
}

/* --------------------------------------------------------------- mass, for dominance
 *
 * Volume is converted at water density, and the reading says so. A cup of flour and a cup of
 * water are not the same mass; the alternative is a density table per ingredient, which would be
 * a large invented number. COUNT UNITS ARE NOT CONVERTED — "2 cloves" returns null and drops out
 * of the arithmetic rather than being assigned a plausible weight, the same refusal
 * src/lib/shopping.ts already makes when it will not compare grams to cups.
 */
const GRAMS: Record<string, number> = {
  g: 1, gram: 1, grams: 1, kg: 1000, oz: 28.35, ounce: 28.35, ounces: 28.35,
  lb: 453.6, lbs: 453.6, pound: 453.6, pounds: 453.6,
  ml: 1, l: 1000, litre: 1000, liter: 1000,
  tsp: 5, tsps: 5, teaspoon: 5, teaspoons: 5, tbs: 15, tbsp: 15, tablespoon: 15, tablespoons: 15,
  cup: 237, cups: 237, quart: 946, quarts: 946, pint: 473, pints: 473, 'fl oz': 30,
};
function grams(a: { value: number | null; unit: string | null } | undefined): number | null {
  if (!a || a.value === null || !a.unit) return null;
  const g = GRAMS[a.unit.toLowerCase()];
  return g === undefined ? null : a.value * g;
}

/* The mass of each ingredient in a recipe, keyed by name, summed across steps. */
function massOf(r: any): Map<string, number> {
  const out = new Map<string, number>();
  for (const s of r.steps) for (const i of s.ingredients) {
    const g = grams(i.amount);
    if (g !== null) out.set(i.name, (out.get(out.has(i.name) ? i.name : i.name) ?? 0) + g);
  }
  return out;
}

const H = (s: string) => console.log(`\n${'='.repeat(78)}\n${s}\n${'='.repeat(78)}`);
const sub = (s: string) => console.log(`\n--- ${s} ---`);

/* ==================================================================== §0  residue */
H('§0  CLASSIFICATION RESIDUE — every ingredient name no rule matched');
{
  const counts = new Map<string, number>();
  for (const r of R) for (const n of new Set<string>(r.ingredientNames)) counts.set(n, (counts.get(n) ?? 0) + 1);
  const residue = [...counts].filter(([n]) => classify(n) === null).sort((a, b) => b[1] - a[1]);
  console.log(`${counts.size} distinct ingredient names; ${residue.length} unclassified`);
  console.log(residue.map(([n, c]) => `  ${c}\t${n}`).join('\n'));
}

/* ==================================================================== §1  plants */
H('§1  THE CATTLE CLAIM — plants, counted from ingredient lists');
const plantOf = (n: string) => { const c = classify(n); return c && (c.band === 'A' || c.band === 'B' || c.band === 'C') ? c : null; };

const bandSets: Record<string, Set<string>> = { A: new Set(), B: new Set(), C: new Set() };
const starchSet = new Set<string>();
for (const r of R) for (const n of r.ingredientNames) {
  const c = plantOf(n);
  if (!c) continue;
  bandSets[c.band].add(c.is);
  if (c.starch) starchSet.add(c.is);
}
sub('distinct plants, by band');
for (const b of ['A', 'B', 'C']) {
  console.log(`band ${b}: ${bandSets[b].size}`);
  console.log('  ' + [...bandSets[b]].sort().join(', '));
}
const nonStarchA = [...bandSets.A].filter((p) => !starchSet.has(p));
console.log(`\nband A minus the heavy starches: ${nonStarchA.length} of ${bandSets.A.size}`);
console.log('  starches in band A: ' + [...bandSets.A].filter((p) => starchSet.has(p)).sort().join(', '));
console.log(`ALL BANDS, distinct plants: ${bandSets.A.size + bandSets.B.size + bandSets.C.size}`);

sub('the sweets, re-derived from categories');
const SWEET_CATS = ['Cookies', 'Cakes & Loaves', 'Bars & Brownies', 'Custards & Puddings'];
const sweets = R.filter((r) => SWEET_CATS.includes(r.category));
console.log(`${SWEET_CATS.join(' + ')} = ${sweets.length}`);

sub('built on a non-starch plant — CANDIDATES (machine, both tests, union)');
interface Cand { slug: string; category: string; why: string; plant: string }
const cands: Cand[] = [];
for (const r of R) {
  const names = r.ingredientNames as string[];
  const hay = [r.title, r.dish ?? '', ...(r.aka ?? [])].join(' | ').toLowerCase();
  // test 1: named
  let named: string | null = null;
  for (const n of names) {
    const c = plantOf(n);
    if (!c || c.band !== 'A' || c.starch || c.aromatic) continue;
    if (any(hay, [c.is]) || words(hay).some((w) => c.is.split(' ').includes(w))) { named = c.is; break; }
  }
  // test 2: dominant by mass among non-water / non-stock / non-fat
  const m = massOf(r);
  let top: [string, number] | null = null;
  for (const [n, g] of m) {
    const c = classify(n);
    if (c && (c.is === 'drink and alcohol' || c.is === 'fat and oil' || (c.kind === 'animal' && any(n, ['stock', 'broth'])))) continue;
    if (!top || g > top[1]) top = [n, g];
  }
  const tc = top ? plantOf(top[0]) : null;
  const dominant = tc && tc.band === 'A' && !tc.starch && !tc.aromatic ? tc.is : null;
  if (named || dominant) {
    cands.push({
      slug: r.slug, category: r.category, plant: (named ?? dominant)!,
      why: [named ? 'named' : '', dominant ? `dominant(${top![0]})` : ''].filter(Boolean).join('+'),
    });
  }
}
console.log(`${cands.length} candidates`);
console.log(cands.map((c) => `  ${c.slug}\t[${c.category}]\t${c.plant}\t${c.why}`).join('\n'));

sub('the same candidates, split three ways so the hand check has a shape');
{
  const CONDIMENT = ['Sauces & Gravies', 'Dressings & Dips', 'Spice Blends & Marinades', 'Toppings & Pickles', 'Drinks'];
  const group = (c: Cand) => SWEET_CATS.includes(c.category) ? 'sweet'
    : CONDIMENT.includes(c.category) ? 'condiment' : 'savoury dish';
  for (const g of ['savoury dish', 'condiment', 'sweet']) {
    const list = cands.filter((c) => group(c) === g);
    console.log(`  ${g}: ${list.length} — ${list.map((c) => c.slug).join(', ')}`);
  }
}

sub('the 24 in Vegetables & Sides, against the rule');
for (const r of R.filter((r) => r.category === 'Vegetables & Sides')) {
  const hit = cands.find((c) => c.slug === r.slug);
  console.log(`  ${hit ? 'RULE-YES' : 'RULE-NO '} ${r.slug}`);
}

/* ==================================================================== §2  pulses */
H('§2  THE BEANS CLAIM');
const PULSE_CANON = new Set([
  'chickpea', 'navy bean', 'black bean', 'pinto bean', 'fava bean', 'gigante bean', 'adzuki bean',
  'black-eyed pea', 'lima bean', 'cannellini bean', 'bean, unspecified', 'lentil', 'urad dal',
  'toor dal', 'mung dal', 'split pea',
]);
const PULSE_FLOUR = ['gram flour', 'chickpea flour', 'urad dal flour', 'roasted gram flour'];
sub('the ticket\'s 43: files mentioning a bean, lentil, chickpea or dal, any form');
const mentions = R.filter((r) => (r.ingredientNames as string[]).some((n) =>
  any(n, ['bean', 'beans', 'lentil', 'lentils', 'chickpea', 'chickpeas', 'dal', 'peas', 'pea'])));
console.log(`${mentions.length} files mention one, on the loosest reading`);
console.log('  ' + mentions.map((r) => r.slug).join(', '));

sub('gate 1 — a pulse is the main thing');
const pulseMain: any[] = [];
for (const r of R) {
  const names = r.ingredientNames as string[];
  const hay = [r.title, r.dish ?? '', ...(r.aka ?? [])].join(' | ').toLowerCase();
  const pulses = names.map((n) => ({ n, c: classify(n) })).filter((x) =>
    x.c && PULSE_CANON.has(x.c.is) && !any(x.n, PULSE_FLOUR));
  if (!pulses.length) continue;
  const m = massOf(r);
  let top: [string, number] | null = null;
  for (const [n, g] of m) {
    const c = classify(n);
    if (c && (c.is === 'drink and alcohol' || c.is === 'fat and oil')) continue;
    if (!top || g > top[1]) top = [n, g];
  }
  const topIsPulse = top ? pulses.some((p) => p.n === top![0]) : false;
  const namedPulse = pulses.some((p) => any(hay, [p.c!.is.replace(/, unspecified/, '')]) ||
    any(hay, ['dal', 'chana', 'rajma', 'hummus', 'falafel', 'bean', 'beans', 'lentil', 'chickpea', 'pea']));
  if (topIsPulse || namedPulse) {
    pulseMain.push({ slug: r.slug, category: r.category, servings: r.metadata?.servings,
      pulse: pulses.map((p) => p.n).join('/'), top: top?.[0], why: [topIsPulse ? 'dominant' : '', namedPulse ? 'named' : ''].filter(Boolean).join('+') });
  }
}
console.log(`${pulseMain.length} candidates through gate 1`);
console.log(pulseMain.map((p) => `  ${p.slug}\t[${p.category}]\tserves ${p.servings}\t${p.pulse}\ttop=${p.top}\t${p.why}`).join('\n'));

sub('tofu and soy, reported separately and never folded in');
const tofu = R.filter((r) => (r.ingredientNames as string[]).some((n) => any(n, ['tofu', 'abura-age'])));
console.log(`${tofu.length} files: ${tofu.map((r) => r.slug).join(', ')}`);

/* ==================================================================== §3  persona one */
H('§3  COOKING FOR THE DAY — the query');

/*
 * The assumed kitchen, in two layers, both printed in full before any slug is reported.
 *
 * staples.json's 31 are the floor and they are NOT enough on their own: its doctrine is written
 * for a SHOPPING LIST — "everything a recipe wants by the cup or the pound is shopping, however
 * ordinary it is. Flour, butter, sugar, eggs, milk and rice are shopping." That is the right rule
 * for what to print on a list and the wrong rule for what is in a kitchen, because a person who
 * cooks has flour. Running the query on staples alone returns 0 recipes and the 0 is an artefact
 * of the doctrine rather than a fact about the shelf.
 *
 * So: THE CUPBOARD is the ordinary dry goods a cooking household keeps and staples.json calls
 * shopping. THE FRIDGE is the perishables. Both are capped — any answer can be manufactured by
 * adding ingredients, and the sensitivity runs below say how much this one moves.
 */
const CUPBOARD = [
  'all-purpose flour', 'plain flour', 'flour', 'granulated sugar', 'sugar', 'light brown sugar',
  'dark brown sugar', 'brown sugar', 'long-grain white rice', 'rice', 'rolled oats',
  'canned whole tomatoes', 'crushed tomatoes', 'canned crushed tomatoes', 'tomato paste',
  'white sandwich bread', 'breadcrumbs', 'chicken stock', 'vegetable stock',
];
const FRIDGE = [
  'eggs', 'egg', 'unsalted butter', 'butter', 'whole milk', 'milk', 'plain yogurt',
  'whole-milk yogurt', 'sharp cheddar', 'yellow onion', 'onion', 'onions', 'garlic',
  'fresh ginger', 'scallions', 'scallion', 'carrot', 'carrots', 'celery', 'lemon', 'lemon juice',
  'flat-leaf parsley', 'cilantro',
];
const KITCHEN = [...CUPBOARD, ...FRIDGE];
const KITCHEN_PLUS = [...KITCHEN, 'tomato', 'tomatoes', 'yukon gold potatoes', 'potatoes'];

const isStaple = (n: string) => matchesStaple(n, STAPLES.staples.flatMap((s: any) => s.patterns)) &&
  !matchesStaple(n, STAPLES.staples.flatMap((s: any) => s.except ?? []));

function servingsOf(r: any): number | null {
  const s = String(r.metadata?.servings ?? '').trim();
  return /^\d+$/.test(s) ? Number(s) : null;
}
function isHeavyStarch(r: any): boolean {
  const m = massOf(r);
  let top: [string, number] | null = null;
  for (const [n, g] of m) { const c = classify(n); if (c && (c.is === 'drink and alcohol' || c.is === 'fat and oil')) continue; if (!top || g > top[1]) top = [n, g]; }
  const tc = top ? classify(top[0]) : null;
  return !!(tc?.starch) || ['Breads', 'Flatbreads & Pancakes', 'Pastry & Doughs', 'Noodles', 'Pasta', 'Pizzas'].includes(r.category);
}
function runQuery(fridge: string[], label: string) {
  const hits = R.filter((r) => {
    const s = servingsOf(r);
    if (s === null || s > 2) return false;
    if (isHeavyStarch(r)) return false;
    return (r.ingredientNames as string[]).every((n) => isStaple(n) || any(n, fridge));
  });
  sub(`${label} — ${hits.length} recipes`);
  console.log(hits.map((r) => `  ${r.slug}\t[${r.category}]\tserves ${r.metadata?.servings}\t${(r.ingredientNames as string[]).join(', ')}`).join('\n'));
  return hits;
}
console.log('THE ASSUMED KITCHEN — staples.json\'s 31, plus:');
console.log(`  cupboard (${CUPBOARD.length}): ${CUPBOARD.join(', ')}`);
console.log(`  fridge   (${FRIDGE.length}): ${FRIDGE.join(', ')}`);
console.log(`\nrecipes serving 1 or 2 as written: ${R.filter((r) => (servingsOf(r) ?? 99) <= 2).length}`);
console.log(`  of those, not a heavy starch: ${R.filter((r) => (servingsOf(r) ?? 99) <= 2 && !isHeavyStarch(r)).length}`);
runQuery([], 'staples only — the doctrine as written, nothing added');
runQuery(CUPBOARD, 'staples + cupboard, no fridge');
runQuery(KITCHEN, 'staples + cupboard + fridge  <<< THE ANSWER');
runQuery(KITCHEN_PLUS, 'staples + kitchen + tomato + potato (sensitivity)');

sub('how far off the rest are — serves <=2, not a starch, by number of missing ingredients');
{
  const buckets = new Map<number, string[]>();
  for (const r of R) {
    const s = servingsOf(r);
    if (s === null || s > 2 || isHeavyStarch(r)) continue;
    const missing = (r.ingredientNames as string[]).filter((n) => !isStaple(n) && !any(n, KITCHEN));
    buckets.set(missing.length, [...(buckets.get(missing.length) ?? []), `${r.slug} (${missing.join(', ')})`]);
  }
  for (const [k, v] of [...buckets].sort((a, b) => a[0] - b[0])) {
    console.log(`  missing ${k}: ${v.length}`);
    if (k <= 2) for (const line of v) console.log(`      ${line}`);
  }
}

sub('the whole shelf, ignoring servings — how much of it needs no store run');
{
  const buckets = new Map<number, number>();
  const zero: string[] = [];
  for (const r of R) {
    const missing = (r.ingredientNames as string[]).filter((n) => !isStaple(n) && !any(n, KITCHEN));
    const k = Math.min(missing.length, 6);
    buckets.set(k, (buckets.get(k) ?? 0) + 1);
    if (missing.length === 0) zero.push(`${r.slug} [${r.category}] serves ${r.metadata?.servings}`);
  }
  console.log([...buckets].sort((a, b) => a[0] - b[0]).map(([k, v]) => `  missing ${k === 6 ? '6+' : k}: ${v}`).join('\n'));
  console.log(`  the ${zero.length} that need nothing:`);
  for (const z of zero) console.log(`      ${z}`);
}

/* ==================================================================== §4  the week */
H('§4  THE FAMILY ROTATION — protein and cuisine matrix');
const PROTEIN: Record<string, string[]> = {
  beef: ['beef', 'brisket', 'oxtail', 'short ribs', 'chuck', 'veal'], pork: ['pork', 'bacon', 'ham', 'sausage', 'pancetta', 'chorizo'],
  chicken: ['chicken'], lamb: ['lamb'], turkey: ['turkey'], fish: ['fish', 'salmon', 'cod', 'tuna', 'mackerel', 'anchovy', 'whitefish', 'carp', 'yellowtail'],
  shellfish: ['shrimp', 'prawns', 'crab', 'clams', 'seafood'], egg: ['egg', 'eggs'],
  pulse: [...PULSE_CANON], tofu: ['tofu', 'abura-age'], dairy: ['paneer', 'halloumi'],
};
/*
 * A stock is not the protein of a dish, and neither is a sauce.
 *
 * Without this, "chicken stock" makes a risotto a chicken dinner and "fish sauce" makes every
 * Vietnamese and Thai recipe a fish dinner — which would let the rotation look far more varied
 * than any household eating it would agree. "egg noodles" is the same error in a different
 * aisle. Nothing here guesses: it drops names that are plainly a flavouring rather than the meat.
 */
const NOT_THE_PROTEIN = [
  'stock', 'broth', 'sauce', 'fat', 'drippings', 'tallow', 'lard', 'schmaltz', 'powder',
  'bouillon', 'katsuobushi', 'dashi', 'paste', 'seasoning', 'noodles', 'wrappers', 'pasta',
  'bones', 'carcasses', 'shells', 'marrow', 'beaten egg', 'egg wash',
];
function proteinsOf(r: any): string[] {
  const out = new Set<string>();
  for (const n of r.ingredientNames as string[]) {
    if (any(n, NOT_THE_PROTEIN)) continue;
    const c = classify(n);
    for (const [p, pats] of Object.entries(PROTEIN)) {
      if (p === 'pulse') { if (c && PULSE_CANON.has(c.is)) out.add(p); continue; }
      if (any(n, pats)) out.add(p);
    }
  }
  return [...out];
}
/*
 * Two dinner pools, because the loose one flatters the answer.
 *
 *  LOOSE  everything a menu might put in front of you at seven o'clock, including the fried
 *         things and the dumplings — which lets crab-rangoon and char-siu-bao stand in for a
 *         night's dinner, and they do not.
 *  TIGHT  the categories that are a meal on their own. This is the headline.
 */
const LOOSE_CATS = ['Stews & Braises', 'Rice, Beans & Grains', 'Soups', 'Noodles', 'Stir-Fries', 'Pasta', 'Smoked & Grilled', 'Fried & Crispy', 'Vegetables & Sides', 'Salads', 'Eggs', 'Dumplings & Rolls'];
const TIGHT_CATS = ['Stews & Braises', 'Rice, Beans & Grains', 'Soups', 'Noodles', 'Stir-Fries', 'Pasta', 'Smoked & Grilled', 'Eggs'];
for (const [poolName, cats] of [['TIGHT — a meal on its own', TIGHT_CATS], ['LOOSE — anything a menu might serve at seven', LOOSE_CATS]] as [string, string[]][]) {
  sub(poolName);
  const dinners = R.filter((r) => (servingsOf(r) ?? 0) >= 4 && cats.includes(r.category));
  console.log(`recipes that could be a dinner for four or more: ${dinners.length}`);
  const byProtein = new Map<string, string[]>();
  for (const r of dinners) {
    const ps = proteinsOf(r);
    const key = ps.length ? ps.sort().join('+') : '(none)';
    byProtein.set(key, [...(byProtein.get(key) ?? []), r.slug]);
  }
  console.log('protein combinations, by count:');
  for (const [k, v] of [...byProtein].sort((a, b) => b[1].length - a[1].length).slice(0, 20)) console.log(`  ${v.length}\t${k}`);
  const single = new Map<string, number>();
  for (const r of dinners) for (const p of proteinsOf(r)) single.set(p, (single.get(p) ?? 0) + 1);
  console.log('single proteins across those dinners:');
  for (const [k, v] of [...single].sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);
  const counters = new Map<string, number>();
  for (const r of dinners) for (const c of r.counters) counters.set(c, (counters.get(c) ?? 0) + 1);
  console.log('counters (the nearest thing to a cuisine) across those dinners:');
  for (const [k, v] of [...counters].sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);

  /*
   * How long the streak can run, exactly.
   *
   * "A week without repeating a protein or a cuisine" is a bipartite matching: one night is one
   * (protein, counter) pair, and no protein and no counter may be used twice. The longest possible
   * streak is therefore the MAXIMUM MATCHING between proteins and counters over the edges the
   * shelf actually has — which is a number rather than a guess about whether seven felt hard.
   */
  sub('the longest streak, by maximum matching over (protein × counter)');
  const edges = new Map<string, Map<string, string>>();   // protein -> counter -> a slug
  for (const r of dinners) for (const p of proteinsOf(r)) for (const c of r.counters) {
    if (!edges.has(p)) edges.set(p, new Map());
    if (!edges.get(p)!.has(c)) edges.get(p)!.set(c, r.slug);
  }
  const proteins = [...edges.keys()];
  const match = new Map<string, string>();                // counter -> protein
  const tryAugment = (p: string, seen: Set<string>): boolean => {
    for (const c of edges.get(p)!.keys()) {
      if (seen.has(c)) continue;
      seen.add(c);
      if (!match.has(c) || tryAugment(match.get(c)!, seen)) { match.set(c, p); return true; }
    }
    return false;
  };
  for (const p of proteins) tryAugment(p, new Set());
  console.log(`proteins available: ${proteins.length}; counters available: ${counters.size}`);
  console.log(`LONGEST STREAK = ${match.size} nights`);
  for (const [c, p] of match) console.log(`  ${p.padEnd(10)} @ ${c.padEnd(24)} e.g. ${edges.get(p)!.get(c)}`);
  const unmatched = proteins.filter((p) => ![...match.values()].includes(p));
  console.log(`proteins left over: ${unmatched.join(', ') || '(none)'}`);
  console.log('how many counters each protein can reach — the thinner the protein, the sooner it binds:');
  for (const [p, m] of [...edges].sort((a, b) => a[1].size - b[1].size)) {
    console.log(`  ${String(m.size).padStart(2)}\t${p}\t${[...m.keys()].join(', ')}`);
  }
}

/* ==================================================================== §5  branches */
H('§5  HOLIDAY GUESTS — branches off buildSchedule');
console.log(`BREAK_MINUTES = ${BREAK_MINUTES} (src/lib/schedule.ts, reused rather than reinvented)`);
interface Row { slug: string; lanes: number; branches: number; untimed: number; handsOn: number; branchIds: string[] }
const rows: Row[] = [];
for (const r of R) {
  let s: Schedule;
  try { s = buildSchedule(r); } catch { console.log(`  !! buildSchedule failed: ${r.slug}`); continue; }
  const critical = new Set(s.criticalPath);
  const criticalTasks = s.tasks.filter((t) => critical.has(t.id));
  const overlapsCritical = (t: Task) => criticalTasks.some((c) => t.start < c.end && c.start < t.end && c.id !== t.id);
  /*
   * Hands-on minutes per TASK, split timer by timer the way buildSchedule splits the totals.
   *
   * task.attention is deliberately cautious — a step with any hands-on timer in it is labelled
   * hands-on, which is right for a label and wrong for arithmetic. baguette's one such step is
   * 128 minutes of which 8 are your hands and 120 are a prove; counting task.minutes would put a
   * two-hour hand-off branch on a recipe that has eight minutes of work in it. schedule.ts says
   * this about itself at lines 167-180 and then does the same thing there.
   */
  const stepOf = new Map<number, any>(r.steps.map((st: any) => [st.index, st]));
  const handsOnOf = (t: Task) => {
    const step = stepOf.get(Number(t.id.slice(1)));
    if (!step) return 0;
    const all = step.timers ?? [];
    const readings = readTimers(all, t.label);
    let sum = 0;
    all.forEach((timer: any, i: number) => {
      if (timer.minutes === null || !Number.isFinite(timer.minutes)) return;
      if (readings[i].attention !== 'unattended') sum += timer.minutes;
    });
    return sum;
  };
  let branches = 0; const branchIds: string[] = [];
  for (const lane of s.lanes) {
    if (lane.some((t) => critical.has(t.id))) continue;              // 1 — not the critical lane
    const hands = lane.reduce((sum, t) => sum + handsOnOf(t), 0);
    if (hands < BREAK_MINUTES) continue;                             // 2 — real length
    if (!lane.some(overlapsCritical)) continue;                      // 3 — concurrent, not merely early
    branches++; branchIds.push(lane.map((t) => t.id).join('>'));
  }
  rows.push({ slug: r.slug, lanes: s.lanes.length, branches, untimed: s.untimedCount, handsOn: s.handsOnMinutes, branchIds });
}
const dist = (pick: (r: Row) => number) => {
  const m = new Map<number, number>();
  for (const r of rows) m.set(pick(r), (m.get(pick(r)) ?? 0) + 1);
  return [...m].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join('  ');
};
console.log(`recipes scheduled: ${rows.length}`);
console.log(`raw lane counts      ${dist((r) => r.lanes)}`);
console.log(`filtered branches    ${dist((r) => r.branches)}`);
console.log(`\nraw: more than one lane        = ${rows.filter((r) => r.lanes > 1).length}`);
console.log(`filtered: >= 1 hand-off branch = ${rows.filter((r) => r.branches >= 1).length}`);
console.log(`filtered: >= 2 hand-off branch = ${rows.filter((r) => r.branches >= 2).length}`);
console.log(`no timers at all (cannot say)  = ${rows.filter((r) => r.handsOn === 0 && r.untimed > 0).length}`);
sub('the recipes with a hand-off-able branch, most branches first');
for (const r of rows.filter((r) => r.branches >= 1).sort((a, b) => b.branches - a.branches || b.handsOn - a.handsOn)) {
  console.log(`  ${r.branches}\t${r.slug}\tlanes=${r.lanes}\thandsOn=${r.handsOn}\tuntimed=${r.untimed}\t${r.branchIds.join(' | ')}`);
}

/* ==================================================================== §6  day one */
H('§6  WHAT THE SHELF COULD SERVE ON DAY ONE');
console.log(`slack declared     ${R.filter((r) => r.slack).length} / ${R.length}`);
console.log(`washing-up declared${R.filter((r) => r.washingUp).length} / ${R.length}`);
console.log(`keeps declared     ${R.filter((r) => r.keeps).length} / ${R.length}  (T-011-04 mid-backfill)`);
console.log(`capacity declared  ${R.filter((r) => r.capacity).length} / ${R.length}  (T-011-02 not landed)`);
console.log(`timers present     ${R.filter((r) => r.steps.some((s: any) => s.timers.length)).length} / ${R.length}`);
console.log(`pairs-with         ${R.filter((r) => (r.pairsWith ?? []).length).length} / ${R.length}`);
console.log(`serves >= 8        ${R.filter((r) => (servingsOf(r) ?? 0) >= 8).length}`);
console.log(`serves <= 2        ${R.filter((r) => (servingsOf(r) ?? 99) <= 2).length}`);
