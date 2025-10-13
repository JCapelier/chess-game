import type { Cell, CellColor, Move, GameStatus } from "../type";
import { pawnValidMoves } from "./pawnMoves";
import { rookValidMoves } from "./rookMoves";
import { bishopValidMoves } from "./bishopMoves";
import { knightValidMoves } from "./knightMoves";
import { queenValidMoves } from "./queenMoves";
import { kingValidMoves } from "./kingMoves";
import { filterMovesLeavingKingInCheck } from "./moveValidations";



//Without the simulation boolean, we end in a loop, because filterMovesLeavingKingInCheck
//calls checkForCheck which calls getPossibleMoves
export function getPossibleMoves(cells: Cell[], startCell: Cell, lastMove: Move | undefined, turn: CellColor, gameStatus: GameStatus, simulation: boolean = false): Cell[] {
  if (!startCell.piece) return [];

  let possibleMoves: Cell[] = []
  // The last letter of the type allows us to determine what move is possible.
  switch (startCell.piece.type.at(-1)) {
    case 'P':
      possibleMoves = pawnValidMoves(cells, startCell, lastMove);
      break;
    case 'R':
      possibleMoves = rookValidMoves(cells, startCell);
      break;
    case 'B':
      possibleMoves = bishopValidMoves(cells, startCell);
      break;
    case 'N':
      possibleMoves = knightValidMoves(cells, startCell);
      break;
    case 'Q':
      possibleMoves = queenValidMoves(cells, startCell);
      break;
    case 'K':
      possibleMoves = kingValidMoves(cells, startCell, lastMove, turn, gameStatus);
      break;
    default:
      return []
  }
  return simulation === false ? filterMovesLeavingKingInCheck(cells, startCell, lastMove, possibleMoves, turn, gameStatus) : possibleMoves;
}
