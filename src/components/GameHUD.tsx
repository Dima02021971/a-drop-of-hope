import React from 'react';
import { Volume2, VolumeX, Pause, Droplet, Sparkles, Home, Timer, Shield, Flame, Sprout, Lightbulb } from 'lucide-react';
import { sound } from '../audio/soundEngine';
import { DifficultyMode } from '../types/game';

interface GameHUDProps {
  waterAmount: number;
  maxWater: number;
  reservoirWater: number;
  reservoirTarget: number;
  flowersBloomed: number;
  totalFlowers: number;
  elapsedSeconds: number;
  timeRemaining?: number;
  difficulty?: DifficultyMode;
  onPause: () => void;
  onExitToMap: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  waterAmount,
  maxWater,
  reservoirWater,
  reservoirTarget,
  flowersBloomed,
  totalFlowers,
  elapsedSeconds,
  timeRemaining = 0,
  difficulty = 'normal',
  onPause,
  onExitToMap
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const formatTime = (secs: number) => {
    const safeSecs = Math.max(0, Math.round(secs));
    const m = Math.floor(safeSecs / 60);
    const s = safeSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate dynamic contextual hints for Easy Mode
  const getEasyModeHint = () => {
    if (waterAmount === 0) {
      if (reservoirWater < reservoirTarget) {
        return 'Head west to the water source to fill Hippry’s satchel!';
      }
      if (flowersBloomed < totalFlowers) {
        return 'Reservoir full! Refill satchel at the water source to revive remaining flowers!';
      }
    }
    if (reservoirWater < reservoirTarget && waterAmount > 0) {
      return 'Cross the bridges to deliver fresh water to the village reservoir [Space]!';
    }
    if (flowersBloomed < totalFlowers) {
      return 'Revive remaining flowers (20L each) — all flowers must bloom to complete the mission!';
    }
    return 'Great job! Check the knowledge stone for water trivia or operate the pump to earn 3 stars!';
  };

  const isHardMode = difficulty === 'hard';
  const isTimeCritical = isHardMode && timeRemaining <= 30;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-2 pt-2 md:px-4 md:pt-4 pointer-events-none select-none flex flex-col items-center max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4">
        {/* Top Control Bar on Mobile: Left (Home, Diff, Timer) and Right (Sound, Pause) */}
        <div className="flex items-center justify-between w-full md:w-auto md:contents">
          {/* Left: Home Map Button + Difficulty + Timer */}
          <div className="flex items-center gap-1.5 md:gap-2 pointer-events-auto md:order-1 shrink-0">
            <button
              onClick={() => {
                sound.playButtonClick();
                onExitToMap();
              }}
              aria-label="Exit to Map"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5 text-sky-300" />
            </button>

            {/* Difficulty Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl backdrop-blur-md border text-[11px] md:text-xs font-bold shrink-0 ${
                difficulty === 'easy'
                  ? 'bg-emerald-950/85 border-emerald-400/40 text-emerald-300'
                  : difficulty === 'hard'
                  ? 'bg-rose-950/85 border-rose-500/50 text-rose-300 shadow-rose-950/50'
                  : 'bg-sky-950/85 border-sky-400/40 text-sky-300'
              }`}
            >
              {difficulty === 'easy' && <Sprout className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />}
              {difficulty === 'normal' && <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-400" />}
              {difficulty === 'hard' && <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-rose-400" />}
              <span className="capitalize">{difficulty}</span>
            </div>

            {/* Timer Display */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl backdrop-blur-md border text-[11px] md:text-sm font-semibold shrink-0 ${
                isTimeCritical
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/40'
                  : 'bg-slate-900/85 border-white/20 text-white'
              }`}
            >
              <Timer className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isTimeCritical ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className="font-mono tabular-nums">
                {isHardMode ? formatTime(timeRemaining) : formatTime(elapsedSeconds)}
              </span>
              {isHardMode && <span className="text-[9px] md:text-[10px] text-rose-400 font-mono uppercase">Left</span>}
            </div>
          </div>

          {/* Right on Mobile: Audio Toggle & Pause */}
          <div className="flex items-center gap-1.5 md:gap-2 pointer-events-auto md:order-3 shrink-0">
            <button
              onClick={handleToggleSound}
              aria-label="Toggle Sound"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-300" />}
            </button>

            <button
              onClick={() => {
                sound.playButtonClick();
                onPause();
              }}
              aria-label="Pause Game"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Pause className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Row 2 on Mobile / Center on Desktop: Mission Meters */}
        <div className="flex items-center justify-center gap-1.5 md:gap-3 pointer-events-auto w-full md:w-auto md:order-2">
          {/* Water Satchel Meter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-sky-400/30 text-white shadow-lg shrink-0">
            <Droplet className={`w-3.5 h-3.5 md:w-4 md:h-4 ${waterAmount > 0 ? 'text-sky-400 fill-sky-400' : 'text-slate-400'}`} />
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] text-sky-300 font-bold uppercase leading-none">Satchel</span>
              <span className="text-[11px] md:text-xs font-mono font-bold tabular-nums">
                {waterAmount}/{maxWater}L
              </span>
            </div>
            {/* Mini Progress Bar (larger screens) */}
            <div className="hidden sm:block w-12 md:w-14 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div 
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${(waterAmount / maxWater) * 100}%` }}
              />
            </div>
          </div>

          {/* Flowers Meter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-emerald-400/30 text-white shadow-lg shrink-0">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] text-emerald-300 font-bold uppercase leading-none">Blooms</span>
              <span className="text-[11px] md:text-xs font-mono font-bold tabular-nums">
                {flowersBloomed}/{totalFlowers}
              </span>
            </div>
          </div>

          {/* Village Reservoir Meter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-400/30 text-white shadow-lg shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-bold text-slate-900 shrink-0">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] text-amber-300 font-bold uppercase leading-none">Reservoir</span>
              <span className="text-[11px] md:text-xs font-mono font-bold tabular-nums">
                {reservoirWater}/{reservoirTarget}L
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Easy Mode Gameplay Hint Banner */}
      {difficulty === 'easy' && (
        <div className="mt-2 pointer-events-auto max-w-lg px-3.5 py-1.5 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs shadow-lg flex items-center gap-2 animate-fade-in">
          <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-medium truncate">{getEasyModeHint()}</span>
        </div>
      )}
    </header>
  );
};
