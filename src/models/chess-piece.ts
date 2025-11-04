import { getPossibleMoves } from "../moves/possible-moves";
import { type Cell, CellColor, type Coordinates, type MoveContext, PieceSymbol, PieceType } from "../type";
import { toChessNotation } from "../utils/utils";

export abstract class ChessPiece {
  color: CellColor;
  hasMoved: boolean;
  location: Coordinates;
  symbol: PieceSymbol;
  type: PieceType;

  constructor(color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false, type: PieceType) {;
    this.color = color;
    this.symbol = this.getPieceSymbol();
    this.hasMoved = hasMoved;
    this.location = location;
    this.type = type;
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

  isEnemyPiece(piece: Readonly<ChessPiece>): boolean {
    return this.color !== piece.color;
  }

  isPlayerKing(turn: CellColor): boolean {
    return (this.color === turn && (this.symbol === PieceSymbol.BlackKing || this.symbol === PieceSymbol.WhiteKing));
  }

  isPlayerPiece(turn: CellColor): boolean {
    return this.color === turn;
  }

  movePiece(context: Readonly<MoveContext>, destinationCell: Readonly<Cell>, simulation: boolean = false): {cells: Cell[], success: boolean} {
    if (!this.canMove(context, destinationCell, simulation)) return {cells: [...context.cells], success: false};

    const newCells = context.cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(this.location)) {
        return { ...cell, piece: undefined };
      } else if (toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        return { ...cell, piece: context.pieceFactory.createPiece(this.color, true, cell.coordinates, this.type) };
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
