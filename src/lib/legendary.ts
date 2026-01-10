import type { Species } from "./types/species";

/**
 * Set of legendary Pokemon (InternalNames)
 * TODO: Populate with actual legendary Pokemon
 * Examples: "MEWTWO", "LUGIA", "RAYQUAZA", "ARCEUS", etc.
 */
export const LEGENDARY = new Set<string>([]);

/**
 * Set of sub-legendary Pokemon (InternalNames)
 * Also known as "pseudo-legendaries" - powerful Pokemon with 600 BST
 * TODO: Populate with actual sub-legendary Pokemon
 * Examples: "DRAGONITE", "TYRANITAR", "SALAMENCE", "METAGROSS", etc.
 */
export const SUB_LEGENDARY = new Set<string>([]);

/**
 * Check if a Pokemon is classified as legendary
 * @param s - The Pokemon species to check
 * @returns true if the Pokemon is in the legendary set
 */
export function isLegendary(s: Species) {
  return LEGENDARY.has(s.InternalName);
}

/**
 * Check if a Pokemon is classified as sub-legendary
 * @param s - The Pokemon species to check
 * @returns true if the Pokemon is in the sub-legendary set
 */
export function isSubLegendary(s: Species) {
  return SUB_LEGENDARY.has(s.InternalName);
}
