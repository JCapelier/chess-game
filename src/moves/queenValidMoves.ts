import type { Cell } from "../type";
import { orthogonalSlidingMoves, diagonalSlidingMoves } from "../moves/moves";

export function queenValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('Q')) return [];

  return [
    ...orthogonalSlidingMoves(cells, startCell),
    ...diagonalSlidingMoves(cells, startCell)
  ];
}
