import type { Species } from "../../lib/types/species";

export function getBST(s: Species) {
  return s.BaseHP + s.BaseATK + s.BaseDEF + s.BaseSPA + s.BaseSPD + s.BaseSPE;
}

export function parseLevelUp(levelUp: string) {
  if (!levelUp) return [];
  const out: { level: number; move: string }[] = [];

  for (const part of levelUp.split("|")) {
    const i = part.indexOf(":");
    if (i === -1) continue;

    const lvl = Number(part.slice(0, i));
    const move = part.slice(i + 1).trim();

    if (!Number.isFinite(lvl) || !move) continue;
    out.push({ level: lvl, move });
  }

  out.sort((a, b) => a.level - b.level);
  return out;
}

export function parsePipeList(s: string) {
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}
