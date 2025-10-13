import type { Cell, CellColor, Piece, Move, GameStatus } from '../type';
import { checkForCheck } from './gameStatusUtils';
import { isBlack, getDefaultPiece, toChessNotation, getCellColor, playerKing, isPlayerPiece, areInBetweenCellsEmpty, orderedInBetweenCells, isCastlingMove } from './utils';


  export function setBoard(): Cell[] {
    return Array.from({length: 64}, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const coordinates = {row, col};
      const pieceType = getDefaultPiece(coordinates);
      const piece = pieceType ? { type: pieceType, hasMoved: false } : null;
      return(
        {
          key: toChessNotation(coordinates),
          coordinates: coordinates,
          piece: piece,
          cellColor: getCellColor(coordinates),
        }
      );
    });
  }

  // movePiece must return an object with success: boolean, so that the Board can check if the turn is over after calling movePiece or not.
  export function movePiece(cells: Cell[], startCell: Cell, destinationCell: Cell, lastMove: Move | undefined, possibleMoves: Cell[], turn: CellColor): { cells: Cell[], success: boolean} {
    // For React to render again properly, always return a new array of updated cells. Never mutate directly the cell or the Cell[]
    if (
      !isCastlingMove(startCell, destinationCell, turn) &&
      !isEnPassant(cells, startCell, destinationCell, lastMove) &&
      !possibleMoves.some(destination => toChessNotation(destination.coordinates) === toChessNotation(destinationCell.coordinates)))
      return {cells: cells, success: false};

    const newCells = cells.map(cell => {
      if (toChessNotation(cell.coordinates) === toChessNotation(startCell.coordinates)) {
        return { ...cell, piece: null };
      }

      if (!isCastlingMove(startCell, destinationCell, turn) && toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)) {
        // This ! is legit : board component only allow the player to select a cell occupied by one of their pieces.
        return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
      }

      if (isEnPassant(cells, startCell, destinationCell, lastMove)) {
        //If isEnPassant, then we need to remove the piece in the cell that is in the row of the beginning of the move and the col at the end of the move. The one
        //just below the destination cell.
        const capturedRow = startCell.coordinates.row;
        const capturedCol = destinationCell.coordinates.col;
        if (cell.coordinates.row === capturedRow && cell.coordinates.col === capturedCol) {
          return { ...cell, piece: null };
        }
      }

      if (isCastlingMove(startCell, destinationCell, turn)) {
        // Find which side is being castled
        const row = startCell.coordinates.row;
        const isLeft = destinationCell.coordinates.col === 0;
        const isRight = destinationCell.coordinates.col === 7;

        if (isLeft) {
          // King goes to col 2, rook to col 3
          if (cell.coordinates.col === 4 && cell.coordinates.row === row) return { ...cell, piece: null }; // old king
          if (cell.coordinates.col === 0 && cell.coordinates.row === row) return { ...cell, piece: null }; // old rook
          if (cell.coordinates.col === 2 && cell.coordinates.row === row) return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
          if (cell.coordinates.col === 3 && cell.coordinates.row === row) return { ...cell, piece: { type: destinationCell.piece!.type, hasMoved: true }};
        } else if (isRight) {
          // King goes to col 6, rook to col 5
          if (cell.coordinates.col === 4 && cell.coordinates.row === row) return { ...cell, piece: null }; // old king
          if (cell.coordinates.col === 7 && cell.coordinates.row === row) return { ...cell, piece: null }; // old rook
          if (cell.coordinates.col === 6 && cell.coordinates.row === row) return { ...cell, piece: { type: startCell.piece!.type, hasMoved: true }};
          if (cell.coordinates.col === 5 && cell.coordinates.row === row) return { ...cell, piece: { type: destinationCell.piece!.type, hasMoved: true }};
        }
      }
      return cell;
    });

    //Takes care of pawnPromotion if a pawn is in position for it.
    if ( (startCell.piece?.type === 'wP' && destinationCell.coordinates.row === 0) || (startCell.piece?.type === 'bP' && destinationCell.coordinates.row === 7)) {
      const promotedCells = pawnPromotion(newCells);
      return {cells: promotedCells, success: true}
    } else {
      return {cells: newCells, success: true};
    }
  }


  export function filterMovesLeavingKingInCheck(cells: Cell[], startCell: Cell, lastMove: Move | undefined, possibleMoves: Cell[], turn: CellColor, gameStatus: GameStatus): Cell[]{
    const validMoves: Cell[] = [];
    possibleMoves.forEach(possibleMove => {
      // We're creating a copy of cells where the move would be accomplished, to check if playerKing would be in check or not
      const {cells: simulatedBoard} = movePiece(cells, startCell, possibleMove, lastMove, possibleMoves, turn);
      const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
      if (check.check === false) {
        validMoves.push(possibleMove);
      }
    })
    return validMoves;
  }

  //For now, promotion automatically promotes the pawn to queen.
  //TODO underpromotion
  export function pawnPromotion(cells: Cell[]): Cell[]{

    const newCells = cells.map( cell => {
      if (cell.piece?.type === 'wP' && cell.coordinates.row === 0 ) {
        //We need to enforce Piece type, otherwise, 'wQ' and 'bQ' are treated as simple strings,
        //which causes a TS error
        return {...cell, piece: {type: 'wQ', hasMoved: true} as Piece}
      } else if (cell.piece?.type === 'bP' && cell.coordinates.row === 7 ) {
        return {...cell, piece: {type: 'bQ', hasMoved: true} as Piece}
      } else {
        return cell
      }});

    return newCells
  }

  //We're just checking the last move, for 'en passant', we don't consider the status of every pawn.
  function hasPawnMovedTwoSquares(lastMove?: Move | undefined): boolean {
    if (!lastMove! || !lastMove.pieceType.endsWith('P')) return false;

    const startRow = lastMove.from.coordinates.row;
    const endRow = lastMove.to.coordinates.row;

    //Math.abs return the absolute value
    return (Math.abs(endRow - startRow) === 2) ? true : false;
  }


  // This will be called in pawnValidMoves.
  export function enPassantMoves(cells: Cell[], playingCell: Cell, lastMove: Move | undefined): Cell[] {
    if (!lastMove || !hasPawnMovedTwoSquares(lastMove)) return [];

    const { row, col } = playingCell.coordinates;
    const pawnDirection = isBlack(playingCell.piece) ? 1 : -1;
    const enPassantRow = row + pawnDirection;

    // The pawn that just moved must be adjacent (left or right)
    const possibleCols = [col - 1, col + 1];
    const validMoves: Cell[] = [];

    possibleCols.forEach(targetCol => {
      if (targetCol < 0 || targetCol > 7) return;
      // The pawn that just moved must be in the adjacent column and on the same row as the playing pawn
      if (
        lastMove.to.coordinates.row === row &&
        lastMove.to.coordinates.col === targetCol
      ) {
        // The en passant target is the diagonal square in front of the playing pawn
        const targetCell = cells.find(
          cell =>
            cell.coordinates.row === enPassantRow &&
            cell.coordinates.col === targetCol &&
            !cell.piece // en passant target square must be empty
        );
        if (targetCell) validMoves.push(targetCell);
      }
    });

    return validMoves;
  }

  function isEnPassant(cells: Cell[], startCell: Cell, destinationCell: Cell, lastMove: Move | undefined): boolean {
    const enPassantValidMoves = enPassantMoves(cells, startCell, lastMove);
    // We checks if there's an en passant move with the current selected piece.
    const isEnPassant = enPassantValidMoves.some(
      cell => toChessNotation(cell.coordinates) === toChessNotation(destinationCell.coordinates)
    );
    return isEnPassant;
  }

  export function castlingMoves(cells: Cell[], lastMove: Move | undefined, turn: CellColor, gameStatus: GameStatus): Cell[] {
    const kingCell = playerKing(cells, turn);
    const rookCells: Cell[] = cells.filter(cell => cell.piece?.type.endsWith('R') && isPlayerPiece(cell, turn));

    if(!kingCell ||
      kingCell.piece!.hasMoved === true ||
      rookCells.every(rook => rook.piece!.hasMoved === true ||
      gameStatus === 'check'
      )) return [];

    const leftRookCell = rookCells.find(rook => rook.coordinates.col === 0);
    const rightRookCell = rookCells.find(rook => rook.coordinates.col === 7);

    // We will add the rook as a valid destination, if castling is possible.
    // In the end, to perform it, the player will need to click on the rook after selecting the king.
    // The logic to get the proper destinations will be dealt with in movePiece.
    const castlingMoves: Cell[] = [];
    let canCastleLeft = true;
    if (leftRookCell && areInBetweenCellsEmpty(cells, kingCell, leftRookCell)) {
      const leftInBetweenCells: Cell[] = orderedInBetweenCells(cells, kingCell, leftRookCell)
      for (const cell of leftInBetweenCells) {
        //We're only passing the cell we're passing through as possibleMoves for the simulation
        const {cells: simulatedBoard} = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
        const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
        if (check.check === true) {
          canCastleLeft = false;
          break;
        }
      }
      if (canCastleLeft) castlingMoves.push(leftRookCell);
    }

    let canCastleRight = true
    if (rightRookCell && areInBetweenCellsEmpty(cells, kingCell, rightRookCell)) {
      const leftInBetweenCells: Cell[] = orderedInBetweenCells(cells, kingCell, rightRookCell)
      for (const cell of leftInBetweenCells) {
        //We're only passing the cell we're passing through as possibleMoves for the simulation
        const {cells: simulatedBoard} = movePiece(cells, kingCell, cell, lastMove, [cell], turn);
        const check = checkForCheck(simulatedBoard, lastMove, turn, gameStatus, true);
        if (check.check === true) {
          canCastleRight = false;
          break;
        }
      }
      if (canCastleRight) castlingMoves.push(rightRookCell);
    }

    return castlingMoves;
  }
