import { useState } from "react";
import type { Move } from "../../lib/types/moves";

type Props = {
  move: Move;
  prefix?: string; // e.g. "Lv 12:"
  compact?: boolean;
};

function stat(v: number | string | null | undefined) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string" && v.trim() === "") return "—";
  return String(v);
}

export default function MoveRowHover({ move, prefix, compact }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: compact ? "2px 0" : "4px 0",
          cursor: "default",
        }}
      >
        {prefix && (
          <span style={{ opacity: 0.7, fontVariantNumeric: "tabular-nums" }}>
            {prefix}
          </span>
        )}
        <span style={{ fontWeight: 800 }}>{move.Name}</span>
        <span style={{ opacity: 0.7 }}>
          {move.Type} • {move.Category}
        </span>
      </div>

      {hover && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            left: 0,
            top: "100%",
            marginTop: 6,
            minWidth: 320,
            maxWidth: 520,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>{move.Name}</div>

          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 6 }}>
            <div style={{ opacity: 0.75, fontWeight: 800 }}>Type</div>
            <div>{move.Type}</div>

            <div style={{ opacity: 0.75, fontWeight: 800 }}>Category</div>
            <div>{move.Category}</div>

            <div style={{ opacity: 0.75, fontWeight: 800 }}>Power</div>
            <div>{stat((move as any).Power)}</div>

            <div style={{ opacity: 0.75, fontWeight: 800 }}>Accuracy</div>
            <div>{stat((move as any).Accuracy)}</div>

            <div style={{ opacity: 0.75, fontWeight: 800 }}>PP</div>
            <div>{stat((move as any).PP)}</div>
          </div>

          {(move as any).Description && (
            <div style={{ marginTop: 8, opacity: 0.9 }}>
              {(move as any).Description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
