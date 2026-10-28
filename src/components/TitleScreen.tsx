import React from 'react';
import { Volume2, VolumeX, BookOpen, Compass, Award, Heart, ExternalLink } from 'lucide-react';
import { sound } from '../audio/soundEngine';
import { CharityWaterLogo } from './CharityWaterLogo';

interface TitleScreenProps {
  onPlay: () => void;
  onOpenHowToPlay: () => void;
  onOpenFacts: () => void;
  onOpenMap: () => void;
  totalStars: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onPlay,
  onOpenHowToPlay,
  onOpenFacts,
  onOpenMap,
  totalStars
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playButtonClick();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-900 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden select-none">
      {/* Background Animated Gradient & Nature Silhouettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-emerald-950 to-slate-950 opacity-95 pointer-events-none" />
      
      {/* Decorative flowing water wave lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Stars & Sound Toggle */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400 block">Eco-Adventure</span>
            <span className="text-white font-semibold text-sm">A Drop of Hope</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{totalStars} Stars</span>
          </div>

          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-sky-300" />}
          </button>
        </div>
      </header>

      {/* Main Title Hero Card */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-2xl my-auto py-6">
        {/* Animated Hippry Avatar / Vector Character */}
        <div className="relative mb-6">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-sky-600 to-emerald-500 p-1.5 shadow-2xl shadow-sky-500/25 animate-bounce-slow">
            <div className="w-full h-full rounded-full bg-emerald-900/60 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20">
              {/* Hippry SVG Character */}
              <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-36 md:h-36">
                {/* Ears */}
                <circle cx="28" cy="30" r="10" fill="#78350f" />
                <circle cx="28" cy="30" r="5" fill="#fde68a" />
                <circle cx="72" cy="30" r="10" fill="#78350f" />
                <circle cx="72" cy="30" r="5" fill="#fde68a" />

                {/* Head */}
                <ellipse cx="50" cy="50" rx="32" ry="28" fill="#92400e" />

                {/* Snout */}
                <ellipse cx="50" cy="58" rx="16" ry="12" fill="#fef3c7" />
                <ellipse cx="50" cy="53" rx="7" ry="5" fill="#1e293b" />
                <path d="M46 62 Q50 66 54 62" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                {/* Big Cheerful Eyes */}
                <circle cx="36" cy="44" r="6" fill="#0f172a" />
                <circle cx="38" cy="42" r="2.2" fill="#ffffff" />
                <circle cx="64" cy="44" r="6" fill="#0f172a" />
                <circle cx="66" cy="42" r="2.2" fill="#ffffff" />

                {/* Water droplet badge on hat/satchel */}
                <path d="M50 20 C54 26 58 30 50 36 C42 30 46 26 50 20 Z" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* Floating water droplets */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center shadow-lg animate-pulse">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
          A Drop of Hope
        </h1>
        <p className="text-base md:text-lg text-sky-200/90 font-medium max-w-lg mb-8 leading-relaxed">
          Join <span className="text-amber-300 font-bold">Hippry the Otter</span> on a cozy quest through nature to harvest clean water, bloom wild meadows, and bring life to remote communities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => {
              sound.playButtonClick();
              onPlay();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-base shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Level 1
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onOpenMap();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-sky-300" />
            World Map
          </button>
        </div>

        {/* Secondary Navigation */}
        <div className="flex items-center gap-4 mt-5 text-sm text-sky-200/80">
          <button
            onClick={() => {
              sound.playButtonClick();
              onOpenHowToPlay();
            }}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            How to Play
          </button>
          <span>·</span>
          <button
            onClick={() => {
              sound.playButtonClick();
              onOpenFacts();
            }}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-sky-400">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            Water Facts
          </button>
        </div>
      </main>

      {/* Footer & charity: water Information Section */}
      <footer className="relative z-10 w-full max-w-4xl pt-4 border-t border-white/10 text-xs text-slate-400 flex flex-col gap-3 select-auto">
        {/* Main Footer Row: Brand Logo Lockup & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Official charity: water yellow water-can logo and wordmark */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <a
              href="https://www.charitywater.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="charity: water official website (opens in a new tab)"
              className="inline-flex items-center hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <CharityWaterLogo height={24} theme="light" className="transition-transform group-hover:scale-[1.02]" />
            </a>

            <div className="hidden sm:block w-px h-4 bg-white/20" />

            <span className="text-slate-300 font-medium text-xs">
              100% of public donations fund clean water projects
            </span>
          </div>

          {/* Action Buttons: Learn More & Donate */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://www.charitywater.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn more about charity: water (opens in a new tab)"
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-400/50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Learn More</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </a>

            <a
              href="https://www.charitywater.org/donate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate to charity: water (opens in a new tab)"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
              <span>Donate</span>
            </a>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="text-center sm:text-left text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1 pt-2 border-t border-white/5">
          <span>
            Independent educational project created to raise awareness. Not officially affiliated with charity: water.
          </span>
          <span className="text-slate-500 text-[10px]">
            A Drop of Hope · Top-Down Educational Eco-Adventure
          </span>
        </div>
      </footer>
    </div>
  );
};
