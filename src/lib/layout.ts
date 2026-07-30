/*
 * Turns the merge tree into table cells with rowspans and colspans.
 *
 * Every ingredient owns one row. Every operation owns one cell, spanning the rows of the
 * ingredients that feed it. Where a row's ingredient joins the recipe late — flour going
 * straight into "fold in" — the columns it skips become one merged blank cell.
 */
import type { RecipeTree, TreeNode } from './tree';

export interface Cell {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  kind: 'ingredient' | 'op' | 'blank';
  text: string;
  /** Stable per-recipe id, so check-off state survives a reload. */
  id: string;
  /** Ingredient cells keep their pieces apart, so the quantities can line up. */
  parts?: { quantity: string; note: string | null; name: string };
}

export interface Grid {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  metadata: Record<string, string>;
  headers: string[];
  footers: string[];
  colCount: number;
  rowCount: number;
  rows: Cell[][];
}

export function layout(tree: RecipeTree): Grid {
  const cells: Cell[] = [];

  for (const leaf of tree.leaves) {
    cells.push({
      row: leaf.row,
      col: 1,
      rowSpan: 1,
      colSpan: 1,
      kind: 'ingredient',
      text: leaf.display,
      id: `i${leaf.row}`,
      parts: { quantity: leaf.quantity, note: leaf.note, name: leaf.name },
    });
  }

  walkOps(tree.root, (op) => {
    cells.push({
      row: op.row,
      col: op.col,
      rowSpan: op.rowSpan,
      colSpan: 1,
      kind: 'op',
      text: op.label,
      id: `s${op.stepIndex}`,
    });

    // Gaps between a child's column and this op's column. Consecutive children that skip
    // the same columns merge into a single blank cell.
    let run: { from: number; to: number; row: number; span: number } | null = null;
    const flush = () => {
      if (!run) return;
      cells.push({
        row: run.row,
        col: run.from,
        rowSpan: run.span,
        colSpan: run.to - run.from + 1,
        kind: 'blank',
        text: '',
        id: `b${run.row}-${run.from}`,
      });
      run = null;
    };

    for (const child of op.children) {
      const from = child.col + 1;
      const to = op.col - 1;
      if (to < from) {
        flush();
        continue;
      }
      if (run && run.from === from && run.to === to) {
        run.span += rowSpanOf(child);
      } else {
        flush();
        run = { from, to, row: rowOf(child), span: rowSpanOf(child) };
      }
    }
    flush();
  });

  const rowCount = tree.leaves.length;
  const rows: Cell[][] = Array.from({ length: rowCount }, () => []);
  for (const cell of cells) rows[cell.row].push(cell);
  for (const row of rows) row.sort((a, b) => a.col - b.col);

  return {
    slug: tree.slug,
    title: tree.title,
    category: tree.category,
    tags: tree.tags,
    metadata: tree.metadata,
    headers: tree.headers,
    footers: tree.footers,
    colCount: tree.root.col,
    rowCount,
    rows,
  };
}

const rowOf = (node: TreeNode) => node.row;
const rowSpanOf = (node: TreeNode) => node.rowSpan;

function walkOps(node: TreeNode, visit: (op: Extract<TreeNode, { kind: 'op' }>) => void): void {
  if (node.kind !== 'op') return;
  visit(node);
  for (const child of node.children) walkOps(child, visit);
}

/**
 * Every (row, column) must be covered exactly once, or the browser will silently
 * reflow the table into nonsense. Cheap to check, so check it on every build.
 */
export function findTilingErrors(grid: Grid): string[] {
  const seen = Array.from({ length: grid.rowCount }, () => new Array(grid.colCount + 1).fill(0));
  const errors: string[] = [];

  for (const row of grid.rows) {
    for (const cell of row) {
      for (let r = cell.row; r < cell.row + cell.rowSpan; r++) {
        for (let c = cell.col; c < cell.col + cell.colSpan; c++) {
          if (r >= grid.rowCount || c > grid.colCount) {
            errors.push(`cell ${cell.kind} at ${cell.row},${cell.col} spills outside the table`);
            continue;
          }
          if (seen[r][c]++) errors.push(`row ${r}, column ${c} is covered twice`);
        }
      }
    }
  }

  for (let r = 0; r < grid.rowCount; r++) {
    for (let c = 1; c <= grid.colCount; c++) {
      if (!seen[r][c]) errors.push(`row ${r}, column ${c} is not covered`);
    }
  }

  return errors;
}
