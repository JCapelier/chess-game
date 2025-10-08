import type { CellColor } from '../type';
import { capitalize } from '../utils';

type GameHeaderProps = {
  turn: CellColor
}

export default function GameHeader (props: GameHeaderProps) {
  return(
    <div>
      <span>{capitalize(props.turn)}'s turn.</span>
    </div>
  )
}
