import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const linkStyle = ({ isActive }) => ({
    flex: 1,
    textAlign: "center",
    padding: "10px 0",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 12,
    color: isActive ? "#1c8b3c" : "#9aa3af",
  });

  const bar = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    borderTop: "1px solid #eef1f0",
    display: "flex",
    paddingBottom: 6,
    paddingTop: 6,
    zIndex: 60,
  };

  const icon = { display: "block", fontSize: 18, marginBottom: 4 };

  return (
    <div style={bar}>
      <NavLink to="/" style={linkStyle} end>
        <span style={icon}>🧾</span>
        All Jobs
      </NavLink>

      <NavLink to="/post" style={linkStyle}>
        <span style={icon}>➕</span>
        Post Job
      </NavLink>

      <NavLink to="/viewed" style={linkStyle}>
        <span style={icon}>👁️</span>
        Viewed
      </NavLink>

      <NavLink to="/notifications" style={linkStyle}>
        <span style={icon}>🔔</span>
        Alerts
      </NavLink>
    </div>
  );
}
