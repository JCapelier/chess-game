import type { Coordinates } from '../type';

  export function toChessNotation(coordinates: Coordinates): string {
    // In chess, files are col, and ranks are rows
    const file = String.fromCharCode(65 + coordinates.col); // 65 is 'A'
    const rank = 8 - coordinates.row; // rank 1 is the bottom rank, whereas index 0 is the top row.
    return `${file}${rank}`;
  }

  export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

