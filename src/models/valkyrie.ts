import { diagonalSlidingMoves, jumpingMoves, orthogonalSlidingMoves } from '../moves/move-helpers';
import { type Cell, type CellColor, PieceType } from '../type';
import { ChessPiece } from "./chess-piece";

export class Valkyrie extends ChessPiece {

  constructor(color: Readonly<CellColor>, hasMoved: boolean = false, type: PieceType) {
      super(color, hasMoved, type);
    }

  validMoves(cells: Readonly<Cell[]>): Cell[] {

    if (!(this.type === PieceType.Valkyrie)) return [];

    return [
      ...jumpingMoves(cells, this),
      ...orthogonalSlidingMoves(cells, this),
      ...diagonalSlidingMoves(cells, this)
    ];
  }
}
