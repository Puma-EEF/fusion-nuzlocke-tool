/**
 * App Component
 * 
 * Root component that manages application-wide state and navigation.
 * Handles routing between pages and coordinates shared filter state.
 * 
 * @module App
 * 
 * ## Features
 * - Multi-page navigation (Pokedex, Fusion Calculator, Box & Team Management)
 * - Centralized filter state management shared across Pokedex and Box pages
 * - Persistent box storage with automatic saves via localStorage
 * - Type-safe state management with TypeScript
 * 
 * ## State Management
 * - **Page State**: Controls which page is currently visible
 * - **Filter State**: Unified filtering for both Pokedex and Box views
 *   - Name search, type filters, ability/move search
 *   - Sort configuration (stat, direction)
 *   - Rarity exclusions (legendary, sub-legendary)
 * - **Box State**: Manages captured Pokemon with automatic persistence
 * 
 * ## Architecture
 * The component follows a "lift state up" pattern where:
 * - Filter state is maintained at the App level
 * - Child components receive state and setters as props
 * - This enables filter state to persist when switching between pages
 * - Box data is automatically saved to localStorage on every change
 */

import { useEffect, useState } from "react";
import Pokedex from "./pages/Pokedex";
import FusionCalculator from "./pages/FusionCalculator";
import PokedexFilterBar from "./components/PokedexFilterBar";
import BoxTeamPage from "./pages/BoxTeamPage";
import type { BoxMon } from "./lib/types/box";
import { loadBox, saveBox } from "./lib/boxStorage";
import DebugMoves from "./pages/DebugMoves";

import type { SortBy, SortDir } from "./lib/types/pokedexFilters";

/**
 * Page identifier type for navigation
 * @typedef {"pokedex" | "fusion" | "boxTeam" | "debugMoves"} Page
 */
type Page = "pokedex" | "fusion" | "boxTeam" | "debugMoves";

/**
 * Filter target type - determines which dataset the filters apply to
 * @typedef {"pokedex" | "box"} FilterTarget
 */
type FilterTarget = "pokedex" | "box";

export default function App() {
  // === Navigation State ===
  const [page, setPage] = useState<Page>("pokedex");
  const [filterTarget, setFilterTarget] = useState<FilterTarget>("pokedex");
  
  // === Box/Team Management ===
  // Initialize box from localStorage, automatically save on changes
  const [box, setBox] = useState<BoxMon[]>(() => loadBox());

  useEffect(() => {
    saveBox(box);
  }, [box]);

  // === Filter State ===
  // Shared filter state used by both Pokedex and Box views
  const [nameQuery, setNameQuery] = useState("");
  const [typeA, setTypeA] = useState<string>("ANY");
  const [typeB, setTypeB] = useState<string>("NONE");
  const [abilityText, setAbilityText] = useState("");
  const [moveText, setMoveText] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("DEX");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [excludeLegendary, setExcludeLegendary] = useState(false);
  const [excludeSubLegendary, setExcludeSubLegendary] = useState(false);

  // === Filter State Bundle ===
  // Combine all filter values and setters into a single object for easy prop passing
  const filterState = {
    nameQuery,
    setNameQuery,

    filterTarget,
    setFilterTarget,

    typeA,
    setTypeA,
    typeB,
    setTypeB,

    abilityText,
    setAbilityText,
    moveText,
    setMoveText,

    sortBy,
    setSortBy,
    sortDir,
    setSortDir,

    excludeLegendary,
    setExcludeLegendary,
    excludeSubLegendary,
    setExcludeSubLegendary,
  };

  // === Props for Child Components ===
  // Pre-configured prop objects for each page component
  const pokedexFilterBarProps = {
    currentPage: page,
    ...filterState,
  };

  const pokedexPageProps = {
    ...filterState,
    applyFilters: filterTarget === "pokedex",
  };

  const boxTeamPageProps = {
    ...filterState,
    box,
    setBox,
    applyFilters: filterTarget === "box",
  };

  // === Render ===
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation Header */}
      <header
        style={{
          padding: 10,
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 8,
        }}
      >
        <button onClick={() => setPage("pokedex")} style={{ padding: "8px 12px" }}>
          Pokédex
        </button>
        <button onClick={() => setPage("fusion")} style={{ padding: "8px 12px" }}>
          Fusion Calculator
        </button>
        <button onClick={() => setPage("boxTeam")} style={{ padding: "8px 12px" }}>
          Box Team
        </button>
        <button onClick={() => setPage("debugMoves")} style={{ padding: "8px 12px" }}>
          Debug Moves
        </button>
      </header>

      {/* Filter Bar - shown on Pokedex and Box/Team pages */}
      {(page === "pokedex" || page === "boxTeam") && (
        <PokedexFilterBar {...pokedexFilterBarProps} />
      )}

      {/* Main Content Area - conditionally render current page */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {page === "pokedex" && <Pokedex {...pokedexPageProps} />}
        {page === "fusion" && <FusionCalculator />}
        {page === "boxTeam" && <BoxTeamPage {...boxTeamPageProps} />}
        {page === "debugMoves" && <DebugMoves />}
      </div>
    </div>
  );
}
