import type { ChessPiece } from "../models/chess-piece";
import type { CellColor, Coordinates, PieceType } from "../type";

// We need to pass through this interface to avoid circular import between classes and factory

export interface PieceFactoryPort {
  createPiece(
    color: CellColor,
    hasMoved: boolean,
    location: Readonly<Coordinates>,
    piece: PieceType,
  ): ChessPiece | undefined;

  createPromotedPawn(promotedPawnColor: CellColor, promotedPawnLocation: Readonly<Coordinates>): ChessPiece | undefined;

  createStandardBoardPiece(coordinates: Readonly<Coordinates>): ChessPiece | undefined;
}
