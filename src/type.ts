export type Cell = {
  cellColor: CellColor;
  coordinates: Coordinates;
  piece: Piece | undefined;
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
  pieceType: Piece['type'];
  to: Cell;
}

export type Piece = {
  hasMoved: boolean
  type: "bB" | "bK" | "bN" | "bP" | "bQ" | "bR" | "wB" | "wK" | "wN" | "wP" | "wQ" | "wR";
};
