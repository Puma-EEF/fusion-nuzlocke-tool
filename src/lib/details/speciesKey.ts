import type { Species } from "../types/species";

export function speciesKeyFromParts(id: number, form?: number) {
  return `${id}-${form ?? 0}`;
}

export function speciesKey(s: Species) {
  return `${s.ID}-${s.Form ?? 0}`;
}
