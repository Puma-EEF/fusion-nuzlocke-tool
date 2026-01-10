import type { Learnset } from "./types/learnset";

/**
 * Builds a searchable index of all moves each Pokemon can learn
 * Combines moves from all learning methods: level-up, tutor, and egg moves
 * 
 * @param learnsets - Array of all Pokemon learnsets from data
 * @returns Map where key is Pokemon InternalName and value is Set of move InternalNames
 */
export function buildLearnsetMoveIndex(learnsets: Learnset[]) {
  const index = new Map<string, Set<string>>();

  for (const ls of learnsets) {
    const set = new Set<string>();

    // Parse level-up moves: "1:TELEPORT|4:CONFUSION|..."
    // Format: level:MOVENAME separated by pipes
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

    // Parse tutor moves and egg moves: "MOVE|MOVE|..."
    // Format: simple pipe-separated move names
    for (const field of [ls.TutorMoves,ls.TMMoves, ls.HMMoves, ls.EggMoves]) {
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
