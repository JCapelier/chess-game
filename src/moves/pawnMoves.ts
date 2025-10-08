import type { Cell } from "../type";
import { isBlack, isEnemyPiece, getCellInfo } from '../utils/utils';

export function pawnValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row, piece } = getCellInfo(startCell);
  const possibleMoves: Cell[] = [];

  if (!piece || !piece.type.endsWith('P')) return possibleMoves;


  //White moving up, black moving down
  const direction = isBlack(piece) ? 1 : -1;

  //Checking cells where pawn can move
  const oneCellAhead: Cell | undefined = cells.find(cell =>
    cell.coordinates.col === col &&
    cell.coordinates.row === row + direction
  );
  const twoCellsAhead: Cell | undefined = cells.find(cell =>
    cell.coordinates.col === col &&
    cell.coordinates.row === row + (direction * 2)
  );

  const diagonalCellLeft: Cell | undefined = cells.find(cell =>
    cell.coordinates.col === col - 1 &&
    cell.coordinates.row === row + direction
  );
  const diagonalCellRight: Cell | undefined = cells.find(cell =>
    cell.coordinates.col === col + 1 &&
    cell.coordinates.row === row + (direction)
  );

  //Can move ahead if cells exists and are empty (two cells ahead if hasn't moved yet)
  if (oneCellAhead && !oneCellAhead.piece) {
    possibleMoves.push(oneCellAhead);
  }

  if (!piece.hasMoved && oneCellAhead && !oneCellAhead.piece && twoCellsAhead && !twoCellsAhead.piece ) {
    possibleMoves.push(twoCellsAhead);
  }

  //Checking if it can attack diagonally : cell exists and has an enemy piece
  const diagonalCells = [diagonalCellLeft, diagonalCellRight]
  diagonalCells.forEach(diagonalCell => {
    if (diagonalCell && diagonalCell.piece && isEnemyPiece(piece, diagonalCell.piece)) {
      possibleMoves.push(diagonalCell);
    }
  });

  return possibleMoves;

  //TODO: En passant and promotion
}
