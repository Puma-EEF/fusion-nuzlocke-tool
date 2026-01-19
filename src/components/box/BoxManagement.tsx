/**
 * BoxManagement (CONTROLLER) — LOCKED PLAN
 *
 * Goal
 * - This module is the single source of truth for the "selected pokemon" system.
 * - It owns: active tool/tab, per-tab selections, selection rules, messages, and tab rendering.
 *
 * What this file DOES
 * - Holds reducer/state:
 *   - activeTool: which Info tab is currently active
 *   - selections: Record<Tool, MonRef[]> (each tab remembers its own picks)
 *   - message: quick messages (V1: only Set Moninfo dex rejection message)
 * - Exposes stable callbacks to the view layer:
 *   - applyRefClick(ref: MonRef)  // used for forwarded clicks from BoxTeamPage
 *   - removeRef(tool, ref)        // chip removal
 *   - setTool(tool)               // tab switching
 * - Renders the 5 tabs (Stats / Set Moninfo / Fusion / Compare / Team)
 * - Renders a selection bar (chips) and a debug panel.
 *
 * What this file does NOT do
 * - It does NOT render the left (Pokedex) or middle (Box list) panels.
 * - It does NOT own layout outside the Info panel.
 *
 * Inputs / wiring (how BoxTeamPage interacts)
 * - BoxTeamPage remains a skeleton:
 *   - left panel: Pokedex UI (view + filtering)
 *   - middle panel: Box UI (tabs, add/remove)
 *   - right panel: BoxManagement UI
 * - BoxTeamPage forwards click events as MonRefs:
 *   - Pokedex click => dex:<dexKey>
 *   - Box click    => box:<boxId>
 *
 * LOCKED RULES (from alignment)
 * - Selections:
 *   - Can reference both Dex and Box, EXCEPT Set Moninfo which is Box-only.
 * - No auto-create BoxMon on Dex selection.
 * - Persistence:
 *   - Per-tab selections persist across tab switching.
 *   - Selection persists across pages (BoxManagement state must live at a persistent level, e.g. App/page state).
 *
 * - Capacities:
 *   - Stats: 1
 *   - Set Moninfo: 1
 *   - Fusion: 2
 *   - Compare: 2
 *   - Team: 6
 *
 * - When capacity reached: IGNORE clicks (no FIFO replacement, no hint/toast for now).
 *
 * - Toggle-remove on re-click:
 *   - Only Stats and Set Moninfo
 *   - (Fusion/Compare/Team require explicit removal via chips/buttons)
 *
 * - Dex vs Box:
 *   - Stats accepts dex:* and box:*
 *   - Set Moninfo rejects dex:* with message: "you can only edit boxMon"
 *
 * V1 scope order
 * 1) StatsTab (view-only)
 * 2) SetMoninfoTab (edit box: IV/Nature first, then Ability/Moveset/Evolution)
 * 3) FusionTab (preview + add to box)
 * 4) Compare/Team after V1 stabilizes
 *
 * Debug expectations (development only)
 * - Show activeTool, selections per tool, last forwarded click (if applicable), and current message.
 *
 * Known temporary pieces
 * - BoxTeamPage may still have activeBoxId for highlighting only (TEMP).
 *   - Long-term selection truth belongs here.
 */

import { useReducer, useEffect, useCallback } from "react";
import type { BoxMon } from "../../lib/types/box";
import type { MonRef, Tool } from "./Tabs/tabTypes";
import { parseMonRef } from "./Tabs/tabTypes";
import { StatsTab } from "./Tabs/StatsTab";
import { SetMoninfoTab } from "./Tabs/SetMoninfoTab";
import { FusionTab } from "./Tabs/FusionTab";
import { CompareTab } from "./Tabs/CompareTab";
import { TeamTab } from "./Tabs/TeamTab";

// ============================================================================
// Types & Constants
// ============================================================================

type State = {
  activeTool: Tool;
  selections: Record<Tool, MonRef[]>;
  message: string;
};

type Action =
  | { type: "SET_TOOL"; tool: Tool }
  | { type: "APPLY_CLICK"; ref: MonRef }
  | { type: "REMOVE_REF"; tool: Tool; ref: MonRef }
  | { type: "SET_MESSAGE"; message: string };

const TOOL_CAPACITIES: Record<Tool, number> = {
  Stats: 1,
  "Set Moninfo": 1,
  Fusion: 2,
  Compare: 2,
  Team: 6,
};

const TOGGLE_REMOVE_TOOLS: Tool[] = ["Stats", "Set Moninfo"];

// ============================================================================
// Reducer
// ============================================================================

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, activeTool: action.tool, message: "" };

    case "APPLY_CLICK": {
      const { ref } = action;
      const tool = state.activeTool;
      const currentSelections = state.selections[tool];
      const capacity = TOOL_CAPACITIES[tool];
      const parsed = parseMonRef(ref);

      // Special case: Set Moninfo rejects dex references
      if (tool === "Set Moninfo" && parsed.type === "dex") {
        return { ...state, message: "you can only edit boxMon" };
      }

      // Clear message on valid interaction
      let nextMessage = "";

      // Check if this ref is already selected
      const alreadySelected = currentSelections.includes(ref);

      // Toggle-remove logic (only Stats and Set Moninfo)
      if (alreadySelected && TOGGLE_REMOVE_TOOLS.includes(tool)) {
        return {
          ...state,
          selections: {
            ...state.selections,
            [tool]: currentSelections.filter((r) => r !== ref),
          },
          message: nextMessage,
        };
      }

      // If already selected and NOT a toggle-remove tool, ignore
      if (alreadySelected) {
        return state;
      }

      // If capacity reached, ignore new clicks
      if (currentSelections.length >= capacity) {
        return state;
      }

      // Add the new selection
      return {
        ...state,
        selections: {
          ...state.selections,
          [tool]: [...currentSelections, ref],
        },
        message: nextMessage,
      };
    }

    case "REMOVE_REF": {
      const { tool, ref } = action;
      return {
        ...state,
        selections: {
          ...state.selections,
          [tool]: state.selections[tool].filter((r) => r !== ref),
        },
      };
    }

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    default:
      return state;
  }
}

// ============================================================================
// Component
// ============================================================================

type BoxManagementProps = {
  box: BoxMon[];
  setBox: (box: BoxMon[]) => void;
  forwardedClick: { ref: MonRef; nonce: number } | null;
};

export function BoxManagement({ box, setBox, forwardedClick }: BoxManagementProps) {
  const [state, dispatch] = useReducer(reducer, {
    activeTool: "Stats",
    selections: {
      Stats: [],
      "Set Moninfo": [],
      Fusion: [],
      Compare: [],
      Team: [],
    },
    message: "",
  });

  // Handle forwarded clicks from BoxTeamPage
  useEffect(() => {
    if (forwardedClick) {
      dispatch({ type: "APPLY_CLICK", ref: forwardedClick.ref });
    }
  }, [forwardedClick?.nonce]);

  const removeRef = useCallback((tool: Tool, ref: MonRef) => {
    dispatch({ type: "REMOVE_REF", tool, ref });
  }, []);

  const setTool = useCallback((tool: Tool) => {
    dispatch({ type: "SET_TOOL", tool });
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  const currentSelections = state.selections[state.activeTool];

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {(["Stats", "Set Moninfo", "Fusion", "Compare", "Team"] as Tool[]).map((tool) => (
          <button
            key={tool}
            type="button"
            onClick={() => setTool(tool)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: state.activeTool === tool ? "2px solid #111" : "1px solid #ddd",
              background: state.activeTool === tool ? "#111" : "white",
              color: state.activeTool === tool ? "white" : "#111",
              cursor: "pointer",
              fontWeight: state.activeTool === tool ? 700 : 400,
              fontSize: "12px",
            }}
          >
            {tool}
          </button>
        ))}
      </div>

      {/* Message display */}
      {state.message && (
        <div
          style={{
            padding: "8px 12px",
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#856404",
          }}
        >
          {state.message}
        </div>
      )}

      {/* Selection chips */}
      {currentSelections.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {currentSelections.map((ref) => {
            const parsed = parseMonRef(ref);
            const label = parsed.type === "dex" ? `Dex #${parsed.id}` : `Box ${parsed.id.slice(0, 6)}`;
            return (
              <div
                key={ref}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  background: "#e9ecef",
                  border: "1px solid #adb5bd",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => removeRef(state.activeTool, ref)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 2px",
                    fontSize: "14px",
                    lineHeight: "1",
                    color: "#495057",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Active tab content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {state.activeTool === "Stats" && (
          <StatsTab selections={currentSelections} box={box} />
        )}
        {state.activeTool === "Set Moninfo" && (
          <SetMoninfoTab selections={currentSelections} box={box} setBox={setBox} />
        )}
        {state.activeTool === "Fusion" && (
          <FusionTab selections={currentSelections} box={box} setBox={setBox} />
        )}
        {state.activeTool === "Compare" && (
          <CompareTab selections={currentSelections} box={box} />
        )}
        {state.activeTool === "Team" && (
          <TeamTab selections={currentSelections} box={box} />
        )}
      </div>

      {/* Debug panel */}
      {import.meta.env.DEV && (
        <details style={{ fontSize: "11px", opacity: 0.7, marginTop: "12px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Debug</summary>
          <pre style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              {
                activeTool: state.activeTool,
                selections: state.selections,
                message: state.message,
                lastForwardedClick: forwardedClick,
              },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
}

