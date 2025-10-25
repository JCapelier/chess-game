import type { Cell, Move, Piece } from '../../type';

import { isBlack } from '../../utils/piece-utils';
import { toChessNotation } from '../../utils/utils';

// This will be called in pawnValidMoves.
export function enPassantMoves(cells: Readonly<Cell[]>, playingCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>): Cell[] {
  if (!lastMove || !hasPawnMovedTwoSquares(lastMove)) return [];

  const { col, row } = playingCell.coordinates;
  const pawnDirection = isBlack(playingCell.piece) ? 1 : -1;
  const enPassantRow = row + pawnDirection;

  // The pawn that just moved must be adjacent (left or right)
  const possibleCols = [col - 1, col + 1];


  const validMoves = possibleCols
  .filter(targetCol =>
    targetCol >= 0 &&
    targetCol <= 7 &&
    lastMove.to.coordinates.row === row &&
    lastMove.to.coordinates.col === targetCol
  )
  .map(targetCol =>
    cells.find(cell =>
      cell.coordinates.row === enPassantRow &&
      cell.coordinates.col === targetCol &&
      !cell.piece
    )
  )
  .filter(Boolean) as Cell[];

  return validMoves;
}

//We're just checking the last move, for 'en passant', we don't consider the status of every pawn.
export function hasPawnMovedTwoSquares(lastMove?: Readonly<Move | undefined>): boolean {
  if (!lastMove! || !lastMove.pieceType.endsWith('P')) return false;

  const startRow = lastMove.from.coordinates.row;
  const endRow = lastMove.to.coordinates.row;

  //Math.abs return the absolute value
  return (Math.abs(endRow - startRow) === 2) ? true : false;
}

export function isEnPassant(cells: Readonly<Cell[]>, startCell: Readonly<Cell>, destinationCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>): boolean {
  const enPassantValidMoves = enPassantMoves(cells, startCell, lastMove);
  // We checks if there's an en passant move with the current selected piece.
  const isEnPassant = enPassantValidMoves.some(
    cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
  );
  return isEnPassant;
}

//For now, promotion automatically promotes the pawn to queen.
//TODO underpromotion
export function pawnPromotion(cells: Readonly<Cell[]>): Cell[]{

const newCells = cells.map( cell => {
  if (cell.piece?.type === 'wP' && cell.coordinates.row === 0 ) {
    //We need to enforce Piece type, otherwise, 'wQ' and 'bQ' are treated as simple strings,
    //which causes a TS error
    return {...cell, piece: {hasMoved: true, type: 'wQ'} as Piece};
  } else if (cell.piece?.type === 'bP' && cell.coordinates.row === 7 ) {
    return {...cell, piece: {hasMoved: true, type: 'bQ'} as Piece};
  } else {
    return cell;
  }});

return newCells;
}
