import { useMemo, useState } from "react";

import type { SortBy, SortDir } from "../lib/types/pokedexFilters";
import type { BoxMon, RarityTier } from "../lib/types/box";
import { UNDEFINED_ABILITY } from "../lib/types/box";
import { newBoxId } from "../lib/boxStorage";

import speciesRaw from "../data/species.json";
import type { Species } from "../lib/types/species";
import { isLegendary, isSubLegendary } from "../lib/legendary";

import SpriteTile from "../components/SpriteTile";

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
      {/* Left panel placeholder (Dex panel comes next step) */}
      <aside
        style={{
          borderRight: "1px solid #eee",
          padding: 12,
          overflow: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Pokédex (next)</h3>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          We’ll plug in Pokedex list + “+ add to box” here next.
        </div>
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
        <h3 style={{ marginTop: 0 }}>Info (next)</h3>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Next we’ll build the tabs + locked selection-engine caps here.
        </div>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
          Current selection (temporary):{" "}
          <b>{activeBoxId ? activeBoxId : "none"}</b>
        </div>
      </aside>
    </div>
  );
}
