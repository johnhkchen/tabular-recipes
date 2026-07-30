/*
 * An operation cell holds a verb, not a sentence: "melt", "mix", "fold in",
 * "bake at 350°F for 30 min". The parse step hands us the sentence with its
 * ingredients removed; this tidies up what the removal left behind.
 */

// Words that end up dangling once the ingredients are gone ("mix with", "fold in to").
const CONNECTIVES = new Set([
  'with', 'and', 'to', 'into', 'of', 'for', 'in', 'on', 'the', 'a', 'an',
  'then', 'until', 'from', 'plus', 'together', 'onto', 'at', 'over',
]);

export function cleanLabel(raw: string): string {
  const tidied = raw
    .replace(/,\s*and\b/gi, ',')    // "a, b, and c" -> "a, b, c"
    .replace(/\s*,\s*/g, ' ')       // the separators themselves
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,;:]+|[.,;:]+$/g, '')
    .trim();

  // One trailing connective, not a greedy sweep: "fold in to" must keep its "in".
  const words = tidied.split(' ').filter(Boolean);
  if (words.length > 1 && CONNECTIVES.has(words.at(-1)!.toLowerCase())) words.pop();

  const out = words.join(' ');
  // Operations read as lowercase verbs in the table; the first word is never an acronym.
  return out ? out[0].toLowerCase() + out.slice(1) : '';
}
