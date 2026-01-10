/** Sorting criteria for Pokemon (DEX=Pokedex number, stats, or BST=Base Stat Total) */
export type SortBy = "DEX" | "HP" | "ATK" | "DEF" | "SPA" | "SPD" | "SPE" | "BST";

/** Sort direction: ascending or descending */
export type SortDir = "asc" | "desc";

/**
 * State management for Pokedex filtering and sorting functionality
 * Uses a two-stage filter system for comprehensive Pokemon searches
 */
export type PokedexFiltersState = {
  // === Stage 1: Basic Filters ===
  /** Text query to search Pokemon by name */
  nameQuery: string;
  setNameQuery: (v: string) => void;

  /** Target to apply filters to: full pokedex or user's box */
  filterTarget: "pokedex" | "box";
  setFilterTarget: (t: "pokedex" | "box") => void;

  /** Filter by primary or secondary type (first type selector) */
  typeA: string;
  setTypeA: (v: string) => void;

  /** Filter by primary or secondary type (second type selector) */
  typeB: string;
  setTypeB: (v: string) => void;

  /** Text query to search Pokemon by ability name */
  abilityText: string;
  setAbilityText: (v: string) => void;

  /** Text query to search Pokemon by move name */
  moveText: string;
  setMoveText: (v: string) => void;

  // === Stage 2: Sorting and Advanced Filters ===
  /** Which stat or attribute to sort results by */
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;

  /** Direction to sort results */
  sortDir: SortDir;
  setSortDir: (v: SortDir) => void;

  /** Whether to exclude legendary Pokemon from results */
  excludeLegendary: boolean;
  setExcludeLegendary: (v: boolean) => void;

  /** Whether to exclude sub-legendary Pokemon from results */
  excludeSubLegendary: boolean;
  setExcludeSubLegendary: (v: boolean) => void;
};
