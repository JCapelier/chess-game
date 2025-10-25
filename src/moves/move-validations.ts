import type { Cell, CellColor, GameStatus, Move } from '../type';

import { checkForCheck } from '../utils/game-status-utils';
import { movePiece } from './move-piece';

  export function filterMovesLeavingKingInCheck(cells: Readonly<Cell[]>, startCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>, possibleMoves: Readonly<Cell[]>, turn: CellColor, gameStatus: GameStatus): Cell[]{
    const validMoves: Cell[] = possibleMoves.flatMap(possibleMove => {
      const {cells: simulatedBoard} = movePiece(cells, startCell, possibleMove, lastMove, possibleMoves, turn);
      const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
      return (check.check === false) ? [possibleMove] : [];
    });
    return validMoves;
  }
