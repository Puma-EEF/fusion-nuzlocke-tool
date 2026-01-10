import { useMemo } from "react";
import type { Species } from "../lib/types/species";
import SpriteTile from "./SpriteTile";
import { buildReverseIndex, getForwardEvos } from "../lib/evolutionMap";

/**
 * Get the display name for a Pokemon, including form name if applicable
 * @param speciesList - Full list of all Pokemon species
 * @param internalName - Internal name to look up
 * @returns Formatted display name (e.g., "Pikachu" or "Raichu (Alolan)")
 */
function displayName(speciesList: Species[], internalName: string) {
  const s = speciesList.find((x) => x.InternalName === internalName);
  if (!s) return internalName;
  return s.FormName ? `${s.Name} (${s.FormName})` : s.Name;
}

/**
 * Get the Pokedex ID for a Pokemon
 * @param speciesList - Full list of all Pokemon species
 * @param internalName - Internal name to look up
 * @returns Pokedex ID or null if not found
 */
function dexId(speciesList: Species[], internalName: string) {
  return speciesList.find((x) => x.InternalName === internalName)?.ID ?? null;
}

/**
 * Renders a single Pokemon node in the evolution tree
 * Shows sprite, name, and Pokedex number
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
 * Shows the current Pokemon and all its forward evolutions with conditions
 */
function Tree({
  speciesList,
  internalName,
}: {
  speciesList: Species[];
  internalName: string;
}) {
  const forward = getForwardEvos(internalName);

  if (forward.length === 0) return <Node speciesList={speciesList} internalName={internalName} />;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <Node speciesList={speciesList} internalName={internalName} />

      <div style={{ display: "grid", gap: 12 }}>
        {forward.map((e) => (
          <div
            key={`${internalName}->${e.to}`}
            style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
          >
            <div style={{ minWidth: 170, textAlign: "center" }}>
              <div style={{ fontSize: 20, lineHeight: "20px" }}>→</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{e.text}</div>
            </div>
            <Tree speciesList={speciesList} internalName={e.to} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component that displays the complete evolution line for a Pokemon
 * Automatically finds the root of the evolution tree and displays all branches
 * Shows evolution conditions (level, items, etc.) between each stage
 */
export default function EvolutionLine({
  speciesList,
  internalName,
}: {
  speciesList: Species[];
  internalName: string;
}) {
  const reverseIndex = useMemo(() => buildReverseIndex(), []);

  // Find root Pokemon by walking backward through the evolution tree
  const roots = useMemo(() => {
    const seen = new Set<string>();
    const stack = [internalName];
    const allAncestors = new Set<string>();

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

    const candidates = allAncestors.size ? Array.from(allAncestors) : [internalName];
    const rootNodes = candidates.filter((x) => (reverseIndex.get(x) ?? []).length === 0);
    return rootNodes.length ? rootNodes : [internalName];
  }, [internalName, reverseIndex]);

  const hasAnyData =
    getForwardEvos(internalName).length > 0 ||
    (reverseIndex.get(internalName)?.length ?? 0) > 0;

  if (!hasAnyData) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, opacity: 0.75 }}>
        No evolution data for this Pokémon.
      </div>
    );
  }

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
