export type ScreenState = 
  | 'TITLE'
  | 'MAP'
  | 'PLAYING'
  | 'PAUSED'
  | 'HAND_PUMP'
  | 'TRIVIA'
  | 'VICTORY';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
  facing: Direction;
  isMoving: boolean;
  walkCycle: number;
  waterAmount: number;
  maxWater: number;
  isNearWaterSource: boolean;
  isNearFlower: boolean;
  isNearPump: boolean;
  isNearCommunity: boolean;
  isNearTrivia: boolean;
  activeInteractionPrompt: string | null;
}

export interface WaterSource {
  id: string;
  x: number;
  y: number;
  radius: number;
  name: string;
  type: 'spring' | 'waterfall' | 'river_bank';
}

export interface FlowerBed {
  id: string;
  x: number;
  y: number;
  radius: number;
  waterRequired: number;
  waterGiven: number;
  isBloomed: boolean;
  bloomAnimation: number; // 0 to 1
  color: string;
  petals: number;
}

export interface HandPumpStation {
  id: string;
  x: number;
  y: number;
  radius: number;
  pumpsCompleted: number;
  targetPumps: number;
  isCompleted: boolean;
  waterStored: number;
}

export interface CommunityGoal {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  currentWater: number;
  targetWater: number;
  isCompleted: boolean;
}

export interface TriviaStation {
  id: string;
  x: number;
  y: number;
  radius: number;
  isCompleted: boolean;
}

export type DifficultyMode = 'easy' | 'normal' | 'hard';

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'tree' | 'rock' | 'mud' | 'log' | 'water_barrier' | 'heat_crack' | 'canyon_rock' | 'acacia_tree' | 'mist_patch' | 'ice_patch' | 'alpine_rock' | 'pine_tree' | 'palm_tree' | 'sunstone_rock' | 'dune_patch';
  solid: boolean;
  slowdown?: number; // e.g. 0.5 for mud
}

export interface Bridge {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RiverSegment {
  points: { x: number; y: number }[];
  width: number;
}

export interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  color: string;
  wingAngle: number;
  wingSpeed: number;
}

export interface GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'water_drop' | 'ripple' | 'petal' | 'confetti' | 'sparkle' | 'steam' | 'mist';
  rotation?: number;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact: string;
}

export interface WaterFact {
  id: string;
  title: string;
  fact: string;
  impact: string;
  category: 'access' | 'health' | 'education' | 'solutions';
}

export interface LevelDefinition {
  id: number;
  title: string;
  region: string;
  description: string;
  tagline: string;
  unlocked: boolean;
  stars: number;
  parTimeSeconds: number;
  targetWater: number;
  flowerCount: number;
  triviaQuestions: TriviaQuestion[];
  keyFacts: string[];
}

export interface LevelSaveData {
  stars: number;
  completed: boolean;
  bestTime: number;
}
