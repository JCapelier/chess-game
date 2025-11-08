import { Board } from "./board";

  export function clone(board: Readonly<Board>): Board {
    const clonedCells = board.cells.map(cell => ({
      ...cell,
      piece: cell.piece ? board.pieceFactory.createPiece(
        cell.piece.color,
        cell.piece.hasMoved,
        cell.piece.type
      ) : undefined
    }));

    const clonedBoard = new Board(
      clonedCells,
      board.lastMove,
      board.gameStatus,
      board.pieceFactory,
      board.turn,
      { evaluateGameStatusOnInit: false }
    );

    // Copy other board state that isn't in the constructor
    clonedBoard.lastMove = board.lastMove;
    clonedBoard.startCell = board.startCell;
    clonedBoard.attackers = [...board.attackers];

    return clonedBoard;
  }
