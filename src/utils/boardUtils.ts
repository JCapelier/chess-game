  import type {CellData, Cell} from '../type';
  import {getDefaultPiece, toChessNotation, getCellColor} from './utils'


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

  // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: CellData[], startCell: Cell, destinationCell: Cell, possibleMoves: Cell[]): { cells: CellData[], success: boolean} {
    // For React to render again properly, always return a new array of updated cells. Never mutate directly the cell or the Cell[]
    if (!possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(destinationCell.coordinates))) return {cells: cells, success: false};

    const newCells = cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(startCell.coordinates)) {
        return { ...cell, piece: null };
      }
      if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        // This ! is legit : board component only allow the player to select a cell occupied by one of their pieces.
        return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
      }
      return cell;
    });

    return {cells: newCells, success: true}
  }
