import React from 'react';
import { Hammer, Shuffle, Bomb, RotateCcw, Undo2 } from 'lucide-react';
import { BoosterState, GameMode } from '../types/game';

interface BoosterBarProps {
  gameMode: GameMode;
  boosters: BoosterState;
  activeBooster: 'none' | 'hammer' | 'bomb';
  onSelectBooster: (tool: 'none' | 'hammer' | 'bomb') => void;
  onUseShuffle: () => void;
  onRestart: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
  disabled?: boolean;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  gameMode,
  boosters,
  activeBooster,
  onSelectBooster,
  onUseShuffle,
  onRestart,
  canUndo,
  onUndo,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
      {/* Quick Action: Restart & Undo */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onRestart}
          disabled={disabled}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white border border-slate-700/60 transition-colors shadow-sm disabled:opacity-40"
          title="Yeniden Başlat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {gameMode === 'zen' && onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo || disabled}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white border border-slate-700/60 transition-colors shadow-sm disabled:opacity-30"
            title="Hamleyi Geri Al"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Boosters: Hammer, Bomb, Shuffle */}
      <div className="flex items-center gap-2">
        {/* Hammer */}
        <button
          onClick={() => onSelectBooster(activeBooster === 'hammer' ? 'none' : 'hammer')}
          disabled={disabled || boosters.hammer <= 0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            activeBooster === 'hammer'
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-105'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/70 hover:border-slate-600'
          } disabled:opacity-40`}
          title="Çekiç: İstenilen herhangi bir bloğu anında kırar"
        >
          <Hammer className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Çekiç</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 rounded-md text-[10px] text-amber-300 font-mono">
            {boosters.hammer}
          </span>
        </button>

        {/* Place Bomb */}
        <button
          onClick={() => onSelectBooster(activeBooster === 'bomb' ? 'none' : 'bomb')}
          disabled={disabled || boosters.bomb <= 0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            activeBooster === 'bomb'
              ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-400/50 scale-105'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/70 hover:border-slate-600'
          } disabled:opacity-40`}
          title="Bomba: Sahaya 3x3 patlama yapacak bomba bırakır"
        >
          <Bomb className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Bomba</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 rounded-md text-[10px] text-rose-300 font-mono">
            {boosters.bomb}
          </span>
        </button>

        {/* Shuffle */}
        <button
          onClick={onUseShuffle}
          disabled={disabled || boosters.shuffle <= 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700/70 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:border-slate-600 text-xs font-bold transition-all shadow-sm disabled:opacity-40"
          title="Karıştır: Renkleri yeniden dağıtarak yeni eşleşmeler yaratır"
        >
          <Shuffle className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Karıştır</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 rounded-md text-[10px] text-indigo-300 font-mono">
            {boosters.shuffle}
          </span>
        </button>
      </div>
    </div>
  );
};
