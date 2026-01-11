import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // 2 second baad home redirect
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "70vh",
      textAlign: "center"
    }}>

      <div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#e8f9f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
      }}>
        <span style={{ fontSize: 40, color: "#16a34a" }}>✓</span>
      </div>

      <h2>Success!</h2>
      <p>Your job post is now live for all users across the Kingdom.</p>
      <p style={{ marginTop: 10, color: "#777" }}>
        Returning to global listings...
      </p>
    </div>
  );
}
