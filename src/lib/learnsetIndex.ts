/**
 * Learnset Index Builder
 * 
 * Builds searchable indices of all moves each Pokemon can learn.
 * Parses encoded learnset data from multiple sources:
 * - Level-up moves: Moves learned naturally by leveling up
 * - TM/HM moves: Moves learned from Technical/Hidden Machines
 * - Tutor moves: Moves taught by move tutors
 * - Egg moves: Moves obtained through breeding
 * 
 * The resulting index allows fast move-based Pokemon filtering,
 * enabling queries like "which Pokemon can learn Thunderbolt?"
 * 
 * @module learnsetIndex
 */

import type { Learnset } from "./types/learnset";

/**
 * Builds a searchable index of all moves each Pokemon can learn
 * 
 * Processes learnset data from all learning methods and combines them
 * into a single Set per Pokemon for fast lookup. This enables efficient
 * filtering of Pokemon by move compatibility.
 * 
 * Data format parsing:
 * - LevelUp: "1:TACKLE|7:GROWL|13:LEECHSEED" (level:MOVE_INTERNAL_NAME)
 * - TutorMoves/TMMoves/HMMoves/EggMoves: "MOVE1|MOVE2|MOVE3" (pipe-separated)
 * 
 * @param learnsets - Array of all Pokemon learnsets from data file
 * @returns Map where:
 *   - Key: Pokemon InternalName (e.g., "BULBASAUR")
 *   - Value: Set of move InternalNames the Pokemon can learn
 * 
 * @example
 * const index = buildLearnsetMoveIndex(learnsets);
 * 
 * // Check if Pikachu can learn Thunderbolt
 * const pikachuMoves = index.get("PIKACHU");
 * const canLearn = pikachuMoves?.has("THUNDERBOLT"); // true
 * 
 * // Find all Pokemon that can learn Fly
 * const flyUsers = Array.from(index.entries())
 *   .filter(([_, moves]) => moves.has("FLY"))
 *   .map(([name, _]) => name);
 */
export function buildLearnsetMoveIndex(learnsets: Learnset[]) {
  const index = new Map<string, Set<string>>();

  for (const ls of learnsets) {
    const set = new Set<string>();

    // Parse level-up moves: "1:TELEPORT|4:CONFUSION|7:PSYBEAM|..."
    // Format: level:MOVENAME separated by pipes
    // We only need the move names, not the levels
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

    // Parse other move sources: "MOVE|MOVE|MOVE|..."
    // Format: simple pipe-separated move InternalNames
    // TMMoves: Technical Machine moves (reusable items)
    // HMMoves: Hidden Machine moves (field abilities)
    // TutorMoves: Move Tutor exclusive moves
    // EggMoves: Breeding-only moves
    for (const field of [ls.TutorMoves, ls.TMMoves, ls.HMMoves, ls.EggMoves]) {
      if (!field) continue;
      for (const m of field.split("|")) {
        const moveInternal = m.trim();
        if (moveInternal) set.add(moveInternal);
      }
    }

    // Store the complete set of moves for this Pokemon
    index.set(ls.InternalName, set);
  }

  return index;
}
