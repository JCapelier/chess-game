import type { Cell, CellColor, Coordinates, Move, MoveContext } from '../type';

import { getCellInfo } from '../utils/board-utils';
import { toChessNotation } from '../utils/utils';
import { ChessPiece, PieceType } from './chess-piece';
import { Queen } from './queen';

export class Pawn extends ChessPiece {
  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    super(PieceType.Pawn, color, location, hasMoved);
  }

  //For now, promotion automatically promotes the pawn to queen.
  //TODO underpromotion
  static pawnPromotion(cells: Readonly<Cell[]>): Cell[]{
    const newCells = cells.map( cell => {
      if (cell.piece?.symbol === 'wP' && cell.coordinates.row === 0 ) {
        //We need to enforce Piece type, otherwise, 'wQ' and 'bQ' are treated as simple strings,
        //which causes a TS error
        return {...cell, piece: new Queen('white', cell.coordinates, true)};
      } else if (cell.piece?.symbol === 'bP' && cell.coordinates.row === 7 ) {
        return {...cell, piece: new Queen('black', cell.coordinates, true)};
      } else {
        return cell;
      }});

    return newCells;
  }
  
  enPassantMoves(cells: Readonly<Cell[]>, playingCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>): Cell[] {
    if (!lastMove || !this.hasPawnMovedTwoSquares(lastMove)) return [];

    const { col, row } = playingCell.coordinates;
    const pawnDirection = this.isBlack() ? 1 : -1;
    const enPassantRow = row + pawnDirection;

    // The pawn that just moved must be adjacent (left or right)
    const possibleCols = [col - 1, col + 1];


    const validMoves = possibleCols
    .filter(targetCol =>
      targetCol >= 0 &&
      targetCol <= 7 &&
      lastMove.to.coordinates.row === row &&
      lastMove.to.coordinates.col === targetCol
    )
    .map(targetCol =>
      cells.find(cell =>
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
    if (!lastMove! || !lastMove.pieceType.endsWith('P')) return false;

    const startRow = lastMove.from.coordinates.row;
    const endRow = lastMove.to.coordinates.row;

    //Math.abs return the absolute value
    return (Math.abs(endRow - startRow) === 2) ? true : false;
  }

  isEnPassant(cells: Readonly<Cell[]>, startCell: Readonly<Cell>, destinationCell: Readonly<Cell>, lastMove: Readonly<Move | undefined>): boolean {
    const enPassantValidMoves = this.enPassantMoves(cells, startCell, lastMove);
    // We checks if there's an en passant move with the current selected piece.
    const isEnPassant = enPassantValidMoves.some(
      cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
    );
    return isEnPassant;
  }


  validMoves(context: Readonly<MoveContext>): Cell[] {
    const { col, piece, row } = getCellInfo(context.startCell);

    if (!piece || !piece.type.endsWith('P')) return [];


    //White moving up, black moving down
    const direction = this.isBlack() ? 1 : -1;

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
      ...(!piece.hasMoved && oneCellAhead && !oneCellAhead.piece && twoCellsAhead && !twoCellsAhead.piece) ? [twoCellsAhead] : [],
      ...dialgonalCaptures,
      ...this.enPassantMoves(context.cells, context.startCell, context.lastMove)
    ];
  }

}
