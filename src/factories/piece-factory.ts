import type { ChessPiece } from "../models/chess-piece";

import { Bishop } from "../models/bishop";
import { King } from "../models/king";
import { Knight } from "../models/knight";
import { Pawn } from "../models/pawn";
import { Queen } from "../models/queen";
import { Rook } from "../models/rook";
import { Valkyrie } from "../models/valkyrie";
import { CellColor, type Coordinates, PieceType } from "../type";

const PIECE_CLASSES = {
  [PieceType.Bishop]: Bishop,
  [PieceType.King]: King,
  [PieceType.Knight]: Knight,
  [PieceType.Pawn]: Pawn,
  [PieceType.Queen]: Queen,
  [PieceType.Rook]: Rook,
  [PieceType.Valkyrie]: Valkyrie,
};

export function createPiece(
  color: CellColor,
  hasMoved: boolean,
  location: Readonly<Coordinates>,
  type: PieceType,
): ChessPiece | undefined {
  const PieceClass = PIECE_CLASSES[type];
  if (PieceClass) return new PieceClass(color, location, hasMoved);
}

export function createPieceFromPrototype(
  color: CellColor,
  hasMoved: boolean,
  location: Readonly<Coordinates>,
  piece: Readonly<ChessPiece>,
): ChessPiece {
  // TypeScript cannot infer constructor types for unions of classes (Piece), so 'as any' is required here for dynamic instantiation.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (piece.constructor as any)(color, location, hasMoved);
}

export function createPromotedPawn(pawn: Readonly<Pawn>) {
  return new Valkyrie(pawn.color, pawn.location, true);
}

export function createStandardBoardPiece(coordinates: Readonly<Coordinates>) {
  const { col, row } = coordinates;
  const color: CellColor | undefined =
    (row === 0 || row === 1)
      ? CellColor.Black
      : ((row === 6 || row === 7)
        ? CellColor.White
        : undefined);

  const firstRank = color === CellColor.Black ? 0 : 7;
  const pawnRank = color === CellColor.Black ? 1 : 6;

  if (color && row === pawnRank) return new Pawn(color, { col, row }, false);

  if (color && row === firstRank) {
    const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
    const PieceClass = pieceOrder[col];
    return PieceClass ? new PieceClass(color, { col, row }, false) : undefined;
  }
}
