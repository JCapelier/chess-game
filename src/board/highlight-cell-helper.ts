import type { Board } from "./board";

import { castlingMoves } from "../moves/castling-helper";
import { type Cell, GameStatus, PieceType } from "../type";
import { areSameCoordinates } from "../utils/cells-utils";

/**
 * Helpers to determine cell highlighting on the chess board.
 */

/**
 * Checks if a cell contains a piece attacking the king.
 */
  export function isAttackerCell(board: Readonly<Board>, cell: Readonly<Cell>): boolean {
    return board.attackers.some(attacker => areSameCoordinates(attacker.coordinates, cell.coordinates));
  }

/**
 * Checks if a cell is a valid castling destination.
 */
  export function isCastlingDestination(board: Readonly<Board>, cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    if (!(selectedCell && selectedCell.piece && selectedCell.piece.type === PieceType.King)) return false;
    return castlingMoves(board).some(move => areSameCoordinates(move.coordinates, cell.coordinates));
  }

/**
 * Checks if a cell contains the current player's king in check.
 */
  export function isCheckedKing(board: Readonly<Board>, cell: Readonly<Cell>) {
    if (board.gameStatus === GameStatus.Playing || board.gameStatus === GameStatus.Stalemate) return false;
    return Boolean(cell.piece && cell.piece.isPlayerKing(board.turn));
  }

/**
 * Checks if a cell is a possible destination for the selected piece.
 */
  export function isPossibleDestination(board: Readonly<Board>, cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    if (!selectedCell) return false;
    return board.getPossibleMoves(selectedCell).some(destination => areSameCoordinates(destination.coordinates, cell.coordinates));
  }

/**
 * Checks if a cell is currently selected.
 */
  export function isSelectedCell(cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    if (!selectedCell) return false;
    return areSameCoordinates(cell.coordinates, selectedCell.coordinates);
  }
