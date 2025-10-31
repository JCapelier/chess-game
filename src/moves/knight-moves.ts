import type { Cell, MoveContext } from "../type";

import { getCellInfo } from "../utils/board-utils";
import { isEnemyPiece } from '../utils/piece-utils';

export function knightValidMoves(context: Readonly<MoveContext>): Cell[] {

  const { col, piece, row } = getCellInfo(context.startCell);

  if (!piece || !piece.type.endsWith('N')) return [];

  // Here, we list every possible direction for the knight. We'll then apply them to the start position to check where it lands.
  const knightDirections = [
    { directionCol: -1, directionRow: -2 }, { directionCol: +1, directionRow: -2 },
    { directionCol: -2, directionRow: -1 }, { directionCol: +2, directionRow: -1 },
    { directionCol: -2, directionRow: +1 }, { directionCol: +2, directionRow: +1 },
    { directionCol: -1, directionRow: +2 }, { directionCol: +1, directionRow: +2 },
  ];

  const destinations: Cell[] = knightDirections.flatMap(direction => {
    const destinationRow = row + direction.directionRow;
    const destinationCol = col + direction.directionCol;
    const destinationCell = context.cells.find(cell =>
      cell.coordinates.row === destinationRow &&
      cell.coordinates.col === destinationCol
    );
    return destinationCell ? [destinationCell] : [];
  });

  const possibleMoves: Cell[] = destinations.filter(destination =>
    !destination.piece || isEnemyPiece(piece, destination.piece)
  );

  return possibleMoves;
}
