/**
 * Represents a Pokemon ability with its properties
 */
export type Ability = {
  /** Unique identifier for the ability */
  ID: number;
  /** Internal name used in the game code */
  InternalName: string;
  /** Display name of the ability */
  Name: string;
  /** Description of what the ability does */
  Description: string;
};
