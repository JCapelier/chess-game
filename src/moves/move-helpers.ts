import type { ChessPiece } from '../models/chess-piece';
import type { Cell } from '../type';

import { getPieceLocation } from '../utils/find-piece-utils';

// Generic function to scan in ordered directions for sliding pieces (rook, bishop, queen)
export function checkOrderedCells(playingPiece: Readonly<ChessPiece>, orderedCells: Readonly<Cell[][]>): Cell[] {

  // For each ordered array (direction), go outward from the piece's cell and check:
  // - if it's free, add to possibleMoves and continue
  // - if occupied by an enemy, add and break
  // - if occupied by an ally, break without adding
  return orderedCells.flatMap(orderedArray => {
    const firstOccupiedIndex = orderedArray.findIndex(cell => cell.piece);

    // no occupied cells -> include the whole array
    if (firstOccupiedIndex === -1) return orderedArray;

    // there's an occupied cell; include cells up to it (exclusive),
    // and include it too only if it's an enemy
    const occupiedCell = orderedArray[firstOccupiedIndex];
    const includeOccupied = occupiedCell.piece && playingPiece.isEnemyPiece(occupiedCell.piece);

    return orderedArray.slice(0, includeOccupied ? firstOccupiedIndex + 1 : firstOccupiedIndex);
  });
}

export function diagonalSlidingMoves(cells: Readonly<Cell[]>, playingPiece: Readonly<ChessPiece>): Cell[] {
  // The following logic relies on the fact that
  // 1) for every point on a top-left to bottom-right diagonal, row - col is constant
  // 2) for every point on a top-right to bottom-left diagonal, row + col is constant

  // As for the rooks, each array is sorted, so that we can move outward from the rook position when checking cells
  const playingPieceLocation = getPieceLocation(cells, playingPiece);
  if (!playingPieceLocation) return [];

  // Top-left: col < startCol, row < startRow, (col - row) === (startCol - startRow)
  const topLeftCells = cells.filter(cell =>
    cell.coordinates.col < playingPieceLocation.col &&
    cell.coordinates.row < playingPieceLocation.row &&
    (cell.coordinates.col - cell.coordinates.row) === (playingPieceLocation.col - playingPieceLocation.row)
  ).toSorted((a, b) => b.coordinates.col - a.coordinates.col);


  // Bottom-right: col > startCol, row > startRow, (col - row) === (startCol - startRow)
  const bottomRightCells = cells.filter(cell =>
    cell.coordinates.col > playingPieceLocation.col &&
    cell.coordinates.row > playingPieceLocation.row &&
    (cell.coordinates.col - cell.coordinates.row) === (playingPieceLocation.col - playingPieceLocation.row)
  ).toSorted((a, b) => a.coordinates.col - b.coordinates.col);

  // Top-right: col > startCol, row < startRow, (col + row) === (col + row)
  const topRightCells = cells.filter(cell =>
    cell.coordinates.col > playingPieceLocation.col &&
    cell.coordinates.row < playingPieceLocation.row &&
    (cell.coordinates.col + cell.coordinates.row) === (playingPieceLocation.col + playingPieceLocation.row)
  ).toSorted((a, b) => a.coordinates.col - b.coordinates.col);

  // Bottom-left: col < startCol, row > startRow, (col + row) === (col + row)
  const bottomLeftCells = cells.filter(cell =>
    cell.coordinates.col < playingPieceLocation.col &&
    cell.coordinates.row > playingPieceLocation.row &&
    (cell.coordinates.col + cell.coordinates.row) === (playingPieceLocation.col + playingPieceLocation.row)
  ).toSorted((a, b) => b.coordinates.col - a.coordinates.col);

  const orderedCells = [topLeftCells, bottomRightCells, topRightCells, bottomLeftCells];

  return checkOrderedCells(playingPiece, orderedCells);
}

export function jumpingMoves(cells: Readonly<Cell[]>, playingPiece: Readonly<ChessPiece>): Cell[] {
    const playingPieceLocation = getPieceLocation(cells, playingPiece);
    if (!playingPieceLocation) return [];
    const JUMP_DIRECTIONS = [
      { directionCol: -1, directionRow: -2 }, { directionCol: +1, directionRow: -2 },
      { directionCol: -2, directionRow: -1 }, { directionCol: +2, directionRow: -1 },
      { directionCol: -2, directionRow: +1 }, { directionCol: +2, directionRow: +1 },
      { directionCol: -1, directionRow: +2 }, { directionCol: +1, directionRow: +2 },
    ];

    const destinations: Cell[] = JUMP_DIRECTIONS.flatMap(direction => {
      const destinationRow = playingPieceLocation.row + direction.directionRow;
      const destinationCol = playingPieceLocation.col + direction.directionCol;
      const destinationCell = cells.find(cell =>
        cell.coordinates.row === destinationRow &&
        cell.coordinates.col === destinationCol
      );
      return destinationCell ? [destinationCell] : [];
    });

    const possibleMoves: Cell[] = destinations.filter(destination =>
      !destination.piece || playingPiece.isEnemyPiece(destination.piece)
    );

    return possibleMoves;
  }

// Even though orthogonal and diagonal sliding moves are the core of rookMoves and bishopMoves
// they had to be extracted to be reused in the queenMoves.
// rookValidMoves and bishopValidMoves both have guard clauses returning [] if the piece isn't a rook or a bishop respectively.
export function orthogonalSlidingMoves(cells: Readonly<Cell[]>, playingPiece: Readonly<ChessPiece>): Cell[] {
  const playingPieceLocation = getPieceLocation(cells, playingPiece);
  if (!playingPieceLocation) return [];

  const horizontalCells: Cell[] = cells.filter(cell => cell.coordinates.row === playingPieceLocation.row);
  // Cells must be sorted to be checked in the proper order (outward from the position of the playing piece)
  // Comparison has to be strict to exclude the rook's position, otherwise it could move to itself and pass a turn
  const leftCells = horizontalCells.filter(cell => cell.coordinates.col < playingPieceLocation.col).toSorted((a, b) => b.coordinates.col - a.coordinates.col);
  const rightCells = horizontalCells.filter(cell => cell.coordinates.col > playingPieceLocation.col).toSorted((a, b) => a.coordinates.col - b.coordinates.col);

  const verticalCells: Cell[] = cells.filter(cell => cell.coordinates.col === playingPieceLocation.col);
  const upCells = verticalCells.filter(cell => cell.coordinates.row < playingPieceLocation.row).toSorted((a, b) => b.coordinates.row - a.coordinates.row);
  const downCells = verticalCells.filter(cell => cell.coordinates.row > playingPieceLocation.row).toSorted((a, b) => a.coordinates.row - b.coordinates.row);

  const orderedCells = [leftCells, rightCells, upCells, downCells];
  return checkOrderedCells(playingPiece, orderedCells);
}
