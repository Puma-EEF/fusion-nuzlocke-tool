/**
 * Pokedex Page Component
 * 
 * Comprehensive Pokemon browser with advanced filtering and detailed views.
 * 
 * Features:
 * - Browse all Pokemon with sprites
 * - Multi-criteria filtering (name, type, ability, move)
 * - Sort by any stat or BST
 * - Exclude legendary/sub-legendary Pokemon
 * - Expandable detail view for each Pokemon showing:
 *   - Complete base stats
 *   - All learnable moves by method (level-up, TM, tutor, egg)
 *   - All abilities including hidden abilities
 *   - Complete evolution chains
 * 
 * Data Processing Pipeline:
 * 1. Apply name/type/ability/move filters
 * 2. Apply legendary exclusions
 * 3. Sort by selected stat
 * 4. Render paginated grid with detail expansion
 * 
 * @module pages/Pokedex
 */

import { useMemo, useState } from "react";
import { createPokedexFilterEngine } from "../lib/pokedex/filterEngine";
import KeyValueRow from "../components/KeyValueRow";

import speciesRaw from "../data/species.json";
import movesRaw from "../data/moves.json";
import abilitiesRaw from "../data/abilities.json";
import learnsetsRaw from "../data/learnsets.json";

import type { Species } from "../lib/types/species";
import type { Move } from "../lib/types/moves";
import type { Ability } from "../lib/types/ability";
import type { Learnset } from "../lib/types/learnset";
import type { PokedexFiltersState } from "../lib/types/pokedexFilters";

import SpriteTile from "../components/SpriteTile";
import EvolutionLine from "../components/EvolutionLine";


const speciesList = speciesRaw as Species[];
const movesList = movesRaw as Move[];
const abilitiesList = abilitiesRaw as Ability[];
const learnsetsList = learnsetsRaw as Learnset[];

/**
 * Parse level-up moves from encoded string format
 * @param levelUp - Encoded string like "1:TACKLE|7:GROWL|..."
 * @returns Array of {level, move} objects sorted by level
 */
function parseLevelUp(levelUp: string) {
  if (!levelUp) return [];
  const out: { level: number; move: string }[] = [];
  for (const part of levelUp.split("|")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    const lvl = Number(part.slice(0, i));
    const move = part.slice(i + 1).trim();
    if (!Number.isFinite(lvl) || !move) continue;
    out.push({ level: lvl, move });
  }
  out.sort((a, b) => a.level - b.level);
  return out;
}

/**
 * Parse pipe-separated list of moves
 * @param s - Encoded string like "MOVE|MOVE|MOVE"
 * @returns Array of move InternalNames
 */
function parsePipeList(s: string) {
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Look up a Move by its InternalName */
function moveByInternal(internal: string): Move | null {
  return movesList.find((m) => m.InternalName === internal) ?? null;
}

/** Look up an Ability by its InternalName */
function abilityByInternal(internal: string | null | undefined): Ability | null {
  if (!internal) return null;
  return abilitiesList.find((a) => a.InternalName === internal) ?? null;
}

function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

/**
 * Component to display move information in a card format
 * Shows name, type, category, power, accuracy, PP, and description
 */
function MoveCard({
  internal,
  prefix,
}: {
  internal: string;
  prefix?: string;
}) {
  const m = moveByInternal(internal);

  if (!m) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
        <div style={{ fontWeight: 900 }}>
          {prefix ? <span style={{ opacity: 0.7 }}>{prefix} </span> : null}
          {internal}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Move not found in moves.json</div>
      </div>
    );
  }

  const metaParts: string[] = [];
  if (m.Type) metaParts.push(m.Type);
  if (m.Category) metaParts.push(m.Category);
  if (m.Power) metaParts.push(`Pow ${m.Power}`);
  if (m.Accuracy) metaParts.push(`Acc ${m.Accuracy}`);
  if (m.PP) metaParts.push(`PP ${m.PP}`);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 900 }}>
          {prefix ? <span style={{ opacity: 0.7 }}>{prefix} </span> : null}
          {m.Name}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{m.InternalName}</div>
      </div>
      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
        {metaParts.join(" • ")}
      </div>
      {m.Description ? (
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{m.Description}</div>
      ) : null}
    </div>
  );
}

/**
 * Component to display ability information in a card format
 * Shows name and description, handles missing abilities gracefully
 */
function AbilityCard({ internal }: { internal: string | null | undefined }) {
  const a = abilityByInternal(internal);
  if (!internal) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10, opacity: 0.75 }}>
        —
      </div>
    );
  }
  if (!a) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
        <div style={{ fontWeight: 900 }}>{internal}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Ability not found in abilities.json</div>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 900 }}>{a.Name}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{a.InternalName}</div>
      </div>
      {a.Description ? (
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{a.Description}</div>
      ) : null}
    </div>
  );
}

/**
 * Collapsible section component using HTML details/summary
 * Used to organize Pokemon information into expandable sections
 */
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 900, listStyle: "none" as any }}>
        {title}
      </summary>
      <div style={{ marginTop: 10 }}>{children}</div>
    </details>
  );
}

/**
 * Props for the Pokedex component
 * Extends PokedexFiltersState with optional filter control
 */
type PokedexProps = PokedexFiltersState & {
  /** Controls layout when used as a full page vs embedded panel. */
  variant?: "page" | "panel";
  /** When false, show the full dex without applying any filter/sort/exclusions. */
  applyFilters?: boolean;

  /** When provided, shows an "add to box" button per entry. */
  onAddToBox?: (dexId: number) => void;
};


/**
 * Main Pokedex page component
 * Two-panel layout: Results list on left, detailed info on right
 * Features:
 * - Comprehensive filtering by name, type, ability, moves
 * - Sorting by stats or Pokedex number
 * - Detailed Pokemon info including stats, moves, abilities, evolution
 * - Move learnsets with level requirements
 */
export default function Pokedex(props: PokedexProps) {
  const variant = props.variant ?? "page";

  const [selectedKey, setSelectedKey] = useState<string>("1-0");

  const filterEngine = useMemo(
    () =>
      createPokedexFilterEngine({
        moves: movesList,
        abilities: abilitiesList,
        learnsets: learnsetsList,
      }),
    []
  );


const filtered = useMemo(() => {
  return filterEngine.apply(
    speciesList,
    {
      nameQuery: props.nameQuery,
      typeA: props.typeA,
      typeB: props.typeB,
      abilityText: props.abilityText,
      moveText: props.moveText,
      sortBy: props.sortBy,
      sortDir: props.sortDir,
      excludeLegendary: props.excludeLegendary,
      excludeSubLegendary: props.excludeSubLegendary,
    },
    { applyFilters: props.applyFilters }
  );
}, [
  filterEngine,
  props.applyFilters,
  props.nameQuery,
  props.typeA,
  props.typeB,
  props.abilityText,
  props.moveText,
  props.sortBy,
  props.sortDir,
  props.excludeLegendary,
  props.excludeSubLegendary,
]);


  const selected = useMemo(() => {
    const [idStr, formStr] = selectedKey.split("-");
    const id = Number(idStr);
    const form = Number(formStr);

    return (
      speciesList.find((s) => s.ID === id && (s.Form ?? 0) === form) ??
      filtered[0] ??
      null
    );
  }, [selectedKey, filtered]);

  const learnsetForSelected = useMemo(() => {
    if (!selected) return null;

    const exact = learnsetsList.find(
      (ls) => ls.InternalName === selected.InternalName && (ls.Form ?? 0) === (selected.Form ?? 0)
    );
    if (exact) return exact;

    const form0 = learnsetsList.find(
      (ls) => ls.InternalName === selected.InternalName && (ls.Form ?? 0) === 0
    );
    return form0 ?? null;
  }, [selected]);

  const parsedMoves = useMemo(() => {
    if (!learnsetForSelected) {
      return {
        levelUp: [] as { level: number; move: string }[],
        tutor: [] as string[],
        TMMoves: [] as string[],
        HMMoves: [] as string[],
        egg: [] as string[],
      };
    }
    return {
      levelUp: parseLevelUp(learnsetForSelected.LevelUp),
      tutor: parsePipeList(learnsetForSelected.TutorMoves),
      TMMoves: parsePipeList(learnsetForSelected.TMMoves),
      HMMoves: parsePipeList(learnsetForSelected.HMMoves),
      egg: parsePipeList(learnsetForSelected.EggMoves),
    };
  }, [learnsetForSelected]);

  if (variant === "panel") {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
          Results: <b>{filtered.length}</b>
        </div>

        {filtered.map((s) => {
          const key = `${s.ID}-${s.Form ?? 0}`;
          const selected = selectedKey === key;

          return (
            <div key={key} style={{ position: "relative" }}>
              {/* Row button */}
              <button
                type="button"
                onClick={() => setSelectedKey(key)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 10,
                  paddingRight: props.onAddToBox ? 52 : 10, // reserve space for icon
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  background: selected ? "#f3f3f3" : "white",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  #{s.ID} {s.Name}
                  {s.FormName ? ` (${s.FormName})` : ""}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {s.Type1}
                  {s.Type2 ? ` / ${s.Type2}` : ""}
                </div>
              </button>

              {/* Add-to-box icon pinned to the right (always visible) */}
              {props.onAddToBox ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // don't trigger row select
                    props.onAddToBox?.(s.ID);
                  }}
                  title="Add to box"
                  aria-label="Add to box"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                  }}
                >
                  <img
                    src="/types/POKEBALL.png"
                    alt=""
                    style={{
                      width: 20,
                      height: 20,
                      imageRendering: "pixelated",
                      display: "block",
                    }}
                  />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    );
}


  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", height: "100%" }}>
      {/* Results list */}
      <aside style={{ borderRight: "1px solid #ddd", padding: 12, overflow: "auto" }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
          Results: <b>{filtered.length}</b>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          {filtered.map((s) => {
            const key = `${s.ID}-${s.Form ?? 0}`;
            const selected = selectedKey === key;

            return (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {/* Select row */}
                <button
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    background: selected ? "#f3f3f3" : "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>
                    #{s.ID} {s.Name}
                    {s.FormName ? ` (${s.FormName})` : ""}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    {s.Type1}
                    {s.Type2 ? ` / ${s.Type2}` : ""}
                  </div>
                </button>

                {/* Add to box (pokéball) */}
                {props.onAddToBox ? (
                  <button
                    type="button"
                    onClick={() => props.onAddToBox?.(s.ID)}
                    title="Add to box"
                    aria-label="Add to box"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      padding: 0,
                    }}
                  >
                    <img
                      src="/types/POKEBALL.png"
                      alt=""
                      style={{
                        width: 20,
                        height: 20,
                        imageRendering: "pixelated",
                        display: "block",
                      }}
                    />
                  </button>
                ) : null}
              </div>
            );
          })}

        </div>
      </aside>

      {/* Details */}
      <main style={{ padding: 18, overflow: "auto" }}>
        {!selected ? (
          <p>No selection.</p>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <SpriteTile
                headId={selected.ID}
                bodyId={selected.ID}
                title={`#${selected.ID} ${selected.Name}`}
              />
              <div>
                <h1 style={{ margin: 0 }}>
                  #{selected.ID} {selected.Name}
                  {selected.FormName ? ` (${selected.FormName})` : ""}
                </h1>
                <div style={{ fontSize: 14, opacity: 0.75 }}>
                  {selected.Type1}
                  {selected.Type2 ? ` / ${selected.Type2}` : ""}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <Section title={`Stats (BST ${getBST(selected)})`} defaultOpen>
                <div style={{ display: "grid", gap: 8 }}>
                  <KeyValueRow k="HP" v={selected.BaseHP} />
                  <KeyValueRow k="Atk" v={selected.BaseATK} />
                  <KeyValueRow k="Def" v={selected.BaseDEF} />
                  <KeyValueRow k="SpA" v={selected.BaseSPA} />
                  <KeyValueRow k="SpD" v={selected.BaseSPD} />
                  <KeyValueRow k="Spe" v={selected.BaseSPE} />
                  <KeyValueRow k="BST" v={<b>{getBST(selected)}</b>} />
                </div>
              </Section>

              <Section title="Moves" defaultOpen>
                {!learnsetForSelected ? (
                  <div style={{ opacity: 0.75 }}>No learnset found.</div>
                ) : (
                  <div style={{ display: "grid", gap: 14 }}>
                    <Section title="Level-up" defaultOpen>
                      {parsedMoves.levelUp.length === 0 ? (
                        <div style={{ opacity: 0.75 }}>None</div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          {parsedMoves.levelUp.map((m) => (
                            <MoveCard
                              key={`${m.level}-${m.move}`}
                              internal={m.move}
                              prefix={`Lv ${m.level} •`}
                            />
                          ))}
                        </div>
                      )}
                    </Section>

                    <Section title="Tutor" defaultOpen>
                      {parsedMoves.tutor.length === 0 ? (
                        <div style={{ opacity: 0.75 }}>None</div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          {parsedMoves.tutor
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .map((mv) => (
                              <MoveCard key={mv} internal={mv} />
                            ))}
                        </div>
                      )}
                    </Section>

                    <Section title="TM Moves" defaultOpen>
                      {parsedMoves.TMMoves.length === 0 ? (
                        <div style={{ opacity: 0.75 }}>None</div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          {parsedMoves.TMMoves
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .map((mv) => (
                              <MoveCard key={mv} internal={mv} />
                            ))}
                        </div>
                      )}
                    </Section>

                    <Section title="HM Moves" defaultOpen>
                      {parsedMoves.HMMoves.length === 0 ? (
                        <div style={{ opacity: 0.75 }}>None</div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          {parsedMoves.HMMoves
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .map((mv) => (
                              <MoveCard key={mv} internal={mv} />
                            ))}
                        </div>
                      )}
                    </Section>

                    <Section title="Egg Moves" defaultOpen>
                      {parsedMoves.egg.length === 0 ? (
                        <div style={{ opacity: 0.75 }}>None</div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          {parsedMoves.egg
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .map((mv) => (
                              <MoveCard key={mv} internal={mv} />
                            ))}
                        </div>
                      )}
                    </Section>
                  </div>
                )}
              </Section>

              <Section title="Abilities" defaultOpen>
                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Ability 1</div>
                    <AbilityCard internal={selected.Ability1} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Ability 2</div>
                    <AbilityCard internal={selected.Ability2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Hidden Ability 1</div>
                    <AbilityCard internal={selected.HiddenAbility1} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 6, opacity: 0.8 }}>Hidden Ability 2</div>
                    <AbilityCard internal={selected.HiddenAbility2} />
                  </div>
                </div>
              </Section>

              <Section title="Evolution" defaultOpen>
                <EvolutionLine speciesList={speciesList} internalName={selected.InternalName} />
              </Section>

              <Section title="Dex Entry" defaultOpen>
                <p style={{ maxWidth: 900, marginTop: 0 }}>{selected.PokedexEntry}</p>
              </Section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
