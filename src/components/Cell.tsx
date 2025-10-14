import blackPawn from '../assets/pieces/black_pawn.png';
import blackKnight from '../assets/pieces/black_knight.png';
import blackBishop from '../assets/pieces/black_bishop.png';
import blackRook from '../assets/pieces/black_rook.png';
import blackQueen from '../assets/pieces/black_queen.png';
import blackKing from '../assets/pieces/black_king.png';
import whitePawn from '../assets/pieces/white_pawn.png';
import whiteKnight from '../assets/pieces/white_knight.png';
import whiteBishop from '../assets/pieces/white_bishop.png';
import whiteRook from '../assets/pieces/white_rook.png';
import whiteQueen from '../assets/pieces/white_queen.png';
import whiteKing from '../assets/pieces/white_king.png';

import type { CellProps, CellColor } from '../type';
import './Cell.css';
import { getPieceTypeName, pieceColor } from '../utils/pieceUtils';

export default function Cell(props: CellProps) {
  const colorClass = (cellColor: CellColor, isSelected: boolean, isPossibleDestination: boolean, isAttacker: boolean, isCheck: boolean): string => {
    if (isPossibleDestination) {
      return 'bg-green-500'
    } else if (isCheck || isAttacker) {
      return 'bg-red-600'
    } else if (isSelected) {
      return 'bg-purple-500'
    } else if (!isSelected && cellColor === 'black') {
      return 'bg-amber-700';
    } else {
      return 'bg-amber-200'
    }
  }

  //Mapping object to render the proper piece
  const pieceImages: { [key: string]: string } = {
    bP: blackPawn,
    bN: blackKnight,
    bB: blackBishop,
    bR: blackRook,
    bQ: blackQueen,
    bK: blackKing,
    wP: whitePawn,
    wN: whiteKnight,
    wB: whiteBishop,
    wR: whiteRook,
    wQ: whiteQueen,
    wK: whiteKing
  };

  return(
    <div
      className={`w-20 h-20 ${colorClass(props.cellColor, props.isSelected, props.isPossibleDestination, props.isAttacker, props.isCheck)} flex items-center justify-center hover:bg-purple-500`}
      onClick={props.onCellClick}
    >
      {props.piece && ( //The code in parenthesis runs only if props.piece
        <img
          src={pieceImages[props.piece.type]}
          alt={`${pieceColor(props.piece)} ${getPieceTypeName(props.piece)}`}
          className="h-full w-auto max-w-full object-contain"
        />
      )}
    </div>
  )
}
