import './board-component.css';
import { useState } from 'react';

import { Board } from '../board/board';
import { clone } from '../board/board-cloning-helper';
import { cellClickHandler, getPreviousBoardAndStack } from '../board/cell-click-handler';
import { isAttackerCell, isCastlingDestination, isCheckedKing, isPossibleDestination, isSelectedCell } from '../board/highlight-cell-helper';
import { type Cell as CellType } from '../type';
import { toChessNotation } from '../utils/utils';
import Cell from './cell-component';
import GameHeader from './game-header-component';

export default function BoardComponent() {
  const [board, setBoard] = useState<Board>(Board.newStandardGame());
  const [selectedCell, setSelectedCell] = useState<CellType | undefined>();
  const [undoStack, setUndoStack] = useState<Board[]>([]);
  const [redoStack, setRedoStack] = useState<Board[]>([]);

  /* eslint-disable functional/no-conditional-statements */
  const handleCellClick = (cell: Readonly<CellType>) => {
    // Create clone BEFORE calling handleCellClick to capture current state
    const boardClone = clone(board);

    // Call handleCellClick to see if we need to make a move
    const clickOutput = cellClickHandler(board, undoStack, cell, selectedCell);

    if (clickOutput.moveSuccess) {
      // Add the pre-move state to undo stack
      setUndoStack(previous => [...previous, boardClone]);
      setRedoStack([]);

      // Use the result board directly, which already has lastMove set
      setBoard(new Board(
        clickOutput.board.cells,
        clickOutput.board.lastMove,
        clickOutput.board.gameStatus,
        clickOutput.board.pieceFactory,
        clickOutput.board.turn,
        {evaluateGameStatusOnInit: true}
      ));
    }
    setSelectedCell(clickOutput.selectedCell);
  };

  const handleDragStart = (cell: Readonly<CellType>) => {
    if (cell.piece && cell.piece.isPlayerPiece(board.turn)) {
      setSelectedCell(cell);
      return;
    }
    /* eslint-enable functional/no-conditional-statements */
  };

  const handleReset = (): void => {
    setBoard(Board.newStandardGame());
    setSelectedCell(undefined);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    const {previousBoard, previousStack} = getPreviousBoardAndStack(undoStack);
    if (!previousBoard) return;

    const copiedCells = previousBoard.cells.map(cell => ({
      ...cell,
      piece: cell.piece ? previousBoard.pieceFactory.createPiece(
        cell.piece.color,
        cell.piece.hasMoved,
        cell.piece.type
      ) : undefined
    }));

    setBoard(new Board(
      copiedCells,
      previousBoard.lastMove,
      previousBoard.gameStatus,
      previousBoard.pieceFactory,
      previousBoard.turn,
      {evaluateGameStatusOnInit: true}
    ));
    setRedoStack(previous => [...previous, board]);
    setUndoStack(previousStack);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextBoard = redoStack.at(-1);
    if (!nextBoard) return;

    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack(previous => [...previous, board]);
    setBoard(nextBoard);
    setRedoStack(newRedoStack);
  };

  return(
    <>
      <GameHeader
        canRedo={redoStack.length > 0}
        canUndo={undoStack.length > 0}
        gameStatus={board.gameStatus}
        onRedo={handleRedo}
        onReset={handleReset}
        onUndo={handleUndo}
        turn={board.turn}
      />
      <div
        className="w-full max-w-[min(90vw,90vh)] aspect-square mx-auto grid grid-cols-8 grid-rows-8"
        id="board"
      >
        {board.cells.map(cell =>
            <Cell
              cellColor={cell.cellColor}
              coordinates={cell.coordinates}
              isAttacker={isAttackerCell(board, cell)}
              isCastling={isCastlingDestination(board, cell, selectedCell)}
              isCheck={isCheckedKing(board, cell)}
              isPossibleDestination={isPossibleDestination(board, cell, selectedCell)}
              isSelected={isSelectedCell(cell, selectedCell)}
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
