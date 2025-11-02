import type { Cell, MoveContext } from "../type";

import { filterMovesLeavingKingInCheck } from "./move-validations";

//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function getPossibleMoves(context: Readonly<MoveContext>, simulation: boolean = false): Cell[] {
  if (!context.startCell?.piece) return [];

  const possibleMoves = context.startCell.piece.validMoves(context);
  return simulation === false
    ? filterMovesLeavingKingInCheck(context, possibleMoves)
    : possibleMoves;
}
