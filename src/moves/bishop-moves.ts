import type { Cell } from "../type";

import { diagonalSlidingMoves } from "./move-helpers";

export function bishopValidMoves(cells: Readonly<Cell[]>, startCell: Readonly<Cell>): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('B')) return [];

  return diagonalSlidingMoves(cells, startCell);
}
