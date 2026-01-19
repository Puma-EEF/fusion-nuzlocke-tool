/**
 * Shared types for BoxManagement tab system
 */

/**
 * MonRef - A reference to a Pokemon, either from Dex or Box
 * 
 * Format:
 * - "dex:<dexId>" - References a Pokedex entry (view-only source)
 * - "box:<boxId>" - References a stored BoxMon (editable source)
 */
export type MonRef = `dex:${number}` | `box:${string}`;

/**
 * Tool - The available tabs in BoxManagement
 */
export type Tool = "Stats" | "Set Moninfo" | "Fusion" | "Compare" | "Team";

/**
 * Parse a MonRef into its components
 */
export function parseMonRef(ref: MonRef): { type: "dex" | "box"; id: string } {
  const [type, id] = ref.split(":") as ["dex" | "box", string];
  return { type, id };
}

/**
 * Create a MonRef from components
 */
export function createMonRef(type: "dex" | "box", id: string | number): MonRef {
  return `${type}:${id}` as MonRef;
}
