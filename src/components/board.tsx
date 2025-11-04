import './board.css';
import { useEffect, useState } from 'react';

import { pieceFactory } from '../factories/piece-factory';
import { King } from '../models/king';
import { getPossibleMoves } from '../moves/possible-moves';
import { CellColor, type Cell as CellType, type GameState, GameStatus, type Move, PieceType } from '../type';
import { getContext, setBoard } from '../utils/board-context-utils';
import { checkedPlayerKing } from '../utils/find-piece-utils';
import { checkForCheck, isCheckmate, isStaleMate } from '../utils/game-status-utils';
import { toChessNotation } from '../utils/utils';
import Cell from './cell';
import GameHeader from './game-header';



export default function Board() {

  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);
  const [cells, setCells] = useState<CellType[]>(setBoard(pieceFactory));
  const [selectedCell, setSelectedCell] = useState<CellType | undefined>();
  const [turn, setTurn] = useState<CellColor>(CellColor.White);
  const [attackers, setAttackers] = useState<CellType[]>([]);
  const [lastMove, setLastMove] = useState<Move | undefined>();
  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves({cells: cells, gameStatus: gameStatus, lastMove: lastMove, pieceFactory, startCell: selectedCell, turn: turn}) : [];
  const castlingMoves: CellType[] = selectedCell &&
                                    selectedCell.piece &&
                                    selectedCell.piece instanceof King
                                     ? selectedCell.piece.castlingMoves({cells: cells, gameStatus: gameStatus, lastMove: lastMove, pieceFactory, startCell: selectedCell, turn: turn}) : [];

  useEffect(() => {
    // When it comes to event handlers, returning a value doesn't makes much sense.
    /* eslint-disable functional/no-conditional-statements */
    const context = getContext(cells, gameStatus, lastMove, pieceFactory, selectedCell, turn);
    const { attackers, check } = checkForCheck(context);
    if (check) {
      if (isCheckmate(context)) {
        setGameStatus(GameStatus.Checkmate);
      } else {
        setGameStatus(GameStatus.Check);
      }
      setAttackers(attackers);
    } else if (isStaleMate(context)) {
      setGameStatus(GameStatus.Stalemate);
    } else {
      setGameStatus(GameStatus.Playing);
      setAttackers([]);
    }
  }, [cells, turn, lastMove, gameStatus, selectedCell]);

  const handleCellClick = (cell: Readonly<CellType>) => {
    const context = getContext(cells, gameStatus, lastMove, pieceFactory, selectedCell, turn);

    // Clicking on the same cell again deselect the cell.
    if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
      setSelectedCell(undefined);
      return;
    } else if (selectedCell && selectedCell.piece && selectedCell.piece.isPlayerPiece(context.turn)) {
      const { cells: newCells, success } = selectedCell.piece!.movePiece(context, cell);
      // The turn is over for the player only if movePiece succeeded.
      if (success) {
        // We can enforce the '!' because, if selectedCell had no piece, movePiece would return success: false
        const newMove = { from: selectedCell, piece: selectedCell.piece!, to: cell };
        setLastMove(newMove);
        setCells(newCells);
        setTurn(turn === CellColor.White ? CellColor.Black : CellColor.White);
        setGameStates([...gameStates, {cells: cells, gameStatus: gameStatus, lastMove: lastMove, turn: turn,}]);
        // useEffect runs there
      }
      setSelectedCell(undefined);
      return;
     // A player can only select a cell occupied by one of their pieces. That's why we can enforce that there's a piece on the selected cell in movePiece helper.
    } else if (cell.piece && cell.piece.isPlayerPiece(context.turn)) {
      setSelectedCell(cell);
      return;
    }
  };

  const handleDragStart = (cell: Readonly<CellType>) => {
    const context = getContext(cells, gameStatus, lastMove, pieceFactory, selectedCell, turn);
    if (cell.piece && cell.piece.isPlayerPiece(context.turn)) {
      setSelectedCell(cell);
      return;
    }
    /* eslint-enable functional/no-conditional-statements */
  };

  const handleReset = (): void => {
    setCells(setBoard(pieceFactory));
    setTurn(CellColor.White);
    setGameStatus(GameStatus.Playing);
    setSelectedCell(undefined);
    setAttackers([]);
    setLastMove(undefined);
    setGameStates([]);
  };

  const handleUndo = () => {
    if (gameStates.length === 0) return;

    const previousState = gameStates.at(-1)!;
    const newHistory = gameStates.slice(0, -1);

    setCells(previousState.cells);
    setTurn(previousState.turn);
    setGameStatus(previousState.gameStatus);
    setLastMove(previousState.lastMove);
    setGameStates(newHistory);
    setSelectedCell(undefined);
  };

  return(
    <>
      <GameHeader canUndo={gameStates.length > 0} gameStatus={gameStatus} onReset={handleReset} onUndo={handleUndo} turn={turn} />
      <div
        className="w-full max-w-[min(90vw,90vh)] aspect-square mx-auto grid grid-cols-8 grid-rows-8"
        id="board"
      >
        {cells.map(cell =>
            <Cell
              cellColor={cell.cellColor}
              coordinates={cell.coordinates}
              isAttacker={attackers.some(attacker => toChessNotation(attacker.coordinates) === toChessNotation(cell.coordinates))}
              isCastling={selectedCell && selectedCell.piece!.type === PieceType.King ?
                castlingMoves.some(move => toChessNotation(move.coordinates) === toChessNotation(cell.coordinates))
               : false}
              isCheck={checkedPlayerKing(cell, gameStatus, turn) }
              isPossibleDestination={possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(cell.coordinates))}
              isSelected={selectedCell ? toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates) : false}
              key={toChessNotation(cell.coordinates)}
              onCellClick={() => handleCellClick(cell)}
              onDragOver={event_ => event_.preventDefault()}
              onDragStart={() => handleDragStart(cell)}
              onDrop={() => handleCellClick(cell)}
              piece={cell.piece}
            />
          )
        }
      </div>
    </>
  );
}
