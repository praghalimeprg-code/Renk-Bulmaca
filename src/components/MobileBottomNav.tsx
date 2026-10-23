import React from 'react';
import { GameMode } from '../types/game';
import { Layers, Sparkles, Timer, Grid } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileBottomNavProps {
  gameMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenLevelSelect: () => void;
  currentLevel: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  gameMode,
  onSelectMode,
  onOpenLevelSelect,
  currentLevel,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 items-center justify-items-center h-14">
        {/* Tab 1: Seviyeler */}
        <button
          onClick={() => onSelectMode('levels')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] w-full transition-all ${
            gameMode === 'levels'
              ? 'text-rose-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Seviyeler Modu"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Seviyeler</span>
        </button>

        {/* Tab 2: Serbest Zen */}
        <button
          onClick={() => onSelectMode('zen')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] w-full transition-all ${
            gameMode === 'zen'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Serbest Zen Modu"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Serbest</span>
        </button>

        {/* Tab 3: Zamana Karşı */}
        <button
          onClick={() => onSelectMode('timeAttack')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] w-full transition-all ${
            gameMode === 'timeAttack'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Zamana Karşı Mod"
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Zaman</span>
        </button>

        {/* Tab 4: Bölüm Haritası */}
        <button
          onClick={onOpenLevelSelect}
          className="flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] w-full text-indigo-400 hover:text-indigo-300 transition-colors"
          aria-label="Bölüm Listesi"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight font-medium">Bölüm {currentLevel}</span>
        </button>

        {/* Tab 5: PWA Install Icon */}
        <PWAInstallButton variant="bottomNav" />
      </div>
    </nav>
  );
};
