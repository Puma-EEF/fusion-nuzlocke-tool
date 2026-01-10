export type BoxKind = "BASE" | "FUSION";
export type RarityTier = "LEGENDARY" | "SUB_LEGENDARY" | "NORMAL";

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
