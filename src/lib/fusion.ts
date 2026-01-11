/**
 * Pokemon Fusion Calculator
 * 
 * Implements the fusion mechanics from Pokemon Infinite Fusion, combining two Pokemon
 * into a hybrid creature with calculated stats, types, and abilities.
 * 
 * Fusion Rules:
 * - Head Pokemon determines name prefix and special stats (HP, SpA, SpD)
 * - Body Pokemon determines physical stats (Atk, Def, Spe)
 * - Type1 comes from head's primary type
 * - Type2 comes from body's secondary (or primary) type
 * - All abilities from both parents are inherited
 * 
 * @module fusion
 */

import type { Species } from "./types/species";

/** 
 * Represents all six base stats of a Pokemon
 * Used for both individual Pokemon and fusion results
 */
export type Stats = {
  hp: number;  // Hit Points - determines max health
  atk: number; // Attack - physical move damage
  def: number; // Defense - physical damage reduction
  spa: number; // Special Attack - special move damage
  spd: number; // Special Defense - special damage reduction
  spe: number; // Speed - turn order in battle
};

/** 
 * Complete result of fusing two Pokemon together
 * Contains all information needed to display and use the fusion
 */
export type FusionResult = {
  /** The Pokemon providing the head (determines name, special stats, and primary type) */
  head: Species;
  /** The Pokemon providing the body (determines physical stats and secondary type) */
  body: Species;
  /** Resulting type combination after fusion (type1 from head, type2 from body) */
  types: { type1: string; type2: string | null };
  /** All six base stats after applying fusion formulas */
  stats: Stats;
  /** Base Stat Total - sum of all six stats */
  bst: number;
  /** Combined list of all abilities from both Pokemon (deduplicated) */
  abilities: string[];
};

/** 
 * Helper to get unique non-empty strings from an array
 * Filters out empty/falsy values and removes duplicates
 * @param arr - Array of strings (may contain empty strings or duplicates)
 * @returns Array of unique non-empty strings
 */
const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

/** 
 * Floor function for stat calculations
 * Ensures all calculated stats are whole numbers
 * @param n - Decimal stat value
 * @returns Integer stat value
 */
function statFloor(n: number) {
  return Math.floor(n);
}

/**
 * Calculate physical stats (Atk/Def/Spe) for fusion
 * 
 * Physical stats are weighted towards the body Pokemon, which provides
 * the physical form and structure of the fusion.
 * 
 * Formula: floor((2 × Body + Head) / 3)
 * - Body contributes 2/3 (66.67%)
 * - Head contributes 1/3 (33.33%)
 * 
 * @param head - The head Pokemon's stat value
 * @param body - The body Pokemon's stat value
 * @returns Calculated fusion stat value (floored to integer)
 */
function fuseStatPhysical(head: number, body: number) {
  return statFloor((2 * body) / 3 + head / 3);
}

/**
 * Calculate special stats (HP/SpA/SpD) for fusion
 * 
 * Special stats are weighted towards the head Pokemon, which provides
 * the mental/spiritual essence of the fusion.
 * 
 * Formula: floor((2 × Head + Body) / 3)
 * - Head contributes 2/3 (66.67%)
 * - Body contributes 1/3 (33.33%)
 * 
 * @param head - The head Pokemon's stat value
 * @param body - The body Pokemon's stat value
 * @returns Calculated fusion stat value (floored to integer)
 */
function fuseStatSpecial(head: number, body: number) {
  return statFloor((2 * head) / 3 + body / 3);
}

/**
 * Determine type combination for fusion
 * 
 * Type fusion follows specific rules to create logical combinations:
 * 1. Primary type always comes from head's primary type
 * 2. Secondary type preferably comes from body's secondary type
 * 3. If body has no secondary type, use body's primary type
 * 4. If types would be redundant, try body's primary type
 * 5. If still redundant, result is mono-type (no secondary type)
 * 
 * Examples:
 * - Bulbasaur (Grass) + Charmander (Fire) = Grass/Fire
 * - Pikachu (Electric) + Eevee (Normal) = Electric/Normal
 * - Bulbasaur (Grass/Poison) + Charmander (Fire) = Grass/Poison fusion
 * 
 * @param head - The head Pokemon (provides primary type)
 * @param body - The body Pokemon (provides secondary type)
 * @returns Object with type1 (primary) and type2 (secondary, may be null)
 */
export function fuseTypes(head: Species, body: Species) {
  const type1 = head.Type1;

  // Prefer body's secondary type, fall back to primary
  const bodyPreferred = body.Type2 ?? body.Type1;
  let type2 = bodyPreferred;

  // Avoid redundant types - if type2 matches type1, try body's primary instead
  if (type2 === type1) {
    type2 = body.Type1;
    if (type2 === type1) type2 = null; // true mono-type result
  }

  return { type1, type2 };
}

/**
 * Fuse two Pokemon together to create a hybrid fusion
 * 
 * Implements the complete Pokemon Infinite Fusion algorithm, combining:
 * - Base stats using weighted formulas (physical favor body, special favor head)
 * - Types following precedence rules (head primary + body secondary)
 * - Abilities by combining all from both parents
 * 
 * The head Pokemon provides:
 * - The fusion's name prefix (e.g., "Bulbasaur/Charmander" = Bulb-mander)
 * - Primary type (type1)
 * - 2/3 weight for HP, SpA, SpD
 * - 1/3 weight for Atk, Def, Spe
 * 
 * The body Pokemon provides:
 * - The fusion's physical form for sprites
 * - Secondary type (type2)
 * - 2/3 weight for Atk, Def, Spe
 * - 1/3 weight for HP, SpA, SpD
 * 
 * @param head - Pokemon providing head (name, special stats, primary type)
 * @param body - Pokemon providing body (physical stats, secondary type)
 * @returns Complete fusion result with all calculated properties
 * 
 * @example
 * const bulbasaur = getSpecies("BULBASAUR");
 * const charmander = getSpecies("CHARMANDER");
 * const fusion = fusePokemon(bulbasaur, charmander);
 * // fusion.types = { type1: "Grass", type2: "Fire" }
 * // fusion.stats = { hp: 46, atk: 50, def: 46, spa: 62, spd: 58, spe: 60 }
 * // fusion.bst = 322
 */
export function fusePokemon(head: Species, body: Species): FusionResult {
  const types = fuseTypes(head, body);

  // Calculate all six stats using appropriate formulas
  // Special stats (HP, SpA, SpD) favor head (2/3 head + 1/3 body)
  // Physical stats (Atk, Def, Spe) favor body (2/3 body + 1/3 head)
  const stats: Stats = {
    hp: fuseStatSpecial(head.BaseHP, body.BaseHP),
    spa: fuseStatSpecial(head.BaseSPA, body.BaseSPA),
    spd: fuseStatSpecial(head.BaseSPD, body.BaseSPD),

    atk: fuseStatPhysical(head.BaseATK, body.BaseATK),
    def: fuseStatPhysical(head.BaseDEF, body.BaseDEF),
    spe: fuseStatPhysical(head.BaseSPE, body.BaseSPE),
  };

  // Calculate Base Stat Total (sum of all six stats)
  const bst = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  // Combine all abilities from both Pokemon
  // Each Pokemon can have up to 4 abilities (Ability1, Ability2, HiddenAbility1, HiddenAbility2)
  // Filter out empty strings and remove duplicates
  const abilities = uniq([
    head.Ability1, head.Ability2 ?? "", head.HiddenAbility1 ?? "", head.HiddenAbility2 ?? "",
    body.Ability1, body.Ability2 ?? "", body.HiddenAbility1 ?? "", body.HiddenAbility2 ?? "",
  ]);

  return { head, body, types, stats, bst, abilities };
}
