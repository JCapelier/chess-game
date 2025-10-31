import type { Cell, MoveContext } from "../type";

import { diagonalSlidingMoves } from "./move-helpers";

export function bishopValidMoves(context: Readonly<MoveContext>): Cell[] {

  if (!context.startCell.piece || !context.startCell.piece.type.endsWith('B')) return [];

  return diagonalSlidingMoves(context.cells, context.startCell);
}
