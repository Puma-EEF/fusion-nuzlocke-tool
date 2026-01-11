import type { Species } from "../types/species";
import type { DetailsInput, DetailsVM, StatBlock } from "./detailsTypes";
import { computeEffectiveStats } from "../effectiveStats";
import { fusePokemon } from "../fusion";
import abilitiesRaw from "../../data/abilities.json";
import movesRaw from "../../data/moves.json";
import learnsetsRaw from "../../data/learnsets.json";

const movesList = movesRaw as any[];
const abilitiesList = abilitiesRaw as any[];
const learnsetsList = learnsetsRaw as any[];

const moveNameByInternal = new Map<string, string>(movesList.map(m => [m.InternalName, m.Name]));
const abilityNameByInternal = new Map<string, string>(abilitiesList.map(a => [a.InternalName, a.Name]));

function listFromPipe(s?: string) {
  if (!s) return [];
  return s.split("|").map(x => x.trim()).filter(Boolean);
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr));
}

function parseLevelUpMoves(raw?: string): { level: number; internal: string }[] {
  if (!raw) return [];
  // Format: "0:WINGATTACK|1:AIRSLASH|..."
  return raw
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((entry) => {
      const [lvlStr, moveInternal] = entry.split(":");
      const level = Number(lvlStr);
      return {
        level: Number.isFinite(level) ? level : 0,
        internal: (moveInternal ?? "").trim(),
      };
    })
    .filter((x) => x.internal.length > 0);
}

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
    const abilities = dedupe(
      [
        s.Ability1,
        s.Ability2,
        s.HiddenAbility1,
        s.HiddenAbility2,
      ]
        .filter(Boolean)
        .map((a: string) => abilityNameByInternal.get(a) ?? a)
    );

    const learnset = learnsetsList.find((ls: any) => ls.InternalName === s.InternalName);

    const moves = {
      levelUp: (() => {
        const parsed = parseLevelUpMoves(learnset?.LevelUp)
          .map(({ level, internal }) => ({
            level,
            name: moveNameByInternal.get(internal) ?? internal,
          }))
          // dedupe by name, keep the lowest level if duplicates exist
          .sort((a, b) => a.level - b.level);

        const bestByName = new Map<string, { level: number; name: string }>();
        for (const m of parsed) {
          const prev = bestByName.get(m.name);
          if (!prev || m.level < prev.level) bestByName.set(m.name, m);
        }
        return Array.from(bestByName.values()).sort((a, b) => a.level - b.level);
      })(),
      tm: dedupe(listFromPipe(learnset?.TMMoves).map((m) => moveNameByInternal.get(m) ?? m)),
      tutor: dedupe(listFromPipe(learnset?.TutorMoves).map((m) => moveNameByInternal.get(m) ?? m)),
      egg: dedupe(listFromPipe(learnset?.EggMoves).map((m) => moveNameByInternal.get(m) ?? m)),
      hm: dedupe(listFromPipe(learnset?.HMMoves).map((m) => moveNameByInternal.get(m) ?? m)),
    };

    return {
      kind: "BASE",
      title: `#${s.ID} ${s.Name}`,
      sprite: { headId: s.ID, bodyId: s.ID },
      typing: { type1: s.Type1, type2: s.Type2 ?? null },
      baseStats: base,
      abilities,
      moves,
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
