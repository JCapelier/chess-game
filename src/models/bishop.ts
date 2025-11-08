import { diagonalSlidingMoves } from "../moves/move-helpers";
import { type Cell, type CellColor, PieceType } from '../type';
import { ChessPiece } from "./chess-piece";

export class Bishop extends ChessPiece {
  constructor(color: CellColor, hasMoved: boolean = false, type: PieceType) {
    super(color, hasMoved, type);
  }

  validMoves(cells: Readonly<Cell[]>): Cell[] {

    if (!(this.type === PieceType.Bishop)) return [];

    return diagonalSlidingMoves(cells, this);
  }
}
