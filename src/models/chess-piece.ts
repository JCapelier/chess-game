import { type Cell, CellColor, PieceSymbol, PieceType } from "../type";
import { getPieceLocation } from "../utils/find-piece-utils";
import { toChessNotation } from "../utils/utils";

export abstract class ChessPiece {
  color: CellColor;
  hasMoved: boolean;
  symbol: PieceSymbol;
  type: PieceType;

  constructor(color: CellColor, hasMoved: boolean = false, type: PieceType) {;
    this.color = color;
    this.type = type;
    this.hasMoved = hasMoved;
    this.symbol = this.getPieceSymbol();
  }

  getPieceSymbol(): PieceSymbol {
    const typeToSymbol: Record<PieceType, string> = {
      [PieceType.Bishop]: "B",
      [PieceType.King]: "K",
      [PieceType.Knight]: "N",
      [PieceType.Pawn]: "P",
      [PieceType.Queen]: "Q",
      [PieceType.Rook]: "R",
      [PieceType.Valkyrie]: "V",
    };

    const colorToSymbol: Record<CellColor, string> = {
      [CellColor.Black]: 'b',
      [CellColor.White]: 'w'
    };
    return (colorToSymbol[this.color] + typeToSymbol[this.type]) as PieceSymbol;
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

  updateCellsForMovingPiece(cells: Readonly<Cell[]>): Cell[] {
    const pieceLocation = getPieceLocation(cells, this);
    if (!pieceLocation) return [];

    return cells.map(cell =>
      toChessNotation(cell.coordinates) === toChessNotation(pieceLocation)
        ? { ...cell, piece: undefined }
        : cell
      );
    }

  validMoves(_cells: Readonly<Cell[]>): Cell[] {
    // Default: no moves
    return [];
  }
}
