import { CellColor, GameStatus, type MoveResult } from "../type";
import { Board } from "./board";

  export function updateGameStatus(moveResult: Readonly<MoveResult>) {
    const checkResult = moveResult.board.checkForCheck();
    if (moveResult.board.isCheckmate(checkResult)) {
      moveResult.board.gameStatus = GameStatus.Checkmate;
    } else if (moveResult.board.isStaleMate(checkResult)) {
      moveResult.board.gameStatus = GameStatus.Stalemate;
    } else if (checkResult.check) {
      moveResult.board.gameStatus = GameStatus.Check;
    } else {
      moveResult.board.gameStatus = GameStatus.Playing;
    }
    moveResult.board.attackers = checkResult.attackers;
  }

  export function updateTurn(board: Readonly<Board>) {
    const newTurn: CellColor = board.turn === CellColor.White ? CellColor.Black : CellColor.White;
    return newTurn;
  }
