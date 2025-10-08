import type { Coordinates, CellColor, Piece, CellProps, Cell } from './type';

  function getCellColor(coordinates: Coordinates): CellColor {
    return (coordinates.row + coordinates.col) % 2 === 0 ? 'black' : 'white';
  }

  function getDefaultPiece(coordinates: Coordinates): Piece['type'] | null {
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
          return 'bK';
        case 4:
          return 'bQ';
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
          return 'wK';
        case 4:
          return 'wQ';
      }
    }
    return null
  }

  function toChessNotation(coordinates: Coordinates): string {
    // In chess, files are col, and ranks are rows
    const file = String.fromCharCode(65 + coordinates.col); // 65 is 'A'
    const rank = 8 - coordinates.row; // rank 1 is the bottom rank, whereas index 0 is the top row.
    return `${file}${rank}`;
  }

  export function setBoard(): CellProps[] {
    return Array.from({length: 64}, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const coordinates = {row, col};
      const pieceType = getDefaultPiece(coordinates);
      const piece = pieceType ? { type: pieceType, hasMoved: false } : null;
      return(
        {
          key: toChessNotation(coordinates),
          coordinates: coordinates,
          piece: piece,
          cellColor: getCellColor(coordinates)
        }
      );
    });
  }

  export function isWhite(piece: Piece | null): boolean {
    return piece !== null && piece.type.startsWith('w');
  }

  export function isBlack(piece: Piece | null): boolean {
    return piece !== null && piece.type.startsWith('b');
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

  export function isMoveLegal(cells: Cell[], startCell: Cell, endCell: Cell) {

  }
