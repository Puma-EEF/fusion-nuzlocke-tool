/**
 * Pokemon Fusion System
 * 
 * Core fusion mechanics for Pokemon Infinite Fusion.
 * Implements stat calculations, type inheritance, ability combining, and learnset merging.
 * 
 * @module lib/fusion
 * 
 * ## Fusion Formulas
 * 
 * **Stats:**
 * - Physical stats (ATK, DEF, SPE): floor(2/3 × body + 1/3 × head)
 * - Special stats (HP, SPA, SPD): floor(2/3 × head + 1/3 × body)
 * 
 * **Types:**
 * - Primary type: Always from head
 * - Secondary type: Preferably from body's secondary, fallback to body's primary
 * - Redundancy check: If types match, result is mono-type
 * 
 * **Abilities:**
 * - Union of all abilities from both Pokemon (includes hidden abilities)
 * - Duplicates automatically removed
 * 
 * **Learnset:**
 * - Level-up: Union with earliest level for shared moves
 * - TM/HM/Tutor/Egg: Union of all moves from both parents
 * 
 * @see fusePokemon - Main fusion function
 * @see fuseLearnset - Learnset merging function
 */

import type { Species } from "./types/species";
import type { Learnset } from "./types/learnset";
import { parseLevelUp, parsePipeList } from "./pokedex/pokedexUtils";

export type Stats = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export type FusionResult = {
  head: Species;
  body: Species;
  types: { type1: string; type2: string | null };
  stats: Stats;
  bst: number;
  abilities: string[];
};

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

/**
 * Floor division for stat calculations
 * Ensures integer stats by flooring fractional results
 */
function statFloor(n: number) {
  return Math.floor(n);
}

/**
 * Calculate physical stat for fusion (ATK, DEF, SPE)
 * Formula: floor(2/3 × body + 1/3 × head)
 * Physical stats favor the body Pokemon
 */
function fuseStatPhysical(head: number, body: number) {
  return statFloor((2 * body) / 3 + head / 3);
}

/**
 * Calculate special stat for fusion (HP, SPA, SPD)
 * Formula: floor(2/3 × head + 1/3 × body)
 * Special stats favor the head Pokemon
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
  const bodyPreferred = body.Type2 ?? body.Type1;
  let type2 = bodyPreferred;

  if (type2 === type1) {
    type2 = body.Type1;
    if (type2 === type1) type2 = null;
  }

  return { type1, type2 };
}

/**
 * Fuse two Pokemon to create a fusion result
 * 
 * Combines two Pokemon using Pokemon Infinite Fusion's fusion mechanics:
 * - Head contributes primary type and special stats
 * - Body contributes secondary type and physical stats
 * - Abilities are pooled from both parents
 * 
 * @param head - Head Pokemon (determines primary type, favors special stats)
 * @param body - Body Pokemon (determines secondary type, favors physical stats)
 * @returns Complete fusion result with stats, types, BST, and abilities
 * 
 * @example
 * const bulbasaur = getSpecies(1);
 * const charmander = getSpecies(4);
 * const fusion = fusePokemon(bulbasaur, charmander);
 * // Result: Grass/Fire type with mixed stats
 */
export function fusePokemon(head: Species, body: Species): FusionResult {
  const types = fuseTypes(head, body);

  const stats: Stats = {
    hp: fuseStatSpecial(head.BaseHP, body.BaseHP),
    spa: fuseStatSpecial(head.BaseSPA, body.BaseSPA),
    spd: fuseStatSpecial(head.BaseSPD, body.BaseSPD),

    atk: fuseStatPhysical(head.BaseATK, body.BaseATK),
    def: fuseStatPhysical(head.BaseDEF, body.BaseDEF),
    spe: fuseStatPhysical(head.BaseSPE, body.BaseSPE),
  };

  const bst = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  const abilities = uniq([
    head.Ability1, head.Ability2 ?? "", head.HiddenAbility1 ?? "", head.HiddenAbility2 ?? "",
    body.Ability1, body.Ability2 ?? "", body.HiddenAbility1 ?? "", body.HiddenAbility2 ?? "",
  ]);

  return { head, body, types, stats, bst, abilities };
}

/**
 * Learnset data structure for fused Pokemon
 * Contains all moves the fusion can learn, organized by method
 */
export type FusionLearnset = {
  levelUp: Array<{ level: number; move: string }>;
  tutor: string[];
  tm: string[];
  hm: string[];
  egg: string[];
  allMoves: string[]; // Union of all moves from all methods
};

/**
 * Merge level-up learnsets from two Pokemon
 * 
 * When both Pokemon learn the same move, the fusion learns it at the earliest level.
 * Results are sorted by level, then alphabetically by move name.
 * 
 * @param head - Head Pokemon learnset
 * @param body - Body Pokemon learnset
 * @returns Merged level-up learnset with earliest levels for shared moves
 */
function fuseLevelUp(head: Learnset | null, body: Learnset | null) {
  const a = head ? parseLevelUp(head.LevelUp) : [];
  const b = body ? parseLevelUp(body.LevelUp) : [];

  // move -> earliest level
  const earliest = new Map<string, number>();

  for (const { level, move } of [...a, ...b]) {
    const prev = earliest.get(move);
    if (prev === undefined || level < prev) earliest.set(move, level);
  }

  return Array.from(earliest.entries())
    .map(([move, level]) => ({ move, level }))
    .sort((x, y) => x.level - y.level || x.move.localeCompare(y.move));
}

/**
 * Merge pipe-delimited move fields (TM, HM, Tutor, Egg)
 * 
 * Combines moves from both parents, removes duplicates, and sorts alphabetically.
 * 
 * @param headVal - Head Pokemon's move string (pipe-delimited)
 * @param bodyVal - Body Pokemon's move string (pipe-delimited)
 * @returns Sorted, deduplicated array of move internal names
 */
function fusePipeField(
  headVal: string | null | undefined,
  bodyVal: string | null | undefined
) {
  const a = headVal ? parsePipeList(headVal) : [];
  const b = bodyVal ? parsePipeList(bodyVal) : [];
  return uniq([...a, ...b]).sort();
}

/**
 * Compute complete fusion learnset from two parent Pokemon
 * 
 * Creates a union of all moves both Pokemon can learn, organized by method.
 * Handles null learnsets gracefully (treats as empty).
 * 
 * @param head - Head Pokemon learnset (or null)
 * @param body - Body Pokemon learnset (or null)
 * @returns Complete fused learnset with all moves and methods
 * 
 * @example
 * const headLearnset = getLearnset("BULBASAUR");
 * const bodyLearnset = getLearnset("CHARMANDER");
 * const fusedMoves = fuseLearnset(headLearnset, bodyLearnset);
 * // fusedMoves.allMoves contains union of both learnsets
 */
export function fuseLearnset(head: Learnset | null, body: Learnset | null): FusionLearnset {
  const levelUp = fuseLevelUp(head, body);
  const tutor = fusePipeField(head?.TutorMoves, body?.TutorMoves);
  const tm = fusePipeField(head?.TMMoves, body?.TMMoves);
  const hm = fusePipeField(head?.HMMoves, body?.HMMoves);
  const egg = fusePipeField(head?.EggMoves, body?.EggMoves);

  const allMoves = uniq([
    ...levelUp.map((x) => x.move),
    ...tutor,
    ...tm,
    ...hm,
    ...egg,
  ]).sort();

  return { levelUp, tutor, tm, hm, egg, allMoves };
}

/**
 * Convenience wrapper for fusing learnsets by internal name
 * 
 * Looks up learnsets from a map and fuses them.
 * Useful when you have internal names but need to look up the learnset data.
 * 
 * @param headInternal - Head Pokemon internal name (e.g., "BULBASAUR")
 * @param bodyInternal - Body Pokemon internal name (e.g., "CHARMANDER")
 * @param learnsetsByInternal - Map of internal names to Learnset objects
 * @returns Fused learnset result
 */
export function fuseLearnsetByInternalName(
  headInternal: string,
  bodyInternal: string,
  learnsetsByInternal: Map<string, Learnset>
) {
  return fuseLearnset(
    learnsetsByInternal.get(headInternal) ?? null,
    learnsetsByInternal.get(bodyInternal) ?? null
  );
}
