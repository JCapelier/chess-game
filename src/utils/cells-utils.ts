import { type Cell, CellColor, type Coordinates } from "../type";

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
