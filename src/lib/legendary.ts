/**
 * Legendary Pokemon Classification
 * 
 * Defines which Pokemon are considered legendary or sub-legendary for
 * filtering purposes. Used in Pokedex and Box filters to allow users
 * to exclude these powerful Pokemon from their searches.
 * 
 * Classifications:
 * - Legendary: Unique, story-significant Pokemon (typically one per save)
 * - Sub-Legendary: Extremely powerful non-legendary Pokemon (600 BST)
 * 
 * @module legendary
 * @todo Populate LEGENDARY and SUB_LEGENDARY sets with actual Pokemon data
 */

import type { Species } from "./types/species";

/**
 * Set of legendary Pokemon InternalNames
 * 
 * Legendary Pokemon are typically:
 * - Unique (only one available per game)
 * - Story-important or mythical
 * - Very high base stat totals (580-720 BST)
 * - Cannot breed (except Manaphy)
 * 
 * @todo Populate with Pokemon Infinite Fusion legendary Pokemon
 * 
 * @example
 * Examples of legendary Pokemon:
 * - Gen 1: "MEWTWO", "MEW", "ARTICUNO", "ZAPDOS", "MOLTRES"
 * - Gen 2: "LUGIA", "HOOH", "CELEBI", "RAIKOU", "ENTEI", "SUICUNE"
 * - Gen 3: "KYOGRE", "GROUDON", "RAYQUAZA", "LATIAS", "LATIOS", "JIRACHI", "DEOXYS"
 * - Gen 4: "DIALGA", "PALKIA", "GIRATINA", "ARCEUS", "DARKRAI", "CRESSELIA"
 * - etc.
 */
export const LEGENDARY = new Set<string>([]);

/**
 * Set of sub-legendary Pokemon InternalNames
 * 
 * Sub-legendary Pokemon (also called pseudo-legendaries) are:
 * - Very powerful but not unique
 * - Typically have 600 base stat total
 * - Often final evolution of 3-stage evolutionary lines
 * - Can breed and are not story-locked
 * 
 * @todo Populate with Pokemon Infinite Fusion sub-legendary Pokemon
 * 
 * @example
 * Examples of sub-legendary Pokemon (600 BST):
 * - Gen 1: "DRAGONITE"
 * - Gen 2: "TYRANITAR"
 * - Gen 3: "SALAMENCE", "METAGROSS"
 * - Gen 4: "GARCHOMP"
 * - etc.
 * 
 * Note: Some games include other powerful Pokemon in this category:
 * - "ARCANINE" (often considered legendary in lore)
 * - Ultra Beasts (depending on classification system)
 */
export const SUB_LEGENDARY = new Set<string>([]);

/**
 * Check if a Pokemon is classified as legendary
 * 
 * Used for filtering in Pokedex and Box views. When "Exclude Legendary"
 * is enabled, these Pokemon will be hidden from results.
 * 
 * @param s - The Pokemon species to check
 * @returns true if the Pokemon is in the LEGENDARY set
 * 
 * @example
 * if (isLegendary(mewtwo)) {
 *   console.log("This is a legendary Pokemon!");
 * }
 */
export function isLegendary(s: Species) {
  return LEGENDARY.has(s.InternalName);
}

/**
 * Check if a Pokemon is classified as sub-legendary
 * 
 * Used for filtering in Pokedex and Box views. When "Exclude Sub-Legendary"
 * is enabled, these Pokemon will be hidden from results.
 * 
 * @param s - The Pokemon species to check
 * @returns true if the Pokemon is in the SUB_LEGENDARY set
 * 
 * @example
 * if (isSubLegendary(dragonite)) {
 *   console.log("This is a sub-legendary Pokemon (600 BST)!");
 * }
 */
export function isSubLegendary(s: Species) {
  return SUB_LEGENDARY.has(s.InternalName);
}
