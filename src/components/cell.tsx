import type { CellProps } from '../type';

import blackBishop from '../assets/pieces/black_bishop.png';
import blackKing from '../assets/pieces/black_king.png';
import blackKnight from '../assets/pieces/black_knight.png';
import blackPawn from '../assets/pieces/black_pawn.png';
import blackQueen from '../assets/pieces/black_queen.png';
import blackRook from '../assets/pieces/black_rook.png';
import blackValkyrie from '../assets/pieces/black_valkyrie.png';
import whiteBishop from '../assets/pieces/white_bishop.png';
import whiteKing from '../assets/pieces/white_king.png';
import whiteKnight from '../assets/pieces/white_knight.png';
import whitePawn from '../assets/pieces/white_pawn.png';
import whiteQueen from '../assets/pieces/white_queen.png';
import whiteRook from '../assets/pieces/white_rook.png';
import whiteValkyrie from '../assets/pieces/white_valkyrie.png';
import './cell.css';
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
    bV: blackValkyrie,
    wB: whiteBishop,
    wK: whiteKing,
    wN: whiteKnight,
    wP: whitePawn,
    wQ: whiteQueen,
    wR: whiteRook,
    wV: whiteValkyrie,
  };

  //This was done with the help of different AI.
  /* eslint-disable functional/no-conditional-statements, functional/immutable-data */
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
        alt={`${capitalize(props.piece.color)} ${props.piece.constructor.name}`}
        className="w-[80%] h-[80%] object-contain max-w-full max-h-full"
        draggable
        onDragStart={event => {
          // Trigger optional external handler if provided
          props.onDragStart?.();

          const targetImage = event.target as HTMLImageElement;
          if (!props.piece || !targetImage) return;

          // Get the displayed dimensions of the original image in pixels
          const boundingBox = targetImage.getBoundingClientRect();
          const displayWidth = Math.round(boundingBox.width);
          const displayHeight = Math.round(boundingBox.height);

          // Get the natural dimensions of the image (the real bitmap size)
          const naturalWidth = targetImage.naturalWidth || displayWidth;
          const naturalHeight = targetImage.naturalHeight || displayHeight;

          // Calculate how much we need to scale the image to fit the display box
          // "contain" behavior: scale so the whole image fits without distortion
          const scaleFactor = Math.min(displayWidth / naturalWidth, displayHeight / naturalHeight);

          // Determine the scaled width and height while keeping aspect ratio
          const scaledWidth = Math.max(1, Math.round(naturalWidth * scaleFactor));
          const scaledHeight = Math.max(1, Math.round(naturalHeight * scaleFactor));

          // Center the image inside the target box
          const horizontalOffset = Math.floor((displayWidth - scaledWidth) / 2);
          const verticalOffset = Math.floor((displayHeight - scaledHeight) / 2);

          // Create a canvas to draw the drag image onto
          const dragCanvas = document.createElement('canvas');

          // The canvas bitmap must match the physical pixel density of the screen
          const devicePixelRatioValue = window.devicePixelRatio || 1;
          dragCanvas.width = Math.max(1, Math.floor(displayWidth * devicePixelRatioValue));
          dragCanvas.height = Math.max(1, Math.floor(displayHeight * devicePixelRatioValue));

          // Also set the CSS dimensions so the browser interprets it at display scale
          dragCanvas.style.width = `${displayWidth}px`;
          dragCanvas.style.height = `${displayHeight}px`;

          // Get a 2D rendering context to draw on the canvas
          const drawingContext = dragCanvas.getContext('2d');
          if (drawingContext) {
            // Scale the drawing operations to device pixel ratio for sharpness
            drawingContext.scale(devicePixelRatioValue, devicePixelRatioValue);

            // Clear the canvas area
            drawingContext.clearRect(0, 0, displayWidth, displayHeight);

            // Draw the image centered and scaled with preserved aspect ratio
            drawingContext.drawImage(
              targetImage,               // source image
              0, 0,                      // source x, y
              naturalWidth, naturalHeight, // source width, height
              horizontalOffset, verticalOffset, // destination x, y
              scaledWidth, scaledHeight          // destination width, height
            );
          }

          // Use the canvas as the drag image, centered on the cursor
          event.dataTransfer.setDragImage(
            dragCanvas,
            displayWidth / 2,
            displayHeight / 2
          );
        }}
        src={pieceImages[props.piece.symbol]}
        />
      )}
    </div>
  );
  /* eslint-enable functional/no-conditional-statements, functional/immutable-data */
}

function colorClass(isSelected: boolean, isPossibleDestination: boolean, isAttacker: boolean, isCheck: boolean, isCastling: boolean): string {
  if (isCastling) {
    return 'bg-blue-500/40 shadow-[0_0_12px_4px_rgba(59,130,246,0.5)]';
  } else if (isPossibleDestination) {
    return 'bg-green-400/50 shadow-[0_0_12px_4px_rgba(34,197,94,0.5)]';
  } else if (isSelected) {
    return 'bg-purple-500/50 shadow-[0_0_12px_4px_rgba(168,85,247,0.5)]';
  } else if (isCheck || isAttacker) {
      return 'bg-red-500/50 shadow-[0_0_12px_4px_rgba(239,68,68,0.5)]';
  } else {
      return '';
  }
};
