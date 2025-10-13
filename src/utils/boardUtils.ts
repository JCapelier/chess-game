import type { Cell, Coordinates, Piece, CellColor } from '../type';
import { toChessNotation } from './utils';


  export function setBoard(): Cell[] {
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
          cellColor: getCellColor(coordinates),
        }
      );
    });
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

  export function getCellColor(coordinates: Coordinates): CellColor {
    return (coordinates.row + coordinates.col) % 2 === 0 ? 'black' : 'white';
  }

  export function getCellInfo(startCell: Cell) {
    //This is used in some placing for easy destructuring from cell to usable info
    return {
      col: startCell.coordinates.col,
      row: startCell.coordinates.row,
      piece: startCell.piece,
    };
  }
