import type { CellColor, GameStatus } from '../type';
import { capitalize } from '../utils/utils';

type GameHeaderProps = {
  turn: CellColor,
  gameStatus: GameStatus,
  onClick: () => void
}

export default function GameHeader (props: GameHeaderProps) {
  let statusMessage = '';
  if (props.gameStatus === 'check') {
    statusMessage = 'Check!';
  } else if (props.gameStatus === 'checkmate') {
    statusMessage = 'Checkmate!';
  } else if (props.gameStatus === 'stalemate') {
    statusMessage = 'Stalemate ...';
  }

  return(
    <>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-red-600'>
          {statusMessage}
        </div>
      <div>{capitalize(props.turn)}'s turn.</div>
    </div>
    {/* Show a daisyUI alert banner when the game is over */}
    {(props.gameStatus === 'checkmate' || props.gameStatus === 'stalemate') && (
      <div className={`alert ${props.gameStatus === 'checkmate' ? 'alert-error' : 'alert-info'} shadow-lg flex justify-between items-center my-4 w-full max-w-lg mx-auto`}>
        <span className="text-lg font-bold">
          {props.gameStatus === 'checkmate' ? 'Checkmate!' : 'Stalemate!'}
        </span>
        <button
          className="btn btn-primary btn-sm ml-4"
          onClick={props.onClick}
        >
          New Game
        </button>
      </div>
    )}
  </>
  )
}
