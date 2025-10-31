import type { Cell, CellColor, GameStatus, Piece } from '../type';


export function checkedPlayerKing(cell: Readonly<Cell>, gameStatus: GameStatus, turn: CellColor): boolean {
  // We only use this function in case of check or checkmate, to select the king to highlight
  if (gameStatus === 'playing' || gameStatus === 'stalemate') return false;
  return isPlayerKing(cell, turn);
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
  return piece !== undefined && piece.symbol.startsWith('b');
}

export function isEnemyPiece(playingPiece: Readonly<Piece>, otherPiece: Readonly<Piece>): boolean {
  return ((isBlack(playingPiece) && isWhite(otherPiece)) || (isWhite(playingPiece) && isBlack(otherPiece)));
}

export function isPlayerKing(cell: Readonly<Cell>, turn: CellColor): boolean {
  if (turn === 'white') {
    return cell.piece?.symbol === "wK";
  } else if (turn === 'black') {
    return cell.piece?.symbol === 'bK';
  } else {
    return false;
  }
}

export function isPlayerPiece(selectedCell: Readonly<Cell>, turn: CellColor): boolean {
  if (!selectedCell.piece) return false;
  return selectedCell.piece.symbol.at(0) === turn.at(0);
}

export function isWhite(piece: Readonly<Piece | undefined>): boolean {
  return piece !== undefined && piece.symbol.startsWith('w');
}

export function pieceColor(piece: Readonly<Piece>): CellColor {
  return isWhite(piece) ? 'white' : 'black';
}

export function playerKing(cells: Readonly<Cell[]>, turn: CellColor) {
  return turn === 'white' ? cells.find(cell => cell.piece?.symbol === 'wK') : cells.find(cell => cell.piece?.symbol === 'bK');
}
