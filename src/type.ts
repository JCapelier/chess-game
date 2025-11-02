import { Bishop } from './models/bishop';
import { King } from './models/king';
import { Knight } from './models/knight';
import { Pawn } from './models/pawn';
import { Queen } from './models/queen';
import { Rook } from './models/rook';


export type Cell = {
  cellColor: CellColor;
  coordinates: Coordinates;
  piece?: Piece;
};

export type CellColor = 'black' | 'white'

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

export type GameStatus = 'check' | 'checkmate' | 'playing' | 'stalemate'

export type Move = {
  //The string will be chess notations
  from: Cell;
  piece: Piece;
  to: Cell;
}

export interface MoveContext {
  cells: Readonly<Cell[]>;
  gameStatus: GameStatus;
  lastMove?: Readonly<Move>;
  startCell?: Readonly<Cell>;
  turn: CellColor;
  // Add more properties as needed for special moves
}

export type Piece = Bishop | King | Knight | Pawn | Queen | Rook;
