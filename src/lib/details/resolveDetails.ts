import type { Species } from "../types/species";
import type { DetailsInput, DetailsVM, StatBlock } from "./detailsTypes";
import { computeEffectiveStats } from "../effectiveStats";
import { fusePokemon } from "../fusion";

function toStatBlock(stats: {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}): StatBlock {
  const bst = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
  return { ...stats, bst };
}

export function resolveDetailsVM(params: {
  input: DetailsInput;
  speciesById: Map<number, Species>;
  /** Display level used for effectiveStats. Only used when input is a BoxMon. */
  level?: number;
}): DetailsVM | null {
  const { input, speciesById } = params;
  const level = params.level ?? 50;

  // Pokedex display-only
  if (input.source === "species") {
    const s = speciesById.get(input.dexId);
    if (!s) return null;

    const base = toStatBlock({
      hp: Number(s.BaseHP),
      atk: Number(s.BaseATK),
      def: Number(s.BaseDEF),
      spa: Number(s.BaseSPA),
      spd: Number(s.BaseSPD),
      spe: Number(s.BaseSPE),
    });

    return {
      kind: "BASE",
      title: `#${s.ID} ${s.Name}`,
      sprite: { headId: s.ID, bodyId: s.ID },
      typing: { type1: s.Type1, type2: s.Type2 ?? null },
      baseStats: base,
    };
  }

  // BoxMon (display + edit)
  const b = input.boxMon;

  if (b.kind === "BASE") {
    const s = speciesById.get(b.dexId);
    if (!s) return null;

    const base = toStatBlock({
      hp: Number(s.BaseHP),
      atk: Number(s.BaseATK),
      def: Number(s.BaseDEF),
      spa: Number(s.BaseSPA),
      spd: Number(s.BaseSPD),
      spe: Number(s.BaseSPE),
    });

    const eff = computeEffectiveStats(base, b.nature, b.ivs, level);
    const effBlock = toStatBlock(eff);

    return {
      kind: "BASE",
      title: `#${s.ID} ${s.Name}`,
      subtitle: `Nature: ${b.nature}`,
      sprite: { headId: b.dexId, bodyId: b.dexId },
      typing: { type1: s.Type1, type2: s.Type2 ?? null },
      baseStats: base,
      nature: b.nature,
      ivs: b.ivs,
      effectiveStats: effBlock,
    };
  }

  // FUSION BoxMon
  const head = speciesById.get(b.headDexId);
  const body = speciesById.get(b.bodyDexId);
  if (!head || !body) return null;

  const fused = fusePokemon(head, body);

  const base = toStatBlock({
    hp: Number(fused.stats.hp),
    atk: Number(fused.stats.atk),
    def: Number(fused.stats.def),
    spa: Number(fused.stats.spa),
    spd: Number(fused.stats.spd),
    spe: Number(fused.stats.spe),
  });

  const eff = computeEffectiveStats(base, b.nature, b.ivs, level);
  const effBlock = toStatBlock(eff);

  return {
    kind: "FUSION",
    title: `${b.headDexId}.${b.bodyDexId} (${head.Name} → ${body.Name})`,
    subtitle: `Nature: ${b.nature}`,
    sprite: { headId: b.headDexId, bodyId: b.bodyDexId },
    typing: { type1: fused.types.type1, type2: fused.types.type2 },
    baseStats: base,
    nature: b.nature,
    ivs: b.ivs,
    effectiveStats: effBlock,
  };
}
