export type GameStatus = 'pending' | 'playing' | 'check' | 'checkmate' | 'stalemate'

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
  isSelected: boolean;
  isPossibleDestination: boolean;
  isAttacker: boolean;
  isCheck: boolean;
};
