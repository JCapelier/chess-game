import { type Cell, CellColor, PieceType } from '../type';
import { isWhite } from '../utils/color-utils';
import { getPieceLocation } from '../utils/find-piece-utils';
import { ChessPiece } from './chess-piece';

export class Pawn extends ChessPiece {
  constructor(color: CellColor, hasMoved: boolean = false, type: PieceType) {
    super(color, hasMoved, type);
  }


  validMoves(cells: Readonly<Cell[]>): Cell[] {
    const pieceLocation = getPieceLocation(cells, this);
    if (!(pieceLocation && this.type === PieceType.Pawn)) return [];

    //White moving up, black moving down
    const direction = isWhite(this) ? -1 : 1;

    //Checking cells where pawn can move
    const oneCellAhead: Cell | undefined = cells.find(cell =>
      cell.coordinates.col === pieceLocation.col &&
      cell.coordinates.row === pieceLocation.row + direction
    );
    const twoCellsAhead: Cell | undefined = cells.find(cell =>
      cell.coordinates.col === pieceLocation.col &&
      cell.coordinates.row === pieceLocation.row + (direction * 2)
    );

    const diagonalCellLeft: Cell | undefined = cells.find(cell =>
      cell.coordinates.col === pieceLocation.col - 1 &&
      cell.coordinates.row === pieceLocation.row + direction
    );
    const diagonalCellRight: Cell | undefined = cells.find(cell =>
      cell.coordinates.col === pieceLocation.col + 1 &&
      cell.coordinates.row === pieceLocation.row + (direction)
    );

    //Checking if it can attack diagonally : cell exists and has an enemy piece
    const diagonalCells = [diagonalCellLeft, diagonalCellRight];
    const diagonalCaptures = diagonalCells.flatMap(diagonalCell =>
      diagonalCell && diagonalCell.piece && this.isEnemyPiece(diagonalCell.piece) ? [diagonalCell] : []
    );

    return [
      ...(oneCellAhead && !oneCellAhead.piece) ? [oneCellAhead] : [],
      ...(!this.hasMoved && oneCellAhead && !oneCellAhead.piece && twoCellsAhead && !twoCellsAhead.piece) ? [twoCellsAhead] : [],
      ...diagonalCaptures,
    ];
  }
}
