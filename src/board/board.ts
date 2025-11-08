import type { PieceFactoryPort } from "../factories/piece-factory-port";

import { pieceFactory } from "../factories/piece-factory";
import { isCastlingMove } from "../moves/castling-helper";
import { isEnPassantMove } from "../moves/en-passant-helper";
import { getPossibleMoves } from "../moves/possible-moves";
import { pawnPromotion } from "../moves/promotion-helper";
import { type Cell, CellColor, GameStatus, type Move, type MoveResult } from "../type";
import { toChessNotation } from "../utils/utils";
import { applyCastling, applyEnPassant, applyNormalMove } from "./apply-move-helper";
import { clone } from "./board-cloning-helper";
import { getStandardCells } from "./board-setup-helper";
import { updateGameStatus, updateTurn } from "./game-state-management-helper";

export class Board {
  attackers: Cell[] = [];
  cells: Cell[];
  gameStatus: GameStatus;
  lastMove: Move | undefined;
  pieceFactory: PieceFactoryPort;
  startCell: Cell | undefined;
  turn: CellColor;

  constructor(
    cells: Readonly<Cell[]>,
    lastMove: Readonly<Move | undefined>,
    gameStatus: Readonly<GameStatus>,
    pieceFactory: Readonly<PieceFactoryPort>,
    turn: Readonly<CellColor>,
    options?: {evaluateGameStatusOnInit: Readonly<boolean>}
  ) {
    this.cells = cells.map(cell => cell);
    this.gameStatus = gameStatus;
    this.lastMove = lastMove;
    this.pieceFactory = pieceFactory;
    this.turn = turn;

    if (options?.evaluateGameStatusOnInit !== false) {
      // must not call anything that triggers simulations
      updateGameStatus({board: this, success: true});
    }
  }

  static newStandardGame(): Readonly<Board> {
    return new Board(getStandardCells(pieceFactory), undefined, GameStatus.Playing, pieceFactory, CellColor.White, { evaluateGameStatusOnInit: true });
  }

  movePiece(from: Readonly<Cell>, to: Readonly<Cell>, simulation: boolean = false): MoveResult {
    if (!from.piece ||
      !getPossibleMoves(this, from, simulation).some(cell => toChessNotation(cell.coordinates) === toChessNotation(to.coordinates)
    )) return {board: this, success: false};

    // eslint-disable-next-line functional/no-let
    let moveResult: MoveResult;

    if (simulation) {
      const clonedBoard = clone(this);
      const clonedFrom = clonedBoard.cells.find(cell => toChessNotation(cell.coordinates) === toChessNotation(from.coordinates));
      const clonedTo = clonedBoard.cells.find(cell => toChessNotation(cell.coordinates) === toChessNotation(to.coordinates));
      if (!(clonedFrom && clonedTo)) return { board: this, success: false };

      if (isCastlingMove(clonedBoard, clonedFrom, clonedTo)) {
        moveResult = applyCastling(clonedBoard, clonedFrom, clonedTo);
      } else if (isEnPassantMove(clonedBoard, clonedFrom, clonedTo)) {
        moveResult = applyEnPassant(clonedBoard, clonedFrom, clonedTo);
      } else {
        moveResult = applyNormalMove(clonedBoard, clonedFrom, clonedTo);
      }
      moveResult.board.lastMove = {from: from, piece: from.piece, to: to};
      return moveResult;

    } else {
      // Capture the piece before it moves
      const movingPiece = from.piece;

      if (isCastlingMove(this, from, to)) {
        moveResult = applyCastling(this, from, to);
      } else if (isEnPassantMove(this,from, to)) {
        moveResult = applyEnPassant(this, from, to);
      } else {
        moveResult = applyNormalMove(this, from, to);
      }

      movingPiece.hasMoved = true;
      moveResult.board.cells = pawnPromotion(this);
      // Set lastMove with the piece we captured before moving
      moveResult.board.lastMove = {from: from, piece: movingPiece, to: to};
      updateGameStatus(moveResult);
      moveResult.board.turn = (updateTurn(this));
      return moveResult;
    }
  }
}
