import type { ChessPiece } from './models/chess-piece';

export enum CellColor {
  Black = 'black',
  White = 'white',
};

export enum GameStatus {
  Check = 'check',
  Checkmate = 'checkmate',
  Playing = 'playing',
  Stalemate = 'stalemate',
};

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
};

export interface Cell {
  cellColor: CellColor;
  coordinates: Coordinates;
  piece?: ChessPiece;
};

export type CellProps = Cell & {
  isAttacker: boolean;
  isCastling: boolean;
  isCheck: boolean;
  isPossibleDestination: boolean;
  isSelected: boolean;
  key: string;
  onCellClick: () => void;
  onDragOver: (event: Readonly<React.DragEvent<HTMLDivElement>>) => void;
  onDragStart: () => void;
  onDrop: () => void;
};

export type Coordinates = {
  col: number;
  row: number;
};

export interface GameState {
  cells: Cell[];
  gameStatus: GameStatus;
  lastMove?: Move;
  turn: CellColor
}

export interface Move {
  from: Cell;
  piece: ChessPiece;
  to: Cell;
};

export interface MoveContext {
  cells: Readonly<Cell[]>;
  gameStatus: GameStatus;
  lastMove?: Readonly<Move>;
  startCell?: Readonly<Cell>;
  turn: CellColor;
};
