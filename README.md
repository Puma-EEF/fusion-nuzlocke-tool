# Pokemon Fusion Nuzlocke Tool

A comprehensive web application designed for Pokemon Infinite Fusion players. Browse Pokemon data with advanced filtering, calculate fusion stat combinations, and manage your Nuzlocke box and team efficiently.

## Features

### 📖 Pokédex Browser
A powerful Pokemon database browser with extensive filtering and search capabilities.

**Filtering & Search:**
- **Name Search**: Find Pokemon by display name or internal name
- **Type Filtering**: Filter by primary and/or secondary type combinations
- **Ability Search**: Search for Pokemon that have specific abilities (with autocomplete)
- **Move Search**: Find Pokemon that can learn specific moves (with autocomplete)
- **Rarity Exclusion**: Option to exclude legendary and sub-legendary Pokemon

**Sorting Options:**
- Sort by Dex #, HP, ATK, DEF, SPA, SPD, SPE, or BST (Base Stat Total)
- Toggle between ascending and descending order

**Detailed Pokemon View:**
- Complete base stats with BST calculation
- All learnable moves organized by method:
  - Level-up moves (with required levels)
  - TM/HM moves
  - Tutor moves
  - Egg moves
- All abilities (including hidden abilities)
- Complete evolution chains with conditions
- Type effectiveness and characteristics
- Pokedex entries and flavor text

### ⚗️ Fusion Calculator
Calculate and compare Pokemon fusion combinations with detailed stat breakdowns.

**Features:**
- Select any two Pokemon by name or internal name
- View **both** possible fusion results:
  - Pokemon A (head) + Pokemon B (body)
  - Pokemon B (head) + Pokemon A (body)
- Detailed fusion information:
  - Resulting types (inherits type1 from head, type2 from body)
  - Complete base stat breakdown showing fusion formulas:
    - **Physical stats** (ATK, DEF, SPE): Favor body Pokemon (2/3 body + 1/3 head)
    - **Special stats** (HP, SPA, SPD): Favor head Pokemon (2/3 head + 1/3 body)
  - Base Stat Total (BST)
  - Combined abilities from both parents
- Visual sprite display for each fusion combination

### 📦 Box & Team Management
Track your captured Pokemon and build your Nuzlocke team with full filter integration.

**Box Features:**
- Add base Pokemon or fusions to your box
- Track rarity tiers (Normal, Sub-Legendary, Legendary)
- Filter your box using the same powerful filters as the Pokedex
- Tab system to view All Pokemon, Base forms only, or Fusions only
- Persistent storage using browser localStorage

**Team Management:**
- Build and manage your active 6-Pokemon party
- Add Pokemon from your box to your team
- Remove or reorganize team members
- Visual team display with sprites

**Planned Features:**
- Nickname support for caught Pokemon
- Notes and tracking for each Pokemon
- Import/Export box data
- Stats tracking (wins, losses, etc.)

## Tech Stack

- **React 19** with TypeScript for modern, type-safe UI development
- **Vite 7** for lightning-fast development and optimized production builds
- **ESLint 9** with React-specific rules for code quality
- **CSS-in-JS** using inline styles for component-specific styling
- **localStorage API** for client-side data persistence
- Fully typed with comprehensive TypeScript definitions

## Project Architecture

### Data Layer
- **JSON Data Files**: Pre-processed Pokemon data from Pokemon Infinite Fusion
  - `species.json`: Pokemon stats, types, abilities
  - `moves.json`: Move data with power, accuracy, effects
  - `abilities.json`: Ability names and descriptions
  - `learnsets.json`: Learning methods for all moves
  - `evolutions_if.json`: Evolution chains and conditions

### Component Structure
- **Pages**: Top-level route components (Pokedex, FusionCalculator, BoxTeamPage)
- **Components**: Reusable UI elements (SpriteTile, EvolutionLine, FilterBar)
- **Lib**: Business logic, utilities, and type definitions
  - `fusion.ts`: Fusion calculation algorithms
  - `evolutionMap.ts`: Evolution data indexing
  - `learnsetIndex.ts`: Move learning index builder
  - `boxStorage.ts`: LocalStorage persistence layer
  - `types/`: TypeScript type definitions for all data structures

### Sprite System
- Sprite sheets located in `/public/spriteless/`
- Each head Pokemon has its own 960x4896px sprite sheet
- Grid layout: 10 columns × 51 rows (510 possible body combinations)
- CSS background-position used for efficient tile rendering

## Getting Started

### Prerequisites
- **Node.js** v18 or higher recommended
- **npm** or **yarn** package manager

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

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

### Build for Production

```bash
npm run build
```

The optimized production files will be output to the `dist/` directory, ready for deployment to any static hosting service.

## Project Structure

```
fusion-nuzlocke-tool/
├── public/                  # Static assets served directly
│   ├── spriteless/          # Pokemon fusion sprite sheets (960x4896px)
│   ├── icons/               # Type and UI icons
│   └── types/               # Type effectiveness icons
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EvolutionLine.tsx      # Evolution chain visualizer
│   │   ├── PokedexFilterBar.tsx   # Advanced filter controls
│   │   ├── PokemonSprite.tsx      # Individual Pokemon sprite display
│   │   └── SpriteTile.tsx         # Fusion sprite tile renderer
│   ├── data/                # JSON data files from Pokemon IF
│   │   ├── species.json           # Pokemon base stats, types, abilities
│   │   ├── moves.json             # Move data (power, accuracy, effects)
│   │   ├── abilities.json         # Ability names and descriptions
│   │   ├── learnsets.json         # Move learning methods per Pokemon
│   │   ├── evolutions_if.json     # Evolution chains and conditions
│   │   ├── machines_if.json       # TM/HM compatibility data
│   │   └── move_pools_if.json     # Additional move pool data
│   ├── lib/                 # Business logic and utilities
│   │   ├── fusion.ts              # Fusion stat calculation algorithms
│   │   ├── evolutionMap.ts        # Evolution chain indexing
│   │   ├── learnsetIndex.ts       # Move learning index builder
│   │   ├── boxStorage.ts          # LocalStorage persistence layer
│   │   ├── legendary.ts           # Legendary/Sub-legendary definitions
│   │   └── types/                 # TypeScript type definitions
│   │       ├── species.ts         # Species data types
│   │       ├── moves.ts           # Move data types
│   │       ├── ability.ts         # Ability data types
│   │       ├── learnset.ts        # Learnset data types
│   │       ├── box.ts             # Box/Team data types
│   │       └── pokedexFilters.ts  # Filter state types
│   ├── pages/               # Top-level page components
│   │   ├── Pokedex.tsx            # Pokemon browser with filters
│   │   ├── FusionCalculator.tsx   # Fusion stat calculator
│   │   └── BoxTeamPage.tsx        # Nuzlocke box/team manager
│   ├── utils/               # Utility functions
│   │   └── sprites.ts             # Sprite loading utilities
│   ├── App.tsx              # Main app with navigation
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Data Sources

This application uses data files extracted from **Pokemon Infinite Fusion**, a popular fan-made Pokemon game. The data includes:

- **Species Data**: Base stats, types, abilities, evolution requirements
- **Move Data**: Power, accuracy, type, damage category, effects, PP
- **Ability Data**: Names, descriptions, and battle effects
- **Learnset Data**: All moves each Pokemon can learn and how (level-up, TM, tutor, egg)
- **Evolution Data**: Evolution chains with specific conditions (level, item, trade, etc.)

All data is pre-processed into JSON format for efficient loading and filtering.

## Browser Compatibility

- Modern browsers with ES2020+ support
- localStorage API required for box/team persistence
- Tested on Chrome, Firefox, Edge, and Safari

## Future Enhancements

- **Advanced Team Building**: Synergy analysis, type coverage calculator
- **Nuzlocke Rule Variants**: Custom rule sets and enforcement
- **Battle Simulator**: Calculate damage and matchup predictions
- **Sprite Customization**: Custom sprite sheet support
- **Dark Mode**: Theme toggle for reduced eye strain
- **Mobile Optimization**: Responsive design improvements
- **Data Export/Import**: Share teams and boxes across devices

## Contributing

This is an open personal project. Contributions, suggestions, and bug reports are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for **educational and fan purposes only**. 

- **Pokemon** is © Nintendo / Game Freak / The Pokemon Company
- **Pokemon Infinite Fusion** is a fan-made game created by Schrroms and the Infinite Fusion community
- All Pokemon sprites, names, and data are property of their respective owners

This tool is not affiliated with or endorsed by Nintendo, Game Freak, or the official Pokemon franchise.
