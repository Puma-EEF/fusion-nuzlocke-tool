import type { SortBy, SortDir } from "../types/pokedexFilters";

export type FilterInputs = {
  nameQuery: string;
  typeA: string; // "ANY" or a type
  typeB: string; // "NONE" or a type
  abilityText: string;
  moveText: string;
  excludeLegendary: boolean;
  excludeSubLegendary: boolean;
  sortBy: SortBy;
  sortDir: SortDir; // "asc" | "desc"
};

export type FilterDeps = {
  // learnsetIndex: speciesInternal -> set of moveInternals
  learnsetIndex: Map<string, Set<string>>;
};
