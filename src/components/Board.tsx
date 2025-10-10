import Cell from './Cell';
import type { Cell as CellType, CellColor, GameStatus } from '../type';
import { useState, useEffect } from 'react';
import { toChessNotation, isPlayerPiece, isPlayerKing } from '../utils/utils';
import { movePiece, setBoard } from '../utils/boardUtils';
import { getPossibleMoves } from '../moves/moves';
import GameHeader from './GameHeader';
import { checkForCheck } from '../utils/gameStatusUtils';

export default function Board() {

  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [cells, setCells] = useState<CellType[]>(setBoard())
  const [selectedCell, setSelectedCell] = useState<CellType | null>(null)
  const [turn, setTurn] = useState<CellColor>('white');
  const [attackers, setAttackers] = useState<CellType[]>([])
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves(cells, selectedCell, turn) : [];


  useEffect(() => {
    const checkedColor: CellColor = turn === 'white' ? 'black' : 'white';
    const { check, attackers } = checkForCheck(cells, checkedColor);
    if (check) {
      setGameStatus('check');
      setAttackers(attackers);
    } else {
      setGameStatus('playing');
      setAttackers([]);
    }
  }, [cells, turn]);

  const handleCellClick = (cell: CellType) => {
    // Clicking on the same cell again deselect the cell.
    if (selectedCell && toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates)) {
      setSelectedCell(null);
    } else if (selectedCell && isPlayerPiece(selectedCell, turn)) {
      const { cells: newCells, success } = movePiece(cells, selectedCell, cell, possibleMoves)
      // The turn is over for the player only if movePiece succeeded.
      if (success) {
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


  return(
    <>
      <GameHeader turn={turn} gameStatus={gameStatus} />
      <div className="grid grid-cols-8 grid-rows-8">
        {cells.map(cell =>
            <Cell
              key={toChessNotation(cell.coordinates)}
              coordinates={cell.coordinates}
              piece={cell.piece}
              cellColor={cell.cellColor}
              onCellClick={() => handleCellClick(cell)}
              // Can't access selectedCell?.key immediately, because key isn't included in CellType and shouldn't be
              // because key is just a rendering concern, and has no part in the logic of the game.
              isSelected={selectedCell ? toChessNotation(selectedCell.coordinates) === toChessNotation(cell.coordinates) : false}
              isPossibleDestination={possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(cell.coordinates))}
              isAttacker={attackers.some(attacker => toChessNotation(attacker.coordinates) === toChessNotation(cell.coordinates))}
              isCheck={isPlayerKing(cell, gameStatus, turn) }
            />
          )
        }
      </div>
    </>
  )
}
