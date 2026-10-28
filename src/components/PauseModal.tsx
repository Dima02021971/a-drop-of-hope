import React from 'react';
import { Play, RotateCcw, Map, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onExitToMap: () => void;
  onOpenHowToPlay: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onExitToMap,
  onOpenHowToPlay
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/20 p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center my-auto">
        <h3 className="text-2xl font-black text-white mb-2">Game Paused</h3>
        <p className="text-xs text-slate-400 mb-6">Take a breath, Hippry is waiting!</p>

        <div className="space-y-3 w-full mb-6">
          <button
            onClick={() => {
              sound.playButtonClick();
              onResume();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            Resume Adventure
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onRestart();
            }}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-sky-300" />
            Restart Level
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onOpenHowToPlay();
            }}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            How to Play
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onExitToMap();
            }}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Map className="w-4 h-4 text-amber-300" />
            World Map
          </button>
        </div>

        {/* Audio Mute toggle */}
        <button
          onClick={handleToggleSound}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          <span>{isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound Enabled'}</span>
        </button>
      </div>
    </div>
  );
};
