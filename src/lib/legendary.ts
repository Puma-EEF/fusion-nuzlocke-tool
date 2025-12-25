import type { Species } from "../types/species";

/**
 * Fill these later. Using InternalName is robust.
 * Example:
 * export const LEGENDARY = new Set(["MEWTWO", "LUGIA"]);
 * export const SUB_LEGENDARY = new Set(["DRAGONITE", "SALAMENCE"]);
 */
export const LEGENDARY = new Set<string>([]);
export const SUB_LEGENDARY = new Set<string>([]);

export function isLegendary(s: Species) {
  return LEGENDARY.has(s.InternalName);
}
export function isSubLegendary(s: Species) {
  return SUB_LEGENDARY.has(s.InternalName);
}
