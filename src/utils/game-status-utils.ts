import type { Cell, CellColor, GameStatus, Move } from '../type';

import { getPossibleMoves } from '../moves/possible-moves';
import { isPlayerPiece } from './piece-utils';
import { toChessNotation } from './utils';

export function checkForCheck(cells: Readonly<Cell[]>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus, simulation: boolean = false):  {attackers: Cell[]; check: boolean,} {
  // Find the king of the current turn's color
  const kingType = turn === 'white' ? 'wK' : 'bK';
  const kingCell = cells.find(cell => cell.piece && cell.piece.type === kingType);
  if (!kingCell) return { attackers: [], check: false };

  // Find all enemy pieces
  const enemyColor = turn === 'white' ? 'black' : 'white';
  const enemyCells = cells.filter(cell => isPlayerPiece(cell, enemyColor));

  const attacks: Cell[] = enemyCells.filter(cell => {
    const cellsAttacked = getPossibleMoves(cells, cell, lastMove, enemyColor, gameStatus, simulation);
    return cellsAttacked.some(
      attack => toChessNotation(attack.coordinates) === toChessNotation(kingCell.coordinates)
    );
  });

  return {attackers: attacks, check: attacks.length > 0};
}


export function isCheckmate(cells: Readonly<Cell[]>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus): boolean {
  const { check } = checkForCheck(cells, lastMove, turn, gameStatus);
  if (!check) return false;
  return !hasLegalMove(cells, lastMove, turn, gameStatus);
}

export function isStaleMate(cells: Readonly<Cell[]>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus): boolean {
  const { check } = checkForCheck(cells, lastMove, turn, gameStatus);
  if (check) return false;
  return !hasLegalMove(cells, lastMove, turn, gameStatus);
}

function hasLegalMove(cells: Readonly<Cell[]>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus): boolean {
  return cells
    .filter(cell => isPlayerPiece(cell, turn))
    .some(cell => getPossibleMoves(cells, cell, lastMove, turn, gameStatus).length > 0);
}
