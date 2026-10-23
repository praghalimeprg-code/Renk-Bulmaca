/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, Tile, TileColor, PlayerProgress, LevelObjective, FloatingText } from './types/game';
import { LEVELS } from './utils/levelData';
import {
  createInitialBoard,
  popTile,
  applyGravityAndRefill,
  shuffleBoard,
  hasAnyValidMoves,
} from './utils/boardLogic';
import { sound } from './utils/audio';
import { haptics } from './utils/haptics';
import { Header } from './components/Header';
import { Hud } from './components/Hud';
import { BoosterBar } from './components/BoosterBar';
import { Board } from './components/Board';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const STORAGE_KEY = 'renk_bulmaca_player_data_v1';
const ALL_COLORS: TileColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const DEFAULT_PROGRESS: PlayerProgress = {
  unlockedLevel: 1,
  levelStars: {},
  levelScores: {},
  zenHighScore: 0,
  timeAttackHighScore: 0,
  boosters: { hammer: 5, shuffle: 4, bomb: 4 },
  soundEnabled: true,
};

export default function App() {
  // Load progress from localStorage
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  // Sync sound controller
  useEffect(() => {
    sound.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Game state
  const [gameMode, setGameMode] = useState<GameMode>('levels');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [board, setBoard] = useState<(Tile | null)[][]>([]);
  const [movesLeft, setMovesLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [objectives, setObjectives] = useState<LevelObjective[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeBooster, setActiveBooster] = useState<'none' | 'hammer' | 'bomb'>('none');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [undoStack, setUndoStack] = useState<{ board: (Tile | null)[][]; score: number }[]>([]);

  // Time Attack state
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isVictory: boolean;
  }>({ isOpen: false, isVictory: false });

  // Combo reset timer ref
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Current level config
  const levelConfig = LEVELS.find(l => l.id === currentLevel) || LEVELS[0];

  // Initialize or restart board
  const startLevel = useCallback((lvlId: number) => {
    const config = LEVELS.find(l => l.id === lvlId) || LEVELS[0];
    const initialBoard = createInitialBoard(
      config.gridRows,
      config.gridCols,
      config.availableColors,
      config.initialObstacles
    );

    setBoard(initialBoard);
    setCurrentLevel(lvlId);
    setMovesLeft(config.moves);
    setScore(0);
    setCombo(1);
    setObjectives(config.objectives.map(o => ({ ...o, current: 0 })));
    setIsLocked(false);
    setActiveBooster('none');
    setFloatingTexts([]);
    setGameOverModal({ isOpen: false, isVictory: false });
    setUndoStack([]);
  }, []);

  const startZenMode = useCallback(() => {
    const initialBoard = createInitialBoard(8, 8, ALL_COLORS);
    setBoard(initialBoard);
    setMovesLeft(999);
    setScore(0);
    setCombo(1);
    setObjectives([]);
    setIsLocked(false);
    setActiveBooster('none');
    setFloatingTexts([]);
    setGameOverModal({ isOpen: false, isVictory: false });
    setUndoStack([]);
    setIsTimerRunning(false);
  }, []);

  const startTimeAttack = useCallback(() => {
    const initialBoard = createInitialBoard(8, 8, ALL_COLORS.slice(0, 5));
    setBoard(initialBoard);
    setScore(0);
    setCombo(1);
    setTimeLeft(60);
    setIsTimerRunning(true);
    setObjectives([]);
    setIsLocked(false);
    setActiveBooster('none');
    setFloatingTexts([]);
    setGameOverModal({ isOpen: false, isVictory: false });
    setUndoStack([]);
  }, []);

  // Handle mode switches
  const handleSelectMode = (mode: GameMode) => {
    sound.playClick();
    haptics.tap();
    setGameMode(mode);
    if (mode === 'levels') {
      startLevel(currentLevel);
      setIsTimerRunning(false);
    } else if (mode === 'zen') {
      startZenMode();
    } else if (mode === 'timeAttack') {
      startTimeAttack();
    }
  };

  // Initial load
  useEffect(() => {
    startLevel(progress.unlockedLevel || 1);
  }, [startLevel, progress.unlockedLevel]);

  // Timer countdown for Time Attack mode
  useEffect(() => {
    if (gameMode !== 'timeAttack' || !isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          // End of time attack
          sound.playVictory();
          haptics.victory();
          setGameOverModal({ isOpen: true, isVictory: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, isTimerRunning]);

  // Helper to trigger floating text
  const addFloatingText = (text: string, xPercent: number, yPercent: number, color: string = '#FBBF24') => {
    const id = `f_${Date.now()}_${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, x: xPercent, y: yPercent, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id));
    }, 800);
  };

  // Handle tile click
  const handleTileClick = (r: number, c: number) => {
    if (isLocked) return;

    const currentTile = board[r]?.[c];
    if (!currentTile) return;

    // 1. TOOL: HAMMER
    if (activeBooster === 'hammer') {
      sound.playBomb();
      haptics.explosion();
      setActiveBooster('none');
      setProgress(p => ({
        ...p,
        boosters: { ...p.boosters, hammer: Math.max(0, p.boosters.hammer - 1) },
      }));

      addFloatingText('ÇEKİÇ!', (c / board[0].length) * 100, (r / board.length) * 100, '#F59E0B');

      // Erase tile
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = null;
      setBoard(newBoard);

      // Check obstacle
      if (currentTile.obstacle !== 'none') {
        updateObjectivesForPop([], [{ type: currentTile.obstacle }]);
      }

      setIsLocked(true);
      setTimeout(() => {
        const refilled = applyGravityAndRefill(newBoard, levelConfig.availableColors, true);
        setBoard(refilled);
        setIsLocked(false);
      }, 200);
      return;
    }

    // 2. TOOL: PLACE BOMB
    if (activeBooster === 'bomb') {
      sound.playClick();
      haptics.tap();
      setActiveBooster('none');
      setProgress(p => ({
        ...p,
        boosters: { ...p.boosters, bomb: Math.max(0, p.boosters.bomb - 1) },
      }));

      // Turn tile into a bomb
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = {
        ...currentTile,
        special: 'bomb',
        obstacle: 'none',
      };
      setBoard(newBoard);
      addFloatingText('BOMBA!', (c / board[0].length) * 100, (r / board.length) * 100, '#EF4444');
      return;
    }

    // 3. REGULAR POP ATTEMPT
    const popResult = popTile(board, r, c);
    if (!popResult) {
      sound.playClick();
      return;
    }

    // Save undo in Zen mode
    if (gameMode === 'zen') {
      setUndoStack(prev => [...prev.slice(-10), { board, score }]);
    }

    // Play appropriate sound & mobile haptics
    if (popResult.triggerType === 'rocket_h' || popResult.triggerType === 'rocket_v') {
      sound.playRocket();
      haptics.explosion();
      addFloatingText('ROKET!', (c / board[0].length) * 100, (r / board.length) * 100, '#38BDF8');
    } else if (popResult.triggerType === 'bomb') {
      sound.playBomb();
      haptics.explosion();
      addFloatingText('GÜM!', (c / board[0].length) * 100, (r / board.length) * 100, '#F43F5E');
    } else if (popResult.triggerType === 'rainbow') {
      sound.playRainbow();
      haptics.explosion();
      addFloatingText('PRİZMA!', (c / board[0].length) * 100, (r / board.length) * 100, '#C084FC');
    } else {
      sound.playPop(combo);
      if (combo >= 2) {
        haptics.combo();
      } else {
        haptics.tap();
      }

      // Combo praise text
      const praiseWords = ['GÜZEL!', 'HARİKA!', 'MÜKEMMEL!', 'EFSANE!', 'SÜPER!'];
      if (combo >= 3) {
        const word = praiseWords[Math.min(combo - 3, praiseWords.length - 1)];
        addFloatingText(word, (c / board[0].length) * 100, (r / board.length) * 100, '#FBBF24');
      } else {
        addFloatingText(`+${popResult.scoreGained}`, (c / board[0].length) * 100, (r / board.length) * 100, '#FFFFFF');
      }
    }

    // Update combo streak
    setCombo(prev => Math.min(prev + 1, 10));
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(1);
    }, 2800);

    // Bonus time for Time Attack mode
    if (gameMode === 'timeAttack') {
      const bonusSeconds = Math.min(3, Math.floor(popResult.poppedTiles.length / 3));
      setTimeLeft(prev => Math.min(99, prev + bonusSeconds));
    }

    // Decrement moves in Levels mode
    const newMovesLeft = gameMode === 'levels' ? Math.max(0, movesLeft - 1) : movesLeft;
    if (gameMode === 'levels') {
      setMovesLeft(newMovesLeft);
    }

    // Accumulate score
    const newScore = score + popResult.scoreGained * (gameMode === 'zen' ? combo : 1);
    setScore(newScore);

    // Update level objectives
    const updatedObjectives = updateObjectivesForPop(
      popResult.poppedTiles,
      popResult.brokenObstacles,
      popResult.createdBooster?.special,
      newScore
    );

    // Update board with popped tiles disappearing
    setBoard(popResult.newBoard);
    setIsLocked(true);

    // Step 2: Gravity Drop and Refill
    setTimeout(() => {
      const availableColors: TileColor[] =
        gameMode === 'levels'
          ? levelConfig.availableColors
          : ALL_COLORS;

      const refilledBoard = applyGravityAndRefill(popResult.newBoard, availableColors, true);

      // Check if board has valid moves; if not, auto-shuffle
      let finalBoard = refilledBoard;
      if (!hasAnyValidMoves(finalBoard)) {
        finalBoard = shuffleBoard(finalBoard, availableColors);
        addFloatingText('Otomatik Karıştırıldı!', 50, 50, '#818CF8');
      }

      setBoard(finalBoard);
      setIsLocked(false);

      // Check win/loss conditions for Levels mode
      if (gameMode === 'levels') {
        const allCompleted = updatedObjectives.every(obj => obj.current >= obj.target);

        if (allCompleted) {
          // VICTORY!
          handleVictory(newScore, newMovesLeft);
        } else if (newMovesLeft <= 0) {
          // DEFEAT!
          sound.playDefeat();
          setGameOverModal({ isOpen: true, isVictory: false });
        }
      }
    }, 220);
  };

  // Helper to update objective counts
  const updateObjectivesForPop = (
    popped: { color: string }[],
    broken: { type: string }[],
    specialCreated?: string,
    currentScore?: number
  ): LevelObjective[] => {
    if (gameMode !== 'levels') return [];

    const updated = objectives.map(obj => {
      let increment = 0;
      if (obj.type === 'collect_color' && obj.color) {
        increment = popped.filter(p => p.color === obj.color).length;
      } else if (obj.type === 'clear_obstacle' && obj.obstacle) {
        increment = broken.filter(b => b.type === obj.obstacle).length;
      } else if (obj.type === 'create_booster') {
        if (specialCreated && (obj.special ? specialCreated === obj.special : true)) {
          increment = 1;
        }
      } else if (obj.type === 'score') {
        return {
          ...obj,
          current: currentScore ?? score,
        };
      }

      return {
        ...obj,
        current: Math.min(obj.target, obj.current + increment),
      };
    });

    setObjectives(updated);
    return updated;
  };

  // Handle victory rewards and unlocked levels
  const handleVictory = (finalScore: number, remainingMoves: number) => {
    sound.playVictory();
    haptics.victory();

    // Bonus for remaining moves
    const bonus = remainingMoves * 300;
    const totalFinalScore = finalScore + bonus;
    setScore(totalFinalScore);

    // Calculate stars
    const starScores = levelConfig.starScores;
    const earned =
      totalFinalScore >= starScores[2]
        ? 3
        : totalFinalScore >= starScores[1]
        ? 2
        : 1;

    // Update progress in localStorage
    setProgress(p => {
      const currentBestStars = p.levelStars[currentLevel] || 0;
      const currentBestScore = p.levelScores[currentLevel] || 0;
      const nextUnlocked = Math.max(p.unlockedLevel, Math.min(LEVELS.length, currentLevel + 1));

      return {
        ...p,
        unlockedLevel: nextUnlocked,
        levelStars: {
          ...p.levelStars,
          [currentLevel]: Math.max(currentBestStars, earned),
        },
        levelScores: {
          ...p.levelScores,
          [currentLevel]: Math.max(currentBestScore, totalFinalScore),
        },
        boosters: {
          hammer: p.boosters.hammer + (currentLevel % 5 === 0 ? 1 : 0),
          shuffle: p.boosters.shuffle + (currentLevel % 5 === 0 ? 1 : 0),
          bomb: p.boosters.bomb + (currentLevel % 5 === 0 ? 1 : 0),
        },
      };
    });

    setGameOverModal({ isOpen: true, isVictory: true });
  };

  // Handle next level click
  const handleNextLevel = () => {
    const nextLvl = currentLevel + 1;
    if (nextLvl <= LEVELS.length) {
      startLevel(nextLvl);
    } else {
      setIsLevelSelectOpen(true);
    }
  };

  // Handle Shuffle tool
  const handleUseShuffle = () => {
    if (progress.boosters.shuffle <= 0 || isLocked) return;
    sound.playClick();
    haptics.tap();

    const colors: TileColor[] =
      gameMode === 'levels'
        ? levelConfig.availableColors
        : ALL_COLORS;

    const shuffled = shuffleBoard(board, colors);
    setBoard(shuffled);
    setProgress(p => ({
      ...p,
      boosters: { ...p.boosters, shuffle: Math.max(0, p.boosters.shuffle - 1) },
    }));
    addFloatingText('KARIŞTIRILDI!', 50, 50, '#818CF8');
  };

  // Handle Undo in Zen mode
  const handleUndo = () => {
    if (undoStack.length === 0 || isLocked) return;
    sound.playClick();
    haptics.tap();
    const last = undoStack[undoStack.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setUndoStack(prev => prev.slice(0, -1));
  };

  // High score tracking for Zen / Time Attack
  const totalStars = Object.values(progress.levelStars).reduce((acc, s) => acc + s, 0);
  const currentHighScore =
    gameMode === 'levels'
      ? progress.levelScores[currentLevel] || 0
      : gameMode === 'zen'
      ? progress.zenHighScore
      : progress.timeAttackHighScore;

  useEffect(() => {
    if (gameMode === 'zen' && score > progress.zenHighScore) {
      setProgress(p => ({ ...p, zenHighScore: score }));
    }
    if (gameMode === 'timeAttack' && score > progress.timeAttackHighScore) {
      setProgress(p => ({ ...p, timeAttackHighScore: score }));
    }
  }, [score, gameMode, progress.zenHighScore, progress.timeAttackHighScore]);

  return (
    <div className="min-h-[100dvh] h-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white overscroll-none">
      {/* Top Bar */}
      <Header
        gameMode={gameMode}
        onSelectMode={handleSelectMode}
        soundEnabled={progress.soundEnabled}
        onToggleSound={() => setProgress(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        currentLevel={currentLevel}
        totalStars={totalStars}
      />

      {/* Main Game Stage (padded at bottom for Mobile Bottom Nav) */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-4xl mx-auto w-full pb-20 sm:pb-4">
        {/* HUD Area */}
        <Hud
          gameMode={gameMode}
          levelNumber={currentLevel}
          movesLeft={movesLeft}
          score={score}
          highScore={currentHighScore}
          starScores={gameMode === 'levels' ? levelConfig.starScores : undefined}
          objectives={gameMode === 'levels' ? objectives : undefined}
          combo={combo}
          timeLeft={timeLeft}
        />

        {/* Board Component */}
        <div className="w-full flex justify-center my-1 sm:my-2">
          <Board
            board={board}
            onTileClick={handleTileClick}
            activeBoosterTool={activeBooster}
            floatingTexts={floatingTexts}
            isLocked={isLocked}
          />
        </div>

        {/* Booster Controls */}
        <BoosterBar
          gameMode={gameMode}
          boosters={progress.boosters}
          activeBooster={activeBooster}
          onSelectBooster={tool => {
            sound.playClick();
            haptics.tap();
            setActiveBooster(tool);
          }}
          onUseShuffle={handleUseShuffle}
          onRestart={() => {
            sound.playClick();
            haptics.tap();
            if (gameMode === 'levels') startLevel(currentLevel);
            else if (gameMode === 'zen') startZenMode();
            else startTimeAttack();
          }}
          canUndo={undoStack.length > 0}
          onUndo={handleUndo}
          disabled={isLocked}
        />
      </main>

      {/* Subtle Desktop Footer */}
      <footer className="hidden sm:block py-2 px-4 text-center text-xs text-slate-600 border-t border-slate-900">
        <span>Renk Bulmaca · Klasik Mobil Kare Eşleştirme Oyunu</span>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (100% Mobile App Ergonomics) */}
      <MobileBottomNav
        gameMode={gameMode}
        onSelectMode={handleSelectMode}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        currentLevel={currentLevel}
      />

      {/* Modals */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        unlockedLevel={progress.unlockedLevel}
        levelStars={progress.levelStars}
        levelScores={progress.levelScores}
        currentLevel={currentLevel}
        onSelectLevel={lvl => startLevel(lvl)}
      />

      <GameOverModal
        isOpen={gameOverModal.isOpen}
        isVictory={gameOverModal.isVictory}
        score={score}
        earnedStars={
          levelConfig.starScores
            ? score >= levelConfig.starScores[2]
              ? 3
              : score >= levelConfig.starScores[1]
              ? 2
              : 1
            : 1
        }
        movesLeft={movesLeft}
        currentLevel={currentLevel}
        hasNextLevel={currentLevel < LEVELS.length}
        objectives={objectives}
        onNextLevel={handleNextLevel}
        onRetry={() => startLevel(currentLevel)}
        onOpenLevelSelect={() => {
          setGameOverModal({ isOpen: false, isVictory: false });
          setIsLevelSelectOpen(true);
        }}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
