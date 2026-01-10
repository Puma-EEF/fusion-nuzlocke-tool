import type { SortBy, SortDir } from "../lib/types/pokedexFilters";
import type { BoxMon } from "../lib/types/box";
import { newBoxId } from "../lib/boxStorage";


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

export default function BoxTeamPage(props: BoxTeamPageProps) {
  function addBaseToBox(dexId: number) {
    const entry = {
      boxId: newBoxId(),
      kind: "BASE" as const,
      dexId,
      rarityTier: "NORMAL" as const, // we’ll compute later
      abilityId: "UNDEFINED",
      moveset: [],
    };
    props.setBox([...props.box, entry]);
  }

  return (
    <div style={{ padding: 16, height: "100%", overflow: "auto" }}>
      <h2 style={{ marginTop: 0 }}>Box/Team (WIP)</h2>

      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Minimal placeholder: shows stored BoxMon entries and proves persistence works.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <strong>Stored box entries:</strong> {props.box.length}
        <button type="button" onClick={() => props.setBox([])}>
          Clear box
        </button>
      </div>
        <button
            type="button"
            onClick={() => {
                const newEntry = {
                boxId: newBoxId(),
                kind: "BASE" as const,
                dexId: 1, // Bulbasaur
                rarityTier: "NORMAL" as const,
                abilityId: "UNDEFINED",
                moveset: [],
                };

                props.setBox([...props.box, newEntry]);
            }}
        >
          <button type="button" onClick={() => addBaseToBox(1)}></button>
            + Add test Bulbasaur
        </button>


      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: "12px 0 8px" }}>Box (All)</h3>

        {props.box.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Your box is empty.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 8,
            }}
          >
            {props.box.map((m) => (
              <button
                key={m.boxId}
                type="button"
                style={{
                  textAlign: "left",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // for now: remove on click (easy test interaction)
                  props.setBox(props.box.filter((x) => x.boxId !== m.boxId));
                }}
                title="Click to remove (temporary)"
              >
                <div style={{ fontWeight: 700 }}>
                  {m.kind === "BASE"
                    ? `BASE #${m.dexId}`
                    : `FUSION ${m.headDexId}.${m.bodyDexId}`}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  ability: {m.abilityId}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  rarity: {m.rarityTier}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
