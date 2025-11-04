import type { ChessPiece } from "../models/chess-piece";

import { CellColor } from "../type";

export function isWhite(piece: Readonly<ChessPiece | undefined>): boolean {
  return piece !== undefined && piece.color === CellColor.White;
}

export function pieceColor(piece: Readonly<ChessPiece>): CellColor {
  return isWhite(piece) ? CellColor.White : CellColor.Black;
}
