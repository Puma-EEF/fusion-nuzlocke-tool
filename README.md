# Pokemon Fusion Nuzlocke Tool

A comprehensive web application for Pokemon Infinite Fusion players to browse Pokemon data, calculate fusion combinations, and manage their Nuzlocke runs.

## Features

### Pokédex Browser
- Browse all Pokemon with detailed stats and information
- Advanced filtering system:
  - Search by name or internal name
  - Filter by type (single or dual type combinations)
  - Search by ability (with autocomplete)
  - Search by move (with autocomplete)
- Sort by Dex #, HP, ATK, DEF, SPA, SPD, SPE, or BST
- Exclude legendary and sub-legendary Pokemon
- View comprehensive Pokemon data including:
  - Base stats and BST
  - All learnable moves (level-up, tutor, TM, HM, egg moves)
  - Abilities (normal and hidden)
  - Evolution chains
  - Physical characteristics and Pokedex entries

### Fusion Calculator
- Calculate fusion combinations between any two Pokemon
- See both possible fusion combinations (A+B head/body and B+A head/body)
- View resulting:
  - Types (inherits from both Pokemon)
  - Base stats (physical stats favor body, special stats favor head)
  - Base Stat Total
  - Combined abilities
  - Effective stats calculation based on nature and IVs

### Box & Team Management
- Track caught Pokemon during your Nuzlocke run
- Multiple tabs for different functionality:
  - **Fusion Tab**: Quickly calculate fusions with box Pokemon
  - **Stats Tab**: View effective stats with nature and IV inputs
  - **Team Tab**: Organize your active party
  - **Compare Tab**: Compare multiple Pokemon side-by-side
  - **Set MonInfo Tab**: Edit Pokemon details
- Apply filters to your box
- Persistent storage using browser local storage

## Tech Stack

- **React 19.2** with TypeScript
- **Vite 7** for fast development and building
- **TypeScript 5.9** for full type safety
- **ESLint 9** for code quality
- Fully typed with comprehensive TypeScript definitions

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fusion-nuzlocke-tool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EvolutionLine.tsx
│   ├── KeyValueRow.tsx
│   ├── PokedexFilterBar.tsx
│   ├── PokemonSprite.tsx
│   ├── SpriteTile.tsx
│   ├── box/             # Box management components
│   │   ├── BoxManagement.tsx
│   │   └── Tabs/        # Box management tabs
│   │       ├── CompareTab.tsx
│   │       ├── FusionTab.tsx
│   │       ├── SetMoninfoTab.tsx
│   │       ├── StatsTab.tsx
│   │       ├── TeamTab.tsx
│   │       └── tabTypes.ts
│   └── moves/           # Move-related components
│       ├── LearnsetViewer.tsx
│       ├── MoveRowHover.tsx
│       └── MoveSections.tsx
├── data/                # JSON data files
│   ├── abilities.json
│   ├── evolutions_if.json
│   ├── FileC_full.json
│   ├── learnsets.json
│   ├── machines_if.json
│   ├── move_pools_if.json
│   ├── moves.json
│   └── species.json
├── lib/                 # Utility functions and business logic
│   ├── boxStorage.ts    # Local storage for box management
│   ├── effectiveStats.ts # Stats calculations with IVs/nature
│   ├── evolutionMap.ts
│   ├── fusion.ts        # Fusion calculation logic
│   ├── learnsetIndex.ts
│   ├── legendary.ts
│   ├── pokedex/
│   │   ├── filterEngine.ts
│   │   ├── lookups.ts
│   │   └── pokedexUtils.ts
│   └── types/           # TypeScript type definitions
│       ├── ability.ts
│       ├── box.ts
│       ├── learnset.ts
│       ├── moves.ts
│       ├── pokedexFilters.ts
│       └── species.ts
├── pages/               # Main page components
│   ├── BoxTeamPage.tsx
│   ├── DebugMoves.tsx
│   ├── FusionCalculator.tsx
│   └── Pokedex.tsx
├── utils/
│   └── sprites.ts       # Sprite URL utilities
└── App.tsx              # Main app with routing
```

## Data Sources

This app uses JSON data files for Pokemon information compatible with Pokemon Infinite Fusion. Data includes:
- Species data (stats, types, abilities, evolution chains)
- Move data (power, accuracy, effects, type, category)
- Ability data (names, descriptions)
- Learnset data (level-up moves, TM/HM, tutor moves, egg moves)
- Evolution data specific to Infinite Fusion
- Move pool data for egg moves and tutor moves
- Machine (TM/HM) compatibility data

## Key Features Detail

### Fusion Mechanics
The fusion calculator implements Pokemon Infinite Fusion's unique fusion formulas:
- Head Pokemon contributes special stats (Sp. Atk, Sp. Def, Speed) and primary type
- Body Pokemon contributes physical stats (HP, Attack, Defense) and secondary type
- Abilities are combined from both Pokemon
- Both head/body and body/head combinations can be calculated

### Effective Stats
Calculate actual in-game stats with:
- Nature modifiers (+10%/-10% to specific stats)
- Individual Values (IVs) from 0-31
- Level-based scaling
- Accurate stat formula implementation

## Contributing

This is a work-in-progress personal project. Contributions, suggestions, and bug reports are welcome!

## License

This project is for educational and fan purposes. Pokemon is © Nintendo/Game Freak. Pokemon Infinite Fusion is a fan-made game.
