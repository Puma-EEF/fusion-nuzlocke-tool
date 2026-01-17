import type { Move } from "../../lib/types/moves";
import MoveRowHover from "./MoveRowHover";

type MovesByInternal = Map<string, Move>;

export function MoveList({
  title,
  moves,
  movesByInternal,
  defaultOpen = false,
}: {
  title: string;
  moves: string[];
  movesByInternal: MovesByInternal;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} style={{ marginTop: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>
        {title} ({moves.length})
      </summary>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {moves.map((internal) => {
          const mv = movesByInternal.get(internal);
          if (!mv) return null;
          return <MoveRowHover key={internal} move={mv} compact />;
        })}
      </div>
    </details>
  );
}

export function LevelUpList({
  title,
  items,
  movesByInternal,
  defaultOpen = true,
}: {
  title: string;
  items: Array<{ level: number; move: string }>;
  movesByInternal: MovesByInternal;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} style={{ marginTop: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>
        {title} ({items.length})
      </summary>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((m) => {
          const mv = movesByInternal.get(m.move);
          if (!mv) return null;
          return (
            <MoveRowHover
              key={`${m.level}-${m.move}`}
              move={mv}
              prefix={`Lv ${m.level}:`}
              compact
            />
          );
        })}
      </div>
    </details>
  );
}
