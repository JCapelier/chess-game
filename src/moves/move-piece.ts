 import type { Cell, CellColor, Move } from '../type';

 import { toChessNotation } from '../utils/utils';
 import { isCastlingMove } from './special-moves/castling-moves';
 import { isEnPassant, pawnPromotion } from './special-moves/pawn-special-moves';

 // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: Readonly<Cell[]>, startCell: Readonly<Cell>, destinationCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>, possibleMoves: Readonly<Cell[]>, turn: CellColor): { cells: Cell[], success: boolean} {
    // For React to render again properly, always return a new array of updated cells. Never mutate directly the cell or the Cell[]
    if (
      !isCastlingMove(startCell, destinationCell, turn) &&
      !isEnPassant(cells, startCell, destinationCell, lastMove) &&
      !possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(destinationCell.coordinates)))
      return {cells: [...cells], success: false};

    const newCells = cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(startCell.coordinates)) {
        return { ...cell, piece: undefined };
      }

      if (!isCastlingMove(startCell, destinationCell, turn) && toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        // This ! is legit : board component only allow the player to select a cell occupied by one of their pieces.
        return { ...cell, piece: { hasMoved: true, type: startCell.piece!.type }};
      }

      if (isEnPassant(cells, startCell, destinationCell, lastMove)) {
        //If isEnPassant, then we need to remove the piece in the cell that is in the row of the beginning of the move and the col at the end of the move. The one
        //just below the destination cell.
        const capturedRow = startCell.coordinates.row;
        const capturedCol = destinationCell.coordinates.col;
        if (cell.coordinates.row === capturedRow && cell.coordinates.col === capturedCol) {
          return { ...cell, piece: undefined };
        }
      }

      if (isCastlingMove(startCell, destinationCell, turn)) {
        // Find which side is being castled
        const row = startCell.coordinates.row;
        const isLeft = destinationCell.coordinates.col === 0;
        const isRight = destinationCell.coordinates.col === 7;

        if (isLeft) {
          // King goes to col 2, rook to col 3
          // Old king to undefined is taken care of by a previous if statement.
          if (cell.coordinates.col === 0 && cell.coordinates.row === row) return { ...cell, piece: undefined }; // old rook
          if (cell.coordinates.col === 2 && cell.coordinates.row === row) return { ...cell, piece: { hasMoved: true, type: startCell.piece!.type }};
          if (cell.coordinates.col === 3 && cell.coordinates.row === row) return { ...cell, piece: { hasMoved: true, type: destinationCell.piece!.type }};
        } else if (isRight) {
          // King goes to col 6, rook to col 5
          if (cell.coordinates.col === 7 && cell.coordinates.row === row) return { ...cell, piece: undefined }; // old rook
          if (cell.coordinates.col === 6 && cell.coordinates.row === row) return { ...cell, piece: { hasMoved: true, type: startCell.piece!.type }};
          if (cell.coordinates.col === 5 && cell.coordinates.row === row) return { ...cell, piece: { hasMoved: true, type: destinationCell.piece!.type }};
        }
      }
      return cell;
    });

    //Takes care of pawnPromotion if a pawn is in position for it.
    if ( (startCell.piece?.type === 'wP' && destinationCell.coordinates.row === 0) || (startCell.piece?.type === 'bP' && destinationCell.coordinates.row === 7)) {
      const promotedCells = pawnPromotion(newCells);
      return {cells: promotedCells, success: true};
    } else {
      return {cells: newCells, success: true};
    }
  }
