import type { Cell, CellColor, Move } from "../type";
import { isEnemyPiece, getCellInfo } from '../utils/utils';
import { pawnValidMoves } from "./pawnMoves";
import { rookValidMoves } from "./rookMoves";
import { bishopValidMoves } from "./bishopMoves";
import { knightValidMoves } from "./knightMoves";
import { queenValidMoves } from "./queenMoves";
import { kingValidMoves } from "./kingMoves";
import { filterMovesLeavingKingInCheck } from "../utils/boardUtils";

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

export function diagonalSlidingMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row } = getCellInfo(startCell);

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

//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function getPossibleMoves(cells: Cell[], startCell: Cell, lastMove: Move | undefined, turn: CellColor, simulation: boolean = false): Cell[] {
  if (!startCell.piece) return [];

  let possibleMoves: Cell[] = []
  // The last letter of the type allows us to determine what move is possible.
  switch (startCell.piece.type.at(-1)) {
    case 'P':
      possibleMoves = pawnValidMoves(cells, startCell, lastMove);
      break;
    case 'R':
      possibleMoves = rookValidMoves(cells, startCell);
      break;
    case 'B':
      possibleMoves = bishopValidMoves(cells, startCell);
      break;
    case 'N':
      possibleMoves = knightValidMoves(cells, startCell);
      break;
    case 'Q':
      possibleMoves = queenValidMoves(cells, startCell);
      break;
    case 'K':
      possibleMoves = kingValidMoves(cells, startCell);
      break;
    default:
      return []
  }

  return simulation === false ? filterMovesLeavingKingInCheck(cells, startCell, lastMove, possibleMoves, turn) : possibleMoves;

}
