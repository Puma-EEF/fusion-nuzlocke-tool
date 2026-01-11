/**
 * Sprite Tile Component
 * 
 * Renders a single Pokemon fusion sprite from a sprite sheet using CSS positioning.
 * Each "head" Pokemon has its own sprite sheet containing all possible "body" combinations.
 * 
 * Sprite Sheet Structure:
 * - Each sheet is 960x4896px (10 columns × 51 rows)
 * - Each tile is 96x96px
 * - Total of 510 possible sprites per sheet (one for each body Pokemon)
 * - Located in /public/spriteless/{headId}.png
 * 
 * The component uses CSS background-position to efficiently display a single
 * tile from the large sprite sheet without loading individual images.
 * 
 * @module components/SpriteTile
 */

import { useMemo, useState } from "react";

type Props = {
  /** 
   * Pokedex ID of the head Pokemon (determines which sprite sheet to load)
   * Corresponds to sprite sheet filename: /spriteless/{headId}.png
   */
  headId: number;
  /** 
   * Pokedex ID of the body Pokemon (determines tile position within sheet)
   * Range: 0-509 (grid coordinates calculated as col = id % 10, row = id / 10)
   */
  bodyId: number;
  /** 
   * Rendered size in pixels (default: 96px)
   * Note: Sprites are always 96x96px in the sheet, this scales the display
   */
  size?: number;
  /** 
   * Tooltip text shown on hover
   * Typically the Pokemon name or fusion name
   */
  title?: string;
};

// Sprite sheet layout constants
const SHEET_W = 960;  // Total width of sprite sheet (10 tiles × 96px)
const SHEET_H = 4896; // Total height of sprite sheet (51 tiles × 96px)
const COLS = 10;      // Number of columns in the grid layout
const ROWS = 51;      // Number of rows in the grid layout
const TILE = 96;      // Size of each individual sprite tile (96×96px)

/**
 * Component to display a Pokemon fusion sprite from a sprite sheet
 * 
 * Uses CSS background-position to show the correct tile from a large sprite sheet.
 * This is more efficient than loading 510 individual images per head Pokemon.
 * 
 * Features:
 * - Efficient rendering using single sprite sheet per head
 * - Graceful fallback for missing sprites
 * - Pixelated rendering for crisp pixel art
 * - Configurable display size
 * - Error handling for 404 sprite sheets
 * 
 * @example
 * // Display Bulbasaur (1) with Charmander (4) body
 * <SpriteTile headId={1} bodyId={4} size={128} title="Bulbasaur/Charmander" />
 */
export default function SpriteTile({ headId, bodyId, size = 96, title }: Props) {
  // Track if the sprite sheet failed to load (404 or network error)
  const [broken, setBroken] = useState(false);

  // Calculate which tile to show based on bodyId
  // Background-position uses negative offsets to shift the visible portion
  const { x, y } = useMemo(() => {
    // Grid layout: col = bodyId % 10, row = floor(bodyId / 10)
    // Note: First cell (0,0) in sheet is typically empty/placeholder
    const col = bodyId % COLS;
    const row = Math.floor(bodyId / COLS);
    
    // Negative offsets for CSS background-position
    // Example: bodyId=15 → col=5, row=1 → x=-480px, y=-96px
    return { x: -(col * TILE), y: -(row * TILE) };
  }, [bodyId]);

  const url = `/spriteless/${headId}.png`;

  // Fallback UI for missing sprite sheets
  if (broken) {
    return (
      <div
        title={title}
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          border: "1px solid #ddd",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          opacity: 0.7,
          backgroundColor: "#f5f5f5",
        }}
      >
        missing
      </div>
    );
  }

  return (
    <div
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        border: "1px solid #ddd",
        backgroundImage: `url(${url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${SHEET_W}px ${SHEET_H}px`, // Full sprite sheet size
        backgroundPosition: `${x}px ${y}px`,          // Offset to show correct tile
        imageRendering: "pixelated",                   // Crisp pixel art rendering
      }}
    >
      {/* Hidden image for error detection - triggers onError if sprite sheet 404s */}
      <img
        src={url}
        alt=""
        style={{ display: "none" }}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
