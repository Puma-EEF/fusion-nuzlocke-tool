/**
 * Pokedex Component
 * 
 * Comprehensive Pokemon browser with advanced filtering and detailed views.
 * Supports both full-page layout and embedded panel mode.
 * 
 * Features:
 * - Browse all Pokemon with sprites
 * - Multi-criteria filtering (name, type, ability, move)
 * - Sort by any stat or BST
 * - Exclude legendary/sub-legendary Pokemon
 * - Expandable detail view for each Pokemon showing:
 *   - Complete base stats with BST
 *   - All learnable moves by method (level-up, TM, HM, tutor, egg)
 *   - All abilities including hidden abilities
 *   - Complete evolution chains
 *   - Pokedex entry text
 * - Optional "add to box" functionality via callback
 * 
 * Layout:
 * - Page variant: Two-panel layout with results list on left and detailed info on right
 * - Panel variant: Compact list view without detailed right panel
 * 
 * @module pages/Pokedex
 */

import { useMemo, useState } from "react";
import { createPokedexFilterEngine } from "../lib/pokedex/filterEngine";
import KeyValueRow from "../components/KeyValueRow";
import { getBST } from "../lib/pokedex/pokedexUtils";
import LearnsetViewer from "../components/moves/LearnsetViewer";
import { fuseLearnset } from "../lib/fusion";

import speciesRaw from "../data/species.json";
import movesRaw from "../data/moves.json";
import abilitiesRaw from "../data/abilities.json";
import learnsetsRaw from "../data/learnsets.json";

import type { Species } from "../lib/types/species";
import type { Move } from "../lib/types/moves";
import type { Ability } from "../lib/types/ability";
import type { Learnset } from "../lib/types/learnset";
import type { PokedexFiltersState } from "../lib/types/pokedexFilters";

import SpriteTile from "../components/SpriteTile";
import EvolutionLine from "../components/EvolutionLine";


const speciesList = speciesRaw as Species[];
const movesList = movesRaw as Move[];
const abilitiesList = abilitiesRaw as Ability[];
const learnsetsList = learnsetsRaw as Learnset[];
const movesByInternal = new Map<string, Move>(
  movesList.map((m) => [m.InternalName, m])
);
const learnsetsByInternal = new Map<string, Learnset>(
  learnsetsList.map((l) => [l.InternalName, l])
);
const abilitiesByInternal = new Map<string, Ability>(
  abilitiesList.map((a) => [a.InternalName, a])
);
const speciesByKey = new Map<string, Species>(
  speciesList.map((s) => [`${s.ID}-${s.Form ?? 0}`, s])
);



/**
 * Component to display ability information in a card format
 * 
 * Shows ability details including:
 * - Display name and internal name
 * - Ability description
 * 
 * Handles edge cases:
 * - Null/undefined values (shows placeholder)
 * - Missing ability data (shows error message with internal name)
 * 
 * @param internal - The internal name of the ability to display
 */
function AbilityCard({ internal }: { internal: string | null | undefined }) {
  const a = internal ? (abilitiesByInternal.get(internal) ?? null) : null;
  if (!internal) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10, opacity: 0.75 }}>
        —
      </div>
    );
  }
  if (!a) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
        <div style={{ fontWeight: 900 }}>{internal}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Ability not found in abilities.json</div>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 900 }}>{a.Name}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{a.InternalName}</div>
      </div>
      {a.Description ? (
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{a.Description}</div>
      ) : null}
    </div>
  );
}

/**
 * Collapsible section component using HTML details/summary elements
 * 
 * Used to organize Pokemon information into expandable/collapsible sections.
 * Provides a clean way to group related data (stats, moves, abilities, etc.).
 * 
 * @param title - The section header text
 * @param defaultOpen - Whether the section should be expanded by default (default: false)
 * @param children - The content to display inside the section
 */
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 900, listStyle: "none" as any }}>
        {title}
      </summary>
      <div style={{ marginTop: 10 }}>{children}</div>
    </details>
  );
}

/**
 * Props for the Pokedex component
 * 
 * Extends PokedexFiltersState with additional display and interaction options.
 * Supports two main use cases:
 * 1. Full-page Pokedex browser (variant="page")
 * 2. Embedded panel for selection (variant="panel")
 */
type PokedexProps = PokedexFiltersState & {
  /** Controls layout: "page" for two-panel layout, "panel" for compact list view. Default: "page" */
  variant?: "page" | "panel";
  /** When false, bypasses all filters and shows the complete unfiltered Pokedex. Default: true */
  applyFilters?: boolean;

  /** When provided, adds a Pokeball button to each entry that calls this callback with the Pokemon's dex ID */
  onAddToBox?: (dexId: number) => void;
};


/**
 * Main Pokedex component
 * 
 * Renders either a full two-panel layout (page variant) or a compact list (panel variant).
 * 
 * Data Flow:
 * 1. Creates filter engine from move/ability/learnset data
 * 2. Applies filters to species list based on props
 * 3. Maintains selected Pokemon state for detail view
 * 4. Parses and displays learnset data for selected Pokemon
 * 
 * Layout Variants:
 * - "page": Two-panel layout with results list (left) and detailed info (right)
 * - "panel": Compact list view without detailed panel
 * 
 * @param props - Component props including filters and display options
 */
export default function Pokedex(props: PokedexProps) {
  const variant = props.variant ?? "page";

  // Track selected Pokemon using "ID-Form" key format (e.g., "1-0" for Bulbasaur)
  const [selectedKey, setSelectedKey] = useState<string>("1-0");

  // Create filter engine once with move/ability/learnset data
  const filterEngine = useMemo(
    () =>
      createPokedexFilterEngine({
        moves: movesList,
        abilities: abilitiesList,
        learnsets: learnsetsList,
      }),
    []
  );

  // Apply all filters, sorts, and exclusions to get the final results list
  const filtered = useMemo(() => {
    return filterEngine.apply(
      speciesList,
      {
        nameQuery: props.nameQuery,
        typeA: props.typeA,
        typeB: props.typeB,
        abilityText: props.abilityText,
        moveText: props.moveText,
        sortBy: props.sortBy,
        sortDir: props.sortDir,
        excludeLegendary: props.excludeLegendary,
        excludeSubLegendary: props.excludeSubLegendary,
      },
      { applyFilters: props.applyFilters }
    );
  }, [
    filterEngine,
    props.applyFilters,
    props.nameQuery,
    props.typeA,
    props.typeB,
    props.abilityText,
    props.moveText,
    props.sortBy,
    props.sortDir,
    props.excludeLegendary,
    props.excludeSubLegendary,
  ]);

  const selected = useMemo(() => {
    if (!selectedKey) return null; // use your actual state var name
    return speciesByKey.get(selectedKey) ?? null;
  }, [selectedKey]);

  const learnsetForSelected = useMemo(() => {
    if (!selected) return null;
    return learnsetsByInternal.get(selected.InternalName) ?? null;
  }, [selected]);

  const selectedBST = useMemo(() => (selected ? getBST(selected) : 0), [selected]);

  const normalizedLearnset = useMemo(() => {
    if (!learnsetForSelected) return null;
    return fuseLearnset(learnsetForSelected, null);
  }, [learnsetForSelected]);

  // Render compact list view for panel variant (no detail pane)
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
              {/* Pokemon selection button */}
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

              {/* Pokeball button - adds Pokemon to box when clicked */}
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

  // Render two-panel layout for page variant (results list + detail view)
  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", height: "100%" }}>
      {/* Left panel: Scrollable results list */}
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

                {/* Pokeball button - adds Pokemon to box when clicked */}
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

      {/* Right panel: Scrollable detail view for selected Pokemon */}
      <main style={{ padding: 18, overflow: "auto" }}>
        {!selected ? (
          <p>No selection.</p>
        ) : (
          <>
            {/* Pokemon header with sprite, name, and types */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <SpriteTile
                headId={selected.ID}
                bodyId={selected.ID}
                title={`#${selected.ID} ${selected.Name}`}
              />
              <div>
                <h1 style={{ margin: 0 }}>
                  #{selected.ID} {selected.Name}
                  {selected.FormName ? ` (${selected.FormName})` : ""}
                </h1>
                <div style={{ fontSize: 14, opacity: 0.75 }}>
                  {selected.Type1}
                  {selected.Type2 ? ` / ${selected.Type2}` : ""}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <Section title={`Stats (BST ${selectedBST})`} defaultOpen>
                <div style={{ display: "grid", gap: 8 }}>
                  <KeyValueRow k="HP" v={selected.BaseHP} />
                  <KeyValueRow k="Atk" v={selected.BaseATK} />
                  <KeyValueRow k="Def" v={selected.BaseDEF} />
                  <KeyValueRow k="SpA" v={selected.BaseSPA} />
                  <KeyValueRow k="SpD" v={selected.BaseSPD} />
                  <KeyValueRow k="Spe" v={selected.BaseSPE} />
                  <KeyValueRow k="BST" v={<b>{selectedBST}</b>} />
                </div>
              </Section>

              <Section title="Moves" defaultOpen>
                {!normalizedLearnset ? (
                  <div style={{ opacity: 0.75 }}>No learnset found.</div>
                ) : (
                  <LearnsetViewer
                    learnset={normalizedLearnset}
                    movesByInternal={movesByInternal}
                    defaultOpen={{ levelUp: true }}
                  />
                )}
              </Section>


              <Section title="Abilities" defaultOpen>
                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Ability 1</div>
                    <AbilityCard internal={selected.Ability1} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Ability 2</div>
                    <AbilityCard internal={selected.Ability2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Hidden Ability 1</div>
                    <AbilityCard internal={selected.HiddenAbility1} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Hidden Ability 2</div>
                    <AbilityCard internal={selected.HiddenAbility2} />
                  </div>
                </div>
              </Section>

              <Section title="Evolution" defaultOpen>
                <EvolutionLine speciesList={speciesList} internalName={selected.InternalName} />
              </Section>

              <Section title="Dex Entry" defaultOpen>
                <p style={{ maxWidth: 900, marginTop: 0 }}>{selected.PokedexEntry}</p>
              </Section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
