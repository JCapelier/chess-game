import type { Cell } from "../type";
import { diagonalSlidingMoves } from "./moveHelpers";

export function bishopValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('B')) return [];

  return diagonalSlidingMoves(cells, startCell)
}
