import { CellColor, GameStatus } from '../type';
import { capitalize } from '../utils/utils';

//Multiple types are needed to comply with the no-mixed-types rule. It's allowed for advanced types.
interface GameHeaderData {
  canRedo: boolean;
  canUndo: boolean;
  gameStatus: GameStatus;
  turn: CellColor;
};

interface GameHeaderHandlers extends GameHeaderData {
  onRedo: () => void;
  onReset: () => void;
  onUndo: () => void;
};

type GameHeaderProps = GameHeaderData & GameHeaderHandlers;

const STATUS_MAP = {
  check: 'Check!',
  checkmate: 'Checkmate!',
  playing: '',
  stalemate: 'Stalemate ...',
} satisfies Record<GameStatus, string>;

export default function GameHeader (props: Readonly<GameHeaderProps>) {
  const statusMessage = STATUS_MAP[props.gameStatus] ?? '';

  return(
    <>
      <div className="w-full bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md p-4 mb-4 flex items-center justify-between border border-gray-200 dark:border-gray-700 relative min-h-[64px]">
        {/* Centered big status for check/checkmate/stalemate */}
        {(props.gameStatus === GameStatus.Check || props.gameStatus === GameStatus.Checkmate || props.gameStatus === GameStatus.Stalemate) && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span className={
              'text-2xl md:text-3xl font-extrabold ' +
              (props.gameStatus === GameStatus.Check ? 'text-red-500' : (props.gameStatus === GameStatus.Checkmate ? 'text-red-700' : 'text-blue-600'))
            }>
              {statusMessage}
            </span>
          </div>
        )}
        {/* Turn and reset/new game button */}
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            Turn: <span className={props.turn === CellColor.White ? 'text-white' : 'text-yellow-600'}>{capitalize(props.turn)}</span>
          </span>
        </div>
        <div className="flex gap-3">
          <button
            className={`font-bold py-2 px-5 rounded-lg shadow transition-colors duration-150 ${
              props.canUndo
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!props.canUndo}
            onClick={props.onUndo}
          >
            Undo
          </button>
          <button
            className={`font-bold py-2 px-5 rounded-lg shadow transition-colors duration-150 ${
              props.canRedo
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!props.canRedo}
            onClick={props.onRedo}
          >
            Redo
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow transition-colors duration-150"
            onClick={props.onReset}
          >
            {(props.gameStatus === GameStatus.Checkmate || props.gameStatus === GameStatus.Stalemate) ? 'New Game' : 'Reset'}
          </button>
        </div>
      </div>
    </>
  );
}
