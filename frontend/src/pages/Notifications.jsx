import { useEffect, useState } from "react";
import { getNotifyRoles, setNotifyRoles } from "../utils/notifyStore";

const ROLES = [
  "Painter",
  "Electrician",
  "Plumber",
  "Welder",
  "Helper",
  "Driver",
  "Pipe Fitter",
  "Pipe Fabricator",
  "AC Technician",
  "Carpenter",
];

export default function Notifications() {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(getNotifyRoles());
  }, []);

  const toggle = (role) => {
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const save = () => {
    setNotifyRoles(selected);
    alert("Notification roles saved ✅");
  };

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Notifications</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>
        Select roles you want alerts for (global jobs).
      </p>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {ROLES.map((r) => (
          <label key={r} style={item}>
            <input
              type="checkbox"
              checked={selected.includes(r)}
              onChange={() => toggle(r)}
            />
            <span style={{ fontWeight: 800 }}>{r}</span>
          </label>
        ))}
      </div>

      <button onClick={save} style={btn}>
        Save
      </button>
    </div>
  );
}

const item = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  border: "1px solid #eef1f0",
  borderRadius: 14,
  padding: 12,
  background: "#fff",
};

const btn = {
  marginTop: 14,
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: 0,
  background: "#1c8b3c",
  color: "white",
  fontWeight: 900,
};
