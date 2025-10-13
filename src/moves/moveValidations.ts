import type { Cell, Move, CellColor, GameStatus } from '../type';
import { movePiece } from './movePiece';
import { checkForCheck } from '../utils/gameStatusUtils';

  export function filterMovesLeavingKingInCheck(cells: Cell[], startCell: Cell, lastMove: Move | undefined, possibleMoves: Cell[], turn: CellColor, gameStatus: GameStatus): Cell[]{
    const validMoves: Cell[] = [];
    possibleMoves.forEach(possibleMove => {
      // We're creating a copy of cells where the move would be accomplished, to check if playerKing would be in check or not
      const {cells: simulatedBoard} = movePiece(cells, startCell, possibleMove, lastMove, possibleMoves, turn);
      const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
      if (check.check === false) {
        validMoves.push(possibleMove);
      }
    })
    return validMoves;
  }
