import type { CellColor, Coordinates } from '../type';

import { ChessPiece } from '../models/chess-piece';

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
