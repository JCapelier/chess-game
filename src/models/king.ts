import type {Cell, CellColor, Coordinates, MoveContext } from '../type';

import { getCellInfo } from '../utils/board-utils';
import { checkForCheck } from '../utils/game-status-utils';
import { createPieceFromPrototype } from '../utils/piece-factory';
import { isPlayerPiece, playerKing } from '../utils/piece-utils';
import { toChessNotation } from '../utils/utils';
import { ChessPiece, PieceType } from "./chess-piece";
import { Rook } from './rook';


export class King extends ChessPiece {

  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    super(PieceType.King, color, location, hasMoved);
  }

  areInBetweenCellsEmpty(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell>): boolean {
    const inBetweenCells = this.orderedInBetweenCells(cells, kingCell, rookCell);
    return !inBetweenCells.some(cell => cell.piece);
  }

  castle(cell: Readonly<Cell>, destinationCell: Readonly<Cell>) {
    const row = this.location.row;
    const isLeft = destinationCell.coordinates.col === 0;
    const isRight = destinationCell.coordinates.col === 7;

    if (isLeft) {
      // King goes to col 2, rook to col 3
      // Old king to undefined is taken care of by a previous if statement.
      if (cell.coordinates.col === 0 && cell.coordinates.row === row) return { ...cell, piece: undefined }; // old rook
      if (cell.coordinates.col === 2 && cell.coordinates.row === row) return { ...cell, piece: createPieceFromPrototype(this.color, true, cell.coordinates, this) };
      if (cell.coordinates.col === 3 && cell.coordinates.row === row) return { ...cell, piece: createPieceFromPrototype(destinationCell.piece!.color, true, cell.coordinates, destinationCell.piece!) };
    } else if (isRight) {
      // King goes to col 6, rook to col 5
      if (cell.coordinates.col === 7 && cell.coordinates.row === row) return { ...cell, piece: undefined }; // old rook
      if (cell.coordinates.col === 6 && cell.coordinates.row === row) return { ...cell, piece: createPieceFromPrototype(this.color, true, cell.coordinates, this) };
      if (cell.coordinates.col === 5 && cell.coordinates.row === row) return { ...cell, piece: createPieceFromPrototype(destinationCell.piece!.color, true, cell.coordinates, destinationCell.piece!) };
    }
    return cell;
  }


  castlingMoves(context: Readonly<MoveContext>): Cell[] {
    const kingCell = playerKing(context.cells, context.turn);
    const rookCells: Cell[] = context.cells.filter(cell => cell.piece instanceof Rook && isPlayerPiece(context, cell));

    if(!kingCell ||
      kingCell.piece!.hasMoved === true ||
      rookCells.every(rook => rook.piece!.hasMoved === true) ||
      context.gameStatus === 'check'
    ) return [];

    const leftRookCell = rookCells.find(rook => rook.coordinates.col === 0);
    const rightRookCell = rookCells.find(rook => rook.coordinates.col === 7);

    // Check if castling is possible without recursively calling movePiece
    const canCastleLeft = Boolean(
      leftRookCell &&
      leftRookCell.piece!.hasMoved === false &&
      this.areInBetweenCellsEmpty(context.cells, kingCell, leftRookCell) &&
      !this.orderedInBetweenCells(context.cells, kingCell, leftRookCell).some(cell => {
        // Simulate king movement manually without calling movePiece to avoid recursion
        const simulatedBoard = context.cells.map(boardCell => {
          if (toChessNotation(boardCell.coordinates) === toChessNotation(kingCell.coordinates)) {
            return { ...boardCell, piece: undefined };
          } else if (toChessNotation(boardCell.coordinates) === toChessNotation(cell.coordinates)) {
            return { ...boardCell, piece: createPieceFromPrototype(this.color, true, boardCell.coordinates, this) };
          } else {
            return boardCell;
          }
        });
        const simulatedContext: MoveContext = {...context, cells: simulatedBoard};
        return checkForCheck(simulatedContext).check === true;
      })
    );

    const canCastleRight = Boolean(
      rightRookCell &&
      rightRookCell.piece!.hasMoved === false &&
      this.areInBetweenCellsEmpty(context.cells, kingCell, rightRookCell) &&
      !this.orderedInBetweenCells(context.cells, kingCell, rightRookCell).some(cell => {
        // Simulate king movement manually without calling movePiece to avoid recursion
        const simulatedBoard = context.cells.map(boardCell => {
          if (toChessNotation(boardCell.coordinates) === toChessNotation(kingCell.coordinates)) {
            return { ...boardCell, piece: undefined };
          } else if (toChessNotation(boardCell.coordinates) === toChessNotation(cell.coordinates)) {
            return { ...boardCell, piece: createPieceFromPrototype(this.color, true, boardCell.coordinates, this) };
          } else {
            return boardCell;
          }
        });
        const simulatedContext: MoveContext = {...context, cells: simulatedBoard};
        return checkForCheck(simulatedContext).check === true;
      })
    );

    return [
      ...(canCastleLeft && leftRookCell ? [leftRookCell] : []),
      ...(canCastleRight && rightRookCell ? [rightRookCell] : []),
    ];
  }

   getSidesCells(cells: Readonly<Cell[]>, playingCell: Readonly<Cell>): Cell[] {
    // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
    return cells.filter(cell =>
      cell.coordinates.row === playingCell.coordinates.row &&
      //Checking both col -1 and col + 1 (Math.abs(1))
      Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1);
    }

  isCastlingMove(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>): boolean {
    // If the players selects its king and then its rook, it's an attempted castling move
    // This is just a quick check, because it only triggers when we know what are the valid moves.
    // The actual logic of the move, which properly places the king and the rook, are in movePiece
    return (
      this.isPlayerKing(context.turn!) &&
      destinationCell.piece instanceof Rook &&
      isPlayerPiece(context, destinationCell)
    );
  }
  movePiece(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>, simulation: boolean = false): {cells: Cell[], success: boolean} {
    // During simulation, skip canMove check for castling simulation to prevent recursion
    if (!simulation && !this.canMove(context, destinationCell, simulation)) {
      return {cells: [...context.cells], success: false};
    }

    if (!simulation && destinationCell.piece instanceof King) return { cells: [...context.cells], success: false };

    const newCells: Cell[] = context.cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(this.location)) {
        return { ...cell, piece: undefined };
      } else if (!simulation && this.isCastlingMove(context, destinationCell)) {
        // Only handle castling logic when not in simulation
        return this.castle(cell, destinationCell) ?? cell;
      } else if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        return { ...cell, piece: createPieceFromPrototype(this.color, true, cell.coordinates, this) };
      } else {
        return cell;
      }
    });
    return {cells: newCells, success: true};
  };

  //This next function only considers cells involved in a potential castling.
  orderedInBetweenCells(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell>): Cell[] {
    //Return ordered cells between king and rook (ordered as the king would traverse)
    return rookCell.coordinates.col === 0
      ? cells
          .filter(cell =>
            cell.coordinates.row === kingCell.coordinates.row &&
            cell.coordinates.col > rookCell.coordinates.col &&
            cell.coordinates.col < kingCell.coordinates.col
          )
          .toSorted((a, b) => b.coordinates.col - a.coordinates.col)
      : cells
          .filter(cell =>
            cell.coordinates.row === kingCell.coordinates.row &&
            cell.coordinates.col > kingCell.coordinates.col &&
            cell.coordinates.col < rookCell.coordinates.col
          )
          .toSorted((a, b) => a.coordinates.col - b.coordinates.col);
  }


  validMoves(context: Readonly<MoveContext>): Cell[] {

    const { col, row } = getCellInfo(context.startCell!);

    if (!(context.startCell!.piece && context.startCell!.piece instanceof King) || !context.turn || !context.gameStatus) return [];

    // Here, we list every possible direction for the king. We'll then apply them to the start position to check where it lands.
    const kingDirections = [
      { directionCol: -1, directionRow: -1 }, { directionCol: +1, directionRow: 0 },
      { directionCol: 0, directionRow: -1 }, { directionCol: -1, directionRow: +1 },
      { directionCol: +1, directionRow: -1 }, { directionCol: 0, directionRow: +1 },
      { directionCol: -1, directionRow: 0 }, { directionCol: +1, directionRow: +1 },
    ];

    const destinations: Cell[] = kingDirections.flatMap(direction => {
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

    return [
      ...possibleMoves,
      ...this.castlingMoves(context)
    ];
  }
}
