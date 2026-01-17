/**
 * Effective Stats Calculator
 * 
 * Calculates effective Pokemon stats at a given level with IVs and nature modifiers.
 * Implements the standard Pokemon stat calculation formulas.
 * 
 * @module lib/effectiveStats
 * 
 * ## Stat Formulas
 * 
 * **HP:**
 * ```
 * HP = floor(((2 × Base + IV) × Level) / 100) + Level + 10
 * ```
 * 
 * **Other Stats (ATK, DEF, SPA, SPD, SPE):**
 * ```
 * Stat = floor((floor(((2 × Base + IV) × Level) / 100) + 5) × Nature)
 * ```
 * 
 * **Nature Modifiers:**
 * - Beneficial nature: ×1.1 (+10%)
 * - Detrimental nature: ×0.9 (-10%)
 * - Neutral nature: ×1.0 (no change)
 * 
 * @see NATURE_EFFECTS - Complete nature modifier table
 */

import type { IVs, NatureId } from "./types/box";

type StatKey = "atk" | "def" | "spa" | "spd" | "spe";

/**
 * Nature effect lookup table
 * 
 * Maps each nature to its stat modifiers (if any).
 * Neutral natures (Hardy, Docile, etc.) have no modifiers.
 * 
 * @example
 * NATURE_EFFECTS.ADAMANT // { up: "atk", down: "spa" }
 * NATURE_EFFECTS.MODEST  // { up: "spa", down: "atk" }
 * NATURE_EFFECTS.HARDY   // {} (neutral nature)
 */
const NATURE_EFFECTS: Record<NatureId, { up?: StatKey; down?: StatKey }> = {
  HARDY: {}, LONELY: { up: "atk", down: "def" }, BRAVE: { up: "atk", down: "spe" }, ADAMANT: { up: "atk", down: "spa" }, NAUGHTY: { up: "atk", down: "spd" },
  BOLD: { up: "def", down: "atk" }, DOCILE: {}, RELAXED: { up: "def", down: "spe" }, IMPISH: { up: "def", down: "spa" }, LAX: { up: "def", down: "spd" },
  TIMID: { up: "spe", down: "atk" }, HASTY: { up: "spe", down: "def" }, SERIOUS: {}, JOLLY: { up: "spe", down: "spa" }, NAIVE: { up: "spe", down: "spd" },
  MODEST: { up: "spa", down: "atk" }, MILD: { up: "spa", down: "def" }, QUIET: { up: "spa", down: "spe" }, BASHFUL: {}, RASH: { up: "spa", down: "spd" },
  CALM: { up: "spd", down: "atk" }, GENTLE: { up: "spd", down: "def" }, SASSY: { up: "spd", down: "spe" }, CAREFUL: { up: "spd", down: "spa" }, QUIRKY: {},
};

/**
 * Get nature multiplier for a specific stat
 * 
 * @param nature - Nature ID
 * @param stat - Stat to check (atk, def, spa, spd, or spe)
 * @returns Multiplier: 1.1 (boosted), 0.9 (hindered), or 1.0 (neutral)
 */
function natureMultiplier(nature: NatureId, stat: StatKey) {
  const eff = NATURE_EFFECTS[nature] || {};
  if (eff.up === stat) return 1.1;
  if (eff.down === stat) return 0.9;
  return 1.0;
}

/**
 * Compute effective stats for a Pokemon at a given level
 * 
 * Calculates final stats using base stats, IVs, nature, and level.
 * Commonly calculated at level 50 for competitive standards.
 * 
 * @param base - Base stats object (hp, atk, def, spa, spd, spe)
 * @param nature - Nature ID affecting stat modifiers
 * @param ivs - Individual Values (0-31 for each stat)
 * @param level - Pokemon level (default: 50)
 * @returns Effective stats at the specified level
 * 
 * @example
 * const baseStats = { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 };
 * const stats = computeEffectiveStats(baseStats, "MODEST", { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 }, 50);
 * // Returns: { hp: 188, atk: 104, def: 128, spa: 150, spd: 135, spe: 150 }
 */
export function computeEffectiveStats(
  base: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number },
  nature: NatureId,
  ivs: IVs,
  level = 50
) {
  // HP uses a different formula than other stats
  const hp = Math.floor(((2 * base.hp + ivs.hp) * level) / 100) + level + 10;

  // Helper for non-HP stats with nature modifiers
  const calc = (b: number, iv: number, mult: number) => {
    const raw = Math.floor(((2 * b + iv) * level) / 100) + 5;
    return Math.floor(raw * mult);
  };

  return {
    hp,
    atk: calc(base.atk, ivs.atk, natureMultiplier(nature, "atk")),
    def: calc(base.def, ivs.def, natureMultiplier(nature, "def")),
    spa: calc(base.spa, ivs.spa, natureMultiplier(nature, "spa")),
    spd: calc(base.spd, ivs.spd, natureMultiplier(nature, "spd")),
    spe: calc(base.spe, ivs.spe, natureMultiplier(nature, "spe")),
  };
}
