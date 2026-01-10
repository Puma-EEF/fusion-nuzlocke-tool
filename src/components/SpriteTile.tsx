import { useMemo, useState } from "react";

type Props = {
  /** ID determining which sprite sheet to use from /spriteless/{headId}.png */
  headId: number;
  /** ID determining which tile position within the sheet (0-509) */
  bodyId: number;
  /** Rendered size in pixels (defaults to 96px) */
  size?: number;
  /** Tooltip text shown on hover */
  title?: string;
};

// Sprite sheet dimensions and layout constants
const SHEET_W = 960;  // Total width of sprite sheet
const SHEET_H = 4896; // Total height of sprite sheet
const COLS = 10;      // Number of columns in grid
const ROWS = 51;      // Number of rows in grid
const TILE = 96;      // Size of each individual sprite tile

/**
 * Component to display a Pokemon fusion sprite from a sprite sheet
 * Uses CSS background-position to show the correct tile from a large sprite sheet
 * Each head Pokemon has its own sprite sheet with all possible body combinations
 * Gracefully handles missing sprites with a fallback placeholder
 */
export default function SpriteTile({ headId, bodyId, size = 96, title }: Props) {
  // Track if the sprite sheet failed to load
  const [broken, setBroken] = useState(false);

  // Calculate which tile to show based on bodyId
  const { x, y } = useMemo(() => {
    // First cell in sheet is empty, so tileIndex directly equals bodyId
    const col = bodyId % COLS;
    const row = Math.floor(bodyId / COLS);
    // Negative offsets for background-position to show the correct tile
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
      {/* Preload check: if the sheet 404s, fall back */}
      <img
        src={url}
        alt=""
        style={{ display: "none" }}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
