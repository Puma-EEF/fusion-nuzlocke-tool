export type Species = {
  ID: number;
  InternalName: string;
  Form: number;
  Name: string;
  FormName: string | null;

  Category: string;
  Type1: string;
  Type2: string | null;

  BaseHP: number;
  BaseATK: number;
  BaseDEF: number;
  BaseSPA: number;
  BaseSPD: number;
  BaseSPE: number;

  Ability1: string;
  Ability2: string | null;
  HiddenAbility1: string | null;
  HiddenAbility2: string | null;

  PokedexEntry: string;
};
