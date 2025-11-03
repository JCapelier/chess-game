import { createStandardBoardPiece } from '../factories/piece-factory';
import { type Cell, CellColor, type Coordinates, type GameStatus, type Move, type MoveContext } from '../type';
import { toChessNotation } from './utils';


export function getCellByLocation(cells: Readonly<Cell[]>, location: Readonly<Coordinates>): Cell | undefined {
  return cells.find(cell => cell.coordinates.row === location.row && cell.coordinates.col === location.col);
}

export function getCellColor(coordinates: Readonly<Coordinates>): CellColor {
  return (coordinates.row + coordinates.col) % 2 === 0 ? CellColor.Black : CellColor.White;
}

export function getCellInfo(startCell: Readonly<Cell>) {
  //This is used in some placing for easy destructuring from cell to usable info
  return {
    col: startCell.coordinates.col,
    piece: startCell.piece,
    row: startCell.coordinates.row,
  };
}

export function getContext(
  cells: Readonly<Cell[]>,
  gameStatus: GameStatus,
  lastMove: Readonly<Move | undefined>,
  startCell: Readonly<Cell | undefined>,
  turn: CellColor
): MoveContext {
  return {
    cells,
    gameStatus,
    lastMove,
    startCell: startCell,
    turn,
  };
}

export function setBoard(): Cell[] {
  return Array.from({length: 64}, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const coordinates = {col, row};
    const piece = createStandardBoardPiece(coordinates);
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
