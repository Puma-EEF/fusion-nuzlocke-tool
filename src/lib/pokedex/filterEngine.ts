/**
 * Pokedex Filter Engine
 * 
 * Multi-criteria filtering system for Pokemon with efficient lookups and sorting.
 * Supports name search, type combinations, ability/move filtering, and rarity exclusions.
 * 
 * @module lib/pokedex/filterEngine
 * 
 * ## Filter Pipeline
 * The engine applies filters in sequence:
 * 1. Name matching (display name or internal name)
 * 2. Type filtering (single or dual-type combinations)
 * 3. Ability filtering (checks all ability slots including hidden)
 * 4. Move filtering (checks complete learnset)
 * 5. Rarity exclusions (legendary/sub-legendary)
 * 6. Sorting by selected stat or Dex number
 * 
 * ## Performance Optimizations
 * - Pre-built lookup maps for O(1) move/ability resolution
 * - Move index for fast "Pokemon that learn X" queries
 * - Normalized strings for case-insensitive matching
 * - Partial matching with early exit
 * 
 * ## Usage
 * ```typescript
 * const engine = createPokedexFilterEngine({
 *   moves: allMoves,
 *   abilities: allAbilities,
 *   learnsets: allLearnsets
 * });
 * 
 * const filtered = engine.apply(allSpecies, {
 *   nameQuery: "char",
 *   typeA: "FIRE",
 *   typeB: "FLYING",
 *   sortBy: "BST",
 *   sortDir: "desc"
 *   // ... other filters
 * });
 * ```
 */

import type { Species } from "../types/species";
import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";
import type { Learnset } from "../types/learnset";
import type { SortBy, SortDir } from "../types/pokedexFilters";

import { buildLearnsetMoveIndex } from "../learnsetIndex";
import { isLegendary, isSubLegendary } from "../legendary";

/**
 * Filter configuration values from user input
 */
export type PokedexFilterValues = {
  nameQuery: string;
  typeA: string; // "ANY" or a specific type
  typeB: string; // "NONE" or a specific type

  abilityText: string; // User-entered ability search
  moveText: string; // User-entered move search

  sortBy: SortBy;
  sortDir: SortDir;

  excludeLegendary: boolean;
  excludeSubLegendary: boolean;
};

/**
 * Normalize string for case-insensitive comparison
 */
function normalize(s: string) {
  return s.trim().toLowerCase();
}

/**
 * Calculate Base Stat Total for sorting
 */
function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

/**
 * Get numeric value for sorting based on sort key
 */
function getSortValue(s: Species, sortBy: SortBy) {
  switch (sortBy) {
    case "DEX":
      return s.ID;
    case "HP":
      return s.BaseHP;
    case "ATK":
      return s.BaseATK;
    case "DEF":
      return s.BaseDEF;
    case "SPA":
      return s.BaseSPA;
    case "SPD":
      return s.BaseSPD;
    case "SPE":
      return s.BaseSPE;
    case "BST":
      return getBST(s);
  }
}

/**
 * Dependencies required to build the filter engine
 */
type EngineDeps = {
  moves: Move[];
  abilities: Ability[];
  learnsets: Learnset[];
};

/**
 * Filter engine interface
 */
export type PokedexFilterEngine = {
  apply: (
    species: Species[],
    filters: PokedexFilterValues,
    opts?: { applyFilters?: boolean }
  ) => Species[];
};

/**
 * Create a Pokedex filter engine with pre-built lookup indices
 * 
 * Builds efficient data structures for filtering:
 * - Move name → internal name maps (exact and partial)
 * - Ability name → internal name maps (exact and partial)
 * - Pokemon → learnable moves index
 * 
 * @param deps - Move, ability, and learnset data
 * @returns Filter engine with apply() method
 */
export function createPokedexFilterEngine(deps: EngineDeps): PokedexFilterEngine {
  const moveByExactName = new Map<string, string>();
  const moveByExactInternal = new Map<string, string>();
  const movePartial: Array<{ nameLower: string; internal: string }> = [];

  for (const m of deps.moves) {
    const nameLower = normalize(m.Name);
    const internalLower = normalize(m.InternalName);
    moveByExactName.set(nameLower, m.InternalName);
    moveByExactInternal.set(internalLower, m.InternalName);
    movePartial.push({ nameLower, internal: m.InternalName });
  }

  const abilityByExactName = new Map<string, string>();
  const abilityByExactInternal = new Map<string, string>();
  const abilityPartial: Array<{ nameLower: string; internal: string }> = [];

  for (const a of deps.abilities) {
    const nameLower = normalize(a.Name);
    const internalLower = normalize(a.InternalName);
    abilityByExactName.set(nameLower, a.InternalName);
    abilityByExactInternal.set(internalLower, a.InternalName);
    abilityPartial.push({ nameLower, internal: a.InternalName });
  }

  const learnsetIndex = buildLearnsetMoveIndex(deps.learnsets);

  /**
   * Resolve user input to move internal name
   * Priority: exact name > exact internal > partial name match
   */
  function resolveMoveInternal(input: string): string | null {
    const q = normalize(input);
    if (!q) return null;

    const exact =
      moveByExactName.get(q) ?? moveByExactInternal.get(q);
    if (exact) return exact;

    const partial = movePartial.find((m) => m.nameLower.includes(q));
    return partial ? partial.internal : null;
  }

  /**
   * Resolve user input to ability internal name
   * Priority: exact name > exact internal > partial name match
   */
  function resolveAbilityInternal(input: string): string | null {
    const q = normalize(input);
    if (!q) return null;

    const exact =
      abilityByExactName.get(q) ?? abilityByExactInternal.get(q);
    if (exact) return exact;

    const partial = abilityPartial.find((a) => a.nameLower.includes(q));
    return partial ? partial.internal : null;
  }

  /**
   * Apply all filters to species array
   * 
   * @param species - Array of all Pokemon species
   * @param filters - Filter configuration from user input
   * @param opts - Options including applyFilters toggle
   * @returns Filtered and sorted species array
   */
  function apply(
    species: Species[],
    filters: PokedexFilterValues,
    opts?: { applyFilters?: boolean }
  ): Species[] {
    const shouldApply = opts?.applyFilters ?? true;

    // If filters disabled, return sorted by Dex number only
    if (!shouldApply) {
      return species
        .slice()
        .sort(
          (a, b) => (a.ID - b.ID) || ((a.Form ?? 0) - (b.Form ?? 0))
        );
    }

    const q = normalize(filters.nameQuery);
    const selectedAbilityInternal = resolveAbilityInternal(filters.abilityText);
    const selectedMoveInternal = resolveMoveInternal(filters.moveText);

    return species
      // Filter by name (display or internal)
      .filter((s) => {
        if (!q) return true;
        return (
          s.Name.toLowerCase().includes(q) ||
          s.InternalName.toLowerCase().includes(q)
        );
      })
      // Filter by type combination (single or dual-type)
      .filter((s) => {
        const typeA = filters.typeA;
        const typeB = filters.typeB;

        if (typeA === "ANY") return true;

        const hasA = s.Type1 === typeA || s.Type2 === typeA;
        if (typeB === "NONE" || !typeB) return hasA;

        if (!s.Type2) return false;
        const t1 = s.Type1;
        const t2 = s.Type2;
        return (t1 === typeA && t2 === typeB) || (t1 === typeB && t2 === typeA);
      })
      // Filter by ability (checks all ability slots including hidden)
      .filter((s) => {
        if (!selectedAbilityInternal) return true;
        return (
          s.Ability1 === selectedAbilityInternal ||
          s.Ability2 === selectedAbilityInternal ||
          s.HiddenAbility1 === selectedAbilityInternal ||
          s.HiddenAbility2 === selectedAbilityInternal
        );
      })
      // Filter by move (checks complete learnset)
      .filter((s) => {
        if (!selectedMoveInternal) return true;
        const moves = learnsetIndex.get(s.InternalName);
        if (!moves) return false;
        return moves.has(selectedMoveInternal);
      })
      // Exclude legendary/sub-legendary Pokemon if requested
      .filter((s) => {
        if (filters.excludeLegendary && isLegendary(s)) return false;
        if (filters.excludeSubLegendary && isSubLegendary(s)) return false;
        return true;
      })
      // Sort by selected stat/criteria and direction
      .sort((a, b) => {
        const av = getSortValue(a, filters.sortBy);
        const bv = getSortValue(b, filters.sortBy);
        if (av !== bv) return filters.sortDir === "asc" ? av - bv : bv - av;
        if (a.ID !== b.ID) return a.ID - b.ID;
        return (a.Form ?? 0) - (b.Form ?? 0);
      });
  }

  return { apply };
}
