import { useMemo, useState } from "react";
import { getBaseSpriteUrl } from "../utils/sprites";

type Props = {
  /** Pokedex number of the Pokemon */
  id: number;
  /** Name for alt text accessibility */
  name: string;
  /** Size in pixels (width and height), defaults to 48 */
  size?: number;
  /** Optional CSS class name */
  className?: string;
};

/**
 * Component to display a base Pokemon sprite
 * Handles missing sprites gracefully with a fallback placeholder
 * Uses pixelated rendering for retro sprite aesthetic
 */
export default function PokemonSprite({ id, name, size = 48, className }: Props) {
  // Track if the sprite failed to load
  const [broken, setBroken] = useState(false);

  // Use placeholder if sprite is broken, otherwise use base sprite URL
  const src = useMemo(() => {
    return broken ? "/sprites/placeholder.png" : getBaseSpriteUrl(id);
  }, [broken, id]);

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
