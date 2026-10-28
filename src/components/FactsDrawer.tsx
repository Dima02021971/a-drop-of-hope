import React, { useState } from 'react';
import { X, Droplet, Heart, GraduationCap, Wrench, ExternalLink } from 'lucide-react';
import { WATER_FACTS } from '../data/levels';
import { sound } from '../audio/soundEngine';
import { CharityWaterLogo } from './CharityWaterLogo';

interface FactsDrawerProps {
  onClose: () => void;
}

export const FactsDrawer: React.FC<FactsDrawerProps> = ({ onClose }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFacts = filterCategory === 'all' 
    ? WATER_FACTS 
    : WATER_FACTS.filter(f => f.category === filterCategory);

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
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
            Knowledge Vault
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Clean Water Facts & Impact
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mb-6">
          Discover why safe drinking water transforms health, keeps children in school, and lifts entire communities.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {[
            { id: 'all', label: 'All Facts', icon: Droplet },
            { id: 'access', label: 'Global Access', icon: Droplet },
            { id: 'education', label: 'Time & Schools', icon: GraduationCap },
            { id: 'health', label: 'Health & Hygiene', icon: Heart },
            { id: 'solutions', label: 'Sustainable Tech', icon: Wrench },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = filterCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playButtonClick();
                  setFilterCategory(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-sky-500 text-white shadow' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Facts Cards List */}
        <div className="space-y-4 mb-6">
          {filteredFacts.map(fact => (
            <div
              key={fact.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 hover:border-sky-400/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{fact.title}</h4>
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  {fact.category}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {fact.fact}
              </p>
              <div className="p-2.5 rounded-lg bg-sky-950/50 border border-sky-400/20 text-[11px] text-sky-200">
                <strong className="text-sky-300">Why it matters:</strong> {fact.impact}
              </div>
            </div>
          ))}
        </div>

        {/* charity: water Global Spotlight & Action Card */}
        <div className="p-4 md:p-5 rounded-xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-emerald-950/80 border border-sky-400/30 mb-6 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <a
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="charity: water official website (opens in a new tab)"
                className="inline-flex items-center hover:opacity-90 transition-opacity cursor-pointer group"
              >
                <CharityWaterLogo height={22} theme="light" className="transition-transform group-hover:scale-[1.02]" />
              </a>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                charity: water is on a mission to end the global water crisis. 100% of public donations fund sustainable water projects in 29+ countries, proving every completed project with GPS coordinates and photos.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <a
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about charity: water (opens in a new tab)"
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-400/50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Learn More</span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              </a>
              <a
                href="https://www.charitywater.org/donate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Donate to charity: water (opens in a new tab)"
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-white" />
                <span>Donate</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400/80">
            Independent educational project created to raise awareness. Not officially affiliated with charity: water.
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-colors text-center cursor-pointer"
        >
          Return to Game
        </button>
      </div>
    </div>
  );
};
