/**
 * Box Storage Module
 * 
 * Persistent storage layer for Pokemon box data using browser localStorage.
 * Provides safe load/save operations with error handling and data migration.
 * 
 * @module lib/boxStorage
 * 
 * ## Features
 * - Automatic JSON serialization/deserialization
 * - Error handling for storage quota exceeded
 * - Data migration for older box formats
 * - UUID generation for unique box entries
 * 
 * ## Storage Key
 * Uses `fusion-nuzlocke-tool:box:v1` as the localStorage key.
 * Version suffix allows for future data format migrations.
 * 
 * @see BoxMon - Type definition in lib/types/box.ts
 */

import type { BoxMon } from "./types/box";
import { DEFAULT_IVS, DEFAULT_NATURE } from "./types/box";
import { fusePokemon } from "../lib/fusion";

const STORAGE_KEY = "fusion-nuzlocke-tool:box:v1";

/**
 * Load box data from localStorage
 * 
 * Attempts to load and parse stored box data with comprehensive error handling.
 * Applies data migrations for older formats (adds nature and IVs if missing).
 * 
 * @returns Array of BoxMon entries, or empty array if:
 *   - No data exists in localStorage
 *   - Data is malformed or invalid JSON
 *   - localStorage is disabled/unavailable
 * 
 * @example
 * const box = loadBox();
 * console.log(`Loaded ${box.length} Pokemon from storage`);
 */
export function loadBox(): BoxMon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const box = parsed as BoxMon[];

    // Data migration: Add default nature and IVs if missing (for older saves)
    for (const b of box) {
      if (!b.nature) b.nature = DEFAULT_NATURE;
      if (!b.ivs) b.ivs = { ...DEFAULT_IVS };
    }

    return box;
  } catch {
    // Gracefully handle JSON parse errors or storage access errors
    return [];
  }
}

/**
 * Save box data to localStorage
 * 
 * Serializes box array to JSON and stores it.
 * Fails silently if localStorage is unavailable or quota is exceeded.
 * 
 * @param box - Array of BoxMon entries to save
 * 
 * @example
 * const updatedBox = [...box, newPokemon];
 * saveBox(updatedBox);
 */
export function saveBox(box: BoxMon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(box));
  } catch {
    // Silently fail on quota exceeded or disabled localStorage
    // Could log to console in development if needed
  }
}

/**
 * Generate a unique box ID for new entries
 * 
 * Prefers crypto.randomUUID() for proper UUIDs when available.
 * Falls back to timestamp + random hex for older browsers.
 * 
 * @returns Unique string identifier for a box entry
 * 
 * @example
 * const newEntry: BoxMon = {
 *   boxId: newBoxId(),
 *   kind: "BASE",
 *   dexId: 1,
 *   // ...
 * };
 */
export function newBoxId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    // @ts-expect-error - crypto.randomUUID not in lib
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
