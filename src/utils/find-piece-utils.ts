import type { ChessPiece } from '../models/chess-piece';

import { type Cell, CellColor, PieceType } from '../type';


export function getPieceLocation(cells: Readonly<Cell[]>, piece: Readonly<ChessPiece>) {
  const cell = cells.find(cell => cell.piece === piece);
  if (cell) return cell.coordinates;
}

export function playerKing(cells: Readonly<Cell[]>, turn: CellColor) {
  return cells.find(cell => cell.piece && cell.piece.type === PieceType.King && cell.piece!.color === turn);
}
