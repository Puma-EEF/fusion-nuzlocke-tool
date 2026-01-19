/**
 * SetMoninfoTab (EDIT BOX ONLY)
 *
 * Role
 * - Edits a SINGLE selected BoxMon (cap = 1).
 * - This is the "treat selected pokemon" tool for: IVs, Nature, Ability, Moveset, Evolution.
 *
 * LOCKED behavior
 * - Cap = 1. New valid selection replaces the previous.
 * - Toggle-remove enabled:
 *   - Clicking the same selected BoxMon again removes selection.
 * - Dex selections are NOT allowed here:
 *   - If user clicks a Dex mon while this tab is active, show message:
 *     "you can only edit boxMon"
 *
 * Edit rules (V1)
 * - BASE BoxMon:
 *   - Evolution edits update dexId.
 * - FUSION BoxMon:
 *   - Evolution edits update headDexId and/or bodyDexId (UI decides how to choose which half).
 *
 * Future note
 * - Later we may add "evolve/devolve preview" in Pokedex, but Set Moninfo performs real box updates.
 */

import type { BoxMon } from "../../../lib/types/box";
import type { MonRef } from "./tabTypes";
import { parseMonRef } from "./tabTypes";

type SetMoninfoTabProps = {
  selections: MonRef[];
  box: BoxMon[];
  setBox: (box: BoxMon[]) => void;
};

export function SetMoninfoTab({ selections, box, setBox }: SetMoninfoTabProps) {
  if (selections.length === 0) {
    return (
      <div style={{ padding: "12px", opacity: 0.7, fontSize: "14px" }}>
        Select a BoxMon to edit its IVs, Nature, Ability, Moveset, or Evolution.
      </div>
    );
  }

  const ref = selections[0];
  const parsed = parseMonRef(ref);

  // This should be prevented by the reducer, but handle gracefully
  if (parsed.type === "dex") {
    return (
      <div style={{ padding: "12px", color: "#dc3545" }}>
        Cannot edit Pokedex entries. Please select a BoxMon.
      </div>
    );
  }

  const boxMon = box.find((b) => b.boxId === parsed.id);
  if (!boxMon) {
    return (
      <div style={{ padding: "12px", color: "#dc3545" }}>
        Box mon not found: {parsed.id}
      </div>
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      <h4 style={{ marginTop: 0 }}>
        Edit: {boxMon.kind === "BASE" ? `BASE #${boxMon.dexId}` : `FUSION ${boxMon.headDexId}.${boxMon.bodyDexId}`}
      </h4>
      <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <strong>Current Nature:</strong> {boxMon.nature}
          <br />
          <em style={{ opacity: 0.7 }}>TODO: Nature selector</em>
        </div>
        
        <div>
          <strong>Current IVs:</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "4px" }}>
            {Object.entries(boxMon.ivs).map(([stat, value]) => (
              <div key={stat}>
                {stat.toUpperCase()}: {value}
              </div>
            ))}
          </div>
          <em style={{ opacity: 0.7 }}>TODO: IV editors (0-31)</em>
        </div>

        <div>
          <strong>Current Ability:</strong> {boxMon.abilityId}
          <br />
          <em style={{ opacity: 0.7 }}>TODO: Ability selector</em>
        </div>

        <div>
          <strong>Current Moveset:</strong>
          {boxMon.moveset && boxMon.moveset.length > 0 ? (
            <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
              {boxMon.moveset.map((move, idx) => (
                <li key={idx}>{move}</li>
              ))}
            </ul>
          ) : (
            <span> (none)</span>
          )}
          <em style={{ opacity: 0.7 }}>TODO: Moveset editor (up to 4)</em>
        </div>

        <div>
          <strong>Evolution:</strong>
          <br />
          <em style={{ opacity: 0.7 }}>TODO: Evolution selector (updates dexId for BASE, headDexId/bodyDexId for FUSION)</em>
        </div>
      </div>
    </div>
  );
}

