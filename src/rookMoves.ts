import type { Cell } from "./type";
import { orthogonalSlidingMoves } from "./moves";

export function rookValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('R')) return [];

  return orthogonalSlidingMoves(cells, startCell)
}
