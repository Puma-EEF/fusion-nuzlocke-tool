/**
 * Represents a Pokemon species with all its base stats and characteristics
 */
export type Species = {
  /** Unique National Pokedex number */
  ID: number;
  /** Internal name used in the game code */
  InternalName: string;
  /** Form variation number (0 for base form) */
  Form: number;
  /** Display name of the Pokemon */
  Name: string;
  /** Name of the specific form (e.g., "Alolan", "Mega"), null for base form */
  FormName: string | null;

  /** Pokemon category (e.g., "Seed Pokemon", "Flame Pokemon") */
  Category: string;
  /** Primary elemental type */
  Type1: string;
  /** Secondary elemental type, null if mono-type */
  Type2: string | null;

  /** Base Hit Points stat */
  BaseHP: number;
  /** Base Attack stat (physical damage) */
  BaseATK: number;
  /** Base Defense stat (physical resistance) */
  BaseDEF: number;
  /** Base Special Attack stat (special damage) */
  BaseSPA: number;
  /** Base Special Defense stat (special resistance) */
  BaseSPD: number;
  /** Base Speed stat (turn order) */
  BaseSPE: number;

  /** First standard ability */
  Ability1: string;
  /** Second standard ability, null if only one */
  Ability2: string | null;
  /** First hidden ability, null if none */
  HiddenAbility1: string | null;
  /** Second hidden ability, null if none */
  HiddenAbility2: string | null;

  /** Pokedex description text */
  PokedexEntry: string;
};
