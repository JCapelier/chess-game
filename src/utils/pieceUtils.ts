import type { Cell, CellColor, Piece, GameStatus } from '../type';


export function playerKing(cells: Cell[], turn: CellColor) {
  return turn === 'white' ? cells.find(cell => cell.piece?.type === 'wK') : cells.find(cell => cell.piece?.type === 'bK');
}

export function isWhite(piece: Piece | null): boolean {
  return piece !== null && piece.type.startsWith('w');
}

export function isBlack(piece: Piece | null): boolean {
  return piece !== null && piece.type.startsWith('b');
}

export function isPlayerPiece(selectedCell: Cell, turn: CellColor): boolean {
  if (!selectedCell.piece) return false;
  return selectedCell.piece.type.at(0) === turn.at(0);
}

export function isEnemyPiece(playingPiece: Piece, otherPiece: Piece): boolean {
  return ((isBlack(playingPiece) && isWhite(otherPiece)) || (isWhite(playingPiece) && isBlack(otherPiece)))
}

export function isPlayerKing(cell: Cell, turn: CellColor): boolean {
  if (turn === 'white') {
    return cell.piece?.type === "wK";
  } else if (turn === 'black') {
    return cell.piece?.type === 'bK';
  } else {
    return false;
  }
}

export function checkedPlayerKing(cell: Cell, gameStatus: GameStatus, turn: CellColor): boolean {
  // We only use this function in case of check or checkmate, to select the king to highlight
  if (gameStatus === 'playing' || gameStatus === 'stalemate') return false;
  return isPlayerKing(cell, turn);
}
