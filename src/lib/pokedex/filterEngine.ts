import type { Species } from "../types/species";
import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";
import type { Learnset } from "../types/learnset";
import type { SortBy, SortDir } from "../types/pokedexFilters";

import { buildLearnsetMoveIndex } from "../learnsetIndex";
import { isLegendary, isSubLegendary } from "../legendary";

export type PokedexFilterValues = {
  nameQuery: string;
  typeA: string; // "ANY" or a type
  typeB: string; // "NONE" or a type

  abilityText: string;
  moveText: string;

  sortBy: SortBy;
  sortDir: SortDir;

  excludeLegendary: boolean;
  excludeSubLegendary: boolean;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

function getSortValue(s: Species, sortBy: SortBy) {
  switch (sortBy) {
    case "DEX":
      return s.ID;
    case "HP":
      return s.BaseHP;
    case "ATK":
      return s.BaseATK;
    case "DEF":
      return s.BaseDEF;
    case "SPA":
      return s.BaseSPA;
    case "SPD":
      return s.BaseSPD;
    case "SPE":
      return s.BaseSPE;
    case "BST":
      return getBST(s);
  }
}

type EngineDeps = {
  moves: Move[];
  abilities: Ability[];
  learnsets: Learnset[];
};

export type PokedexFilterEngine = {
  apply: (
    species: Species[],
    filters: PokedexFilterValues,
    opts?: { applyFilters?: boolean }
  ) => Species[];
};

export function createPokedexFilterEngine(deps: EngineDeps): PokedexFilterEngine {
  const moveByExactName = new Map<string, string>();
  const moveByExactInternal = new Map<string, string>();
  const movePartial: Array<{ nameLower: string; internal: string }> = [];

  for (const m of deps.moves) {
    const nameLower = normalize(m.Name);
    const internalLower = normalize(m.InternalName);
    moveByExactName.set(nameLower, m.InternalName);
    moveByExactInternal.set(internalLower, m.InternalName);
    movePartial.push({ nameLower, internal: m.InternalName });
  }

  const abilityByExactName = new Map<string, string>();
  const abilityByExactInternal = new Map<string, string>();
  const abilityPartial: Array<{ nameLower: string; internal: string }> = [];

  for (const a of deps.abilities) {
    const nameLower = normalize(a.Name);
    const internalLower = normalize(a.InternalName);
    abilityByExactName.set(nameLower, a.InternalName);
    abilityByExactInternal.set(internalLower, a.InternalName);
    abilityPartial.push({ nameLower, internal: a.InternalName });
  }

  const learnsetIndex = buildLearnsetMoveIndex(deps.learnsets);

  function resolveMoveInternal(input: string): string | null {
    const q = normalize(input);
    if (!q) return null;

    const exact =
      moveByExactName.get(q) ?? moveByExactInternal.get(q);
    if (exact) return exact;

    const partial = movePartial.find((m) => m.nameLower.includes(q));
    return partial ? partial.internal : null;
  }

  function resolveAbilityInternal(input: string): string | null {
    const q = normalize(input);
    if (!q) return null;

    const exact =
      abilityByExactName.get(q) ?? abilityByExactInternal.get(q);
    if (exact) return exact;

    const partial = abilityPartial.find((a) => a.nameLower.includes(q));
    return partial ? partial.internal : null;
  }

  function apply(
    species: Species[],
    filters: PokedexFilterValues,
    opts?: { applyFilters?: boolean }
  ): Species[] {
    const shouldApply = opts?.applyFilters ?? true;

    if (!shouldApply) {
      return species
        .slice()
        .sort(
          (a, b) => (a.ID - b.ID) || ((a.Form ?? 0) - (b.Form ?? 0))
        );
    }

    const q = normalize(filters.nameQuery);
    const selectedAbilityInternal = resolveAbilityInternal(filters.abilityText);
    const selectedMoveInternal = resolveMoveInternal(filters.moveText);

    return species
      // Name
      .filter((s) => {
        if (!q) return true;
        return (
          s.Name.toLowerCase().includes(q) ||
          s.InternalName.toLowerCase().includes(q)
        );
      })
      // Type A + optional Type B
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
      // Ability (includes hidden)
      .filter((s) => {
        if (!selectedAbilityInternal) return true;
        return (
          s.Ability1 === selectedAbilityInternal ||
          s.Ability2 === selectedAbilityInternal ||
          s.HiddenAbility1 === selectedAbilityInternal ||
          s.HiddenAbility2 === selectedAbilityInternal
        );
      })
      // Move (learnset)
      .filter((s) => {
        if (!selectedMoveInternal) return true;
        const moves = learnsetIndex.get(s.InternalName);
        if (!moves) return false;
        return moves.has(selectedMoveInternal);
      })
      // Exclusions
      .filter((s) => {
        if (filters.excludeLegendary && isLegendary(s)) return false;
        if (filters.excludeSubLegendary && isSubLegendary(s)) return false;
        return true;
      })
      // Sort
      .sort((a, b) => {
        const av = getSortValue(a, filters.sortBy);
        const bv = getSortValue(b, filters.sortBy);
        if (av !== bv) return filters.sortDir === "asc" ? av - bv : bv - av;
        if (a.ID !== b.ID) return a.ID - b.ID;
        return (a.Form ?? 0) - (b.Form ?? 0);
      });
  }

  return { apply };
}
