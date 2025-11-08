import { diagonalSlidingMoves, orthogonalSlidingMoves } from '../moves/move-helpers';
import { type Cell, type CellColor, PieceType } from '../type';
import { ChessPiece } from "./chess-piece";

export class Queen extends ChessPiece {

  constructor(color: Readonly<CellColor>, hasMoved: boolean = false, type: PieceType) {
      super(color, hasMoved, type);
    }

  validMoves(cells: Readonly<Cell[]>): Cell[] {

    if (!(this.type === PieceType.Queen)) return [];

    return [
      ...orthogonalSlidingMoves(cells, this),
      ...diagonalSlidingMoves(cells, this)
    ];
  }
}
