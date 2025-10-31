import type { CellProps } from '../type';

import blackBishop from '../assets/pieces/black_bishop.png';
import blackKing from '../assets/pieces/black_king.png';
import blackKnight from '../assets/pieces/black_knight.png';
import blackPawn from '../assets/pieces/black_pawn.png';
import blackQueen from '../assets/pieces/black_queen.png';
import blackRook from '../assets/pieces/black_rook.png';
import whiteBishop from '../assets/pieces/white_bishop.png';
import whiteKing from '../assets/pieces/white_king.png';
import whiteKnight from '../assets/pieces/white_knight.png';
import whitePawn from '../assets/pieces/white_pawn.png';
import whiteQueen from '../assets/pieces/white_queen.png';
import whiteRook from '../assets/pieces/white_rook.png';
import './Cell.css';
import { capitalize } from '../utils/utils';


export default function Cell(props: Readonly<CellProps>) {
  //Mapping object to render the proper piece
  const pieceImages: { [key: string]: string } = {
    bB: blackBishop,
    bK: blackKing,
    bN: blackKnight,
    bP: blackPawn,
    bQ: blackQueen,
    bR: blackRook,
    wB: whiteBishop,
    wK: whiteKing,
    wN: whiteKnight,
    wP: whitePawn,
    wQ: whiteQueen,
    wR: whiteRook
  };

  return(
    <div
    className={`cell
      h-full w-auto max-w-full object-contain
      flex items-center justify-center
      hover:bg-purple-500/50
      ${colorClass(props.isSelected, props.isPossibleDestination, props.isAttacker, props.isCheck, props.isCastling)}`}
      onClick={props.onCellClick}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      >
      {props.piece && ( //The code in parenthesis runs only if props.piece
        <img
        alt={`${capitalize(props.piece.color)} ${props.piece.type}`}
        className="w-[80%] h-[80%] object-contain max-w-full max-h-full"
        draggable
        onDragStart={event => {
          // Clone the actual image node for a pixel-perfect drag ghost. Only way for the ghost to adapt its size.
          const target = event.target as HTMLImageElement;
          if (props.piece && target) {
            const clone = target.cloneNode(true) as HTMLImageElement;
            const style = globalThis.getComputedStyle(target);
            // The immutability is important for data structures, but it shouldn't forbid any DOM manipulation.
            /* eslint-disable functional/immutable-data */
            clone.style.width = style.width;
            clone.style.height = style.height;
            clone.style.objectFit = style.objectFit;
            clone.style.maxWidth = style.maxWidth;
            clone.style.maxHeight = style.maxHeight;
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            /* eslint-enable functional/immutable-data */
            document.body.append(clone);
            event.dataTransfer.setDragImage(clone, clone.width / 2, clone.height / 2);
            setTimeout(() => clone.remove(), 0);
            return;
          }

          // Call optional handler if provided
          props.onDragStart?.();
        }}
        src={pieceImages[props.piece.symbol]}
        />
      )}
    </div>
  );
}

function colorClass(isSelected: boolean, isPossibleDestination: boolean, isAttacker: boolean, isCheck: boolean, isCastling: boolean): string {
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
};
