
import { getPossibleMoves } from '../moves/possible-moves';
import { type Cell, CellColor, type MoveContext, PieceType } from '../type';
import { toChessNotation } from './utils';

export function checkForCheck(context: Readonly<MoveContext>):  {attackers: Cell[]; check: boolean,} {
  // Find the king of the current turn's color
  const kingCell = context.cells.find(cell => cell.piece && cell.piece.type === PieceType.King && cell.piece.color === context.turn);
  if (!kingCell) return { attackers: [], check: false };

  // Find all enemy pieces
  const enemyColor = context.turn === CellColor.White ? CellColor.Black : CellColor.White;
  const enemyCells = context.cells.filter(cell => cell.piece && cell.piece.color === enemyColor);

  const attacks: Cell[] = enemyCells.filter(cell => {
    const enemyContext: MoveContext = {...context, startCell: cell, turn: enemyColor};
    const cellsAttacked = getPossibleMoves(enemyContext, true);
    return cellsAttacked.some(
      attack => toChessNotation(attack.coordinates) === toChessNotation(kingCell.coordinates)
    );
  });

  return {attackers: attacks, check: attacks.length > 0};
}


export function isCheckmate(context: Readonly<MoveContext>): boolean {
  const { check } = checkForCheck(context);
  if (!check) return false;
  return !hasLegalMove(context);
}

export function isStaleMate(context: Readonly<MoveContext>): boolean {
  const { check } = checkForCheck(context);
  if (check) return false;
  return !hasLegalMove(context);
}

function hasLegalMove(context: Readonly<MoveContext>): boolean {
  return context.cells
    .filter(cell => cell.piece && cell.piece.isPlayerPiece(context.turn))
    .some(cell => {
      const moveContext = {...context, startCell: cell};
      // Use normal move validation (simulation=false) to properly filter moves that leave king in check
      return getPossibleMoves(moveContext, false).length > 0;
    });
}
