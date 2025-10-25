import './board.css';
import { useEffect, useState } from 'react';

import type { CellColor, Cell as CellType, GameStatus, Move } from '../type';

import { movePiece } from '../moves/move-piece';
import { getPossibleMoves } from '../moves/possible-moves';
import { isCastlingMove } from '../moves/special-moves/castling-moves';
import { setBoard } from '../utils/board-utils';
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
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves(cells, selectedCell, lastMove, turn, gameStatus) : [];

  useEffect(() => {
    // When it comes to event handlers, returning doesn't makes much sense.
    /* eslint-disable functional/no-conditional-statements */
    const { attackers, check } = checkForCheck(cells, lastMove, turn, gameStatus);
    if (check) {
      if (isCheckmate(cells, lastMove, turn, gameStatus)) {
        setGameStatus('checkmate');
      } else {
        setGameStatus('check');
      }
      setAttackers(attackers);
    } else if (isStaleMate(cells, lastMove, turn, gameStatus)) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('playing');
      setAttackers([]);
    }
  }, [cells, turn, lastMove, gameStatus]);

  const handleCellClick = (cell: Readonly<CellType>) => {
    // Clicking on the same cell again deselect the cell.
    if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
      setSelectedCell(undefined);
      return;
    } else if (selectedCell && isPlayerPiece(selectedCell, turn)) {
      const { cells: newCells, success } = movePiece(cells, selectedCell, cell, lastMove, possibleMoves, turn);
      // The turn is over for the player only if movePiece succeeded.
      if (success) {
        // We can enforce the '!' because, if selectedCell had no piece, movePiece would return success: false
        const newMove = { from: selectedCell, pieceType: selectedCell.piece!.type, to: cell };
        setLastMove(newMove);
        setCells(newCells);
        setTurn(turn === 'white' ? 'black' : 'white');
        // useEffect runs there
      }
      setSelectedCell(undefined);
      return;
     // A player can only select a cell occupied by one of their pieces. That's why we can enforce that there's a piece on the selected cell in movePiece helper.
    } else if (isPlayerPiece(cell, turn)) {
      setSelectedCell(cell);
      return;
    }
  };

  const handleDragStart = (cell: Readonly<CellType>) => {
    if (cell.piece && isPlayerPiece(cell, turn)) {
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
              isCastling={selectedCell ?
                possibleMoves.some(move => toChessNotation(move.coordinates) === toChessNotation(cell.coordinates) && isCastlingMove(selectedCell, cell, turn))
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
