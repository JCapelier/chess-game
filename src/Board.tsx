import Cell from './Cell';
import { setBoard } from './utils';

export default function Board() {
  const cells = setBoard()
  return(
    <>
      <div className="grid grid-cols-8 grid-rows-8">
        {cells.map(cell =>
            <Cell key={cell.key} coordinates={cell.coordinates} piece={cell.piece} cellColor={cell.cellColor}/>
          )
        }
      </div>
    </>
  )
}
