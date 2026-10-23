import { LevelConfig, TileColor, ObstacleType } from '../types/game';

const ALL_COLORS: TileColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "İlk Adım",
    description: "Aynı renkteki en az 2 kareye dokunarak patlat!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow'],
    moves: 20,
    starScores: [1500, 3000, 5000],
    objectives: [
      { type: 'collect_color', color: 'red', target: 12, current: 0, label: 'Kırmızı Blok' },
      { type: 'collect_color', color: 'blue', target: 12, current: 0, label: 'Mavi Blok' },
    ],
  },
  {
    id: 2,
    name: "Roket Gücü",
    description: "5 veya daha fazla kareyi tek seferde patlatıp Roket oluştur!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow'],
    moves: 18,
    starScores: [2000, 4000, 6500],
    objectives: [
      { type: 'collect_color', color: 'green', target: 16, current: 0, label: 'Yeşil Blok' },
      { type: 'create_booster', special: 'rocket_h', target: 2, current: 0, label: 'Roket Oluştur' },
    ],
  },
  {
    id: 3,
    name: "Bomba Zamanı",
    description: "7+ kareyi birleştirip 3x3 patlama yapan Bomba elde et!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow', 'purple'],
    moves: 20,
    starScores: [2500, 5000, 8000],
    objectives: [
      { type: 'collect_color', color: 'yellow', target: 18, current: 0, label: 'Sarı Blok' },
      { type: 'collect_color', color: 'purple', target: 15, current: 0, label: 'Mor Blok' },
    ],
  },
  {
    id: 4,
    name: "Buzları Kır",
    description: "Buzlu karelerin yanındaki blokları patlatarak buzları temizle!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow'],
    moves: 22,
    starScores: [3000, 6000, 9000],
    objectives: [
      { type: 'clear_obstacle', obstacle: 'ice', target: 8, current: 0, label: 'Buz Kır' },
    ],
    initialObstacles: [
      { row: 3, col: 2, type: 'ice' },
      { row: 3, col: 3, type: 'ice' },
      { row: 3, col: 4, type: 'ice' },
      { row: 3, col: 5, type: 'ice' },
      { row: 4, col: 2, type: 'ice' },
      { row: 4, col: 3, type: 'ice' },
      { row: 4, col: 4, type: 'ice' },
      { row: 4, col: 5, type: 'ice' },
    ],
  },
  {
    id: 5,
    name: "Gökkuşağı Prizması",
    description: "9+ kare patlatıp sahadaki tüm aynı renkleri silen prizmayı kazan!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow', 'purple'],
    moves: 20,
    starScores: [3500, 7000, 11000],
    objectives: [
      { type: 'collect_color', color: 'red', target: 20, current: 0, label: 'Kırmızı Blok' },
      { type: 'create_booster', special: 'rainbow', target: 1, current: 0, label: 'Gökkuşağı Oluştur' },
    ],
  },
  {
    id: 6,
    name: "Ahşap Sandıklar",
    description: "Sandıkları kırmak için yanlarında patlama yap!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow'],
    moves: 22,
    starScores: [3000, 6500, 10000],
    objectives: [
      { type: 'clear_obstacle', obstacle: 'crate', target: 6, current: 0, label: 'Sandık Kır' },
      { type: 'collect_color', color: 'blue', target: 15, current: 0, label: 'Mavi Blok' },
    ],
    initialObstacles: [
      { row: 2, col: 3, type: 'crate', hp: 1 },
      { row: 2, col: 4, type: 'crate', hp: 1 },
      { row: 4, col: 3, type: 'crate', hp: 1 },
      { row: 4, col: 4, type: 'crate', hp: 1 },
      { row: 6, col: 3, type: 'crate', hp: 1 },
      { row: 6, col: 4, type: 'crate', hp: 1 },
    ],
  },
  {
    id: 7,
    name: "Turuncu Işıltı",
    description: "Yeni turuncu bloklarla hedefleri topla!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'orange'],
    moves: 20,
    starScores: [3200, 6800, 10500],
    objectives: [
      { type: 'collect_color', color: 'orange', target: 22, current: 0, label: 'Turuncu Blok' },
      { type: 'collect_color', color: 'green', target: 18, current: 0, label: 'Yeşil Blok' },
    ],
  },
  {
    id: 8,
    name: "Buz Tarlası",
    description: "Köşelerdeki buzları rokete veya bombaya hedef alarak erit!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'green', 'yellow'],
    moves: 24,
    starScores: [4000, 8000, 12000],
    objectives: [
      { type: 'clear_obstacle', obstacle: 'ice', target: 12, current: 0, label: 'Buz Kır' },
    ],
    initialObstacles: [
      { row: 0, col: 0, type: 'ice' }, { row: 0, col: 1, type: 'ice' },
      { row: 1, col: 0, type: 'ice' }, { row: 1, col: 1, type: 'ice' },
      { row: 0, col: 6, type: 'ice' }, { row: 0, col: 7, type: 'ice' },
      { row: 1, col: 6, type: 'ice' }, { row: 1, col: 7, type: 'ice' },
      { row: 6, col: 3, type: 'ice' }, { row: 6, col: 4, type: 'ice' },
      { row: 7, col: 3, type: 'ice' }, { row: 7, col: 4, type: 'ice' },
    ],
  },
  {
    id: 9,
    name: "Renk Patlaması",
    description: "Yüksek puan toplayarak 3 yıldıza ulaş!",
    gridRows: 8,
    gridCols: 8,
    availableColors: ['red', 'blue', 'yellow', 'purple', 'orange'],
    moves: 22,
    starScores: [5000, 9000, 14000],
    objectives: [
      { type: 'score', target: 9000, current: 0, label: 'Hedef Puan' },
      { type: 'collect_color', color: 'purple', target: 20, current: 0, label: 'Mor Blok' },
    ],
  },
  {
    id: 10,
    name: "İlk Usta Sınavı",
    description: "Buzlar ve sandıklar bir arada! Büyük patlamalar hazırla.",
    gridRows: 8,
    gridCols: 8,
    availableColors: ALL_COLORS.slice(0, 5),
    moves: 25,
    starScores: [6000, 11000, 17000],
    objectives: [
      { type: 'clear_obstacle', obstacle: 'ice', target: 8, current: 0, label: 'Buz Kır' },
      { type: 'clear_obstacle', obstacle: 'crate', target: 8, current: 0, label: 'Sandık Kır' },
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'ice' }, { row: 2, col: 5, type: 'ice' },
      { row: 3, col: 2, type: 'ice' }, { row: 3, col: 5, type: 'ice' },
      { row: 4, col: 2, type: 'ice' }, { row: 4, col: 5, type: 'ice' },
      { row: 5, col: 2, type: 'ice' }, { row: 5, col: 5, type: 'ice' },
      { row: 3, col: 3, type: 'crate' }, { row: 3, col: 4, type: 'crate' },
      { row: 4, col: 3, type: 'crate' }, { row: 4, col: 4, type: 'crate' },
      { row: 1, col: 3, type: 'crate' }, { row: 1, col: 4, type: 'crate' },
      { row: 6, col: 3, type: 'crate' }, { row: 6, col: 4, type: 'crate' },
    ],
  },
];

// Generate levels 11 through 40 with increasing tactical variety
for (let i = 11; i <= 40; i++) {
  const colorCount = i > 30 ? 6 : i > 20 ? 5 : 4;
  const colors = ALL_COLORS.slice(0, colorCount);
  const moves = Math.max(18, 30 - Math.floor(i / 3));
  const baseScore = i * 650;

  // Decide level flavor
  const isObstacleHeavy = i % 3 === 0;
  const isColorChallenge = i % 3 === 1;

  const obstacles: { row: number; col: number; type: ObstacleType; hp?: number }[] = [];
  const objectives: LevelConfig['objectives'] = [];

  if (isObstacleHeavy) {
    const iceCount = Math.min(6 + Math.floor(i / 4), 16);
    const crateCount = Math.min(4 + Math.floor(i / 5), 12);

    for (let r = 2; r <= 5; r++) {
      for (let c = 2; c <= 5; c++) {
        if ((r + c + i) % 2 === 0 && obstacles.length < iceCount) {
          obstacles.push({ row: r, col: c, type: 'ice' });
        } else if (obstacles.length < iceCount + crateCount) {
          obstacles.push({ row: r, col: c, type: 'crate' });
        }
      }
    }

    objectives.push({
      type: 'clear_obstacle',
      obstacle: 'ice',
      target: obstacles.filter(o => o.type === 'ice').length || 6,
      current: 0,
      label: 'Buzları Temizle',
    });
    if (obstacles.some(o => o.type === 'crate')) {
      objectives.push({
        type: 'clear_obstacle',
        obstacle: 'crate',
        target: obstacles.filter(o => o.type === 'crate').length,
        current: 0,
        label: 'Sandıkları Temizle',
      });
    }
  } else if (isColorChallenge) {
    const c1 = colors[i % colors.length];
    const c2 = colors[(i + 1) % colors.length];
    objectives.push({
      type: 'collect_color',
      color: c1,
      target: 18 + Math.floor(i / 2),
      current: 0,
      label: `${c1.toUpperCase()} Topla`,
    });
    objectives.push({
      type: 'collect_color',
      color: c2,
      target: 15 + Math.floor(i / 2),
      current: 0,
      label: `${c2.toUpperCase()} Topla`,
    });
  } else {
    // Score + Booster combo
    objectives.push({
      type: 'score',
      target: baseScore * 1.5,
      current: 0,
      label: 'Yüksek Skor',
    });
    objectives.push({
      type: 'create_booster',
      special: i % 2 === 0 ? 'bomb' : 'rocket_h',
      target: 3,
      current: 0,
      label: i % 2 === 0 ? '3 Bomba Üret' : '3 Roket Üret',
    });
  }

  LEVELS.push({
    id: i,
    name: `Aşama ${i}`,
    description: `Seviye ${i} bulmaca görevi`,
    gridRows: 8,
    gridCols: 8,
    availableColors: colors,
    moves,
    starScores: [baseScore, Math.floor(baseScore * 1.8), Math.floor(baseScore * 2.8)],
    objectives,
    initialObstacles: obstacles.length > 0 ? obstacles : undefined,
  });
}
