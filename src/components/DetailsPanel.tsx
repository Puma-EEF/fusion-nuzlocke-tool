import SpriteTile from "./SpriteTile";
import type { NatureId, IVs } from "../lib/types/box";
import type { DetailsEditor, DetailsVM } from "../lib/details/detailsTypes";

const NATURE_OPTIONS: NatureId[] = [
  "HARDY","LONELY","BRAVE","ADAMANT","NAUGHTY",
  "BOLD","DOCILE","RELAXED","IMPISH","LAX",
  "TIMID","HASTY","SERIOUS","JOLLY","NAIVE",
  "MODEST","MILD","QUIET","BASHFUL","RASH",
  "CALM","GENTLE","SASSY","CAREFUL","QUIRKY",
];

function clampIV(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(31, n));
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12 }}>
      <span style={{ opacity: 0.8 }}>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function StatBlockView({
  title,
  stats,
}: {
  title: string;
  stats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number; bst: number };
}) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 4 }}>
        <StatRow label="HP" value={stats.hp} />
        <StatRow label="Atk" value={stats.atk} />
        <StatRow label="Def" value={stats.def} />
        <StatRow label="SpA" value={stats.spa} />
        <StatRow label="SpD" value={stats.spd} />
        <StatRow label="Spe" value={stats.spe} />
        <div style={{ height: 1, background: "#eee", margin: "6px 0" }} />
        <StatRow label="BST" value={stats.bst} />
      </div>
    </div>
  );
}

export default function DetailsPanel({
  vm,
  editor,
}: {
  vm: DetailsVM;
  editor?: DetailsEditor;
}) {
  const canEdit = editor?.canEdit === true;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, alignItems: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 14,
            border: "1px solid #ddd",
            display: "grid",
            placeItems: "center",
            background: "white",
          }}
        >
          <SpriteTile headId={vm.sprite.headId} bodyId={vm.sprite.bodyId} size={64} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.2 }}>{vm.title}</div>
          {vm.subtitle ? <div style={{ fontSize: 12, opacity: 0.75 }}>{vm.subtitle}</div> : null}
          <div style={{ fontSize: 12, marginTop: 4 }}>
            <b>{vm.typing.type1}</b>
            {vm.typing.type2 ? <> / <b>{vm.typing.type2}</b></> : null}
          </div>
        </div>
      </div>

      {/* Editor: only when Box/Team provides editor + vm has nature/ivs */}
      {canEdit && vm.nature && vm.ivs ? (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10, display: "grid", gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 900 }}>Nature & IVs</div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Nature</div>
            <select
              value={vm.nature}
              onChange={(e) => editor.setNature(e.target.value as NatureId)}
              style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
            >
              {NATURE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>IVs (0–31)</div>
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
                    gridTemplateColumns: "46px 1fr",
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
                    value={vm.ivs![key]}
                    onChange={(e) => editor.setIV(key as keyof IVs, clampIV(Number(e.target.value)))}
                    style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats */}
      <div style={{ display: "grid", gap: 10 }}>
        <StatBlockView title="Base stats" stats={vm.baseStats} />
        {vm.effectiveStats ? (
          <StatBlockView title="Effective stats (Lvl 50, IV + Nature)" stats={vm.effectiveStats} />
        ) : null}
      </div>
    </div>
  );
}
