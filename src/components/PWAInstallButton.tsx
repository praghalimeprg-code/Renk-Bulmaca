import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'bottomNav' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Render trigger button depending on variant and platform
  const handleClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {variant === 'bottomNav' ? (
        <button
          onClick={handleClick}
          className="flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-2 text-rose-400 hover:text-rose-300 transition-colors"
          aria-label="Uygulamayı Telefona İndir"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <Download className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Yükle</span>
        </button>
      ) : variant === 'banner' ? (
        <div className="mx-4 my-2 p-3 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Telefona Yükle</h4>
              <p className="text-[11px] text-slate-400">Tam ekran ve internetsiz oyna</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 shrink-0 transition-transform active:scale-95"
          >
            Yükle
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors whitespace-nowrap min-h-[44px]"
          title="Uygulamayı Telefona Yükle"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Uygulama Yükle</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            {/* Grab handle for bottom sheet */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto -mt-2 mb-1" />

            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-rose-400" />
                iPhone / iPad'e Yükle
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Renk Bulmaca'yı ana ekranınıza ekleyip tam ekran mobil uygulama olarak oynayabilirsiniz:
            </p>

            <div className="flex flex-col gap-2.5 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <span>
                  1. Safari altındaki <strong>Paylaş</strong> simgesine dokunun.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span>
                  2. Listeyi kaydırıp <strong>Ana Ekrana Ekle</strong>'yi seçin.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Tamamdır
            </button>
          </div>
        </div>
      )}
    </>
  );
};
