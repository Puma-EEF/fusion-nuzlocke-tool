import { useMemo, useState } from "react";

type Props = {
  headId: number; // which sheet: /spriteless/{headId}.png
  bodyId: number; // which tile inside that sheet
  size?: number;  // rendered size on screen (defaults to 96)
  title?: string;
};

const SHEET_W = 960;
const SHEET_H = 4896;
const COLS = 10;
const ROWS = 51;
const TILE = 96;

export default function SpriteTile({ headId, bodyId, size = 96, title }: Props) {
  const [broken, setBroken] = useState(false);

  const { x, y } = useMemo(() => {
    // First cell is empty => tileIndex = bodyId
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
