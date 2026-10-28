import React, { useState } from 'react';
import { X, CheckCircle2, Info } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface HandPumpModalProps {
  onClose: () => void;
  onComplete: () => void;
  targetPumps?: number;
  levelId?: number;
}

export const HandPumpModal: React.FC<HandPumpModalProps> = ({
  onClose,
  onComplete,
  targetPumps = 6,
  levelId = 1
}) => {
  const [pumpsDone, setPumpsDone] = useState(0);
  const [isLeverDown, setIsLeverDown] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handlePump = () => {
    if (isDone) return;

    setIsLeverDown(true);
    sound.playPumpStroke();

    setTimeout(() => {
      setIsLeverDown(false);
      const nextCount = pumpsDone + 1;
      setPumpsDone(nextCount);

      if (nextCount >= targetPumps) {
        setIsDone(true);
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 200);
  };

  const progressPercent = Math.min(100, Math.round((pumpsDone / targetPumps) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-sky-400/30 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-bold text-sky-400">Mini-Game Challenge</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">
          {levelId === 3 ? 'Gravity Intake Siphon' : 'Borehole Hand-Pump'}
        </h3>
        <p className="text-xs text-slate-300 max-w-sm mb-6">
          {levelId === 3
            ? 'Press the pump lever to prime the intake siphon and charge the mountain gravity water distribution pipes!'
            : 'Press the pump lever to draw pristine groundwater from the deep subterranean aquifer!'}
        </p>

        {/* Visual Hand-Pump Interactive Canvas / Graphic */}
        <div className="relative w-full h-56 rounded-xl bg-gradient-to-b from-sky-950/60 to-emerald-950/80 border border-white/10 flex flex-col items-center justify-center overflow-hidden mb-6">
          {/* Underground Aquifer Strata / Mountain Intake in background */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sky-700/40 to-transparent flex items-center justify-center">
            <span className="text-[10px] text-sky-300/80 font-mono tracking-wider">
              {levelId === 3 ? 'Mountain Siphon Catchment & Gravity Distribution Pipes' : 'Protected Deep Aquifer (50m Underground)'}
            </span>
          </div>

          {/* Hand-Pump Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Lever handle */}
            <div
              className={`w-32 h-4 bg-slate-400 rounded-full origin-right transition-transform duration-150 relative cursor-pointer ${
                isLeverDown ? 'rotate-12 translate-y-2' : '-rotate-12'
              }`}
            >
              <div className="absolute -left-2 -top-2 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow" />
            </div>

            {/* Pump Body */}
            <div className="w-16 h-28 bg-sky-600 rounded-t-lg border-2 border-sky-400 flex flex-col items-center justify-between py-2 relative mt-1">
              <div className="w-20 h-4 bg-sky-700 rounded-md" />
              
              {/* Spout */}
              <div className="absolute right-0 top-12 translate-x-full w-8 h-4 bg-sky-700 flex items-center justify-end">
                {/* Flowing Water stream */}
                {isLeverDown && (
                  <div className="w-2 h-14 bg-sky-300 rounded-full animate-pulse shadow-lg translate-y-5" />
                )}
              </div>

              <span className="text-[10px] font-bold text-sky-100">WELL #1</span>
            </div>

            {/* Base platform */}
            <div className="w-36 h-5 bg-slate-700 rounded-md border border-slate-600" />
          </div>

          {/* Water Splash Particles */}
          {isLeverDown && (
            <div className="absolute top-1/2 right-28 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-300 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
            </div>
          )}
        </div>

        {/* Pump Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300">Groundwater Reservoir</span>
            <span className="text-sky-400 font-mono tabular-nums">{pumpsDone} / {targetPumps} Pumps</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {!isDone ? (
          <button
            onClick={handlePump}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-extrabold text-base shadow-lg shadow-sky-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PUMP HANDLE</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">[{pumpsDone}/{targetPumps}]</span>
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Well Restored! Satchel Refilled to 100L</span>
          </div>
        )}

        {/* Educational Fact Callout */}
        <div className="mt-4 flex items-start gap-2.5 text-left p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-sky-300">Why deep wells work:</strong> Soil and sand act as a natural filtration barrier. Pumping from deep rock layers provides clean, safe water free from surface bacteria.
          </span>
        </div>
      </div>
    </div>
  );
};
