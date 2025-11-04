/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
// Set up a classic stalemate test board
// Just move wQ from g7 to g6, and black will be stalemate
import { pieceFactory } from '../factories/piece-factory';
import { type Cell, CellColor, PieceType } from '../type';


export function setStalemateTestBoard(): Cell[] {
  // Empty 8x8 board
  const cells: Cell[] = [];
  for (let row = 1; row <= 8; row++) {
    for (let col = 0; col < 8; col++) {
      cells.push({
        cellColor: ((row + col) % 2 === 0) ? CellColor.White : CellColor.Black,
        coordinates: { col, row },
        piece: undefined,
      });
    }
  }

  // Place Black king on h8 (row 8, col 7)
  const blackKingCell = cells.find(cell => cell.coordinates.row === 8 && cell.coordinates.col === 7)!;
  blackKingCell.piece = pieceFactory.createPiece(CellColor.Black, true, blackKingCell.coordinates, PieceType.King);

  // Place White king on f6 (row 6, col 5)
  const whiteKingCell = cells.find(cell => cell.coordinates.row === 6 && cell.coordinates.col === 5)!;
  whiteKingCell.piece = pieceFactory.createPiece(CellColor.White, true, whiteKingCell.coordinates, PieceType.King);;

  // Place White queen on g7 (row 7, col 6)
  const whiteQueenCell = cells.find(cell => cell.coordinates.row === 7 && cell.coordinates.col === 6)!;
  whiteQueenCell.piece = pieceFactory.createPiece(CellColor.White, true, whiteQueenCell.coordinates, PieceType.Queen);;

  return cells;
}
