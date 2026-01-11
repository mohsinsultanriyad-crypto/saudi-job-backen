import { useState } from "react";
import { deleteJob } from "../services/jobApi";
import { removeViewedJob } from "../utils/viewedStore";

export default function JobDetailsModal({ job, onClose, onDeleted }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!email) return alert("Enter email to delete");
    try {
      setLoading(true);
      await deleteJob(job._id, email);

      // remove from viewed list too
      removeViewedJob(job._id);

      alert("Job deleted ✅");

      if (onDeleted) onDeleted(job._id);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Delete failed ❌ (email wrong?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <h2 style={{ margin: 0 }}>{job.jobRole}</h2>
          <button onClick={onClose} style={xbtn}>✖</button>
        </div>

        <p style={line}><b>City:</b> {job.city}</p>
        <p style={line}><b>Posted by:</b> {job.companyName || job.name}</p>
        <p style={line}><b>Phone:</b> {job.phone}</p>
        <p style={line}><b>Email:</b> {job.email}</p>

        <div style={{ marginTop: 10 }}>
          <b>Description:</b>
          <div style={desc}>{job.description}</div>
        </div>

        <hr style={{ margin: "14px 0" }} />

        <h3 style={{ margin: "0 0 8px 0" }}>Delete Job (Verify by Email)</h3>
        <input
          style={inp}
          placeholder="Enter same email used while posting"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleDelete} disabled={loading} style={delBtn}>
          {loading ? "Deleting..." : "Delete Job"}
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 100,
};

const modal = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 18,
  padding: 14,
};

const xbtn = {
  border: 0,
  background: "#f3f4f6",
  borderRadius: 10,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 900,
};

const line = { margin: "8px 0", color: "#111827" };

const desc = {
  marginTop: 6,
  padding: 10,
  borderRadius: 12,
  background: "#f9fafb",
  border: "1px solid #eef1f0",
  whiteSpace: "pre-wrap",
};

const inp = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  outline: "none",
};

const delBtn = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: 0,
  background: "#dc2626",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};
