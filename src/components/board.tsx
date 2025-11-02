import './board.css';
import { useEffect, useState } from 'react';

import type { CellColor, Cell as CellType, GameStatus, Move } from '../type';

import { King } from '../models/king';
import { getPossibleMoves } from '../moves/possible-moves';
import { getContext, setBoard } from '../utils/board-utils';
import { checkForCheck, isCheckmate, isStaleMate } from '../utils/game-status-utils';
import { checkedPlayerKing, isPlayerPiece } from '../utils/piece-utils';
import { toChessNotation } from '../utils/utils';
import Cell from './cell';
import GameHeader from './game-header';


export default function Board() {

  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [cells, setCells] = useState<CellType[]>(setBoard());
  const [selectedCell, setSelectedCell] = useState<CellType | undefined>();
  const [turn, setTurn] = useState<CellColor>('white');
  const [attackers, setAttackers] = useState<CellType[]>([]);
  const [lastMove, setLastMove] = useState<Move | undefined>();
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves({cells: cells, gameStatus: gameStatus, lastMove: lastMove, startCell: selectedCell, turn: turn}) : [];
  const castlingMoves: CellType[] = selectedCell && selectedCell.piece instanceof King ? selectedCell.piece.castlingMoves({cells: cells, gameStatus: gameStatus, lastMove: lastMove, startCell: selectedCell, turn: turn}) : [];

  useEffect(() => {
    // When it comes to event handlers, returning a value doesn't makes much sense.
    /* eslint-disable functional/no-conditional-statements */
    const context = getContext(cells, gameStatus, lastMove, selectedCell, turn);
    const { attackers, check } = checkForCheck(context);
    if (check) {
      if (isCheckmate(context)) {
        setGameStatus('checkmate');
      } else {
        setGameStatus('check');
      }
      setAttackers(attackers);
    } else if (isStaleMate(context)) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('playing');
      setAttackers([]);
    }
  }, [cells, turn, lastMove, gameStatus, selectedCell]);

  const handleCellClick = (cell: Readonly<CellType>) => {
    const context = getContext(cells, gameStatus, lastMove, selectedCell, turn);

    // Clicking on the same cell again deselect the cell.
    if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
      setSelectedCell(undefined);
      return;
    } else if (selectedCell && isPlayerPiece(context, selectedCell)) {
      const { cells: newCells, success } = selectedCell.piece!.movePiece(context, cell);
      // The turn is over for the player only if movePiece succeeded.
      if (success) {
        // We can enforce the '!' because, if selectedCell had no piece, movePiece would return success: false
        const newMove = { from: selectedCell, piece: selectedCell.piece!, to: cell };
        setLastMove(newMove);
        setCells(newCells);
        setTurn(turn === 'white' ? 'black' : 'white');
        // useEffect runs there
      }
      setSelectedCell(undefined);
      return;
     // A player can only select a cell occupied by one of their pieces. That's why we can enforce that there's a piece on the selected cell in movePiece helper.
    } else if (isPlayerPiece(context, cell)) {
      setSelectedCell(cell);
      return;
    }
  };

  const handleDragStart = (cell: Readonly<CellType>) => {
    const context = getContext(cells, gameStatus, lastMove, selectedCell, turn);
    if (cell.piece && isPlayerPiece(context, cell)) {
      setSelectedCell(cell);
      return;
    }
    /* eslint-enable functional/no-conditional-statements */
  };

  const handleReset = (): void => {
    setCells(setBoard());
    setTurn('white');
    setGameStatus('playing');
    setSelectedCell(undefined);
    setAttackers([]);
    setLastMove(undefined);
  };

  return(
    <>
      <GameHeader gameStatus={gameStatus} onClick={handleReset} turn={turn} />
      <div
        className="w-full max-w-[min(90vw,90vh)] aspect-square mx-auto grid grid-cols-8 grid-rows-8"
        id="board"
      >
        {cells.map(cell =>
            <Cell
              cellColor={cell.cellColor}
              coordinates={cell.coordinates}
              isAttacker={attackers.some(attacker => toChessNotation(attacker.coordinates) === toChessNotation(cell.coordinates))}
              isCastling={selectedCell && selectedCell.piece instanceof King ?
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
