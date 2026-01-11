import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div style={bar}>
      <NavLink to="/" style={({ isActive }) => link(isActive)}>🏠<div style={txt}>All Jobs</div></NavLink>
      <NavLink to="/post" style={({ isActive }) => link(isActive)}>➕<div style={txt}>Post</div></NavLink>
      <NavLink to="/viewed" style={({ isActive }) => link(isActive)}>👁<div style={txt}>Viewed</div></NavLink>
      <NavLink to="/notify" style={({ isActive }) => link(isActive)}>🔔<div style={txt}>Notify</div></NavLink>
    </div>
  );
}

const bar = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  height: 70,
  background: "#ffffff",
  borderTop: "1px solid #eef2f7",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  alignItems: "center",
  paddingBottom: 6,
};

const link = (active) => ({
  textDecoration: "none",
  color: active ? "#1c8b3c" : "#0f172a",
  fontWeight: 950,
  display: "grid",
  placeItems: "center",
  gap: 2,
  fontSize: 20,
});

const txt = { fontSize: 11, fontWeight: 950 };
