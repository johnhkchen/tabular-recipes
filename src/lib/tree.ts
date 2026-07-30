/*
 * Turns the flat step list into the merge tree the table is a picture of.
 *
 * Leaves are ingredients (one row each). Internal nodes are operations. The edges come
 * from cooklang's intermediate-preparation references (`@&(~1)batter{}`), which the
 * parser resolves to step indices — so the tree is written in the .cook file, not guessed.
 */
import { cleanLabel } from './label.ts';


export interface RawIngredient {
  name: string;
  /** For reading: "1 1/2 cups". */
  quantity: string;
  note: string | null;
  display: string;
  /** For arithmetic: the same amount as a number, so two recipes can be added together. */
  amount: { value: number | null; unit: string | null };
}

export interface RawTimer {
  /** `~rise{90%min}` — the name says what kind of wait it is. */
  name: string | null;
  text: string;
  minutes: number | null;
  attention: 'hands-on' | 'unattended';
}

export interface RawStep {
  index: number;
  /** The step text with its ingredients removed — see cleanLabel(). */
  rawLabel: string;
  /** A `>> step.N: …` line in the recipe wins over the derived label. */
  labelOverride: string | null;
  ingredients: RawIngredient[];
  refs: number[];
  timers: RawTimer[];
}

export interface RawRecipe {
  slug: string;
  /** Repo-relative path of the .cook file it came from. */
  path: string;
  title: string;
  category: string;
  tags: string[];
  /** Where you would buy this. A recipe can sit at several counters. */
  counters: string[];
  /** True when the counters came from the category fallback rather than the file. */
  countersInferred: boolean;
  /** What this and its equipment variants have in common. */
  dish: string;
  /** The equipment that makes this variant different; null is the plain way. */
  kit: string | null;
  /** What people call it when they order it. */
  aka: string[];
  /** Slugs of recipes that go with this one. Made mutual at build time. */
  pairsWith: string[];
  variants: { slug: string; title: string; kit: string | null }[];
  /** Lowercased ingredient names, for searching. */
  ingredientNames: string[];
  /** Every #pan{} and #stand mixer{} the recipe asks for. */
  cookware: string[];
  metadata: Record<string, string>;
  steps: RawStep[];
  warnings?: string[];
}

export interface LeafNode {
  kind: 'ingredient';
  display: string;
  name: string;
  quantity: string;
  note: string | null;
  /** 1 — ingredients always sit in the leftmost column. */
  col: number;
  row: number;
  rowSpan: 1;
  parent: OpNode | null;
}

export interface OpNode {
  kind: 'op';
  label: string;
  stepIndex: number;
  children: TreeNode[];
  /** 1 + the deepest child's column. */
  col: number;
  row: number;
  rowSpan: number;
  parent: OpNode | null;
}

export type TreeNode = LeafNode | OpNode;

export interface RecipeTree {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  metadata: Record<string, string>;
  /** Full-width rows above the table: steps with no ingredients and no refs. */
  headers: string[];
  /** Same, but written after the first real step. */
  footers: string[];
  root: OpNode;
  leaves: LeafNode[];
}

const isOpStep = (step: RawStep) => step.ingredients.length > 0 || step.refs.length > 0;

export function buildTree(recipe: RawRecipe): RecipeTree {
  const headers: string[] = [];
  const footers: string[] = [];
  const ops = new Map<number, OpNode>();
  let seenOp = false;

  for (const step of recipe.steps) {
    const label = step.labelOverride ?? cleanLabel(step.rawLabel);
    if (!isOpStep(step)) {
      // A full-width row is a whole sentence, so give it back its capital letter.
      (seenOp ? footers : headers).push(label ? label[0].toUpperCase() + label.slice(1) : '');
      continue;
    }
    seenOp = true;
    ops.set(step.index, {
      kind: 'op',
      label,
      stepIndex: step.index,
      children: [],
      col: 0,
      row: 0,
      rowSpan: 0,
      parent: null,
    });
  }

  if (ops.size === 0) {
    throw new Error(`${recipe.slug}: no step uses an ingredient, so there is no table to draw.`);
  }

  // Wire children: referenced steps first, then this step's own ingredients.
  for (const step of recipe.steps) {
    const node = ops.get(step.index);
    if (!node) continue;

    for (const ref of step.refs) {
      const child = ops.get(ref);
      if (!child) {
        throw new Error(
          `${recipe.slug}: step ${step.index + 1} references step ${ref + 1}, which makes nothing.`,
        );
      }
      if (child.parent) {
        throw new Error(
          `${recipe.slug}: step ${ref + 1} is used by two later steps. A table is a tree, ` +
            `so a preparation can only flow into one place. Split the recipe or duplicate the step.`,
        );
      }
      child.parent = node;
      node.children.push(child);
    }

    for (const ing of step.ingredients) {
      node.children.push({
        kind: 'ingredient',
        display: ing.display,
        name: ing.name,
        quantity: ing.quantity,
        note: ing.note,
        col: 1,
        row: 0,
        rowSpan: 1,
        parent: node,
      });
    }
  }

  const roots = [...ops.values()].filter((op) => !op.parent);
  if (roots.length > 1) {
    const labels = roots.map((r) => `step ${r.stepIndex + 1} ("${r.label}")`).join(', ');
    throw new Error(
      `${recipe.slug}: ${roots.length} steps end the recipe (${labels}). ` +
        `Add an @&(~1)… reference so every branch flows into one final step.`,
    );
  }
  const root = roots[0];

  assignColumns(root);
  const leaves: LeafNode[] = [];
  assignRows(root, leaves);

  return {
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    tags: recipe.tags,
    metadata: recipe.metadata,
    headers,
    footers,
    root,
    leaves,
  };
}

/** col(op) = 1 + max(col(children)); ingredients are always column 1. */
function assignColumns(node: TreeNode): number {
  if (node.kind === 'ingredient') return 1;
  node.col = 1 + Math.max(...node.children.map(assignColumns));
  return node.col;
}

/*
 * Rows are the leaves in depth-first order, with the deepest child first. That ordering is
 * what makes the staircase descend to the right, and it matches how these tables are drawn
 * by hand: the long chain of operations rides along the top.
 */
function assignRows(node: TreeNode, leaves: LeafNode[]): void {
  if (node.kind === 'ingredient') {
    node.row = leaves.length;
    leaves.push(node);
    return;
  }
  node.children.sort((a, b) => b.col - a.col);
  const start = leaves.length;
  for (const child of node.children) assignRows(child, leaves);
  node.row = start;
  node.rowSpan = leaves.length - start;
}
