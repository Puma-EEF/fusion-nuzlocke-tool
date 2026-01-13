import type { Species } from "../types/species";
import type { SortBy, SortDir } from "../types/pokedexFilters";

function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

function getSortValue(s: Species, sortBy: SortBy) {
  switch (sortBy) {
    case "DEX": return s.ID;
    case "HP": return s.BaseHP;
    case "ATK": return s.BaseATK;
    case "DEF": return s.BaseDEF;
    case "SPA": return s.BaseSPA;
    case "SPD": return s.BaseSPD;
    case "SPE": return s.BaseSPE;
    case "BST": return getBST(s);
  }
}

export function sortSpecies(list: Species[], sortBy: SortBy, sortDir: SortDir) {
  return list.slice().sort((a, b) => {
    const av = getSortValue(a, sortBy);
    const bv = getSortValue(b, sortBy);
    if (av !== bv) return sortDir === "asc" ? av - bv : bv - av;
    if (a.ID !== b.ID) return a.ID - b.ID;
    return (a.Form ?? 0) - (b.Form ?? 0);
  });
}
