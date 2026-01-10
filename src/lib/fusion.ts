import type { Species } from "./types/species";

/** Represents all six base stats of a Pokemon */
export type Stats = {
  hp: number; atk: number; def: number; spa: number; spd: number; spe: number;
};

/** Complete result of fusing two Pokemon together */
export type FusionResult = {
  /** The Pokemon providing the head (affects name, special stats) */
  head: Species;
  /** The Pokemon providing the body (affects physical stats) */
  body: Species;
  /** Resulting type combination after fusion */
  types: { type1: string; type2: string | null };
  /** All six base stats after fusion calculations */
  stats: Stats;
  /** Base Stat Total - sum of all stats */
  bst: number;
  /** Combined list of all abilities from both Pokemon */
  abilities: string[];
};

/** Helper to get unique non-empty strings from array */
const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

/** Floor function for stat calculations */
function statFloor(n: number) {
  return Math.floor(n);
}

/**
 * Calculate physical stats (Atk/Def/Spe) for fusion
 * Formula: floor((2*Body + Head)/3)
 * Physical stats favor the body Pokemon (2/3 body, 1/3 head)
 */
function fuseStatPhysical(head: number, body: number) {
  return statFloor((2 * body) / 3 + head / 3);
}

/**
 * Calculate special stats (HP/SpA/SpD) for fusion
 * Formula: floor((2*Head + Body)/3)
 * Special stats favor the head Pokemon (2/3 head, 1/3 body)
 */
function fuseStatSpecial(head: number, body: number) {
  return statFloor((2 * head) / 3 + body / 3);
}

/**
 * Determine type combination for fusion
 * Rules:
 * - type1 = head's primary type
 * - type2 = body's secondary (or primary if no secondary)
 * - Avoid redundancy: if type2 equals type1, use body's primary instead
 * - If still redundant, result is mono-type (type2 = null)
 */
export function fuseTypes(head: Species, body: Species) {
  const type1 = head.Type1;

  const bodyPreferred = body.Type2 ?? body.Type1;
  let type2 = bodyPreferred;

  if (type2 === type1) {
    type2 = body.Type1;
    if (type2 === type1) type2 = null; // true mono-type result
  }

  return { type1, type2 };
}

/**
 * Fuse two Pokemon together to create a hybrid
 * Combines stats, types, and abilities according to Pokemon Infinite Fusion rules
 * @param head - Pokemon providing head (name, special stats)
 * @param body - Pokemon providing body (physical stats)
 * @returns Complete fusion result with all calculated properties
 */
export function fusePokemon(head: Species, body: Species): FusionResult {
  const types = fuseTypes(head, body);

  // Calculate all six stats using appropriate formulas
  const stats: Stats = {
    hp: fuseStatSpecial(head.BaseHP, body.BaseHP),
    spa: fuseStatSpecial(head.BaseSPA, body.BaseSPA),
    spd: fuseStatSpecial(head.BaseSPD, body.BaseSPD),

    atk: fuseStatPhysical(head.BaseATK, body.BaseATK),
    def: fuseStatPhysical(head.BaseDEF, body.BaseDEF),
    spe: fuseStatPhysical(head.BaseSPE, body.BaseSPE),
  };

  // Calculate Base Stat Total
  const bst = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  // Combine all abilities from both Pokemon (remove duplicates and empty values)
  const abilities = uniq([
    head.Ability1, head.Ability2 ?? "", head.HiddenAbility1 ?? "", head.HiddenAbility2 ?? "",
    body.Ability1, body.Ability2 ?? "", body.HiddenAbility1 ?? "", body.HiddenAbility2 ?? "",
  ]);

  return { head, body, types, stats, bst, abilities };
}
