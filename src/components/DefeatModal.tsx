import React from 'react';
import { RotateCcw, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { sound } from '../audio/soundEngine';
import { DifficultyMode } from '../types/game';

interface DefeatModalProps {
  reason: string;
  onRetry: () => void;
  onExitToMap: () => void;
  onChangeDifficulty: (newDiff: DifficultyMode) => void;
  currentDifficulty: DifficultyMode;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  reason,
  onRetry,
  onExitToMap,
  onChangeDifficulty,
  currentDifficulty
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-rose-500/30 p-5 sm:p-6 md:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Defeat Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase font-mono font-bold text-rose-400 tracking-wider mb-1">
          Challenge Failed
        </span>
        <h3 className="text-2xl font-black text-white mb-2">{reason}</h3>
        
        <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
          Hard Mode requires strict speed and efficient water logistics! You can try again or adjust your difficulty mode to match your play style.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 mb-5">
          <button
            onClick={() => {
              sound.playButtonClick();
              onRetry();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          {currentDifficulty === 'hard' && (
            <button
              onClick={() => {
                sound.playButtonClick();
                onChangeDifficulty('normal');
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>Switch to Normal Mode</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playButtonClick();
              onExitToMap();
            }}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Adventure Map</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          💡 Pro Tip: Deliver water in full satchel batches and plan your route to minimize backtracking!
        </div>
      </div>
    </div>
  );
};
