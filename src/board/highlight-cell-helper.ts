import type { Board } from "./board";

import { castlingMoves } from "../moves/castling-helper";
import { getPossibleMoves } from "../moves/possible-moves";
import { type Cell, GameStatus, PieceType } from "../type";
import { toChessNotation } from "../utils/utils";

  export function isAttackerCell(board: Readonly<Board>, cell: Readonly<Cell>): boolean {
    return board.attackers.some(attacker => toChessNotation(attacker.coordinates) === toChessNotation(cell.coordinates));
  }

  export function isCastlingDestination(board: Readonly<Board>, cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    if (!(selectedCell && selectedCell.piece && selectedCell.piece.type === PieceType.King)) return false;
    return castlingMoves(board).some(move => toChessNotation(move.coordinates) === toChessNotation(cell.coordinates));
  }

  export function isCheckedKing(board: Readonly<Board>, cell: Readonly<Cell>) {
    if (board.gameStatus === GameStatus.Playing || board.gameStatus === GameStatus.Stalemate) return false;
    return Boolean(cell.piece && cell.piece.isPlayerKing(board.turn));
  }

  export function isPossibleDestination(board: Readonly<Board>, cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    if (!selectedCell) return false;
    return getPossibleMoves(board, selectedCell).some(destination => toChessNotation(destination.coordinates) === toChessNotation(cell.coordinates));
  }

  export function isSelectedCell(cell: Readonly<Cell>, selectedCell?: Readonly<Cell>): boolean {
    return selectedCell ? toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates) : false;
  }
