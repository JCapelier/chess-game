import type { CellProps, CellColor } from '../type';
import './Cell.css';

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

  return(
    <div
      className={`w-20 h-20 ${colorClass(props.cellColor, props.isSelected, props.isPossibleDestination, props.isAttacker, props.isCheck)} flex items-center justify-center hover:bg-purple-500`}
      onClick={props.onCellClick}
    >
      <span className="text-white text-outline">{props.piece?.type}</span>
    </div>
  )
}
