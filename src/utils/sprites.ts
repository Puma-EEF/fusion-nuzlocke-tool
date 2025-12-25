export function getBaseSpriteUrl(id: number) {
  return `/sprites/base/${id}.png`;
}

export function getFusionSpriteUrl(headId: number, bodyId: number) {
  // optional for later, if you add fusion images
  return `/sprites/fusions/${headId}.${bodyId}.png`;
}
