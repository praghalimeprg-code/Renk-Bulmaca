import React from 'react';
import { Volume2, VolumeX, HelpCircle, Grid } from 'lucide-react';
import { GameMode } from '../types/game';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  gameMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  currentLevel: number;
  totalStars: number;
}

export const Header: React.FC<HeaderProps> = ({
  gameMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  onOpenLevelSelect,
  onOpenHowToPlay,
  currentLevel,
  totalStars,
}) => {
  return (
    <header className="flex items-center justify-between gap-2 md:gap-8 px-3 md:px-8 py-2 md:py-3.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <span className="text-white font-extrabold text-xs tracking-tighter">RB</span>
        </div>
        <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white whitespace-nowrap">
          Renk Bulmaca
        </h1>
      </div>

      {/* Zone 2: Navigation & Mode Tabs (Desktop / Tablet) */}
      <nav className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => onSelectMode('levels')}
          className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] ${
            gameMode === 'levels'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Seviyeler
        </button>
        <button
          onClick={() => onSelectMode('zen')}
          className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] ${
            gameMode === 'zen'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Serbest Zen
        </button>
        <button
          onClick={() => onSelectMode('timeAttack')}
          className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] ${
            gameMode === 'timeAttack'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Zamana Karşı
        </button>
      </nav>

      {/* Zone 3: Actions & Mobile Touch Targets (>= 44x44px) */}
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
        <div className="hidden md:block">
          <PWAInstallButton variant="header" />
        </div>

        {gameMode === 'levels' && (
          <button
            onClick={onOpenLevelSelect}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors whitespace-nowrap min-h-[44px]"
            title="Bölüm Seçimi"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bölüm {currentLevel}</span>
            <span className="text-amber-400 font-bold flex items-center gap-0.5 ml-0.5">
              ★ {totalStars}
            </span>
          </button>
        )}

        <button
          onClick={onOpenHowToPlay}
          className="flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-white active:scale-95 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          title="Nasıl Oynanır?"
          aria-label="Nasıl Oynanır"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSound}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border active:scale-95 transition-all ${
            soundEnabled
              ? 'text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30'
              : 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
          aria-label={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
