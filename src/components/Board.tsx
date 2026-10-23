import React, { useState } from 'react';
import { Tile, TileSpecial, FloatingText } from '../types/game';
import { COLOR_CONFIG } from '../utils/theme';
import { findConnectedCluster, determineBooster } from '../utils/boardLogic';
import { Rocket, Bomb, Sparkles, Hammer } from 'lucide-react';

interface BoardProps {
  board: (Tile | null)[][];
  onTileClick: (r: number, c: number) => void;
  activeBoosterTool: 'none' | 'hammer' | 'bomb';
  floatingTexts: FloatingText[];
  isLocked?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onTileClick,
  activeBoosterTool,
  floatingTexts,
  isLocked = false,
}) => {
  const [hoveredCoords, setHoveredCoords] = useState<{ r: number; c: number } | null>(null);

  const rows = board.length;
  const cols = board[0]?.length || 8;

  // Calculate highlighted cluster if hovering
  let highlightedKeys = new Set<string>();
  let predictedBooster: TileSpecial = 'none';
  let clusterSize = 0;

  if (hoveredCoords && !isLocked && activeBoosterTool === 'none') {
    const { r, c } = hoveredCoords;
    const hoverTile = board[r]?.[c];
    if (hoverTile) {
      if (hoverTile.special !== 'none') {
        highlightedKeys.add(`${r},${c}`);
      } else if (hoverTile.obstacle === 'none') {
        const cluster = findConnectedCluster(board, r, c);
        if (cluster.length >= 2) {
          cluster.forEach(p => highlightedKeys.add(`${p.r},${p.c}`));
          clusterSize = cluster.length;
          predictedBooster = determineBooster(cluster.length);
        }
      }
    }
  }

  return (
    <div className="relative w-full max-w-[min(94vw,440px)] sm:max-w-[480px] aspect-square mx-auto p-1.5 sm:p-3 bg-slate-900/90 rounded-2xl md:rounded-3xl border-2 border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none touch-manipulation">
      {/* Active Booster Prompt Banner */}
      {activeBoosterTool !== 'none' && (
        <div className="absolute -top-10 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 animate-bounce z-20">
          {activeBoosterTool === 'hammer' ? (
            <>
              <Hammer className="w-3.5 h-3.5" />
              <span>Kırmak istediğin bloğa dokun</span>
            </>
          ) : (
            <>
              <Bomb className="w-3.5 h-3.5" />
              <span>Bomba bırakmak istediğin yere dokun</span>
            </>
          )}
        </div>
      )}

      {/* Cluster Size & Booster Preview Floating Tooltip */}
      {hoveredCoords && clusterSize >= 2 && activeBoosterTool === 'none' && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-800/95 border border-slate-600 text-xs font-bold text-white shadow-md flex items-center gap-1.5 z-20 pointer-events-none"
        >
          <span>{clusterSize} Blok</span>
          {predictedBooster === 'rocket_h' || predictedBooster === 'rocket_v' ? (
            <span className="text-amber-300 flex items-center gap-0.5">
              + <Rocket className="w-3 h-3" /> Roket!
            </span>
          ) : predictedBooster === 'bomb' ? (
            <span className="text-rose-300 flex items-center gap-0.5">
              + <Bomb className="w-3 h-3" /> Bomba!
            </span>
          ) : predictedBooster === 'rainbow' ? (
            <span className="text-purple-300 flex items-center gap-0.5">
              + <Sparkles className="w-3 h-3" /> Gökkuşağı!
            </span>
          ) : null}
        </div>
      )}

      {/* Grid Canvas */}
      <div
        className="w-full h-full grid gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setHoveredCoords(null)}
      >
        {board.map((rowArr, r) =>
          rowArr.map((tile, c) => {
            if (!tile) {
              return <div key={`empty_${r}_${c}`} className="w-full h-full" />;
            }

            const isHighlighted = highlightedKeys.has(`${r},${c}`);
            const colorDef = COLOR_CONFIG[tile.color];
            const isObstacle = tile.obstacle !== 'none';

            return (
              <button
                key={tile.id}
                onClick={() => onTileClick(r, c)}
                onMouseEnter={() => setHoveredCoords({ r, c })}
                onTouchStart={() => setHoveredCoords({ r, c })}
                disabled={isLocked}
                className={`relative w-full h-full rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-150 flex items-center justify-center overflow-hidden outline-none touch-manipulation ${
                  activeBoosterTool !== 'none'
                    ? 'cursor-crosshair'
                    : isObstacle
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                } ${
                  tile.isPopping ? 'animate-pop-out' : tile.isSpawning ? 'animate-tile-land' : ''
                } ${
                  isHighlighted
                    ? 'scale-105 brightness-115 z-10 shadow-lg'
                    : 'hover:brightness-105 active:scale-95'
                }`}
                style={{
                  boxShadow: isHighlighted ? `0 0 16px ${colorDef.glow}` : undefined,
                }}
                aria-label={`${colorDef.labelTr} kare (${r + 1}, ${c + 1})`}
              >
                {/* Regular Color Cube Background with 3D Bevel */}
                <div
                  className={`absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl border-t border-l border-white/35 border-b-2 border-r-2 border-black/40 ${colorDef.bg}`}
                />

                {/* Inner Top-Left Gloss Highlight */}
                <div className="absolute top-0.5 left-0.5 right-1 h-1/3 bg-gradient-to-b from-white/35 to-transparent rounded-t-lg pointer-events-none" />

                {/* Accessible Center Symbol */}
                {tile.special === 'none' && !isObstacle && (
                  <span className="relative text-white/75 font-black text-xs sm:text-base md:text-lg select-none drop-shadow-sm">
                    {colorDef.symbol}
                  </span>
                )}

                {/* Special Booster Icons */}
                {tile.special === 'rocket_h' && (
                  <div className="relative z-10 flex items-center justify-center w-full h-full bg-slate-950/40 rounded-lg sm:rounded-xl">
                    <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] rotate-90" />
                    <div className="absolute inset-x-0 h-0.5 bg-cyan-300 animate-pulse" />
                  </div>
                )}

                {tile.special === 'rocket_v' && (
                  <div className="relative z-10 flex items-center justify-center w-full h-full bg-slate-950/40 rounded-lg sm:rounded-xl">
                    <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <div className="absolute inset-y-0 w-0.5 bg-cyan-300 animate-pulse" />
                  </div>
                )}

                {tile.special === 'bomb' && (
                  <div className="relative z-10 flex items-center justify-center w-full h-full bg-slate-950/40 rounded-lg sm:rounded-xl">
                    <div className="relative">
                      <Bomb className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300 animate-pulse-glow drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    </div>
                  </div>
                )}

                {tile.special === 'rainbow' && (
                  <div className="relative z-10 flex items-center justify-center w-full h-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 rounded-lg sm:rounded-xl animate-pulse">
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  </div>
                )}

                {/* Obstacle Overlays */}
                {tile.obstacle === 'ice' && (
                  <div className="absolute inset-0 bg-cyan-200/50 backdrop-blur-[2px] border-2 border-cyan-100/80 rounded-lg sm:rounded-xl flex items-center justify-center z-10 shadow-inner">
                    <span className="text-cyan-900 font-black text-xs sm:text-sm drop-shadow">
                      ❄
                    </span>
                  </div>
                )}

                {tile.obstacle === 'crate' && (
                  <div className="absolute inset-0 bg-amber-800 border-2 border-amber-950 rounded-lg sm:rounded-xl flex items-center justify-center z-10 shadow-md">
                    <div className="w-full h-full border border-amber-600/40 flex items-center justify-center">
                      <span className="text-amber-200 font-bold text-xs sm:text-sm tracking-tighter">
                        📦
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Floating Animated Score Text Particles */}
      {floatingTexts.map(f => (
        <div
          key={f.id}
          className="absolute pointer-events-none font-black text-sm sm:text-base md:text-lg animate-float-up z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            color: f.color,
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
};
