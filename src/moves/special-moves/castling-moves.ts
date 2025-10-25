import type { Cell, CellColor, GameStatus, Move } from '../../type';

import { checkForCheck } from '../../utils/game-status-utils';
import { isPlayerKing, isPlayerPiece, playerKing } from '../../utils/piece-utils';
import { movePiece } from '../move-piece';

export function areInBetweenCellsEmpty(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell>): boolean {
  const inBetweenCells = orderedInBetweenCells(cells, kingCell, rookCell);
  return !inBetweenCells.some(cell => cell.piece);
}

export function castlingMoves(cells: Readonly<Cell[]>, lastMove: Readonly<Move | undefined>, turn: CellColor, gameStatus: GameStatus): Cell[] {
  const kingCell = playerKing(cells, turn);
  const rookCells: Cell[] = cells.filter(cell => cell.piece?.type.endsWith('R') && isPlayerPiece(cell, turn));

  if(!kingCell ||
    kingCell.piece!.hasMoved === true ||
    rookCells.every(rook => rook.piece!.hasMoved === true ||
    gameStatus === 'check'
    )) return [];

  const leftRookCell = rookCells.find(rook => rook.coordinates.col === 0);
  const rightRookCell = rookCells.find(rook => rook.coordinates.col === 7);

  // We will add the rook as a valid destination, if castling is possible.
  // The Boolean() syntax allows us to satisfy the immutability rule
  const canCastleLeft = Boolean(
    leftRookCell &&
    areInBetweenCellsEmpty(cells, kingCell, leftRookCell) &&
    !orderedInBetweenCells(cells, kingCell, leftRookCell).some(cell => {
      const { cells: simulatedBoard } = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
      return checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true).check === true;
    })
  );

  const canCastleRight = Boolean(
    rightRookCell &&
    areInBetweenCellsEmpty(cells, kingCell, rightRookCell) &&
    !orderedInBetweenCells(cells, kingCell, rightRookCell).some(cell => {
      const { cells: simulatedBoard } = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
      return checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true).check === true;
    })
  );

  return [
    ...(canCastleLeft && leftRookCell ? [leftRookCell] : []),
    ...(canCastleRight && rightRookCell ? [rightRookCell] : []),
  ];
}

  export function getSidesCells(cells: Readonly<Cell[]>, playingCell: Readonly<Cell>): Cell[] {
  // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
  return cells.filter(cell =>
    cell.coordinates.row === playingCell.coordinates.row &&
    //Checking both col -1 and col + 1 (Math.abs(1))
    Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1);
}

export function isCastlingMove(startCell: Readonly<Cell>, destinationCell: Readonly<Cell>, turn: CellColor): boolean {
  // If the players selects its king and then its rook, it's an attempted castling move
  // This is just a quick check, because it only triggers when we know what are the valid moves.
  // The actual logic of the move, which properly places the king and the rook, are in movePiece
  return (
    isPlayerKing(startCell, turn) &&
    destinationCell.piece?.type.endsWith('R') === true &&
    isPlayerPiece(destinationCell, turn)
  );
}

//This next function only considers cells involved in a potential castling.
export function orderedInBetweenCells(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell>): Cell[] {
  //Return ordered cells between king and rook (ordered as the king would traverse)
  return rookCell.coordinates.col === 0
    ? cells
        .filter(cell =>
          cell.coordinates.row === kingCell.coordinates.row &&
          cell.coordinates.col > rookCell.coordinates.col &&
          cell.coordinates.col < kingCell.coordinates.col
        )
        .toSorted((a, b) => b.coordinates.col - a.coordinates.col)
    : cells
        .filter(cell =>
          cell.coordinates.row === kingCell.coordinates.row &&
          cell.coordinates.col > kingCell.coordinates.col &&
          cell.coordinates.col < rookCell.coordinates.col
        )
        .toSorted((a, b) => a.coordinates.col - b.coordinates.col);
}
