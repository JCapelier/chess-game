import type { Cell, CellColor, Coordinates, MoveContext } from '../type';

import { diagonalSlidingMoves } from "../moves/move-helpers";
import { ChessPiece, PieceType } from "./chess-piece";

export class Bishop extends ChessPiece {
  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    super(PieceType.Bishop, color, location, hasMoved);
  }

  validMoves(context: Readonly<MoveContext>): Cell[] {

    if (!context.startCell.piece || !context.startCell.piece.type.endsWith('B')) return [];

    return diagonalSlidingMoves(context.cells, context.startCell);
  }
}
