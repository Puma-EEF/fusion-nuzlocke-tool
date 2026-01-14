/**
 * Main App Component - Manages navigation and shared filter state
 * Pages: Pokedex, Fusion Calculator, Box & Team
 */

import { useEffect, useState } from "react";
import Pokedex from "./pages/Pokedex";
import FusionCalculator from "./pages/FusionCalculator";
import PokedexFilterBar from "./components/PokedexFilterBar";
import BoxTeamPage from "./pages/BoxTeamPage";
import type { BoxMon } from "./lib/types/box";
import { loadBox, saveBox } from "./lib/boxStorage";


import type { SortBy, SortDir } from "./lib/types/pokedexFilters";

type Page = "pokedex" | "fusion" | "boxTeam";
type FilterTarget = "pokedex" | "box";

export default function App() {
  const [page, setPage] = useState<Page>("pokedex");
  const [filterTarget, setFilterTarget] = useState<FilterTarget>("pokedex");
  const [box, setBox] = useState<BoxMon[]>(() => loadBox());

  function clampIV(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(31, n));
  }

  useEffect(() => {
    saveBox(box);
  }, [box]);

  const [nameQuery, setNameQuery] = useState("");
  const [typeA, setTypeA] = useState<string>("ANY");
  const [typeB, setTypeB] = useState<string>("NONE");
  const [abilityText, setAbilityText] = useState("");
  const [moveText, setMoveText] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("DEX");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [excludeLegendary, setExcludeLegendary] = useState(false);
  const [excludeSubLegendary, setExcludeSubLegendary] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
