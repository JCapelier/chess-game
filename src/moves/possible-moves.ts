import type { Cell, CellColor, GameStatus, Move, MoveContext } from "../type";

import { filterMovesLeavingKingInCheck } from "./move-validations";

//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function getPossibleMoves(
  cells: Readonly<Cell[]>,
  startCell: Readonly<Cell>,
  lastMove: Readonly<Move | undefined>,
  turn: CellColor,
  gameStatus: GameStatus,
  simulation: boolean = false
): Cell[] {
  if (!startCell.piece) return [];

  const context: MoveContext = {
    cells,
    gameStatus,
    lastMove,
    startCell,
    turn,
  };

  const possibleMoves = startCell.piece.validMoves(context);
  return simulation === false
    ? filterMovesLeavingKingInCheck(cells, startCell, lastMove, possibleMoves, turn, gameStatus)
    : possibleMoves;
}
