import { DEFAULT_IVS, DEFAULT_NATURE } from "./types/box";

export type BoxKind = "BASE" | "FUSION";
export type RarityTier = "LEGENDARY" | "SUB_LEGENDARY" | "NORMAL";
export type NatureId =
  | "HARDY" | "LONELY" | "BRAVE" | "ADAMANT" | "NAUGHTY"
  | "BOLD" | "DOCILE" | "RELAXED" | "IMPISH" | "LAX"
  | "TIMID" | "HASTY" | "SERIOUS" | "JOLLY" | "NAIVE"
  | "MODEST" | "MILD" | "QUIET" | "BASHFUL" | "RASH"
  | "CALM" | "GENTLE" | "SASSY" | "CAREFUL" | "QUIRKY";

export type IVs = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export const DEFAULT_NATURE: NatureId = "HARDY";
export const DEFAULT_IVS: IVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

export type BoxMon =
  | {
      boxId: string;
      kind: "BASE";
      dexId: number;
      rarityTier: RarityTier;
      abilityId: string; // "UNDEFINED" if not chosen
      moveset?: string[]; // up to 4 internal move IDs
    }
  | {
      boxId: string;
      kind: "FUSION";
      headDexId: number;
      bodyDexId: number;
      rarityTier: RarityTier;
      abilityId: string;
      moveset?: string[];
    };

export const UNDEFINED_ABILITY = "UNDEFINED" as const;
