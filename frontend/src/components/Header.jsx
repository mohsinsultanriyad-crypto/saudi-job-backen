export default function Header() {
  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#1c8b3c",
            display: "grid",
            placeItems: "center",
            color: "white",
            fontWeight: 700,
          }}
        >
          S
        </div>

        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 800, letterSpacing: 0.5 }}>
            SAUDI <span style={{ color: "#1c8b3c" }}>JOB</span>
            <span style={{ color: "#999", fontWeight: 600, marginLeft: 6 }}>
              KINGDOM OF SAUDI ARABIA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
