import type { CellColor, GameStatus } from '../type';
import { capitalize } from '../utils/utils';

type GameHeaderProps = {
  turn: CellColor,
  gameStatus: GameStatus
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
  </>
  )
}
