import type { ChessPiece } from "../models/chess-piece";
import type { PieceFactoryPort } from "./piece-factory-port";

import { Bishop } from "../models/bishop";
import { King } from "../models/king";
import { Knight } from "../models/knight";
import { Pawn } from "../models/pawn";
import { Queen } from "../models/queen";
import { Rook } from "../models/rook";
import { Valkyrie } from "../models/valkyrie";
import { CellColor, type Coordinates, PieceType } from "../type";

export const PIECE_CLASSES = {
  [PieceType.Bishop]: Bishop,
  [PieceType.King]: King,
  [PieceType.Knight]: Knight,
  [PieceType.Pawn]: Pawn,
  [PieceType.Queen]: Queen,
  [PieceType.Rook]: Rook,
  [PieceType.Valkyrie]: Valkyrie,
};
export const pieceFactory: PieceFactoryPort = {
  createPiece(
    color: CellColor,
    hasMoved: boolean,
    location: Readonly<Coordinates>,
    type: PieceType,
  ): ChessPiece | undefined {
    const PieceClass = PIECE_CLASSES[type];
    if (PieceClass) return new PieceClass(color, location, hasMoved, type);
  },

  createPromotedPawn(promotedPawnColor: CellColor, promotedPawnLocation: Readonly<Coordinates>): ChessPiece | undefined {
    return this.createPiece(promotedPawnColor, true, promotedPawnLocation, PieceType.Valkyrie);
  },

  createStandardBoardPiece(coordinates: Readonly<Coordinates>): ChessPiece | undefined {
    const { col, row } = coordinates;
    const color: CellColor | undefined =
      (row === 0 || row === 1)
        ? CellColor.Black
        : ((row === 6 || row === 7)
          ? CellColor.White
          : undefined);

    const firstRank = color === CellColor.Black ? 0 : 7;
    const pawnRank = color === CellColor.Black ? 1 : 6;

    if (color && row === pawnRank) return this.createPiece(color, false, coordinates, PieceType.Pawn);

    if (color && row === firstRank) {
      const pieceOrder = [PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen, PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook];
      const PieceClass = pieceOrder[col];
      return PieceClass ? this.createPiece(color, false, coordinates, PieceClass) : undefined;
    }
  }
};
