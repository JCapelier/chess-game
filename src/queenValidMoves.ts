import type { Cell } from "./type";
import { getCellInfo } from './utils';
import { rookValidMoves } from "./rookMoves";
import { bishopValidMoves } from "./bishopMoves";

export function bishopValidMoves(cells: Cell[], startCell: Cell): Cell[] {

  const { col, row, piece } = getCellInfo(startCell);

  if (!piece || !piece.type.endsWith('B')) return [];

}
