import speciesRaw from "../../data/species.json";
import movesRaw from "../../data/moves.json";
import abilitiesRaw from "../../data/abilities.json";
import learnsetsRaw from "../../data/learnsets.json";

import type { Species } from "../types/species";
import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";
import type { Learnset } from "../types/learnset";

import { buildFilterDeps } from "./buildFilterDeps";
import { filterSpeciesList } from "./filterSpecies";

export function debugQuickCheck() {
  const species = speciesRaw as Species[];
  const moves = movesRaw as Move[];
  const abilities = abilitiesRaw as Ability[];
  const learnsets = learnsetsRaw as Learnset[];

  const deps = buildFilterDeps(learnsets);

  const out = filterSpeciesList(
    species,
    moves,
    abilities,
    {
      nameQuery: "",
      typeA: "ANY",
      typeB: "NONE",
      abilityText: "Intimidate",
      moveText: "Thunderbolt",
      excludeLegendary: false,
      excludeSubLegendary: false,
      sortBy: "DEX",
      sortDir: "asc",
    },
    deps
  );

  console.log("Filter result count:", out.length);
  console.log("First 5:", out.slice(0, 5).map(s => `${s.ID}-${s.Form ?? 0} ${s.Name}`));
}
