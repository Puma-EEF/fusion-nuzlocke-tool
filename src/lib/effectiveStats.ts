import type { IVs, NatureId } from "./types/box";

type StatKey = "atk" | "def" | "spa" | "spd" | "spe";

const NATURE_EFFECTS: Record<NatureId, { up?: StatKey; down?: StatKey }> = {
  HARDY: {}, LONELY: { up: "atk", down: "def" }, BRAVE: { up: "atk", down: "spe" }, ADAMANT: { up: "atk", down: "spa" }, NAUGHTY: { up: "atk", down: "spd" },
  BOLD: { up: "def", down: "atk" }, DOCILE: {}, RELAXED: { up: "def", down: "spe" }, IMPISH: { up: "def", down: "spa" }, LAX: { up: "def", down: "spd" },
  TIMID: { up: "spe", down: "atk" }, HASTY: { up: "spe", down: "def" }, SERIOUS: {}, JOLLY: { up: "spe", down: "spa" }, NAIVE: { up: "spe", down: "spd" },
  MODEST: { up: "spa", down: "atk" }, MILD: { up: "spa", down: "def" }, QUIET: { up: "spa", down: "spe" }, BASHFUL: {}, RASH: { up: "spa", down: "spd" },
  CALM: { up: "spd", down: "atk" }, GENTLE: { up: "spd", down: "def" }, SASSY: { up: "spd", down: "spe" }, CAREFUL: { up: "spd", down: "spa" }, QUIRKY: {},
};

function natureMultiplier(nature: NatureId, stat: StatKey) {
  const eff = NATURE_EFFECTS[nature] || {};
  if (eff.up === stat) return 1.1;
  if (eff.down === stat) return 0.9;
  return 1.0;
}

export function computeEffectiveStats(
  base: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number },
  nature: NatureId,
  ivs: IVs,
  level = 50
) {
  const hp = Math.floor(((2 * base.hp + ivs.hp) * level) / 100) + level + 10;

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
