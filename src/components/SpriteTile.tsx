/**
 * Sprite Tile - Display Pokemon fusion sprite from sprite sheet using CSS positioning
 * Sprite sheets are 960x4896px (10x51 grid of 96x96px tiles) at /spriteless/{headId}.png
 */

import { useMemo, useState } from "react";

type Props = {
  headId: number;
  bodyId: number;
  size?: number;
  title?: string;
};

const SHEET_W = 960;
const SHEET_H = 4896;
const COLS = 10;
const ROWS = 51;
const TILE = 96;

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
  const [broken, setBroken] = useState(false);

  const { x, y } = useMemo(() => {
    const col = bodyId % COLS;
    const row = Math.floor(bodyId / COLS);
    return { x: -(col * TILE), y: -(row * TILE) };
  }, [bodyId]);

  const url = `/spriteless/${headId}.png`;

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
        backgroundSize: `${SHEET_W}px ${SHEET_H}px`,
        backgroundPosition: `${x}px ${y}px`,
        imageRendering: "pixelated",
      }}
    >
      <img
        src={url}
        alt=""
        style={{ display: "none" }}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
