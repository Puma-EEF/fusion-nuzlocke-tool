/**
 * Represents a Pokemon move with all its battle properties
 */
export type Move = {
  /** Unique identifier for the move */
  ID: number;
  /** Internal name used in the game code */
  InternalName: string;
  /** Display name of the move */
  Name: string;
  /** Elemental type of the move (e.g., Fire, Water, Grass) */
  Type: string;
  /** Category of the move: Physical, Special, or Status */
  Category: string;
  /** Base power of the move (0 for status moves) */
  Power: number;
  /** Accuracy percentage (0-100, or special values for always-hit moves) */
  Accuracy: number;
  /** Power Points - number of times the move can be used */
  PP: number;
  /** Description of what the move does */
  Description: string;
};
