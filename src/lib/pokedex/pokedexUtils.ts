/**
 * Pokedex Utility Functions
 * 
 * Common helper functions for Pokedex operations including:
 * - Base Stat Total (BST) calculation
 * - Learnset parsing from pipe-delimited strings
 * - Level-up move parsing with level extraction
 * 
 * @module lib/pokedex/pokedexUtils
 */

import type { Species } from "../../lib/types/species";

/**
 * Calculate Base Stat Total (BST) for a Pokemon
 * 
 * BST is the sum of all six base stats: HP, ATK, DEF, SPA, SPD, SPE.
 * Used for sorting and comparing Pokemon power levels.
 * 
 * @param s - Species data with base stats
 * @returns Total of all base stats
 * 
 * @example
 * const mewtwo = getSpecies("MEWTWO");
 * const bst = getBST(mewtwo); // Returns 680
 */
export function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

/**
 * Parse level-up learnset from pipe-delimited string
 * 
 * Converts format "level:MOVE|level:MOVE|..." into structured array.
 * Results are sorted by level (ascending), then alphabetically by move name.
 * 
 * @param levelUp - Pipe-delimited string like "1:TACKLE|7:GROWL|10:VINEWHIP"
 * @returns Array of { level, move } objects sorted by level
 * 
 * @example
 * const moves = parseLevelUp("1:TACKLE|5:GROWL|9:VINEWHIP");
 * // Returns: [
 * //   { level: 1, move: "TACKLE" },
 * //   { level: 5, move: "GROWL" },
 * //   { level: 9, move: "VINEWHIP" }
 * // ]
 */
export function parseLevelUp(levelUp: string) {
  if (!levelUp) return [];
  const out: { level: number; move: string }[] = [];

  for (const part of levelUp.split("|")) {
    const i = part.indexOf(":");
    if (i === -1) continue;

    const lvl = Number(part.slice(0, i));
    const move = part.slice(i + 1).trim();

    if (!Number.isFinite(lvl) || !move) continue;
    out.push({ level: lvl, move });
  }

  out.sort((a, b) => a.level - b.level);
  return out;
}

/**
 * Parse pipe-delimited move lists (TM, HM, Tutor, Egg moves)
 * 
 * Splits pipe-separated string into array of trimmed move names.
 * Filters out empty strings.
 * 
 * @param s - Pipe-delimited string like "TACKLE|GROWL|VINEWHIP"
 * @returns Array of move internal names
 * 
 * @example
 * const moves = parsePipeList("FLAMETHROWER|FIREBLAST|OVERHEAT");
 * // Returns: ["FLAMETHROWER", "FIREBLAST", "OVERHEAT"]
 * 
 * const empty = parsePipeList("");
 * // Returns: []
 */
export function parsePipeList(s: string) {
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}
