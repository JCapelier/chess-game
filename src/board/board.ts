import type { PieceFactoryPort } from "../factories/piece-factory-port";

import { pieceFactory } from "../factories/piece-factory";
import { castlingMoves, isCastlingMove } from "../moves/castling-helper";
import { enPassantMoves, isEnPassantMove } from "../moves/en-passant-helper";
import { pawnPromotion } from "../moves/promotion-helper";
import { type Cell, CellColor, type CheckResult, GameStatus, type Move, type MoveResult, PieceType } from "../type";
import { areSameCoordinates } from "../utils/cells-utils";
import { applyCastling, applyEnPassant, applyNormalMove } from "./apply-move-helper";
import { clone } from "./board-cloning-helper";
import { getStandardCells } from "./board-setup-helper";

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
    options?: { evaluateGameStatusOnInit: Readonly<boolean> }
  ) {
    this.cells = cells.map((cell) => cell);
    this.gameStatus = gameStatus;
    this.lastMove = lastMove;
    this.pieceFactory = pieceFactory;
    this.turn = turn;

    if (options?.evaluateGameStatusOnInit !== false) {
      // must not call anything that triggers simulations
      this.updateGameStatus();
    }
  }

  static newStandardGame(): Board {
    return new Board(getStandardCells(pieceFactory), undefined, GameStatus.Playing, pieceFactory, CellColor.White, { evaluateGameStatusOnInit: true });
  }

  /**
   * Checks if the current player's king is in check.
   * Returns the attacking pieces and whether check is true.
   */
  checkForCheck(): CheckResult {
    const kingCell = this.cells.find(cell => cell.piece && cell.piece.type === PieceType.King && cell.piece.color === this.turn);
    if (!kingCell) return { attackers: [], check: false };

    const enemyColor = this.turn === CellColor.White ? CellColor.Black : CellColor.White;
    const enemyCells = this.cells.filter(cell => cell.piece && cell.piece.color === enemyColor);

    const attacks: Cell[] = enemyCells.filter(cell => {
      const enemyBoard: Board = new Board(this.cells, this.lastMove, this.gameStatus, this.pieceFactory, enemyColor, { evaluateGameStatusOnInit: false });
      const cellsAttacked = enemyBoard.getPossibleMoves(cell, true);
      return cellsAttacked.some(attack => areSameCoordinates(attack.coordinates, kingCell.coordinates));
    });

    return { attackers: attacks, check: attacks.length > 0 };
  }

  /**
   * Gets all possible legal moves for a piece at the given cell.
   * Includes basic moves, castling, and en passant.
   * Filters out moves that would leave the king in check unless in simulation mode.
   */
  getPossibleMoves(from: Readonly<Cell>, simulation: boolean = false): Cell[] {
    if (!from.piece) return [];

    // Start with basic piece moves
    const basicMoves = from.piece.validMoves(this.cells);

    // Add special moves based on piece type
    const kingMoves = from.piece.type === PieceType.King ? castlingMoves(this) : [];
    const pawnMoves = from.piece.type === PieceType.Pawn ? enPassantMoves(this, from) : [];
    const allPossibleMoves = [...basicMoves, ...kingMoves, ...pawnMoves];

    return simulation === false ? this.filterMovesLeavingKingInCheck(from, allPossibleMoves) : allPossibleMoves;
  }

  /**
   * Checks if the current position is checkmate.
   */
  isCheckmate(checkResult: CheckResult): boolean {
    if (!checkResult.check) return false;
    return !this.hasLegalMove();
  }

  /**
   * Checks if the current position is stalemate.
   */
  isStaleMate(checkResult: CheckResult): boolean {
    if (checkResult.check) return false;
    return !this.hasLegalMove();
  }

  movePiece(from: Readonly<Cell>, to: Readonly<Cell>, simulation: boolean = false): MoveResult {
    if (!from.piece || !this.getPossibleMoves(from, simulation).some((cell) => areSameCoordinates(cell.coordinates, to.coordinates)))
      return { board: this, success: false };

    // eslint-disable-next-line functional/no-let
    let moveResult: MoveResult;

    if (simulation) {
      const clonedBoard = clone(this);
      const clonedFrom = clonedBoard.cells.find((cell) => areSameCoordinates(cell.coordinates, from.coordinates));
      const clonedTo = clonedBoard.cells.find((cell) => areSameCoordinates(cell.coordinates, to.coordinates));
      if (!(clonedFrom && clonedTo)) return { board: this, success: false };

      if (isCastlingMove(clonedBoard, clonedFrom, clonedTo)) {
        moveResult = applyCastling(clonedBoard, clonedFrom, clonedTo);
      } else if (isEnPassantMove(clonedBoard, clonedFrom, clonedTo)) {
        moveResult = applyEnPassant(clonedBoard, clonedFrom, clonedTo);
      } else {
        moveResult = applyNormalMove(clonedBoard, clonedFrom, clonedTo);
      }
      moveResult.board.lastMove = { from: from, piece: from.piece, to: to };
      return moveResult;
    } else {
      // Capture the piece before it moves
      const movingPiece = from.piece;

      if (isCastlingMove(this, from, to)) {
        moveResult = applyCastling(this, from, to);
      } else if (isEnPassantMove(this, from, to)) {
        moveResult = applyEnPassant(this, from, to);
      } else {
        moveResult = applyNormalMove(this, from, to);
      }

      movingPiece.hasMoved = true;
      moveResult.board.cells = pawnPromotion(this);
      // Set lastMove with the piece we captured before moving
      moveResult.board.lastMove = { from: from, piece: movingPiece, to: to };
      moveResult.board.updateGameStatus();
      moveResult.board.turn = moveResult.board.updateTurn();
      return moveResult;
    }
  }

  /**
   * Filters moves that would leave the player's king in check.
   */
  private filterMovesLeavingKingInCheck(from: Readonly<Cell>, possibleMoves: Readonly<Cell[]>): Cell[] {
    const validMoves: Cell[] = possibleMoves.flatMap((possibleMove) => {
      const { board: simulatedBoard } = this.movePiece(from, possibleMove, true);
      const check = simulatedBoard.checkForCheck();
      return check.check === false ? [possibleMove] : [];
    });
    return validMoves;
  }

  /**
   * Checks if the current player has any legal moves.
   */
  private hasLegalMove(): boolean {
    return this.cells
      .filter(cell => cell.piece && cell.piece.isPlayerPiece(this.turn))
      .some(cell => {
        // Get basic moves without check filtering to avoid recursion
        const basicMoves = cell.piece!.validMoves(this.cells);

        // Add special moves based on piece type
        const kingMoves = cell.piece!.type === PieceType.King ? castlingMoves(this) : [];
        const pawnMoves = cell.piece!.type === PieceType.Pawn ? enPassantMoves(this, cell) : [];
        const allMoves = [...basicMoves, ...kingMoves, ...pawnMoves];

        // Test each move to see if it would leave king in check
        return allMoves.some(move => {
          const { board: testBoard } = this.movePiece(cell, move, true);
          const checkResult = testBoard.checkForCheck();
          return !checkResult.check;
        });
      });
  }

  /**
   * Updates the game status based on check, checkmate, and stalemate conditions.
   */
  private updateGameStatus(): void {
    const checkResult = this.checkForCheck();
    if (this.isCheckmate(checkResult)) {
      this.gameStatus = GameStatus.Checkmate;
    } else if (this.isStaleMate(checkResult)) {
      this.gameStatus = GameStatus.Stalemate;
    } else if (checkResult.check) {
      this.gameStatus = GameStatus.Check;
    } else {
      this.gameStatus = GameStatus.Playing;
    }
    this.attackers = checkResult.attackers;
  }

  /**
   * Returns the next player's turn.
   */
  private updateTurn(): CellColor {
    return this.turn === CellColor.White ? CellColor.Black : CellColor.White;
  }
}
