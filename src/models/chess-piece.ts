import { getPossibleMoves } from "../moves/possible-moves";
import { type Cell, CellColor, type Coordinates, type MoveContext, type PieceSymbol } from "../type";
import { createPieceFromPrototype } from '../utils/piece-factory';
import { toChessNotation } from "../utils/utils";
import { King } from "./king";

export class ChessPiece {
  color: CellColor;
  hasMoved: boolean;
  location: Coordinates;
  symbol: PieceSymbol;

  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {;
    this.color = color;
    this.symbol = this.getPieceSymbol();
    this.hasMoved = hasMoved;
    this.location = location;
  }

  canMove(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>, simulation: boolean = false): boolean {
    const possibleMoves = getPossibleMoves(context, simulation);
    return possibleMoves.some(cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates));
  }

  getPieceSymbol(): PieceSymbol {
    const exceptions: Record<string, string> = { "Knight": "N" };
    const letter = exceptions[this.constructor.name] || this.constructor.name[0];
    return (this.color[0] + letter) as PieceSymbol;
  }

  isBlack() {
    return this.color === CellColor.Black;
  }

  isEnemyPiece(piece: Readonly<ChessPiece>) {
    return this.color !== piece.color;
  }

  isPlayerKing(turn: CellColor): boolean {
    return (this.color === turn && this instanceof King);
  }

  movePiece(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>, simulation: boolean = false): {cells: Cell[], success: boolean} {
    if (!this.canMove(context, destinationCell, simulation)) return {cells: [...context.cells], success: false};

    const newCells = context.cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(this.location)) {
        return { ...cell, piece: undefined };
      } else if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        return { ...cell, piece: createPieceFromPrototype(this.color, true, cell.coordinates, this) };
      } else {
        return cell;
      }
    });
    return { cells: newCells, success: true };
  };


  updateCellsForMovingPiece(context: Readonly<MoveContext>): Cell[] {
    return context.cells.map(cell =>
      toChessNotation(cell.coordinates) === toChessNotation(this.location)
        ? { ...cell, piece: undefined }
        : cell
      );
    }

  validMoves(_context: Readonly<MoveContext>): Cell[] {
    // Default: no moves
    return [];
  }
}
