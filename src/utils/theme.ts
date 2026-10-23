import { TileColor } from '../types/game';

export interface ColorDef {
  bg: string;
  hoverBg: string;
  border: string;
  shadow: string;
  glow: string;
  textColor: string;
  labelTr: string;
  symbol: string;
}

export const COLOR_CONFIG: Record<TileColor, ColorDef> = {
  red: {
    bg: 'bg-gradient-to-br from-rose-500 to-red-600',
    hoverBg: 'hover:from-rose-400 hover:to-red-500',
    border: 'border-red-400/50',
    shadow: 'shadow-[0_4px_12px_rgba(239,68,68,0.35)]',
    glow: 'rgba(239, 68, 68, 0.6)',
    textColor: 'text-red-400',
    labelTr: 'Kırmızı',
    symbol: '♥',
  },
  blue: {
    bg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    hoverBg: 'hover:from-sky-400 hover:to-blue-500',
    border: 'border-sky-400/50',
    shadow: 'shadow-[0_4px_12px_rgba(59,130,246,0.35)]',
    glow: 'rgba(59, 130, 246, 0.6)',
    textColor: 'text-blue-400',
    labelTr: 'Mavi',
    symbol: '◆',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-400 to-green-600',
    hoverBg: 'hover:from-emerald-300 hover:to-green-500',
    border: 'border-emerald-300/50',
    shadow: 'shadow-[0_4px_12px_rgba(16,185,129,0.35)]',
    glow: 'rgba(16, 185, 129, 0.6)',
    textColor: 'text-emerald-400',
    labelTr: 'Yeşil',
    symbol: '♣',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-amber-300 to-yellow-500',
    hoverBg: 'hover:from-amber-200 hover:to-yellow-400',
    border: 'border-amber-200/50',
    shadow: 'shadow-[0_4px_12px_rgba(245,158,11,0.35)]',
    glow: 'rgba(245, 158, 11, 0.6)',
    textColor: 'text-amber-400',
    labelTr: 'Sarı',
    symbol: '★',
  },
  purple: {
    bg: 'bg-gradient-to-br from-fuchsia-500 to-purple-600',
    hoverBg: 'hover:from-fuchsia-400 hover:to-purple-500',
    border: 'border-purple-300/50',
    shadow: 'shadow-[0_4px_12px_rgba(139,92,246,0.35)]',
    glow: 'rgba(139, 92, 246, 0.6)',
    textColor: 'text-purple-400',
    labelTr: 'Mor',
    symbol: '▲',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-400 to-amber-600',
    hoverBg: 'hover:from-orange-300 hover:to-amber-500',
    border: 'border-orange-300/50',
    shadow: 'shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
    glow: 'rgba(249, 115, 22, 0.6)',
    textColor: 'text-orange-400',
    labelTr: 'Turuncu',
    symbol: '●',
  },
};
