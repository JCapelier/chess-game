import type { Cell, CellColor, GameStatus, Move } from "../type";

import { bishopValidMoves } from "./bishop-moves";
import { kingValidMoves } from "./king-moves";
import { knightValidMoves } from "./knight-moves";
import { filterMovesLeavingKingInCheck } from "./move-validations";
import { pawnValidMoves } from "./pawn-moves";
import { queenValidMoves } from "./queen-moves";
import { rookValidMoves } from "./rook-moves";



//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function getPossibleMoves(
  cells: Readonly<Cell[]>,
  startCell: Readonly<Cell>,
  lastMove: Readonly<Move | undefined>,
  turn: CellColor,
  gameStatus: GameStatus,
  simulation: boolean = false
): Cell[] {
  const getMoves = () => {
    if (!startCell.piece) return [];
    switch (startCell.piece.type.at(-1)) {
      case 'B': { return bishopValidMoves(cells, startCell); }
      case 'K': { return kingValidMoves(cells, startCell, lastMove, turn, gameStatus); }
      case 'N': { return knightValidMoves(cells, startCell); }
      case 'P': { return pawnValidMoves(cells, startCell, lastMove); }
      case 'Q': { return queenValidMoves(cells, startCell); }
      case 'R': { return rookValidMoves(cells, startCell); }
      default: { return []; }
    }
  };

  const possibleMoves = getMoves();
  return simulation === false
    ? filterMovesLeavingKingInCheck(cells, startCell, lastMove, possibleMoves, turn, gameStatus)
    : possibleMoves;
}
