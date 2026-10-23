import React, { useEffect } from 'react';
import { Trophy, RotateCcw, ArrowRight, Star, Frown, Sparkles, Grid } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LevelObjective } from '../types/game';
import { haptics } from '../utils/haptics';

interface GameOverModalProps {
  isOpen: boolean;
  isVictory: boolean;
  score: number;
  earnedStars: number;
  movesLeft: number;
  currentLevel: number;
  hasNextLevel: boolean;
  objectives?: LevelObjective[];
  onNextLevel: () => void;
  onRetry: () => void;
  onOpenLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory,
  score,
  earnedStars,
  movesLeft,
  currentLevel,
  hasNextLevel,
  objectives,
  onNextLevel,
  onRetry,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    if (isOpen && isVictory) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
      });
    }
  }, [isOpen, isVictory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-12 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
            isVictory ? 'bg-amber-500/30' : 'bg-rose-500/20'
          }`}
        />

        {/* Icon & Title */}
        {isVictory ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
              <Trophy className="w-9 h-9 text-slate-950" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tebrikler!
            </h2>
            <p className="text-sm text-amber-300 font-semibold mt-1">
              Bölüm {currentLevel} Başarıyla Tamamlandı
            </p>

            {/* Star Awards */}
            <div className="flex items-center gap-2 my-5">
              {[1, 2, 3].map((starNum) => (
                <div key={starNum} className="relative">
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 ${
                      starNum <= earnedStars
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                  {starNum <= earnedStars && (
                    <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Score & Moves summary */}
            <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 mb-6 flex justify-around">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Kazanılan Puan
                </span>
                <span className="text-2xl font-black text-white tabular-nums">
                  {score.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="w-px bg-slate-700/60" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Artan Hamle
                </span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">
                  +{movesLeft}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5">
              {hasNextLevel ? (
                <button
                  onClick={() => {
                    haptics.tap();
                    onNextLevel();
                  }}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Sonraki Bölüm</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : null}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    haptics.tap();
                    onRetry();
                  }}
                  className="flex-1 min-h-[44px] py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tekrar Oyna</span>
                </button>
                <button
                  onClick={() => {
                    haptics.tap();
                    onOpenLevelSelect();
                  }}
                  className="min-h-[44px] py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
                  title="Bölüm Listesi"
                >
                  <Grid className="w-4 h-4" />
                  <span>Bölümler</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg mb-4">
              <Frown className="w-9 h-9 text-rose-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hamleler Bitti!
            </h2>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Bu bölümdeki tüm hedefleri tamamlayamadın.
            </p>

            {/* Unfinished objectives recap */}
            {objectives && objectives.length > 0 && (
              <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 mb-6 text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Eksik Kalan Görevler:
                </span>
                <div className="flex flex-col gap-1.5">
                  {objectives.map((obj, i) => {
                    const remaining = Math.max(0, obj.target - obj.current);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{obj.label}</span>
                        {remaining > 0 ? (
                          <span className="text-rose-400 font-bold">{remaining} eksik</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">Tamamlandı</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={() => {
                  haptics.tap();
                  onRetry();
                }}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Tekrar Dene</span>
              </button>

              <button
                onClick={() => {
                  haptics.tap();
                  onOpenLevelSelect();
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
              >
                <Grid className="w-4 h-4" />
                <span>Bölüm Seçimine Dön</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
