import Cell from "./components/Cell";

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate'

export type Coordinates = {
  row: number;
  col: number;
};


export type Piece = {
  type: "wP" | "wN" | "wB" | "wR" | "wQ" | "wK" | "bP" | "bN" | "bB" | "bR" | "bQ" | "bK";
  hasMoved: boolean
};

export type CellColor = 'black' | 'white'

export type Cell = {
  coordinates: Coordinates;
  piece: Piece | null;
  cellColor: CellColor;
};

export type CellProps = Cell & {
  key: string;
  onCellClick: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  isSelected: boolean;
  isPossibleDestination: boolean;
  isAttacker: boolean;
  isCheck: boolean;
  isCastling: boolean;
};

export type Move = {
  //The string will be chess notations
  from: Cell;
  to: Cell;
  pieceType: Piece['type'];
}
