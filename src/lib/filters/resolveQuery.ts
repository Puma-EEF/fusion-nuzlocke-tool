import type { Move } from "../types/moves";
import type { Ability } from "../types/ability";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function findMoveInternal(input: string, moves: Move[]): string | null {
  const q = normalize(input);
  if (!q) return null;

  const exactByName = moves.find((m) => m.Name.toLowerCase() === q);
  if (exactByName) return exactByName.InternalName;

  const exactByInternal = moves.find((m) => m.InternalName.toLowerCase() === q);
  if (exactByInternal) return exactByInternal.InternalName;

  const partial = moves.find((m) => m.Name.toLowerCase().includes(q));
  return partial ? partial.InternalName : null;
}

export function findAbilityInternal(input: string, abilities: Ability[]): string | null {
  const q = normalize(input);
  if (!q) return null;

  const exactByName = abilities.find((a) => a.Name.toLowerCase() === q);
  if (exactByName) return exactByName.InternalName;

  const exactByInternal = abilities.find((a) => a.InternalName.toLowerCase() === q);
  if (exactByInternal) return exactByInternal.InternalName;

  const partial = abilities.find((a) => a.Name.toLowerCase().includes(q));
  return partial ? partial.InternalName : null;
}
