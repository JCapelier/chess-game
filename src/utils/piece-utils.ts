import type { ChessPiece } from '../models/chess-piece';

import { King } from '../models/king';
import { type Cell, CellColor, GameStatus, type MoveContext } from '../type';



export function checkedPlayerKing(cell: Readonly<Cell>, gameStatus: GameStatus, turn: CellColor): boolean {
  // We only use this function in case of check or checkmate, to select the king to highlight
  if (gameStatus === GameStatus.Playing || gameStatus === GameStatus.Stalemate) return false;
  if (cell.piece) return cell.piece.isPlayerKing(turn);
  return false;
}

export function isBlack(piece: Readonly<ChessPiece | undefined>): boolean {
  return piece !== undefined && piece.color === CellColor.Black;
}

export function isEnemyPiece(playingPiece: Readonly<ChessPiece>, otherPiece: Readonly<ChessPiece>): boolean {
  return ((isBlack(playingPiece) && isWhite(otherPiece)) || (isWhite(playingPiece) && isBlack(otherPiece)));
}


export function isPlayerPiece(context: Readonly<MoveContext>, selectedCell: Readonly<Cell>): boolean {
  if (!selectedCell.piece) return false;
  return selectedCell.piece.color === context.turn;
}

export function isWhite(piece: Readonly<ChessPiece | undefined>): boolean {
  return piece !== undefined && piece.color === CellColor.White;
}

export function pieceColor(piece: Readonly<ChessPiece>): CellColor {
  return isWhite(piece) ? CellColor.White : CellColor.White;
}

export function playerKing(cells: Readonly<Cell[]>, turn: CellColor) {
  return cells.find(cell => cell.piece instanceof King && cell.piece.color === turn);
}
