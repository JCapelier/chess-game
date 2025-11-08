import type { ChessPiece } from "../models/chess-piece";
import type { PieceFactoryPort } from "./piece-factory-port";

import { Bishop } from "../models/bishop";
import { King } from "../models/king";
import { Knight } from "../models/knight";
import { Pawn } from "../models/pawn";
import { Queen } from "../models/queen";
import { Rook } from "../models/rook";
import { Valkyrie } from "../models/valkyrie";
import { CellColor, PieceType } from "../type";

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
    type: PieceType,
  ): ChessPiece | undefined {
    const PieceClass = PIECE_CLASSES[type];
    if (PieceClass) return new PieceClass(color, hasMoved, type);
  },

  createPromotedPawn(promotedPawnColor: CellColor): ChessPiece | undefined {
    return this.createPiece(promotedPawnColor, true, PieceType.Valkyrie);
  },
};
