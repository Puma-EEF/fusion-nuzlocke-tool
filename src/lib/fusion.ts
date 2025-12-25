import type { Species } from "./types/species";

export type Stats = {
  hp: number; atk: number; def: number; spa: number; spd: number; spe: number;
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

// From Fusion FAQs:
// Atk/Def/Spe = floor((2*Body + Head)/3)
// HP/SpA/SpD = floor((2*Head + Body)/3) :contentReference[oaicite:2]{index=2}
function fuseStatPhysical(head: number, body: number) {
  return statFloor((2 * body) / 3 + head / 3);
}
function fuseStatSpecial(head: number, body: number) {
  return statFloor((2 * head) / 3 + body / 3);
}

// Typing rule (general):
// type1 = head primary
// type2 = body's secondary (or primary if none)
// if that equals type1, body provides its primary instead (avoid redundancy) :contentReference[oaicite:3]{index=3}
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
