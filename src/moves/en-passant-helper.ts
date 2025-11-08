import type { Board } from "../board/board";

import { type Cell, type Move, PieceType } from "../type";
import { isWhite } from "../utils/color-utils";
import { toChessNotation } from "../utils/utils";

export function enPassantMoves(board: Board, from: Cell): Cell[] {
  if (!board.lastMove || !hasPawnMovedTwoSquares(board.lastMove)) return [];


  const { col, row } = from.coordinates;
  const pawnDirection = isWhite(from.piece) ? -1 : 1;
  const enPassantRow = row + pawnDirection;

  // The pawn that just moved must be adjacent (left or right)
  const possibleCols = [col - 1, col + 1];

  const validMoves = possibleCols
  .filter(targetCol =>
    targetCol >= 0 &&
    targetCol <= 7 &&
    board.lastMove &&
    board.lastMove.to.coordinates.row === row &&
    board.lastMove.to.coordinates.col === targetCol
  )
  .map(targetCol =>
    board.cells.find(cell =>
      cell.coordinates.row === enPassantRow &&
      cell.coordinates.col === targetCol &&
      !cell.piece
    )
  )
  .filter(Boolean) as Cell[];

  return validMoves;
}

export function isEnPassantMove(board: Board, from: Cell, destinationCell: Readonly<Cell>): boolean {
  const enPassantValidMoves = enPassantMoves(board, from);
  // We checks if there's an en passant move with the current selected piece.
  const isEnPassant = enPassantValidMoves.some(
    cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
  );
  return isEnPassant;
}


//We're just checking the last move, for 'en passant', we don't consider the status of every pawn.
function hasPawnMovedTwoSquares(lastMove?: Readonly<Move | undefined>): boolean {
  if (!lastMove || !(lastMove.piece.type === PieceType.Pawn)) return false;

  const startRow = lastMove.from.coordinates.row;
  const endRow = lastMove.to.coordinates.row;

  return (Math.abs(endRow - startRow) === 2) ? true : false;
}
