import React from 'react';
import { X, Droplet, Sparkles, Navigation, Award, BookOpen, Heart, ExternalLink } from 'lucide-react';
import { sound } from '../audio/soundEngine';
import { CharityWaterLogo } from './CharityWaterLogo';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-sky-400/30 p-6 md:p-8 shadow-2xl flex flex-col text-left">
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

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold uppercase">
            Guidebook
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          How to Play A Drop of Hope
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mb-6">
          Guide Hippry the otter through vibrant natural landscapes to deliver clean water and support thriving communities.
        </p>

        {/* 4 Feature Columns / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Movement */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Controls & Navigation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use <strong className="text-white">WASD</strong> or <strong className="text-white">Arrow Keys</strong> on desktop, or the on-screen <strong className="text-white">Virtual D-Pad</strong> on mobile/tablets to steer Hippry.
            </p>
          </div>

          {/* Water Collection */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Harvest Clean Water</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Walk up to the <strong className="text-sky-300">Fresh Spring</strong> or borehole pump and press <strong className="text-white">Space</strong> (or tap the Action button) to fill your water satchel.
            </p>
          </div>

          {/* Blooms & Community */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Bloom Flowers & Fill Cistern</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pour 20L into wilted flowerbeds to watch them burst into radiant blooms. Deliver the rest to the village reservoir to complete the mission!
            </p>
          </div>

          {/* Trivia & Hand-Pumps */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Pumps & Knowledge Checkpoints</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test your rhythm at the borehole pump challenge, cross wooden bridges, navigate around sticky mud, and solve trivia to earn all 3 Stars!
            </p>
          </div>
        </div>

        {/* 3 Star Criteria */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-400/20 flex flex-col gap-2 mb-6 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>How to Earn 3 Gold Stars</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>★ 1 Star:</strong> Deliver 100L clean water to the Community Cistern.</li>
            <li><strong>★★ 2 Stars:</strong> Bloom all 4 wild flowerbeds & operate the Hand-Pump.</li>
            <li><strong>★★★ 3 Stars:</strong> Correctly answer the educational trivia question!</li>
          </ul>
        </div>

        {/* charity: water Mission Callout */}
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-400/20 flex flex-col gap-2 mb-6 text-xs text-sky-200">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <a
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="charity: water official website (opens in a new tab)"
                className="inline-flex items-center hover:opacity-90 transition-opacity cursor-pointer group"
              >
                <CharityWaterLogo height={18} theme="light" className="transition-transform group-hover:scale-[1.02]" />
              </a>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">Inspired by real-world clean water solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about charity: water (opens in a new tab)"
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-400/50 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
              >
                <span>Learn More</span>
                <ExternalLink className="w-3 h-3 text-sky-400" />
              </a>
              <a
                href="https://www.charitywater.org/donate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Donate to charity: water (opens in a new tab)"
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Heart className="w-3 h-3 fill-current text-white" />
                <span>Donate</span>
              </a>
            </div>
          </div>
          <div className="text-[10px] text-slate-400/70 pt-1 border-t border-white/5">
            Independent educational project created to raise awareness. Not officially affiliated with charity: water.
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-transform active:scale-95 cursor-pointer text-center"
        >
          Got It, Let&apos;s Play!
        </button>
      </div>
    </div>
  );
};
