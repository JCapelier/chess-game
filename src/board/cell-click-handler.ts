import type { Cell } from "../type";
import type { Board } from "./board";

import { toChessNotation } from "../utils/utils";

export function cellClickHandler(board: Board, undoStack: Board[], cell: Cell, selectedCell?: Cell): {board: Board, moveSuccess: boolean, selectedCell: Cell | undefined, undoStack: Board[]} {
  if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
  return {board: board, moveSuccess: false, selectedCell: undefined, undoStack: undoStack};
} else if (selectedCell) {
    const result = board.movePiece(selectedCell, cell);
    if (result.success) return {
      board: result.board, moveSuccess: true, selectedCell: undefined, undoStack: [...undoStack, board]
    };
  } else if (cell.piece && cell.piece.isPlayerPiece(board.turn)) {
    return {board: board, moveSuccess: false, selectedCell: cell, undoStack: undoStack};
  }
  return {board: board, moveSuccess: false, selectedCell: undefined, undoStack: undoStack};
}

  export function getPreviousBoardAndStack(undoStack: Board[]): {previousBoard: Board | undefined, previousStack: Board[]} {
    if (!(undoStack.at(-1))) return {previousBoard: undefined, previousStack: undoStack};
    const previousStack = undoStack.slice(0, -1);
    return {previousBoard: undoStack.at(-1), previousStack: previousStack};
  }
