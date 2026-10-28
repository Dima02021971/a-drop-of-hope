/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { LevelMap } from './components/LevelMap';
import { GameView } from './components/GameView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { FactsDrawer } from './components/FactsDrawer';
import { LevelSaveData, DifficultyMode } from './types/game';

type AppScreen = 'TITLE' | 'MAP' | 'PLAYING';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('TITLE');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isFactsOpen, setIsFactsOpen] = useState(false);

  // Difficulty Mode selection (Easy, Normal, Hard) persisted across sessions
  const [difficulty, setDifficulty] = useState<DifficultyMode>(() => {
    try {
      const saved = localStorage.getItem('drop_of_hope_difficulty');
      if (saved === 'easy' || saved === 'normal' || saved === 'hard') {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'normal';
  });

  useEffect(() => {
    try {
      localStorage.setItem('drop_of_hope_difficulty', difficulty);
    } catch {
      // Ignore
    }
  }, [difficulty]);

  // Persistent progress in localStorage (preserving completed levels and earned stars)
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelSaveData>>(() => {
    try {
      const saved = localStorage.getItem('drop_of_hope_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {
      1: { stars: 0, completed: false, bestTime: 0 }
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('drop_of_hope_progress', JSON.stringify(levelProgress));
    } catch {
      // Ignore
    }
  }, [levelProgress]);

  const totalStars = Object.values(levelProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  const handleStartGame = (levelId: number = 1) => {
    setActiveLevelId(levelId);
    setCurrentScreen('PLAYING');
  };

  const handleLevelCompleted = (levelId: number, stars: number, timeSpent: number) => {
    setLevelProgress(prev => {
      const existing = prev[levelId] || { stars: 0, completed: false, bestTime: 9999 };
      return {
        ...prev,
        [levelId]: {
          stars: Math.max(existing.stars, stars),
          completed: true,
          bestTime: existing.bestTime > 0 ? Math.min(existing.bestTime, timeSpent) : timeSpent
        },
        // Unlock next level if not already present
        [levelId + 1]: prev[levelId + 1] || { stars: 0, completed: false, bestTime: 0 }
      };
    });
  };

  const handleNextLevel = () => {
    const nextId = activeLevelId + 1;
    setActiveLevelId(nextId);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center">
      {currentScreen === 'TITLE' && (
        <TitleScreen
          onPlay={() => handleStartGame(1)}
          onOpenMap={() => setCurrentScreen('MAP')}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenFacts={() => setIsFactsOpen(true)}
          totalStars={totalStars}
        />
      )}

      {currentScreen === 'MAP' && (
        <LevelMap
          onBack={() => setCurrentScreen('TITLE')}
          onSelectLevel={(levelId) => handleStartGame(levelId)}
          levelProgress={levelProgress}
          currentDifficulty={difficulty}
          onChangeDifficulty={(newDiff) => setDifficulty(newDiff)}
        />
      )}

      {currentScreen === 'PLAYING' && (
        <GameView
          key={`${activeLevelId}-${difficulty}`}
          levelId={activeLevelId}
          difficulty={difficulty}
          onChangeDifficulty={(newDiff) => setDifficulty(newDiff)}
          onExitToMap={() => setCurrentScreen('MAP')}
          onLevelCompleted={handleLevelCompleted}
          onNextLevel={handleNextLevel}
        />
      )}

      {/* Global Modals from Title Screen */}
      {isHowToPlayOpen && (
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
      )}

      {isFactsOpen && (
        <FactsDrawer onClose={() => setIsFactsOpen(false)} />
      )}
    </div>
  );
}
