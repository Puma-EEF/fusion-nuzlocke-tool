import { useMemo, useState } from "react";
import speciesRaw from "../data/species.json";
import type { Species } from "../types/species";
import { fusePokemon } from "../lib/fusion";
import SpriteTile from "../components/SpriteTile";

const speciesList = (speciesRaw as Species[]).filter((s) => s.Form === 0);

function findByNameOrInternal(input: string): Species | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;

  return (
    speciesList.find((s) => s.Name.toLowerCase() === q) ??
    speciesList.find((s) => s.InternalName.toLowerCase() === q) ??
    speciesList.find((s) => s.Name.toLowerCase().includes(q)) ??
    null
  );
}

function FusionCard({
  title,
  head,
  body,
}: {
  title: string;
  head: Species;
  body: Species;
}) {
  const result = useMemo(() => fusePokemon(head, body), [head, body]);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 14, padding: 14 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SpriteTile
          headId={result.head.ID}
          bodyId={result.body.ID}
          title={`${result.head.Name} / ${result.body.Name}`}
        />

        <div>
          <div style={{ fontWeight: 700 }}>
            {result.head.Name} (Head) + {result.body.Name} (Body)
          </div>
          <div style={{ opacity: 0.75 }}>
            Types: {result.types.type1}
            {result.types.type2 ? ` / ${result.types.type2}` : ""}
          </div>
          <div style={{ opacity: 0.75 }}>BST: {result.bst}</div>
        </div>
      </div>

      <h3>Base Stats</h3>
      <ul>
        <li>HP: {result.stats.hp}</li>
        <li>Atk: {result.stats.atk}</li>
        <li>Def: {result.stats.def}</li>
        <li>SpA: {result.stats.spa}</li>
        <li>SpD: {result.stats.spd}</li>
        <li>Spe: {result.stats.spe}</li>
      </ul>
    </div>
  );
}

export default function FusionCalculator() {
  const [aText, setAText] = useState("Bulbasaur");
  const [bText, setBText] = useState("Charmander");

  const A = useMemo(() => findByNameOrInternal(aText), [aText]);
  const B = useMemo(() => findByNameOrInternal(bText), [bText]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Fusion Calculator</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontWeight: 700 }}>Pokémon A</label>
          <input
            value={aText}
            onChange={(e) => setAText(e.target.value)}
            list="species-list"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            placeholder="Type a Pokémon name…"
          />
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            Found: {A ? `${A.Name} (#${A.ID})` : "—"}
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 700 }}>Pokémon B</label>
          <input
            value={bText}
            onChange={(e) => setBText(e.target.value)}
            list="species-list"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            placeholder="Type a Pokémon name…"
          />
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            Found: {B ? `${B.Name} (#${B.ID})` : "—"}
          </div>
        </div>

        <datalist id="species-list">
          {speciesList.map((s) => (
            <option key={s.ID} value={s.Name} />
          ))}
        </datalist>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {!A || !B ? (
        <p>Pick a valid Pokémon A and Pokémon B.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FusionCard title="Fusion A → B" head={A} body={B} />
          <FusionCard title="Fusion B → A" head={B} body={A} />
        </div>
      )}
    </div>
  );
}
