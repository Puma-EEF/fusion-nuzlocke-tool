import type { Move } from "../../lib/types/moves";
import MoveRowHover from "./MoveRowHover";

export type NormalizedLearnset = {
  levelUp: Array<{ level: number; move: string }>;
  tm: string[];
  hm: string[];
  tutor: string[];
  egg: string[];
  allMoves: string[];
};

type Props = {
  learnset: NormalizedLearnset;
  movesByInternal: Map<string, Move>;
  defaultOpen?: Partial<Record<"levelUp" | "tm" | "hm" | "tutor" | "egg", boolean>>;
  showUniqueCount?: boolean;
  title?: string;
};

function Section({
  label,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} style={{ marginTop: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>
        {label} ({count})
      </summary>
      <div style={{ marginTop: 8 }}>{children}</div>
    </details>
  );
}

export default function LearnsetViewer({
  learnset,
  movesByInternal,
  defaultOpen,
  showUniqueCount = true,
  title,
}: Props) {
  const open = {
    levelUp: defaultOpen?.levelUp ?? true,
    tm: defaultOpen?.tm ?? false,
    hm: defaultOpen?.hm ?? false,
    tutor: defaultOpen?.tutor ?? false,
    egg: defaultOpen?.egg ?? false,
  };

  return (
    <div>
      {title && <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>}

      {showUniqueCount && (
        <div style={{ marginBottom: 8, opacity: 0.8 }}>
          Unique moves: <b>{learnset.allMoves.length}</b>
        </div>
      )}

      <Section label="Level-up" count={learnset.levelUp.length} defaultOpen={open.levelUp}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {learnset.levelUp.map((m) => {
            const mv = movesByInternal.get(m.move);
            if (!mv) return null;
            return (
              <MoveRowHover
                key={`${m.level}-${m.move}`}
                move={mv}
                prefix={`Lv ${m.level}:`}
                compact
              />
            );
          })}
        </div>
      </Section>

      <Section label="TM" count={learnset.tm.length} defaultOpen={open.tm}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {learnset.tm.map((internal) => {
            const mv = movesByInternal.get(internal);
            if (!mv) return null;
            return <MoveRowHover key={internal} move={mv} compact />;
          })}
        </div>
      </Section>

      <Section label="HM" count={learnset.hm.length} defaultOpen={open.hm}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {learnset.hm.map((internal) => {
            const mv = movesByInternal.get(internal);
            if (!mv) return null;
            return <MoveRowHover key={internal} move={mv} compact />;
          })}
        </div>
      </Section>

      <Section label="Tutor" count={learnset.tutor.length} defaultOpen={open.tutor}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {learnset.tutor.map((internal) => {
            const mv = movesByInternal.get(internal);
            if (!mv) return null;
            return <MoveRowHover key={internal} move={mv} compact />;
          })}
        </div>
      </Section>

      <Section label="Egg" count={learnset.egg.length} defaultOpen={open.egg}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {learnset.egg.map((internal) => {
            const mv = movesByInternal.get(internal);
            if (!mv) return null;
            return <MoveRowHover key={internal} move={mv} compact />;
          })}
        </div>
      </Section>
    </div>
  );
}
