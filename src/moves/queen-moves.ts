import type { Cell } from "../type";

import { diagonalSlidingMoves, orthogonalSlidingMoves } from "./move-helpers";

export function queenValidMoves(cells: Readonly<Cell[]>, startCell: Readonly<Cell>): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('Q')) return [];

  return [
    ...orthogonalSlidingMoves(cells, startCell),
    ...diagonalSlidingMoves(cells, startCell)
  ];
}
