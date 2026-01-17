/**
 * Sprite Tile Component
 * 
 * Efficient Pokemon fusion sprite renderer using sprite sheet positioning.
 * Renders a specific Pokemon fusion by extracting the correct tile from a large sprite sheet.
 * 
 * @module components/SpriteTile
 * 
 * ## Sprite Sheet System
 * 
 * **Format:**
 * - Location: `/public/spriteless/{headId}.png`
 * - Dimensions: 960×4896px (each head Pokemon has one sheet)
 * - Grid: 10 columns × 51 rows = 510 tiles
 * - Tile size: 96×96px
 * 
 * **How it works:**
 * 1. Load sprite sheet for head Pokemon
 * 2. Calculate tile position based on body ID
 * 3. Use CSS `background-position` to show correct tile
 * 4. Scale using `image-rendering: pixelated` for crisp pixel art
 * 
 * **Benefits:**
 * - 1 HTTP request instead of 510 (massive performance gain)
 * - Browser caching optimizes repeat views
 * - Instant sprite switching without loading delays
 * - Efficient memory usage
 * 
 * @example
 * // Display Bulbasaur (1) with Charmander (4) body
 * <SpriteTile headId={1} bodyId={4} size={128} title="Bulbasaur/Charmander" />
 */

import { useMemo, useState } from "react";

/**
 * Component props for SpriteTile
 * @property headId - Pokedex number of the head Pokemon (determines which sprite sheet to load)
 * @property bodyId - Pokedex number of the body Pokemon (determines tile position in sheet)
 * @property size - Display size in pixels (default: 96)
 * @property title - Tooltip text on hover
 */
type Props = {
  headId: number;
  bodyId: number;
  size?: number;
  title?: string;
};

// Sprite sheet dimensions and layout constants
const SHEET_W = 960;
const SHEET_H = 4896;
const COLS = 10;
const ROWS = 51;
const TILE = 96;

/**
 * Sprite Tile Component Implementation
 * 
 * Renders a Pokemon fusion sprite by:
 * 1. Loading the sprite sheet for the head Pokemon
 * 2. Calculating tile position based on body ID
 * 3. Using CSS background-position to display the correct tile
 * 4. Scaling to requested size while maintaining pixel art quality
 * 
 * Gracefully handles missing sprite sheets with a fallback placeholder.
 */
export default function SpriteTile({ headId, bodyId, size = 96, title }: Props) {
  const [broken, setBroken] = useState(false);

  // Calculate tile position in sprite sheet based on body ID
  const { x, y } = useMemo(() => {
    const col = bodyId % COLS;
    const row = Math.floor(bodyId / COLS);
    return { x: -(col * TILE), y: -(row * TILE) };
  }, [bodyId]);

  const url = `/spriteless/${headId}.png`;

  // Fallback display when sprite sheet fails to load
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

  // Render sprite using CSS background-position trick
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
        backgroundSize: `${SHEET_W}px ${SHEET_H}px`, // Scale sheet to actual size
        backgroundPosition: `${x}px ${y}px`, // Position to show correct tile
        imageRendering: "pixelated", // Crisp pixel art (no anti-aliasing)
      }}
    >
      {/* Hidden img element for error detection */}
      <img
        src={url}
        alt=""
        style={{ display: "none" }}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
