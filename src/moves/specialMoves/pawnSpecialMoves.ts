import type { Cell, Move, Piece } from '../../type';
import { isBlack } from '../../utils/pieceUtils';
import { toChessNotation } from '../../utils/utils';

// This will be called in pawnValidMoves.
export function enPassantMoves(cells: Cell[], playingCell: Cell, lastMove: Move | undefined): Cell[] {
  if (!lastMove || !hasPawnMovedTwoSquares(lastMove)) return [];

  const { row, col } = playingCell.coordinates;
  const pawnDirection = isBlack(playingCell.piece) ? 1 : -1;
  const enPassantRow = row + pawnDirection;

  // The pawn that just moved must be adjacent (left or right)
  const possibleCols = [col - 1, col + 1];
  const validMoves: Cell[] = [];

  possibleCols.forEach(targetCol => {
    if (targetCol < 0 || targetCol > 7) return;
    // The pawn that just moved must be in the adjacent column and on the same row as the playing pawn
    if (
      lastMove.to.coordinates.row === row &&
      lastMove.to.coordinates.col === targetCol
    ) {
      // The en passant target is the diagonal square in front of the playing pawn
      const targetCell = cells.find(
        cell =>
          cell.coordinates.row === enPassantRow &&
          cell.coordinates.col === targetCol &&
          !cell.piece // en passant target square must be empty
      );
      if (targetCell) validMoves.push(targetCell);
    }
  });

  return validMoves;
}

//For now, promotion automatically promotes the pawn to queen.
//TODO underpromotion
export function pawnPromotion(cells: Cell[]): Cell[]{

const newCells = cells.map( cell => {
  if (cell.piece?.type === 'wP' && cell.coordinates.row === 0 ) {
    //We need to enforce Piece type, otherwise, 'wQ' and 'bQ' are treated as simple strings,
    //which causes a TS error
    return {...cell, piece: {type: 'wQ', hasMoved: true} as Piece}
  } else if (cell.piece?.type === 'bP' && cell.coordinates.row === 7 ) {
    return {...cell, piece: {type: 'bQ', hasMoved: true} as Piece}
  } else {
    return cell
  }});

return newCells
}

//We're just checking the last move, for 'en passant', we don't consider the status of every pawn.
export function hasPawnMovedTwoSquares(lastMove?: Move | undefined): boolean {
  if (!lastMove! || !lastMove.pieceType.endsWith('P')) return false;

  const startRow = lastMove.from.coordinates.row;
  const endRow = lastMove.to.coordinates.row;

  //Math.abs return the absolute value
  return (Math.abs(endRow - startRow) === 2) ? true : false;
}

export function isEnPassant(cells: Cell[], startCell: Cell, destinationCell: Cell, lastMove: Move | undefined): boolean {
  const enPassantValidMoves = enPassantMoves(cells, startCell, lastMove);
  // We checks if there's an en passant move with the current selected piece.
  const isEnPassant = enPassantValidMoves.some(
    cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
  );
  return isEnPassant;
}
