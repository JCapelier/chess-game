import { type Cell, CellColor, GameStatus, PieceType } from '../type';


export function checkedPlayerKing(cell: Readonly<Cell>, gameStatus: GameStatus, turn: CellColor): boolean {
  // We only use this function in case of check or checkmate, to select the king to highlight
  if (gameStatus === GameStatus.Playing || gameStatus === GameStatus.Stalemate) return false;
  if (cell.piece) return cell.piece.isPlayerKing(turn);
  return false;
}

export function playerKing(cells: Readonly<Cell[]>, turn: CellColor) {
  return cells.find(cell => cell.piece && cell.piece.type === PieceType.King && cell.piece!.color === turn);
}
