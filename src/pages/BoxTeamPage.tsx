import type { SortBy, SortDir } from "../lib/types/pokedexFilters";

type FilterTarget = "pokedex" | "box";

type BoxTeamPageProps = {
  filterTarget: FilterTarget;
  setFilterTarget: (t: FilterTarget) => void;

  boxIds: number[];
  setBoxIds: (v: number[]) => void;

  // same filter props Pokedex already uses
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
};

export default function BoxTeamPage(props: BoxTeamPageProps) {
  // TODO: Implement actual filtering logic
  const filteredDex: string[] = [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 3-panel layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr 380px",
          gap: 12,
          padding: 12,
          height: "100%",
          minHeight: 0,
        }}
      >
        {/* POKEDEX */}
        <Panel title="Pokedex">
          <SmallHint>
            Filters apply only when target is “Pokedex”. (When target is “Box”, dex shows unfiltered.)
          </SmallHint>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {filteredDex.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Panel>

        {/* BOX */}
        <Panel title="Box (Phase 3)">
          <SmallHint>Next: real Box list + drag/drop + party.</SmallHint>
          <div style={{ opacity: 0.7 }}><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
  <div style={{ opacity: 0.8 }}>Box size: {props.boxIds.length}</div>

  {props.boxIds.length === 0 ? (
    <div style={{ opacity: 0.7 }}>No Pokémon in box yet.</div>
  ) : (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {props.boxIds.map((id) => (
        <li key={id}>Dex ID: {id}</li>
      ))}
    </ul>
  )}
</div>
</div>
        </Panel>

        {/* INFO */}
        <Panel title="Info (Phase 4+)">
          <SmallHint>Later: Fusion / Stats / Team / Compare.</SmallHint>
          <div style={{ opacity: 0.7 }}>Select something later → show details here.</div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 12, overflow: "auto", minHeight: 0 }}>{children}</div>
    </section>
  );
}

function SmallHint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
      {children}
    </div>
  );
}
