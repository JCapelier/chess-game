import type { Cell } from "../type";

import { orthogonalSlidingMoves } from "./move-helpers";

export function rookValidMoves(cells: Readonly<Cell[]>, startCell: Readonly<Cell>): Cell[] {

  if (!startCell.piece || !startCell.piece.type.endsWith('R')) return [];

  return orthogonalSlidingMoves(cells, startCell);
}
