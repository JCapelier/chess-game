import type { Cell } from "../type";
import { diagonalSlidingMoves } from "../moves/moves";

export function bishopValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('B')) return [];

  return diagonalSlidingMoves(cells, startCell)
}
