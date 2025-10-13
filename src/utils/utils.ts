import type { Coordinates, CellColor, Piece, Cell, GameStatus } from '../type';


  export function getCellColor(coordinates: Coordinates): CellColor {
    return (coordinates.row + coordinates.col) % 2 === 0 ? 'black' : 'white';
  }

  export function getDefaultPiece(coordinates: Coordinates): Piece['type'] | null {
    if (coordinates.row === 0) {
      switch(coordinates.col) {
        case 0:
        case 7:
          return 'bR';
        case 1:
        case 6:
          return 'bB';
        case 2:
        case 5:
          return 'bN';
        case 3:
          return 'bQ';
        case 4:
          return 'bK';
      }
    } else if (coordinates.row === 1) {
      return 'bP';
    } else if (coordinates.row === 6) {
      return 'wP'
    } else if (coordinates.row === 7) {
      switch(coordinates.col) {
        case 0:
        case 7:
          return 'wR';
        case 1:
        case 6:
          return 'wB';
        case 2:
        case 5:
          return 'wN';
        case 3:
          return 'wQ';
        case 4:
          return 'wK';
      }
    }
    return null
  }

  export function toChessNotation(coordinates: Coordinates): string {
    // In chess, files are col, and ranks are rows
    const file = String.fromCharCode(65 + coordinates.col); // 65 is 'A'
    const rank = 8 - coordinates.row; // rank 1 is the bottom rank, whereas index 0 is the top row.
    return `${file}${rank}`;
  }

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

  export function getCellInfo(startCell: Cell) {
    //This is used in some placing for easy destructuring from cell to usable info
    return {
      col: startCell.coordinates.col,
      row: startCell.coordinates.row,
      piece: startCell.piece,
    };
  }

  export function isPlayerKing(cell: Cell, gameStatus: GameStatus, turn: CellColor): boolean {
    // We only use this function in case of check or checkmate.
    if (gameStatus === 'playing' || gameStatus === 'stalemate') return false;

    if (turn === 'white') {
      return cell.piece?.type === "wK";
    } else if (turn === 'black') {
      return cell.piece?.type === 'bK';
    } else {
      return false
    }
  }

  export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function getSidesCells(cells: Cell[], playingCell: Cell): Cell[] {
    // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
    return cells.filter(cell =>
      cell.coordinates.row === playingCell.coordinates.row &&
      //Checking both col -1 and col + 1 (Math.abs(1))
      Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1)
  }
