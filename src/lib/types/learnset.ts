/**
 * Represents the moves a Pokemon can learn through various methods
 */
export type Learnset = {
  /** Unique identifier for the Pokemon */
  ID: number;
  /** Internal name used in the game code */
  InternalName: string;
  /** Display name of the Pokemon */
  Name: string;
  /** Form variation number (0 for base form) */
  Form: number;

  /** 
   * Encoded string of level-up moves
   * Format: "1:MOVE|4:MOVE|..." where number is the level required
   */
  LevelUp: string;
  /** 
   * Encoded string of tutor moves
   * Format: "MOVE|MOVE|..."
   */
  TutorMoves: string;
    /** 
   * Encoded string of TM moves
   * Format: "MOVE|MOVE|..."
   */
  TMMoves: string;
    /** 
   * Encoded string of HM moves
   * Format: "MOVE|MOVE|..."
   */
  HMMoves: string;
  /** 
   * Encoded string of egg moves (moves learned through breeding)
   * Format: "MOVE|MOVE|..."
   */
  EggMoves: string;
};
