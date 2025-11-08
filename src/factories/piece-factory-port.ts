import type { ChessPiece } from "../models/chess-piece";
import type { CellColor, PieceType } from "../type";

// We need to pass through this interface to avoid circular import between classes and factory

export interface PieceFactoryPort {
  createPiece(
    color: CellColor,
    hasMoved: boolean,
    piece: PieceType,
  ): ChessPiece | undefined;

  createPromotedPawn(promotedPawnColor: CellColor): ChessPiece | undefined;
}
