import type { Cell, CellColor, GameStatus, MoveContext, Piece } from '../type';

import { King } from '../models/king';


export function checkedPlayerKing(cell: Readonly<Cell>, gameStatus: GameStatus, turn: CellColor): boolean {
  // We only use this function in case of check or checkmate, to select the king to highlight
  if (gameStatus === 'playing' || gameStatus === 'stalemate') return false;
  if (cell.piece) return cell.piece.isPlayerKing(turn) === true ? cell.piece.isPlayerKing(turn) : false;
}

export function getPieceTypeName(piece: Readonly<Piece>): string {
  switch (piece.type.slice(-1)) {
    case 'B': { return 'Bishop';
    }
    case 'K': { return 'King';
    }
    case 'N': { return 'Knight';
    }
    case 'P': { return 'Pawn';
    }
    case 'Q': { return 'Queen';
    }
    case 'R': { return 'Rook';
    }
    default: { return 'Unknown';
    }
}
}

export function isBlack(piece: Readonly<Piece | undefined>): boolean {
  return piece !== undefined && piece.color === 'black';
}

export function isEnemyPiece(playingPiece: Readonly<Piece>, otherPiece: Readonly<Piece>): boolean {
  return ((isBlack(playingPiece) && isWhite(otherPiece)) || (isWhite(playingPiece) && isBlack(otherPiece)));
}


export function isPlayerPiece(context: Readonly<MoveContext>, selectedCell: Readonly<Cell>): boolean {
  if (!selectedCell.piece) return false;
  return selectedCell.piece.color === context.turn;
}

export function isWhite(piece: Readonly<Piece | undefined>): boolean {
  return piece !== undefined && piece.color === 'white';
}

export function pieceColor(piece: Readonly<Piece>): CellColor {
  return isWhite(piece) ? 'white' : 'black';
}

export function playerKing(cells: Readonly<Cell[]>, turn: CellColor) {
  return cells.find(cell => cell.piece instanceof King && cell.piece.color === turn);
}
