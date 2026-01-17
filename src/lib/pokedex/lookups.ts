import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";

export type PokedexLookups = {
  moveByInternal: (internal: string) => Move | null;
  abilityByInternal: (internal?: string | null) => Ability | null;
};

export function createPokedexLookups(
  moves: Move[],
  abilities: Ability[]
): PokedexLookups {
  const moveMap = new Map<string, Move>();
  for (const m of moves) moveMap.set(m.InternalName, m);

  const abilityMap = new Map<string, Ability>();
  for (const a of abilities) abilityMap.set(a.InternalName, a);

  return {
    moveByInternal(internal: string) {
      return moveMap.get(internal) ?? null;
    },
    abilityByInternal(internal?: string | null) {
      if (!internal) return null;
      return abilityMap.get(internal) ?? null;
    },
  };
}
