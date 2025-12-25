import { useState } from "react";
import Pokedex from "./pages/Pokedex";
import FusionCalculator from "./pages/FusionCalculator";
import PokedexFilterBar from "./components/PokedexFilterBar";
import movePoolsRaw from "./data/move_pools_if.json";


import type { SortBy, SortDir } from "./types/pokedexFilters";

type Page = "pokedex" | "fusion";

export default function App() {
  const [page, setPage] = useState<Page>("pokedex");

  // Pokedex filter state lives here now
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
      </header>

      {page === "pokedex" && (
        <PokedexFilterBar
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
        {page === "pokedex" ? (
          <Pokedex
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
        ) : (
          <FusionCalculator />
        )}
      </div>
    </div>
  );
}
