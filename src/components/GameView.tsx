import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/gameEngine';
import { CanvasRenderer } from '../game/canvasRenderer';
import { GameHUD } from './GameHUD';
import { TouchControls } from './TouchControls';
import { HandPumpModal } from './HandPumpModal';
import { BiosandFilterModal } from './BiosandFilterModal';
import { TriviaModal } from './TriviaModal';
import { VictoryModal } from './VictoryModal';
import { DefeatModal } from './DefeatModal';
import { PauseModal } from './PauseModal';
import { HowToPlayModal } from './HowToPlayModal';
import { LEVELS } from '../data/levels';
import { sound } from '../audio/soundEngine';
import { DifficultyMode } from '../types/game';

interface GameViewProps {
  levelId: number;
  difficulty?: DifficultyMode;
  onChangeDifficulty?: (difficulty: DifficultyMode) => void;
  onExitToMap: () => void;
  onLevelCompleted: (levelId: number, stars: number, timeSpent: number) => void;
  onNextLevel: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  levelId,
  difficulty = 'normal',
  onChangeDifficulty,
  onExitToMap,
  onLevelCompleted,
  onNextLevel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const currentLevelDef = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  const currentTriviaQuestion = currentLevelDef.triviaQuestions[0];

  // Reactive state for HUD & Modals
  const [waterAmount, setWaterAmount] = useState(0);
  const [maxWater, setMaxWater] = useState(difficulty === 'easy' ? 120 : (difficulty === 'hard' ? 80 : 100));
  const [reservoirWater, setReservoirWater] = useState(0);
  const [reservoirTarget, setReservoirTarget] = useState(currentLevelDef.targetWater);
  const [flowersBloomed, setFlowersBloomed] = useState(0);
  const [totalFlowers, setTotalFlowers] = useState(currentLevelDef.flowerCount);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(difficulty === 'hard' ? 180 : 0);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  // Modal active states
  const [isHandPumpOpen, setIsHandPumpOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isDefeatOpen, setIsDefeatOpen] = useState(false);
  const [defeatReason, setDefeatReason] = useState('Out of Time!');
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [victoryStats, setVictoryStats] = useState<{ stars: number; time: number }>({ stars: 1, time: 0 });
  const [deliveryNotice, setDeliveryNotice] = useState<string | null>(null);
  const deliveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLevelCompletedRef = useRef(onLevelCompleted);
  useEffect(() => {
    onLevelCompletedRef.current = onLevelCompleted;
  }, [onLevelCompleted]);

  // Modal active state refs for animation loop
  const isPauseOpenRef = useRef(false);
  const isHandPumpOpenRef = useRef(false);
  const isFilterOpenRef = useRef(false);
  const isTriviaOpenRef = useRef(false);
  const isVictoryOpenRef = useRef(false);
  const isDefeatOpenRef = useRef(false);
  const isHowToPlayOpenRef = useRef(false);

  useEffect(() => {
    isPauseOpenRef.current = isPauseOpen;
  }, [isPauseOpen]);
  useEffect(() => {
    isHandPumpOpenRef.current = isHandPumpOpen;
  }, [isHandPumpOpen]);
  useEffect(() => {
    isFilterOpenRef.current = isFilterOpen;
  }, [isFilterOpen]);
  useEffect(() => {
    isTriviaOpenRef.current = isTriviaOpen;
  }, [isTriviaOpen]);
  useEffect(() => {
    isVictoryOpenRef.current = isVictoryOpen;
  }, [isVictoryOpen]);
  useEffect(() => {
    isDefeatOpenRef.current = isDefeatOpen;
  }, [isDefeatOpen]);
  useEffect(() => {
    isHowToPlayOpenRef.current = isHowToPlayOpen;
  }, [isHowToPlayOpen]);

  // Initialize or restart engine
  const initEngine = useCallback(() => {
    const engine = new GameEngine({
      onOpenHandPump: () => {
        setIsHandPumpOpen(true);
      },
      onOpenFilter: () => {
        setIsFilterOpen(true);
      },
      onOpenTrivia: () => {
        setIsTriviaOpen(true);
      },
      onVictory: (stars, timeSpent) => {
        setVictoryStats({ stars, time: timeSpent });
        setIsVictoryOpen(true);
        if (onLevelCompletedRef.current) {
          onLevelCompletedRef.current(levelId, stars, timeSpent);
        }
      },
      onDefeat: (reason) => {
        setDefeatReason(reason);
        setIsDefeatOpen(true);
      },
      onWaterUpdated: (current, max) => {
        setWaterAmount(current);
        setMaxWater(max);
      },
      onGoalUpdated: (current, target) => {
        setReservoirWater(current);
        setReservoirTarget(target);
      },
      onFlowersUpdated: (bloomed, total) => {
        setFlowersBloomed(bloomed);
        setTotalFlowers(total);
        if (bloomed > 0) {
          const villageName = engineRef.current?.communityGoal.name || 
            (levelId === 4 ? 'Sunstone Oasis Village' : 
            (levelId === 3 ? 'Cloud Peaks Village' : 
            (levelId === 2 ? 'Sunflower Village' : 'Meadowood Village')));
          const currentResWater = engineRef.current?.communityGoal.currentWater ?? reservoirWater;
          const currentResTarget = engineRef.current?.communityGoal.targetWater ?? reservoirTarget;

          let msg: string;
          if (bloomed === total) {
            if (currentResWater < currentResTarget) {
              msg = `🌸 All ${total} Flowers Bloomed! Now fill the village reservoir (${currentResWater}/${currentResTarget}L) to complete the mission! 💧`;
            } else {
              msg = levelId === 4
                ? `☀️ All 5 Desert Blooms Revived! ${villageName} is thriving! ✨`
                : (levelId === 3 
                    ? `🏔️ All 6 Alpine Blooms Revived! ${villageName} is thriving! ✨` 
                    : (levelId === 2 ? `🌻 All 5 Desert Blooms Revived! ${villageName} is thriving! ✨` : '🌸 All 4 Wildflowers Bloomed! Forest restored! ✨'));
            }
          } else {
            msg = `🌸 Flower Bloomed! (${bloomed}/${total} Blooms)`;
          }

          setDeliveryNotice(msg);
          if (deliveryTimerRef.current) {
            clearTimeout(deliveryTimerRef.current);
          }
          deliveryTimerRef.current = setTimeout(() => {
            setDeliveryNotice(null);
          }, 3200);
        }
      },
      onDeliveryConfirmed: (amount, currentTotal, targetTotal) => {
        const villageName = engineRef.current?.communityGoal.name || 
          (levelId === 4 ? 'Sunstone Oasis Village' : 
          (levelId === 3 ? 'Cloud Peaks Village' : 
          (levelId === 2 ? 'Sunflower Village' : 'Meadowood Village')));
        const currentBloomed = engineRef.current?.flowers.filter(f => f.isBloomed).length ?? flowersBloomed;
        const total = engineRef.current?.flowers.length ?? totalFlowers;
        const remainingFlowers = total - currentBloomed;

        if (currentTotal >= targetTotal && remainingFlowers > 0) {
          setDeliveryNotice(`💧 Reservoir Full (${currentTotal}/${targetTotal}L)! Revive ${remainingFlowers} more flower${remainingFlowers > 1 ? 's' : ''} to complete the mission! 🌸`);
        } else {
          setDeliveryNotice(`💧 +${amount}L Water Delivered to ${villageName}! (${currentTotal}/${targetTotal}L)`);
        }
        if (deliveryTimerRef.current) {
          clearTimeout(deliveryTimerRef.current);
        }
        deliveryTimerRef.current = setTimeout(() => {
          setDeliveryNotice(null);
        }, 3500);
      },
      onHazardWarning: (warning) => {
        setDeliveryNotice(warning);
        if (deliveryTimerRef.current) {
          clearTimeout(deliveryTimerRef.current);
        }
        deliveryTimerRef.current = setTimeout(() => {
          setDeliveryNotice(null);
        }, 2600);
      }
    }, levelId, difficulty);

    engineRef.current = engine;
    setWaterAmount(engine.player.waterAmount);
    setMaxWater(engine.player.maxWater);
    setReservoirWater(engine.communityGoal.currentWater);
    setReservoirTarget(engine.communityGoal.targetWater);
    setFlowersBloomed(engine.flowers.filter(f => f.isBloomed).length);
    setTotalFlowers(engine.flowers.length);
    setElapsedSeconds(0);
    setTimeRemaining(engine.timeRemaining);
    setIsHandPumpOpen(false);
    setIsFilterOpen(false);
    setIsTriviaOpen(false);
    setIsVictoryOpen(false);
    setIsDefeatOpen(false);
    setIsPauseOpen(false);

    if (rendererRef.current) {
      rendererRef.current.setLevel(levelId);
    }
  }, [levelId, difficulty]);

  // Setup Canvas, Resize, and Start Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new CanvasRenderer(ctx, canvas.width, canvas.height, levelId);
    initEngine();
    sound.startRiverAmbience();

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      canvas.width = width;
      canvas.height = height;

      if (rendererRef.current) {
        rendererRef.current.setDimensions(width, height);
      }
      if (engineRef.current) {
        engineRef.current.viewportWidth = width;
        engineRef.current.viewportHeight = height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'Escape') {
        setIsPauseOpen(prev => !prev);
        return;
      }
      engineRef.current?.handleKeyDown(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      engineRef.current?.handleKeyUp(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game Loop
    let running = true;
    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      if (!running) return;
      const delta = Math.min(0.1, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      const engine = engineRef.current;
      const renderer = rendererRef.current;

      if (engine && renderer && ctx) {
        engine.isPaused = (
          isPauseOpenRef.current || 
          isHandPumpOpenRef.current || 
          isFilterOpenRef.current ||
          isTriviaOpenRef.current || 
          isVictoryOpenRef.current || 
          isDefeatOpenRef.current ||
          isHowToPlayOpenRef.current
        );
        
        // Update game state
        engine.update(delta);
        setElapsedSeconds(Math.floor(engine.elapsedTime));
        if (engine.difficulty === 'hard') {
          setTimeRemaining(Math.max(0, Math.ceil(engine.timeRemaining)));
        }
        setActivePrompt(engine.player.activeInteractionPrompt);

        // Render scene
        renderer.clear();
        renderer.drawTerrain(engine.cameraX, engine.cameraY, currentTime * 0.001, levelId);
        renderer.drawRiver(engine.cameraX, engine.cameraY, currentTime * 0.001, levelId);
        renderer.drawBridges(engine.bridges, engine.cameraX, engine.cameraY, levelId);
        renderer.drawObstacles(engine.obstacles, engine.cameraX, engine.cameraY, currentTime * 0.001, levelId);
        renderer.drawWaterSource(engine.waterSource, engine.cameraX, engine.cameraY, currentTime * 0.001);
        renderer.drawFlowerBeds(engine.flowers, engine.cameraX, engine.cameraY, currentTime * 0.001);
        renderer.drawHandPump(engine.handPump, engine.cameraX, engine.cameraY, currentTime * 0.001, levelId);
        renderer.drawCommunityGoal(engine.communityGoal, engine.cameraX, engine.cameraY, currentTime * 0.001, levelId);
        renderer.drawTriviaStation(engine.triviaStation, engine.cameraX, engine.cameraY, currentTime * 0.001);
        renderer.drawButterflies(engine.butterflies, engine.cameraX, engine.cameraY);
        renderer.drawParticles(engine.particles, engine.cameraX, engine.cameraY);
        renderer.drawPlayer(engine.player, engine.cameraX, engine.cameraY, currentTime * 0.001);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (deliveryTimerRef.current) {
        clearTimeout(deliveryTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      sound.stopRiverAmbience();
    };
  }, [initEngine, levelId]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full overflow-hidden bg-slate-950 select-none touch-none overscroll-none"
      style={{ touchAction: 'none' }}
    >
      {/* Primary 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-default touch-none"
        style={{ touchAction: 'none' }}
      />

      {/* Modern HUD Header with Difficulty and Mission Counters */}
      <GameHUD
        waterAmount={waterAmount}
        maxWater={maxWater}
        reservoirWater={reservoirWater}
        reservoirTarget={reservoirTarget}
        flowersBloomed={flowersBloomed}
        totalFlowers={totalFlowers}
        elapsedSeconds={elapsedSeconds}
        timeRemaining={timeRemaining}
        difficulty={difficulty}
        onPause={() => setIsPauseOpen(true)}
        onExitToMap={onExitToMap}
      />

      {/* Cheerful Delivery Confirmation Banner */}
      {deliveryNotice && (
        <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all px-2 max-w-[92vw] text-center">
          <div className="px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-bold text-xs md:text-sm shadow-2xl backdrop-blur-md border border-white/30 flex items-center justify-center gap-2">
            <span>{deliveryNotice}</span>
          </div>
        </div>
      )}

      {/* On-Screen Touch Controls */}
      <TouchControls
        onMovementChange={(x, y) => {
          engineRef.current?.setVirtualMovement(x, y);
        }}
        onActionTrigger={() => {
          engineRef.current?.triggerActiveInteraction();
        }}
        actionLabel={activePrompt}
      />

      {/* Modals & Overlays */}
      {isHandPumpOpen && (
        <HandPumpModal
          onClose={() => setIsHandPumpOpen(false)}
          onComplete={() => {
            engineRef.current?.completeHandPump();
            setIsHandPumpOpen(false);
          }}
          targetPumps={engineRef.current?.handPump.targetPumps || 6}
          levelId={levelId}
        />
      )}

      {isFilterOpen && (
        <BiosandFilterModal
          onClose={() => setIsFilterOpen(false)}
          onComplete={() => {
            engineRef.current?.completeHandPump();
            setIsFilterOpen(false);
          }}
          targetPumps={engineRef.current?.handPump.targetPumps || 4}
          levelId={levelId}
        />
      )}

      {isTriviaOpen && currentTriviaQuestion && (
        <TriviaModal
          question={currentTriviaQuestion}
          onClose={() => setIsTriviaOpen(false)}
          onAnswerCorrect={() => {
            engineRef.current?.completeTrivia();
            setIsTriviaOpen(false);
          }}
        />
      )}

      {isVictoryOpen && (
        <VictoryModal
          villageName={engineRef.current?.communityGoal.name}
          stars={victoryStats.stars}
          timeSpent={victoryStats.time}
          waterDelivered={engineRef.current?.communityGoal.currentWater ?? reservoirWater}
          flowersBloomed={engineRef.current?.flowers.filter(f => f.isBloomed).length ?? flowersBloomed}
          totalFlowers={engineRef.current?.flowers.length ?? totalFlowers}
          onNextLevel={onNextLevel}
          onPlayAgain={initEngine}
          onExitToMap={onExitToMap}
          hasNextLevel={levelId < LEVELS.length}
        />
      )}

      {isDefeatOpen && (
        <DefeatModal
          reason={defeatReason}
          currentDifficulty={difficulty}
          onRetry={() => {
            setIsDefeatOpen(false);
            initEngine();
          }}
          onChangeDifficulty={(newDiff) => {
            setIsDefeatOpen(false);
            if (onChangeDifficulty) {
              onChangeDifficulty(newDiff);
            }
          }}
          onExitToMap={onExitToMap}
        />
      )}

      {isPauseOpen && (
        <PauseModal
          onResume={() => setIsPauseOpen(false)}
          onRestart={initEngine}
          onExitToMap={onExitToMap}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        />
      )}

      {isHowToPlayOpen && (
        <HowToPlayModal
          onClose={() => setIsHowToPlayOpen(false)}
        />
      )}
    </div>
  );
};
