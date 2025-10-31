import type { Cell, CellColor, GameStatus, Move } from "../type";

import { getCellInfo } from "../utils/board-utils";
import { isEnemyPiece } from '../utils/piece-utils';
import { castlingMoves } from "./special-moves/castling-moves";

export function validMoves(cells: Readonly<Cell[]>, startCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus): Cell[] {

  const { col, piece, row } = getCellInfo(startCell);

  if (!piece || !piece.type.endsWith('K')) return [];

  // Here, we list every possible direction for the king. We'll then apply them to the start position to check where it lands.
  const kingDirections = [
    { directionCol: -1, directionRow: -1 }, { directionCol: +1, directionRow: 0 },
    { directionCol: 0, directionRow: -1 }, { directionCol: -1, directionRow: +1 },
    { directionCol: +1, directionRow: -1 }, { directionCol: 0, directionRow: +1 },
    { directionCol: -1, directionRow: 0 }, { directionCol: +1, directionRow: +1 },
  ];

  const destinations: Cell[] = kingDirections.flatMap(direction => {
    const destinationRow = row + direction.directionRow;
    const destinationCol = col + direction.directionCol;
    const destinationCell = cells.find(cell =>
      cell.coordinates.row === destinationRow &&
      cell.coordinates.col === destinationCol
    );
    return destinationCell ? [destinationCell] : [];
  });

  const possibleMoves: Cell[] = destinations.filter(destination =>
    !destination.piece || isEnemyPiece(piece, destination.piece)
  );

  return [
    ...possibleMoves,
    ...castlingMoves(cells, lastMove, turn, gameStatus)
  ];
}
