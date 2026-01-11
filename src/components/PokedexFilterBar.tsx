/**
 * Pokedex Filter Bar Component
 * 
 * Comprehensive filtering and sorting interface for the Pokedex and Box views.
 * Provides a two-stage filtering system:
 * 
 * Stage 1 - Search & Filter:
 * - Name/InternalName search
 * - Dual type filtering (primary and secondary types)
 * - Ability search with autocomplete
 * - Move search with autocomplete
 * 
 * Stage 2 - Sort & Exclude:
 * - Sort by any base stat (HP, ATK, DEF, SPA, SPD, SPE, BST) or Dex #
 * - Ascending/descending sort order
 * - Exclude legendary Pokemon
 * - Exclude sub-legendary Pokemon
 * 
 * The filter state is managed by the parent component and shared between
 * multiple pages (Pokedex and BoxTeam).
 * 
 * @module components/PokedexFilterBar
 */

import { useMemo } from "react";
import speciesRaw from "../data/species.json";
import abilitiesRaw from "../data/abilities.json";
import movesRaw from "../data/moves.json";

import type { Species } from "../lib/types/species";
import type { Ability } from "../lib/types/ability";
import type { Move } from "../lib/types/moves";
import type { PokedexFiltersState, SortBy, SortDir } from "../lib/types/pokedexFilters";

type PokedexFilterBarProps = PokedexFiltersState & {
  /** Current page, used to determine which filter target buttons should be visible */
  currentPage?: "pokedex" | "boxTeam";
};

const speciesList = speciesRaw as Species[];
const abilitiesList = abilitiesRaw as Ability[];
const movesList = movesRaw as Move[];

/**
 * Filter bar component providing comprehensive Pokemon filtering
 * 
 * Features:
 * - Text search for Pokemon names (display or internal name)
 * - Type filtering with support for dual-type combinations
 * - Ability and move search with HTML5 datalist autocomplete
 * - Multi-criteria sorting (stats, BST, Dex number)
 * - Rarity tier exclusion filters
 * - Filter target toggle (Pokedex vs Box)
 * 
 * All filter state is managed by parent via props, making this a controlled component.
 */
export default function PokedexFilterBar(props: PokedexFilterBarProps) {
  // Extract all unique types from the species data
  // Sorted alphabetically with "ANY" as first option for Type A
  const allTypes = useMemo(() => {
    const set = new Set<string>();
    for (const s of speciesList) {
      set.add(s.Type1);
      if (s.Type2) set.add(s.Type2);
    }
    return ["ANY", ...Array.from(set).sort()];
  }, []);

  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
      {/* Stage 1 Filters: Basic search and type/ability/move filtering */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={props.nameQuery}
          onChange={(e) => props.setNameQuery(e.target.value)}
          placeholder="Name / InternalName…"
          style={{ padding: 10, minWidth: 220 }}
        />

        <select
          value={props.typeA}
          onChange={(e) => props.setTypeA(e.target.value)}
          style={{ padding: 10 }}
        >
          {allTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={props.typeB}
          onChange={(e) => props.setTypeB(e.target.value)}
          style={{ padding: 10 }}
          disabled={props.typeA === "ANY"}
          title={props.typeA === "ANY" ? "Select Type A first" : ""}
        >
          <option value="NONE">NONE</option>
          {allTypes.filter((t) => t !== "ANY").map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          value={props.abilityText}
          onChange={(e) => props.setAbilityText(e.target.value)}
          list="abilities-datalist"
          placeholder="Ability…"
          style={{ padding: 10, minWidth: 180 }}
        />

        <input
          value={props.moveText}
          onChange={(e) => props.setMoveText(e.target.value)}
          list="moves-datalist"
          placeholder="Move…"
          style={{ padding: 10, minWidth: 180 }}
        />

        <datalist id="abilities-datalist">
          {abilitiesList.map((a) => <option key={a.ID} value={a.Name} />)}
        </datalist>

        <datalist id="moves-datalist">
          {movesList.map((m) => <option key={m.ID} value={m.Name} />)}
        </datalist>

        <span style={{ opacity: 0.75 }}>Apply to:</span>
        <button
          type="button"
          onClick={() => props.setFilterTarget("pokedex")}
          aria-pressed={props.filterTarget === "pokedex"}
        >
          Pokedex
        </button>
        <button
          type="button"
          onClick={() => props.setFilterTarget("box")}
          aria-pressed={props.filterTarget === "box"}
        >
          Box
        </button>
      </div>


      {/* Stage 2 Filters: Sorting and advanced filtering options */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
        <select
          value={props.sortBy}
          onChange={(e) => props.setSortBy(e.target.value as SortBy)}
          style={{ padding: 10 }}
        >
          <option value="DEX">Dex #</option>
          <option value="HP">HP</option>
          <option value="ATK">ATK</option>
          <option value="DEF">DEF</option>
          <option value="SPA">SPA</option>
          <option value="SPD">SPD</option>
          <option value="SPE">SPE</option>
          <option value="BST">BST</option>
        </select>

        <select
          value={props.sortDir}
          onChange={(e) => props.setSortDir(e.target.value as SortDir)}
          style={{ padding: 10 }}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <label style={{ display: "flex", gap: 8, alignItems: "center", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={props.excludeLegendary}
            onChange={(e) => props.setExcludeLegendary(e.target.checked)}
          />
          Exclude legendary
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={props.excludeSubLegendary}
            onChange={(e) => props.setExcludeSubLegendary(e.target.checked)}
          />
          Exclude sub-legendary
        </label>
      </div>
    </div>
  );
}
