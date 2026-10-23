export type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export type TileSpecial = 'none' | 'rocket_h' | 'rocket_v' | 'bomb' | 'rainbow';

export type ObstacleType = 'none' | 'ice' | 'crate';

export interface Tile {
  id: string;
  row: number;
  col: number;
  color: TileColor;
  special: TileSpecial;
  obstacle: ObstacleType;
  obstacleHp?: number;
  isPopping?: boolean;
  isSpawning?: boolean;
}

export type GameMode = 'levels' | 'zen' | 'timeAttack';

export interface LevelObjective {
  type: 'score' | 'collect_color' | 'clear_obstacle' | 'create_booster';
  color?: TileColor;
  obstacle?: ObstacleType;
  special?: TileSpecial;
  target: number;
  current: number;
  label: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  gridRows: number;
  gridCols: number;
  availableColors: TileColor[];
  moves: number;
  starScores: [number, number, number]; // 1, 2, 3 stars
  objectives: LevelObjective[];
  initialObstacles?: { row: number; col: number; type: ObstacleType; hp?: number }[];
  description: string;
}

export interface BoosterState {
  hammer: number;
  shuffle: number;
  bomb: number;
}

export interface PlayerProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  levelScores: Record<number, number>;
  zenHighScore: number;
  timeAttackHighScore: number;
  boosters: BoosterState;
  soundEnabled: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}
