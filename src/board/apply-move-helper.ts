import type { Cell, MoveResult } from "../type";
import type { Board } from "./board";

import { castlingMoves } from "../moves/castling-helper";
import { toChessNotation } from "../utils/utils";

  export function applyCastling(board:Board, from: Cell, to: Cell): MoveResult {
    if (
      !from.piece ||
      !to.piece ||
      castlingMoves(board).length === 0
    ) return {board: board, success: false};

    if (castlingMoves(board).some(destination => toChessNotation(destination.coordinates) === toChessNotation(to.coordinates))) {
      if (to.coordinates.col === 0) {
        const newKingCell = board.cells.find(cell => cell.coordinates.row === from.coordinates.row && cell.coordinates.col === 2);
        const newRookCell = board.cells.find(cell => cell.coordinates.row === from.coordinates.row && cell.coordinates.col === 3);
        if (newKingCell && newRookCell) {
          newKingCell.piece = from.piece;
          newRookCell.piece = to.piece;
          to.piece = undefined;
          from.piece = undefined;
          return {board: board, success: true};
        }
    } else if (to.coordinates.col === 7) {
      const newKingCell = board.cells.find(cell => cell.coordinates.row === from.coordinates.row && cell.coordinates.col === 6);
      const newRookCell = board.cells.find(cell => cell.coordinates.row === from.coordinates.row && cell.coordinates.col === 5);
      if (newKingCell && newRookCell) {
        newKingCell.piece = from.piece;
        newRookCell.piece = to.piece;
        to.piece = undefined;
        from.piece = undefined;
        return {board: board, success: true};
      }
    }
  }
    return {board: board, success: false};
  }

  export function applyEnPassant(board: Board, from: Cell, to: Cell): MoveResult {
    if (!from.piece) return {board: board, success: false};
    to.piece = from.piece;
    from.piece = undefined;
    const enemyCell = board.cells.find(cell =>
      cell.coordinates.row === from.coordinates.row &&
      cell.coordinates.col === to.coordinates.col
    );
    if (enemyCell) {
      enemyCell.piece = undefined;
      return {board: board, success: true};
    } else {
      return {board: board, success: false};
    }
  }

  export function applyNormalMove(board: Board, from: Cell, to: Cell) {
    if (!from.piece) return {board: board, success: false};
    to.piece = from.piece;
    from.piece = undefined;
    return {board: board, success: true};
  }

  export function canMove(board: Board, from: Readonly<Cell>, to: Readonly<Cell>, simulation: boolean = false) {
    const possibleMoves: Cell[] = board.getPossibleMoves(from, simulation);
    return possibleMoves.some(cell => toChessNotation(cell.coordinates) === toChessNotation(to.coordinates));
  }
