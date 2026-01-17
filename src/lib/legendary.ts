/**
 * Legendary Pokemon Classification System
 * 
 * Provides utilities for identifying and filtering legendary and sub-legendary Pokemon.
 * Used by the Pokedex and Box filters to exclude high-rarity Pokemon.
 * 
 * @module lib/legendary
 * 
 * ## Classifications
 * 
 * **Legendary Pokemon:**
 * - Unique, powerful Pokemon typically one-per-game
 * - Examples: Mewtwo, Lugia, Rayquaza, Dialga, Zekrom
 * 
 * **Sub-Legendary Pokemon:**
 * - Powerful Pokemon often found in trios or duos
 * - Examples: Articuno, Raikou, Latios, Uxie, Terrakion
 * 
 * ## Usage
 * These sets can be populated with InternalName strings to enable filtering.
 * Currently empty by default - populate based on your game's definitions.
 * 
 * @example
 * // Populate the sets
 * LEGENDARY.add("MEWTWO");
 * LEGENDARY.add("LUGIA");
 * SUB_LEGENDARY.add("ARTICUNO");
 * 
 * // Check a Pokemon
 * const mewtwo = getSpecies("MEWTWO");
 * if (isLegendary(mewtwo)) {
 *   console.log("This is a legendary Pokemon!");
 * }
 */

import type { Species } from "./types/species";

/**
 * Set of legendary Pokemon internal names
 * Populate this set to enable legendary filtering in the Pokedex
 */
export const LEGENDARY = new Set<string>([]);

/**
 * Set of sub-legendary Pokemon internal names
 * Populate this set to enable sub-legendary filtering in the Pokedex
 */
export const SUB_LEGENDARY = new Set<string>([]);

/**
 * Check if a Pokemon is classified as legendary
 * @param s - Species to check
 * @returns true if Pokemon is legendary, false otherwise
 */
export function isLegendary(s: Species) {
  return LEGENDARY.has(s.InternalName);
}

/**
 * Check if a Pokemon is classified as sub-legendary
 * @param s - Species to check
 * @returns true if Pokemon is sub-legendary, false otherwise
 */
export function isSubLegendary(s: Species) {
  return SUB_LEGENDARY.has(s.InternalName);
}
