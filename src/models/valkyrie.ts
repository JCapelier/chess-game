import type { Cell, CellColor, Coordinates, MoveContext } from '../type';

import { diagonalSlidingMoves, jumpingMoves, orthogonalSlidingMoves } from '../moves/move-helpers';
import { ChessPiece } from "./chess-piece";

export class Valkyrie extends ChessPiece {

  constructor(color: Readonly<CellColor>, location: Readonly<Coordinates>, hasMoved: boolean = false) {
      super(color, location, hasMoved);
    }

  validMoves(context: Readonly<MoveContext>): Cell[] {

    if (!(context.startCell!.piece && context.startCell!.piece instanceof Valkyrie)) return [];

    return [
      ...jumpingMoves(context),
      ...orthogonalSlidingMoves(context),
      ...diagonalSlidingMoves(context)
    ];
  }
}
