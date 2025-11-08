import type { Cell } from "../type";

import { Board } from "../board/board";
import { PieceType } from "../type";
import { checkForCheck } from "../utils/game-status-utils";
import { castlingMoves } from "./castling-helper";
import { enPassantMoves } from "./en-passant-helper";

//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function filterMovesLeavingKingInCheck(board: Readonly<Board>, from: Readonly<Cell>, possibleMoves: Readonly<Cell[]>): Cell[]{
  const validMoves: Cell[] = possibleMoves.flatMap(possibleMove => {
    const {board: simulatedBoard} = board.movePiece(from, possibleMove, true);
    const check = checkForCheck(simulatedBoard);
    return (check.check === false) ? [possibleMove] : [];
  });
  return validMoves;
}

export function getPossibleMoves(board: Readonly<Board>, from: Readonly<Cell>, simulation: boolean = false): Cell[] {
  if (!from.piece) return [];

  // Start with basic piece moves
  const basicMoves = from.piece.validMoves(board.cells);

  // Add special moves based on piece type
  const kingMoves = from.piece.type === PieceType.King ? castlingMoves(board) : [];
  const pawnMoves = from.piece.type === PieceType.Pawn ? enPassantMoves(board as Board, from) : [];
  const allPossibleMoves = [...basicMoves, ...kingMoves, ...pawnMoves];

  return simulation === false
    ? filterMovesLeavingKingInCheck(board, from, allPossibleMoves)
    : allPossibleMoves;
}
