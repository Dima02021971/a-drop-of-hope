import React, { useState } from 'react';
import { ArrowLeft, Star, Lock, Droplet, Sparkles, CheckCircle2, Play, Sprout, Shield, Flame } from 'lucide-react';
import { LevelDefinition, DifficultyMode } from '../types/game';
import { LEVELS } from '../data/levels';
import { sound } from '../audio/soundEngine';

interface LevelMapProps {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
  levelProgress: Record<number, { stars: number; completed: boolean }>;
  currentDifficulty?: DifficultyMode;
  onChangeDifficulty?: (difficulty: DifficultyMode) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  onBack,
  onSelectLevel,
  levelProgress,
  currentDifficulty = 'normal',
  onChangeDifficulty
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  const selectedLevel: LevelDefinition = LEVELS.find(l => l.id === selectedLevelId) || LEVELS[0];
  const isUnlocked = selectedLevelId === 1 || Boolean(levelProgress[selectedLevelId - 1]?.completed);
  const currentLevelProgress = levelProgress[selectedLevelId];

  const handleDifficultySelect = (diff: DifficultyMode) => {
    sound.playButtonClick();
    if (onChangeDifficulty) {
      onChangeDifficulty(diff);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-900 text-white flex flex-col p-3 sm:p-4 md:p-8 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10 gap-2">
        <button
          onClick={() => {
            sound.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Title</span> Menu
        </button>

        <div className="text-center min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Adventure Map</h2>
          <span className="hidden sm:block text-xs text-sky-300">Choose a region to restore clean water</span>
        </div>

        <div className="shrink-0 flex justify-end">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            <span>
              {Object.values(levelProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0)} Stars
            </span>
          </div>
        </div>
      </header>

      {/* Main Map Body: Interactive Map Grid + Side Details Panel */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
        {/* Visual Map Overview (2 Columns) */}
        <div className="lg:col-span-2 relative rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border border-white/15 p-6 overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Animated river visual path across levels */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 800 500" preserveAspectRatio="none">
            <path
              d="M 120 100 Q 250 80 400 200 T 680 380"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M 120 100 Q 250 80 400 200 T 680 380"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="6"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>

          {/* Level Nodes on the Map */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
            {LEVELS.map((lvl) => {
              const unlocked = lvl.id === 1 || Boolean(levelProgress[lvl.id - 1]?.completed);
              const progress = levelProgress[lvl.id];
              const isSelected = selectedLevelId === lvl.id;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    sound.playButtonClick();
                    setSelectedLevelId(lvl.id);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/40 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
                      Level {lvl.id} · {lvl.region}
                    </span>
                    {!unlocked ? (
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${
                              (progress?.stars || 0) >= s 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-600'
                            }`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{lvl.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{lvl.tagline}</p>

                  {progress?.completed && (
                    <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Map legend */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Flowing River Route
            </span>
            <span>Follow Hippry downstream to bring safe water to all communities</span>
          </div>
        </div>

        {/* Selected Level Details Panel */}
        <div className="rounded-2xl bg-slate-800/80 border border-white/15 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 text-xs font-bold uppercase">
                Level {selectedLevel.id}
              </span>
              <span className="text-xs text-slate-400">{selectedLevel.region}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">{selectedLevel.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">{selectedLevel.description}</p>

            {/* Mission Objectives */}
            <div className="space-y-2.5 mb-5">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                Mission Objectives
              </span>

              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <span>Deliver {selectedLevel.targetWater}L clean water to community reservoir</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Revive {selectedLevel.flowerCount} thirsty flowers along the trail</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <span>
                  {selectedLevel.id === 4
                    ? 'Operate biosand filter & answer water trivia'
                    : selectedLevel.id === 3
                    ? 'Prime gravity intake & answer water trivia'
                    : 'Operate borehole hand-pump & answer water trivia'}
                </span>
              </div>
            </div>

            {/* Educational Focus Highlight */}
            <div className="p-3 rounded-xl bg-sky-950/50 border border-sky-400/20 text-xs text-sky-200 mb-5">
              <span className="font-bold text-sky-300 block mb-0.5">Educational Focus:</span>
              <span>{selectedLevel.keyFacts[0]}</span>
            </div>

            {/* Selectable Difficulty Mode */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Select Difficulty
                </span>
                <span className="text-[11px] font-mono text-sky-400 capitalize">
                  Current: {currentDifficulty}
                </span>
              </div>

              {/* Segmented Difficulty Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 mb-2">
                <button
                  type="button"
                  onClick={() => handleDifficultySelect('easy')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentDifficulty === 'easy'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Easy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDifficultySelect('normal')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentDifficulty === 'normal'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Normal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDifficultySelect('hard')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentDifficulty === 'hard'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hard</span>
                </button>
              </div>

              {/* Difficulty Perks Summary */}
              <div className="text-[11px] text-slate-400 leading-snug px-1">
                {currentDifficulty === 'easy' && (
                  <span className="text-emerald-300">
                    🌱 <strong>Easy Mode:</strong> No countdown timer, 120L satchel capacity, slower hazards, and helpful gameplay hints.
                  </span>
                )}
                {currentDifficulty === 'normal' && (
                  <span className="text-sky-300">
                    ⚡ <strong>Normal Mode:</strong> Standard rules, 100L satchel capacity, standard hazard evaporation.
                  </span>
                )}
                {currentDifficulty === 'hard' && (
                  <span className="text-rose-300">
                    🔥 <strong>Hard Mode:</strong> Strict countdown timer, 80L satchel capacity, fast hazards, and failure on timeout!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Start Level CTA Button */}
          <div>
            {isUnlocked ? (
              <button
                onClick={() => {
                  sound.playButtonClick();
                  onSelectLevel(selectedLevel.id);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{currentLevelProgress?.completed ? 'Replay Level' : 'Start Adventure'}</span>
              </button>
            ) : (
              <div className="w-full py-3.5 rounded-xl bg-slate-700/50 border border-white/5 text-slate-400 font-semibold text-sm flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Complete Level {selectedLevel.id - 1} to Unlock</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
