import React from 'react';
import { X, Rocket, Bomb, Sparkles, Hammer, Shuffle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-xl font-bold text-white">Nasıl Oynanır?</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Renk Bulmaca taktikleri ve kuralları
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-sm text-slate-300">
          {/* Section 1 */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-black flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Eşleştir ve Patlat</h3>
              <p className="text-xs text-slate-400 mt-1">
                Yan yana veya üst üste duran en az 2 aynı renkli kareye dokunarak patlatın. Üstteki bloklar aşağı düşer ve yeni kombinasyonlar oluşturur.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col gap-3">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Özel Güçlendiriciler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col items-center text-center">
                <Rocket className="w-6 h-6 text-cyan-400 mb-1" />
                <span className="font-bold text-white text-xs">Roket (5+ Blok)</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Tüm satırı veya sütunu baştan sona siler.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col items-center text-center">
                <Bomb className="w-6 h-6 text-amber-400 mb-1" />
                <span className="font-bold text-white text-xs">Bomba (7+ Blok)</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  3x3 genişlikte büyük bir patlama yapar.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col items-center text-center">
                <Sparkles className="w-6 h-6 text-purple-400 mb-1" />
                <span className="font-bold text-white text-xs">Prizma (9+ Blok)</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Sahadaki tüm o renkteki kareleri yok eder.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col gap-2.5">
            <h3 className="font-bold text-white text-base">Engelleri Temizle</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold shrink-0">
                ❄
              </div>
              <div>
                <span className="font-semibold text-white block">Buz Blokları</span>
                <span className="text-slate-400">
                  Buzun komşusu olan blokları patlatarak buzu eritin.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs mt-1">
              <div className="w-8 h-8 rounded-lg bg-amber-800/40 border border-amber-600/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
                📦
              </div>
              <div>
                <span className="font-semibold text-white block">Ahşap Sandıklar</span>
                <span className="text-slate-400">
                  Sandıkların yanında patlama veya roket/bomba kullanarak parçalayın.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Hammer className="w-4 h-4 text-amber-400" />
              <span>
                <strong>Çekiç:</strong> Tek blok kırar
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-indigo-400" />
              <span>
                <strong>Karıştır:</strong> Tahtayı yeniler
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition-colors"
          >
            Anladım, Oyna!
          </button>
        </div>
      </div>
    </div>
  );
};
