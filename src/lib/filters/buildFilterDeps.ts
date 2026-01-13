import type { Learnset } from "../types/learnset";
import { buildLearnsetMoveIndex } from "../learnsetIndex";
import type { FilterDeps } from "./filterTypes";

export function buildFilterDeps(learnsets: Learnset[]): FilterDeps {
  return {
    learnsetIndex: buildLearnsetMoveIndex(learnsets),
  };
}
