/**
 * CompareTab (LATER)
 *
 * Role
 * - Compares TWO selected Pokemon (cap = 2).
 *
 * LOCKED behavior
 * - Cap = 2.
 * - When full: ignore additional clicks (NO FIFO replacement).
 * - No toggle-remove on re-click (remove via chips/buttons).
 *
 * Planned output (post-V1)
 * - Side-by-side stats, typing, weaknesses, learnsets, and key differences.
 */

import type { BoxMon } from "../../../lib/types/box";
import type { MonRef } from "./tabTypes";

type CompareTabProps = {
  selections: MonRef[];
  box: BoxMon[];
};

export function CompareTab({ selections }: CompareTabProps) {
  if (selections.length < 2) {
    return (
      <div style={{ padding: "12px", opacity: 0.7, fontSize: "14px" }}>
        <p>Select 2 Pokemon to compare.</p>
        <p style={{ fontSize: "12px" }}>
          Current selections: {selections.length}/2
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      <h4 style={{ marginTop: 0 }}>Compare</h4>
      <div style={{ opacity: 0.7, fontSize: "13px" }}>
        <p>TODO: Side-by-side comparison of:</p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Base stats</li>
          <li>Typing</li>
          <li>Weaknesses / Resistances</li>
          <li>Learnsets</li>
          <li>Key differences</li>
        </ul>
      </div>
    </div>
  );
}

