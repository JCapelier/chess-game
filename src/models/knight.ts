import { jumpingMoves } from "../moves/move-helpers";
import { type Cell, type CellColor, type Coordinates, type MoveContext, PieceType } from "../type";
import { ChessPiece } from "./chess-piece";

export class Knight extends ChessPiece {
  constructor(color: Readonly<CellColor>, location: Readonly<Coordinates>, hasMoved: boolean = false, type: PieceType) {
    super(color, location, hasMoved, type);
  }

  validMoves(context: Readonly<MoveContext>): Cell[] {
    if (!(context.startCell!.piece && context.startCell!.piece.type === PieceType.Knight)) return [];

    return jumpingMoves(context);
  }
}
