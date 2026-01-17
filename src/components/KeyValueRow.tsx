export default function KeyValueRow({
  k,
  v,
}: {
  k: string;
  v: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 10,
        padding: "6px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ fontWeight: 900, opacity: 0.75 }}>{k}</div>
      <div>{v}</div>
    </div>
  );
}
