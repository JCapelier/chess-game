import './Board.css';
import Cell from './Cell';
import type { Cell as CellType, CellColor, GameStatus, Move } from '../type';
import { useState, useEffect } from 'react';
import { toChessNotation } from '../utils/utils';
import { isPlayerPiece, checkedPlayerKing } from '../utils/pieceUtils';
import { setBoard } from '../utils/boardUtils';
import { movePiece } from '../moves/movePiece';
import { getPossibleMoves } from '../moves/possibleMoves';
import GameHeader from './GameHeader';
import { checkForCheck, isCheckmate, isStaleMate } from '../utils/gameStatusUtils';
import { isCastlingMove } from '../moves/specialMoves/castlingMoves';

export default function Board() {

  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [cells, setCells] = useState<CellType[]>(setBoard())
  const [selectedCell, setSelectedCell] = useState<CellType | null>(null)
  const [turn, setTurn] = useState<CellColor>('white');
  const [attackers, setAttackers] = useState<CellType[]>([])
  const [lastMove, setLastMove] = useState<Move | undefined>(undefined)
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves(cells, selectedCell, lastMove, turn, gameStatus) : [];

  useEffect(() => {
    const { check, attackers } = checkForCheck(cells, lastMove, turn, gameStatus);
    if (check) {
      if (isCheckmate(cells, lastMove, turn, gameStatus)) {
        setGameStatus('checkmate');
      } else {
        setGameStatus('check');
      }
      setAttackers(attackers);
    } else if (isStaleMate(cells, lastMove, turn, gameStatus)) {
      setGameStatus('stalemate')
    } else {
      setGameStatus('playing');
      setAttackers([]);
    }
  }, [cells, turn, lastMove, gameStatus]);

  const handleCellClick = (cell: CellType) => {
    // Clicking on the same cell again deselect the cell.
    if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
      setSelectedCell(null);
    } else if (selectedCell && isPlayerPiece(selectedCell, turn)) {
      const { cells: newCells, success } = movePiece(cells, selectedCell, cell, lastMove, possibleMoves, turn);
      // The turn is over for the player only if movePiece succeeded.
      if (success) {
        // We can enforce the '!' because, if selectedCell had no piece, movePiece would return success: false
        const newMove = { from: selectedCell, to: cell, pieceType: selectedCell.piece!.type };
        setLastMove(newMove);
        setCells(newCells);
        setTurn(turn === 'white' ? 'black' : 'white');
        // useEffect runs there
      }
        setSelectedCell(null);

     // A player can only select a cell occupied by one of their pieces. That's why we can enforce that there's a piece on the selected cell in movePiece helper.
    } else if (isPlayerPiece(cell, turn)) {
      setSelectedCell(cell);
    }
  }

  const handleReset = ():void => {
    setCells(setBoard());
    setTurn('white');
    setGameStatus('playing');
    setSelectedCell(null);
    setAttackers([]);
  }

  return(
    <>
      <GameHeader turn={turn} gameStatus={gameStatus} onClick={handleReset} />
      <div className="grid grid-cols-8 grid-rows-8" id="board">
        {cells.map(cell =>
            <Cell
              key={toChessNotation(cell.coordinates)}
              coordinates={cell.coordinates}
              piece={cell.piece}
              cellColor={cell.cellColor}
              onCellClick={() => handleCellClick(cell)}
              isSelected={selectedCell ? toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates) : false}
              isPossibleDestination={possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(cell.coordinates))}
              isAttacker={attackers.some(attacker => toChessNotation(attacker.coordinates) === toChessNotation(cell.coordinates))}
              isCheck={checkedPlayerKing(cell, gameStatus, turn) }
              isCastling={selectedCell ?
                possibleMoves.some(move => toChessNotation(move.coordinates) === toChessNotation(cell.coordinates) && isCastlingMove(selectedCell, cell, turn))
               : false}
            />
          )
        }
      </div>
    </>
  )
}
