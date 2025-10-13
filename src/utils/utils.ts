import type { Coordinates, CellColor, Piece, Cell as CellType, GameStatus } from '../type';


  export function getCellColor(coordinates: Coordinates): CellColor {
    return (coordinates.row + coordinates.col) % 2 === 0 ? 'black' : 'white';
  }

  export function getDefaultPiece(coordinates: Coordinates): Piece['type'] | null {
    if (coordinates.row === 0) {
      switch(coordinates.col) {
        case 0:
        case 7:
          return 'bR';
        case 1:
        case 6:
          return 'bB';
        case 2:
        case 5:
          return 'bN';
        case 3:
          return 'bQ';
        case 4:
          return 'bK';
      }
    } else if (coordinates.row === 1) {
      return 'bP';
    } else if (coordinates.row === 6) {
      return 'wP'
    } else if (coordinates.row === 7) {
      switch(coordinates.col) {
        case 0:
        case 7:
          return 'wR';
        case 1:
        case 6:
          return 'wB';
        case 2:
        case 5:
          return 'wN';
        case 3:
          return 'wQ';
        case 4:
          return 'wK';
      }
    }
    return null
  }

  export function toChessNotation(coordinates: Coordinates): string {
    // In chess, files are col, and ranks are rows
    const file = String.fromCharCode(65 + coordinates.col); // 65 is 'A'
    const rank = 8 - coordinates.row; // rank 1 is the bottom rank, whereas index 0 is the top row.
    return `${file}${rank}`;
  }

  export function playerKing(cells: CellType[], turn: CellColor) {
    return turn === 'white' ? cells.find(cell => cell.piece?.type === 'wK') : cells.find(cell => cell.piece?.type === 'bK');
  }

  export function isWhite(piece: Piece | null): boolean {
    return piece !== null && piece.type.startsWith('w');
  }

  export function isBlack(piece: Piece | null): boolean {
    return piece !== null && piece.type.startsWith('b');
  }

  export function isPlayerPiece(selectedCell: CellType, turn: CellColor): boolean {
    if (!selectedCell.piece) return false;
    return selectedCell.piece.type.at(0) === turn.at(0);
  }

  export function isEnemyPiece(playingPiece: Piece, otherPiece: Piece): boolean {
    return ((isBlack(playingPiece) && isWhite(otherPiece)) || (isWhite(playingPiece) && isBlack(otherPiece)))
  }

  export function getCellInfo(startCell: CellType) {
    //This is used in some placing for easy destructuring from cell to usable info
    return {
      col: startCell.coordinates.col,
      row: startCell.coordinates.row,
      piece: startCell.piece,
    };
  }
  export function isPlayerKing(cell: CellType, turn: CellColor): boolean {
    if (turn === 'white') {
      return cell.piece?.type === "wK";
    } else if (turn === 'black') {
      return cell.piece?.type === 'bK';
    } else {
      return false;
    }
  }

  export function checkedPlayerKing(cell: CellType, gameStatus: GameStatus, turn: CellColor): boolean {
    // We only use this function in case of check or checkmate, to select the king to highlight
    if (gameStatus === 'playing' || gameStatus === 'stalemate') return false;
    return isPlayerKing(cell, turn);
  }

  export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function getSidesCells(cells: CellType[], playingCell: CellType): CellType[] {
    // This is used for the 'en passant'. We only want to get the cells that are right next to the left or right of the playing cell.
    return cells.filter(cell =>
      cell.coordinates.row === playingCell.coordinates.row &&
      //Checking both col -1 and col + 1 (Math.abs(1))
      Math.abs(cell.coordinates.col - playingCell.coordinates.col) === 1)
  }

  //This next function only considers cells involved in a potential castling.
  export function orderedInBetweenCells(cells: CellType[], kingCell: CellType, rookCell: CellType): CellType[] {
    let inBetweenCells: CellType[] = [];
    //We need to know if we have the left or right rook to check cells between rook and king.
    if (rookCell.coordinates.col === 0) {
      inBetweenCells = cells.filter(cell =>
      cell.coordinates.row === kingCell.coordinates.row &&
      cell.coordinates.col > rookCell.coordinates.col &&
      cell.coordinates.col < kingCell.coordinates.col)
      //We want to sort them as an outward movement for the king, to make an easier checkForCheck later in the castling process
      .sort((a, b) => b.coordinates.col - a.coordinates.col);
    } else {
      inBetweenCells = cells.filter(cell =>
      cell.coordinates.row === kingCell.coordinates.row &&
      cell.coordinates.col > kingCell.coordinates.col &&
      cell.coordinates.col < rookCell.coordinates.col)
      .sort((a, b) => a.coordinates.col - b.coordinates.col);
    }
    return inBetweenCells;
  }

  export function areInBetweenCellsEmpty(cells: CellType[], kingCell: CellType, rookCell: CellType): boolean {
    const inBetweenCells = orderedInBetweenCells(cells, kingCell, rookCell);
    for (const cell of inBetweenCells) {
      if (cell.piece) {
        return false;
      }
    }
    return true;
  }

  export function isCastlingMove(startCell: CellType, destinationCell: CellType, turn: CellColor) {
    // If the players selects its king and then its rook, it's an attempted castling move
    // This is just a quick check, because it only triggers when we know what are the valid moves.
    // The actual logic of the move, which properly places the king and the rook, are in movePiece
    return (
      isPlayerKing(startCell, turn) &&
      destinationCell.piece?.type.endsWith('R') &&
      isPlayerPiece(destinationCell, turn)
    );
  }
