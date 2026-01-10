import evolutionsRaw from "../data/evolutions_if.json";

/**
 * Represents a single evolution possibility for a Pokemon
 */
export type EvoEdge = {
  /** InternalName of the Pokemon this evolves into */
  to: string;
  /** Human-readable evolution condition (e.g., "Level 16", "Use Fire Stone") */
  text: string;
};

/**
 * Maps Pokemon InternalName to their possible evolutions
 * Key: Pokemon InternalName, Value: Array of evolution possibilities
 */
export type EvoMap = Record<string, EvoEdge[]>;

const evoMap = evolutionsRaw as EvoMap;

/**
 * Get all forward evolutions (what this Pokemon can evolve into)
 * @param internalName - The InternalName of the Pokemon
 * @returns Array of evolution possibilities, empty if none
 */
export function getForwardEvos(internalName: string): EvoEdge[] {
  return evoMap[internalName] ?? [];
}

/**
 * Build a reverse evolution index (what each Pokemon evolved from)
 * Useful for finding pre-evolutions
 * @returns Map where key is evolved Pokemon and value is array of pre-evolution sources
 */
export function buildReverseIndex(): Map<string, { from: string; text: string }[]> {
  const rev = new Map<string, { from: string; text: string }[]>();
  for (const [from, edges] of Object.entries(evoMap)) {
    for (const e of edges) {
      const arr = rev.get(e.to) ?? [];
      arr.push({ from, text: e.text });
      rev.set(e.to, arr);
    }
  }
  return rev;
}
