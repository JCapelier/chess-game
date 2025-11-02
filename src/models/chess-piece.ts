import type { Cell, CellColor, Coordinates, MoveContext } from "../type";

import { getPossibleMoves } from "../moves/possible-moves";
import { createPieceFromPrototype } from '../utils/piece-factory';
import { toChessNotation } from "../utils/utils";
import { King } from "./king";

export enum PieceSymbol {
  BlackBishop = "bB",
  BlackKing = "bK",
  BlackKnight = "bN",
  BlackPawn = "bP",
  BlackQueen = "bQ",
  BlackRook = "bR",
  WhiteBishop = "wB",
  WhiteKing = "wK",
  WhiteKnight = "wN",
  WhitePawn = "wP",
  WhiteQueen = "wQ",
  WhiteRook = "wR",
}

export enum PieceType {
  Bishop = "Bishop",
  King = "King",
  Knight = "Knight",
  Pawn = "Pawn",
  Queen = "Queen",
  Rook = "Rook",
}


export class ChessPiece {
  color: CellColor;
  hasMoved: boolean;
  location: Coordinates;
  symbol: PieceSymbol;
  type: PieceType;

  constructor(type: PieceType, color: CellColor, location: Readonly<Coordinates>, hasMoved: boolean = false) {
    this.type = type;
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
    const typeMap: Record<PieceType, string> = {
      [PieceType.Bishop]: "B",
      [PieceType.King]: "K",
      [PieceType.Knight]: "N",
      [PieceType.Pawn]: "P",
      [PieceType.Queen]: "Q",
      [PieceType.Rook]: "R",
    };
    return (this.color[0] + typeMap[this.type]) as PieceSymbol;
  }

  isBlack() {
    return this.color === 'black';
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validMoves(context: Readonly<MoveContext>): Cell[] {
    // Default: no moves
    return [];
  }
}
