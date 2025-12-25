import evolutionsRaw from "../data/evolutions_if.json";

export type EvoEdge = {
  to: string;   // InternalName
  text: string; // human-readable condition
};

export type EvoMap = Record<string, EvoEdge[]>;

const evoMap = evolutionsRaw as EvoMap;

export function getForwardEvos(internalName: string): EvoEdge[] {
  return evoMap[internalName] ?? [];
}

export function buildReverseIndex(): Map<string, { from: string; text: string }[]> {
  const rev = new Map<string, { from: string; text: string }[]>();
  for (const [from, edges] of Object.entries(evoMap)) {
    for (const e of edges) {
      const arr = rev.get(e.to) ?? [];
      arr.push({ from, text: e.text });
      rev.set(e.to, arr);
    }
  }
  return rev;
}
