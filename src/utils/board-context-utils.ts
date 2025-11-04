import type { PieceFactoryPort } from '../factories/piece-factory-port';

import { type Cell, CellColor, type GameStatus, type Move, type MoveContext } from '../type';
import { getCellColor } from './cells-utils';
import { toChessNotation } from './utils';

export function getContext(
  cells: Readonly<Cell[]>,
  gameStatus: GameStatus,
  lastMove: Readonly<Move | undefined>,
  pieceFactory: PieceFactoryPort,
  startCell: Readonly<Cell | undefined>,
  turn: CellColor
): MoveContext {
  return {
    cells,
    gameStatus,
    lastMove,
    pieceFactory,
    startCell: startCell,
    turn,
  };
}

export function setBoard(pieceFactory: PieceFactoryPort): Cell[] {
  return Array.from({length: 64}, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const coordinates = {col, row};
    const piece = pieceFactory.createStandardBoardPiece(coordinates);
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
