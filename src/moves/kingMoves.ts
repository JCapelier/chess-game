import type { Cell, CellColor, GameStatus, Move } from "../type";
import { getCellInfo, isEnemyPiece } from '../utils/utils';
import { castlingMoves } from '../utils/boardUtils'

export function kingValidMoves(cells: Cell[], startCell: Cell, lastMove: Move | undefined, turn: CellColor, gameStatus: GameStatus): Cell[] {

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

  possibleMoves.push(...castlingMoves(cells, lastMove, turn, gameStatus))

  return possibleMoves
}
