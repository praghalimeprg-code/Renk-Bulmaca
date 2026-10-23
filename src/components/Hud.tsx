import React from 'react';
import { GameMode, LevelObjective } from '../types/game';
import { COLOR_CONFIG } from '../utils/theme';
import { Star, Check, Flame, Clock, Award } from 'lucide-react';

interface HudProps {
  gameMode: GameMode;
  levelNumber: number;
  movesLeft: number;
  score: number;
  highScore: number;
  starScores?: [number, number, number];
  objectives?: LevelObjective[];
  combo: number;
  timeLeft?: number;
}

export const Hud: React.FC<HudProps> = ({
  gameMode,
  levelNumber,
  movesLeft,
  score,
  highScore,
  starScores,
  objectives,
  combo,
  timeLeft,
}) => {
  // Calculate star progress
  const target3Stars = starScores ? starScores[2] : 10000;
  const progressPercent = Math.min(100, Math.floor((score / target3Stars) * 100));

  const earnedStars = starScores
    ? score >= starScores[2]
      ? 3
      : score >= starScores[1]
      ? 2
      : score >= starScores[0]
      ? 1
      : 0
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex flex-col gap-2.5">
      {/* Top Strip: Moves / Timer + Score + Combo */}
      <div className="grid grid-cols-3 items-center bg-slate-800/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-700/60 shadow-lg">
        {/* Left: Moves or Time */}
        <div className="flex flex-col items-center sm:items-start pl-1 sm:pl-3">
          {gameMode === 'levels' ? (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Kalan Hamle
              </span>
              <span
                className={`text-2xl md:text-3xl font-extrabold tabular-nums transition-colors ${
                  movesLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'
                }`}
              >
                {movesLeft}
              </span>
            </>
          ) : gameMode === 'timeAttack' ? (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Süre
              </span>
              <span
                className={`text-2xl md:text-3xl font-extrabold tabular-nums ${
                  (timeLeft || 0) <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
                }`}
              >
                {timeLeft}s
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Serbest Mod
              </span>
              <span className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center gap-1">
                ∞ Rahatla
              </span>
            </>
          )}
        </div>

        {/* Center: Score & Stars */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> Puan
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-amber-300 tabular-nums">
            {score.toLocaleString('tr-TR')}
          </span>

          {gameMode === 'levels' && starScores && (
            <div className="flex items-center gap-1 mt-0.5">
              {[0, 1, 2].map((idx) => (
                <Star
                  key={idx}
                  className={`w-3.5 h-3.5 transition-all ${
                    idx < earnedStars
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                      : 'text-slate-600 fill-transparent'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Combo or High Score */}
        <div className="flex flex-col items-center sm:items-end pr-1 sm:pr-3">
          {combo > 1 ? (
            <div className="flex flex-col items-end animate-bounce">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Seri!
              </span>
              <span className="text-xl md:text-2xl font-black text-orange-400">
                x{combo}
              </span>
            </div>
          ) : (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {gameMode === 'levels' ? `Bölüm ${levelNumber}` : 'En Yüksek'}
              </span>
              <span className="text-sm md:text-base font-bold text-slate-200 tabular-nums">
                {gameMode === 'levels'
                  ? 'Hedefleri Bitir'
                  : highScore.toLocaleString('tr-TR')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Level Star Progress Bar (for Levels mode) */}
      {gameMode === 'levels' && starScores && (
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Milestone markers for 1, 2, 3 stars */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
            style={{ left: `${(starScores[0] / starScores[2]) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
            style={{ left: `${(starScores[1] / starScores[2]) * 100}%` }}
          />
        </div>
      )}

      {/* Objectives Bar (for Levels mode) */}
      {gameMode === 'levels' && objectives && objectives.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2.5 py-1">
          {objectives.map((obj, i) => {
            const isCompleted = obj.current >= obj.target;
            const remaining = Math.max(0, obj.target - obj.current);

            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/90 border-slate-700/70 text-slate-200'
                }`}
              >
                {/* Visual target icon */}
                {obj.type === 'collect_color' && obj.color && (
                  <div
                    className={`w-4 h-4 rounded-md ${COLOR_CONFIG[obj.color].bg} flex items-center justify-center text-[9px] text-white font-black shadow-sm`}
                  >
                    {COLOR_CONFIG[obj.color].symbol}
                  </div>
                )}
                {obj.type === 'clear_obstacle' && (
                  <div className="w-4 h-4 rounded-md bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-[10px] text-cyan-200 font-bold">
                    {obj.obstacle === 'ice' ? '❄' : '📦'}
                  </div>
                )}
                {obj.type === 'create_booster' && (
                  <div className="w-4 h-4 rounded-md bg-purple-500/30 border border-purple-400/50 flex items-center justify-center text-[10px] text-purple-200 font-bold">
                    ⚡
                  </div>
                )}
                {obj.type === 'score' && (
                  <div className="text-amber-400 font-bold text-xs">★</div>
                )}

                <span className="text-xs font-semibold">{obj.label}:</span>

                {isCompleted ? (
                  <span className="flex items-center text-xs font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5 mr-0.5 stroke-[3]" /> Tamam
                  </span>
                ) : (
                  <span className="text-xs font-bold text-white tabular-nums">
                    {remaining} kaldı
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
