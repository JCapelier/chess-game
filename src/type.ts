export type Coordinates = {
  row: number;
  col: number;
};

export type Piece = {
  type: "wP" | "wN" | "wB" | "wR" | "wQ" | "wK" | "bP" | "bN" | "bB" | "bR" | "bQ" | "bK";
  hasMoved: boolean
};

export type CellColor = 'black' | 'white'

// Needless complexity of the next three types. Needs refacto.
export type Cell = {
  coordinates: Coordinates;
  piece: Piece | null;
  cellColor: CellColor;
};

// We use CellData for setBoard in utils.ts. This is for pure functions.
// CellProps is an extension of this type, for event handlers.
export type CellData = Cell & {
  key: string,
}

export type CellProps = CellData & {
  onCellClick: () => void;
  isSelected: boolean;
  isPossibleDestination: boolean;
};
