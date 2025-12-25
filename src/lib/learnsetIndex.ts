import type { Learnset } from "../types/learnset";

/**
 * Builds a map: Pokemon InternalName -> Set of move InternalNames
 * (All learning methods combined: level-up, tutor, egg)
 */
export function buildLearnsetMoveIndex(learnsets: Learnset[]) {
  const index = new Map<string, Set<string>>();

  for (const ls of learnsets) {
    const set = new Set<string>();

    // LevelUp: "1:TELEPORT|4:CONFUSION|..."
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

    // TutorMoves / EggMoves: "MOVE|MOVE|..."
    for (const field of [ls.TutorMoves, ls.EggMoves]) {
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
