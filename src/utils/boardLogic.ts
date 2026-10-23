import { Tile, TileColor, TileSpecial, ObstacleType } from '../types/game';

let tileCounter = 0;
export const getUniqueTileId = () => `tile_${++tileCounter}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

/**
 * Creates a balanced initial board
 */
export function createInitialBoard(
  rows: number,
  cols: number,
  availableColors: TileColor[],
  initialObstacles?: { row: number; col: number; type: ObstacleType; hp?: number }[]
): (Tile | null)[][] {
  const board: (Tile | null)[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowList: (Tile | null)[] = [];
    for (let c = 0; c < cols; c++) {
      const obstacleDef = initialObstacles?.find(o => o.row === r && o.col === c);
      const color = availableColors[Math.floor(Math.random() * availableColors.length)];

      rowList.push({
        id: getUniqueTileId(),
        row: r,
        col: c,
        color,
        special: 'none',
        obstacle: obstacleDef ? obstacleDef.type : 'none',
        obstacleHp: obstacleDef?.hp ?? (obstacleDef?.type === 'crate' ? 1 : obstacleDef?.type === 'ice' ? 1 : 0),
        isSpawning: false,
      });
    }
    board.push(rowList);
  }

  // Ensure at least 3 valid moves on board start
  if (!hasAnyValidMoves(board)) {
    return createInitialBoard(rows, cols, availableColors, initialObstacles);
  }

  return board;
}

/**
 * BFS algorithm to find all connected matching tiles
 */
export function findConnectedCluster(
  board: (Tile | null)[][],
  startR: number,
  startC: number
): { r: number; c: number }[] {
  const rows = board.length;
  const cols = board[0].length;
  const startTile = board[startR][startC];

  if (!startTile || startTile.obstacle !== 'none') return [];

  const targetColor = startTile.color;
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue: [number, number][] = [[startR, startC]];
  const cluster: { r: number; c: number }[] = [];

  visited[startR][startC] = true;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    cluster.push({ r: currR, c: currC });

    const neighbors = [
      [currR - 1, currC],
      [currR + 1, currC],
      [currR, currC - 1],
      [currR, currC + 1],
    ];

    for (const [nr, nc] of neighbors) {
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited[nr][nc]
      ) {
        const neighborTile = board[nr][nc];
        if (
          neighborTile &&
          neighborTile.obstacle === 'none' &&
          neighborTile.color === targetColor
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return cluster;
}

/**
 * Determines booster creation from cluster size
 */
export function determineBooster(size: number): TileSpecial {
  if (size >= 9) return 'rainbow';
  if (size >= 7) return 'bomb';
  if (size >= 5) {
    return Math.random() > 0.5 ? 'rocket_h' : 'rocket_v';
  }
  return 'none';
}

export interface PopResult {
  newBoard: (Tile | null)[][];
  poppedTiles: { r: number; c: number; color: TileColor; special: TileSpecial }[];
  brokenObstacles: { r: number; c: number; type: ObstacleType }[];
  createdBooster: { r: number; c: number; special: TileSpecial } | null;
  scoreGained: number;
  triggerType: 'cluster' | 'rocket_h' | 'rocket_v' | 'bomb' | 'rainbow' | 'none';
}

/**
 * Executes a pop or booster activation
 */
export function popTile(
  board: (Tile | null)[][],
  targetR: number,
  targetC: number
): PopResult | null {
  const rows = board.length;
  const cols = board[0].length;
  const tile = board[targetR][targetC];

  if (!tile) return null;

  // Clone board
  const newBoard: (Tile | null)[][] = board.map(row => row.map(cell => (cell ? { ...cell } : null)));
  const tilesToPop = new Map<string, { r: number; c: number; tile: Tile }>();
  const brokenObstacles: { r: number; c: number; type: ObstacleType }[] = [];
  let createdBooster: { r: number; c: number; special: TileSpecial } | null = null;
  let triggerType: PopResult['triggerType'] = 'none';

  // Helper to safely mark tile for pop
  const markPop = (r: number, c: number) => {
    const t = newBoard[r][c];
    if (t) {
      tilesToPop.set(`${r},${c}`, { r, c, tile: t });
    }
  };

  // Helper to damage adjacent obstacles
  const damageAdjacentObstacles = (r: number, c: number) => {
    const neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = newBoard[nr][nc];
        if (neighbor && neighbor.obstacle !== 'none') {
          neighbor.obstacleHp = (neighbor.obstacleHp || 1) - 1;
          if (neighbor.obstacleHp <= 0) {
            brokenObstacles.push({ r: nr, c: nc, type: neighbor.obstacle });
            neighbor.obstacle = 'none';
          }
        }
      }
    }
  };

  // 1. BOOSTER: ROCKET HORIZONTAL
  if (tile.special === 'rocket_h') {
    triggerType = 'rocket_h';
    for (let c = 0; c < cols; c++) {
      markPop(targetR, c);
      damageAdjacentObstacles(targetR, c);
    }
  }
  // 2. BOOSTER: ROCKET VERTICAL
  else if (tile.special === 'rocket_v') {
    triggerType = 'rocket_v';
    for (let r = 0; r < rows; r++) {
      markPop(r, targetC);
      damageAdjacentObstacles(r, targetC);
    }
  }
  // 3. BOOSTER: BOMB (3x3 explosion)
  else if (tile.special === 'bomb') {
    triggerType = 'bomb';
    for (let r = Math.max(0, targetR - 1); r <= Math.min(rows - 1, targetR + 1); r++) {
      for (let c = Math.max(0, targetC - 1); c <= Math.min(cols - 1, targetC + 1); c++) {
        markPop(r, c);
        damageAdjacentObstacles(r, c);
      }
    }
  }
  // 4. BOOSTER: RAINBOW PRISM
  else if (tile.special === 'rainbow') {
    triggerType = 'rainbow';
    markPop(targetR, targetC);
    const targetColor = tile.color;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const other = newBoard[r][c];
        if (other && other.color === targetColor) {
          markPop(r, c);
          damageAdjacentObstacles(r, c);
        }
      }
    }
  }
  // 5. REGULAR CLUSTER MATCH
  else {
    const cluster = findConnectedCluster(newBoard, targetR, targetC);
    if (cluster.length < 2) {
      return null; // Not enough connected tiles
    }

    triggerType = 'cluster';
    cluster.forEach(({ r, c }) => {
      markPop(r, c);
      damageAdjacentObstacles(r, c);
    });

    // Check if cluster produces a booster
    const booster = determineBooster(cluster.length);
    if (booster !== 'none') {
      createdBooster = { r: targetR, c: targetC, special: booster };
    }
  }

  // Clear popped cells from newBoard
  const poppedList: PopResult['poppedTiles'] = [];
  tilesToPop.forEach(({ r, c, tile: t }) => {
    poppedList.push({ r, c, color: t.color, special: t.special });
    newBoard[r][c] = null;
  });

  // If a booster was spawned at target, place it back on board
  if (createdBooster) {
    const { r, c, special } = createdBooster;
    newBoard[r][c] = {
      id: getUniqueTileId(),
      row: r,
      col: c,
      color: tile.color,
      special,
      obstacle: 'none',
      isSpawning: true,
    };
  }

  // Calculate score with combo multiplier
  const baseTileScore = 50;
  const multiplier = Math.max(1, Math.floor(poppedList.length / 3));
  const scoreGained = poppedList.length * baseTileScore * multiplier + brokenObstacles.length * 150;

  return {
    newBoard,
    poppedTiles: poppedList,
    brokenObstacles,
    createdBooster,
    scoreGained,
    triggerType,
  };
}

/**
 * Applies drop gravity to empty slots, followed by column consolidation and new tile refill
 */
export function applyGravityAndRefill(
  board: (Tile | null)[][],
  availableColors: TileColor[],
  refillTop: boolean = true
): (Tile | null)[][] {
  const rows = board.length;
  const cols = board[0].length;
  const nextBoard: (Tile | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

  // 1. Drop existing tiles to the bottom of each column
  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      const tile = board[r][c];
      if (tile !== null) {
        nextBoard[writeRow][c] = {
          ...tile,
          row: writeRow,
          col: c,
          isSpawning: false,
        };
        writeRow--;
      }
    }

    // 2. Refill empty spots at top if required
    if (refillTop) {
      while (writeRow >= 0) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        nextBoard[writeRow][c] = {
          id: getUniqueTileId(),
          row: writeRow,
          col: c,
          color: randomColor,
          special: 'none',
          obstacle: 'none',
          isSpawning: true,
        };
        writeRow--;
      }
    }
  }

  return nextBoard;
}

/**
 * Checks if at least one valid move exists on the board
 */
export function hasAnyValidMoves(board: (Tile | null)[][]): boolean {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = board[r][c];
      if (!tile || tile.obstacle !== 'none') continue;

      // Any special booster is always a valid move
      if (tile.special !== 'none') return true;

      // Check right neighbor
      if (c + 1 < cols) {
        const right = board[r][c + 1];
        if (right && right.obstacle === 'none' && right.color === tile.color) {
          return true;
        }
      }
      // Check down neighbor
      if (r + 1 < rows) {
        const down = board[r + 1][c];
        if (down && down.obstacle === 'none' && down.color === tile.color) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Shuffles tiles to ensure at least one match is available
 */
export function shuffleBoard(
  board: (Tile | null)[][],
  availableColors: TileColor[]
): (Tile | null)[][] {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard: (Tile | null)[][] = board.map(row => row.map(cell => (cell ? { ...cell } : null)));

  // Collect all colors from movable tiles
  const movableCoords: { r: number; c: number }[] = [];
  const colors: TileColor[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = newBoard[r][c];
      if (tile && tile.obstacle === 'none') {
        movableCoords.push({ r, c });
        colors.push(tile.color);
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }

  // Reassign shuffled colors
  movableCoords.forEach(({ r, c }, index) => {
    if (newBoard[r][c]) {
      newBoard[r][c]!.color = colors[index];
    }
  });

  // Verify at least one move exists; if not, force a pair
  if (!hasAnyValidMoves(newBoard) && movableCoords.length >= 2) {
    const first = movableCoords[0];
    const second = movableCoords.find(m => (m.r === first.r && Math.abs(m.c - first.c) === 1) || (m.c === first.c && Math.abs(m.r - first.r) === 1));
    if (second && newBoard[first.r][first.c] && newBoard[second.r][second.c]) {
      newBoard[second.r][second.c]!.color = newBoard[first.r][first.c]!.color;
    }
  }

  return newBoard;
}
