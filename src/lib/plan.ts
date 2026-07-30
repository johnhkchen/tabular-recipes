/*
 * What you are cooking this week.
 *
 * A menu where every item leads to a table instead of a cart still wants a cart. This is it:
 * a short list of recipe slugs, each with a multiplier, kept in this browser only. The
 * shopping list on /list/ is built from it.
 *
 * Three things this file is careful about, because all three have bitten pages before:
 *
 *   1. localStorage can THROW — not just fail. Safari in private browsing, an iframe with
 *      storage blocked, a full quota. Every touch is wrapped, and an in-memory copy keeps
 *      the page working for the session even when nothing can be written down.
 *   2. The stored shape is VERSIONED. Data written by a different shape is not guessed at;
 *      it reads as an empty plan rather than throwing halfway through a page.
 *   3. A change has to reach every button on the page, including ones this module did not
 *      render. Changes are announced on `window`, so anything listening hears them — and
 *      the browser's own `storage` event carries changes made in another tab.
 *
 * No DOM, no imports but a type. A test or a node script can call all of it.
 */
import type { Amount } from './units.ts';

/** One key, alongside the recipe table's `tabular-recipes:<slug>` cross-off marks. */
export const PLAN_KEY = 'tabular-recipes:plan';

/**
 * Bumped only when the stored shape changes in a way this reader cannot understand.
 * Anything written under a different version is ignored — see readPlan().
 */
const VERSION = 1;

/** Fired on `window` whenever the plan changes, in this tab or another. */
export const PLAN_EVENT = 'tabular-recipes:plan';

export interface PlanItem {
  slug: string;
  /** 1 is the recipe as written. 0.5 is half of it, 2 is twice. Always finite and > 0. */
  multiplier: number;
}

interface StoredPlan {
  version: number;
  items: PlanItem[];
}

/** The multipliers the UI offers. Any finite positive number is accepted by setMultiplier. */
export const MULTIPLIERS = [0.5, 1, 2, 3] as const;

/** "×1/2", "×1", "×2" — the way it is written on a button and read aloud. */
export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0.5) return '×1/2';
  if (multiplier === 1 / 3) return '×1/3';
  if (multiplier === 1.5) return '×1 1/2';
  return `×${Number(multiplier.toFixed(2))}`;
}

/**
 * An amount, times the multiplier.
 *
 * **An amount with no number does not scale.** "Salt, to taste" is still salt to taste at
 * twice the recipe; doubling nothing gives nothing, and inventing a number for it would be
 * a lie about what the recipe says. The page says so in words next to the multiplier.
 */
export function scaleAmount(amount: Amount, multiplier: number): Amount {
  if (amount.value === null || !Number.isFinite(amount.value)) return amount;
  if (!Number.isFinite(multiplier)) return amount;
  return { value: amount.value * multiplier, unit: amount.unit };
}

/* ---- storage ------------------------------------------------------------- */

/**
 * localStorage, or null if there is not one we may touch. Reading the property itself
 * throws in a sandboxed iframe, so even that is inside the try.
 */
function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/**
 * What we last read or wrote.
 *
 * This is what makes a plan usable when storage refuses: the buttons still agree with each
 * other for as long as the tab is open. It just will not survive a reload, which is the
 * honest limit of private browsing and not something a page should pretend around.
 */
let cache: PlanItem[] | null = null;

const listeners = new Set<(items: PlanItem[]) => void>();

/** A slug is a slug; a multiplier is a positive finite number or it is 1. */
function cleanItem(raw: unknown): PlanItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const { slug, multiplier } = raw as { slug?: unknown; multiplier?: unknown };
  if (typeof slug !== 'string' || slug.trim() === '') return null;
  const m = typeof multiplier === 'number' && Number.isFinite(multiplier) && multiplier > 0
    ? multiplier
    : 1;
  return { slug: slug.trim(), multiplier: m };
}

/** Keeps the first mention of a slug, so a duplicated entry cannot double a recipe. */
function cleanItems(raw: unknown): PlanItem[] {
  if (!Array.isArray(raw)) return [];
  const out: PlanItem[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    const item = cleanItem(entry);
    if (!item || seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
  }
  return out;
}

/**
 * The plan, oldest addition first.
 *
 * Anything unreadable — no storage, bad JSON, a version this build does not know — reads as
 * an empty plan. That is a page with an empty list on it, which is recoverable; a throw
 * halfway down the page is not. A plan written under a future version is left where it is
 * until something is added here, at which point this version's shape replaces it.
 */
export function readPlan(): PlanItem[] {
  if (cache) return cache.map((item) => ({ ...item }));

  const store = storage();
  if (!store) return [];

  let raw: string | null = null;
  try {
    raw = store.getItem(PLAN_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return [];
  }

  const stored = parsed as Partial<StoredPlan> | null;
  if (!stored || typeof stored !== 'object' || stored.version !== VERSION) return [];

  cache = cleanItems(stored.items);
  return cache.map((item) => ({ ...item }));
}

/** Write, remember, and tell everyone. Returns the plan as it now stands. */
function commit(items: PlanItem[]): PlanItem[] {
  cache = items;
  const store = storage();
  if (store) {
    try {
      const stored: StoredPlan = { version: VERSION, items };
      store.setItem(PLAN_KEY, JSON.stringify(stored));
    } catch {
      /*
       * Private browsing, or a full quota. The plan lives in `cache` for this session, so
       * the page keeps working; it just will not be here after a reload.
       */
    }
  }
  announce(items);
  return items.map((item) => ({ ...item }));
}

function announce(items: PlanItem[]): void {
  for (const listener of [...listeners]) listener(items.map((item) => ({ ...item })));
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: { items } }));
  } catch {
    /* no CustomEvent (very old browser, or a non-DOM runtime) — local listeners still ran */
  }
}

/* ---- reading ------------------------------------------------------------- */

export function isInPlan(slug: string): boolean {
  return readPlan().some((item) => item.slug === slug);
}

/** The multiplier this recipe is planned at, or null if it is not in the plan. */
export function multiplierOf(slug: string): number | null {
  return readPlan().find((item) => item.slug === slug)?.multiplier ?? null;
}

export function planSize(): number {
  return readPlan().length;
}

/* ---- writing ------------------------------------------------------------- */

/** Adding something already in the plan does not add it twice, and does not move it. */
export function addToPlan(slug: string, multiplier = 1): PlanItem[] {
  const item = cleanItem({ slug, multiplier });
  if (!item) return readPlan();
  const items = readPlan();
  if (items.some((existing) => existing.slug === item.slug)) return items;
  return commit([...items, item]);
}

export function removeFromPlan(slug: string): PlanItem[] {
  const items = readPlan();
  const kept = items.filter((item) => item.slug !== slug);
  return kept.length === items.length ? items : commit(kept);
}

/** In or out. Returns whether it is in the plan afterwards, which is what a button needs. */
export function togglePlan(slug: string, multiplier = 1): boolean {
  if (isInPlan(slug)) {
    removeFromPlan(slug);
    return false;
  }
  addToPlan(slug, multiplier);
  return true;
}

/** Setting a multiplier on a recipe that is not in the plan adds it at that multiplier. */
export function setMultiplier(slug: string, multiplier: number): PlanItem[] {
  const item = cleanItem({ slug, multiplier });
  if (!item) return readPlan();
  const items = readPlan();
  if (!items.some((existing) => existing.slug === item.slug)) return commit([...items, item]);
  return commit(items.map((existing) => (existing.slug === item.slug ? item : existing)));
}

export function clearPlan(): PlanItem[] {
  if (readPlan().length === 0) return [];
  return commit([]);
}

/* ---- listening ----------------------------------------------------------- */

let wired = false;

/**
 * Wire the two ways a change can arrive from outside this module instance: our own
 * announcement (so a button rendered by another component hears it) and the browser's
 * `storage` event (so a second tab does).
 */
function wire(): void {
  if (wired || typeof window === 'undefined') return;
  wired = true;

  window.addEventListener(PLAN_EVENT, (event) => {
    const detail = (event as CustomEvent<{ items?: unknown }>).detail;
    const items = cleanItems(detail?.items);
    // Only adopt someone else's items; our own commit() already set the cache and called
    // the local listeners, and re-running them here would fire every handler twice.
    if (cache && sameItems(cache, items)) return;
    cache = items;
    for (const listener of [...listeners]) listener(items.map((item) => ({ ...item })));
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== null && event.key !== PLAN_KEY) return;
    cache = null;
    const items = readPlan();
    for (const listener of [...listeners]) listener(items);
  });
}

function sameItems(a: PlanItem[], b: PlanItem[]): boolean {
  return (
    a.length === b.length &&
    a.every((item, i) => item.slug === b[i].slug && item.multiplier === b[i].multiplier)
  );
}

/**
 * Call `listener` whenever the plan changes — here, in another component, or in another
 * tab. Returns the function that stops it. The listener is not called on subscribe; a
 * caller that wants to paint itself first should call readPlan() itself, which is one line
 * and makes the first paint obvious in the calling code.
 */
export function onPlanChange(listener: (items: PlanItem[]) => void): () => void {
  wire();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Only for tests: forget the in-memory copy so the next read goes to storage. */
export function resetPlanCache(): void {
  cache = null;
}

/* ---- what the list page fetches ------------------------------------------ */

/*
 * The shape of /plan.json, emitted by src/pages/plan.json.ts. It lives here because both
 * ends of that fetch — the endpoint that writes it and the page that reads it — should be
 * held to one definition.
 */

export interface PlanIngredient {
  name: string;
  /** For reading, exactly as the recipe writes it: "1 1/2 cups", "2 large", "" for none. */
  quantity: string;
  /** For adding up. The same shape as units.ts's Amount. */
  amount: Amount;
  /** Present and true when src/data/staples.json claims this name. Omitted otherwise. */
  staple?: true;
}

export interface PlanRecipe {
  slug: string;
  title: string;
  counters: string[];
  /** The author's own words, e.g. "9" or "4 to 6". Null when the recipe does not say. */
  servings: string | null;
  ingredients: PlanIngredient[];
}
