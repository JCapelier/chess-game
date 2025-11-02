import type { Cell, CellColor, Coordinates, MoveContext } from "../type";

import { getCellInfo } from "../utils/board-utils";
import { ChessPiece } from "./chess-piece";

export class Knight extends ChessPiece {
  constructor(color: Readonly<CellColor>, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    super(color, location, hasMoved);
  }


  validMoves(context: Readonly<MoveContext>): Cell[] {

    const { col, row } = getCellInfo(context.startCell!);

    if (!(context.startCell!.piece && context.startCell!.piece instanceof Knight)) return [];

    // Here, we list every possible direction for the knight. We'll then apply them to the start position to check where it lands.
    const KNIGHT_DIRECTIONS = [
      { directionCol: -1, directionRow: -2 }, { directionCol: +1, directionRow: -2 },
      { directionCol: -2, directionRow: -1 }, { directionCol: +2, directionRow: -1 },
      { directionCol: -2, directionRow: +1 }, { directionCol: +2, directionRow: +1 },
      { directionCol: -1, directionRow: +2 }, { directionCol: +1, directionRow: +2 },
    ];

    const destinations: Cell[] = KNIGHT_DIRECTIONS.flatMap(direction => {
      const destinationRow = row + direction.directionRow;
      const destinationCol = col + direction.directionCol;
      const destinationCell = context.cells.find(cell =>
        cell.coordinates.row === destinationRow &&
        cell.coordinates.col === destinationCol
      );
      return destinationCell ? [destinationCell] : [];
    });

    const possibleMoves: Cell[] = destinations.filter(destination =>
      !destination.piece || this.isEnemyPiece(destination.piece)
    );

    return possibleMoves;
  }
}
