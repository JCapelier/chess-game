import type { PieceFactoryPort } from '../factories/piece-factory-port';

import { type Cell, CellColor, type Coordinates, type Move, type MoveContext, PieceType } from '../type';
import { getCellInfo } from '../utils/cells-utils';
import { isWhite } from '../utils/color-utils';
import { toChessNotation } from '../utils/utils';
import { ChessPiece } from './chess-piece';

export class Pawn extends ChessPiece {
  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false, type: PieceType) {
    super(color, location, hasMoved, type);
  }

  static pawnPromotion(cells: Readonly<Cell[]>, pieceFactory: PieceFactoryPort): Cell[]{
    return cells.map( cell => {
      return cell.piece &&
      cell.piece.type === PieceType.Pawn &&
      ((cell.piece!.color === CellColor.White && cell.coordinates.row === 0) ||
      (cell.piece!.color === CellColor.Black && cell.coordinates.row === 7)) ? {...cell, piece: pieceFactory.createPromotedPawn(cell.piece!.color, cell.coordinates)} : cell;
    });
  }

  captureEnPassant(cell: Readonly<Cell>, startCell: Readonly<Cell>, destinationCell: Readonly<Cell>) {
    const capturedRow = startCell.coordinates.row;
    const capturedCol = destinationCell.coordinates.col;
    if (cell.coordinates.row === capturedRow && cell.coordinates.col === capturedCol) return {...cell, piece: undefined};
  }

  enPassantMoves(context: Readonly<MoveContext>): Cell[] {
    if (!context.lastMove || !this.hasPawnMovedTwoSquares(context.lastMove)) return [];

    const { col, row } = context.startCell!.coordinates;
    const pawnDirection = isWhite(this) ? -1 : 1;
    const enPassantRow = row + pawnDirection;

    // The pawn that just moved must be adjacent (left or right)
    const possibleCols = [col - 1, col + 1];


    const validMoves = possibleCols
    .filter(targetCol =>
      targetCol >= 0 &&
      targetCol <= 7 &&
      context.lastMove &&
      context.lastMove.to.coordinates.row === row &&
      context.lastMove.to.coordinates.col === targetCol
    )
    .map(targetCol =>
      context.cells.find(cell =>
        cell.coordinates.row === enPassantRow &&
        cell.coordinates.col === targetCol &&
        !cell.piece
      )
    )
    .filter(Boolean) as Cell[];

    return validMoves;
  }

  //We're just checking the last move, for 'en passant', we don't consider the status of every pawn.
  hasPawnMovedTwoSquares(lastMove?: Readonly<Move | undefined>): boolean {
    if (!lastMove || !(lastMove.piece.type === PieceType.Pawn)) return false;

    const startRow = lastMove.from.coordinates.row;
    const endRow = lastMove.to.coordinates.row;

    //Math.abs return the absolute value
    return (Math.abs(endRow - startRow) === 2) ? true : false;
  }

  isEnPassant(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>): boolean {
    const enPassantValidMoves = this.enPassantMoves(context);
    // We checks if there's an en passant move with the current selected piece.
    const isEnPassant = enPassantValidMoves.some(
      cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
    );
    return isEnPassant;
  }


  movePiece(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>, simulation: boolean = false): {cells: Cell[], success: boolean} {
    if (!this.canMove(context, destinationCell, simulation)) return {cells: [...context.cells], success: false};

    const newCells: Cell[] = context.cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(this.location)) {
        return {...cell, piece: undefined};
      } else if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        return {...cell, piece: context.pieceFactory.createPiece(this.color, true, cell.coordinates, this.type) };
      } else if (this.isEnPassant(context, destinationCell)) {
        const captured = this.captureEnPassant(cell, context.startCell!, destinationCell);
        return captured ?? cell;
      } else {
        return cell;
      }
    });
      return {cells: Pawn.pawnPromotion(newCells, context.pieceFactory), success: true};
  };


  validMoves(context: Readonly<MoveContext>): Cell[] {
    const { col, piece, row } = getCellInfo(context.startCell!);

    if (!(context.startCell!.piece && context.startCell!.piece.type === PieceType.Pawn)) return [];

    //White moving up, black moving down
    const direction = isWhite(this) ? -1 : 1;

    //Checking cells where pawn can move
    const oneCellAhead: Cell | undefined = context.cells.find(cell =>
      cell.coordinates.col === col &&
      cell.coordinates.row === row + direction
    );
    const twoCellsAhead: Cell | undefined = context.cells.find(cell =>
      cell.coordinates.col === col &&
      cell.coordinates.row === row + (direction * 2)
    );

    const diagonalCellLeft: Cell | undefined = context.cells.find(cell =>
      cell.coordinates.col === col - 1 &&
      cell.coordinates.row === row + direction
    );
    const diagonalCellRight: Cell | undefined = context.cells.find(cell =>
      cell.coordinates.col === col + 1 &&
      cell.coordinates.row === row + (direction)
    );

    //Checking if it can attack diagonally : cell exists and has an enemy piece
    const diagonalCells = [diagonalCellLeft, diagonalCellRight];
    const dialgonalCaptures = diagonalCells.flatMap(diagonalCell =>
      diagonalCell && diagonalCell.piece && this.isEnemyPiece(diagonalCell.piece) ? [diagonalCell] : []
    );

    return [
      ...(oneCellAhead && !oneCellAhead.piece) ? [oneCellAhead] : [],
      ...(!piece!.hasMoved && oneCellAhead && !oneCellAhead.piece && twoCellsAhead && !twoCellsAhead.piece) ? [twoCellsAhead] : [],
      ...dialgonalCaptures,
      ...this.enPassantMoves(context)
    ];
  }
}
