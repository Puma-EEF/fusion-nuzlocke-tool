import { useMemo, useState } from "react";

import speciesRaw from "../data/species.json";
import movesRaw from "../data/moves.json";
import learnsetsRaw from "../data/learnsets.json";

import type { Species } from "../lib/types/species";
import type { Move } from "../lib/types/moves";
import type { Learnset } from "../lib/types/learnset";

import { fuseLearnset, fuseLearnsetByInternalName } from "../lib/fusion";
import { LevelUpList, MoveList } from "../components/moves/MoveSections";

const speciesList = speciesRaw as Species[];
const movesList = movesRaw as Move[];
const learnsetsList = learnsetsRaw as Learnset[];

const learnsetsByInternal = new Map<string, Learnset>(
  learnsetsList.map((l) => [l.InternalName, l])
);

const movesByInternal = new Map<string, Move>(
  movesList.map((m) => [m.InternalName, m])
);

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export default function DebugMoves() {
  const [headInternal, setHeadInternal] = useState<string>(
    speciesList[0]?.InternalName ?? "BULBASAUR"
  );
  const [bodyInternal, setBodyInternal] = useState<string>(
    speciesList[1]?.InternalName ?? "IVYSAUR"
  );

  const head = useMemo(
    () =>
      speciesList.find((s) => s.InternalName === headInternal) ??
      speciesList[0],
    [headInternal]
  );

  const body = useMemo(
    () =>
      speciesList.find((s) => s.InternalName === bodyInternal) ??
      speciesList[1],
    [bodyInternal]
  );

  // Normalize base mon into the same shape as fusion learnset (union with null)
  const baseNormalized = useMemo(() => {
    const headLs = learnsetsByInternal.get(head.InternalName) ?? null;
    return fuseLearnset(headLs, null);
  }, [head.InternalName]);

  const fused = useMemo(() => {
    return fuseLearnsetByInternalName(
      head.InternalName,
      body.InternalName,
      learnsetsByInternal
    );
  }, [head.InternalName, body.InternalName]);

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Debug: Learnsets</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 700 }}>Head (Base)</div>
          <select value={headInternal} onChange={(e) => setHeadInternal(e.target.value)}>
            {speciesList.slice(0, 600).map((s) => (
              <option key={s.InternalName} value={s.InternalName}>
                {s.Name} ({s.InternalName})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 700 }}>Body (Fusion)</div>
          <select value={bodyInternal} onChange={(e) => setBodyInternal(e.target.value)}>
            {speciesList.slice(0, 600).map((s) => (
              <option key={s.InternalName} value={s.InternalName}>
                {s.Name} ({s.InternalName})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Section title={`Base Learnset: ${head.Name}`}>
          <div style={{ marginBottom: 8, opacity: 0.8 }}>
            Unique moves: <b>{baseNormalized.allMoves.length}</b>
          </div>

          <LevelUpList
            title="Level-up"
            items={baseNormalized.levelUp}
            movesByInternal={movesByInternal}
            defaultOpen
          />

          <MoveList title="TM" moves={baseNormalized.tm} movesByInternal={movesByInternal} />
          <MoveList title="HM" moves={baseNormalized.hm} movesByInternal={movesByInternal} />
          <MoveList title="Tutor" moves={baseNormalized.tutor} movesByInternal={movesByInternal} />
          <MoveList title="Egg" moves={baseNormalized.egg} movesByInternal={movesByInternal} />
        </Section>

        <Section title={`Fusion Learnset: ${head.Name} + ${body.Name}`}>
          <div style={{ marginBottom: 8, opacity: 0.8 }}>
            Unique moves: <b>{fused.allMoves.length}</b>
          </div>

          <LevelUpList
            title="Level-up"
            items={fused.levelUp}
            movesByInternal={movesByInternal}
            defaultOpen
          />

          <MoveList title="TM" moves={fused.tm} movesByInternal={movesByInternal} />
          <MoveList title="HM" moves={fused.hm} movesByInternal={movesByInternal} />
          <MoveList title="Tutor" moves={fused.tutor} movesByInternal={movesByInternal} />
          <MoveList title="Egg" moves={fused.egg} movesByInternal={movesByInternal} />
        </Section>
      </div>
    </div>
  );
}
