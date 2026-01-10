/**
 * Get the URL for a base Pokemon sprite image
 * @param id - The Pokemon's Pokedex number
 * @returns URL path to the sprite image in the public folder
 */
export function getBaseSpriteUrl(id: number) {
  return `/sprites/base/${id}.png`;
}

/**
 * Get the URL for a fusion Pokemon sprite image
 * Optional feature for custom fusion sprites
 * @param headId - The Pokedex number of the head Pokemon
 * @param bodyId - The Pokedex number of the body Pokemon
 * @returns URL path to the fusion sprite (may not exist yet)
 */
export function getFusionSpriteUrl(headId: number, bodyId: number) {
  // optional for later, if you add fusion images
  return `/sprites/fusions/${headId}.${bodyId}.png`;
}
