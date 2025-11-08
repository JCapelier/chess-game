import type { PieceFactoryPort } from '../factories/piece-factory-port';
import type { ChessPiece } from '../models/chess-piece';

import { type Cell, CellColor, type Coordinates, PieceType } from '../type';
import { getCellColor } from '../utils/cells-utils';
import { toChessNotation } from '../utils/utils';

export function createStandardBoardPiece(pieceFactory: PieceFactoryPort, coordinates: Readonly<Coordinates>): ChessPiece | undefined {
  const { col, row } = coordinates;
  const color: CellColor | undefined =
  (row === 0 || row === 1)
  ? CellColor.Black
  : ((row === 6 || row === 7)
  ? CellColor.White
  : undefined);

  const firstRank = color === CellColor.Black ? 0 : 7;
  const pawnRank = color === CellColor.Black ? 1 : 6;

  if (color && row === pawnRank) return pieceFactory.createPiece(color, false, PieceType.Pawn);

  if (color && row === firstRank) {
    const pieceOrder = [PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen, PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook];
    const pieceType = pieceOrder[col];
    return pieceType ? pieceFactory.createPiece(color, false, pieceType) : undefined;
  }
}

export function getStandardCells(pieceFactory: PieceFactoryPort): Cell[] {
  return Array.from({length: 64}, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const coordinates = {col, row};
    const piece = createStandardBoardPiece(pieceFactory, coordinates);
    return(
      {
        cellColor: getCellColor(coordinates),
        coordinates: coordinates,
        key: toChessNotation(coordinates),
        piece: piece,
      }
    );
  });
}
