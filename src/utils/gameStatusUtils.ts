import { getPossibleMoves } from '../moves/moves';
import type { Cell, CellColor } from '../type';
import { isPlayerPiece, toChessNotation } from './utils';

export function checkForCheck(cells: Cell[], turn: CellColor, simulation: boolean = false):  {check: boolean, attackers: Cell[]} {
  // Find the king of the current turn's color
  const kingType = turn === 'white' ? 'wK' : 'bK';
  const kingCell = cells.find(cell => cell.piece && cell.piece.type === kingType);
  if (!kingCell) return { check: false, attackers: [] };

  // Find all enemy pieces
  const enemyColor = turn === 'white' ? 'black' : 'white';
  const enemyCells = cells.filter(cell => isPlayerPiece(cell, enemyColor));

  const attacks: Cell[] = [];
  enemyCells.forEach(cell => {
    const cellsAttacked = getPossibleMoves(cells, cell, enemyColor, simulation);
    if (
      cellsAttacked.some(attack =>
          toChessNotation(attack.coordinates) ===
          toChessNotation(kingCell.coordinates)
      )
    ) {
      attacks.push(cell); // cell is the attacking piece
    }
  });
  return {check: attacks.length > 0, attackers: attacks}
}

export function isCheckmate(cells: Cell[], turn: CellColor): boolean {
  const { check } = checkForCheck(cells, turn);
  if (!check) return false;

  // For every piece of the current player
  const playerCells = cells.filter(cell => isPlayerPiece(cell, turn));
  for (const cell of playerCells) {
    const moves = getPossibleMoves(cells, cell, turn);
    if (moves.length > 0) {
      return false; // There is at least one legal move
    }
  }
  return true; // In check and no legal moves: checkmate
}

export function isStaleMate(cells: Cell[], turn: CellColor): boolean {
  const { check } = checkForCheck(cells, turn);
  if (check) return false;

  const playerCells = cells.filter(cell => isPlayerPiece(cell, turn));
  //This syntax allows for break and return to leave the loop early (and continue to skip to the next iteration), which isn't allowed in forEach
  for (const cell of playerCells) {
    if (getPossibleMoves(cells, cell, turn).length > 0) {
      // If any piece has a possible move, then there is no stalemate.
      return false
    }
  }
  return true;
}
