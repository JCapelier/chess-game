import type { Cell } from "./type";
import { isEnemyPiece, getCellInfo } from './utils';

export function isMoveLegal(cells: Cell[], startCell: Cell, endCell: Cell): boolean {

}

export function validMoves(cells: Cell[], startCell: Cell): Cell[] {

}

// Generic function to scan in ordered directions for sliding pieces (rook, bishop, queen)
export function checkOrderedCells(startCell: Cell, orderedCells: Cell[][]): Cell[] {
  const possibleMoves: Cell[] = [];

  // For each ordered array (direction), go outward from the piece's cell and check:
  // - if it's free, add to possibleMoves and continue
  // - if occupied by an enemy, add and break
  // - if occupied by an ally, break without adding
  orderedCells.forEach(orderedArray => {
    for (const cell of orderedArray) {
      if (!cell.piece) {
        possibleMoves.push(cell);
      } else if (startCell.piece && isEnemyPiece(startCell.piece, cell.piece)) {
        possibleMoves.push(cell);
        break; // Stop after capturing enemy
      } else {
        break; // Stop at ally
      }
    }
  });
  return possibleMoves;
}

// Even though orthogonal and diagonal sliding moves are the core of rookMoves and bishopMoves
// they had to be extracted to be reused in the queenMoves.
// rookValidMoves and bishopValidMoves both have guard clauses returning [] if the piece isn't a rook or a bishop respectively.

export function orthogonalSlidingMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row } = getCellInfo(startCell);

  const horizontalCells: Cell[] = cells.filter(cell => cell.coordinates.row === row);
  // Cells must be sorted to be checked in the proper order (outward from the position of the playing piece)
  // Comparison has to be strict to exclude the rook's position, otherwise it could move to itself and pass a turn
  const leftCells = horizontalCells.filter(cell => cell.coordinates.col < col).sort((a, b) => b.coordinates.col - a.coordinates.col);
  const rightCells = horizontalCells.filter(cell => cell.coordinates.col > col).sort((a, b) => a.coordinates.col - b.coordinates.col);

  const verticalCells: Cell[] = cells.filter(cell => cell.coordinates.col === col);
  const upCells = verticalCells.filter(cell => cell.coordinates.row < row).sort((a, b) => b.coordinates.row - a.coordinates.row);
  const downCells = verticalCells.filter(cell => cell.coordinates.row > row).sort((a, b) => a.coordinates.row - b.coordinates.row);

  const orderedCells = [leftCells, rightCells, upCells, downCells]
  return checkOrderedCells(startCell, orderedCells)
}


