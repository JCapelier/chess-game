
import { Board } from '../board/board';
import { castlingMoves } from '../moves/castling-helper';
import { enPassantMoves } from '../moves/en-passant-helper';
import { getPossibleMoves } from '../moves/possible-moves';
import { type Cell, CellColor, type CheckResult, PieceType } from '../type';
import { toChessNotation } from './utils';

export function checkForCheck(board: Readonly<Board>): CheckResult {
  // Find the king of the current turn's color
  const kingCell = board.cells.find(cell => cell.piece && cell.piece.type === PieceType.King && cell.piece.color === board.turn);
  if (!kingCell) return { attackers: [], check: false };

  // Find all enemy pieces
  const enemyColor = board.turn === CellColor.White ? CellColor.Black : CellColor.White;
  const enemyCells = board.cells.filter(cell => cell.piece && cell.piece.color === enemyColor);

  const attacks: Cell[] = enemyCells.filter(cell => {
    const enemyBoard: Board = new Board(board.cells, board.lastMove, board.gameStatus, board.pieceFactory, enemyColor, { evaluateGameStatusOnInit: false });
    const cellsAttacked = getPossibleMoves(enemyBoard, cell, true);
    return cellsAttacked.some(
      attack => toChessNotation(attack.coordinates) === toChessNotation(kingCell.coordinates)
    );
  });

  return {attackers: attacks, check: attacks.length > 0};
}

export function isCheckmate(board: Readonly<Board>, CheckResult: Readonly<CheckResult> ): boolean {
  if (!CheckResult.check) return false;
  return !hasLegalMove(board);
}

export function isStaleMate(board: Readonly<Board>, checkResult: Readonly<CheckResult>): boolean {
  if (checkResult.check) return false;
  return !hasLegalMove(board);
}

function hasLegalMove(board: Readonly<Board>): boolean {
  return board.cells
    .filter(cell => cell.piece && cell.piece.isPlayerPiece(board.turn))
    .some(cell => {
      // Get basic moves without check filtering to avoid recursion
      const basicMoves = cell.piece!.validMoves(board.cells);

      // Add special moves based on piece type
      const kingMoves = cell.piece!.type === PieceType.King ? castlingMoves(board) : [];
      const pawnMoves = cell.piece!.type === PieceType.Pawn ? enPassantMoves(board as Board, cell) : [];
      const allMoves = [...basicMoves, ...kingMoves, ...pawnMoves];

      // Test each move to see if it would leave king in check
      return allMoves.some(move => {
        const {board: testBoard} = board.movePiece(cell, move, true);
        const checkResult = checkForCheck(testBoard);
        return !checkResult.check; // This move is legal if it doesn't result in check
      });
    });
}
