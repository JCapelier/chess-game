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
      <div className="w-full bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md p-4 mb-4 flex items-center justify-between border border-gray-200 dark:border-gray-700 relative min-h-[64px]">
        {/* Centered big status for check/checkmate/stalemate */}
        {(props.gameStatus === 'check' || props.gameStatus === 'checkmate' || props.gameStatus === 'stalemate') && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full">
            <span className={
              'text-2xl md:text-3xl font-extrabold ' +
              (props.gameStatus === 'check' ? 'text-red-500' : props.gameStatus === 'checkmate' ? 'text-red-700' : 'text-blue-600')
            }>
              {statusMessage}
            </span>
          </div>
        )}
        {/* Turn and reset/new game button */}
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            Turn: <span className={props.turn === 'white' ? 'text-white' : 'text-yellow-600'}>{capitalize(props.turn)}</span>
          </span>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg shadow transition-colors duration-150"
          onClick={props.onClick}
        >
          {(props.gameStatus === 'checkmate' || props.gameStatus === 'stalemate') ? 'New Game' : 'Reset'}
        </button>
      </div>
    </>
  )
}
