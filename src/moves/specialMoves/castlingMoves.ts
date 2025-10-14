import type { Cell, Move, CellColor, GameStatus } from '../../type';
import { movePiece } from '../movePiece';
import { checkForCheck } from '../../utils/gameStatusUtils';
import { playerKing, isPlayerKing, isPlayerPiece } from '../../utils/pieceUtils';

export function castlingMoves(cells: Cell[], lastMove: Move | undefined, turn: CellColor, gameStatus: GameStatus): Cell[] {
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
  // In the end, to perform it, the player will need to click on the rook after selecting the king.
  // The logic to get the proper destinations will be dealt with in movePiece.
  const castlingMoves: Cell[] = [];
  let canCastleLeft = true;
  if (leftRookCell && areInBetweenCellsEmpty(cells, kingCell, leftRookCell)) {
    const leftInBetweenCells: Cell[] = orderedInBetweenCells(cells, kingCell, leftRookCell)
    for (const cell of leftInBetweenCells) {
      //We're only passing the cell we're passing through as possibleMoves for the simulation
      const {cells: simulatedBoard} = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
      const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
      if (check.check === true) {
        canCastleLeft = false;
        break;
      }
    }
    if (canCastleLeft) castlingMoves.push(leftRookCell);
  }
  let canCastleRight = true

  if (rightRookCell && areInBetweenCellsEmpty(cells, kingCell, rightRookCell)) {
    const leftInBetweenCells: Cell[] = orderedInBetweenCells(cells, kingCell, rightRookCell)
    for (const cell of leftInBetweenCells) {
      //We're only passing the cell we're passing through as possibleMoves for the simulation
      const {cells: simulatedBoard} = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
      const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
      if (check.check === true) {
        canCastleRight = false;
        break;
      }
    }
    if (canCastleRight) castlingMoves.push(rightRookCell);
  }

  return castlingMoves;
}

export function isCastlingMove(startCell: Cell, destinationCell: Cell, turn: CellColor): boolean {
  // If the players selects its king and then its rook, it's an attempted castling move
  // This is just a quick check, because it only triggers when we know what are the valid moves.
  // The actual logic of the move, which properly places the king and the rook, are in movePiece
  return (
    isPlayerKing(startCell, turn) &&
    destinationCell.piece?.type.endsWith('R') === true &&
    isPlayerPiece(destinationCell, turn)
  );
}

  export function getSidesCells(cells: Cell[], playingCell: Cell): Cell[] {
  // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
  return cells.filter(cell =>
    cell.coordinates.row === playingCell.coordinates.row &&
    //Checking both col -1 and col + 1 (Math.abs(1))
    Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1)
}

//This next function only considers cells involved in a potential castling.
export function orderedInBetweenCells(cells: Cell[], kingCell: Cell, rookCell: Cell): Cell[] {
  let inBetweenCells: Cell[] = [];
  //We need to know if we have the left or right rook to check cells between rook and king.
  if (rookCell.coordinates.col === 0) {
    inBetweenCells = cells.filter(cell =>
    cell.coordinates.row === kingCell.coordinates.row &&
    cell.coordinates.col > rookCell.coordinates.col &&
    cell.coordinates.col < kingCell.coordinates.col)
    //We want to sort them as an outward movement for the king, to make an easier checkForCheck later in the castling process
    .sort((a, b) => b.coordinates.col - a.coordinates.col);
  } else {
    inBetweenCells = cells.filter(cell =>
    cell.coordinates.row === kingCell.coordinates.row &&
    cell.coordinates.col > kingCell.coordinates.col &&
    cell.coordinates.col < rookCell.coordinates.col)
    .sort((a, b) => a.coordinates.col - b.coordinates.col);
  }
  return inBetweenCells;
}

export function areInBetweenCellsEmpty(cells: Cell[], kingCell: Cell, rookCell: Cell): boolean {
  const inBetweenCells = orderedInBetweenCells(cells, kingCell, rookCell);
  for (const cell of inBetweenCells) {
    if (cell.piece) {
      return false;
    }
  }
  return true;
}
