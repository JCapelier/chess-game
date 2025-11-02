import type { Cell, MoveContext } from '../type';

import { checkForCheck } from '../utils/game-status-utils';


  export function filterMovesLeavingKingInCheck(context: Readonly<MoveContext>, possibleMoves: Readonly<Cell[]>): Cell[]{
    const validMoves: Cell[] = possibleMoves.flatMap(possibleMove => {
      const {cells: simulatedBoard} = context.startCell!.piece!.movePiece(context, possibleMove, true);
      const simulatedContext: MoveContext = {...context, cells: simulatedBoard};
      const check = checkForCheck(simulatedContext, true);
      return (check.check === false) ? [possibleMove] : [];
    });
    return validMoves;
  }
