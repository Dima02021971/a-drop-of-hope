import React, { useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Droplet } from 'lucide-react';

interface TouchControlsProps {
  onMovementChange: (x: number, y: number) => void;
  onActionTrigger: () => void;
  actionLabel?: string | null;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMovementChange,
  onActionTrigger,
  actionLabel
}) => {
  const activeKeys = useRef({ up: false, down: false, left: false, right: false });

  const updateMovement = useCallback(() => {
    let x = 0;
    let y = 0;
    if (activeKeys.current.up) y -= 1;
    if (activeKeys.current.down) y += 1;
    if (activeKeys.current.left) x -= 1;
    if (activeKeys.current.right) x += 1;
    onMovementChange(x, y);
  }, [onMovementChange]);

  const handlePadPress = (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
    activeKeys.current[dir] = isDown;
    updateMovement();
  };

  return (
    <div 
      className="absolute inset-x-0 bottom-0 pointer-events-none z-20 flex items-end justify-between select-none touch-none pb-[max(0.75rem,env(safe-area-inset-bottom))] px-[max(0.75rem,env(safe-area-inset-left))] md:px-8"
      style={{ touchAction: 'none' }}
    >
      {/* Virtual D-Pad on Left */}
      <div 
        className="relative w-32 h-32 sm:w-36 sm:h-36 pointer-events-auto flex items-center justify-center touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        {/* D-Pad background plate */}
        <div className="absolute inset-0 rounded-full bg-slate-900/65 backdrop-blur-md border border-white/20 shadow-xl" />

        {/* Up Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
            handlePadPress('up', true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePadPress('up', false);
          }}
          onPointerCancel={() => handlePadPress('up', false)}
          onPointerLeave={() => handlePadPress('up', false)}
          className="absolute top-1 sm:top-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 active:bg-sky-500/50 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-95 touch-none select-none shadow-sm"
          style={{ touchAction: 'none' }}
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>

        {/* Down Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
            handlePadPress('down', true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePadPress('down', false);
          }}
          onPointerCancel={() => handlePadPress('down', false)}
          onPointerLeave={() => handlePadPress('down', false)}
          className="absolute bottom-1 sm:bottom-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 active:bg-sky-500/50 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-95 touch-none select-none shadow-sm"
          style={{ touchAction: 'none' }}
          aria-label="Move Down"
        >
          <ArrowDown className="w-5 h-5 text-white" />
        </button>

        {/* Left Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
            handlePadPress('left', true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePadPress('left', false);
          }}
          onPointerCancel={() => handlePadPress('left', false)}
          onPointerLeave={() => handlePadPress('left', false)}
          className="absolute left-1 sm:left-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 active:bg-sky-500/50 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-95 touch-none select-none shadow-sm"
          style={{ touchAction: 'none' }}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Right Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
            handlePadPress('right', true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePadPress('right', false);
          }}
          onPointerCancel={() => handlePadPress('right', false)}
          onPointerLeave={() => handlePadPress('right', false)}
          className="absolute right-1 sm:right-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 active:bg-sky-500/50 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-95 touch-none select-none shadow-sm"
          style={{ touchAction: 'none' }}
          aria-label="Move Right"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        {/* Center Pivot */}
        <div className="w-3.5 h-3.5 rounded-full bg-sky-400/40 pointer-events-none" />
      </div>

      {/* Action Button on Right */}
      <div 
        className="pointer-events-auto flex flex-col items-center gap-1 touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onActionTrigger();
          }}
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-sky-600 to-emerald-500 active:from-sky-500 active:to-emerald-400 border-2 border-white/40 shadow-2xl flex flex-col items-center justify-center text-white transition-transform active:scale-95 cursor-pointer touch-none select-none"
          style={{ touchAction: 'none' }}
          aria-label="Action Button"
        >
          <Droplet className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow" />
        </button>
        <span className="text-[10px] sm:text-[11px] font-bold text-sky-200 bg-slate-900/85 px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap max-w-[125px] sm:max-w-[160px] truncate text-center shadow-md">
          {actionLabel ? actionLabel.replace(/\[Space\]/g, '').trim() : 'Interact'}
        </span>
      </div>
    </div>
  );
};
