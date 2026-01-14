/**
 * Pokemon Fusion - Combine two Pokemon with calculated stats and types
 * Head favors special stats, body favors physical stats
 */

import type { Species } from "./types/species";

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

function statFloor(n: number) {
  return Math.floor(n);
}

function fuseStatPhysical(head: number, body: number) {
  return statFloor((2 * body) / 3 + head / 3);
}

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
