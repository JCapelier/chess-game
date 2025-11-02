import { Bishop } from '../models/bishop';
import { King } from '../models/king';
import { Knight } from '../models/knight';
import { Pawn } from '../models/pawn';
import { Queen } from '../models/queen';
import { Rook } from '../models/rook';
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

export function getDefaultPiece(coordinates: Readonly<Coordinates>) {
  const { col, row } = coordinates;
  const color: CellColor | undefined =
    (row === 0 || row === 1)
      ? CellColor.Black
      : ((row === 6 || row === 7)
        ? CellColor.White
        : undefined);

  const firstRank = color === CellColor.Black ? 0 : 7;
  const pawnRank = color === CellColor.Black ? 1 : 6;

  if (color && row === pawnRank) return new Pawn(color, { col, row }, false);

  if (color && row === firstRank) {
    const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
    const PieceClass = pieceOrder[col];
    return PieceClass ? new PieceClass(color, { col, row }, false) : undefined;
  }
}

export function setBoard(): Cell[] {
  return Array.from({length: 64}, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const coordinates = {col, row};
    const piece = getDefaultPiece(coordinates);
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
