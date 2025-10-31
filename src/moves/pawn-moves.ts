import type { Cell, MoveContext } from "../type";

import { getCellInfo } from "../utils/board-utils";
import { isBlack, isEnemyPiece } from '../utils/piece-utils';
import { enPassantMoves } from "./special-moves/pawn-special-moves";

export function pawnValidMoves(context: Readonly<MoveContext>): Cell[] {

  const { col, piece, row } = getCellInfo(context.startCell);

  if (!piece || !piece.type.endsWith('P')) return [];


  //White moving up, black moving down
  const direction = isBlack(piece) ? 1 : -1;

  //Checking cells where pawn can move
  const oneCellAhead: Cell | undefined = context.cells.find(cell =>
    cell.coordinates.col === col &&
    cell.coordinates.row === row + direction
  );
  const twoCellsAhead: Cell | undefined = context.cells.find(cell =>
    cell.coordinates.col === col &&
    cell.coordinates.row === row + (direction * 2)
  );

  const diagonalCellLeft: Cell | undefined = context.cells.find(cell =>
    cell.coordinates.col === col - 1 &&
    cell.coordinates.row === row + direction
  );
  const diagonalCellRight: Cell | undefined = context.cells.find(cell =>
    cell.coordinates.col === col + 1 &&
    cell.coordinates.row === row + (direction)
  );

  //Checking if it can attack diagonally : cell exists and has an enemy piece
  const diagonalCells = [diagonalCellLeft, diagonalCellRight];
  const dialgonalCaptures = diagonalCells.flatMap(diagonalCell =>
    diagonalCell && diagonalCell.piece && isEnemyPiece(piece, diagonalCell.piece) ? [diagonalCell] : []
  );

  return [
    ...(oneCellAhead && !oneCellAhead.piece) ? [oneCellAhead] : [],
    ...(!piece.hasMoved && oneCellAhead && !oneCellAhead.piece && twoCellsAhead && !twoCellsAhead.piece) ? [twoCellsAhead] : [],
    ...dialgonalCaptures,
    ...enPassantMoves(context.cells, context.startCell, context.lastMove)
  ];
}
