import type { Cell } from "./type";
import { getCellInfo } from './utils';
import { checkOrderedCells } from "./moves";

export function bishopValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row, piece } = getCellInfo(startCell);

  if (!piece || !piece.type.endsWith('B')) return [];

  // The following logic relies on the fact that
  // 1) for every point on a top-left to bottom-right diagonal, row - col is constant
  // 2) for every point on a top-right to bottom-left diagonal, row + col is constant

  // As for the rooks, each array is sorted, so that we can move outward from the rook position when checking cells

  // Top-left: col < startCol, row < startRow, (col - row) === (startCol - startRow)
  const topLeftCells = cells.filter(cell =>
    cell.coordinates.col < col &&
    cell.coordinates.row < row &&
    (cell.coordinates.col - cell.coordinates.row) === (col - row)
  ).sort((a, b) => b.coordinates.col - a.coordinates.col);


  // Bottom-right: col > startCol, row > startRow, (col - row) === (startCol - startRow)
  const bottomRightCells = cells.filter(cell =>
    cell.coordinates.col > col &&
    cell.coordinates.row > row &&
    (cell.coordinates.col - cell.coordinates.row) === (col - row)
  ).sort((a, b) => a.coordinates.col - b.coordinates.col);

  // Top-right: col > startCol, row < startRow, (col + row) === (col + row)
  const topRightCells = cells.filter(cell =>
    cell.coordinates.col > col &&
    cell.coordinates.row < row &&
    (cell.coordinates.col + cell.coordinates.row) === (col + row)
  ).sort((a, b) => a.coordinates.col - b.coordinates.col);

  // Bottom-left: col < startCol, row > startRow, (col + row) === (col + row)
  const bottomLeftCells = cells.filter(cell =>
    cell.coordinates.col < col &&
    cell.coordinates.row > row &&
    (cell.coordinates.col + cell.coordinates.row) === (col + row)
  ).sort((a, b) => b.coordinates.col - a.coordinates.col);

  const orderedCells = [topLeftCells, bottomRightCells, topRightCells, bottomLeftCells];

  return checkOrderedCells(startCell, orderedCells)
}
