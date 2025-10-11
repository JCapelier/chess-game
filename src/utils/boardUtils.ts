
import type { Cell, CellColor } from '../type';
import { checkForCheck } from './gameStatusUtils';
import {getDefaultPiece, toChessNotation, getCellColor} from './utils'


  // CellProps doesn't include the handlers, even though they are passed as props, because utils is for pure functions
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

  // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: Cell[], startCell: Cell, destinationCell: Cell, possibleMoves: Cell[]): { cells: Cell[], success: boolean} {
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

    return {cells: newCells, success: true};
  }


  export function filterMovesLeavingKingInCheck(cells: Cell[], startCell: Cell, possibleMoves: Cell[], turn: CellColor): Cell[]{
    const validMoves: Cell[] = [];
    possibleMoves.forEach(possibleMove => {
      // We're creating a copy of cells where the move would be accomplished, to check if playerKing would be in check or not
      const {cells: simulatedBoard} = movePiece(cells, startCell, possibleMove, possibleMoves);
      const check = checkForCheck(simulatedBoard, turn, true);
      if (check.check === false) {
        validMoves.push(possibleMove);
      }
    })
    return validMoves;
  }
