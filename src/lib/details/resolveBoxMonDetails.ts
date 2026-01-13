import type { Species } from "../types/species";
import type { BoxMon } from "../types/box";
import { resolveDetailsVM } from "./resolveDetails";
import type { DetailsVM } from "./detailsTypes";
import { speciesKeyFromParts } from "./speciesKey";

export function resolveBoxMonDetailsVM(params: {
  boxMon: BoxMon;
  speciesByKey: Map<string, Species>;
  level?: number;
}): DetailsVM | null {
  // Ensure base mons can resolve even if forms exist in dex
  // (Box mons currently assume form 0)
  if (params.boxMon.kind === "BASE") {
    const key = speciesKeyFromParts(params.boxMon.dexId, 0);
    if (!params.speciesByKey.has(key)) {
      // fail gracefully instead of exploding
      return null;
    }
  }

  return resolveDetailsVM({
    input: { source: "boxMon", boxMon: params.boxMon },
    speciesByKey: params.speciesByKey,
    level: params.level ?? 50,
  });
}
