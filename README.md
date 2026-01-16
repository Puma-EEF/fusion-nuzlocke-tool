# Pokemon Fusion Nuzlocke Tool

A comprehensive web-based toolkit for Pokemon Infinite Fusion players. This application provides an advanced Pokedex browser with powerful filtering, a fusion stat calculator, and complete Nuzlocke team management capabilities—all with a clean, responsive interface and persistent local storage.

## ✨ Features

### 📖 Pokedex Browser
A powerful Pokemon database browser with extensive filtering and search capabilities.

**Search & Filtering:**
- **Name Search**: Find Pokemon by display name or internal name
- **Type Filtering**: Filter by primary and/or secondary type combinations
- **Ability Search**: Search for Pokemon with specific abilities (autocomplete enabled)
- **Move Search**: Find Pokemon that can learn specific moves (autocomplete enabled)
- **Rarity Filter**: Toggle to exclude legendary and sub-legendary Pokemon

**Sorting Options:**
- Sort by Dex #, HP, ATK, DEF, SPA, SPD, SPE, or BST (Base Stat Total)
- Toggle between ascending and descending order
- Instant updates as you adjust filters

**Detailed Pokemon Information:**
- Complete base stats with calculated BST
- All learnable moves organized by acquisition method:
  - Level-up moves (with required levels)
  - TM/HM compatibility
  - Tutor moves
  - Egg moves
- All abilities (including hidden abilities)
- Complete evolution chains with evolution conditions
- Type effectiveness and Pokemon characteristics
- Original Pokedex entries and flavor text

### ⚗️ Fusion Calculator
Calculate and compare Pokemon fusion combinations with detailed statistical breakdowns.

**Core Features:**
- Select any two Pokemon by name or internal identifier
- View **both** possible fusion results side-by-side:
  - Pokemon A (head) + Pokemon B (body)
  - Pokemon B (head) + Pokemon A (body)
  
**Fusion Details:**
- **Type Inheritance**: Type1 from head, Type2 from body
- **Complete Stat Breakdown** showing fusion algorithms:
  - **Physical Stats** (ATK, DEF, SPE): Favor body Pokemon (2/3 body + 1/3 head)
  - **Special Stats** (HP, SPA, SPD): Favor head Pokemon (2/3 head + 1/3 body)
- Calculated Base Stat Total (BST)
- Combined ability pool from both parent Pokemon
- Visual sprite previews for each fusion combination
- Complete learnset showing all moves the fusion can learn

### 📦 Box & Team Management
Track your captured Pokemon and build your Nuzlocke team with full filter integration.

**Box System:**
- Add base Pokemon or custom fusions to your storage box
- Track rarity tiers: Normal, Sub-Legendary, Legendary
- Configure Individual Values (IVs) for each Pokemon
- Set natures to calculate effective stats
- Filter your box using the same powerful filters as the Pokedex
- Tab system to view: All Pokemon, Base forms only, or Fusions only
- Automatic persistent storage via browser localStorage

**Team Building:**
- Build and manage your active 6-Pokemon party
- Add Pokemon from your box to your team
- Remove or reorganize team members
- Visual team display with sprites and key stats
- Real-time stat calculations based on IVs and natures

**Planned Features:**
- Nickname support for caught Pokemon
- Custom notes and tracking for each encounter
- Import/Export functionality for box data
- Win/loss statistics and battle history

## 🛠️ Tech Stack

**Frontend Framework:**
- **React 19** - Latest React with concurrent features and improved hooks
- **TypeScript 5.9** - Full type safety across the entire codebase
- **Vite 7** - Lightning-fast development server and optimized production builds

**Code Quality:**
- **ESLint 9** - Modern linting with React-specific rules and hooks validation
- **TypeScript ESLint** - Comprehensive TypeScript-specific linting

**Styling:**
- **Inline Styles** - Component-scoped styling for maximum flexibility
- **CSS-in-JS** patterns for dynamic styling based on state

**Data Management:**
- **localStorage API** - Client-side persistence for box and team data
- **JSON Data Files** - Pre-processed Pokemon data from Pokemon Infinite Fusion
- **TypeScript Definitions** - Fully typed data structures for all game data

**Development Tools:**
- Hot Module Replacement (HMR) for instant feedback
- TypeScript strict mode for maximum type safety
- React StrictMode for detecting potential problems

## 🏗️ Project Architecture

### Data Layer
The application uses pre-processed JSON data files extracted from Pokemon Infinite Fusion:

- **`species.json`** - Pokemon base stats, types, abilities, and growth rates
- **`moves.json`** - Complete move data including power, accuracy, type, and effects
- **`abilities.json`** - Ability names, descriptions, and battle effects
- **`learnsets.json`** - Move learning methods for each Pokemon (level-up, TM, HM, tutor, egg)
- **`evolutions_if.json`** - Evolution chains with specific conditions and triggers
- **`machines_if.json`** - TM and HM compatibility data
- **`move_pools_if.json`** - Additional move pool information

### Component Architecture

**Pages** (Top-level route components):
- **`Pokedex.tsx`** - Main Pokemon browser with filters and detailed views
- **`FusionCalculator.tsx`** - Side-by-side fusion comparison tool
- **`BoxTeamPage.tsx`** - Nuzlocke box and team management interface

**Components** (Reusable UI elements):
- **`SpriteTile.tsx`** - Efficient sprite rendering from sprite sheets
- **`EvolutionLine.tsx`** - Recursive evolution chain visualizer
- **`PokedexFilterBar.tsx`** - Advanced search and filter controls
- **`LearnsetViewer.tsx`** - Organized move display by learning method
- **`MoveRowHover.tsx`** - Interactive move display with tooltips

**Library** (Business logic and utilities):
- **`fusion.ts`** - Core fusion algorithms for stat calculation and type inheritance
- **`evolutionMap.ts`** - Evolution data indexing and reverse lookups
- **`learnsetIndex.ts`** - Efficient move learning index builder
- **`boxStorage.ts`** - localStorage wrapper with error handling
- **`effectiveStats.ts`** - Stat calculations with IVs and nature modifiers
- **`legendary.ts`** - Legendary and sub-legendary classification
- **`pokedex/`** - Pokedex-specific utilities:
  - **`filterEngine.ts`** - Multi-criteria filtering system
  - **`pokedexUtils.ts`** - Common Pokedex helper functions
  - **`lookups.ts`** - Fast lookup maps for Pokemon data

**Type Definitions** (`lib/types/`):
- Comprehensive TypeScript interfaces for all data structures
- Ensures type safety throughout the application
- Includes types for Species, Moves, Abilities, Learnsets, Box data, and Filters

### Sprite Rendering System
The application uses an efficient sprite sheet system for rendering Pokemon fusions:

- **Location**: `/public/spriteless/` directory
- **Format**: Each head Pokemon has a dedicated 960×4896px sprite sheet
- **Grid Layout**: 10 columns × 51 rows = 510 possible body combinations
- **Rendering**: CSS `background-position` for efficient tile extraction
- **Benefits**: 
  - Dramatically reduces HTTP requests (1 sheet vs 510 individual images)
  - Enables instant sprite switching without loading delays
  - Browser caching optimizes repeated views

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0 or higher (v20+ recommended for best performance)
- **npm** (comes with Node.js) or **yarn** package manager
- Modern web browser with ES2020+ support

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fusion-nuzlocke-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with hot module replacement |
| `npm run build` | Type-check with TypeScript and build optimized production bundle |
| `npm run preview` | Preview the production build locally before deployment |
| `npm run lint` | Run ESLint to check code quality and identify issues |

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service such as:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront
- Any web server capable of serving static files

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

## 📊 Data Sources

This application uses data extracted from **Pokemon Infinite Fusion**, a popular fan-made Pokemon game created by Schrroms and the Infinite Fusion community. The data has been pre-processed into JSON format for optimal performance and includes:

**Core Game Data:**
- **Species Information**: Base stats, types, abilities, growth rates, egg groups
- **Move Database**: Power, accuracy, type, damage category, effects, PP, and descriptions
- **Ability Database**: Names, internal identifiers, and detailed battle effect descriptions
- **Learnset Mappings**: Complete move pools for each Pokemon by learning method
- **Evolution Chains**: Evolution paths with specific trigger conditions (level, item, trade, friendship, etc.)

**Supplementary Data:**
- **TM/HM Compatibility**: Which Pokemon can learn which machine moves
- **Move Pools**: Additional movepool data for tutors and special learning methods
- **Type Effectiveness**: Type matchup calculations

All data files are validated and type-checked using TypeScript interfaces to ensure data integrity throughout the application.

## 🌐 Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+ (Chromium-based)
- Firefox 88+
- Safari 14+
- Opera 76+

**Requirements:**
- ES2020+ JavaScript support
- localStorage API (required for box/team persistence)
- CSS Grid and Flexbox support
- Modern CSS features (border-radius, CSS variables)

**Tested Configurations:**
- Windows 10/11: Chrome, Edge, Firefox
- macOS: Safari, Chrome, Firefox
- Linux: Chrome, Firefox

**Note**: Internet Explorer is not supported due to its lack of modern JavaScript and CSS features.

## 🎯 Future Enhancements

**Team Building & Analysis:**
- Type coverage calculator and weakness analysis
- Team synergy scoring based on abilities and move pools
- Stat distribution visualizations
- Recommended EV spreads for competitive builds

**Nuzlocke Features:**
- Custom rule set configuration and enforcement
- Death counter and graveyard tracking
- Route encounter tracking
- Challenge mode variants (Hardcore, Randomizer compatibility)

**Battle Tools:**
- Damage calculator with detailed breakdown
- Matchup predictions and type advantage calculator
- Speed tier comparisons
- Battle simulator for planning strategies

**Customization:**
- Dark mode / theme toggle
- Custom sprite sheet support
- Adjustable UI scaling
- Configurable keyboard shortcuts

**Data Management:**
- Cloud save sync across devices
- Box/team export to JSON or CSV
- Import teams from popular formats
- Share teams via URL or QR code

**Mobile Experience:**
- Progressive Web App (PWA) support
- Touch-optimized controls
- Responsive design improvements
- Offline functionality

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome! This is an open-source personal project, and community input helps make it better.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** with clear, descriptive commits:
   ```bash
   git commit -m 'Add: Implement damage calculator feature'
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** with a clear description of your changes

### Contribution Guidelines

- Follow the existing code style and TypeScript patterns
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if adding new features
- Keep commits focused and atomic

### Reporting Issues

When reporting bugs, please include:
- Browser and OS information
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License & Legal

This project is created for **educational and fan purposes only**.

### Disclaimer

- **Pokemon** is © Nintendo / Game Freak / The Pokemon Company
- **Pokemon Infinite Fusion** is a fan-made game created by Schrroms and the Infinite Fusion community
- All Pokemon sprites, names, and game data are property of their respective copyright holders

This tool is not affiliated with, endorsed by, or connected to:
- Nintendo Co., Ltd.
- Game Freak Inc.
- The Pokemon Company
- Creatures Inc.

### Fair Use Statement

This application is a non-commercial fan project created under fair use principles for the purpose of:
- Enhancing gameplay experience for existing Pokemon Infinite Fusion players
- Educational demonstration of web development techniques
- Community tool development for a fan-made game

No monetization or commercial use of this tool is intended or permitted.

---

**Made with ❤️ for the Pokemon Infinite Fusion community**
