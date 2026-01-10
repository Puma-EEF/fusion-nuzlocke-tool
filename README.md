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

### Box & Team Management *(In Progress)*
- Track caught Pokemon during your Nuzlocke run
- Apply filters to your box
- Manage your active party

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **ESLint** for code quality
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

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── EvolutionLine.tsx
│   ├── PokedexFilterBar.tsx
│   ├── PokemonSprite.tsx
│   └── SpriteTile.tsx
├── data/            # JSON data files
│   ├── species.json
│   ├── moves.json
│   ├── abilities.json
│   └── learnsets.json
├── lib/             # Utility functions and type definitions
│   ├── fusion.ts
│   ├── evolutionMap.ts
│   └── types/
├── pages/           # Main page components
│   ├── Pokedex.tsx
│   ├── FusionCalculator.tsx
│   └── BoxTeam.tsx (WIP)
└── App.tsx          # Main app with navigation
```

## Data Sources

This app uses JSON data files for Pokemon information compatible with Pokemon Infinite Fusion. Data includes:
- Species data (stats, types, abilities)
- Move data (power, accuracy, effects)
- Ability data (names, descriptions)
- Learnset data (level-up, TM, tutor moves)

## Contributing

This is a work-in-progress personal project. Contributions, suggestions, and bug reports are welcome!

## License

This project is for educational and fan purposes. Pokemon is © Nintendo/Game Freak. Pokemon Infinite Fusion is a fan-made game
