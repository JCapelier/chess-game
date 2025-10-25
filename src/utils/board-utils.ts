import type { Cell, CellColor, Coordinates, Piece } from '../type';

import { toChessNotation } from './utils';

  export function getCellColor(coordinates: Readonly<Coordinates>): CellColor {
    return (coordinates.row + coordinates.col) % 2 === 0 ? 'black' : 'white';
  }

  export function getCellInfo(startCell: Readonly<Cell>) {
    //This is used in some placing for easy destructuring from cell to usable info
    return {
      col: startCell.coordinates.col,
      piece: startCell.piece,
      row: startCell.coordinates.row,
    };
  }

  export function getDefaultPiece(coordinates: Readonly<Coordinates>): Piece['type'] | undefined {
    switch (coordinates.row) {
    case 0: {
      switch(coordinates.col) {
        case 0:
        case 7: {
          return 'bR';
        }
        case 1:
        case 6: {
          return 'bB';
        }
        case 2:
        case 5: {
          return 'bN';
        }
        case 3: {
          return 'bQ';
        }
        case 4: {
          return 'bK';
        }
      }

    break;
    }
    case 1: {
      return 'bP';
    }
    case 6: {
      return 'wP';
    }
    case 7: {
      switch(coordinates.col) {
        case 0:
        case 7: {
          return 'wR';
        }
        case 1:
        case 6: {
          return 'wB';
        }
        case 2:
        case 5: {
          return 'wN';
        }
        case 3: {
          return 'wQ';
        }
        case 4: {
          return 'wK';
        }
      }

    break;
    }
    // No default
    }
    return undefined;
  }

  export function setBoard(): Cell[] {
    return Array.from({length: 64}, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const coordinates = {col, row};
      const pieceType = getDefaultPiece(coordinates);
      const piece = pieceType ? { hasMoved: false, type: pieceType } : undefined;
      return(
        {
          cellColor: getCellColor(coordinates),
          coordinates: coordinates,
          key: toChessNotation(coordinates),
          piece: piece,
        }
      );
    });
  }
