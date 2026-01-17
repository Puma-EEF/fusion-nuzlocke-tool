export function getBaseSpriteUrl(id: number) {
  return `/sprites/base/${id}.png`;
}

export function getFusionSpriteUrl(headId: number, bodyId: number) {
  return `/sprites/fusions/${headId}.${bodyId}.png`;
}
