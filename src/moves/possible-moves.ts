import type { Cell, MoveContext } from "../type";

import { checkForCheck } from "../utils/game-status-utils";

//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function filterMovesLeavingKingInCheck(context: Readonly<MoveContext>, possibleMoves: Readonly<Cell[]>): Cell[]{
  const validMoves: Cell[] = possibleMoves.flatMap(possibleMove => {
    const {cells: simulatedBoard} = context.startCell!.piece!.movePiece(context, possibleMove, true);
    const simulatedContext: MoveContext = {...context, cells: simulatedBoard};
    const check = checkForCheck(simulatedContext);
    return (check.check === false) ? [possibleMove] : [];
  });
  return validMoves;
}

export function getPossibleMoves(context: Readonly<MoveContext>, simulation: boolean = false): Cell[] {
  if (!context.startCell?.piece) return [];

  const possibleMoves = context.startCell.piece.validMoves(context);
  return simulation === false
    ? filterMovesLeavingKingInCheck(context, possibleMoves)
    : possibleMoves;
}
