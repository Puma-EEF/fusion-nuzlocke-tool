export type Learnset = {
  ID: number;
  InternalName: string;
  Name: string;
  Form: number;

  // Encoded strings from your JSON:
  // LevelUp: "1:MOVE|4:MOVE|..."
  LevelUp: string;
  TutorMoves: string; // "MOVE|MOVE|..."
  EggMoves: string;   // "MOVE|MOVE|..."
};
