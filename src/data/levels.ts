import { LevelDefinition, WaterFact } from '../types/game';

export const WATER_FACTS: WaterFact[] = [
  {
    id: 'fact-1',
    title: 'The Global Water Gap',
    category: 'access',
    fact: 'Over 703 million people worldwide live without access to clean water close to home—roughly 1 in 10 people on Earth.',
    impact: 'Providing a community well or piped tap transforms health, safety, and economic freedom in just months.'
  },
  {
    id: 'fact-2',
    title: 'The Time Burden on Women & Girls',
    category: 'education',
    fact: 'Women and girls spend an estimated 200 million hours every single day walking miles just to fetch heavy water.',
    impact: 'When clean water arrives nearby, school attendance for girls increases dramatically, unlocking future dreams.'
  },
  {
    id: 'fact-3',
    title: 'Natural Underground Protection',
    category: 'solutions',
    fact: 'Water drawn from deep underground aquifers through sealed boreholes and hand-pumps is naturally filtered by layers of earth and stone.',
    impact: 'Protected deep wells shield drinking water from surface runoff, bacteria, and seasonal drought.'
  },
  {
    id: 'fact-4',
    title: 'The Power of Clean Hands',
    category: 'health',
    fact: 'Handwashing with clean water and soap is one of the most effective vaccines against disease, reducing diarrheal illness by over 40%.',
    impact: 'Clean water is the cornerstone of community health clinics, preventing infections and saving young lives.'
  },
  {
    id: 'fact-5',
    title: 'Gravity-Fed Piped Systems',
    category: 'solutions',
    fact: 'In mountainous regions, natural gravity is harnessed to deliver pristine spring water directly to village tap stands without using any electricity.',
    impact: 'Sustainable engineering allows clean water to flow continuously with zero fuel costs.'
  },
  {
    id: 'fact-6',
    title: 'Weight of Water',
    category: 'access',
    fact: 'A standard 20-liter jerrycan filled with water weighs over 44 pounds (20 kg), carried across rocky terrain for hours every day.',
    impact: 'Bringing safe water within a 15-minute walk eliminates severe spinal strain and physical injury for water collectors.'
  }
];

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    title: 'Whispering River & The Wilting Garden',
    region: 'Emerald Woodlands',
    tagline: 'Learn the basics of water transport and revive the forest blooms.',
    description: 'Help Hippry explore the lush forest trail. Collect fresh spring water, operate the village hand-pump, bloom the thirsty wildflower beds, and supply the community reservoir.',
    unlocked: true,
    stars: 0,
    parTimeSeconds: 120,
    targetWater: 100,
    flowerCount: 4,
    triviaQuestions: [
      {
        id: 'l1-q1',
        question: 'Why is water from a sealed underground hand-pump usually safer than water scooped from an open puddle?',
        options: [
          'It is protected underground and naturally filtered through rock and sand',
          'It has artificial food coloring added to it',
          'Open puddles are always poisoned by magic',
          'Water from pumps is warmer'
        ],
        correctIndex: 0,
        explanation: 'Groundwater is naturally filtered through layers of earth and sand, and a sealed pump keeps surface dirt and bacteria out!',
        funFact: 'A properly maintained borehole pump can provide clean water to over 300 villagers for decades.'
      },
      {
        id: 'l1-q2',
        question: 'How many people around the world currently lack access to clean, safe drinking water near their homes?',
        options: [
          'About 500 people',
          'Over 700 million people',
          'Exactly 10,000 people',
          'Zero, everyone has tap water'
        ],
        correctIndex: 1,
        explanation: 'Over 700 million people lack basic clean water access, but dedicated community water projects are closing this gap every day.',
        funFact: 'Clean water projects improve community health, education, and economic prosperity simultaneously!'
      }
    ],
    keyFacts: [
      'Clean water reduces childhood illnesses by over 40%.',
      'Hand-pumps tap into protected subterranean aquifers.',
      'Watering thirsty plants restores the local biodiversity and insect life.'
    ]
  },
  {
    id: 2,
    title: 'The Dry Valley & Sunflower Village',
    region: 'The Dry Valley',
    tagline: 'Restore Sunflower Village and bring water to the cracked valley.',
    description: 'Venture into the dry valley where water is scarce and the sun is fierce. Avoid sun-baked heat cracks, restore the deep valley borehole well, revive five thirsty desert blooms, and fill the Sunflower Village reservoir!',
    unlocked: false,
    stars: 0,
    parTimeSeconds: 150,
    targetWater: 100,
    flowerCount: 5,
    triviaQuestions: [
      {
        id: 'l2-q1',
        question: 'Who bears the greatest daily time burden when fetching water in remote rural areas?',
        options: [
          'Women and young girls',
          'Local wildlife',
          'City tourists',
          'Automated drones'
        ],
        correctIndex: 0,
        explanation: 'Globally, women and girls spend 200 million hours every day collecting water, often missing school or paid work.',
        funFact: 'When clean water is accessible within a village, girls’ school attendance often increases by up to 30%!'
      }
    ],
    keyFacts: [
      'A standard 20-liter jerrycan weighs over 44 pounds (20 kg).',
      'Deep boreholes tap protected aquifers that stay clean even when summer droughts dry out surface streams.',
      'Watering desert wildflowers restores vital habitat for pollinators and local wildlife.'
    ]
  },
  {
    id: 3,
    title: 'Highland Mist & The Gravity Cistern',
    region: 'Cloud Peaks',
    tagline: 'Harness natural gravity to supply mountain families.',
    description: 'Scale the high misty peaks. Protect the pristine spring source and connect gravity-fed pipes to distribute fresh water to hilltop homes without using electricity.',
    unlocked: false,
    stars: 0,
    parTimeSeconds: 160,
    targetWater: 200,
    flowerCount: 6,
    triviaQuestions: [
      {
        id: 'l3-q1',
        question: 'What is a major advantage of a gravity-fed water system in hilly landscapes?',
        options: [
          'It requires no electricity or motor fuel to move water downhill',
          'It creates boiling water instantly',
          'It only works when it snows',
          'It turns water into juice'
        ],
        correctIndex: 0,
        explanation: 'Gravity naturally pulls water from high mountain springs down to storage tanks and tap stands with zero energy costs!',
        funFact: 'Gravity-fed systems can last over 30 years with simple community pipe maintenance.'
      }
    ],
    keyFacts: [
      'Protecting spring catchment zones prevents livestock contamination.',
      'Gravity pipelines deliver clean water directly to household clusters.'
    ]
  },
  {
    id: 4,
    title: 'Sunstone Dunes: Oasis Crossing & The Biosand Filter',
    region: 'Sunstone Dunes',
    tagline: 'Master sand, gravel, and biological filtration in the sunlit desert.',
    description: 'Traverse the shimmering Sunstone Dunes. Harvest fresh oasis water, construct a 4-layer biosand filter to clarify turbid river runoff, revive 5 desert blooms, and supply Sunstone Oasis Village!',
    unlocked: false,
    stars: 0,
    parTimeSeconds: 180,
    targetWater: 100,
    flowerCount: 5,
    triviaQuestions: [
      {
        id: 'l4-q1',
        question: 'Does filtering turbid water through a biosand filter guarantee that all pathogens and viruses are eliminated?',
        options: [
          'No, filtration traps bacteria and parasites, but boiling or chemical disinfection is still required for viruses',
          'Yes, fine sand instantly vaporizes all viruses and chemical poisons',
          'No, sand filters only change the color of the water without cleaning anything',
          'Yes, sand has magical properties that sterilize water immediately'
        ],
        correctIndex: 0,
        explanation: 'Biosand filtration traps sediment, amoebae, and bacteria, but microscopic viruses and dissolved chemical toxins can pass through. Secondary disinfection (chlorination, solar SODIS, or boiling) ensures complete drinking safety!',
        funFact: 'Combining biosand filtration with solar disinfection (SODIS) provides a low-cost, multi-barrier purification system.'
      },
      {
        id: 'l4-q2',
        question: 'What is the "schmutzdecke" (biolayer) at the top of a biosand filter, and what role does it play?',
        options: [
          'A living community of beneficial microbes that feeds on and destroys harmful pathogens',
          'An artificial plastic coating that prevents leaks',
          'Toxic mold that must be removed immediately',
          'A layer of decorative pebbles to make the filter look nice'
        ],
        correctIndex: 0,
        explanation: 'The biological zone (schmutzdecke) develops naturally over 2-3 weeks; beneficial protozoa and bacteria in this layer consume incoming pathogens through bio-predation!',
        funFact: 'Biosand filters operate continuously for decades using ordinary locally sourced gravel and silica sand.'
      }
    ],
    keyFacts: [
      'Biosand filters use mechanical straining, bio-predation, and sedimentation to purify water.',
      'Physical filtration removes turbidity and bacteria, but secondary disinfection or boiling is needed to eradicate viruses.',
      'The schmutzdecke is an active biological biofilm that consumes disease-causing microbes naturally.'
    ]
  }
];
