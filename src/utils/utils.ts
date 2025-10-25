import type { Coordinates } from '../type';

  export function capitalize(string_: string) {
    return string_.charAt(0).toUpperCase() + string_.slice(1);
  }

  export function toChessNotation(coordinates: Readonly<Coordinates>): string {
    // In chess, files are col, and ranks are rows
    const file = String.fromCodePoint(65 + coordinates.col); // 65 is 'A'
    const rank = 8 - coordinates.row; // rank 1 is the bottom rank, whereas index 0 is the top row.
    return `${file}${rank}`;
  }
