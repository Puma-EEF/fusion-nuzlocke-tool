import type { Species } from "../types/species";
import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";
import type { FilterDeps, FilterInputs } from "./filterTypes";
import { findAbilityInternal, findMoveInternal } from "./resolveQuery";
import { sortSpecies } from "./sortSpecies";
import { isLegendary, isSubLegendary } from "../legendary";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function filterSpeciesList(
  speciesList: Species[],
  movesList: Move[],
  abilitiesList: Ability[],
  filters: FilterInputs,
  deps: FilterDeps,
) {
  const q = normalize(filters.nameQuery);
  const selectedAbilityInternal = findAbilityInternal(filters.abilityText, abilitiesList);
  const selectedMoveInternal = findMoveInternal(filters.moveText, movesList);

  const result = speciesList
    .filter((s) => {
      if (!q) return true;
      return (
        s.Name.toLowerCase().includes(q) ||
        s.InternalName.toLowerCase().includes(q)
      );
    })
    .filter((s) => {
      const typeA = filters.typeA;
      const typeB = filters.typeB;

      if (typeA === "ANY") return true;

      const hasA = s.Type1 === typeA || s.Type2 === typeA;
      if (typeB === "NONE" || !typeB) return hasA;

      if (!s.Type2) return false;
      const t1 = s.Type1;
      const t2 = s.Type2;
      return (t1 === typeA && t2 === typeB) || (t1 === typeB && t2 === typeA);
    })
    .filter((s) => {
      if (!selectedAbilityInternal) return true;
      return (
        s.Ability1 === selectedAbilityInternal ||
        s.Ability2 === selectedAbilityInternal ||
        s.HiddenAbility1 === selectedAbilityInternal ||
        s.HiddenAbility2 === selectedAbilityInternal
      );
    })
    .filter((s) => {
      if (!selectedMoveInternal) return true;
      const moves = deps.learnsetIndex.get(s.InternalName);
      if (!moves) return false;
      return moves.has(selectedMoveInternal);
    })
    .filter((s) => {
      if (filters.excludeLegendary && isLegendary(s)) return false;
      if (filters.excludeSubLegendary && isSubLegendary(s)) return false;
      return true;
    });

  return sortSpecies(result, filters.sortBy, filters.sortDir);
}
