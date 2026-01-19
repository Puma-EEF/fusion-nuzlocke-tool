/**
 * StatsTab (VIEW-ONLY)
 *
 * Role
 * - Displays information for a SINGLE selected Pokemon (cap = 1).
 * - Accepts both Dex selections ("dex:...") and Box selections ("box:...").
 *
 * LOCKED behavior
 * - Cap = 1. Any new selection replaces the previous selection.
 * - Toggle-remove is enabled in this tab:
 *   - Clicking the already-selected mon again removes it.
 * - No editing occurs here (Dex is always view-only; Box is view-only in Stats too).
 *
 * V1 output expectations
 * - Show a basic summary (name/species, typing, BST, weaknesses/resistances, learnset preview).
 * - If selection is a fusion (box kind FUSION), show fused stats/typing based on your fusion rules.
 *
*/

import type { BoxMon } from "../../../lib/types/box";
import type { MonRef } from "./tabTypes";
import { parseMonRef } from "./tabTypes";

type StatsTabProps = {
  selections: MonRef[];
  box: BoxMon[];
};

export function StatsTab({ selections, box }: StatsTabProps) {
  if (selections.length === 0) {
    return (
      <div style={{ padding: "12px", opacity: 0.7, fontSize: "14px" }}>
        Select a Pokemon from the Pokedex or Box to view its stats.
      </div>
    );
  }

  const ref = selections[0];
  const parsed = parseMonRef(ref);

  if (parsed.type === "dex") {
    return (
      <div style={{ padding: "12px" }}>
        <h4 style={{ marginTop: 0 }}>Pokedex Entry #{parsed.id}</h4>
        <div style={{ fontSize: "13px", opacity: 0.7 }}>
          <p>View-only stats for Dex entry.</p>
          <p>TODO: Show species info, typing, BST, weaknesses, learnset preview.</p>
        </div>
      </div>
    );
  }

  // Box reference
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
        {boxMon.kind === "BASE" ? `BASE #${boxMon.dexId}` : `FUSION ${boxMon.headDexId}.${boxMon.bodyDexId}`}
      </h4>
      <div style={{ fontSize: "13px" }}>
        <p><strong>Kind:</strong> {boxMon.kind}</p>
        <p><strong>Rarity:</strong> {boxMon.rarityTier}</p>
        <p><strong>Nature:</strong> {boxMon.nature}</p>
        <p><strong>Ability:</strong> {boxMon.abilityId}</p>
        <p><strong>IVs:</strong> HP: {boxMon.ivs.hp}, ATK: {boxMon.ivs.atk}, DEF: {boxMon.ivs.def}, SPA: {boxMon.ivs.spa}, SPD: {boxMon.ivs.spd}, SPE: {boxMon.ivs.spe}</p>
        {boxMon.moveset && boxMon.moveset.length > 0 && (
          <p><strong>Moves:</strong> {boxMon.moveset.join(", ")}</p>
        )}
        <div style={{ marginTop: "12px", opacity: 0.7 }}>
          TODO: Show calculated stats, typing, weaknesses, full learnset.
        </div>
      </div>
    </div>
  );
}

