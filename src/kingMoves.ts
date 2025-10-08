import type { Cell } from "./type";
import { getCellInfo, isEnemyPiece } from './utils';

export function kingValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row, piece } = getCellInfo(startCell);

  if (!piece || !piece.type.endsWith('K')) return [];

  const destinations: Cell[] = [];

  // Here, we list every possible direction for the king. We'll then apply them to the start position to check where it lands.
  const kingDirections = [
    { directionRow: -1, directionCol: -1 }, { directionRow: 0, directionCol: +1 },
    { directionRow: -1, directionCol: 0 }, { directionRow: +1, directionCol: -1 },
    { directionRow: -1, directionCol: +1 }, { directionRow: +1, directionCol: 0 },
    { directionRow: 0, directionCol: -1 }, { directionRow: +1, directionCol: +1 },
  ];

  for (const direction of kingDirections) {
    const destinationRow = row + direction.directionRow;
    const destinationCol = col + direction.directionCol;
    const destinationCell = cells.find(cell =>
      cell.coordinates.row === destinationRow &&
      cell.coordinates.col === destinationCol
    );
    if (destinationCell) destinations.push(destinationCell);
  }

  const possibleMoves: Cell[] = []

  destinations.forEach(destination => {
    if (!destination.piece) {
      possibleMoves.push(destination);
    } else if (isEnemyPiece(piece, destination.piece)) {
      possibleMoves.push(destination)
    }
  })

  return possibleMoves
}
