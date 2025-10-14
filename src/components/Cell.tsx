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

import type { CellProps } from '../type';
import './Cell.css';
import { getPieceTypeName, pieceColor } from '../utils/pieceUtils';

export default function Cell(props: CellProps) {
  const colorClass = (isSelected: boolean, isPossibleDestination: boolean, isAttacker: boolean, isCheck: boolean, isCastling: boolean): string => {
    if (isCastling) {
        return 'bg-blue-500/40 shadow-[0_0_12px_4px_rgba(59,130,246,0.5)]';
    } else if (isCheck || isAttacker) {
        return 'bg-red-500/50 shadow-[0_0_12px_4px_rgba(239,68,68,0.5)]';
    } else if (isPossibleDestination) {
        return 'bg-green-400/50 shadow-[0_0_12px_4px_rgba(34,197,94,0.5)]';
    } else if (isSelected) {
        return 'bg-purple-500/50 shadow-[0_0_12px_4px_rgba(168,85,247,0.5)]';
    } else {
        return '';
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
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
      className={`cell
        h-full w-auto max-w-full object-contain
        flex items-center justify-center
        hover:bg-purple-500/50
        ${colorClass(props.isSelected, props.isPossibleDestination, props.isAttacker, props.isCheck, props.isCastling)}`}
      onClick={props.onCellClick}
    >
      {props.piece && ( //The code in parenthesis runs only if props.piece
        <img
          draggable
          onDragStart={e => {
            // Clone the actual image node for a pixel-perfect drag ghost. Only way for the ghost to adapt its size.
            const target = e.target as HTMLImageElement;
            if (props.piece && target) {
              const clone = target.cloneNode(true) as HTMLImageElement;
              // Copy computed styles for the node. The final values that decides what appears on screen.
              const style = window.getComputedStyle(target);
              clone.style.width = style.width;
              clone.style.height = style.height;
              clone.style.objectFit = style.objectFit;
              clone.style.maxWidth = style.maxWidth;
              clone.style.maxHeight = style.maxHeight;
              // We drag a copy of the clone, the clone itself is hidden off-screen
              clone.style.position = 'absolute';
              clone.style.top = '-9999px';
              document.body.appendChild(clone);
              e.dataTransfer.setDragImage(clone, clone.width / 2, clone.height / 2);
              // Remove the clone after a short delay
              setTimeout(() => document.body.removeChild(clone), 0);
            }
            if (props.onDragStart) props.onDragStart();
          }}
          src={pieceImages[props.piece.type]}
          alt={`${pieceColor(props.piece)} ${getPieceTypeName(props.piece)}`}
          className="w-[80%] h-[80%] object-contain max-w-full max-h-full"
        />
      )}
    </div>
  )
}
