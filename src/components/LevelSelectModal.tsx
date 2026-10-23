import React from 'react';
import { X, Star, Lock } from 'lucide-react';
import { LEVELS } from '../utils/levelData';
import { haptics } from '../utils/haptics';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  levelScores: Record<number, number>;
  currentLevel: number;
  onSelectLevel: (lvl: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  unlockedLevel,
  levelStars,
  levelScores,
  currentLevel,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  const totalStarsEarned = Object.values(levelStars).reduce((acc, s) => acc + s, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[88vh] bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              Bölüm Seçimi
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ★ {totalStarsEarned} / {LEVELS.length * 3}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Oynamak istediğin aşamayı seç
            </p>
          </div>
          <button
            onClick={() => {
              haptics.tap();
              onClose();
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 overscroll-contain">
          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const stars = levelStars[lvl.id] || 0;
            const isCurrent = lvl.id === currentLevel;
            const highScore = levelScores[lvl.id] || 0;

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    haptics.tap();
                    onSelectLevel(lvl.id);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`relative flex flex-col items-center justify-center min-h-[56px] sm:min-h-[64px] p-2 sm:p-3 rounded-2xl border transition-all active:scale-95 ${
                  isCurrent
                    ? 'bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/40'
                    : isUnlocked
                    ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 hover:border-slate-500 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
                aria-label={`Bölüm ${lvl.id}`}
              >
                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <span
                    className={`text-base sm:text-lg font-black ${
                      isCurrent ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {lvl.id}
                  </span>
                ) : (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 my-0.5" />
                )}

                {/* Stars */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-0.5 sm:mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* High Score Preview */}
                {highScore > 0 && (
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {highScore > 9999 ? `${Math.floor(highScore / 1000)}k` : highScore}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
