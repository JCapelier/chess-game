import type { ChessPiece } from "../models/chess-piece";

import { Board } from "../board/board";
import { type Cell, GameStatus, PieceType } from "../type";
import { areSameCoordinates } from "../utils/cells-utils";
import { playerKing } from "../utils/find-piece-utils";

export function areInBetweenCellsEmpty(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell>): boolean {
  const inBetweenCells = orderedInBetweenCells(cells, kingCell, rookCell);
  return !inBetweenCells.some(cell => cell.piece);
}

export function castlingMoves(board: Readonly<Board>): Cell[] {
  const kingCell = playerKing(board.cells, board.turn);
  const rookCells: Cell[] = board.cells.filter(cell =>
    cell.piece &&
    cell.piece.type === PieceType.Rook &&
    cell.piece.isPlayerPiece(board.turn)
  );

  if(!(kingCell && kingCell.piece) ||
    kingCell.piece.hasMoved === true ||
    rookCells.every(rook => rook.piece && rook.piece.hasMoved === true) ||
    board.gameStatus === GameStatus.Check
  ) return [];

  const leftRookCell = rookCells.find(rook => rook.coordinates.col === 0);
  const rightRookCell = rookCells.find(rook => rook.coordinates.col === 7);
  const kingPiece = kingCell.piece;

  const leftPath: Cell[] = orderedInBetweenCells(board.cells, kingCell, leftRookCell);
  const rightPath: Cell[] = orderedInBetweenCells(board.cells, kingCell, rightRookCell);

  const canCastleLeft = Boolean(
    leftRookCell &&
    leftRookCell.piece!.hasMoved === false &&
    areInBetweenCellsEmpty(board.cells, kingCell, leftRookCell) &&
    isKingPathSafe(board, kingCell, kingPiece, leftPath)
  );

  const canCastleRight = Boolean(
    rightRookCell &&
    rightRookCell.piece!.hasMoved === false &&
    areInBetweenCellsEmpty(board.cells, kingCell, rightRookCell) &&
    isKingPathSafe(board, kingCell, kingPiece, rightPath)
  );

  return [
    ...(canCastleLeft && leftRookCell ? [leftRookCell] : []),
    ...(canCastleRight && rightRookCell ? [rightRookCell] : []),
  ];
}
  // If the players selects its king and then its rook, it's an attempted castling move
  // This is just a quick check, because it only triggers when we know what are the valid moves.
export function isCastlingMove(board: Board, from: Readonly<Cell>, to: Readonly<Cell>): boolean {
  return Boolean(
    from.piece?.isPlayerKing(board.turn) &&
    to.piece &&
    to.piece.type === PieceType.Rook &&
    to.piece.isPlayerPiece(board.turn)
  );
}

function isKingPathSafe(
  board: Readonly<Board>,
  kingCell: Readonly<Cell>,
  kingPiece: Readonly<ChessPiece>,
  pathCells: Readonly<Cell[]>
): boolean {
  return !pathCells.some(cell => {
    const simulatedCells = board.cells.map(boardCell => {
      if (areSameCoordinates(boardCell.coordinates, kingCell.coordinates)) {
        return { ...boardCell, piece: undefined };
      } else if (areSameCoordinates(boardCell.coordinates, cell.coordinates)) {
        return { ...boardCell, piece: board.pieceFactory.createPiece(kingPiece.color, true, kingPiece.type) };
      } else {
        return boardCell;
      }
    });
    const simulatedBoard = new Board(simulatedCells, board.lastMove, board.gameStatus, board.pieceFactory, board.turn, { evaluateGameStatusOnInit: false });
    return simulatedBoard.checkForCheck().check === true;
  });
}

//This next function only considers cells involved in a potential castling.
function orderedInBetweenCells(cells: Readonly<Cell[]>, kingCell: Readonly<Cell>, rookCell: Readonly<Cell> | undefined): Cell[] {
  //Return ordered cells between king and rook (ordered as the king would traverse)
  if (!rookCell) return [];

  return rookCell.coordinates.col === 0
    ? cells
        .filter(cell =>
          cell.coordinates.row === kingCell.coordinates.row &&
          cell.coordinates.col > rookCell.coordinates.col &&
          cell.coordinates.col < kingCell.coordinates.col
        )
        .toSorted((a, b) => b.coordinates.col - a.coordinates.col)
    : cells
        .filter(cell =>
          cell.coordinates.row === kingCell.coordinates.row &&
          cell.coordinates.col > kingCell.coordinates.col &&
          cell.coordinates.col < rookCell.coordinates.col
        )
        .toSorted((a, b) => a.coordinates.col - b.coordinates.col);
}
