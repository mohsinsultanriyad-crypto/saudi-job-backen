import { useEffect, useState } from "react";

const ROLES = [
  "Helper",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Welder",
  "Driver",
  "AC Technician",
  "Cleaner",
  "Mason",
  "Steel Fixer",
  "Pipe Fitter",
  "Forklift Operator",
  "Safety Officer",
  "Supervisor",
];

export default function Notify() {
  const [enabled, setEnabled] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(["Plumber"]); // ✅ multi roles

  useEffect(() => {
    const savedEnabled = localStorage.getItem("notify-enabled") === "true";

    // ✅ saved roles (array)
    let savedRoles = [];
    try {
      savedRoles = JSON.parse(localStorage.getItem("notify-roles") || "[]");
    } catch {
      savedRoles = [];
    }
    if (!Array.isArray(savedRoles) || savedRoles.length === 0) savedRoles = ["Plumber"];

    setEnabled(savedEnabled);
    setSelectedRoles(savedRoles);

    // ✅ fixed time stored silently (no UI)
    if (!localStorage.getItem("notify-time")) {
      localStorage.setItem("notify-time", "09:00"); // fixed 9 AM
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported in this browser.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) return prev.filter((r) => r !== role);
      return [...prev, role];
    });
  };

  const selectAll = () => setSelectedRoles([...ROLES]);
  const clearAll = () => setSelectedRoles([]);

  const handleSave = async () => {
    if (enabled) {
      const ok = await requestPermission();
      if (!ok) {
        alert("Permission denied ❌. Please allow notifications.");
        return;
      }

      if (selectedRoles.length === 0) {
        alert("At least 1 role select karo ✅");
        return;
      }
    }

    localStorage.setItem("notify-enabled", String(enabled));
    localStorage.setItem("notify-roles", JSON.stringify(selectedRoles));

    // ✅ fixed time (no UI)
    localStorage.setItem("notify-time", "09:00"); // fixed 9 AM

    alert("Saved ✅");
  };

  return (
    <div style={page}>
      <h1 style={title}>Notifications</h1>
      <p style={sub}>
        Offline daily reminder (Role based). Real push (FCM) we will add later for{" "}
        <b>"new job posted"</b>.
      </p>

      <div style={card}>
        {/* Enable switch */}
        <div style={row}>
          <div>
            <div style={label}>Enable Daily Reminder</div>
          </div>

          <label style={switchWrap}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              style={switchInput}
            />
            <span style={{ ...switchUI, background: enabled ? "#22c55e" : "#e5e7eb" }}>
              <span
                style={{
                  ...knob,
                  transform: enabled ? "translateX(24px)" : "translateX(0px)",
                }}
              />
            </span>
          </label>
        </div>

        {/* Roles */}
        <div style={{ marginTop: 14 }}>
          <div style={label}>Select Job Roles (Multiple)</div>

          <div style={actions}>
            <button style={smallBtn} onClick={selectAll} type="button">
              Select All
            </button>
            <button style={smallBtnGray} onClick={clearAll} type="button">
              Clear
            </button>
          </div>

          <div style={rolesGrid}>
            {ROLES.map((r) => {
              const checked = selectedRoles.includes(r);
              return (
                <label key={r} style={{ ...roleItem, borderColor: checked ? "#22c55e" : "#e5e7eb" }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRole(r)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ fontWeight: 900, color: "#111827" }}>{r}</span>
                </label>
              );
            })}
          </div>

          {/* Selected preview */}
          <div style={preview}>
            Selected:{" "}
            {selectedRoles.length ? (
              selectedRoles.map((r) => (
                <span key={r} style={pill}>
                  {r}
                </span>
              ))
            ) : (
              <b style={{ color: "#ef4444" }}>None</b>
            )}
          </div>
        </div>

        <button onClick={handleSave} style={btn}>
          Save
        </button>

        <div style={note}>
          ✅ Time option removed. Reminder uses fixed time: <b>09:00 AM</b>
        </div>
      </div>
    </div>
  );
}

/* styles */
const page = {
  padding: 16,
  paddingBottom: 90,
  background: "#ffffff",
  minHeight: "100vh",
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: 950,
  color: "#111827",
};

const sub = {
  marginTop: 6,
  marginBottom: 14,
  color: "#6b7280",
  fontWeight: 700,
};

const card = {
  background: "#ffffff",
  border: "1px solid #eef1f0",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
};

const row = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const label = {
  fontSize: 14,
  fontWeight: 900,
  color: "#111827",
  marginBottom: 8,
};

const btn = {
  marginTop: 14,
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: 0,
  background: "#1c8b3c",
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
};

const note = {
  marginTop: 10,
  fontSize: 12,
  color: "#64748b",
  fontWeight: 800,
};

const actions = {
  display: "flex",
  gap: 10,
  marginBottom: 10,
};

const smallBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #bbf7d0",
  background: "#dcfce7",
  fontWeight: 950,
  cursor: "pointer",
};

const smallBtnGray = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  fontWeight: 950,
  cursor: "pointer",
};

const rolesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
};

const roleItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#fff",
};

const preview = {
  marginTop: 12,
  fontSize: 12,
  color: "#64748b",
  fontWeight: 900,
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

const pill = {
  fontSize: 12,
  fontWeight: 950,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#0f172a",
};

/* switch */
const switchWrap = {
  position: "relative",
  width: 54,
  height: 30,
  display: "inline-block",
};

const switchInput = {
  opacity: 0,
  width: 0,
  height: 0,
};

const switchUI = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 999,
  transition: "0.2s",
};

const knob = {
  position: "absolute",
  top: 3,
  left: 3,
  width: 24,
  height: 24,
  borderRadius: 999,
  background: "#fff",
  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  transition: "0.2s",
};
