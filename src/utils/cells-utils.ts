import { type Cell, CellColor, type Coordinates } from "../type";

/**
 * Checks if two coordinates point to the same cell.
 */
export function areSameCoordinates(
  coords1: Readonly<Coordinates>,
  coords2: Readonly<Coordinates>
): boolean {
  return coords1.row === coords2.row && coords1.col === coords2.col;
}

export function getCellByLocation(cells: Readonly<Cell[]>, location: Readonly<Coordinates>): Cell | undefined {
  return cells.find(cell => areSameCoordinates(cell.coordinates, location));
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
