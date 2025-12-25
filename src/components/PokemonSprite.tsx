import { useMemo, useState } from "react";
import { getBaseSpriteUrl } from "../utils/sprites";

type Props = {
  id: number;
  name: string;
  size?: number;
  className?: string;
};

export default function PokemonSprite({ id, name, size = 48, className }: Props) {
  const [broken, setBroken] = useState(false);

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
