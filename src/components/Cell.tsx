import type { Cell } from '../type';
import './Cell.css';

export default function Cell(props: Cell) {
  const colorClass = props.cellColor === 'black' ? 'bg-amber-700' : 'bg-amber-200';

  return(
    <div className={`w-20 h-20 ${colorClass} flex items-center justify-center hover:bg-purple-500`}>
      <span className="text-white text-outline">{props.piece?.type}</span>
    </div>
  )
}
