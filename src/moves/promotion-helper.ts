import type { Board } from "../board/board";

import { type Cell, CellColor, PieceType } from "../type";

export function pawnPromotion(board: Readonly<Board>): Cell[]{
  return board.cells.map( cell => {
    return cell.piece &&
    cell.piece.type === PieceType.Pawn &&
    ((cell.piece!.color === CellColor.White && cell.coordinates.row === 0) ||
    (cell.piece!.color === CellColor.Black && cell.coordinates.row === 7)) ? {...cell, piece: board.pieceFactory.createPromotedPawn(cell.piece!.color)} : cell;
  });
}
