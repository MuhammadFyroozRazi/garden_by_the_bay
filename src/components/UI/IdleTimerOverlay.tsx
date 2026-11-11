import React from 'react';
import { RotateCcw } from 'lucide-react';

interface IdleTimerOverlayProps {
  countdownSeconds: number;
  onDismiss: () => void;
  onResetNow: () => void;
}

export const IdleTimerOverlay: React.FC<IdleTimerOverlayProps> = ({
  countdownSeconds,
  onDismiss,
  onResetNow,
}) => {
  return (
    <div
      role="alert"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto bg-slate-900/95 border border-purple-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-sm border border-purple-500/40">
        {countdownSeconds}s
      </div>
      <div>
        <div className="text-xs sm:text-sm font-bold text-white">
          Exhibition Kiosk Inactivity Detected
        </div>
        <div className="text-[11px] text-slate-300">
          Resetting camera to Gardens by the Bay overview in {countdownSeconds} seconds
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDismiss}
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow"
        >
          Keep Exploring
        </button>
        <button
          onClick={onResetNow}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          Reset Now
        </button>
      </div>
    </div>
  );
};
