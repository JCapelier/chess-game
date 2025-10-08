import Cell from './Cell';
import type { Cell as CellType, CellData, CellColor } from '../type';
import { useState } from 'react';
import { toChessNotation, isPlayerPiece } from '../utils/utils';
import { movePiece, setBoard } from '../utils/boardUtils';
import { getPossibleMoves } from '../moves/moves';
import GameHeader from './GameHeader';

export default function Board() {

  const [cells, setCells] = useState<CellData[]>(setBoard())
  const [selectedCell, setSelectedCell] = useState<CellType | null>(null)
  const [turn, setTurn] = useState<CellColor>('white');
  const possibleMoves: CellType[] = selectedCell ? getPossibleMoves(cells, selectedCell) : [];

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
      }
        setSelectedCell(null);
     // A player can only select a cell occupied by one of their pieces. That's why we can enforce that there's a piece on the selected cell in movePiece helper.
    } else if (isPlayerPiece(cell, turn)) {
      setSelectedCell(cell);
    }
  }


  return(
    <>
      <GameHeader turn={turn} />
      <div className="grid grid-cols-8 grid-rows-8">
        {cells.map(cell =>
            <Cell
              key={cell.key}
              coordinates={cell.coordinates}
              piece={cell.piece}
              cellColor={cell.cellColor}
              onCellClick={() => handleCellClick(cell)}
              // Can't access selectedCell?.key immediately, because key isn't included in CellType and shouldn't be
              // because key is just a rendering concern, and has no part in the logic of the game.
              isSelected={selectedCell ? toChessNotation(selectedCell.coordinates) === cell.key : false}
              isPossibleDestination={possibleMoves.some(destination => toChessNotation(destination.coordinates) === cell.key )}
            />
          )
        }
      </div>
    </>
  )
}
