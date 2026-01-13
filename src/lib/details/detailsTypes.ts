import type { NatureId, IVs, BoxMon } from "../types/box";

export type StatBlock = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  bst: number;
};

export type Typing = { type1: string; type2?: string | null };

export type DetailsVM = {
  title: string;
  subtitle?: string;

  sprite: { headId: number; bodyId: number };

  typing: Typing;

  /** Pure base stats derived from species or fusion engine */
  baseStats: StatBlock;

  /** Optional abilities for display purposes */
  abilities?: string[]; // display names

  /** Optional move lists for display purposes */
  moves?: {
    levelUp: { level: number; name: string }[];
    tm: string[];
    tutor: string[];
    egg: string[];
    hm: string[];
  };

  /** Only present when the source is a BoxMon (editable in Box/Team) */
  nature?: NatureId;
  ivs?: IVs;

  /** Optional derived display stats (e.g. Level 50 with IV+Nature) */
  effectiveStats?: StatBlock;

  kind: "BASE" | "FUSION";
};

export type DetailsEditor =
  | {
      canEdit: true;
      setNature: (nature: NatureId) => void;
      setIV: (stat: keyof IVs, value: number) => void;
    }
  | { canEdit: false };

export type DetailsInput =
  | { source: "species"; dexId: number; form?: number }
  | { source: "boxMon"; boxMon: BoxMon };
