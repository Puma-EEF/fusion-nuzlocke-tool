import type { BoxMon } from "./types/box";

const STORAGE_KEY = "fusion-nuzlocke-tool:box:v1";

export function loadBox(): BoxMon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as BoxMon[];
  } catch {
    return [];
  }
}

export function saveBox(box: BoxMon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(box));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function newBoxId(): string {
  // @ts-expect-error - TS config may not include DOM crypto typing
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    // @ts-expect-error
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
