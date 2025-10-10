import type { CellColor, GameStatus } from '../type';
import { capitalize } from '../utils/utils';

type GameHeaderProps = {
  turn: CellColor,
  gameStatus: GameStatus
}

export default function GameHeader (props: GameHeaderProps) {
  return(
    <div className='flex flex-col items-center justify-center'>
      <div className='text-red-600'>{props.gameStatus === 'check' ? 'Check!' : ''}</div>
      <div>{capitalize(props.turn)}'s turn.</div>
    </div>
  )
}
