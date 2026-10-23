import React from 'react';
import { Hammer, Shuffle, Bomb, RotateCcw, Undo2 } from 'lucide-react';
import { BoosterState, GameMode } from '../types/game';
import { haptics } from '../utils/haptics';

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
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-1.5 select-none">
      {/* Quick Action: Restart & Undo */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            haptics.tap();
            onRestart();
          }}
          disabled={disabled}
          className="min-h-[44px] min-w-[44px] p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95 shadow-sm disabled:opacity-40 flex items-center justify-center"
          title="Yeniden Başlat"
          aria-label="Yeniden Başlat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {gameMode === 'zen' && onUndo && (
          <button
            onClick={() => {
              haptics.tap();
              onUndo();
            }}
            disabled={!canUndo || disabled}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95 shadow-sm disabled:opacity-30 flex items-center justify-center"
            title="Hamleyi Geri Al"
            aria-label="Hamleyi Geri Al"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Boosters: Hammer, Bomb, Shuffle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Hammer */}
        <button
          onClick={() => {
            haptics.tap();
            onSelectBooster(activeBooster === 'hammer' ? 'none' : 'hammer');
          }}
          disabled={disabled || boosters.hammer <= 0}
          className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
            activeBooster === 'hammer'
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
          } disabled:opacity-40`}
          title="Çekiç: İstenilen herhangi bir bloğu anında kırar"
          aria-label="Çekiç Güçlendiricisi"
        >
          <Hammer className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden xs:inline sm:inline">Çekiç</span>
          <span className="px-1.5 py-0.5 bg-slate-950/80 rounded-lg text-[10px] text-amber-300 font-mono">
            {boosters.hammer}
          </span>
        </button>

        {/* Place Bomb */}
        <button
          onClick={() => {
            haptics.tap();
            onSelectBooster(activeBooster === 'bomb' ? 'none' : 'bomb');
          }}
          disabled={disabled || boosters.bomb <= 0}
          className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
            activeBooster === 'bomb'
              ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-400/50 scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
          } disabled:opacity-40`}
          title="Bomba: Sahaya 3x3 patlama yapacak bomba bırakır"
          aria-label="Bomba Güçlendiricisi"
        >
          <Bomb className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="hidden xs:inline sm:inline">Bomba</span>
          <span className="px-1.5 py-0.5 bg-slate-950/80 rounded-lg text-[10px] text-rose-300 font-mono">
            {boosters.bomb}
          </span>
        </button>

        {/* Shuffle */}
        <button
          onClick={() => {
            haptics.tap();
            onUseShuffle();
          }}
          disabled={disabled || boosters.shuffle <= 0}
          className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all active:scale-95 shadow-sm disabled:opacity-40"
          title="Karıştır: Renkleri yeniden dağıtarak yeni eşleşmeler yaratır"
          aria-label="Karıştır Güçlendiricisi"
        >
          <Shuffle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="hidden xs:inline sm:inline">Karıştır</span>
          <span className="px-1.5 py-0.5 bg-slate-950/80 rounded-lg text-[10px] text-indigo-300 font-mono">
            {boosters.shuffle}
          </span>
        </button>
      </div>
    </div>
  );
};
