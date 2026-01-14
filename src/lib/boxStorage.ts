/**
 * Box Storage - Persist box data to localStorage with error handling
 */

import type { BoxMon } from "./types/box";
import { DEFAULT_IVS, DEFAULT_NATURE } from "./types/box";
import { fusePokemon } from "../lib/fusion";

const STORAGE_KEY = "fusion-nuzlocke-tool:box:v1";

export function loadBox(): BoxMon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const box = parsed as BoxMon[];

    for (const b of box) {
      if (!b.nature) b.nature = DEFAULT_NATURE;
      if (!b.ivs) b.ivs = { ...DEFAULT_IVS };
    }

    return box;
  } catch {
    return [];
  }
}

export function saveBox(box: BoxMon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(box));
  } catch {
    // Storage quota exceeded or disabled
  }
}

export function newBoxId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    // @ts-expect-error - crypto.randomUUID not in lib
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
