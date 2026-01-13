import speciesRaw from "../../data/species.json";
import movesRaw from "../../data/moves.json";
import abilitiesRaw from "../../data/abilities.json";
import learnsetsRaw from "../../data/learnsets.json";

import type { Species } from "../types/species";
import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";
import type { Learnset } from "../types/learnset";

import { resolveDetailsVM } from "./resolveDetails";
import { speciesKey } from "./speciesKey";

export function debugDetailsQuickCheck() {
  const species = speciesRaw as Species[];
  const moves = movesRaw as Move[];
  const abilities = abilitiesRaw as Ability[];
  const learnsets = learnsetsRaw as Learnset[];

  // Build a proper key map (supports forms)
  const speciesByKey = new Map<string, Species>();
  for (const s of species) speciesByKey.set(speciesKey(s), s);

  // Pick something common. 25 is Pikachu in vanilla, but your dataset may differ.
  // You can also just use the first species entry.
  const pick = species[0];
  const dexId = pick.ID;
  const form = pick.Form ?? 0;

  const vm = resolveDetailsVM({
    input: { source: "species", dexId, form },
    speciesByKey,
    level: 50,
    movesRaw: moves,
    abilitiesRaw: abilities,
    learnsetsRaw: learnsets,
  });

  console.log("Details test for:", `${dexId}-${form}`, pick.Name);
  console.log(vm);
}
