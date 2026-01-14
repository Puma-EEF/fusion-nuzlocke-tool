/**
 * Learnset Index - Build searchable indices of moves each Pokemon can learn
 */

import type { Learnset } from "./types/learnset";

export function buildLearnsetMoveIndex(learnsets: Learnset[]) {
  const index = new Map<string, Set<string>>();

  for (const ls of learnsets) {
    const set = new Set<string>();

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
