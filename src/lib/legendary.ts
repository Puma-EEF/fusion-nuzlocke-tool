/**
 * Legendary Classification - Define legendary and sub-legendary Pokemon for filtering
 */

import type { Species } from "./types/species";

export const LEGENDARY = new Set<string>([]);

export const SUB_LEGENDARY = new Set<string>([]);

export function isLegendary(s: Species) {
  return LEGENDARY.has(s.InternalName);
}

export function isSubLegendary(s: Species) {
  return SUB_LEGENDARY.has(s.InternalName);
}
