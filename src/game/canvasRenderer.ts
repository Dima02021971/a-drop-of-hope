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
  GameParticle 
} from '../types/game';

interface DecorativeDetail {
  x: number;
  y: number;
  type: 'floret' | 'mushroom' | 'leaf' | 'clover' | 'bush';
  color: string;
  secondaryColor?: string;
  size: number;
  phase: number;
  rotation?: number;
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private decorativeDetails: DecorativeDetail[] = [];
  public levelId: number = 1;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, levelId: number = 1) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.levelId = levelId;
    this.initDecorativeFlora(levelId);
  }

  public setLevel(levelId: number) {
    this.levelId = levelId;
    this.initDecorativeFlora(levelId);
  }

  public setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // Clear canvas
  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Pre-generate deterministic natural flora (woodland wildflowers vs dry valley blooms & desert flora)
  private initDecorativeFlora(levelId: number = 1) {
    this.decorativeDetails = [];

    // Helper: deterministic pseudo-random from seed
    let seed = levelId === 4 ? 77777 : (levelId === 3 ? 99999 : (levelId === 2 ? 88888 : 12345));
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Candidate positions spread across the 1150 x 850 world (avoiding river corridor x: 460 - 600)
    for (let i = 0; i < 180; i++) {
      let x = 40 + random() * 1070;
      let y = 50 + random() * 750;

      // Keep outside river channel
      if (x > 450 && x < 610) {
        x = x < 530 ? 440 - random() * 50 : 620 + random() * 50;
      }

      const roll = random();

      if (levelId === 4) {
        // LEVEL 4: Sunstone Dunes Desert Flora & Sunstone Quartz
        if (roll < 0.32) {
          // Desert blooms: Coral Desert Rose, Sun Gold Cacti, Silvery Dune Lilies, Purple Verbenas
          const desertColors = ['#f43f5e', '#fbbf24', '#f8fafc', '#e11d48', '#c084fc', '#f59e0b'];
          const color = desertColors[Math.floor(random() * desertColors.length)];
          this.decorativeDetails.push({
            x,
            y,
            type: 'floret',
            color,
            secondaryColor: '#b45309',
            size: 4 + random() * 3.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.55) {
          // Sunstone quartz crystals & smooth desert amber pebbles
          const sunstoneColors = ['#f59e0b', '#d97706', '#fef08a', '#ea580c', '#fb923c'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'mushroom', // rendered as glowing desert sunstone pebbles
            color: sunstoneColors[Math.floor(random() * sunstoneColors.length)],
            secondaryColor: '#78350f',
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.75) {
          // Palm frond fallen leaflets & dry desert grasses
          const palmLeafColors = ['#65a30d', '#ca8a04', '#b45309', '#d97706', '#854d0e'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'leaf',
            color: palmLeafColors[Math.floor(random() * palmLeafColors.length)],
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2,
            rotation: random() * Math.PI * 2
          });
        } else if (roll < 0.88) {
          // Desert agave & succulent tufts
          this.decorativeDetails.push({
            x,
            y,
            type: 'clover',
            color: '#16a34a',
            secondaryColor: '#15803d',
            size: 4.5 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else {
          // Desert scrub bush
          this.decorativeDetails.push({
            x,
            y,
            type: 'bush',
            color: '#78350f',
            secondaryColor: '#facc15',
            size: 8 + random() * 4,
            phase: random() * Math.PI * 2
          });
        }
      } else if (levelId === 3) {
        // LEVEL 3: Cloud Peaks Alpine Flora
        if (roll < 0.35) {
          // Alpine Wildflowers (Edelweiss, Gentian, Heather, Glacier Aster)
          const alpineFlowerColors = ['#f8fafc', '#2563eb', '#ec4899', '#38bdf8', '#facc15', '#c084fc'];
          const color = alpineFlowerColors[Math.floor(random() * alpineFlowerColors.length)];
          this.decorativeDetails.push({
            x,
            y,
            type: 'floret',
            color,
            secondaryColor: '#fde047',
            size: 4 + random() * 3.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.55) {
          // Alpine slate scree & mountain quartz pebbles
          const screeColors = ['#64748b', '#475569', '#94a3b8', '#cbd5e1', '#e2e8f0'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'mushroom', // rendered as smooth mountain slate / scree pebbles
            color: screeColors[Math.floor(random() * screeColors.length)],
            secondaryColor: '#334155',
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.75) {
          // Alpine pine needle tufts & lichen fallen leaves
          const pineNeedleColors = ['#334155', '#475569', '#1e293b', '#14532d', '#0f766e'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'leaf',
            color: pineNeedleColors[Math.floor(random() * pineNeedleColors.length)],
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2,
            rotation: random() * Math.PI * 2
          });
        } else if (roll < 0.90) {
          // High-altitude mountain moss clover
          this.decorativeDetails.push({
            x,
            y,
            type: 'clover',
            color: '#38bdf8',
            secondaryColor: '#0284c7',
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else {
          // Alpine mountain juniper scrub
          this.decorativeDetails.push({
            x,
            y,
            type: 'bush',
            color: '#1e3a29',
            secondaryColor: '#93c5fd',
            size: 8 + random() * 4,
            phase: random() * Math.PI * 2
          });
        }
      } else if (levelId === 2) {
        // LEVEL 2: The Dry Valley natural flora
        if (roll < 0.32) {
          // Warm desert wildflowers (Sunflowers, Golden Poppies, Desert Marigolds, Firewheels)
          const desertFlowerColors = ['#f59e0b', '#eab308', '#fbbf24', '#f97316', '#ef4444'];
          const color = desertFlowerColors[Math.floor(random() * desertFlowerColors.length)];
          this.decorativeDetails.push({
            x,
            y,
            type: 'floret',
            color,
            secondaryColor: '#78350f',
            size: 4 + random() * 3.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.52) {
          // Desert quartz & canyon pebbles (smooth terracotta, amber, and sun-bleached quartz)
          const pebbleColors = ['#d97706', '#b45309', '#fef3c7', '#ea580c', '#f59e0b'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'mushroom', // re-rendered as small rounded desert pebbles/stones
            color: pebbleColors[Math.floor(random() * pebbleColors.length)],
            secondaryColor: '#78350f',
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.72) {
          // Sun-dried fallen leaves / dry desert twigs
          const leafColors = ['#d97706', '#b45309', '#92400e', '#78350f', '#ca8a04'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'leaf',
            color: leafColors[Math.floor(random() * leafColors.length)],
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2,
            rotation: random() * Math.PI * 2
          });
        } else if (roll < 0.88) {
          // Tough desert succulent / agave tufts
          this.decorativeDetails.push({
            x,
            y,
            type: 'clover',
            color: '#65a30d',
            secondaryColor: '#4d7c0f',
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else {
          // Dry desert scrub bush
          this.decorativeDetails.push({
            x,
            y,
            type: 'bush',
            color: '#854d0e',
            secondaryColor: '#f59e0b',
            size: 8 + random() * 4,
            phase: random() * Math.PI * 2
          });
        }
      } else {
        // LEVEL 1: Lush woodland flora (preserved exactly)
        if (roll < 0.28) {
          const flowerColors = ['#facc15', '#ffffff', '#38bdf8', '#f472b6', '#a855f7'];
          const color = flowerColors[Math.floor(random() * flowerColors.length)];
          this.decorativeDetails.push({
            x,
            y,
            type: 'floret',
            color,
            secondaryColor: '#f59e0b',
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.45) {
          const isRed = random() > 0.45;
          this.decorativeDetails.push({
            x,
            y,
            type: 'mushroom',
            color: isRed ? '#ef4444' : '#d97706',
            secondaryColor: isRed ? '#ffffff' : '#fef3c7',
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else if (roll < 0.65) {
          const leafColors = ['#f59e0b', '#d97706', '#b45309', '#84cc16', '#eab308'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'leaf',
            color: leafColors[Math.floor(random() * leafColors.length)],
            size: 3.5 + random() * 2.5,
            phase: random() * Math.PI * 2,
            rotation: random() * Math.PI * 2
          });
        } else if (roll < 0.85) {
          this.decorativeDetails.push({
            x,
            y,
            type: 'clover',
            color: '#22c55e',
            secondaryColor: '#15803d',
            size: 4 + random() * 3,
            phase: random() * Math.PI * 2
          });
        } else {
          const berryColors = ['#f43f5e', '#6366f1', '#e11d48'];
          this.decorativeDetails.push({
            x,
            y,
            type: 'bush',
            color: '#166534',
            secondaryColor: berryColors[Math.floor(random() * berryColors.length)],
            size: 9 + random() * 5,
            phase: random() * Math.PI * 2
          });
        }
      }
    }
  }

  // Draw background grass and terrain with rich natural textures
  public drawTerrain(cameraX: number, cameraY: number, time: number, levelId: number = this.levelId) {
    const ctx = this.ctx;
    
    if (levelId === 4) {
      // LEVEL 4: Sunstone Dunes - Shifting Golden Sands & Oasis Shoreline
      // 1. Base Sand Dune Gradient (rich warm ochre to amber and sunlit gold)
      const duneGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      duneGrad.addColorStop(0, '#f59e0b');
      duneGrad.addColorStop(0.35, '#fbbf24');
      duneGrad.addColorStop(0.7, '#d97706');
      duneGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = duneGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Rolling Sand Dune Ridges & Soft Highlights
      const duneRidges = [
        { x: 180, y: 150, rx: 180, ry: 110, color: '#fcd34d' },
        { x: 380, y: 520, rx: 210, ry: 130, color: '#f59e0b' },
        { x: 260, y: 720, rx: 200, ry: 100, color: '#d97706' },
        { x: 780, y: 180, rx: 190, ry: 120, color: '#fbbf24' },
        { x: 920, y: 640, rx: 220, ry: 140, color: '#f59e0b' },
        { x: 740, y: 440, rx: 170, ry: 105, color: '#fcd34d' },
        { x: 120, y: 420, rx: 150, ry: 90, color: '#d97706' },
        { x: 1020, y: 280, rx: 160, ry: 100, color: '#fbbf24' }
      ];

      ctx.save();
      duneRidges.forEach(ridge => {
        const sx = ridge.x - cameraX;
        const sy = ridge.y - cameraY;
        ctx.fillStyle = ridge.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy, ridge.rx, ridge.ry, 0.25, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Delicate Wind Ripples sculpted into the dunes
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      for (let rx = 50; rx < 1150; rx += 90) {
        for (let ry = 40; ry < 840; ry += 65) {
          if (rx > 460 && rx < 600) continue;
          const sx = rx - cameraX;
          const sy = ry - cameraY;
          if (sx > -60 && sx < this.width + 60 && sy > -60 && sy < this.height + 60) {
            const windSway = Math.sin(time * 1.5 + rx * 0.04 + ry * 0.02) * 2;
            ctx.beginPath();
            ctx.moveTo(sx - 20 + windSway, sy);
            ctx.quadraticCurveTo(sx + windSway, sy + 4, sx + 20 + windSway, sy);
            ctx.stroke();
          }
        }
      }

      // 4. Shimmering Desert Mirage / Warm Heat Waves
      this.drawDesertMirage(cameraX, cameraY, time);

      // 5. Sandstone & Sunstone Stepping Path
      this.drawStonePath(cameraX, cameraY, levelId);

      // 6. Natural Desert Flora (Desert roses, cacti, agave, sunstone pebbles)
      this.drawNaturalDetails(cameraX, cameraY, time);

    } else if (levelId === 3) {
      // LEVEL 3: Cloud Peaks - High Mountain Alpine Mist & Slate Plateau
      // 1. Base Mountain Slate Gradient (Cool slate gray to deep rocky navy)
      const slateGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      slateGrad.addColorStop(0, '#475569');
      slateGrad.addColorStop(0.35, '#334155');
      slateGrad.addColorStop(0.7, '#1e293b');
      slateGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = slateGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Alpine Moss Shelves & Cool Meadow Patches
      const alpinePatches = [
        { x: 180, y: 150, rx: 170, ry: 105, color: '#2d4536' },
        { x: 380, y: 520, rx: 200, ry: 125, color: '#334e3e' },
        { x: 260, y: 720, rx: 190, ry: 95, color: '#263b2f' },
        { x: 780, y: 180, rx: 180, ry: 115, color: '#3b5846' },
        { x: 920, y: 640, rx: 210, ry: 135, color: '#2d4536' },
        { x: 740, y: 440, rx: 160, ry: 100, color: '#334e3e' },
        { x: 120, y: 420, rx: 140, ry: 85, color: '#263b2f' },
        { x: 1020, y: 280, rx: 150, ry: 95, color: '#3b5846' }
      ];

      ctx.save();
      alpinePatches.forEach(patch => {
        const sx = patch.x - cameraX;
        const sy = patch.y - cameraY;
        ctx.fillStyle = patch.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy, patch.rx, patch.ry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Jagged Mountain Slate & Granite Cleavages
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      const slateCracks = [
        { x: 160, y: 240 }, { x: 250, y: 600 }, { x: 340, y: 210 },
        { x: 730, y: 150 }, { x: 850, y: 470 }, { x: 1010, y: 610 },
        { x: 210, y: 430 }, { x: 800, y: 650 }, { x: 910, y: 220 }
      ];
      slateCracks.forEach(c => {
        const sx = c.x - cameraX;
        const sy = c.y - cameraY;
        if (sx > -60 && sx < this.width + 60 && sy > -60 && sy < this.height + 60) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 18, sy + 6);
          ctx.lineTo(sx + 30, sy + 3);
          ctx.moveTo(sx + 18, sy + 6);
          ctx.lineTo(sx + 22, sy + 20);
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - 16, sy - 8);
          ctx.lineTo(sx - 26, sy - 6);
          ctx.stroke();
        }
      });

      // 4. Frost-Kissed Highland Grass Tufts
      ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
      for (let gx = 30; gx < 1180; gx += 85) {
        for (let gy = 40; gy < 860; gy += 75) {
          if (gx > 460 && gx < 600) continue;
          const sx = gx - cameraX;
          const sy = gy - cameraY;
          if (sx > -30 && sx < this.width + 30 && sy > -30 && sy < this.height + 30) {
            const sway = Math.sin(time * 2.2 + gx * 0.05 + gy * 0.03) * 1.5;
            ctx.beginPath();
            ctx.moveTo(sx - 2, sy);
            ctx.lineTo(sx - 4 + sway, sy - 9);
            ctx.lineTo(sx, sy);
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + sway, sy - 11);
            ctx.lineTo(sx + 2, sy);
            ctx.fill();
          }
        }
      }

      // 5. Mountain Stone Path
      this.drawStonePath(cameraX, cameraY, levelId);

      // 6. Natural Alpine Flora (Edelweiss, Gentians, Heather, Scree)
      this.drawNaturalDetails(cameraX, cameraY, time);

      // 7. Drifting Highland Mountain Mist Clouds
      this.drawMountainMist(cameraX, cameraY, time);

    } else if (levelId === 2) {
      // LEVEL 2: The Dry Valley - Sun-baked terracotta clay & cracked ground
      // 1. Base Arid Clay Gradient
      const clayGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      clayGrad.addColorStop(0, '#ca9a5d');
      clayGrad.addColorStop(0.35, '#b8864a');
      clayGrad.addColorStop(0.7, '#a47338');
      clayGrad.addColorStop(1, '#8c5f2b');
      ctx.fillStyle = clayGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Soft Textured Organic Dry Clay Patches (warm ochre, sienna, and baked sand)
      const clayPatches = [
        { x: 180, y: 150, rx: 170, ry: 105, color: '#d8a96e' },
        { x: 380, y: 520, rx: 200, ry: 125, color: '#be8b4f' },
        { x: 260, y: 720, rx: 190, ry: 95, color: '#cca063' },
        { x: 780, y: 180, rx: 180, ry: 115, color: '#af7c43' },
        { x: 920, y: 640, rx: 210, ry: 135, color: '#9e6e36' },
        { x: 740, y: 440, rx: 160, ry: 100, color: '#cca063' },
        { x: 120, y: 420, rx: 140, ry: 85, color: '#be8b4f' },
        { x: 1020, y: 280, rx: 150, ry: 95, color: '#af7c43' }
      ];

      ctx.save();
      clayPatches.forEach(patch => {
        const sx = patch.x - cameraX;
        const sy = patch.y - cameraY;
        ctx.fillStyle = patch.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy, patch.rx, patch.ry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Dry Fissure Crack Lines across the arid valley floor
      ctx.strokeStyle = 'rgba(90, 45, 10, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      const crackCenters = [
        { x: 150, y: 260 }, { x: 240, y: 620 }, { x: 350, y: 200 },
        { x: 720, y: 140 }, { x: 860, y: 480 }, { x: 1000, y: 620 },
        { x: 220, y: 440 }, { x: 790, y: 660 }, { x: 920, y: 210 }
      ];
      crackCenters.forEach(c => {
        const sx = c.x - cameraX;
        const sy = c.y - cameraY;
        if (sx > -60 && sx < this.width + 60 && sy > -60 && sy < this.height + 60) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 16, sy + 8);
          ctx.lineTo(sx + 28, sy + 5);
          ctx.moveTo(sx + 16, sy + 8);
          ctx.lineTo(sx + 20, sy + 22);
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - 14, sy - 10);
          ctx.lineTo(sx - 24, sy - 8);
          ctx.stroke();
        }
      });

      // 4. Drought Grass / Golden Savannah tufts
      ctx.fillStyle = 'rgba(234, 179, 8, 0.42)'; // golden savannah grass
      for (let gx = 30; gx < 1180; gx += 85) {
        for (let gy = 40; gy < 860; gy += 75) {
          if (gx > 460 && gx < 600) continue;
          const sx = gx - cameraX;
          const sy = gy - cameraY;
          if (sx > -30 && sx < this.width + 30 && sy > -30 && sy < this.height + 30) {
            const sway = Math.sin(time * 2.2 + gx * 0.05 + gy * 0.03) * 1.5;
            ctx.beginPath();
            ctx.moveTo(sx - 2, sy);
            ctx.lineTo(sx - 4 + sway, sy - 8);
            ctx.lineTo(sx, sy);
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + sway, sy - 10);
            ctx.lineTo(sx + 2, sy);
            ctx.fill();
          }
        }
      }

      // 5. Sandstone Path
      this.drawStonePath(cameraX, cameraY, levelId);

      // 6. Natural Details (Desert wildflowers, succulents, canyon pebbles)
      this.drawNaturalDetails(cameraX, cameraY, time);

    } else {
      // LEVEL 1: Emerald Woodlands (Preserved exactly as designed)
      // 1. Base Rich Forest Grass Gradient
      const grassGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      grassGrad.addColorStop(0, '#5ea836');
      grassGrad.addColorStop(0.4, '#4d9329');
      grassGrad.addColorStop(0.7, '#438323');
      grassGrad.addColorStop(1, '#39721c');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Soft Textured Organic Lawn Patches (undulating meadows of varied green tones)
      const lawnPatches = [
        { x: 180, y: 150, rx: 160, ry: 100, color: '#68b43f' },
        { x: 380, y: 520, rx: 190, ry: 120, color: '#569b2d' },
        { x: 260, y: 720, rx: 180, ry: 90, color: '#6ab843' },
        { x: 780, y: 180, rx: 170, ry: 110, color: '#62ac38' },
        { x: 920, y: 640, rx: 200, ry: 130, color: '#53962a' },
        { x: 740, y: 440, rx: 150, ry: 95, color: '#6cb844' },
        { x: 120, y: 420, rx: 130, ry: 80, color: '#599f2e' },
        { x: 1020, y: 280, rx: 140, ry: 90, color: '#64ad3b' }
      ];

      ctx.save();
      lawnPatches.forEach(patch => {
        const sx = patch.x - cameraX;
        const sy = patch.y - cameraY;
        ctx.fillStyle = patch.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy, patch.rx, patch.ry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Dense Grass Blades Tufts across the ground
      ctx.fillStyle = 'rgba(163, 230, 53, 0.55)'; // light spring green blades
      for (let gx = 30; gx < 1180; gx += 75) {
        for (let gy = 40; gy < 860; gy += 65) {
          // Skip river corridor
          if (gx > 460 && gx < 600) continue;
          const sx = gx - cameraX;
          const sy = gy - cameraY;
          if (sx > -30 && sx < this.width + 30 && sy > -30 && sy < this.height + 30) {
            const sway = Math.sin(time * 2.5 + gx * 0.05 + gy * 0.03) * 1.8;
            ctx.beginPath();
            // Blade 1
            ctx.moveTo(sx - 3, sy);
            ctx.lineTo(sx - 5 + sway, sy - 8);
            ctx.lineTo(sx - 1, sy);
            // Blade 2 (tall center)
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + sway * 1.2, sy - 11);
            ctx.lineTo(sx + 2, sy);
            // Blade 3
            ctx.moveTo(sx + 3, sy);
            ctx.lineTo(sx + 5 + sway, sy - 7);
            ctx.lineTo(sx + 5, sy);
            ctx.fill();
          }
        }
      }

      // 4. Cozy Cobblestone & Gravel Walking Path
      this.drawStonePath(cameraX, cameraY, levelId);

      // 5. Rich Natural Forest Details (Wildflowers, Mushrooms, Leaves, Clovers, Bushes)
      this.drawNaturalDetails(cameraX, cameraY, time);
    }
  }

  // Draw Natural Details with gentle breeze sway
  private drawNaturalDetails(cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;

    this.decorativeDetails.forEach(item => {
      const sx = item.x - cameraX;
      const sy = item.y - cameraY;

      // Viewport culling
      if (sx < -40 || sx > this.width + 40 || sy < -40 || sy > this.height + 40) {
        return;
      }

      ctx.save();
      const sway = Math.sin(time * 2.2 + item.phase) * 1.5;

      if (item.type === 'floret') {
        // Wildflower with green stem and petals
        // Stem
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy + 3);
        ctx.quadraticCurveTo(sx + sway * 0.5, sy - 2, sx + sway, sy - item.size - 2);
        ctx.stroke();

        // Petals
        ctx.fillStyle = item.color;
        const headX = sx + sway;
        const headY = sy - item.size - 2;
        const petalCount = 5;
        for (let p = 0; p < petalCount; p++) {
          const angle = (p * Math.PI * 2) / petalCount;
          ctx.beginPath();
          ctx.arc(
            headX + Math.cos(angle) * (item.size * 0.6),
            headY + Math.sin(angle) * (item.size * 0.6),
            item.size * 0.45,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        // Golden flower center
        ctx.fillStyle = item.secondaryColor || '#f59e0b';
        ctx.beginPath();
        ctx.arc(headX, headY, item.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

      } else if (item.type === 'mushroom') {
        // Forest mushroom with cap and stem
        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + 3, item.size * 0.9, item.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.roundRect(sx - item.size * 0.25, sy - item.size * 0.6, item.size * 0.5, item.size * 0.9, 2);
        ctx.fill();

        // Cap
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(sx, sy - item.size * 0.5, item.size, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();

        // White polka dots for Fly Agaric
        if (item.color === '#ef4444') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy - item.size * 0.9, item.size * 0.2, 0, Math.PI * 2);
          ctx.arc(sx - item.size * 0.5, sy - item.size * 0.6, item.size * 0.16, 0, Math.PI * 2);
          ctx.arc(sx + item.size * 0.5, sy - item.size * 0.6, item.size * 0.16, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (item.type === 'leaf') {
        // Scattered fallen autumn leaf
        ctx.translate(sx, sy);
        ctx.rotate(item.rotation || 0);

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(1, 1, item.size, item.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leaf blade
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, item.size, item.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leaf stem / spine
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-item.size * 0.8, 0);
        ctx.lineTo(item.size * 0.8, 0);
        ctx.stroke();

      } else if (item.type === 'clover') {
        // 3-leaf clover cluster
        ctx.fillStyle = item.color;
        const r = item.size * 0.55;
        // Leaf 1 (top)
        ctx.beginPath();
        ctx.arc(sx, sy - r, r, 0, Math.PI * 2);
        ctx.fill();
        // Leaf 2 (left)
        ctx.beginPath();
        ctx.arc(sx - r * 0.8, sy + r * 0.3, r, 0, Math.PI * 2);
        ctx.fill();
        // Leaf 3 (right)
        ctx.beginPath();
        ctx.arc(sx + r * 0.8, sy + r * 0.3, r, 0, Math.PI * 2);
        ctx.fill();
        // Tiny stem
        ctx.strokeStyle = item.secondaryColor || '#15803d';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 1, sy + r * 1.5);
        ctx.stroke();

      } else if (item.type === 'bush') {
        // Wild berry bush with leafy clusters and berries
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + item.size * 0.5, item.size, item.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bush foliage lobes
        const lobes = [
          { ox: -item.size * 0.4, oy: -item.size * 0.1, r: item.size * 0.55, c: '#15803d' },
          { ox: item.size * 0.4, oy: -item.size * 0.1, r: item.size * 0.55, c: '#15803d' },
          { ox: 0, oy: -item.size * 0.45, r: item.size * 0.65, c: '#16a34a' },
          { ox: 0, oy: -item.size * 0.2, r: item.size * 0.5, c: '#22c55e' }
        ];

        lobes.forEach(l => {
          ctx.fillStyle = l.c;
          ctx.beginPath();
          ctx.arc(sx + l.ox + sway * 0.4, sy + l.oy, l.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Wild berries dotting the bush
        ctx.fillStyle = item.secondaryColor || '#f43f5e';
        const berries = [
          { bx: -item.size * 0.3, by: -item.size * 0.3 },
          { bx: item.size * 0.2, by: -item.size * 0.45 },
          { bx: item.size * 0.35, by: -item.size * 0.15 },
          { bx: -0.05, by: -item.size * 0.1 }
        ];
        berries.forEach(b => {
          ctx.beginPath();
          ctx.arc(sx + b.bx + sway * 0.4, sy + b.by, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    });
  }

  // Dynamic mountain mist layers drifting over Cloud Peaks
  private drawMountainMist(cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    
    // 3 layered translucent drifting mist cloud banks
    const mistLayers = [
      { speed: 22, yBase: 120, rx: 170, ry: 48, opacity: 0.22, offset: 0 },
      { speed: 34, yBase: 380, rx: 230, ry: 58, opacity: 0.26, offset: 380 },
      { speed: 18, yBase: 640, rx: 190, ry: 52, opacity: 0.20, offset: 740 }
    ];

    mistLayers.forEach((layer, idx) => {
      for (let i = 0; i < 3; i++) {
        const cloudX = ((i * 440 + layer.offset + time * layer.speed) % 1400) - 120 - cameraX * 0.35;
        const cloudY = layer.yBase + Math.sin(time * 0.7 + idx + i) * 22 - cameraY * 0.35;
        
        const grad = ctx.createRadialGradient(cloudX, cloudY, 10, cloudX, cloudY, layer.rx);
        grad.addColorStop(0, `rgba(241, 245, 249, ${layer.opacity})`);
        grad.addColorStop(0.55, `rgba(224, 242, 254, ${layer.opacity * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cloudX, cloudY, layer.rx, layer.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Dynamic desert mirage & heat shimmer shimmering over Sunstone Dunes
  private drawDesertMirage(cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    
    // Translucent golden heat mirage wave bands
    const mirageBands = [
      { yBase: 140, speed: 18, rx: 200, ry: 35, opacity: 0.14 },
      { yBase: 360, speed: 26, rx: 240, ry: 40, opacity: 0.16 },
      { yBase: 620, speed: 20, rx: 210, ry: 38, opacity: 0.12 }
    ];

    mirageBands.forEach((band, idx) => {
      for (let i = 0; i < 3; i++) {
        const mx = ((i * 450 + time * band.speed) % 1400) - 100 - cameraX * 0.25;
        const my = band.yBase + Math.sin(time * 2.0 + idx + i) * 14 - cameraY * 0.25;

        const grad = ctx.createRadialGradient(mx, my, 8, mx, my, band.rx);
        grad.addColorStop(0, `rgba(254, 240, 138, ${band.opacity})`);
        grad.addColorStop(0.6, `rgba(251, 191, 36, ${band.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(mx, my, band.rx, band.ry, 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Cozy cobblestone / dirt path with stepping stones, 3D stone bevels, and gravel edges
  private drawStonePath(cameraX: number, cameraY: number, levelId: number = this.levelId) {
    const ctx = this.ctx;
    const pathNodes = [
      { x: 140, y: 380, w: 34, h: 24, rot: 0.1 },
      { x: 260, y: 380, w: 36, h: 26, rot: -0.1 },
      { x: 380, y: 380, w: 35, h: 25, rot: 0.05 },
      { x: 500, y: 380, w: 36, h: 26, rot: 0 },
      { x: 620, y: 380, w: 35, h: 25, rot: -0.08 },
      { x: 740, y: 380, w: 36, h: 26, rot: 0.12 },
      { x: 860, y: 380, w: 34, h: 24, rot: -0.05 },
      { x: 980, y: 440, w: 36, h: 25, rot: 0.2 },
      { x: 980, y: 560, w: 35, h: 25, rot: -0.1 },
      // Path branching north to pump
      { x: 420, y: 240, w: 32, h: 22, rot: 0 },
      { x: 420, y: 320, w: 34, h: 24, rot: 0.15 },
      // Path branching south to south flowers
      { x: 700, y: 500, w: 33, h: 23, rot: -0.1 },
      { x: 700, y: 620, w: 35, h: 24, rot: 0.05 },
    ];

    pathNodes.forEach((node, i) => {
      const sx = node.x - cameraX;
      const sy = node.y - cameraY;

      // 1. Warm Earthy Base Bed with soft drop shadow into ground
      ctx.fillStyle = levelId === 3 
        ? 'rgba(15, 23, 42, 0.45)' 
        : (levelId === 2 ? 'rgba(70, 30, 5, 0.32)' : 'rgba(67, 40, 15, 0.28)');
      ctx.beginPath();
      ctx.ellipse(sx + 2, sy + 3, node.w + 4, node.h + 3, node.rot, 0, Math.PI * 2);
      ctx.fill();

      // Earth / stone path core
      ctx.fillStyle = levelId === 3 
        ? '#64748b' 
        : (levelId === 2 ? '#d4a266' : '#dfcca0'); // slate vs sand
      ctx.beginPath();
      ctx.ellipse(sx, sy, node.w, node.h, node.rot, 0, Math.PI * 2);
      ctx.fill();

      // 2. Cobblestone Flagstones with 3D bevels
      const stones = levelId === 3
        ? [
            { ox: -10, oy: -5, r: 8, col: '#cbd5e1', dark: '#475569' },
            { ox: 10, oy: 4, r: 9, col: '#e2e8f0', dark: '#64748b' },
            { ox: -4, oy: 6, r: 6.5, col: '#93c5fd', dark: '#3b82f6' },
            { ox: 8, oy: -6, r: 6, col: '#f1f5f9', dark: '#64748b' },
          ]
        : levelId === 2
        ? [
            { ox: -10, oy: -5, r: 8, col: '#f59e0b', dark: '#b45309' },
            { ox: 10, oy: 4, r: 9, col: '#fbbf24', dark: '#d97706' },
            { ox: -4, oy: 6, r: 6.5, col: '#fed7aa', dark: '#ea580c' },
            { ox: 8, oy: -6, r: 6, col: '#fde68a', dark: '#b45309' },
          ]
        : [
            { ox: -10, oy: -5, r: 8, col: '#cbd5e1', dark: '#94a3b8' },
            { ox: 10, oy: 4, r: 9, col: '#e2e8f0', dark: '#a1a1aa' },
            { ox: -4, oy: 6, r: 6.5, col: '#e4d5b7', dark: '#bfa07d' },
            { ox: 8, oy: -6, r: 6, col: '#d4d4d8', dark: '#71717a' },
          ];

      stones.forEach(st => {
        const px = sx + st.ox;
        const py = sy + st.oy;

        // Stone shadow / underside bevel
        ctx.fillStyle = st.dark;
        ctx.beginPath();
        ctx.arc(px + 1, py + 1.5, st.r, 0, Math.PI * 2);
        ctx.fill();

        // Stone face
        ctx.fillStyle = st.col;
        ctx.beginPath();
        ctx.arc(px, py, st.r, 0, Math.PI * 2);
        ctx.fill();

        // Stone top-left highlight bevel
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px - 1.5, py - 1.5, st.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Tiny Gravel & Pebbles scattered on path edges
      ctx.fillStyle = levelId === 3
        ? (i % 2 === 0 ? '#475569' : '#64748b')
        : (levelId === 2 ? (i % 2 === 0 ? '#b45309' : '#d97706') : (i % 2 === 0 ? '#b89e6c' : '#a38753'));
      ctx.beginPath();
      ctx.arc(sx - node.w * 0.7, sy + 4, 2, 0, Math.PI * 2);
      ctx.arc(sx + node.w * 0.7, sy - 3, 2.2, 0, Math.PI * 2);
      ctx.arc(sx + 3, sy + node.h * 0.7, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Draw River with organic winding shorelines, flowing blue water, realistic ripples, and foam
  public drawRiver(cameraX: number, cameraY: number, time: number, levelId: number = this.levelId) {
    const ctx = this.ctx;

    // River bounds in world space: center is x = 530, roughly 470 to 590
    // Generate organic curved shorelines using smooth continuous sine curves
    const riverYStart = -cameraY - 40;
    const riverYEnd = 960 - cameraY;

    // 1. Organic Sandy / Granite Gorge Shoreline Bank on Left & Right
    ctx.save();

    // Riverbank Buffer (granite slate gorge in Level 3, warm golden sand in Level 4, warm sand in Level 1 & 2)
    ctx.fillStyle = levelId === 4 ? '#eab308' : (levelId === 3 ? '#334155' : '#d4b982');
    ctx.beginPath();
    // Left bank sand/slate strip
    for (let y = -40; y <= 960; y += 20) {
      const sy = y - cameraY;
      const lx = (470 + Math.sin(y * 0.012) * 8 + Math.cos(y * 0.028) * 6) - cameraX;
      if (y === -40) ctx.moveTo(lx - 22, sy);
      else ctx.lineTo(lx - 22, sy);
    }
    for (let y = 960; y >= -40; y -= 20) {
      const sy = y - cameraY;
      const lx = (470 + Math.sin(y * 0.012) * 8 + Math.cos(y * 0.028) * 6) - cameraX;
      ctx.lineTo(lx + 4, sy);
    }
    ctx.fill();

    // Right bank sand/slate strip
    ctx.beginPath();
    for (let y = -40; y <= 960; y += 20) {
      const sy = y - cameraY;
      const rx = (590 + Math.sin(y * 0.015 + 1) * 8 + Math.cos(y * 0.032) * 5) - cameraX;
      if (y === -40) ctx.moveTo(rx - 4, sy);
      else ctx.lineTo(rx - 4, sy);
    }
    for (let y = 960; y >= -40; y -= 20) {
      const sy = y - cameraY;
      const rx = (590 + Math.sin(y * 0.015 + 1) * 8 + Math.cos(y * 0.032) * 5) - cameraX;
      ctx.lineTo(rx + 22, sy);
    }
    ctx.fill();

    // River Shoreline Pebbles along water edge
    ctx.fillStyle = levelId === 4 ? '#d97706' : (levelId === 3 ? '#cbd5e1' : '#94a3b8');
    for (let y = 0; y < 900; y += 50) {
      const sy = y - cameraY;
      const lx = (470 + Math.sin(y * 0.012) * 8 + Math.cos(y * 0.028) * 6) - cameraX;
      const rx = (590 + Math.sin(y * 0.015 + 1) * 8 + Math.cos(y * 0.032) * 5) - cameraX;
      
      // Left pebble
      ctx.beginPath();
      ctx.ellipse(lx - 4, sy + 6, 4.5, 3, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Right pebble
      ctx.beginPath();
      ctx.ellipse(rx + 4, sy + 18, 5, 3.2, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Main River Water Body: Multi-Stop Gradient (Crystalline glacial snowmelt in L3, oasis in L4)
    const midX = 530 - cameraX;
    const waterGrad = ctx.createLinearGradient(midX - 70, 0, midX + 70, 0);
    if (levelId === 4) {
      waterGrad.addColorStop(0, '#67e8f9');     // shimmering desert oasis cyan
      waterGrad.addColorStop(0.25, '#06b6d4');  // bright oasis pool
      waterGrad.addColorStop(0.5, '#0284c7');   // deep spring azure
      waterGrad.addColorStop(0.75, '#0f766e');  // mineral emerald depth
      waterGrad.addColorStop(1, '#67e8f9');     // sunlit cyan
    } else if (levelId === 3) {
      waterGrad.addColorStop(0, '#e0f2fe');     // crystalline snowmelt
      waterGrad.addColorStop(0.2, '#38bdf8');   // glacial turquoise
      waterGrad.addColorStop(0.5, '#0284c7');   // deep alpine gorge
      waterGrad.addColorStop(0.8, '#0369a1');   // mountain depth
      waterGrad.addColorStop(1, '#e0f2fe');     // icy snowmelt
    } else {
      waterGrad.addColorStop(0, '#38bdf8');     // shallow bright cyan on left
      waterGrad.addColorStop(0.2, '#0ea5e9');   // vibrant turquoise
      waterGrad.addColorStop(0.5, '#0284c7');   // deep azure channel
      waterGrad.addColorStop(0.8, '#0369a1');   // sapphire depth
      waterGrad.addColorStop(1, '#38bdf8');     // shallow cyan on right
    }
    ctx.fillStyle = waterGrad;

    ctx.beginPath();
    // Trace down the left bank
    for (let y = -40; y <= 960; y += 20) {
      const sy = y - cameraY;
      const lx = (470 + Math.sin(y * 0.012) * 8 + Math.cos(y * 0.028) * 6) - cameraX;
      if (y === -40) ctx.moveTo(lx, sy);
      else ctx.lineTo(lx, sy);
    }
    // Trace up the right bank
    for (let y = 960; y >= -40; y -= 20) {
      const sy = y - cameraY;
      const rx = (590 + Math.sin(y * 0.015 + 1) * 8 + Math.cos(y * 0.032) * 5) - cameraX;
      ctx.lineTo(rx, sy);
    }
    ctx.closePath();
    ctx.fill();

    // 3. Flowing Water Current Ripples (Sine waves with variable speed & realistic flow)
    ctx.strokeStyle = levelId === 3 ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.48)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (let y = 0; y < 900; y += 38) {
      const flowY = ((y + time * 75) % 920) - cameraY;
      const lx = (470 + Math.sin((y + time * 75) * 0.012) * 8) - cameraX;
      const rx = (590 + Math.sin((y + time * 75) * 0.015 + 1) * 8) - cameraX;
      const waveWidth = rx - lx - 24;

      const waveCenter = lx + 12 + waveWidth / 2;
      const waveOffset = Math.sin((y + time * 65) * 0.03) * 12;

      ctx.beginPath();
      ctx.moveTo(waveCenter - waveWidth * 0.38 + waveOffset, flowY);
      ctx.quadraticCurveTo(
        waveCenter + waveOffset,
        flowY + 8 + Math.sin(time * 3 + y * 0.1) * 3,
        waveCenter + waveWidth * 0.38 + waveOffset,
        flowY
      );
      ctx.stroke();

      // Second fine shimmer wave in deep channel
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(waveCenter - waveWidth * 0.18 + waveOffset, flowY + 6);
      ctx.lineTo(waveCenter + waveWidth * 0.18 + waveOffset, flowY + 6);
      ctx.stroke();
    }

    // 4. Sunbeam Specular Sparkles Glistening on Water Surface
    ctx.fillStyle = '#ffffff';
    for (let y = 20; y < 880; y += 70) {
      const sparkY = ((y + time * 35) % 900) - cameraY;
      const sparkX = (530 + Math.sin(y * 0.1 + time * 3) * 35) - cameraX;
      const sparkAlpha = 0.4 + Math.sin(time * 6 + y) * 0.4;
      if (sparkAlpha > 0.1) {
        ctx.globalAlpha = sparkAlpha;
        // 4-point sparkle star
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sparkX - 4, sparkY);
        ctx.lineTo(sparkX + 4, sparkY);
        ctx.moveTo(sparkX, sparkY - 4);
        ctx.lineTo(sparkX, sparkY + 4);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1.0;

    // 5. River Foam along Shoreline Edges
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let y = 0; y < 900; y += 26) {
      const foamY = ((y + time * 32) % 900) - cameraY;
      const lx = (470 + Math.sin((y + time * 32) * 0.012) * 8) - cameraX;
      const rx = (590 + Math.sin((y + time * 32) * 0.015 + 1) * 8) - cameraX;

      const r1 = 3 + Math.sin(time * 3 + y) * 1.5;
      const r2 = 3 + Math.cos(time * 3 + y) * 1.5;

      ctx.beginPath();
      ctx.arc(lx + 4, foamY, r1, 0, Math.PI * 2);
      ctx.arc(rx - 4, foamY + 10, r2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // 6. Realistic Waterfall Cascade at Headwaters
    this.drawWaterfall(470, 40, 120, 80, cameraX, cameraY, time, levelId);
  }

  // Realistic Cascading Waterfall with layered rock cliff, foaming spray, and mist
  private drawWaterfall(
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    cameraX: number, 
    cameraY: number, 
    time: number,
    levelId: number = this.levelId
  ) {
    const ctx = this.ctx;
    const sx = x - cameraX;
    const sy = y - cameraY;

    // 1. Slate Cliff with rock strata & moss / snow
    ctx.fillStyle = levelId === 3 ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.roundRect(sx - 18, sy - 18, w + 36, h + 18, 14);
    ctx.fill();

    // Slate rock ledges
    ctx.fillStyle = levelId === 3 ? '#475569' : '#475569';
    ctx.fillRect(sx - 14, sy - 14, w + 28, 14);
    ctx.fillRect(sx - 10, sy + 25, w + 20, 8);

    // Green Moss or Frost clinging to rocky cliff
    ctx.fillStyle = levelId === 3 ? '#f8fafc' : '#15803d'; // frost snow cap in L3
    for (let mx = sx - 10; mx < sx + w + 10; mx += 16) {
      ctx.beginPath();
      ctx.arc(mx, sy - 12, 6, 0, Math.PI * 2);
      ctx.arc(mx + 6, sy - 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Cascading Water Torrents (multi-stop depth gradient)
    const waterFallGrad = ctx.createLinearGradient(sx, sy, sx, sy + h);
    waterFallGrad.addColorStop(0, '#f0f9ff');   // crystalline white snowmelt crest
    waterFallGrad.addColorStop(0.2, '#bae6fd');
    waterFallGrad.addColorStop(0.6, '#38bdf8');
    waterFallGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = waterFallGrad;
    ctx.fillRect(sx, sy, w, h);

    // 3. Fast Foaming Water Streaks
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 9; i++) {
      const lineX = sx + 10 + i * 13 + Math.sin(time * 6 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(lineX, sy);
      ctx.lineTo(lineX + Math.sin(time * 4 + i) * 2, sy + h);
      ctx.stroke();
    }

    // 4. Frothing Plunge Pool with Bubbles & Dynamic Spray
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    for (let i = 0; i < 11; i++) {
      const bubbleX = sx + 8 + i * 11 + Math.cos(time * 5 + i) * 6;
      const bubbleY = sy + h + Math.sin(time * 5 + i) * 6;
      const radius = 5 + Math.sin(time * 7 + i) * 2.5;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Plunge pool mist particles
    ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
    for (let i = 0; i < 6; i++) {
      const mistX = sx + 15 + i * 18 + Math.sin(time * 3 + i) * 10;
      const mistY = sy + h + 10 + Math.cos(time * 2 + i) * 5;
      ctx.beginPath();
      ctx.arc(mistX, mistY, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Subtle rainbow mist prism at the plunge base
    ctx.save();
    ctx.globalAlpha = 0.35 + Math.sin(time * 2) * 0.15;
    const rainbowGrad = ctx.createLinearGradient(sx + 20, sy + h, sx + 80, sy + h + 15);
    rainbowGrad.addColorStop(0, '#ef4444');
    rainbowGrad.addColorStop(0.3, '#f59e0b');
    rainbowGrad.addColorStop(0.6, '#10b981');
    rainbowGrad.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = rainbowGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sx + 50, sy + h + 12, 22, Math.PI * 0.9, Math.PI * 1.8, false);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Detailed Handcrafted Wooden Bridges over the river
  public drawBridges(bridges: Bridge[], cameraX: number, cameraY: number, levelId: number = this.levelId) {
    const ctx = this.ctx;

    bridges.forEach(bridge => {
      const sx = bridge.x - cameraX;
      const sy = bridge.y - cameraY;

      // 1. Sturdy Stone Abutments on both riverbanks
      ctx.fillStyle = levelId === 3 ? '#334155' : '#64748b'; // dark mountain granite in L3
      ctx.beginPath();
      ctx.roundRect(sx - 6, sy - 2, 12, bridge.height + 4, 3);
      ctx.roundRect(sx + bridge.width - 6, sy - 2, 12, bridge.height + 4, 3);
      ctx.fill();

      // 2. Realistic Diagonal Cast Shadow over flowing water
      ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
      ctx.beginPath();
      ctx.moveTo(sx, sy + bridge.height);
      ctx.lineTo(sx + bridge.width, sy + bridge.height);
      ctx.lineTo(sx + bridge.width + 12, sy + bridge.height + 14);
      ctx.lineTo(sx + 12, sy + bridge.height + 14);
      ctx.closePath();
      ctx.fill();

      // 3. Heavy Wooden Support Beams underneath
      ctx.fillStyle = levelId === 3 ? '#1e293b' : '#451a03'; // steel-reinforced beams in L3
      ctx.fillRect(sx, sy + 3, bridge.width, 8);
      ctx.fillRect(sx, sy + bridge.height - 11, bridge.width, 8);

      // 4. Individual Handcrafted Timber Planks with realistic wood grain
      const plankCount = Math.floor(bridge.width / 15);
      const woodShades = ['#92400e', '#b45309', '#78350f', '#a16207', '#854d0e'];

      for (let i = 0; i < plankCount; i++) {
        const px = sx + i * 15;
        const woodColor = woodShades[i % woodShades.length];

        // Plank body
        ctx.fillStyle = woodColor;
        ctx.fillRect(px + 1, sy + 5, 13, bridge.height - 10);

        // Plank edge shadow (gap between planks)
        ctx.fillStyle = '#291102';
        ctx.fillRect(px + 13, sy + 5, 2, bridge.height - 10);

        // Subtle wood grain lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 5, sy + 8);
        ctx.lineTo(px + 5, sy + bridge.height - 8);
        ctx.stroke();

        // Counter-sunk Iron Nails / Bolts
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px + 4, sy + 9, 1.8, 0, Math.PI * 2);
        ctx.arc(px + 4, sy + bridge.height - 9, 1.8, 0, Math.PI * 2);
        ctx.fill();
        // Bolt highlight
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(px + 3.5, sy + 8.5, 0.8, 0, Math.PI * 2);
        ctx.arc(px + 3.5, sy + bridge.height - 9.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Sturdy Wooden Side Railings with Post Chamfers & Handrails
      ctx.fillStyle = '#78350f'; // top rail
      ctx.fillRect(sx - 3, sy, bridge.width + 6, 7);
      ctx.fillRect(sx - 3, sy + bridge.height - 7, bridge.width + 6, 7);

      // Railing top highlights
      ctx.fillStyle = '#b45309';
      ctx.fillRect(sx - 3, sy, bridge.width + 6, 2);
      ctx.fillRect(sx - 3, sy + bridge.height - 7, bridge.width + 6, 2);

      // Railing corner posts
      const postXs = [sx, sx + bridge.width / 2, sx + bridge.width];
      postXs.forEach(postX => {
        // Top Post
        ctx.fillStyle = '#451a03';
        ctx.fillRect(postX - 4, sy - 3, 8, 10);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(postX - 3, sy - 3, 6, 3); // post cap

        // Bottom Post
        ctx.fillStyle = '#451a03';
        ctx.fillRect(postX - 4, sy + bridge.height - 7, 8, 10);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(postX - 3, sy + bridge.height - 7, 6, 3);
      });
    });
  }

  // Draw Obstacles (Layered Trees, Chiseled Boulders, Mud Patches, Sun-baked Heat Cracks)
  public drawObstacles(obstacles: Obstacle[], cameraX: number, cameraY: number, time: number, levelId: number = this.levelId) {
    const ctx = this.ctx;

    obstacles.forEach(obs => {
      const sx = obs.x - cameraX;
      const sy = obs.y - cameraY;

      if (obs.type === 'heat_crack') {
        // LEVEL 2 HAZARD: Sun-baked cracked heat fissures with rising heat shimmer
        ctx.save();
        // Scorched dark earth perimeter
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2 + 1, obs.width * 0.54, obs.height * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing glowing heat bed
        const heatPulse = 0.75 + Math.sin(time * 4 + obs.x) * 0.25;
        ctx.fillStyle = `rgba(180, 83, 9, ${heatPulse})`;
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width * 0.46, obs.height * 0.44, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing magma/amber heat crack veins
        ctx.strokeStyle = `rgba(245, 158, 11, ${heatPulse})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx + obs.width * 0.18, sy + obs.height * 0.52);
        ctx.lineTo(sx + obs.width * 0.46, sy + obs.height * 0.42);
        ctx.lineTo(sx + obs.width * 0.78, sy + obs.height * 0.56);
        ctx.moveTo(sx + obs.width * 0.46, sy + obs.height * 0.42);
        ctx.lineTo(sx + obs.width * 0.52, sy + obs.height * 0.78);
        ctx.moveTo(sx + obs.width * 0.3, sy + obs.height * 0.28);
        ctx.lineTo(sx + obs.width * 0.46, sy + obs.height * 0.42);
        ctx.stroke();

        // Incandescent heat core
        ctx.fillStyle = `rgba(254, 240, 138, ${heatPulse * 0.95})`;
        ctx.beginPath();
        ctx.arc(sx + obs.width * 0.46, sy + obs.height * 0.45, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Warning heat distortion wave ripples
        const shimmer = Math.sin(time * 5 + obs.x) * 2;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(sx + obs.width / 2, sy + obs.height * 0.2 + shimmer, 9, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();

        ctx.restore();

      } else if (obs.type === 'mud') {
        // Realistic squelchy mud pit with wet specular sheen & soft banks
        ctx.save();
        // Wet mud earth edge
        ctx.fillStyle = '#542e0c';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2 + 1, obs.width * 0.54, obs.height * 0.54, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main rich muddy puddle
        ctx.fillStyle = '#3f2108';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width * 0.48, obs.height * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wet specular shine reflections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width * 0.4, sy + obs.height * 0.38, obs.width * 0.22, obs.height * 0.14, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Mud bubbles
        const bubBob = Math.sin(time * 3 + obs.x) * 1.5;
        ctx.fillStyle = '#713f12';
        ctx.beginPath();
        ctx.arc(sx + obs.width * 0.65, sy + obs.height * 0.55 + bubBob, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(sx + obs.width * 0.64, sy + obs.height * 0.54 + bubBob, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (obs.type === 'rock' || obs.type === 'canyon_rock' || obs.type === 'alpine_rock' || obs.type === 'sunstone_rock') {
        if (levelId === 4 || obs.type === 'sunstone_rock') {
          // LEVEL 4: Glowing Amber Sunstone Boulders & Crystal Crags
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(120, 53, 15, 0.35)';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 + 2, sy + obs.height - 3, obs.width * 0.54, obs.height * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dark shaded sunstone base
          ctx.fillStyle = '#92400e'; // deep amber brown
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Main sunlit rock face
          ctx.fillStyle = '#f59e0b'; // golden amber
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 3, sy + obs.height / 2 - 2, obs.width * 0.44, obs.height * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          // Top sun-baked brilliant highlight facet
          ctx.fillStyle = '#fef08a'; // bright yellow-white quartz sparkle
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 6, sy + obs.height / 2 - 6, obs.width * 0.28, obs.height * 0.24, -0.3, 0, Math.PI * 2);
          ctx.fill();

          // Crystalline facet lines
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(sx + obs.width * 0.3, sy + obs.height * 0.35);
          ctx.lineTo(sx + obs.width * 0.65, sy + obs.height * 0.45);
          ctx.moveTo(sx + obs.width * 0.25, sy + obs.height * 0.55);
          ctx.lineTo(sx + obs.width * 0.72, sy + obs.height * 0.65);
          ctx.stroke();

          ctx.restore();

        } else if (levelId === 3) {
          // LEVEL 3: Jagged Mountain Granite Crags with Frost & Snowy Caps
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 + 2, sy + obs.height - 3, obs.width * 0.54, obs.height * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dark shaded slate base
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Main granite rock face
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 2, sy + obs.height / 2 - 2, obs.width * 0.44, obs.height * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          // Top snow-dusted highlight facet
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 5, sy + obs.height / 2 - 6, obs.width * 0.3, obs.height * 0.22, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Granite cleft striations
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + obs.width * 0.3, sy + obs.height * 0.3);
          ctx.lineTo(sx + obs.width * 0.6, sy + obs.height * 0.48);
          ctx.moveTo(sx + obs.width * 0.25, sy + obs.height * 0.52);
          ctx.lineTo(sx + obs.width * 0.7, sy + obs.height * 0.65);
          ctx.stroke();

          ctx.restore();

        } else if (levelId === 2) {
          // LEVEL 2: Red Canyon Sandstone Boulders
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(67, 20, 5, 0.35)';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 + 2, sy + obs.height - 3, obs.width * 0.54, obs.height * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dark shaded canyon sandstone base
          ctx.fillStyle = '#7c2d12'; // deep mahogany red
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Main sunlit rock face
          ctx.fillStyle = '#c2410c'; // warm terracotta sandstone
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 3, sy + obs.height / 2 - 2, obs.width * 0.44, obs.height * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          // Top sun-baked highlight facet
          ctx.fillStyle = '#fdba74'; // warm amber desert glow
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 6, sy + obs.height / 2 - 6, obs.width * 0.28, obs.height * 0.24, -0.3, 0, Math.PI * 2);
          ctx.fill();

          // Canyon rock strata striations
          ctx.strokeStyle = '#431407';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(sx + obs.width * 0.3, sy + obs.height * 0.35);
          ctx.lineTo(sx + obs.width * 0.65, sy + obs.height * 0.45);
          ctx.moveTo(sx + obs.width * 0.25, sy + obs.height * 0.55);
          ctx.lineTo(sx + obs.width * 0.72, sy + obs.height * 0.65);
          ctx.stroke();

          ctx.restore();

        } else {
          // LEVEL 1: Slate Boulder with velvety green moss caps
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 + 2, sy + obs.height - 3, obs.width * 0.52, obs.height * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 3, sy + obs.height / 2 - 2, obs.width * 0.44, obs.height * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 - 6, sy + obs.height / 2 - 6, obs.width * 0.28, obs.height * 0.24, -0.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx + obs.width * 0.4, sy + obs.height * 0.3);
          ctx.lineTo(sx + obs.width * 0.55, sy + obs.height * 0.5);
          ctx.lineTo(sx + obs.width * 0.62, sy + obs.height * 0.65);
          ctx.stroke();

          ctx.fillStyle = '#4d7c0f';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width * 0.45, sy + obs.height * 0.28, obs.width * 0.3, obs.height * 0.16, 0.1, 0, Math.PI * 2);
          ctx.arc(sx + obs.width * 0.65, sy + obs.height * 0.32, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#84cc16';
          ctx.beginPath();
          ctx.arc(sx + obs.width * 0.42, sy + obs.height * 0.26, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

      } else if (obs.type === 'mist_patch') {
        // LEVEL 3: Mountain Mist & Scree Hazard
        ctx.save();
        ctx.fillStyle = 'rgba(224, 242, 254, 0.25)';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2, sy + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Scree pebbles
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(sx + obs.width * 0.3, sy + obs.height * 0.4, 2.5, 0, Math.PI * 2);
        ctx.arc(sx + obs.width * 0.65, sy + obs.height * 0.55, 3, 0, Math.PI * 2);
        ctx.arc(sx + obs.width * 0.45, sy + obs.height * 0.65, 2, 0, Math.PI * 2);
        ctx.fill();

        // Swirling vapor puff
        const mistWiggle = Math.sin(time * 3 + obs.x) * 4;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.35)';
        ctx.beginPath();
        ctx.arc(sx + obs.width * 0.5 + mistWiggle, sy + obs.height * 0.4, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      } else if (obs.type === 'tree' || obs.type === 'acacia_tree' || obs.type === 'pine_tree' || obs.type === 'palm_tree') {
        const sway = Math.sin(time * 1.8 + obs.x * 0.04) * 2.6;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
        ctx.beginPath();
        ctx.ellipse(sx + obs.width / 2 + 2, sy + obs.height - 4, obs.width * 0.54, obs.height * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        if (levelId === 4 || obs.type === 'palm_tree') {
          // LEVEL 4: Desert Date Palm Tree with Arching Fronds
          const bx = sx + obs.width / 2;
          const by = sy + obs.height * 0.55;
          const trunkW = 14;
          const trunkH = obs.height * 0.45;

          // Textured palm trunk (segmented rings)
          ctx.fillStyle = '#78350f';
          ctx.fillRect(bx - trunkW / 2, by, trunkW, trunkH);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.2;
          for (let py = by + 6; py < by + trunkH; py += 7) {
            ctx.beginPath();
            ctx.moveTo(bx - trunkW / 2, py);
            ctx.lineTo(bx + trunkW / 2, py);
            ctx.stroke();
          }

          // Dates cluster
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(bx - 5, by + 4, 3.5, 0, Math.PI * 2);
          ctx.arc(bx + 5, by + 4, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Palm fronds (8 radiating arching leaves with sway)
          ctx.save();
          ctx.translate(bx, by);
          for (let f = 0; f < 8; f++) {
            const angle = (f / 8) * Math.PI * 2 + sway * 0.05;
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = f % 2 === 0 ? '#15803d' : '#16a34a';
            ctx.beginPath();
            ctx.ellipse(22, 0, 24, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            // Frond spine
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(40, 0);
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();

        } else if (levelId === 3) {
          // LEVEL 3: Majestic Mountain Pines with Frosted Snowy Caps
          const bx = sx + obs.width / 2;
          const by = sy + obs.height * 0.5;
          const trunkW = 16;
          const trunkH = obs.height * 0.5;

          // Alpine cedar trunk
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.moveTo(bx - trunkW / 2 + 2, by);
          ctx.lineTo(bx + trunkW / 2 - 2, by);
          ctx.lineTo(bx + trunkW / 2 + 3, by + trunkH);
          ctx.lineTo(bx - trunkW / 2 - 3, by + trunkH);
          ctx.closePath();
          ctx.fill();

          // Snow-kissed conical pine tiers
          const alpineTiers = [
            { yOff: 0.72, w: obs.width * 0.54, h: 26, dark: '#064e3b', mid: '#065f46', light: '#f8fafc' },
            { yOff: 0.50, w: obs.width * 0.46, h: 24, dark: '#065f46', mid: '#047857', light: '#f1f5f9' },
            { yOff: 0.30, w: obs.width * 0.38, h: 22, dark: '#047857', mid: '#059669', light: '#ffffff' },
            { yOff: 0.12, w: obs.width * 0.26, h: 20, dark: '#065f46', mid: '#059669', light: '#ffffff' },
          ];

          alpineTiers.forEach(tier => {
            const tx = sx + obs.width / 2 + sway * (1.2 - tier.yOff);
            const ty = sy + obs.height * tier.yOff;

            ctx.fillStyle = tier.dark;
            ctx.beginPath();
            ctx.moveTo(tx - tier.w, ty);
            ctx.lineTo(tx, ty - tier.h);
            ctx.lineTo(tx + tier.w, ty);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = tier.mid;
            ctx.beginPath();
            ctx.moveTo(tx - tier.w * 0.85, ty - 2);
            ctx.lineTo(tx, ty - tier.h);
            ctx.lineTo(tx + tier.w * 0.85, ty - 2);
            ctx.closePath();
            ctx.fill();

            // Snow crown cap on tier
            ctx.fillStyle = tier.light;
            ctx.beginPath();
            ctx.moveTo(tx - tier.w * 0.45, ty - tier.h * 0.6);
            ctx.lineTo(tx, ty - tier.h);
            ctx.lineTo(tx + tier.w * 0.45, ty - tier.h * 0.6);
            ctx.closePath();
            ctx.fill();
          });

        } else if (levelId === 2) {
          // LEVEL 2: Distinctive Savannah Umbrella Acacia Trees
          const bx = sx + obs.width / 2;
          const by = sy + obs.height * 0.52;
          const trunkH = obs.height * 0.48;

          // Acacia sculpted curved trunk with branches spreading outward
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(bx - 6, by + trunkH);
          ctx.quadraticCurveTo(bx - 3, by + trunkH * 0.5, bx - 14, by);
          ctx.lineTo(bx - 8, by - 2);
          ctx.quadraticCurveTo(bx, by + trunkH * 0.4, bx + 16, by);
          ctx.lineTo(bx + 20, by + 2);
          ctx.quadraticCurveTo(bx + 4, by + trunkH * 0.5, bx + 6, by + trunkH);
          ctx.closePath();
          ctx.fill();

          // Layered flat horizontal umbrella canopies
          const acaciaTiers = [
            { ox: -12, oy: 0.38, w: obs.width * 0.42, h: 14, c: '#3f6212' },
            { ox: 14, oy: 0.34, w: obs.width * 0.46, h: 14, c: '#4d7c0f' },
            { ox: 0, oy: 0.22, w: obs.width * 0.58, h: 18, c: '#65a30d' },
            { ox: 0, oy: 0.12, w: obs.width * 0.48, h: 16, c: '#84cc16' },
          ];

          acaciaTiers.forEach(tier => {
            const tx = sx + obs.width / 2 + tier.ox + sway * (1.1 - tier.oy);
            const ty = sy + obs.height * tier.oy;
            ctx.fillStyle = tier.c;
            ctx.beginPath();
            ctx.ellipse(tx, ty, tier.w, tier.h, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          // Sunlit highlights on crown
          ctx.fillStyle = '#bef264';
          ctx.beginPath();
          ctx.ellipse(sx + obs.width / 2 + sway, sy + obs.height * 0.1, obs.width * 0.28, 6, 0, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // LEVEL 1: Lush Broadleaf Oaks & Majestic Conifers (Preserved exactly)
          const isPine = obs.id === 'tree-1' || obs.id === 'tree-4' || obs.id === 'tree-7' || obs.id === 'tree-10';
          const bx = sx + obs.width / 2;
          const by = sy + obs.height * 0.5;
          const trunkW = 16;
          const trunkH = obs.height * 0.5;

          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(bx - trunkW / 2 + 2, by);
          ctx.lineTo(bx + trunkW / 2 - 2, by);
          ctx.lineTo(bx + trunkW / 2 + 3, by + trunkH);
          ctx.lineTo(bx - trunkW / 2 - 3, by + trunkH);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(bx - 2, by + 4);
          ctx.lineTo(bx - 2, by + trunkH - 2);
          ctx.moveTo(bx + 3, by + 6);
          ctx.lineTo(bx + 4, by + trunkH - 3);
          ctx.stroke();

          if (isPine) {
            const tiers = [
              { yOff: 0.72, w: obs.width * 0.52, h: 26, dark: '#14532d', mid: '#15803d', light: '#22c55e' },
              { yOff: 0.50, w: obs.width * 0.44, h: 24, dark: '#15803d', mid: '#16a34a', light: '#4ade80' },
              { yOff: 0.30, w: obs.width * 0.36, h: 22, dark: '#16a34a', mid: '#22c55e', light: '#86efac' },
              { yOff: 0.12, w: obs.width * 0.24, h: 20, dark: '#15803d', mid: '#22c55e', light: '#bbf7d0' },
            ];

            tiers.forEach(tier => {
              const tx = sx + obs.width / 2 + sway * (1.2 - tier.yOff);
              const ty = sy + obs.height * tier.yOff;

              ctx.fillStyle = tier.dark;
              ctx.beginPath();
              ctx.moveTo(tx - tier.w, ty);
              ctx.lineTo(tx, ty - tier.h);
              ctx.lineTo(tx + tier.w, ty);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = tier.mid;
              ctx.beginPath();
              ctx.moveTo(tx - tier.w * 0.85, ty - 2);
              ctx.lineTo(tx, ty - tier.h);
              ctx.lineTo(tx + tier.w * 0.85, ty - 2);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = tier.light;
              ctx.beginPath();
              ctx.moveTo(tx - tier.w * 0.7, ty - 4);
              ctx.lineTo(tx, ty - tier.h);
              ctx.lineTo(tx + 2, ty - 4);
              ctx.closePath();
              ctx.fill();
            });

          } else {
            const foliageLobes = [
              { ox: -obs.width * 0.22, oy: obs.height * 0.52, r: obs.width * 0.36, color: '#14532d' },
              { ox: obs.width * 0.22, oy: obs.height * 0.52, r: obs.width * 0.36, color: '#14532d' },
              { ox: -obs.width * 0.25, oy: obs.height * 0.38, r: obs.width * 0.38, color: '#16a34a' },
              { ox: obs.width * 0.25, oy: obs.height * 0.38, r: obs.width * 0.38, color: '#16a34a' },
              { ox: 0, oy: obs.height * 0.44, r: obs.width * 0.42, color: '#15803d' },
              { ox: -obs.width * 0.12, oy: obs.height * 0.22, r: obs.width * 0.36, color: '#22c55e' },
              { ox: obs.width * 0.12, oy: obs.height * 0.22, r: obs.width * 0.36, color: '#22c55e' },
              { ox: 0, oy: obs.height * 0.14, r: obs.width * 0.32, color: '#4ade80' }
            ];

            foliageLobes.forEach(lobe => {
              const lx = sx + obs.width / 2 + lobe.ox + sway * (1.2 - lobe.oy / obs.height);
              const ly = sy + lobe.oy;
              ctx.fillStyle = lobe.color;
              ctx.beginPath();
              ctx.arc(lx, ly, lobe.r, 0, Math.PI * 2);
              ctx.fill();
            });

            ctx.fillStyle = '#86efac';
            ctx.beginPath();
            ctx.arc(sx + obs.width * 0.42 + sway, sy + obs.height * 0.18, obs.width * 0.14, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }
    });
  }

  // Draw Water Source (River Spring / Waterfall Pool) with lily pads & stepping stones
  public drawWaterSource(source: WaterSource, cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    const sx = source.x - cameraX;
    const sy = source.y - cameraY;

    // 1. Natural Stepping Stones & River Gravel encircling the spring basin
    ctx.fillStyle = '#94a3b8';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const stoneX = sx + Math.cos(a) * (source.radius + 10);
      const stoneY = sy + Math.sin(a) * (source.radius + 8);
      ctx.beginPath();
      ctx.ellipse(stoneX, stoneY, 7, 5, a, 0, Math.PI * 2);
      ctx.fill();
      // Stone highlight
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(stoneX - 2, stoneY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
    }

    // 2. Glowing pulsating aura
    const pulse = Math.sin(time * 3.5) * 5;
    const auraGrad = ctx.createRadialGradient(sx, sy, 5, sx, sy, source.radius + pulse + 14);
    auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
    auraGrad.addColorStop(0.65, 'rgba(14, 165, 233, 0.3)');
    auraGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, source.radius + pulse + 14, 0, Math.PI * 2);
    ctx.fill();

    // 3. Crystal spring basin
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(sx, sy, source.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright water
    const innerGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, source.radius * 0.7);
    innerGrad.addColorStop(0, '#f0f9ff');
    innerGrad.addColorStop(0.5, '#bae6fd');
    innerGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, source.radius * 0.72, 0, Math.PI * 2);
    ctx.fill();

    // Concentric spring ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    const rippleR = ((time * 18) % (source.radius * 0.7));
    ctx.beginPath();
    ctx.arc(sx, sy, rippleR, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Floating Water Lily Pad with miniature pink lotus flower
    const lilyX = sx - source.radius * 0.45;
    const lilyY = sy - source.radius * 0.3;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(lilyX, lilyY, 7, 0.3, Math.PI * 1.8, false);
    ctx.lineTo(lilyX, lilyY);
    ctx.closePath();
    ctx.fill();

    // Pink Lotus blossom
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(lilyX + 2, lilyY - 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(lilyX + 2, lilyY - 2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Water Drop Icon in center
    this.drawWaterDropIcon(sx, sy - 2, 14, '#0284c7');

    // 6. Label banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(sx - 58, sy + source.radius + 6, 116, 23, 7);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(source.name || 'Fresh Spring', sx, sy + source.radius + 22);
  }

  // Draw Flower Beds (Wilted vs Bloomed) with rich soil and sparkling petals
  public drawFlowerBeds(flowers: FlowerBed[], cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;

    flowers.forEach(flower => {
      const sx = flower.x - cameraX;
      const sy = flower.y - cameraY;

      // 1. Rich Dark Garden Soil Mound with stone borders
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 12, flower.radius + 3, flower.radius * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = flower.isBloomed ? '#3f2108' : '#542e0c';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 10, flower.radius, flower.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soil texture specks
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(sx - 8, sy + 9, 1.8, 0, Math.PI * 2);
      ctx.arc(sx + 7, sy + 11, 2, 0, Math.PI * 2);
      ctx.fill();

      if (!flower.isBloomed) {
        // Wilted flower: drooping dry stem, faded head, animated needs water prompt
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx, sy + 10);
        ctx.quadraticCurveTo(sx + 10, sy, sx + 14, sy - 4);
        ctx.stroke();

        // Drooping wilted blossom
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(sx + 14, sy - 4, 7, 0, Math.PI * 2);
        ctx.fill();

        // "Needs Water" speech bubble icon
        const bob = Math.sin(time * 3 + flower.x) * 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(sx - 25, sy - 36 + bob, 50, 21, 6);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Water Drop & Counter
        this.drawWaterDropIcon(sx - 13, sy - 26 + bob, 7, '#0284c7');
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${flower.waterGiven}/${flower.waterRequired}L`, sx - 5, sy - 21 + bob);

      } else {
        // Bloomed radiant flower with smooth unfurling animation, vibrant colors & sparkling aura
        const animProgress = Math.min(1, Math.max(0.05, flower.bloomAnimation));
        // Ease-out overshoot: starts small (0.35), unfurls with slight spring overshoot to 1.0
        const easeGrowth = animProgress < 1 
          ? Math.sin(animProgress * Math.PI * 0.5) * (0.85 + 0.2 * Math.sin(animProgress * Math.PI))
          : 1.0;
        const scale = (0.35 + 0.65 * easeGrowth) + Math.sin(time * 3 + flower.x) * 0.04;
        const stemSway = Math.sin(time * 2.5 + flower.x) * 2;
        const unfurlRotation = (1 - animProgress) * 0.5;

        // Glowing aura during bloom
        ctx.save();
        ctx.globalAlpha = Math.min(0.5, animProgress * 0.5);
        const glowGrad = ctx.createRadialGradient(sx + stemSway, sy - 10, 2, sx + stemSway, sy - 10, 24);
        glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        glowGrad.addColorStop(0.5, flower.color);
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(sx + stemSway, sy - 10, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Healthy green stem & leaves
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy + 10);
        ctx.quadraticCurveTo(sx + stemSway * 0.5, sy, sx + stemSway, sy - 8);
        ctx.stroke();

        // Serrated green leaves
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(sx - 8, sy + 1, 8 * easeGrowth, 4.5 * easeGrowth, -0.4, 0, Math.PI * 2);
        ctx.ellipse(sx + 8, sy + 3, 8 * easeGrowth, 4.5 * easeGrowth, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Petals radiating around center
        ctx.save();
        ctx.translate(sx + stemSway, sy - 10);
        ctx.rotate(unfurlRotation);
        ctx.scale(scale, scale);

        const petals = flower.petals || 6;
        for (let i = 0; i < petals; i++) {
          const angle = (i * (Math.PI * 2)) / petals;
          ctx.fillStyle = flower.color;
          ctx.beginPath();
          const px = Math.cos(angle) * 12;
          const py = Math.sin(angle) * 12;
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();

          // Petal edge highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(px * 0.9, py * 0.9, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Flower golden center
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Center pollen dots
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Dewdrop glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-2, -3, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });
  }

  // Draw Hand-Pump / Gravity Intake / Biosand Filter Station
  public drawHandPump(pump: HandPumpStation, cameraX: number, cameraY: number, time: number, levelId: number = this.levelId) {
    const ctx = this.ctx;
    const sx = pump.x - cameraX;
    const sy = pump.y - cameraY;

    if (levelId === 4) {
      // LEVEL 4: Biosand Filtration Tank Station
      // Concrete foundation platform
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(sx - 34, sy + 14, 68, 26, 6);
      ctx.fill();

      // Main Concrete Filter Tank
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.roundRect(sx - 26, sy - 30, 52, 48, 6);
      ctx.fill();

      // Transparent Inspection Cross-Section Window
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx - 20, sy - 26, 40, 40);

      // 4 Internal Filter Layers:
      // Layer 1: Underdrain Gravel (bottom)
      ctx.fillStyle = '#475569';
      ctx.fillRect(sx - 19, sy + 6, 38, 7);
      // Layer 2: Coarse Sand
      ctx.fillStyle = '#b45309';
      ctx.fillRect(sx - 19, sy - 2, 38, 7);
      // Layer 3: Fine Silica Sand
      ctx.fillStyle = '#eab308';
      ctx.fillRect(sx - 19, sy - 18, 38, 15);
      // Layer 4: Living Biolayer (Schmutzdecke)
      ctx.fillStyle = '#15803d';
      ctx.fillRect(sx - 19, sy - 25, 38, 6);

      // Diffuser Plate / Lid on top
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(sx - 28, sy - 36, 56, 7, 3);
      ctx.fill();

      // Clean Water Outlet Pipe & Tap
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(sx + 26, sy + 2, 10, 5);
      if (pump.isCompleted) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sx + 34, sy + 7, 3, 14);
      }

      // Earthenware clay water pot below tap
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.ellipse(sx + 35, sy + 24, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Overhead Banner
      const bob = Math.sin(time * 3 + pump.x) * 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(sx - 66, sy - 58 + bob, 132, 23, 6);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      const filterText = pump.isCompleted ? '✓ Biosand Filter Active' : 'Biosand Filter Station';
      ctx.fillText(filterText, sx, sy - 43 + bob);
      return;
    }

    // Stone base / platform with chamfers
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(sx - 36, sy + 14, 72, 26, 8);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(sx - 32, sy + 16, 64, 12, 4);
    ctx.fill();

    // Pump Body (classic deep-well cylinder or alpine siphon valve)
    ctx.fillStyle = '#0284c7'; // vibrant blue pump body
    ctx.fillRect(sx - 10, sy - 25, 20, 42);

    // Metallic highlight on cylinder
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sx - 8, sy - 25, 4, 42);

    // Pump cap & head
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(sx - 14, sy - 32, 28, 9);

    // Spout with drip
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(sx + 10, sy - 12, 16, 7);
    ctx.fillRect(sx + 22, sy - 5, 5, 8);

    // Water trickling from spout if active or completed
    if (pump.pumpsCompleted > 0) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(sx + 23, sy + 3, 3, 14);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx + 24.5, sy + 17, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pump Handle (rocking lever)
    const handleAngle = pump.pumpsCompleted % 2 === 0 ? -0.25 : 0.25;
    ctx.save();
    ctx.translate(sx - 10, sy - 28);
    ctx.rotate(handleAngle);
    ctx.fillStyle = '#1e293b'; // cast iron handle
    ctx.fillRect(-35, -4, 38, 7);
    ctx.fillStyle = '#e2e8f0'; // handle knob
    ctx.beginPath();
    ctx.arc(-35, -0.5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Storage Jerrycan / Reservoir intake pipe
    ctx.fillStyle = levelId === 3 ? '#0284c7' : '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(sx + 16, sy + 10, 18, 16, 3);
    ctx.fill();
    ctx.fillStyle = levelId === 3 ? '#0369a1' : '#b45309';
    ctx.fillRect(sx + 20, sy + 6, 10, 4);

    // Overhead Banner
    const bob = Math.sin(time * 3 + pump.x) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(sx - 66, sy - 58 + bob, 132, 23, 6);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    const pumpText = pump.isCompleted 
      ? (levelId === 3 ? '✓ Intake Active' : '✓ Well Active') 
      : (levelId === 3 ? `Gravity Intake [${pump.pumpsCompleted}/${pump.targetPumps}]` : `Borehole Pump [${pump.pumpsCompleted}/${pump.targetPumps}]`);
    ctx.fillText(pumpText, sx, sy - 43 + bob);
  }

  // Draw Community Water Cistern & Village Goal
  public drawCommunityGoal(goal: CommunityGoal, cameraX: number, cameraY: number, time: number, levelId: number = this.levelId) {
    const ctx = this.ctx;
    const sx = goal.x - cameraX;
    const sy = goal.y - cameraY;

    // Platform shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(sx + 4, sy + goal.height - 8, goal.width, 24, 8);
    ctx.fill();

    // Stone Foundation
    ctx.fillStyle = levelId === 4 ? '#78350f' : (levelId === 3 ? '#1e293b' : '#64748b'); // adobe brick vs dark granite vs slate foundation
    ctx.beginPath();
    ctx.roundRect(sx - 4, sy + goal.height - 12, goal.width + 8, 16, 4);
    ctx.fill();

    if (levelId === 4) {
      // LEVEL 4: Sunstone Oasis Village Adobe Masonry Cistern
      ctx.fillStyle = '#b45309'; // warm adobe terracotta
      ctx.beginPath();
      ctx.roundRect(sx, sy, goal.width, goal.height, 10);
      ctx.fill();

      // Adobe plaster texture & sunstone tile border
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(sx + 4, sy + 4, goal.width - 8, goal.height - 8);

      // Sunstone crystal inlays on wall
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx + 20, sy + 25, 4, 0, Math.PI * 2);
      ctx.arc(sx + 45, sy + 25, 4, 0, Math.PI * 2);
      ctx.arc(sx + 70, sy + 25, 4, 0, Math.PI * 2);
      ctx.fill();

      // Striped desert awning canopy on top
      const awningStripes = ['#ef4444', '#facc15', '#0284c7', '#ef4444', '#facc15'];
      for (let s = 0; s < 5; s++) {
        ctx.fillStyle = awningStripes[s];
        ctx.fillRect(sx - 4 + s * (goal.width + 8) / 5, sy - 8, (goal.width + 8) / 5, 8);
      }

      // Brass outflow tap
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(sx + goal.width, sy + 42, 14, 6);
      ctx.fillRect(sx + goal.width + 10, sy + 48, 4, 12);

    } else if (levelId === 3) {
      // LEVEL 3: Mountain Stone Masonry Cistern & Gravity Distribution Hub
      ctx.fillStyle = '#334155'; // deep mountain slate stone masonry
      ctx.beginPath();
      ctx.roundRect(sx, sy, goal.width, goal.height, 10);
      ctx.fill();

      // Ashlar stone block courses & mortar lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      for (let yCourse = sy + 16; yCourse < sy + goal.height - 10; yCourse += 18) {
        ctx.beginPath();
        ctx.moveTo(sx + 4, yCourse);
        ctx.lineTo(sx + goal.width - 4, yCourse);
        ctx.stroke();
      }
      // Vertical stone mortar joints
      for (let xJoint = sx + 18; xJoint < sx + goal.width - 15; xJoint += 28) {
        ctx.beginPath();
        ctx.moveTo(xJoint, sy + 4);
        ctx.lineTo(xJoint, sy + 34);
        ctx.moveTo(xJoint + 14, sy + 34);
        ctx.lineTo(xJoint + 14, sy + goal.height - 4);
        ctx.stroke();
      }

      // Alpine timber roof eaves / canopy
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(sx - 6, sy - 4, goal.width + 12, 10, 4);
      ctx.fill();

      // Gravity piped distribution network on side (supplying village homes downhill)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sx + goal.width, sy + 40, 18, 8);
      ctx.fillRect(sx + goal.width + 10, sy + 40, 8, 36);
      // Brass shutoff valve
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sx + goal.width + 14, sy + 38, 4.5, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Main Wood Cistern Tank with wood staves (Level 1 & Level 2)
      ctx.fillStyle = '#78350f'; // rich mahogany wood
      ctx.beginPath();
      ctx.roundRect(sx, sy, goal.width, goal.height, 12);
      ctx.fill();

      // Wood stave vertical lines
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      for (let st = sx + 14; st < sx + goal.width - 10; st += 14) {
        ctx.beginPath();
        ctx.moveTo(st, sy + 2);
        ctx.lineTo(st, sy + goal.height - 2);
        ctx.stroke();
      }

      // Heavy Iron Hoops / Bands
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx, sy + 18, goal.width, 7);
      ctx.fillRect(sx, sy + goal.height - 24, goal.width, 7);
      // Iron rivets
      ctx.fillStyle = '#94a3b8';
      for (let r = sx + 8; r < sx + goal.width; r += 16) {
        ctx.beginPath();
        ctx.arc(r, sy + 21.5, 1.6, 0, Math.PI * 2);
        ctx.arc(r, sy + goal.height - 20.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Water level glass gauge window (calibrated dynamically to targetWater)
    const gaugeX = sx + goal.width - 24;
    const gaugeY = sy + 15;
    const gaugeW = 12;
    const gaugeH = goal.height - 30;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);

    // Water fill level inside gauge
    const fillPercent = Math.min(1, goal.currentWater / goal.targetWater);
    const waterH = gaugeH * fillPercent;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(gaugeX + 1, gaugeY + gaugeH - waterH, gaugeW - 2, waterH);

    // Festive Bunting / Pennants across top
    const pennants = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#ec4899'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = pennants[i];
      ctx.beginPath();
      const px = sx + 12 + i * 16;
      ctx.moveTo(px, sy);
      ctx.lineTo(px + 14, sy);
      ctx.lineTo(px + 7, sy + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Community Village Sign
    const bob = Math.sin(time * 3 + goal.x) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.beginPath();
    ctx.roundRect(sx - 10, sy - 36 + bob, goal.width + 20, 28, 7);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${goal.name}`, sx + goal.width / 2, sy - 19 + bob);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`Reservoir: ${goal.currentWater}/${goal.targetWater}L`, sx + goal.width / 2, sy - 6 + bob);
  }

  // Draw Trivia Knowledge Checkpoint
  public drawTriviaStation(station: TriviaStation, cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    const sx = station.x - cameraX;
    const sy = station.y - cameraY;

    // Stone pedestal
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(sx - 20, sy - 15, 40, 36, 6);
    ctx.fill();

    // Glowing Knowledge Stone / Open Book
    const glow = Math.sin(time * 4) * 3;
    ctx.fillStyle = station.isCompleted ? '#86efac' : '#fde047';
    ctx.beginPath();
    ctx.arc(sx, sy - 14 + glow, 14, 0, Math.PI * 2);
    ctx.fill();

    // Emblem
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(station.isCompleted ? '✓' : '?', sx, sy - 9 + glow);

    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(sx - 48, sy + 25, 96, 21, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.fillText(station.isCompleted ? 'Trivia Solved' : 'Water Trivia', sx, sy + 39);
  }

  // Draw Butterflies fluttering
  public drawButterflies(butterflies: Butterfly[], cameraX: number, cameraY: number) {
    const ctx = this.ctx;

    butterflies.forEach(b => {
      const sx = b.x - cameraX;
      const sy = b.y - cameraY;

      ctx.save();
      ctx.translate(sx, sy);

      // Wing flapping animation
      const wingW = Math.cos(b.wingAngle) * 7.5;

      ctx.fillStyle = b.color;
      // Left wing
      ctx.beginPath();
      ctx.ellipse(-wingW / 2 - 2, -2, Math.abs(wingW), 6.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.ellipse(wingW / 2 + 2, -2, Math.abs(wingW), 6.5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Wing borders
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tiny body & antennas
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  // Draw Hippry the Sea Otter - High Legibility & Cute Expression
  public drawPlayer(player: Player, cameraX: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    const sx = player.x - cameraX;
    const sy = player.y - cameraY;

    // Movement bob and leg cycle
    const isMoving = player.isMoving;
    const bob = isMoving ? Math.sin(player.walkCycle * 2) * 3 : Math.sin(time * 3) * 1.5;
    const legOffset = isMoving ? Math.sin(player.walkCycle) * 5 : 0;

    // 1. Crisp Contact Ground Shadow (ensures Hippry pops from all terrains)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 18, 17, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(sx, sy + bob);

    // 2. Otter Tail (swishes when moving)
    const tailAngle = isMoving ? Math.sin(player.walkCycle) * 0.4 : Math.sin(time * 2) * 0.15;
    ctx.save();
    if (player.facing === 'left') {
      ctx.translate(14, 10);
      ctx.rotate(tailAngle + 0.3);
    } else if (player.facing === 'right') {
      ctx.translate(-14, 10);
      ctx.rotate(-tailAngle - 0.3);
    } else if (player.facing === 'up') {
      ctx.translate(0, 14);
      ctx.rotate(tailAngle);
    } else {
      ctx.translate(0, 12);
      ctx.rotate(tailAngle);
    }
    // Tail shape with warm brown tone
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Otter Feet / Paws
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    // Left foot
    ctx.ellipse(-10, 16 + legOffset, 5, 4, 0, 0, Math.PI * 2);
    // Right foot
    ctx.ellipse(10, 16 - legOffset, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Otter Body with subtle rim highlight
    ctx.fillStyle = '#92400e'; // rich warm brown fur
    ctx.beginPath();
    ctx.ellipse(0, 6, 17, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle sunlit rim highlight on fur
    ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
    ctx.beginPath();
    ctx.arc(-4, 3, 14, Math.PI * 0.8, Math.PI * 1.8);
    ctx.fill();

    // Otter Belly (creamy beige chest patch, visible when facing down/sides)
    if (player.facing !== 'up') {
      ctx.fillStyle = '#fef08a'; // soft cream yellow belly
      ctx.beginPath();
      const bellyX = player.facing === 'left' ? -4 : player.facing === 'right' ? 4 : 0;
      ctx.ellipse(bellyX, 8, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Water Satchel / Canteen carried by Hippry
    if (player.waterAmount > 0) {
      const satchelX = player.facing === 'left' ? 12 : player.facing === 'right' ? -12 : 12;
      const satchelY = 4;

      // Satchel leather strap
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, -2);
      ctx.lineTo(satchelX, satchelY + 6);
      ctx.stroke();

      // Clear glass canteen filled with sparkling water
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(satchelX, satchelY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Water inside canteen with dynamic fill ratio
      const waterRatio = player.waterAmount / player.maxWater;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(satchelX, satchelY, 8.5 * waterRatio, 0, Math.PI * 2);
      ctx.fill();

      // Glass specular glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(satchelX - 3, satchelY - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cork / wooden stopper
      ctx.fillStyle = '#b45309';
      ctx.fillRect(satchelX - 3, satchelY - 13, 6, 4);
    }

    // 6. Otter Head
    ctx.fillStyle = '#a16207'; // otter head
    ctx.beginPath();
    ctx.ellipse(0, -12, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-14, -20, 5, 0, Math.PI * 2);
    ctx.arc(14, -20, 5, 0, Math.PI * 2);
    ctx.fill();
    // Inner ear
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(-14, -20, 2.5, 0, Math.PI * 2);
    ctx.arc(14, -20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snout / Muzzle (creamy beige)
    if (player.facing !== 'up') {
      const snoutX = player.facing === 'left' ? -6 : player.facing === 'right' ? 6 : 0;
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(snoutX, -8, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute dark button nose
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(snoutX, -10, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful smiling mouth
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(snoutX - 2, -6, 2.5, 0, Math.PI);
      ctx.arc(snoutX + 2, -6, 2.5, 0, Math.PI);
      ctx.stroke();

      // Big Sparkly Eyes
      ctx.fillStyle = '#0f172a';
      if (player.facing === 'down') {
        // Left Eye
        ctx.beginPath();
        ctx.arc(-7, -14, 3.5, 0, Math.PI * 2);
        ctx.arc(7, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye shines
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-6, -15, 1.2, 0, Math.PI * 2);
        ctx.arc(8, -15, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (player.facing === 'left') {
        ctx.beginPath();
        ctx.arc(-10, -14, 3.5, 0, Math.PI * 2);
        ctx.arc(-2, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-11, -15, 1.2, 0, Math.PI * 2);
        ctx.arc(-3, -15, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (player.facing === 'right') {
        ctx.beginPath();
        ctx.arc(2, -14, 3.5, 0, Math.PI * 2);
        ctx.arc(10, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(3, -15, 1.2, 0, Math.PI * 2);
        ctx.arc(11, -15, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Whisker dots
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(snoutX - 4, -7, 1, 0, Math.PI * 2);
      ctx.arc(snoutX + 4, -7, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // 7. Action Interaction Prompt above Hippry's head with drop shadow & clean border
    if (player.activeInteractionPrompt) {
      const promptY = sy - 38 + Math.sin(time * 5) * 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      const textWidth = ctx.measureText(player.activeInteractionPrompt).width;
      const boxW = Math.max(textWidth + 24, 90);
      const boxH = 26;

      ctx.beginPath();
      ctx.roundRect(sx - boxW / 2, promptY - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.activeInteractionPrompt, sx, promptY);
    }
  }

  // Draw Particles (Water ripples, petals, confetti, sparkles, and ambient forest motes)
  public drawParticles(particles: GameParticle[], cameraX: number, cameraY: number) {
    const ctx = this.ctx;

    particles.forEach(p => {
      const sx = p.x - cameraX;
      const sy = p.y - cameraY;
      const alpha = Math.max(0, p.life / p.maxLife);

      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.type === 'water_drop') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ripple') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * (1 - alpha * 0.5), 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'petal') {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'confetti') {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(p.rotation || 0);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        ctx.restore();
      } else if (p.type === 'sparkle') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'steam') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * (1.6 - alpha * 0.6), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'mist') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * (1.8 - alpha * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // Helper: Draw stylized water drop icon
  private drawWaterDropIcon(x: number, y: number, size: number, color: string) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size * 0.8, y - size * 0.2, x + size, y + size * 0.5, x, y + size);
    ctx.bezierCurveTo(x - size, y + size * 0.5, x - size * 0.8, y - size * 0.2, x, y - size);
    ctx.fill();
  }
}
