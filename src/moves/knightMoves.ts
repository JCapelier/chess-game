import type { Cell } from "../type";
import { isEnemyPiece } from '../utils/pieceUtils';
import { getCellInfo } from "../utils/boardUtils";

export function knightValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row, piece } = getCellInfo(startCell);

  if (!piece || !piece.type.endsWith('N')) return [];

  const destinations: Cell[] = [];

  // Here, we list every possible direction for the knight. We'll then apply them to the start position to check where it lands.
  const knightDirections = [
    { directionRow: -2, directionCol: -1 }, { directionRow: -2, directionCol: +1 },
    { directionRow: -1, directionCol: -2 }, { directionRow: -1, directionCol: +2 },
    { directionRow: +1, directionCol: -2 }, { directionRow: +1, directionCol: +2 },
    { directionRow: +2, directionCol: -1 }, { directionRow: +2, directionCol: +1 },
  ];

  for (const direction of knightDirections) {
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
