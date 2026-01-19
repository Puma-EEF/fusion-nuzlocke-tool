/**
 * FusionTab (PREVIEW / CREATE)
 *
 * Role
 * - Uses TWO selected Pokemon (cap = 2) to preview fusion results.
 * - Selection may be Dex refs, Box refs, or a mix (both are view sources).
 *
 * LOCKED behavior
 * - Cap = 2.
 * - When full: ignore additional clicks (NO FIFO replacement).
 * - No toggle-remove on re-click (remove is via chips/buttons).
 *
 * V1 output expectations
 * - When 2 are selected:
 *   - Show fusion preview(s) based on your rules (likely AB and BA variants later).
 *   - Provide "Add to box" actions (creating new BoxMon entries).
 * - When fewer than 2 selected:
 *   - Show instruction UI ("Select 2 Pokemon to fuse").
 *
 * Data notes
 * - Fusion preview should not mutate box until user confirms "Add to box".
 */

import type { BoxMon } from "../../../lib/types/box";
import type { MonRef } from "./tabTypes";
import { parseMonRef } from "./tabTypes";

type FusionTabProps = {
  selections: MonRef[];
  box: BoxMon[];
  setBox: (box: BoxMon[]) => void;
};

export function FusionTab({ selections, box, setBox }: FusionTabProps) {
  if (selections.length < 2) {
    return (
      <div style={{ padding: "12px", opacity: 0.7, fontSize: "14px" }}>
        <p>Select 2 Pokemon to fuse.</p>
        <p style={{ fontSize: "12px" }}>
          Current selections: {selections.length}/2
        </p>
      </div>
    );
  }

  const ref1 = selections[0];
  const ref2 = selections[1];
  const parsed1 = parseMonRef(ref1);
  const parsed2 = parseMonRef(ref2);

  // Get dex IDs from selections
  let dexId1: number | null = null;
  let dexId2: number | null = null;

  if (parsed1.type === "dex") {
    dexId1 = parseInt(parsed1.id, 10);
  } else {
    const boxMon = box.find((b) => b.boxId === parsed1.id);
    if (boxMon) {
      dexId1 = boxMon.kind === "BASE" ? boxMon.dexId : boxMon.headDexId;
    }
  }

  if (parsed2.type === "dex") {
    dexId2 = parseInt(parsed2.id, 10);
  } else {
    const boxMon = box.find((b) => b.boxId === parsed2.id);
    if (boxMon) {
      dexId2 = boxMon.kind === "BASE" ? boxMon.dexId : boxMon.headDexId;
    }
  }

  if (!dexId1 || !dexId2) {
    return (
      <div style={{ padding: "12px", color: "#dc3545" }}>
        Could not resolve Dex IDs from selections.
      </div>
    );
  }

  const handleAddFusion = () => {
    // TODO: Create fusion BoxMon and add to box
    alert(`TODO: Add fusion of ${dexId1} + ${dexId2} to box`);
  };

  return (
    <div style={{ padding: "12px" }}>
      <h4 style={{ marginTop: 0 }}>Fusion Preview</h4>
      <div style={{ fontSize: "13px", marginBottom: "12px" }}>
        <p><strong>Head:</strong> #{dexId1}</p>
        <p><strong>Body:</strong> #{dexId2}</p>
      </div>
      
      <div style={{ marginTop: "16px", opacity: 0.7, fontSize: "13px" }}>
        <p>TODO: Show fusion preview with:</p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Combined sprite</li>
          <li>Fused stats</li>
          <li>Combined typing</li>
          <li>Available abilities</li>
          <li>Combined move pool</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={handleAddFusion}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Add to Box
      </button>
    </div>
  );
}

