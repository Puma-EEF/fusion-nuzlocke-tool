/**
 * Evolution Map - Query Pokemon evolution chains and conditions
 */

import evolutionsRaw from "../data/evolutions_if.json";

export type EvoEdge = {
  to: string;
  text: string;
};

export type EvoMap = Record<string, EvoEdge[]>;

const evoMap = evolutionsRaw as EvoMap;

export function getForwardEvos(internalName: string): EvoEdge[] {
  return evoMap[internalName] ?? [];
}

/**
 * Build a reverse evolution index (what each Pokemon evolved from)
 * 
 * Creates an inverted map showing pre-evolutions for each Pokemon.
 * Useful for displaying complete evolution chains or finding base forms.
 * 
 * @returns Map where:
 *   - Key: Evolved Pokemon InternalName
 *   - Value: Array of pre-evolution sources with their evolution methods
 * 
 * @example
 * const reverseIndex = buildReverseIndex();
 * reverseIndex.get("CHARIZARD")
 * // Returns: [{ from: "CHARMELEON", text: "Level 36" }]
 * 
 * reverseIndex.get("VAPOREON")
 * // Returns: [{ from: "EEVEE", text: "Use Water Stone" }]
 * 
 * @note For Pokemon with multiple pre-evolutions (rare but possible),
 * returns all possible pre-evolution paths
 */
export function buildReverseIndex(): Map<string, { from: string; text: string }[]> {
  const rev = new Map<string, { from: string; text: string }[]>();
  
  // Iterate through all Pokemon and their evolution edges
  for (const [from, edges] of Object.entries(evoMap)) {
    for (const e of edges) {
      // For each evolution target, record where it came from
      const arr = rev.get(e.to) ?? [];
      arr.push({ from, text: e.text });
      rev.set(e.to, arr);
    }
  }
  
  return rev;
}
