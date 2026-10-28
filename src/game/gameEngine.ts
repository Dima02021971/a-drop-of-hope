import { 
  Player, 
  WaterSource, 
  FlowerBed, 
  HandPumpStation, 
  CommunityGoal, 
  TriviaStation, 
  Obstacle, 
  Bridge, 
  Butterfly, 
  GameParticle,
  DifficultyMode 
} from '../types/game';
import { sound } from '../audio/soundEngine';

export interface GameEngineCallbacks {
  onOpenHandPump: () => void;
  onOpenFilter?: () => void;
  onOpenTrivia: () => void;
  onVictory: (stars: number, timeSpent: number) => void;
  onDefeat?: (reason: string) => void;
  onWaterUpdated: (current: number, max: number) => void;
  onGoalUpdated: (current: number, target: number) => void;
  onFlowersUpdated: (bloomed: number, total: number) => void;
  onDeliveryConfirmed?: (amount: number, currentTotal: number, targetTotal: number) => void;
  onHazardWarning?: (message: string) => void;
}

export class GameEngine {
  public levelId: number;
  public difficulty: DifficultyMode;
  public player: Player;
  public waterSource: WaterSource;
  public flowers: FlowerBed[];
  public handPump: HandPumpStation;
  public communityGoal: CommunityGoal;
  public triviaStation: TriviaStation;
  public obstacles: Obstacle[];
  public bridges: Bridge[];
  public butterflies: Butterfly[];
  public particles: GameParticle[];
  
  public cameraX: number = 0;
  public cameraY: number = 0;
  public viewportWidth: number = 1000;
  public viewportHeight: number = 650;
  public worldWidth: number = 1150;
  public worldHeight: number = 850;

  public isPaused: boolean = false;
  public elapsedTime: number = 0;
  public timeRemaining: number = 0;
  public isCompleted: boolean = false;
  private heatTimer: number = 0;

  private keysDown: Set<string> = new Set();
  private virtualMovement: { x: number; y: number } = { x: 0, y: 0 };
  private callbacks: GameEngineCallbacks;

  constructor(callbacks: GameEngineCallbacks, levelId: number = 1, difficulty: DifficultyMode = 'normal') {
    this.callbacks = callbacks;
    this.levelId = levelId;
    this.difficulty = difficulty;

    // Satchel capacity based on difficulty (Easy: 120L, Normal: 100L, Hard: 80L)
    const satchelCapacity = difficulty === 'easy' ? 120 : (difficulty === 'hard' ? 80 : 100);

    // Initial countdown time for Hard Mode
    if (difficulty === 'hard') {
      const timeLimits: Record<number, number> = { 1: 140, 2: 160, 3: 180, 4: 200 };
      this.timeRemaining = timeLimits[levelId] || 180;
    } else {
      this.timeRemaining = 0;
    }

    // Initial player state (Hippry starts on the western path near the spring)
    this.player = {
      x: levelId === 2 ? 170 : 180,
      y: levelId === 2 ? 370 : 380,
      vx: 0,
      vy: 0,
      speed: 3.2,
      radius: 16,
      facing: 'right',
      isMoving: false,
      walkCycle: 0,
      waterAmount: 0,
      maxWater: satchelCapacity,
      isNearWaterSource: false,
      isNearFlower: false,
      isNearPump: false,
      isNearCommunity: false,
      isNearTrivia: false,
      activeInteractionPrompt: null
    };

    if (levelId === 4) {
      // LEVEL 4: Sunstone Dunes: Oasis Crossing & The Biosand Filter
      // Water Source: Sunstone Oasis (crystal emerald-blue spring in the desert oasis)
      this.waterSource = {
        id: 'oasis-spring-4',
        x: 140,
        y: 190,
        radius: 36,
        name: 'Sunstone Oasis',
        type: 'spring'
      };

      // 5 Thirsty Desert Blooms across the dunes
      this.flowers = [
        {
          id: 'desert-flower-1',
          x: 280,
          y: 260,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f43f5e', // Desert Rose (Coral Red)
          petals: 5
        },
        {
          id: 'desert-flower-2',
          x: 370,
          y: 490,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#fbbf24', // Prickly Pear Cactus Flower (Sun Gold)
          petals: 6
        },
        {
          id: 'desert-flower-3',
          x: 690,
          y: 230,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f8fafc', // Dune Lily (Silvery White)
          petals: 6
        },
        {
          id: 'desert-flower-4',
          x: 780,
          y: 480,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#e11d48', // Red Yucca Blossom (Crimson Spike)
          petals: 5
        },
        {
          id: 'desert-flower-5',
          x: 880,
          y: 590,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#c084fc', // Desert Sand Verbena (Lavender Purple)
          petals: 6
        }
      ];

      // Biosand Filtration Station
      this.handPump = {
        id: 'station-biosand-4',
        x: 400,
        y: 190,
        radius: 32,
        pumpsCompleted: 0,
        targetPumps: 4,
        isCompleted: false,
        waterStored: 0
      };

      // Sunstone Oasis Village Community Reservoir (Target: 100L clean water)
      this.communityGoal = {
        id: 'village-sunstone-4',
        x: 930,
        y: 350,
        width: 90,
        height: 90,
        name: 'Sunstone Oasis Village',
        currentWater: 0,
        targetWater: 100,
        isCompleted: false
      };

      // Trivia Knowledge Checkpoint (Biosand Filtration & Disinfection Principles)
      this.triviaStation = {
        id: 'trivia-marker-4',
        x: 820,
        y: 220,
        radius: 26,
        isCompleted: false
      };

      // Sandstone & Timber bridges across oasis stream
      this.bridges = [
        { id: 'bridge-main-4', x: 450, y: 345, width: 160, height: 70 },
        { id: 'bridge-north-4', x: 450, y: 150, width: 160, height: 60 }
      ];

      // Level 4 Obstacles: Sunstone Crags, Date Palms, Desert Shifting Sand Patches, Scorching Heat Cracks
      this.obstacles = [
        // Environmental Hazards: Scorching Desert Heat Sand & Cracks
        { id: 'heat-4-1', x: 300, y: 350, width: 75, height: 50, type: 'heat_crack', solid: false, slowdown: 0.72 },
        { id: 'heat-4-2', x: 670, y: 360, width: 80, height: 55, type: 'heat_crack', solid: false, slowdown: 0.72 },
        { id: 'heat-4-3', x: 740, y: 570, width: 75, height: 50, type: 'heat_crack', solid: false, slowdown: 0.72 },

        // Sunstone Rock Crags & Desert Boulders
        { id: 'crag-4-1', x: 230, y: 140, width: 48, height: 42, type: 'sunstone_rock', solid: true },
        { id: 'crag-4-2', x: 790, y: 340, width: 50, height: 44, type: 'sunstone_rock', solid: true },
        { id: 'crag-4-3', x: 330, y: 560, width: 46, height: 40, type: 'sunstone_rock', solid: true },
        { id: 'crag-4-4', x: 680, y: 520, width: 44, height: 38, type: 'sunstone_rock', solid: true },

        // Oasis Date Palms
        { id: 'palm-1', x: 60, y: 80, width: 70, height: 88, type: 'palm_tree', solid: true },
        { id: 'palm-2', x: 190, y: 40, width: 72, height: 92, type: 'palm_tree', solid: true },
        { id: 'palm-3', x: 50, y: 310, width: 70, height: 86, type: 'palm_tree', solid: true },
        { id: 'palm-4', x: 60, y: 530, width: 74, height: 92, type: 'palm_tree', solid: true },
        { id: 'palm-5', x: 190, y: 640, width: 72, height: 90, type: 'palm_tree', solid: true },
        { id: 'palm-6', x: 410, y: 640, width: 74, height: 92, type: 'palm_tree', solid: true },
        
        // East side date palms
        { id: 'palm-7', x: 640, y: 70, width: 72, height: 90, type: 'palm_tree', solid: true },
        { id: 'palm-8', x: 890, y: 80, width: 75, height: 94, type: 'palm_tree', solid: true },
        { id: 'palm-9', x: 1040, y: 190, width: 72, height: 88, type: 'palm_tree', solid: true },
        { id: 'palm-10', x: 1050, y: 510, width: 76, height: 94, type: 'palm_tree', solid: true },
        { id: 'palm-11', x: 880, y: 650, width: 74, height: 92, type: 'palm_tree', solid: true },
        { id: 'palm-12', x: 650, y: 670, width: 72, height: 90, type: 'palm_tree', solid: true }
      ];

      // Desert Swallowtail & Golden Sun Butterflies
      this.butterflies = [
        { x: 280, y: 250, vx: 0.4, vy: 0.3, targetX: 300, targetY: 240, color: '#f59e0b', wingAngle: 0, wingSpeed: 0.28 },
        { x: 700, y: 220, vx: -0.4, vy: 0.3, targetX: 680, targetY: 240, color: '#06b6d4', wingAngle: 1, wingSpeed: 0.32 },
        { x: 390, y: 480, vx: 0.3, vy: -0.3, targetX: 400, targetY: 460, color: '#f43f5e', wingAngle: 2, wingSpeed: 0.26 },
        { x: 780, y: 470, vx: -0.4, vy: -0.2, targetX: 760, targetY: 490, color: '#c084fc', wingAngle: 3, wingSpeed: 0.3 }
      ];

    } else if (levelId === 3) {
      // LEVEL 3: Cloud Peaks: Highland Mist & The Gravity Cistern
      // Water Source: Glacial Snowmelt Spring at high mountain altitude
      this.waterSource = {
        id: 'glacial-spring-3',
        x: 140,
        y: 190,
        radius: 36,
        name: 'Glacial Spring',
        type: 'spring'
      };

      // 6 Thirsty Alpine Blooms distributed across mountain trails
      this.flowers = [
        {
          id: 'alpine-flower-1',
          x: 270,
          y: 260,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f8fafc', // Alpine Edelweiss (Silver-White)
          petals: 6
        },
        {
          id: 'alpine-flower-2',
          x: 380,
          y: 490,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#2563eb', // Mountain Gentian (Deep Alpine Blue)
          petals: 5
        },
        {
          id: 'alpine-flower-3',
          x: 690,
          y: 230,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#ec4899', // Highland Heather (Vibrant Pink/Magenta)
          petals: 7
        },
        {
          id: 'alpine-flower-4',
          x: 770,
          y: 480,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#38bdf8', // Glacier Aster (Frost Cyan)
          petals: 6
        },
        {
          id: 'alpine-flower-5',
          x: 880,
          y: 590,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#facc15', // Alpine Snow Poppy (Golden Sunrise)
          petals: 5
        },
        {
          id: 'alpine-flower-6',
          x: 320,
          y: 640,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#c084fc', // Cloud Peak Bellflower (Lavender Violet)
          petals: 6
        }
      ];

      // Gravity Intake Siphon Station (primes pipes for downhill gravity flow)
      this.handPump = {
        id: 'pump-gravity-3',
        x: 400,
        y: 190,
        radius: 32,
        pumpsCompleted: 0,
        targetPumps: 6,
        isCompleted: false,
        waterStored: 0
      };

      // Cloud Peaks Village Community Reservoir (Target: 200L clean water)
      this.communityGoal = {
        id: 'village-cistern-3',
        x: 930,
        y: 350,
        width: 90,
        height: 90,
        name: 'Cloud Peaks Village',
        currentWater: 0,
        targetWater: 200,
        isCompleted: false
      };

      // Trivia Knowledge Checkpoint (Mountain Gravity-Fed Systems)
      this.triviaStation = {
        id: 'trivia-marker-3',
        x: 820,
        y: 220,
        radius: 26,
        isCompleted: false
      };

      // Mountain Suspension Timber Bridges across the glacial canyon
      this.bridges = [
        { id: 'bridge-main-3', x: 450, y: 345, width: 160, height: 70 },
        { id: 'bridge-north-3', x: 450, y: 150, width: 160, height: 60 }
      ];

      // Level 3 Obstacles: Alpine Granite Crags, Tall Mountain Pines, Scree & Mist Patches
      this.obstacles = [
        // Environmental Hazards: Mountain Mist & Slippery Scree
        { id: 'mist-1', x: 300, y: 350, width: 75, height: 50, type: 'mist_patch', solid: false, slowdown: 0.72 },
        { id: 'mist-2', x: 670, y: 360, width: 80, height: 55, type: 'mist_patch', solid: false, slowdown: 0.72 },
        { id: 'mist-3', x: 740, y: 570, width: 75, height: 50, type: 'mist_patch', solid: false, slowdown: 0.72 },

        // Alpine Granite Boulders / Crags
        { id: 'crag-1', x: 230, y: 140, width: 48, height: 42, type: 'alpine_rock', solid: true },
        { id: 'crag-2', x: 790, y: 340, width: 50, height: 44, type: 'alpine_rock', solid: true },
        { id: 'crag-3', x: 330, y: 560, width: 46, height: 40, type: 'alpine_rock', solid: true },
        { id: 'crag-4', x: 680, y: 520, width: 44, height: 38, type: 'alpine_rock', solid: true },

        // Alpine Pines / Mountain Fir Conifers
        { id: 'tree-1', x: 60, y: 80, width: 70, height: 88, type: 'pine_tree', solid: true },
        { id: 'tree-2', x: 190, y: 40, width: 72, height: 92, type: 'pine_tree', solid: true },
        { id: 'tree-3', x: 50, y: 310, width: 70, height: 86, type: 'pine_tree', solid: true },
        { id: 'tree-4', x: 60, y: 530, width: 74, height: 92, type: 'pine_tree', solid: true },
        { id: 'tree-5', x: 190, y: 640, width: 72, height: 90, type: 'pine_tree', solid: true },
        { id: 'tree-6', x: 410, y: 640, width: 74, height: 92, type: 'pine_tree', solid: true },
        
        // East side mountain pines
        { id: 'tree-7', x: 640, y: 70, width: 72, height: 90, type: 'pine_tree', solid: true },
        { id: 'tree-8', x: 890, y: 80, width: 75, height: 94, type: 'pine_tree', solid: true },
        { id: 'tree-9', x: 1040, y: 190, width: 72, height: 88, type: 'pine_tree', solid: true },
        { id: 'tree-10', x: 1050, y: 510, width: 76, height: 94, type: 'pine_tree', solid: true },
        { id: 'tree-11', x: 880, y: 650, width: 74, height: 92, type: 'pine_tree', solid: true },
        { id: 'tree-12', x: 650, y: 670, width: 72, height: 90, type: 'pine_tree', solid: true }
      ];

      // Mountain Apollo & Glacier Blue Parnassian Butterflies
      this.butterflies = [
        { x: 280, y: 250, vx: 0.4, vy: 0.3, targetX: 300, targetY: 240, color: '#e0f2fe', wingAngle: 0, wingSpeed: 0.28 },
        { x: 700, y: 220, vx: -0.4, vy: 0.3, targetX: 680, targetY: 240, color: '#38bdf8', wingAngle: 1, wingSpeed: 0.32 },
        { x: 390, y: 480, vx: 0.3, vy: -0.3, targetX: 400, targetY: 460, color: '#f8fafc', wingAngle: 2, wingSpeed: 0.26 },
        { x: 780, y: 470, vx: -0.4, vy: -0.2, targetX: 760, targetY: 490, color: '#c084fc', wingAngle: 3, wingSpeed: 0.3 }
      ];

    } else if (levelId === 2) {
      // LEVEL 2: The Dry Valley & Sunflower Village
      // Water Source: Oasis Spring (crystal oasis water in the canyon)
      this.waterSource = {
        id: 'oasis-spring-2',
        x: 140,
        y: 190,
        radius: 36,
        name: 'Oasis Spring',
        type: 'spring'
      };

      // 5 Thirsty Desert Wildflowers scattered across The Dry Valley
      this.flowers = [
        {
          id: 'valley-flower-1',
          x: 280,
          y: 260,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f59e0b', // Desert Marigold (Warm Amber)
          petals: 6
        },
        {
          id: 'valley-flower-2',
          x: 370,
          y: 490,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#ef4444', // Scarlet Valley Blossom
          petals: 5
        },
        {
          id: 'valley-flower-3',
          x: 690,
          y: 240,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#eab308', // Sunflower Valley Bloom
          petals: 8
        },
        {
          id: 'valley-flower-4',
          x: 760,
          y: 480,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#c084fc', // Amethyst Desert Thistle
          petals: 6
        },
        {
          id: 'valley-flower-5',
          x: 870,
          y: 590,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f97316', // Sunfire Desert Lily
          petals: 7
        }
      ];

      // Deep Borehole Well Station
      this.handPump = {
        id: 'pump-valley-2',
        x: 400,
        y: 190,
        radius: 32,
        pumpsCompleted: 0,
        targetPumps: 6,
        isCompleted: false,
        waterStored: 0
      };

      // Sunflower Village Goal Cistern (100L capacity)
      this.communityGoal = {
        id: 'village-cistern-2',
        x: 930,
        y: 350,
        width: 90,
        height: 90,
        name: 'Sunflower Village',
        currentWater: 0,
        targetWater: 100,
        isCompleted: false
      };

      // Trivia Knowledge Checkpoint
      this.triviaStation = {
        id: 'trivia-marker-2',
        x: 820,
        y: 220,
        radius: 26,
        isCompleted: false
      };

      // Wooden Bridges crossing the river
      this.bridges = [
        { id: 'bridge-main-2', x: 450, y: 345, width: 160, height: 70 },
        { id: 'bridge-north-2', x: 450, y: 150, width: 160, height: 60 }
      ];

      // Level 2 Obstacles: Sun-baked heat cracks, Canyon boulders, Acacia trees
      this.obstacles = [
        // Environmental Hazard: Sun-baked heat fissures (water evaporates if standing here!)
        { id: 'heat-1', x: 300, y: 350, width: 75, height: 50, type: 'heat_crack', solid: false },
        { id: 'heat-2', x: 670, y: 440, width: 80, height: 55, type: 'heat_crack', solid: false },
        { id: 'heat-3', x: 740, y: 570, width: 75, height: 50, type: 'heat_crack', solid: false },

        // Red Canyon Boulders
        { id: 'canyon-rock-1', x: 230, y: 140, width: 46, height: 40, type: 'rock', solid: true },
        { id: 'canyon-rock-2', x: 790, y: 290, width: 48, height: 42, type: 'rock', solid: true },
        { id: 'canyon-rock-3', x: 330, y: 570, width: 44, height: 38, type: 'rock', solid: true },
        { id: 'canyon-rock-4', x: 680, y: 520, width: 42, height: 36, type: 'rock', solid: true },

        // Savannah & Valley Acacia Trees (sparingly distributed)
        { id: 'tree-1', x: 60, y: 80, width: 72, height: 85, type: 'tree', solid: true },
        { id: 'tree-2', x: 190, y: 40, width: 75, height: 90, type: 'tree', solid: true },
        { id: 'tree-3', x: 50, y: 310, width: 72, height: 86, type: 'tree', solid: true },
        { id: 'tree-4', x: 60, y: 530, width: 76, height: 92, type: 'tree', solid: true },
        { id: 'tree-5', x: 190, y: 640, width: 72, height: 88, type: 'tree', solid: true },
        { id: 'tree-6', x: 410, y: 640, width: 74, height: 90, type: 'tree', solid: true },
        
        // East side trees
        { id: 'tree-7', x: 640, y: 70, width: 74, height: 90, type: 'tree', solid: true },
        { id: 'tree-8', x: 890, y: 80, width: 76, height: 92, type: 'tree', solid: true },
        { id: 'tree-9', x: 1040, y: 190, width: 72, height: 88, type: 'tree', solid: true },
        { id: 'tree-10', x: 1050, y: 510, width: 76, height: 94, type: 'tree', solid: true },
        { id: 'tree-11', x: 880, y: 650, width: 74, height: 90, type: 'tree', solid: true },
        { id: 'tree-12', x: 650, y: 670, width: 72, height: 88, type: 'tree', solid: true }
      ];

      // Desert Pollinators & Golden Butterflies
      this.butterflies = [
        { x: 290, y: 250, vx: 0.5, vy: 0.4, targetX: 310, targetY: 240, color: '#f59e0b', wingAngle: 0, wingSpeed: 0.28 },
        { x: 700, y: 230, vx: -0.4, vy: 0.3, targetX: 680, targetY: 250, color: '#eab308', wingAngle: 1, wingSpeed: 0.32 },
        { x: 380, y: 480, vx: 0.3, vy: -0.4, targetX: 390, targetY: 460, color: '#ef4444', wingAngle: 2, wingSpeed: 0.26 },
        { x: 770, y: 470, vx: -0.5, vy: -0.2, targetX: 750, targetY: 490, color: '#c084fc', wingAngle: 3, wingSpeed: 0.3 }
      ];

    } else {
      // LEVEL 1: Whispering River & Meadowood Village (Preserved exactly as designed)
      this.waterSource = {
        id: 'river-spring-1',
        x: 140,
        y: 190,
        radius: 36,
        name: 'Crystal Spring',
        type: 'spring'
      };

      // 4 Wilted Wildflower beds positioned across the trail
      this.flowers = [
        {
          id: 'flower-1',
          x: 290,
          y: 280,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#f43f5e', // ruby rose
          petals: 5
        },
        {
          id: 'flower-2',
          x: 390,
          y: 470,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#eab308', // golden sunflower
          petals: 6
        },
        {
          id: 'flower-3',
          x: 690,
          y: 290,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#a855f7', // royal violet
          petals: 5
        },
        {
          id: 'flower-4',
          x: 740,
          y: 530,
          radius: 20,
          waterRequired: 20,
          waterGiven: 0,
          isBloomed: false,
          bloomAnimation: 0,
          color: '#06b6d4', // bright cyan bellflower
          petals: 6
        }
      ];

      // Forest Hand-Pump Station
      this.handPump = {
        id: 'pump-forest-1',
        x: 410,
        y: 190,
        radius: 32,
        pumpsCompleted: 0,
        targetPumps: 6,
        isCompleted: false,
        waterStored: 0
      };

      // Community Village Goal Cistern
      this.communityGoal = {
        id: 'village-cistern-1',
        x: 930,
        y: 350,
        width: 90,
        height: 90,
        name: 'Meadowood Village',
        currentWater: 0,
        targetWater: 100,
        isCompleted: false
      };

      // Trivia Knowledge Checkpoint
      this.triviaStation = {
        id: 'trivia-marker-1',
        x: 820,
        y: 220,
        radius: 26,
        isCompleted: false
      };

      // Wooden Bridges crossing the river
      this.bridges = [
        { id: 'bridge-main', x: 450, y: 345, width: 160, height: 70 },
        { id: 'bridge-north', x: 450, y: 150, width: 160, height: 60 }
      ];

      // Obstacles: Trees, Rocks, Mud Patches, River Barrier
      this.obstacles = [
        // Mud patches (slow movement)
        { id: 'mud-1', x: 310, y: 350, width: 60, height: 45, type: 'mud', solid: false, slowdown: 0.5 },
        { id: 'mud-2', x: 670, y: 410, width: 70, height: 50, type: 'mud', solid: false, slowdown: 0.5 },

        // Boulders / Rocks
        { id: 'rock-1', x: 230, y: 150, width: 44, height: 38, type: 'rock', solid: true },
        { id: 'rock-2', x: 790, y: 470, width: 48, height: 42, type: 'rock', solid: true },
        { id: 'rock-3', x: 330, y: 550, width: 40, height: 36, type: 'rock', solid: true },

        // Forest Trees
        { id: 'tree-1', x: 60, y: 80, width: 68, height: 85, type: 'tree', solid: true },
        { id: 'tree-2', x: 190, y: 40, width: 72, height: 90, type: 'tree', solid: true },
        { id: 'tree-3', x: 50, y: 310, width: 70, height: 86, type: 'tree', solid: true },
        { id: 'tree-4', x: 60, y: 530, width: 75, height: 92, type: 'tree', solid: true },
        { id: 'tree-5', x: 190, y: 640, width: 70, height: 88, type: 'tree', solid: true },
        { id: 'tree-6', x: 410, y: 640, width: 72, height: 90, type: 'tree', solid: true },
        
        // East side trees
        { id: 'tree-7', x: 640, y: 70, width: 72, height: 90, type: 'tree', solid: true },
        { id: 'tree-8', x: 890, y: 90, width: 74, height: 92, type: 'tree', solid: true },
        { id: 'tree-9', x: 1040, y: 190, width: 70, height: 88, type: 'tree', solid: true },
        { id: 'tree-10', x: 1050, y: 510, width: 75, height: 94, type: 'tree', solid: true },
        { id: 'tree-11', x: 880, y: 650, width: 72, height: 90, type: 'tree', solid: true },
        { id: 'tree-12', x: 650, y: 670, width: 70, height: 88, type: 'tree', solid: true }
      ];

      // Butterflies fluttering peacefully
      this.butterflies = [
        { x: 300, y: 270, vx: 0.5, vy: 0.4, targetX: 320, targetY: 260, color: '#f59e0b', wingAngle: 0, wingSpeed: 0.25 },
        { x: 700, y: 300, vx: -0.4, vy: 0.3, targetX: 680, targetY: 310, color: '#38bdf8', wingAngle: 1, wingSpeed: 0.3 },
        { x: 400, y: 480, vx: 0.3, vy: -0.4, targetX: 410, targetY: 460, color: '#ec4899', wingAngle: 2, wingSpeed: 0.28 },
        { x: 760, y: 520, vx: -0.5, vy: -0.2, targetX: 740, targetY: 540, color: '#10b981', wingAngle: 3, wingSpeed: 0.26 }
      ];
    }

    this.particles = [];
  }

  // Key Listeners
  public handleKeyDown(code: string) {
    this.keysDown.add(code);

    if (code === 'Space' || code === 'KeyE' || code === 'Enter') {
      this.triggerActiveInteraction();
    }
  }

  public handleKeyUp(code: string) {
    this.keysDown.delete(code);
  }

  // Touch / Virtual Joystick input
  public setVirtualMovement(x: number, y: number) {
    this.virtualMovement = { x, y };
  }

  // Trigger primary action (Space / Action Button)
  public triggerActiveInteraction() {
    if (this.isPaused || this.isCompleted) return;

    // 1. Water Source (Collect fresh water)
    if (this.player.isNearWaterSource) {
      if (this.player.waterAmount < this.player.maxWater) {
        this.player.waterAmount = this.player.maxWater;
        sound.playWaterCollect();
        this.spawnWaterRipples(this.player.x, this.player.y, '#38bdf8');
        this.callbacks.onWaterUpdated(this.player.waterAmount, this.player.maxWater);
      }
      return;
    }

    // 2. Hand-Pump / Biosand Filter Station
    if (this.player.isNearPump) {
      if (this.levelId === 4 && this.callbacks.onOpenFilter) {
        this.callbacks.onOpenFilter();
      } else {
        this.callbacks.onOpenHandPump();
      }
      return;
    }

    // 3. Flower Bed (Water flower)
    if (this.player.isNearFlower) {
      const nearFlower = this.flowers.find(f => {
        const dx = this.player.x - f.x;
        const dy = this.player.y - f.y;
        return Math.hypot(dx, dy) < f.radius + 42 && !f.isBloomed;
      });

      if (nearFlower && this.player.waterAmount >= 20) {
        this.player.waterAmount -= 20;
        nearFlower.waterGiven = nearFlower.waterRequired;
        nearFlower.isBloomed = true;
        nearFlower.bloomAnimation = 0.05; // start smooth blooming growth animation
        sound.playFlowerBloom();
        this.spawnPetalBurst(nearFlower.x, nearFlower.y, nearFlower.color);
        this.callbacks.onWaterUpdated(this.player.waterAmount, this.player.maxWater);
        
        const bloomedCount = this.flowers.filter(f => f.isBloomed).length;
        this.callbacks.onFlowersUpdated(bloomedCount, this.flowers.length);

        if (this.communityGoal.isCompleted) {
          this.checkMissionComplete();
        }
      } else if (nearFlower && this.player.waterAmount < 20) {
        sound.playButtonClick();
      }
      return;
    }

    // 4. Community Cistern Goal (Deliver water)
    if (this.player.isNearCommunity) {
      if (this.player.waterAmount > 0 && !this.communityGoal.isCompleted) {
        const needed = this.communityGoal.targetWater - this.communityGoal.currentWater;
        const deliverAmount = Math.min(this.player.waterAmount, needed);

        this.communityGoal.currentWater += deliverAmount;
        this.player.waterAmount -= deliverAmount;
        sound.playWaterDeliver();
        this.spawnWaterRipples(this.communityGoal.x + 45, this.communityGoal.y + 45, '#38bdf8');

        // Spawn delivery sparkles
        for (let i = 0; i < 14; i++) {
          this.particles.push({
            x: this.communityGoal.x + Math.random() * this.communityGoal.width,
            y: this.communityGoal.y + Math.random() * this.communityGoal.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2.5,
            life: 1.2 + Math.random() * 0.6,
            maxLife: 1.8,
            color: '#38bdf8',
            size: 4 + Math.random() * 4,
            type: 'sparkle'
          });
        }

        this.callbacks.onWaterUpdated(this.player.waterAmount, this.player.maxWater);
        this.callbacks.onGoalUpdated(this.communityGoal.currentWater, this.communityGoal.targetWater);

        if (this.callbacks.onDeliveryConfirmed) {
          this.callbacks.onDeliveryConfirmed(deliverAmount, this.communityGoal.currentWater, this.communityGoal.targetWater);
        }

        if (this.communityGoal.currentWater >= this.communityGoal.targetWater) {
          this.communityGoal.isCompleted = true;
          this.checkMissionComplete();
        }
      }
      return;
    }

    // 5. Trivia Station
    if (this.player.isNearTrivia && !this.triviaStation.isCompleted) {
      this.callbacks.onOpenTrivia();
      return;
    }
  }

  // Update Game Physics & State each frame
  public update(delta: number) {
    if (this.isPaused || this.isCompleted) return;

    this.elapsedTime += delta;

    // Hard Mode Countdown Timer
    if (this.difficulty === 'hard') {
      this.timeRemaining -= delta;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.isCompleted = true;
        sound.playGameOver();
        if (this.callbacks.onDefeat) {
          this.callbacks.onDefeat('Out of Time!');
        }
        return;
      }
    }

    // Movement calculation
    let moveX = 0;
    let moveY = 0;

    // Keyboard controls (WASD & Arrow Keys)
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) moveY -= 1;
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) moveY += 1;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) moveX -= 1;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) moveX += 1;

    // Touch joystick override
    if (this.virtualMovement.x !== 0 || this.virtualMovement.y !== 0) {
      moveX = this.virtualMovement.x;
      moveY = this.virtualMovement.y;
    }

    // Normalize diagonal velocity
    const len = Math.hypot(moveX, moveY);
    if (len > 0) {
      moveX = (moveX / len);
      moveY = (moveY / len);
      this.player.isMoving = true;
      this.player.walkCycle += delta * 9;

      // Facing direction
      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.player.facing = moveX > 0 ? 'right' : 'left';
      } else {
        this.player.facing = moveY > 0 ? 'down' : 'up';
      }
    } else {
      this.player.isMoving = false;
    }

    // Check Mud slowdown
    let currentSpeed = this.player.speed;
    const inMud = this.obstacles.some(obs => 
      obs.type === 'mud' &&
      this.player.x >= obs.x && 
      this.player.x <= obs.x + obs.width &&
      this.player.y >= obs.y && 
      this.player.y <= obs.y + obs.height
    );
    if (inMud) {
      currentSpeed *= 0.52;
    }

    // Environmental Hazard (Level 3: Mountain Mist & Slippery Scree)
    const inMist = this.obstacles.some(obs =>
      obs.type === 'mist_patch' &&
      this.player.x >= obs.x &&
      this.player.x <= obs.x + obs.width &&
      this.player.y >= obs.y &&
      this.player.y <= obs.y + obs.height
    );

    if (inMist) {
      currentSpeed *= 0.72; // slight slowdown on misty scree
      // Swirling mountain mist puffs
      if (Math.random() < 0.25) {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 16,
          y: this.player.y + 6 + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.4,
          life: 0.8 + Math.random() * 0.4,
          maxLife: 1.2,
          color: 'rgba(224, 242, 254, 0.45)',
          size: 4 + Math.random() * 4,
          type: 'mist'
        });
      }
    }

    // Environmental Hazard (Level 2: The Dry Valley Scorching Ground)
    const inHeatCrack = this.obstacles.some(obs =>
      obs.type === 'heat_crack' &&
      this.player.x >= obs.x &&
      this.player.x <= obs.x + obs.width &&
      this.player.y >= obs.y &&
      this.player.y <= obs.y + obs.height
    );

    if (inHeatCrack) {
      currentSpeed *= 0.72; // slight slowdown on cracked arid fissures
      if (this.player.waterAmount > 0) {
        this.heatTimer += delta;

        // Spawn rising heat vapor & steam puffs
        if (Math.random() < 0.45) {
          this.particles.push({
            x: this.player.x + (Math.random() - 0.5) * 16,
            y: this.player.y - 8 + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 1.5,
            life: 0.7 + Math.random() * 0.5,
            maxLife: 1.2,
            color: 'rgba(254, 240, 138, 0.75)',
            size: 4 + Math.random() * 4,
            type: 'steam'
          });
        }

        // Evaporate 1L of water at interval based on difficulty (Easy: 4.5s, Normal: 2.4s, Hard: 1.2s)
        const heatThreshold = this.difficulty === 'easy' ? 4.5 : (this.difficulty === 'hard' ? 1.2 : 2.4);
        if (this.heatTimer >= heatThreshold) {
          this.heatTimer = 0;
          this.player.waterAmount = Math.max(0, this.player.waterAmount - 1);
          this.callbacks.onWaterUpdated(this.player.waterAmount, this.player.maxWater);
          if (this.callbacks.onHazardWarning) {
            this.callbacks.onHazardWarning(
              this.difficulty === 'hard' 
                ? '🔥 Fierce Sun! Satchel water rapidly evaporating!' 
                : '☀️ Scorching Ground! Satchel water is evaporating!'
            );
          }
        }
      }
    } else {
      this.heatTimer = 0;
    }

    // Proposed new position
    let newX = this.player.x + moveX * currentSpeed;
    let newY = this.player.y + moveY * currentSpeed;

    // World boundary clamping
    newX = Math.max(30, Math.min(this.worldWidth - 30, newX));
    newY = Math.max(50, Math.min(this.worldHeight - 50, newY));

    // River collision vs Bridge check
    // River runs from x = 470 to x = 590
    const riverLeft = 470;
    const riverRight = 590;
    const inRiverSpan = newX + this.player.radius > riverLeft && newX - this.player.radius < riverRight;

    if (inRiverSpan) {
      // Find if player is on or entering one of the bridges
      const currentBridge = this.bridges.find(b =>
        newY >= b.y + 2 && newY <= b.y + b.height - 2 &&
        newX >= b.x - 12 && newX <= b.x + b.width + 12
      );

      if (currentBridge) {
        // Player is crossing safely on this bridge!
        // Lock player vertically within the bridge railings so they cannot fall off into the river
        const safeMinY = currentBridge.y + this.player.radius;
        const safeMaxY = currentBridge.y + currentBridge.height - this.player.radius;
        newY = Math.max(safeMinY, Math.min(safeMaxY, newY));
      } else {
        // Not on a bridge: block movement into the river
        if (this.player.x <= riverLeft) {
          newX = Math.min(newX, riverLeft - this.player.radius);
        } else if (this.player.x >= riverRight) {
          newX = Math.max(newX, riverRight + this.player.radius);
        } else {
          // If caught inside the river corridor, push to nearest bank
          if (Math.abs(newX - riverLeft) < Math.abs(newX - riverRight)) {
            newX = riverLeft - this.player.radius;
          } else {
            newX = riverRight + this.player.radius;
          }
        }
      }
    }

    // Obstacle collision resolution (Rocks, Trees, Cistern)
    this.obstacles.forEach(obs => {
      if (obs.solid) {
        const closestX = Math.max(obs.x, Math.min(newX, obs.x + obs.width));
        const closestY = Math.max(obs.y, Math.min(newY, obs.y + obs.height));
        const distX = newX - closestX;
        const distY = newY - closestY;
        const distance = Math.hypot(distX, distY);

        if (distance < this.player.radius) {
          const overlap = this.player.radius - distance;
          if (distance > 0) {
            newX += (distX / distance) * overlap;
            newY += (distY / distance) * overlap;
          } else {
            // Push away from center if inside
            const obsCenterX = obs.x + obs.width / 2;
            const obsCenterY = obs.y + obs.height / 2;
            const pdx = newX - obsCenterX || 1;
            const pdy = newY - obsCenterY || 0;
            const pd = Math.hypot(pdx, pdy) || 1;
            newX += (pdx / pd) * (this.player.radius + 2);
            newY += (pdy / pd) * (this.player.radius + 2);
          }
        }
      }
    });

    // Cistern solid collision
    const cistern = this.communityGoal;
    const cCloseX = Math.max(cistern.x, Math.min(newX, cistern.x + cistern.width));
    const cCloseY = Math.max(cistern.y, Math.min(newY, cistern.y + cistern.height));
    const cDist = Math.hypot(newX - cCloseX, newY - cCloseY);
    if (cDist < this.player.radius) {
      const overlap = this.player.radius - cDist;
      if (cDist > 0) {
        newX += ((newX - cCloseX) / cDist) * overlap;
        newY += ((newY - cCloseY) / cDist) * overlap;
      }
    }

    this.player.x = newX;
    this.player.y = newY;

    // Camera follow (smooth lerp toward player center)
    const targetCamX = this.player.x - this.viewportWidth / 2;
    const targetCamY = this.player.y - this.viewportHeight / 2;
    const maxCamX = Math.max(0, this.worldWidth - this.viewportWidth);
    const maxCamY = Math.max(0, this.worldHeight - this.viewportHeight);
    this.cameraX += (Math.max(0, Math.min(maxCamX, targetCamX)) - this.cameraX) * 0.1;
    this.cameraY += (Math.max(0, Math.min(maxCamY, targetCamY)) - this.cameraY) * 0.1;

    // Check entity proximity for interactions
    this.checkProximities();

    // Smoothly animate blooming flowers
    this.flowers.forEach(f => {
      if (f.isBloomed && f.bloomAnimation < 1) {
        f.bloomAnimation = Math.min(1, f.bloomAnimation + delta * 2.2);
      }
    });

    // Update Butterflies
    this.updateButterflies(delta);

    // Update Particles
    this.updateParticles(delta);
  }

  // Check proximity to interactive elements
  private checkProximities() {
    const px = this.player.x;
    const py = this.player.y;

    // 1. Water Source
    const distToSpring = Math.hypot(px - this.waterSource.x, py - this.waterSource.y);
    this.player.isNearWaterSource = distToSpring < this.waterSource.radius + 30;

    // 2. Hand-Pump
    const distToPump = Math.hypot(px - this.handPump.x, py - this.handPump.y);
    this.player.isNearPump = distToPump < this.handPump.radius + 30;

    // 3. Flower Beds (Distinguish unbloomed needing water vs already bloomed)
    const nearUnbloomedFlower = this.flowers.find(f => {
      return Math.hypot(px - f.x, py - f.y) < f.radius + 42 && !f.isBloomed;
    });
    const nearBloomedFlower = this.flowers.find(f => {
      return Math.hypot(px - f.x, py - f.y) < f.radius + 42 && f.isBloomed;
    });
    this.player.isNearFlower = Boolean(nearUnbloomedFlower);

    // 4. Community Goal Cistern (Generous spherical distance check around cistern center)
    const cisternCenterX = this.communityGoal.x + this.communityGoal.width / 2;
    const cisternCenterY = this.communityGoal.y + this.communityGoal.height / 2;
    const distToCistern = Math.hypot(px - cisternCenterX, py - cisternCenterY);
    const nearCistern = distToCistern < (this.communityGoal.width / 2 + 55);
    this.player.isNearCommunity = nearCistern;

    // 5. Trivia Station
    const distToTrivia = Math.hypot(px - this.triviaStation.x, py - this.triviaStation.y);
    this.player.isNearTrivia = distToTrivia < this.triviaStation.radius + 28 && !this.triviaStation.isCompleted;

    // Set interactive prompt label
    if (this.player.isNearWaterSource) {
      this.player.activeInteractionPrompt = this.player.waterAmount < this.player.maxWater 
        ? (this.levelId === 4 ? 'Fill Oasis Water [Space]' : 'Fill Satchel [Space]') 
        : 'Satchel Full!';
    } else if (this.player.isNearPump) {
      if (this.levelId === 4) {
        this.player.activeInteractionPrompt = this.handPump.isCompleted ? 'Biosand Filter Active! ✨' : 'Biosand Filter [Space]';
      } else if (this.levelId === 3) {
        this.player.activeInteractionPrompt = this.handPump.isCompleted ? 'Gravity Intake Active! ✨' : 'Gravity Intake [Space]';
      } else {
        this.player.activeInteractionPrompt = this.handPump.isCompleted ? 'Borehole Active! ✨' : 'Hand-Pump [Space]';
      }
    } else if (nearUnbloomedFlower) {
      this.player.activeInteractionPrompt = this.player.waterAmount >= 20 ? 'Water Flower [Space]' : 'Need 20L Water! (Fill at Spring)';
    } else if (nearBloomedFlower) {
      this.player.activeInteractionPrompt = 'Bloomed & Thriving! ✨';
    } else if (this.player.isNearCommunity) {
      if (this.communityGoal.isCompleted) {
        const remainingFlowers = this.flowers.filter(f => !f.isBloomed).length;
        if (remainingFlowers > 0) {
          this.player.activeInteractionPrompt = `Reservoir Full! Revive ${remainingFlowers} more flower${remainingFlowers > 1 ? 's' : ''}! 🌸`;
        } else {
          this.player.activeInteractionPrompt = 'Mission Accomplished! 🎉';
        }
      } else if (this.player.waterAmount > 0) {
        this.player.activeInteractionPrompt = 'Deliver Water [Space]';
      } else {
        this.player.activeInteractionPrompt = 'Empty Satchel! Fill at Spring';
      }
    } else if (this.player.isNearTrivia) {
      this.player.activeInteractionPrompt = 'Water Trivia [Space]';
    } else {
      const inHeatCrack = this.obstacles.some(obs =>
        obs.type === 'heat_crack' &&
        this.player.x >= obs.x &&
        this.player.x <= obs.x + obs.width &&
        this.player.y >= obs.y &&
        this.player.y <= obs.y + obs.height
      );
      const inMistPatch = this.obstacles.some(obs =>
        obs.type === 'mist_patch' &&
        this.player.x >= obs.x &&
        this.player.x <= obs.x + obs.width &&
        this.player.y >= obs.y &&
        this.player.y <= obs.y + obs.height
      );
      if (inHeatCrack && this.player.waterAmount > 0) {
        this.player.activeInteractionPrompt = '⚠️ Scorching Heat! Move away!';
      } else if (inMistPatch) {
        this.player.activeInteractionPrompt = '🌫️ Highland Mist & Scree! Tread carefully!';
      } else {
        this.player.activeInteractionPrompt = null;
      }
    }
  }

  // Butterfly flight animation
  private updateButterflies(delta: number) {
    this.butterflies.forEach(b => {
      b.wingAngle += b.wingSpeed;
      
      const dx = b.targetX - b.x;
      const dy = b.targetY - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 15) {
        b.targetX = b.x + (Math.random() - 0.5) * 120;
        b.targetY = b.y + (Math.random() - 0.5) * 120;
      }

      b.x += (dx / Math.max(1, dist)) * 0.8;
      b.y += (dy / Math.max(1, dist)) * 0.8;
    });
  }

  // Particle updates
  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= delta;

      if (p.rotation !== undefined) {
        p.rotation += 0.05;
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Gentle ambient forest pollen / sunlight motes drifting through the air
    if (this.particles.length < 24 && Math.random() < 0.12) {
      this.particles.push({
        x: this.cameraX + Math.random() * this.viewportWidth,
        y: this.cameraY + Math.random() * this.viewportHeight,
        vx: 0.15 + (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.3,
        life: 3.0 + Math.random() * 2.0,
        maxLife: 5.0,
        color: Math.random() > 0.5 ? '#fef08a' : '#bae6fd',
        size: 1.5 + Math.random() * 1.5,
        type: 'sparkle'
      });
    }
  }

  // Spawners
  public spawnWaterRipples(x: number, y: number, color: string) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        color: color,
        size: 14 + i * 4,
        type: 'ripple'
      });
    }
  }

  public spawnPetalBurst(x: number, y: number, color: string) {
    // 18 colorful floating petals
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.8;
      this.particles.push({
        x: x,
        y: y - 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1.3 + Math.random() * 0.6,
        maxLife: 1.9,
        color: color,
        size: 4 + Math.random() * 3,
        type: 'petal',
        rotation: Math.random() * Math.PI * 2
      });
    }

    // Golden dewdrop sparkles
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y - 8 + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.0,
        vy: -0.8 - Math.random() * 1.2,
        life: 0.8 + Math.random() * 0.5,
        maxLife: 1.3,
        color: '#fef08a',
        size: 2.5 + Math.random() * 2,
        type: 'sparkle'
      });
    }
  }

  public spawnCelebrationConfetti() {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#fbbf24', '#a855f7', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: this.communityGoal.x + Math.random() * this.communityGoal.width,
        y: this.communityGoal.y - 20,
        vx: (Math.random() - 0.5) * 4,
        vy: -2 - Math.random() * 4,
        life: 2.5 + Math.random() * 1.2,
        maxLife: 3.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 5,
        type: 'confetti',
        rotation: Math.random() * Math.PI * 2
      });
    }
  }

  // Hand-Pump Challenge Completion Hook
  public completeHandPump() {
    this.handPump.isCompleted = true;
    this.handPump.pumpsCompleted = this.handPump.targetPumps;
    // Add pumped water to Hippry's satchel!
    this.player.waterAmount = this.player.maxWater;
    this.callbacks.onWaterUpdated(this.player.waterAmount, this.player.maxWater);
    this.spawnWaterRipples(this.handPump.x, this.handPump.y, '#38bdf8');
    sound.playPumpStroke();
    this.checkMissionComplete();
  }

  // Trivia Completion Hook
  public completeTrivia() {
    this.triviaStation.isCompleted = true;
    sound.playTriviaSuccess();
    this.checkMissionComplete();
  }

  // Check if mission is fully finished
  public checkMissionComplete() {
    const allFlowersBloomed = this.flowers.length > 0 && this.flowers.every(f => f.isBloomed);
    const reservoirFull = this.communityGoal.currentWater >= this.communityGoal.targetWater;

    // Victory strictly requires BOTH the full village reservoir AND all flowers bloomed
    if (reservoirFull && allFlowersBloomed && !this.isCompleted) {
      this.isCompleted = true;
      this.spawnCelebrationConfetti();
      sound.playVictoryFanfare();

      // Calculate Stars (1 to 3)
      // 1 Star: Primary mission completed (Reservoir full + all flowers bloomed)
      // 2 Stars: Primary mission + Borehole Pump / Siphon / Filter operated
      // 3 Stars: Primary mission + Hand-Pump/Filter + Trivia checkpoint completed
      let stars = 1;
      const parTime = this.levelId === 4 ? 180 : (this.levelId === 3 ? 160 : (this.levelId === 2 ? 150 : 120));
      
      if (this.handPump.isCompleted && this.triviaStation.isCompleted) {
        stars = 3;
      } else if (this.handPump.isCompleted || this.triviaStation.isCompleted) {
        stars = 2;
      }

      setTimeout(() => {
        this.callbacks.onVictory(stars, Math.round(this.elapsedTime));
      }, 1200);
    }
  }
}
