import type { Coordinates, CellColor, Piece, CellData, Cell } from './type';


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

  // CellProps doesn't include the handlers, even though they are passed as props, because utils is for pure functions
  export function setBoard(): CellData[] {
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

  // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: CellData[], startCell: Cell, destinationCell: Cell, possibleMoves: Cell[]): { cells: CellData[], success: boolean} {
    // For React to render again properly, always return a new array of updated cells. Never mutate directly the cell or the Cell[]
    if (!possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(destinationCell.coordinates))) return {cells: cells, success: false};

    const newCells = cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(startCell.coordinates)) {
        return { ...cell, piece: null };
      }
      if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        return { ...cell, piece: startCell.piece };
      }
      return cell;
    });

    return {cells: newCells, success: true}
  }

  export function isPlayerPiece(selectedCell: Cell, turn: CellColor): boolean {
    if (!selectedCell.piece) return false;
    return selectedCell.piece.type.at(0) === turn.at(0);
  }

  export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
