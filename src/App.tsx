/**
 * Main Application Component
 * 
 * Root component managing global state and navigation between pages:
 * - Pokedex: Browse and filter all Pokemon with detailed information
 * - Fusion Calculator: Calculate fusion stat combinations between any two Pokemon
 * - Box & Team: Manage caught Pokemon box and active party for Nuzlocke runs
 * 
 * State Management:
 * - Navigation state (current page)
 * - Filter state (shared between Pokedex and Box pages)
 * - Box/Team state (persisted to localStorage)
 * 
 * The filter bar is shared across pages, allowing users to apply the same
 * filters to either the full Pokedex or their personal Box collection.
 * 
 * @module App
 */

import { useEffect, useState } from "react";
import Pokedex from "./pages/Pokedex";
import FusionCalculator from "./pages/FusionCalculator";
import PokedexFilterBar from "./components/PokedexFilterBar";
import BoxTeamPage from "./pages/BoxTeamPage";
import type { BoxMon } from "./lib/types/box";
import { loadBox, saveBox } from "./lib/boxStorage";


import type { SortBy, SortDir } from "./lib/types/pokedexFilters";

/** Available pages in the application */
type Page = "pokedex" | "fusion" | "boxTeam";

/**
 * Main App component
 * Manages global state for filters and navigation between pages:
 * - Pokedex: Browse and filter all Pokemon
 * - Fusion Calculator: Calculate fusion combinations
 * - Box Team: Manage caught Pokemon and party
 * 
 * Filter state is shared between Pokedex and Box Team pages
 */
export default function App() {
  // === Navigation State ===
  const [page, setPage] = useState<Page>("pokedex");
  
  // === Box Team State ===
  /** Determines which dataset filters are applied to: full Pokedex or user's Box */
  type FilterTarget = "pokedex" | "box";
  const [filterTarget, setFilterTarget] = useState<FilterTarget>("pokedex");
  
  /** User's box of caught Pokemon, loaded from localStorage on mount */
  const [box, setBox] = useState<BoxMon[]>(() => loadBox());

  /** Clamp IV value to valid range of 0-31 */
  function clampIV(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(31, n));
  }

  // Auto-save box to localStorage whenever it changes
  useEffect(() => {
  saveBox(box);
  }, [box]);


  // === Stage 1 Filter State (shared across Pokedex and Box pages) ===
  const [nameQuery, setNameQuery] = useState("");
  const [typeA, setTypeA] = useState<string>("ANY");
  const [typeB, setTypeB] = useState<string>("NONE");
  const [abilityText, setAbilityText] = useState("");
  const [moveText, setMoveText] = useState("");

  // === Stage 2 Filter State (sorting and exclusions) ===
  const [sortBy, setSortBy] = useState<SortBy>("DEX");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [excludeLegendary, setExcludeLegendary] = useState(false);
  const [excludeSubLegendary, setExcludeSubLegendary] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation Header */}
      <header style={{ padding: 10, borderBottom: "1px solid #ddd", display: "flex", gap: 8 }}>
        <button onClick={() => setPage("pokedex")} style={{ padding: "8px 12px" }}>
          Pokédex
        </button>
        <button onClick={() => setPage("fusion")} style={{ padding: "8px 12px" }}>
          Fusion Calculator
        </button>
        <button onClick={() => setPage("boxTeam")} style={{ padding: "8px 12px" }}>
          Box Team
        </button>
      </header>

      {/* Filter Bar (shown only on Pokedex and Box Team pages) */}
      {(page === "pokedex" || page === "boxTeam") && (
  <PokedexFilterBar
    currentPage={page}
    filterTarget={filterTarget}
    setFilterTarget={setFilterTarget}

    nameQuery={nameQuery}
    setNameQuery={setNameQuery}
    typeA={typeA}
    setTypeA={setTypeA}
    typeB={typeB}
    setTypeB={setTypeB}
    abilityText={abilityText}
    setAbilityText={setAbilityText}
    moveText={moveText}
    setMoveText={setMoveText}
    sortBy={sortBy}
    setSortBy={setSortBy}
    sortDir={sortDir}
    setSortDir={setSortDir}
    excludeLegendary={excludeLegendary}
    setExcludeLegendary={setExcludeLegendary}
    excludeSubLegendary={excludeSubLegendary}
    setExcludeSubLegendary={setExcludeSubLegendary}
  />
)}


      {/* Main Page Content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {page === "pokedex" && (
          <Pokedex
            filterTarget={filterTarget}
            setFilterTarget={setFilterTarget}
            nameQuery={nameQuery}
            setNameQuery={setNameQuery}
            typeA={typeA}
            setTypeA={setTypeA}
            typeB={typeB}
            setTypeB={setTypeB}
            abilityText={abilityText}
            setAbilityText={setAbilityText}
            moveText={moveText}
            setMoveText={setMoveText}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            excludeLegendary={excludeLegendary}
            setExcludeLegendary={setExcludeLegendary}
            excludeSubLegendary={excludeSubLegendary}
            setExcludeSubLegendary={setExcludeSubLegendary}
          />
        )}
        {page === "fusion" && <FusionCalculator />}
        {page === "boxTeam" && (
          <BoxTeamPage
            filterTarget={filterTarget}
            setFilterTarget={setFilterTarget}
            box={box}
            setBox={setBox}
            nameQuery={nameQuery}
            setNameQuery={setNameQuery}
            typeA={typeA}
            setTypeA={setTypeA}
            typeB={typeB}
            setTypeB={setTypeB}
            abilityText={abilityText}
            setAbilityText={setAbilityText}
            moveText={moveText}
            setMoveText={setMoveText}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            excludeLegendary={excludeLegendary}
            setExcludeLegendary={setExcludeLegendary}
            excludeSubLegendary={excludeSubLegendary}
            setExcludeSubLegendary={setExcludeSubLegendary}
          />
        )}


      </div>
    </div>
  );
}
