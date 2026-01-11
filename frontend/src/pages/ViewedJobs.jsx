import { useEffect, useState } from "react";
import JobDetailsModal from "../components/JobDetailsModal";
import { getViewedJobs, removeViewedJob } from "../utils/viewedStore";
import { formatDate } from "../utils/date";

export default function ViewedJobs() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  const reload = () => setList(getViewedJobs());

  useEffect(() => { reload(); }, []);

  return (
    <div style={{ padding: 16, paddingBottom: 90, minHeight: "100vh", background: "#fff" }}>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950, color: "#0f172a" }}>Viewed Jobs</h1>

      {list.length === 0 && (
        <p style={{ marginTop: 14, color: "#6b7280", fontWeight: 700 }}>No viewed jobs yet.</p>
      )}

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {list.map((job) => (
          <div key={job._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={role}>{job.jobRole}</div>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={pill}>📍 {job.city}</span>
                  <span style={pill}>🗓 {formatDate(job.createdAt)}</span>
                </div>
                <div style={postedBy}>
                  Posted by: <b style={{ color: "#111827" }}>{job.companyName || job.name}</b>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <button style={viewBtn} onClick={() => setSelected(job)}>View</button>
                <button
                  style={removeBtn}
                  onClick={() => { removeViewedJob(job._id); reload(); }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <JobDetailsModal
          job={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

const card = {
  border: "1px solid #eef2f7",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const role = { fontWeight: 950, fontSize: 18, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const pill = { fontSize: 12, fontWeight: 900, padding: "6px 10px", borderRadius: 999, background: "#f1f5f9", color: "#0f172a" };
const postedBy = { marginTop: 10, color: "#64748b", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

const viewBtn = {
  border: 0,
  background: "#1c8b3c",
  color: "#fff",
  fontWeight: 950,
  borderRadius: 14,
  padding: "12px 14px",
  cursor: "pointer",
  height: 44,
};

const removeBtn = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  fontWeight: 950,
  borderRadius: 14,
  padding: "12px 14px",
  cursor: "pointer",
  height: 44,
};
