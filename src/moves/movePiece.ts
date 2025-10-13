 import type { Cell, Move, CellColor } from '../type';
 import { toChessNotation } from '../utils/utils';
 import { isCastlingMove } from './specialMoves/castlingMoves';
 import { isEnPassant, pawnPromotion } from './specialMoves/pawnSpecialMoves';

 // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: Cell[], startCell: Cell, destinationCell: Cell, lastMove: Move | undefined, possibleMoves: Cell[], turn: CellColor): { cells: Cell[], success: boolean} {
    // For React to render again properly, always return a new array of updated cells. Never mutate directly the cell or the Cell[]
    if (
      !isCastlingMove(startCell, destinationCell, turn) &&
      !isEnPassant(cells, startCell, destinationCell, lastMove) &&
      !possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(destinationCell.coordinates)))
      return {cells: cells, success: false};

    const newCells = cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(startCell.coordinates)) {
        return { ...cell, piece: null };
      }

      if (!isCastlingMove(startCell, destinationCell, turn) && toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        // This ! is legit : board component only allow the player to select a cell occupied by one of their pieces.
        return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
      }

      if (isEnPassant(cells, startCell, destinationCell, lastMove)) {
        //If isEnPassant, then we need to remove the piece in the cell that is in the row of the beginning of the move and the col at the end of the move. The one
        //just below the destination cell.
        const capturedRow = startCell.coordinates.row;
        const capturedCol = destinationCell.coordinates.col;
        if (cell.coordinates.row === capturedRow && cell.coordinates.col === capturedCol) {
          return { ...cell, piece: null };
        }
      }

      if (isCastlingMove(startCell, destinationCell, turn)) {
        // Find which side is being castled
        const row = startCell.coordinates.row;
        const isLeft = destinationCell.coordinates.col === 0;
        const isRight = destinationCell.coordinates.col === 7;

        if (isLeft) {
          // King goes to col 2, rook to col 3
          // Old king to null is taken care of by a previous if statement.
          if (cell.coordinates.col === 0 && cell.coordinates.row === row) return { ...cell, piece: null }; // old rook
          if (cell.coordinates.col === 2 && cell.coordinates.row === row) return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
          if (cell.coordinates.col === 3 && cell.coordinates.row === row) return { ...cell, piece: { type: destinationCell.piece!.type, hasMoved: true }};
        } else if (isRight) {
          // King goes to col 6, rook to col 5
          if (cell.coordinates.col === 7 && cell.coordinates.row === row) return { ...cell, piece: null }; // old rook
          if (cell.coordinates.col === 6 && cell.coordinates.row === row) return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
          if (cell.coordinates.col === 5 && cell.coordinates.row === row) return { ...cell, piece: { type: destinationCell.piece!.type, hasMoved: true }};
        }
      }
      return cell;
    });

    //Takes care of pawnPromotion if a pawn is in position for it.
    if ( (startCell.piece?.type === 'wP' && destinationCell.coordinates.row === 0) || (startCell.piece?.type === 'bP' && destinationCell.coordinates.row === 7)) {
      const promotedCells = pawnPromotion(newCells);
      return {cells: promotedCells, success: true}
    } else {
      return {cells: newCells, success: true};
    }
  }
