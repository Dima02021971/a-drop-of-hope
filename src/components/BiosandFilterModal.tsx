import React, { useState } from 'react';
import { X, CheckCircle2, Info, AlertTriangle, Layers, Droplets, Sparkles, Play } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface BiosandFilterModalProps {
  onClose: () => void;
  onComplete: () => void;
  targetPumps?: number;
  levelId?: number;
}

interface FilterLayer {
  id: string;
  name: string;
  role: string;
  color: string;
  textColor: string;
  depth: string;
  description: string;
  installed: boolean;
}

export const BiosandFilterModal: React.FC<BiosandFilterModalProps> = ({
  onClose,
  onComplete
}) => {
  const [layers, setLayers] = useState<FilterLayer[]>([
    {
      id: 'gravel',
      name: '1. Underdrain Gravel (Base)',
      role: 'Drainage Foundation',
      depth: '5 cm',
      color: '#475569',
      textColor: '#cbd5e1',
      description: 'Supports the sand column and allows clean water to flow freely into the outlet tube without clogging.',
      installed: false
    },
    {
      id: 'coarse_sand',
      name: '2. Separating Coarse Sand',
      role: 'Migration Barrier',
      depth: '5 cm',
      color: '#b45309',
      textColor: '#fde68a',
      description: 'Prevents the fine filter sand from slipping downward into the bottom drainage gravel.',
      installed: false
    },
    {
      id: 'fine_sand',
      name: '3. Fine Silica Sand Column',
      role: 'Mechanical Straining',
      depth: '40 cm',
      color: '#ca8a04',
      textColor: '#fef08a',
      description: 'Traps suspended silt, turbidity, and larger parasites (like Giardia and Cryptosporidium) through microscopic pore spaces.',
      installed: false
    },
    {
      id: 'biolayer',
      name: '4. Schmutzdecke (Living Biolayer)',
      role: 'Biological Predation',
      depth: '2-3 cm',
      color: '#15803d',
      textColor: '#86efac',
      description: 'An active biofilm of beneficial microorganisms that feeds on incoming disease-causing bacteria.',
      installed: false
    }
  ]);

  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isWaterFlowing, setIsWaterFlowing] = useState(false);
  const [hasTestedFlow, setHasTestedFlow] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const allLayersInstalled = layers.every(l => l.installed);

  const handleInstallNextLayer = () => {
    if (activeLayerIndex >= layers.length) return;
    sound.playPumpStroke();

    setLayers(prev => prev.map((l, idx) => idx === activeLayerIndex ? { ...l, installed: true } : l));
    setActiveLayerIndex(prev => prev + 1);

    if (activeLayerIndex + 1 === layers.length) {
      sound.playWaterDeliver();
    }
  };

  const handlePourWater = () => {
    if (isWaterFlowing || isDone) return;
    setIsWaterFlowing(true);
    sound.playWaterPickup();

    setTimeout(() => {
      sound.playWaterDeliver();
      setHasTestedFlow(true);
      setIsWaterFlowing(false);
    }, 2400);
  };

  const handleFinish = () => {
    setIsDone(true);
    sound.playLevelComplete();
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-amber-400/30 p-5 md:p-7 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Environmental Engineering
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-1.5">
          Sunstone Biosand Filtration Challenge
        </h3>
        <p className="text-xs text-slate-300 max-w-md mb-5 leading-relaxed">
          Assemble the 4 physical and biological filtration layers to transform cloudy desert runoff into crystal-clear water!
        </p>

        {/* Interactive Workspace: Visual Cross-Section & Layer Controls */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-stretch">
          {/* Left: Filter Tank Cross Section (5 Cols) */}
          <div className="md:col-span-5 rounded-xl bg-slate-950/70 border border-white/15 p-4 flex flex-col items-center justify-between relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-2">
              Concrete Filter Tank Cross-Section
            </span>

            {/* Pouring Water Animation */}
            {isWaterFlowing && (
              <div className="absolute top-8 z-30 flex flex-col items-center animate-bounce">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Turbid River Runoff Inflow
                </span>
                <div className="w-4 h-10 bg-amber-700/80 rounded-full blur-[1px] mt-1" />
              </div>
            )}

            {/* Filter Container Body */}
            <div className="relative w-40 h-64 border-4 border-slate-600 rounded-b-xl bg-slate-900/90 flex flex-col justify-end overflow-hidden shadow-inner">
              {/* Outlet tube on right bottom */}
              <div className="absolute bottom-2 -right-4 w-7 h-3 bg-slate-400 rounded-r border border-slate-700 z-10" />
              {hasTestedFlow && (
                <div className="absolute bottom-2 -right-8 w-5 h-8 bg-sky-400/80 rounded-full animate-pulse z-10" />
              )}

              {/* Layer 4: Biolayer (Top) */}
              <div
                className={`w-full transition-all duration-500 border-b border-emerald-400/30 flex items-center justify-center text-[10px] font-bold ${
                  layers[3].installed ? 'h-9 bg-emerald-700/90 text-white shadow' : 'h-2 bg-emerald-950/30 border-dashed text-transparent'
                }`}
              >
                {layers[3].installed && '4. Schmutzdecke'}
              </div>

              {/* Layer 3: Fine Sand */}
              <div
                className={`w-full transition-all duration-500 border-b border-amber-300/30 flex items-center justify-center text-[10px] font-bold ${
                  layers[2].installed ? 'h-24 bg-yellow-600/90 text-white shadow' : 'h-3 bg-yellow-950/30 border-dashed text-transparent'
                }`}
              >
                {layers[2].installed && '3. Fine Sand'}
              </div>

              {/* Layer 2: Coarse Sand */}
              <div
                className={`w-full transition-all duration-500 border-b border-amber-600/30 flex items-center justify-center text-[10px] font-bold ${
                  layers[1].installed ? 'h-11 bg-amber-700/90 text-white shadow' : 'h-2 bg-amber-950/30 border-dashed text-transparent'
                }`}
              >
                {layers[1].installed && '2. Coarse Sand'}
              </div>

              {/* Layer 1: Underdrain Gravel (Bottom) */}
              <div
                className={`w-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold ${
                  layers[0].installed ? 'h-14 bg-slate-600 text-slate-100 shadow' : 'h-3 bg-slate-800/40 border-dashed text-transparent'
                }`}
              >
                {layers[0].installed && '1. Base Gravel'}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              Outlet: {hasTestedFlow ? '✓ Purified Flow (99% Strained)' : 'Awaiting Water Test'}
            </div>
          </div>

          {/* Right: Layer Steps & Controls (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between text-left space-y-2.5">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                Filtration Layers ({layers.filter(l => l.installed).length}/4 Placed)
              </span>

              {layers.map((layer, idx) => (
                <div
                  key={layer.id}
                  className={`p-2.5 rounded-xl border transition-all text-xs ${
                    layer.installed
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                      : idx === activeLayerIndex
                      ? 'bg-amber-950/30 border-amber-400/60 text-white ring-1 ring-amber-400/40'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {layer.installed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-500 flex items-center justify-center text-[9px]">
                          {idx + 1}
                        </div>
                      )}
                      {layer.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                      {layer.depth}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{layer.description}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {!allLayersInstalled ? (
                <button
                  onClick={handleInstallNextLayer}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  <Layers className="w-4 h-4" />
                  <span>Place Layer {activeLayerIndex + 1}: {layers[activeLayerIndex]?.name.split('.')[1]}</span>
                </button>
              ) : !hasTestedFlow ? (
                <button
                  onClick={handlePourWater}
                  disabled={isWaterFlowing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  <Droplets className="w-4 h-4" />
                  <span>{isWaterFlowing ? 'Water Percolating Through Sand...' : 'Pour Turbid Runoff & Test Filter'}</span>
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Filter Certified! Activate Sunstone Station</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Crucial Water Safety Educational Notice */}
        <div className="w-full p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-left flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-300 block mb-0.5">
              Crucial Safe Water Principle:
            </span>
            Physical biosand filtration removes sediment, parasites (Giardia & Cryptosporidium), and up to 99% of bacteria. <strong>However, filtration alone does NOT destroy all microscopic viruses or chemical toxins.</strong> Secondary disinfection (such as solar SODIS, chlorination, or boiling) is required for complete safety!
          </div>
        </div>
      </div>
    </div>
  );
};
