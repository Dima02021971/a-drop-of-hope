import React from 'react';
import { Star, RotateCcw, Map, Award, Droplet, Sparkles, Timer, Heart, ExternalLink } from 'lucide-react';
import { sound } from '../audio/soundEngine';
import { CharityWaterLogo } from './CharityWaterLogo';

interface VictoryModalProps {
  stars: number;
  timeSpent: number;
  waterDelivered: number;
  flowersBloomed: number;
  totalFlowers: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onExitToMap: () => void;
  hasNextLevel: boolean;
  villageName?: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stars,
  timeSpent,
  waterDelivered,
  flowersBloomed,
  totalFlowers,
  onNextLevel,
  onPlayAgain,
  onExitToMap,
  hasNextLevel,
  villageName = 'Meadowood Village'
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950 border border-emerald-400/30 p-5 sm:p-6 md:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Confetti badge icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-400/25 mb-4 animate-bounce-slow">
          <Award className="w-9 h-9 text-slate-950" />
        </div>

        <span className="text-xs uppercase tracking-wider font-bold text-sky-400 mb-1">
          Mission Accomplished!
        </span>
        <h2 className="text-3xl font-black text-white mb-3">
          {villageName} Revived!
        </h2>
        <p className="text-xs md:text-sm text-sky-200/90 max-w-sm mb-6 leading-relaxed">
          {villageName.includes('Sunflower')
            ? "Thanks to Hippry's brave trek through the arid valley, the Sunflower Village reservoir is full and the desert blooms are thriving!"
            : villageName.includes('Cloud') || villageName.includes('Highland')
            ? "Thanks to Hippry's mountain climb, the Cloud Peaks gravity cistern is brimming with fresh water and all alpine blooms are thriving across the peaks!"
            : "Thanks to Hippry's caring journey, the community reservoir is brimming with fresh water and the wild blooms are shining!"}
        </p>

        {/* 3 Stars Award Display */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starNum) => {
            const isEarned = stars >= starNum;
            return (
              <div
                key={starNum}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 transform ${
                  isEarned
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400 scale-110 shadow-lg shadow-amber-400/30'
                    : 'bg-white/5 border-white/10 text-slate-600 scale-95'
                }`}
              >
                <Star className={`w-8 h-8 ${isEarned ? 'fill-amber-400 text-amber-400' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* Mission Stats Breakdown */}
        <div className="w-full grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Timer className="w-3 h-3 text-amber-400" /> Time
            </span>
            <span className="text-sm font-bold text-white font-mono">{formatTime(timeSpent)}</span>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Droplet className="w-3 h-3 text-sky-400" /> Water
            </span>
            <span className="text-sm font-bold text-white font-mono">{waterDelivered}L</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Blooms
            </span>
            <span className="text-sm font-bold text-white font-mono">{flowersBloomed}/{totalFlowers}</span>
          </div>
        </div>

        {/* Educational Takeaway Card & charity: water callout */}
        <div className="w-full text-left p-3.5 rounded-xl bg-sky-950/60 border border-sky-400/25 mb-6 text-xs text-sky-200 flex flex-col gap-2.5">
          <div>
            <span className="font-bold text-sky-300 block mb-0.5">Real-World Impact:</span>
            <span>
              Every community water project changes hundreds of lives forever—reducing waterborne illness by over 40% and freeing hours every day for school and family.
            </span>
          </div>

          <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <a
              href="https://www.charitywater.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="charity: water official website (opens in a new tab)"
              className="inline-flex items-center hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <CharityWaterLogo height={18} theme="light" className="transition-transform group-hover:scale-[1.02]" />
            </a>

            <div className="flex items-center gap-2">
              <a
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about charity: water (opens in a new tab)"
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-400/50 text-white font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <span>Learn More</span>
                <ExternalLink className="w-3 h-3 text-sky-400" />
              </a>
              <a
                href="https://www.charitywater.org/donate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Donate to charity: water (opens in a new tab)"
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Heart className="w-3 h-3 fill-current text-white" />
                <span>Donate</span>
              </a>
            </div>
          </div>

          <div className="text-[10px] text-slate-400/70 pt-1">
            Independent educational project created to raise awareness. Not officially affiliated with charity: water.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {hasNextLevel && (
            <button
              onClick={() => {
                sound.playButtonClick();
                onNextLevel();
              }}
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              Next Level
            </button>
          )}

          <button
            onClick={() => {
              sound.playButtonClick();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-sky-300" />
            Play Again
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onExitToMap();
            }}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Map className="w-4 h-4 text-emerald-300" />
            World Map
          </button>
        </div>
      </div>
    </div>
  );
};
