/**
 * Box Storage Module
 * 
 * Handles persistence of box/team data using browser localStorage.
 * Provides load/save operations with error handling for quota limits
 * and privacy mode restrictions.
 * 
 * Storage format: JSON array of BoxMon objects
 * Storage key: "fusion-nuzlocke-tool:box:v1"
 * 
 * @module boxStorage
 */

import type { BoxMon } from "./types/box";

/** 
 * localStorage key for box data persistence
 * Versioned to allow future migrations if data structure changes
 */
const STORAGE_KEY = "fusion-nuzlocke-tool:box:v1";

/**
 * Load box data from browser localStorage
 * 
 * Safely handles:
 * - Missing data (returns empty array)
 * - Invalid JSON (returns empty array)
 * - Non-array data (returns empty array)
 * - Browser privacy mode restrictions
 * 
 * @returns Array of BoxMon objects, empty array if none found or on error
 */
export function loadBox(): BoxMon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as BoxMon[];
  } catch {
    // Fail silently on parse errors or localStorage access issues
    return [];
  }
}

/**
 * Save box data to browser localStorage
 * 
 * Serializes the box array to JSON and persists it.
 * Silently handles errors like:
 * - Storage quota exceeded
 * - Browser privacy mode (localStorage disabled)
 * - JSON serialization failures
 * 
 * @param box - Array of BoxMon objects to persist
 */
export function saveBox(box: BoxMon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(box));
  } catch {
    // Silently ignore quota errors or privacy mode restrictions
    // User's changes will not persist but app continues to function
  }
}

/**
 * Generate a unique ID for a new BoxMon entry
 * 
 * Uses crypto.randomUUID() when available (modern browsers),
 * falls back to timestamp + random number for compatibility.
 * 
 * @returns Unique string identifier for a box entry
 * 
 * @example
 * const id = newBoxId(); // "550e8400-e29b-41d4-a716-446655440000" or "1642521234567-a3f9b2c1"
 */
export function newBoxId(): string {
  // @ts-expect-error - TS config may not include DOM crypto typing
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    // @ts-expect-error - TypeScript may not recognize crypto.randomUUID
    return crypto.randomUUID();
  }
  // Fallback for older browsers: timestamp + random hex
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
