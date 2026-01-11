/**
 * Evolution Line Component
 * 
 * Displays complete evolution chains for Pokemon, automatically finding
 * the root of the evolutionary tree and rendering all branches recursively.
 * 
 * Features:
 * - Automatically finds base form (pre-evolution)
 * - Shows all evolution paths (e.g., Eevee's 8 evolutions)
 * - Displays evolution conditions (level, stone, trade, etc.)
 * - Recursive tree rendering for multi-stage evolutions
 * - Handles alternate forms (Alolan, Galarian, etc.)
 * - Graceful handling of missing evolution data
 * 
 * The component walks backward through the evolution tree to find the root,
 * then renders forward through all possible evolution paths.
 * 
 * @module components/EvolutionLine
 */

import { useMemo } from "react";
import type { Species } from "../lib/types/species";
import SpriteTile from "./SpriteTile";
import { buildReverseIndex, getForwardEvos } from "../lib/evolutionMap";

/**
 * Get the display name for a Pokemon, including form name if applicable
 * 
 * Formats names to include regional forms and variants:
 * - Standard: "Pikachu"
 * - Regional: "Raichu (Alolan)"
 * - Mega: "Charizard (Mega X)"
 * 
 * @param speciesList - Full list of all Pokemon species
 * @param internalName - Internal name to look up (e.g., "PIKACHU", "RAICHU_1")
 * @returns Formatted display name with form in parentheses if applicable
 */
function displayName(speciesList: Species[], internalName: string) {
  const s = speciesList.find((x) => x.InternalName === internalName);
  if (!s) return internalName;
  return s.FormName ? `${s.Name} (${s.FormName})` : s.Name;
}

/**
 * Get the Pokedex ID for a Pokemon by internal name
 * 
 * @param speciesList - Full list of all Pokemon species
 * @param internalName - Internal name to look up
 * @returns Pokedex ID (number) or null if Pokemon not found
 */
function dexId(speciesList: Species[], internalName: string) {
  return speciesList.find((x) => x.InternalName === internalName)?.ID ?? null;
}

/**
 * Renders a single Pokemon node in the evolution tree
 * 
 * Shows:
 * - Pokemon sprite (using SpriteTile)
 * - Display name with form
 * - Pokedex number
 * 
 * Used as building block for the recursive Tree component.
 */
function Node({
  speciesList,
  internalName,
}: {
  speciesList: Species[];
  internalName: string;
}) {
  const id = dexId(speciesList, internalName);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {id ? (
        <SpriteTile headId={id} bodyId={id} title={displayName(speciesList, internalName)} />
      ) : (
        // Fallback for missing Pokemon data
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 12,
            border: "1px solid #ddd",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            opacity: 0.7,
            backgroundColor: "#f5f5f5",
          }}
        >
          missing
        </div>
      )}

      <div>
        <div style={{ fontWeight: 900 }}>{displayName(speciesList, internalName)}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {id ? `#${id}` : internalName}
        </div>
      </div>
    </div>
  );
}

/**
 * Recursively renders the evolution tree starting from a Pokemon
 * 
 * Renders:
 * - Current Pokemon node
 * - Arrow and evolution condition for each path
 * - Recursive tree for each evolved form
 * 
 * Base case: If Pokemon has no forward evolutions, render just the node.
 * Recursive case: Render node, then render each evolution path with conditions.
 * 
 * Handles branching evolutions (e.g., Eevee) by rendering multiple paths vertically.
 * 
 * @example
 * Eevee → (Use Water Stone) → Vaporeon
 *      → (Use Thunder Stone) → Jolteon
 *      → (Use Fire Stone) → Flareon
 *      ...
 */
function Tree({
  speciesList,
  internalName,
}: {
  speciesList: Species[];
  internalName: string;
}) {
  const forward = getForwardEvos(internalName);

  // Base case: no evolutions, just render the node
  if (forward.length === 0) return <Node speciesList={speciesList} internalName={internalName} />;

  // Recursive case: render node with all evolution paths
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <Node speciesList={speciesList} internalName={internalName} />

      {/* Render each evolution path vertically */}
      <div style={{ display: "grid", gap: 12 }}>
        {forward.map((e) => (
          <div
            key={`${internalName}->${e.to}`}
            style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
          >
            {/* Evolution arrow and condition */}
            <div style={{ minWidth: 170, textAlign: "center" }}>
              <div style={{ fontSize: 20, lineHeight: "20px" }}>→</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{e.text}</div>
            </div>
            {/* Recursively render the evolved form's tree */}
            <Tree speciesList={speciesList} internalName={e.to} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component that displays the complete evolution line for a Pokemon
 * 
 * Algorithm:
 * 1. Build reverse index of all evolutions (what each Pokemon evolved from)
 * 2. Walk backward from current Pokemon to find root(s) of evolution tree
 * 3. Render forward from each root using recursive Tree component
 * 
 * Features:
 * - Automatically finds base form even when viewing evolved Pokemon
 * - Handles Pokemon with multiple pre-evolutions (rare but possible)
 * - Shows all evolution branches from the root
 * - Displays evolution conditions between each stage
 * - Graceful message when no evolution data exists
 * 
 * @example
 * // Viewing Charizard will show: Charmander → Charmeleon → Charizard
 * <EvolutionLine speciesList={species} internalName="CHARIZARD" />
 * 
 * // Viewing Eevee will show all 8+ evolution paths
 * <EvolutionLine speciesList={species} internalName="EEVEE" />
 */
export default function EvolutionLine({
  speciesList,
  internalName,
}: {
  speciesList: Species[];
  internalName: string;
}) {
  // Build reverse index once for this component instance
  const reverseIndex = useMemo(() => buildReverseIndex(), []);

  // Find root Pokemon by walking backward through evolution tree
  const roots = useMemo(() => {
    const seen = new Set<string>();
    const stack = [internalName];
    const allAncestors = new Set<string>();

    // Traverse backward to find all ancestors
    while (stack.length) {
      const cur = stack.pop()!;
      if (seen.has(cur)) continue;
      seen.add(cur);

      const parents = reverseIndex.get(cur) ?? [];
      for (const p of parents) {
        allAncestors.add(p.from);
        stack.push(p.from);
      }
    }

    // Find Pokemon with no pre-evolutions (roots of the tree)
    const candidates = allAncestors.size ? Array.from(allAncestors) : [internalName];
    const rootNodes = candidates.filter((x) => (reverseIndex.get(x) ?? []).length === 0);
    return rootNodes.length ? rootNodes : [internalName];
  }, [internalName, reverseIndex]);

  // Check if this Pokemon has any evolution data at all
  const hasAnyData =
    getForwardEvos(internalName).length > 0 ||
    (reverseIndex.get(internalName)?.length ?? 0) > 0;

  // No evolution data available
  if (!hasAnyData) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, opacity: 0.75 }}>
        No evolution data for this Pokémon.
      </div>
    );
  }

  // Render the complete evolution tree from each root
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Evolution Line</div>
      <div style={{ display: "grid", gap: 14 }}>
        {roots.map((r) => (
          <Tree key={r} speciesList={speciesList} internalName={r} />
        ))}
      </div>
    </div>
  );
}
