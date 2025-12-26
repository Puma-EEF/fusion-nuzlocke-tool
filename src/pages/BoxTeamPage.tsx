import { useMemo, useState } from "react";

type FilterTarget = "pokedex" | "box";

export default function BoxTeamPage() {
  // Phase 1: the key state — filters exist once, but apply to *one list at a time*
  const [filterTarget, setFilterTarget] = useState<FilterTarget>("pokedex");
  const [search, setSearch] = useState("");

  // Temporary mock lists so we can prove the toggle works BEFORE wiring real data
  const pokedexMock = useMemo(
    () => ["Bulbasaur", "Charmander", "Squirtle", "Pikachu", "Eevee"],
    []
  );
  const boxMock = useMemo(
    () => ["Geodude", "Gastly", "Magikarp", "Snorlax"],
    []
  );

  const filteredDex = useMemo(() => {
    if (filterTarget !== "pokedex") return pokedexMock; // filters not applied here
    const q = search.trim().toLowerCase();
    return q ? pokedexMock.filter((x) => x.toLowerCase().includes(q)) : pokedexMock;
  }, [filterTarget, search, pokedexMock]);

  const filteredBox = useMemo(() => {
    if (filterTarget !== "box") return boxMock; // filters not applied here
    const q = search.trim().toLowerCase();
    return q ? boxMock.filter((x) => x.toLowerCase().includes(q)) : boxMock;
  }, [filterTarget, search, boxMock]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* FILTER BAR (Shared) */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <strong style={{ whiteSpace: "nowrap" }}>Filters</strong>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search (temp)"
          style={{
            flex: 1,
            minWidth: 160,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "inherit",
          }}
        />

        {/* Apply-to toggle */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ opacity: 0.8, whiteSpace: "nowrap" }}>Apply to:</span>

          <TogglePill
            active={filterTarget === "pokedex"}
            onClick={() => setFilterTarget("pokedex")}
            label="Pokedex"
          />
          <TogglePill
            active={filterTarget === "box"}
            onClick={() => setFilterTarget("box")}
            label="Box"
          />
        </div>
      </div>

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
        {/* POKEDEX (collapsible later) */}
        <Panel title="Pokedex (Phase 2)">
          <SmallHint>
            Right now this is mocked — we just need to prove the filter target toggle works.
          </SmallHint>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {filteredDex.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Panel>

        {/* BOX */}
        <Panel title="Box (Phase 3)">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {filteredBox.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Panel>

        {/* INFO */}
        <Panel title="Info (Phase 4+)">
          <SmallHint>
            This will become Fusion / Stats / Team / Compare. For now: empty Snorlax placeholder.
          </SmallHint>
          <div style={{ opacity: 0.7 }}>Select something later → show details here.</div>
        </Panel>
      </div>
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.18)",
        background: active ? "rgba(255,255,255,0.16)" : "transparent",
        color: "inherit",
        cursor: "pointer",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
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
      <div style={{ padding: 12, overflow: "auto" }}>{children}</div>
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
