/**
 * Learnset Index Builder
 * 
 * Creates searchable indices for move learning data.
 * Enables efficient "which Pokemon can learn this move?" queries.
 * 
 * @module lib/learnsetIndex
 * 
 * ## Purpose
 * The learnset index maps move internal names to sets of Pokemon that can learn them.
 * This powers the move filter in the Pokedex, allowing users to search for Pokemon
 * by move name.
 * 
 * ## Index Structure
 * ```
 * Map<string, Set<string>>
 *   ↓        ↓      ↓
 *   Move     Set of Pokemon InternalNames that can learn it
 * ```
 * 
 * ## Methods Indexed
 * - Level-up moves
 * - TM moves
 * - HM moves
 * - Tutor moves
 * - Egg moves
 * 
 * @example
 * const index = buildLearnsetMoveIndex(learnsets);
 * const surfers = index.get("SURF");
 * // Returns Set of all Pokemon that can learn Surf
 */

import type { Learnset } from "./types/learnset";

/**
 * Build an index mapping moves to Pokemon that can learn them
 * 
 * Parses all learnset data and creates a lookup structure for efficient
 * move-based filtering. This enables "Show me all Pokemon that can learn Surf"
 * type queries in O(1) time.
 * 
 * @param learnsets - Array of all Pokemon learnsets
 * @returns Map where keys are Pokemon InternalNames and values are Sets of move InternalNames
 * 
 * @example
 * const index = buildLearnsetMoveIndex(allLearnsets);
 * const bulbasaurMoves = index.get("BULBASAUR");
 * // Returns Set containing all moves Bulbasaur can learn
 */
export function buildLearnsetMoveIndex(learnsets: Learnset[]) {
  const index = new Map<string, Set<string>>();

  for (const ls of learnsets) {
    const set = new Set<string>();

    // Parse level-up moves (format: "level:MOVE|level:MOVE")
    if (ls.LevelUp) {
      const parts = ls.LevelUp.split("|");
      for (const p of parts) {
        const colon = p.indexOf(":");
        if (colon !== -1) {
          const moveInternal = p.slice(colon + 1).trim();
          if (moveInternal) set.add(moveInternal);
        }
      }
    }

    // Parse pipe-delimited move lists (TM, HM, Tutor, Egg)
    for (const field of [ls.TutorMoves, ls.TMMoves, ls.HMMoves, ls.EggMoves]) {
      if (!field) continue;
      for (const m of field.split("|")) {
        const moveInternal = m.trim();
        if (moveInternal) set.add(moveInternal);
      }
    }

    index.set(ls.InternalName, set);
  }

  return index;
}
