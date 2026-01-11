/**
 * Pokedex Page Component
 * 
 * Comprehensive Pokemon browser with advanced filtering and detailed views.
 * 
 * Features:
 * - Browse all Pokemon with sprites
 * - Multi-criteria filtering (name, type, ability, move)
 * - Sort by any stat or BST
 * - Exclude legendary/sub-legendary Pokemon
 * - Expandable detail view for each Pokemon showing:
 *   - Complete base stats
 *   - All learnable moves by method (level-up, TM, tutor, egg)
 *   - All abilities including hidden abilities
 *   - Complete evolution chains
 * 
 * Data Processing Pipeline:
 * 1. Apply name/type/ability/move filters
 * 2. Apply legendary exclusions
 * 3. Sort by selected stat
 * 4. Render paginated grid with detail expansion
 * 
 * @module pages/Pokedex
 */

// src/pages/Pokedex.tsx
import { useMemo, useState } from "react";
import speciesRaw from "../data/species.json";
import DetailsPanel from "../components/DetailsPanel";
import { resolveDetailsVM } from "../lib/details/resolveDetails";
import type { Species } from "../lib/types/species";
import type { PokedexFiltersState, SortBy } from "../lib/types/pokedexFilters";
import { isLegendary, isSubLegendary } from "../lib/legendary";

const speciesList = speciesRaw as Species[];

/** Normalize a string for case-insensitive comparison */
function normalize(s: string) {
  return s.trim().toLowerCase();
}

/** Calculate Base Stat Total for a Pokemon */
function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

/** Get the numeric value to use for sorting a Pokemon by a specific stat */
function getSortValue(s: Species, sortBy: SortBy) {
  switch (sortBy) {
    case "DEX":
      return s.ID;
    case "HP":
      return s.BaseHP;
    case "ATK":
      return s.BaseATK;
    case "DEF":
      return s.BaseDEF;
    case "SPA":
      return s.BaseSPA;
    case "SPD":
      return s.BaseSPD;
    case "SPE":
      return s.BaseSPE;
    case "BST":
      return getBST(s);
  }
}


/**
 * Props for the Pokedex component
 * Extends PokedexFiltersState with optional filter control
 */
type PokedexProps = PokedexFiltersState & {
  /** Controls layout when used as a full page vs embedded panel. */
  variant?: "page" | "panel";
  /** When false, show the full dex without applying any filter/sort/exclusions. */
  applyFilters?: boolean;

  /** When provided, shows an "add to box" button per entry. */
  onAddToBox?: (dexId: number) => void;
};


/**
 * Main Pokedex page component
 * Two-panel layout: Results list on left, detailed info on right
 * Features:
 * - Comprehensive filtering by name, type, ability, moves
 * - Sorting by stats or Pokedex number
 * - Detailed Pokemon info including stats, moves, abilities, evolution
 * - Move learnsets with level requirements
 */
export default function Pokedex(props: PokedexProps) {
  const variant = props.variant ?? "page";

  const [selectedKey, setSelectedKey] = useState<string>("1-0");
    const speciesById = useMemo(() => {
    const m = new Map<number, Species>();
    for (const s of speciesList) m.set(s.ID, s);
    return m;
  }, []);


  // Apply all filters and sorting to create the results list
  const filtered = useMemo(() => {
    const apply = props.applyFilters ?? true;
if (!apply) {
  // full dex, stable default ordering
  return speciesList
    .slice()
    .sort((a, b) => (a.ID - b.ID) || ((a.Form ?? 0) - (b.Form ?? 0)));
}

    const q = normalize(props.nameQuery);

    const result = speciesList
      // Name
      .filter((s) => {
        if (!q) return true;
        return s.Name.toLowerCase().includes(q) || s.InternalName.toLowerCase().includes(q);
      })
      // Type A + optional Type B
      .filter((s) => {
        const typeA = props.typeA;
        const typeB = props.typeB;

        if (typeA === "ANY") return true;

        const hasA = s.Type1 === typeA || s.Type2 === typeA;
        if (typeB === "NONE" || !typeB) return hasA;

        if (!s.Type2) return false;
        const t1 = s.Type1;
        const t2 = s.Type2;
        return (t1 === typeA && t2 === typeB) || (t1 === typeB && t2 === typeA);
      })
      
      // Sort
      .filter((s) => {
        if (props.excludeLegendary && isLegendary(s)) return false;
        if (props.excludeSubLegendary && isSubLegendary(s)) return false;
        return true;
      })
      .sort((a, b) => {
        const av = getSortValue(a, props.sortBy);
        const bv = getSortValue(b, props.sortBy);
        if (av !== bv) return props.sortDir === "asc" ? av - bv : bv - av;
        if (a.ID !== b.ID) return a.ID - b.ID;
        return (a.Form ?? 0) - (b.Form ?? 0);
      });

    return result;
  }, [
    props.nameQuery,
    props.typeA,
    props.typeB,
    props.sortBy,
    props.sortDir,
    props.excludeLegendary,
    props.excludeSubLegendary,
  ]);

  const selected = useMemo(() => {
    const [idStr, formStr] = selectedKey.split("-");
    const id = Number(idStr);
    const form = Number(formStr);

    return (
      speciesList.find((s) => s.ID === id && (s.Form ?? 0) === form) ??
      filtered[0] ??
      null
    );
  }, [selectedKey, filtered]);
  const vm = selected
    ? resolveDetailsVM({
        input: { source: "species", dexId: selected.ID },
        speciesById,
      })
    : null;


  if (variant === "panel") {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
          Results: <b>{filtered.length}</b>
        </div>

        {filtered.map((s) => {
          const key = `${s.ID}-${s.Form ?? 0}`;
          const selected = selectedKey === key;

          return (
            <div key={key} style={{ position: "relative" }}>
              {/* Row button */}
              <button
                type="button"
                onClick={() => setSelectedKey(key)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 10,
                  paddingRight: props.onAddToBox ? 52 : 10, // reserve space for icon
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  background: selected ? "#f3f3f3" : "white",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  #{s.ID} {s.Name}
                  {s.FormName ? ` (${s.FormName})` : ""}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {s.Type1}
                  {s.Type2 ? ` / ${s.Type2}` : ""}
                </div>
              </button>

              {/* Add-to-box icon pinned to the right (always visible) */}
              {props.onAddToBox ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // don't trigger row select
                    props.onAddToBox?.(s.ID);
                  }}
                  title="Add to box"
                  aria-label="Add to box"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                  }}
                >
                  <img
                    src="/types/POKEBALL.png"
                    alt=""
                    style={{
                      width: 20,
                      height: 20,
                      imageRendering: "pixelated",
                      display: "block",
                    }}
                  />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    );
}


  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", height: "100%" }}>
      {/* Results list */}
      <aside style={{ borderRight: "1px solid #ddd", padding: 12, overflow: "auto" }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
          Results: <b>{filtered.length}</b>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          {filtered.map((s) => {
            const key = `${s.ID}-${s.Form ?? 0}`;
            const selected = selectedKey === key;

            return (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {/* Select row */}
                <button
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    background: selected ? "#f3f3f3" : "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>
                    #{s.ID} {s.Name}
                    {s.FormName ? ` (${s.FormName})` : ""}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    {s.Type1}
                    {s.Type2 ? ` / ${s.Type2}` : ""}
                  </div>
                </button>

                {/* Add to box (pokéball) */}
                {props.onAddToBox ? (
                  <button
                    type="button"
                    onClick={() => props.onAddToBox?.(s.ID)}
                    title="Add to box"
                    aria-label="Add to box"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      padding: 0,
                    }}
                  >
                    <img
                      src="/types/POKEBALL.png"
                      alt=""
                      style={{
                        width: 20,
                        height: 20,
                        imageRendering: "pixelated",
                        display: "block",
                      }}
                    />
                  </button>
                ) : null}
              </div>
            );
          })}

        </div>
      </aside>

      {/* Details */}
      <div style={{ padding: 12, overflow: "auto" }}>
        {vm ? <DetailsPanel vm={vm} editor={{ canEdit: false }} /> : null}
      </div>

    </div>
  );
}
