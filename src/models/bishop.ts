import type { Cell, CellColor, Coordinates, MoveContext } from '../type';

import { diagonalSlidingMoves } from "../moves/move-helpers";
import { ChessPiece } from "./chess-piece";

export class Bishop extends ChessPiece {
  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    super(color, location, hasMoved);
  }

  validMoves(context: Readonly<MoveContext>): Cell[] {

    if (!(context.startCell!.piece && context.startCell!.piece instanceof Bishop)) return [];

    return diagonalSlidingMoves(context);
  }
}
