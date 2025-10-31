import type { Cell, CellColor, Coordinates, MoveContext } from '../type';

import { diagonalSlidingMoves, orthogonalSlidingMoves } from '../moves/move-helpers';
import { ChessPiece, PieceType } from "./chess-piece";

export class Queen extends ChessPiece {

  constructor(color: Readonly<CellColor>, location: Readonly<Coordinates>, hasMoved: boolean = false) {
      super(PieceType.Queen, color, location, hasMoved);
    }
  validMoves(context: Readonly<MoveContext>): Cell[] {

    if (!context.startCell.piece || !context.startCell.piece.type.endsWith('Q')) return [];

    return [
      ...orthogonalSlidingMoves(context.cells, context.startCell),
      ...diagonalSlidingMoves(context.cells, context.startCell)
    ];
  }
}
