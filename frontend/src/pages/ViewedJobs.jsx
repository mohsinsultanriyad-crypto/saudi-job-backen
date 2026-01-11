import { useEffect, useState } from "react";
import { getViewedJobs } from "../utils/viewedStore";
import JobDetailsModal from "../components/JobDetailsModal";

export default function ViewedJobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => setJobs(getViewedJobs());

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Viewed Jobs</h1>

      {jobs.length === 0 ? (
        <p style={{ marginTop: 12, color: "#6b7280" }}>No viewed jobs yet.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {jobs.map((job) => (
            <div key={job._id} style={card} onClick={() => setSelected(job)}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{job.jobRole}</div>
              <div style={{ marginTop: 8, color: "#6b7280", fontWeight: 700 }}>
                📍 {job.city}
              </div>
              <div style={{ marginTop: 6, color: "#6b7280" }}>
                Posted by: <b>{job.companyName || job.name}</b>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#9aa3af" }}>
                Tap to view details
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <JobDetailsModal
          job={selected}
          onClose={() => setSelected(null)}
          onDeleted={(id) => setJobs((prev) => prev.filter((j) => j._id !== id))}
        />
      )}
    </div>
  );
}

const card = {
  border: "1px solid #eef1f0",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  cursor: "pointer",
  background: "#fff",
};
