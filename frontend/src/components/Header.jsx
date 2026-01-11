export default function Header() {
  return (
    <div style={wrap}>
      <div style={row}>
        <div style={logoBox}>S</div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div style={brand}>
            <span style={{ color: "#111827" }}>SAUDI </span>
            <span style={{ color: "#16a34a" }}>JOB</span>
          </div>

          <div style={tagline}>KINGDOM OF SAUDI ARABIA</div>
        </div>
      </div>

      <div style={divider} />
    </div>
  );
}

const wrap = {
  padding: "14px 16px 0px",
  background: "#fff",
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const logoBox = {
  width: 56,
  height: 56,
  borderRadius: 14,
  background: "#16a34a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 900,
  fontSize: 28,
};

const brand = {
  fontSize: 34,
  fontWeight: 900,
  letterSpacing: 1,
  lineHeight: 1,
};

const tagline = {
  fontSize: 16,
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: 2,
};

const divider = {
  marginTop: 12,
  height: 1,
  background: "#eef2f7",
};