/**
 * TeamTab (LATER)
 *
 * Role
 * - Maintains a TEAM selection of up to SIX Pokemon (cap = 6).
 *
 * LOCKED behavior
 * - Cap = 6.
 * - When full: ignore additional clicks (NO FIFO replacement).
 * - No toggle-remove on re-click (remove via chips/buttons).
 *
 * Planned output (post-V1)
 * - Team list with ordering, role tags, and summaries.
 * - Potential export/import or run tracking integrations later.
 */

import type { BoxMon } from "../../../lib/types/box";
import type { MonRef } from "./tabTypes";

type TeamTabProps = {
  selections: MonRef[];
  box: BoxMon[];
};

export function TeamTab({ selections }: TeamTabProps) {
  return (
    <div style={{ padding: "12px" }}>
      <h4 style={{ marginTop: 0 }}>Team Builder</h4>
      <div style={{ fontSize: "13px" }}>
        <p>
          <strong>Team Size:</strong> {selections.length}/6
        </p>
        {selections.length === 0 ? (
          <div style={{ opacity: 0.7, marginTop: "12px" }}>
            Select up to 6 Pokemon for your team.
          </div>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <p><strong>Selected:</strong></p>
            <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
              {selections.map((ref, idx) => (
                <li key={ref}>
                  Slot {idx + 1}: {ref}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: "16px", opacity: 0.7 }}>
          <p>TODO: Team builder features:</p>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>Drag to reorder team members</li>
            <li>Type coverage analysis</li>
            <li>Role tags (Sweeper, Tank, Support, etc.)</li>
            <li>Team summary (combined weaknesses/resistances)</li>
            <li>Export/Import functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

