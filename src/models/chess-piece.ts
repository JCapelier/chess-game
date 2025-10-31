import type { CellColor, Coordinates } from "../type";

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

  getPieceSymbol(): PieceSymbol {
    return (this.color[0] + this.type[0]) as PieceSymbol;
  }

  isBlack() {
    return this.color === 'black';
  }

  isEnemyPiece(piece: Readonly<ChessPiece>) {
    return this.color !== piece.color;
  }
}
