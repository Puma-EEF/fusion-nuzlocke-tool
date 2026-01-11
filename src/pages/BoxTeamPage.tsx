/**
 * Box & Team Management Page Component
 * 
 * Manage your Pokemon box and active party for Nuzlocke runs.
 * Integrates with the Pokedex for adding Pokemon and uses the same
 * filter system for searching your collection.
 * 
 * Features:
 * - Add base Pokemon or fusions to your box
 * - Filter your box using the shared Pokedex filter bar
 * - Tab system: View all Pokemon, base forms only, or fusions only
 * - Build and manage your 6-Pokemon active party
 * - Rarity tier tracking (Normal, Sub-Legendary, Legendary)
 * - Persistent storage using browser localStorage
 * 
 * Box Entry Types:
 * - BASE: Single base-form Pokemon (e.g., Pikachu)
 * - FUSED: Fusion of two Pokemon (e.g., Pikachu/Charmander)
 * 
 * Data Flow:
 * 1. Browse Pokedex with filters
 * 2. Add Pokemon to box (stored in App state)
 * 3. Move Pokemon from box to team (max 6)
 * 4. All changes auto-save to localStorage
 * 
 * @module pages/BoxTeamPage
 */

import { useMemo, useState } from "react";

import type { SortBy, SortDir } from "../lib/types/pokedexFilters";
import type { BoxMon, RarityTier } from "../lib/types/box";
import type { NatureId } from "../lib/types/box";
import { UNDEFINED_ABILITY } from "../lib/types/box";
import { newBoxId } from "../lib/boxStorage";
import { DEFAULT_IVS, DEFAULT_NATURE } from "../lib/types/box";

import speciesRaw from "../data/species.json";
import type { Species } from "../lib/types/species";
import { isLegendary, isSubLegendary } from "../lib/legendary";

import SpriteTile from "../components/SpriteTile";
import Pokedex from "./Pokedex";

type BoxTeamPageProps = {
  // shared filter state
  filterTarget: "pokedex" | "box";
  setFilterTarget: (t: "pokedex" | "box") => void;

  nameQuery: string;
  setNameQuery: (v: string) => void;
  typeA: string;
  setTypeA: (v: string) => void;
  typeB: string;
  setTypeB: (v: string) => void;
  abilityText: string;
  setAbilityText: (v: string) => void;
  moveText: string;
  setMoveText: (v: string) => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  sortDir: SortDir;
  setSortDir: (v: SortDir) => void;
  excludeLegendary: boolean;
  setExcludeLegendary: (v: boolean) => void;
  excludeSubLegendary: boolean;
  setExcludeSubLegendary: (v: boolean) => void;

  // box state
  box: BoxMon[];
  setBox: (next: BoxMon[]) => void;
};

const speciesList = speciesRaw as Species[];
const LS_KEY = "fusion-nuzlocke-tool:box:v1";

type BoxTab = "ALL" | "BASE" | "FUSED";

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        background: active ? "#111" : "white",
        color: active ? "white" : "#111",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      {children}
    </button>
  );
}

export default function BoxTeamPage(props: BoxTeamPageProps) {
  const [boxTab, setBoxTab] = useState<BoxTab>("ALL");
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const NATURE_OPTIONS: NatureId[] = [
    "HARDY","LONELY","BRAVE","ADAMANT","NAUGHTY",
    "BOLD","DOCILE","RELAXED","IMPISH","LAX",
    "TIMID","HASTY","SERIOUS","JOLLY","NAIVE",
    "MODEST","MILD","QUIET","BASHFUL","RASH",
    "CALM","GENTLE","SASSY","CAREFUL","QUIRKY",
  ];

  function updateBoxMon(boxId: string, patch: Partial<BoxMon>) {
    props.setBox(props.box.map((b) => (b.boxId === boxId ? { ...b, ...patch } : b)));
  }

  function clampIV(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(31, n));
  }

  const speciesById = useMemo(() => {
    const m = new Map<number, Species>();
    for (const s of speciesList) m.set(s.ID, s);
    return m;
  }, []);

  function rarityForDexId(dexId: number): RarityTier {
    const s = speciesById.get(dexId);
    if (!s) return "NORMAL";
    if (isLegendary(s)) return "LEGENDARY";
    if (isSubLegendary(s)) return "SUB_LEGENDARY";
    return "NORMAL";
  }

  function addBaseToBox(dexId: number) {
    const entry: BoxMon = {
      boxId: newBoxId(),
      kind: "BASE",
      dexId,
      rarityTier: rarityForDexId(dexId),
      abilityId: UNDEFINED_ABILITY,
      moveset: [],
      nature: DEFAULT_NATURE,
      ivs: { ...DEFAULT_IVS },
    };
    props.setBox([...props.box, entry]);
  }


  const shownBox = useMemo(() => {
    switch (boxTab) {
      case "BASE":
        return props.box.filter((b) => b.kind === "BASE");
      case "FUSED":
        return props.box.filter((b) => b.kind === "FUSION");
      default:
        return props.box;
    }
  }, [props.box, boxTab]);

  const selectedBoxMon = activeBoxId
    ? props.box.find((b) => b.boxId === activeBoxId) ?? null
    : null;

  function titleForBoxMon(b: BoxMon): string {
    if (b.kind === "BASE") {
      const s = speciesById.get(b.dexId);
      return s ? `#${b.dexId} ${s.Name}` : `BASE #${b.dexId}`;
    }
    const head = speciesById.get(b.headDexId);
    const body = speciesById.get(b.bodyDexId);
    const headName = head ? head.Name : `#${b.headDexId}`;
    const bodyName = body ? body.Name : `#${b.bodyDexId}`;
    return `FUSION ${b.headDexId}.${b.bodyDexId} (${headName} → ${bodyName})`;
  }

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "280px 1fr 360px",
      }}
    >
      {/* Left panel Dex with "add to box" */}
    <aside
      style={{
        borderRight: "1px solid #eee",
        padding: 12,
        overflow: "auto",
      }}
    >
      <Pokedex
        variant="panel"
        applyFilters={props.filterTarget === "pokedex"}
        onAddToBox={addBaseToBox}
        filterTarget={props.filterTarget}
        setFilterTarget={props.setFilterTarget}
        nameQuery={props.nameQuery}
        setNameQuery={props.setNameQuery}
        typeA={props.typeA}
        setTypeA={props.setTypeA}
        typeB={props.typeB}
        setTypeB={props.setTypeB}
        abilityText={props.abilityText}
        setAbilityText={props.setAbilityText}
        moveText={props.moveText}
        setMoveText={props.setMoveText}
        sortBy={props.sortBy}
        setSortBy={props.setSortBy}
        sortDir={props.sortDir}
        setSortDir={props.setSortDir}
        excludeLegendary={props.excludeLegendary}
        setExcludeLegendary={props.setExcludeLegendary}
        excludeSubLegendary={props.excludeSubLegendary}
        setExcludeSubLegendary={props.setExcludeSubLegendary}
      />
    </aside>

      {/* Middle panel: Box */}
      <main style={{ padding: 12, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ margin: 0 }}>Box</h2>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            stored entries: <b>{props.box.length}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <TabButton active={boxTab === "ALL"} onClick={() => setBoxTab("ALL")}>
            All
          </TabButton>
          <TabButton active={boxTab === "BASE"} onClick={() => setBoxTab("BASE")}>
            Base
          </TabButton>
          <TabButton active={boxTab === "FUSED"} onClick={() => setBoxTab("FUSED")}>
            Fused
          </TabButton>

          <div style={{ flex: 1 }} />

          <button type="button" onClick={() => props.setBox([])}>
            Clear box
          </button>

          {/* Keep a simple test add for now */}
          <button type="button" onClick={() => addBaseToBox(1)}>
            + Add Bulbasaur
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {shownBox.length === 0 ? (
            <div style={{ opacity: 0.7 }}>Nothing in this tab.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 72px)",
                gap: 10,
                alignItems: "start",
              }}
            >
              {shownBox.map((b) => {
                const selected = activeBoxId === b.boxId;

                const headId = b.kind === "BASE" ? b.dexId : b.headDexId;
                const bodyId = b.kind === "BASE" ? b.dexId : b.bodyDexId;

                return (
                  <button
                    key={b.boxId}
                    type="button"
                    onClick={() => setActiveBoxId(b.boxId)}
                    title={titleForBoxMon(b)}
                    style={{
                      padding: 0,
                      border: selected ? "2px solid #111" : "1px solid #ddd",
                      borderRadius: 14,
                      background: "white",
                      cursor: "pointer",
                      width: 72,
                      height: 72,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <SpriteTile headId={headId} bodyId={bodyId} size={64} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Right panel placeholder (Info panel comes after Dex) */}
      <aside
        style={{
          borderLeft: "1px solid #eee",
          padding: 12,
          overflow: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Info</h3>

        {!selectedBoxMon ? (
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Select a Pokémon in the Box to edit Nature + IVs.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Editing: <b>{selectedBoxMon.boxId}</b>
            </div>

            {/* Nature */}
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Nature</div>
              <select
                value={selectedBoxMon.nature}
                onChange={(e) =>
                  updateBoxMon(selectedBoxMon.boxId, { nature: e.target.value as NatureId })
                }
                style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
              >
                {NATURE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* IVs */}
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>IVs (0–31)</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(
                  [
                    ["hp", "HP"],
                    ["atk", "Atk"],
                    ["def", "Def"],
                    ["spa", "SpA"],
                    ["spd", "SpD"],
                    ["spe", "Spe"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 1fr",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ opacity: 0.8 }}>{label}</span>
                    <input
                      type="number"
                      min={0}
                      max={31}
                      value={selectedBoxMon.ivs[key]}
                      onChange={(e) => {
                        const next = clampIV(Number(e.target.value));
                        updateBoxMon(selectedBoxMon.boxId, {
                          ivs: { ...selectedBoxMon.ivs, [key]: next },
                        });
                      }}
                      style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

    </div>
  );
}
