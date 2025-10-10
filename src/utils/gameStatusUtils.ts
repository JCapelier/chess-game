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

export function checkforCheckmate(cells: Cell[], turn: CellColor, simulation: boolean): {checkmate: boolean, attackers: Cell[]} {

}
