export type SortBy = "DEX" | "HP" | "ATK" | "DEF" | "SPA" | "SPD" | "SPE" | "BST";
export type SortDir = "asc" | "desc";

export type PokedexFiltersState = {
  // Stage 1
  nameQuery: string;
  setNameQuery: (v: string) => void;

  filterTarget: "pokedex" | "box";
  setFilterTarget: (t: "pokedex" | "box") => void;

  typeA: string;
  setTypeA: (v: string) => void;

  typeB: string;
  setTypeB: (v: string) => void;

  abilityText: string;
  setAbilityText: (v: string) => void;

  moveText: string;
  setMoveText: (v: string) => void;

  // Stage 2
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;

  sortDir: SortDir;
  setSortDir: (v: SortDir) => void;

  excludeLegendary: boolean;
  setExcludeLegendary: (v: boolean) => void;

  excludeSubLegendary: boolean;
  setExcludeSubLegendary: (v: boolean) => void;
};
