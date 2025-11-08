import { type Cell, type CellColor, PieceType } from '../type';
import { getPieceLocation } from '../utils/find-piece-utils';
import { ChessPiece } from "./chess-piece";


export class King extends ChessPiece {

  constructor(color: CellColor, hasMoved: boolean = false, type: PieceType) {
    super(color, hasMoved, type);
  }

   getSidesCells(cells: Readonly<Cell[]>, playingCell: Readonly<Cell>): Cell[] {
    // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
    return cells.filter(cell =>
      cell.coordinates.row === playingCell.coordinates.row &&
      //Checking both col -1 and col + 1 (Math.abs(1))
      Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1);
    }

  validMoves(cells: Readonly<Cell[]>): Cell[] {
    const pieceLocation = getPieceLocation(cells, this);

    if (!(pieceLocation && this.type === PieceType.King)) return [];

    // Here, we list every possible direction for the king. We'll then apply them to the start position to check where it lands.
    const kingDirections = [
      { directionCol: -1, directionRow: -1 }, { directionCol: +1, directionRow: 0 },
      { directionCol: 0, directionRow: -1 }, { directionCol: -1, directionRow: +1 },
      { directionCol: +1, directionRow: -1 }, { directionCol: 0, directionRow: +1 },
      { directionCol: -1, directionRow: 0 }, { directionCol: +1, directionRow: +1 },
    ];

    const destinations: Cell[] = kingDirections.flatMap(direction => {
      const destinationRow = pieceLocation.row + direction.directionRow;
      const destinationCol = pieceLocation.col + direction.directionCol;
      const destinationCell = cells.find(cell =>
        cell.coordinates.row === destinationRow &&
        cell.coordinates.col === destinationCol
      );
      return destinationCell ? [destinationCell] : [];
    });

    const possibleMoves: Cell[] = destinations.filter(destination =>
      !destination.piece || this.isEnemyPiece(destination.piece)
    );

    return [
      ...possibleMoves,
    ];
  }
}
