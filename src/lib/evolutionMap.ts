/**
 * Evolution Map Module
 * 
 * Provides utilities for working with Pokemon evolution chains.
 * Loads evolution data from Pokemon Infinite Fusion and provides
 * functions to query forward evolutions and build reverse indices.
 * 
 * Evolution data includes:
 * - Evolution targets (what a Pokemon evolves into)
 * - Evolution methods (level, stone, trade, special conditions)
 * - Multiple evolution paths (e.g., Eevee -> multiple evolutions)
 * 
 * @module evolutionMap
 */

import evolutionsRaw from "../data/evolutions_if.json";

/**
 * Represents a single evolution possibility for a Pokemon
 * 
 * A Pokemon can have multiple evolution edges (e.g., Eevee has 8)
 * Each edge represents one possible evolution path with its condition
 */
export type EvoEdge = {
  /** InternalName of the Pokemon this evolves into (e.g., "CHARIZARD") */
  to: string;
  /** Human-readable evolution condition text
   * Examples:
   * - "Level 16" - evolves at specific level
   * - "Use Fire Stone" - requires evolutionary stone
   * - "Trade" - requires trading with another player
   * - "Level 20, Dark" - level requirement with type condition
   */
  text: string;
};

/**
 * Maps Pokemon InternalName to their possible evolutions
 * 
 * Structure: { "POKEMON_NAME": [{ to: "EVOLVED_FORM", text: "condition" }, ...] }
 * 
 * Key: Pokemon InternalName (e.g., "BULBASAUR", "PIKACHU")
 * Value: Array of evolution possibilities (can be empty if Pokemon doesn't evolve)
 * 
 * @example
 * {
 *   "CHARMANDER": [{ to: "CHARMELEON", text: "Level 16" }],
 *   "CHARMELEON": [{ to: "CHARIZARD", text: "Level 36" }],
 *   "EEVEE": [
 *     { to: "VAPOREON", text: "Use Water Stone" },
 *     { to: "JOLTEON", text: "Use Thunder Stone" },
 *     { to: "FLAREON", text: "Use Fire Stone" },
 *     ...
 *   ]
 * }
 */
export type EvoMap = Record<string, EvoEdge[]>;

/** Loaded evolution data from JSON file */
const evoMap = evolutionsRaw as EvoMap;

/**
 * Get all forward evolutions (what this Pokemon can evolve into)
 * 
 * Returns all possible evolution targets for a given Pokemon.
 * For Pokemon with multiple evolution paths (like Eevee), returns all options.
 * For fully evolved Pokemon, returns empty array.
 * 
 * @param internalName - The InternalName of the Pokemon (e.g., "BULBASAUR")
 * @returns Array of evolution possibilities, empty array if Pokemon doesn't evolve
 * 
 * @example
 * getForwardEvos("EEVEE")
 * // Returns: [
 * //   { to: "VAPOREON", text: "Use Water Stone" },
 * //   { to: "JOLTEON", text: "Use Thunder Stone" },
 * //   ...
 * // ]
 * 
 * getForwardEvos("CHARIZARD") // Returns: []
 */
export function getForwardEvos(internalName: string): EvoEdge[] {
  return evoMap[internalName] ?? [];
}

/**
 * Build a reverse evolution index (what each Pokemon evolved from)
 * 
 * Creates an inverted map showing pre-evolutions for each Pokemon.
 * Useful for displaying complete evolution chains or finding base forms.
 * 
 * @returns Map where:
 *   - Key: Evolved Pokemon InternalName
 *   - Value: Array of pre-evolution sources with their evolution methods
 * 
 * @example
 * const reverseIndex = buildReverseIndex();
 * reverseIndex.get("CHARIZARD")
 * // Returns: [{ from: "CHARMELEON", text: "Level 36" }]
 * 
 * reverseIndex.get("VAPOREON")
 * // Returns: [{ from: "EEVEE", text: "Use Water Stone" }]
 * 
 * @note For Pokemon with multiple pre-evolutions (rare but possible),
 * returns all possible pre-evolution paths
 */
export function buildReverseIndex(): Map<string, { from: string; text: string }[]> {
  const rev = new Map<string, { from: string; text: string }[]>();
  
  // Iterate through all Pokemon and their evolution edges
  for (const [from, edges] of Object.entries(evoMap)) {
    for (const e of edges) {
      // For each evolution target, record where it came from
      const arr = rev.get(e.to) ?? [];
      arr.push({ from, text: e.text });
      rev.set(e.to, arr);
    }
  }
  
  return rev;
}
