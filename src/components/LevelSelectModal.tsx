import React from 'react';
import { X, Star, Lock, CheckCircle2 } from 'lucide-react';
import { LEVELS } from '../utils/levelData';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Bölüm Seçimi
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ★ {totalStarsEarned} / {LEVELS.length * 3}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Oynamak istediğin aşamayı seç
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 gap-3">
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
                    onSelectLevel(lvl.id);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/40'
                    : isUnlocked
                    ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 hover:border-slate-500 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <span
                    className={`text-lg font-black ${
                      isCurrent ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {lvl.id}
                  </span>
                ) : (
                  <Lock className="w-5 h-5 text-slate-600 my-0.5" />
                )}

                {/* Stars */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
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
                  <span className="text-[9px] text-slate-400 font-mono mt-1">
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
