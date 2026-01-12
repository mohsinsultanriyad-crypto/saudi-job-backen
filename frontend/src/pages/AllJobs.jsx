import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobDetailsModal from "../components/JobDetailsModal";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const limit = 30;

  const fetchJobs = async (p = 1, search = "") => {
    try {
      setLoading(true);
      const res = await getJobs({ page: p, limit, q: search });

      // ✅ IMPORTANT FIX
      const data = res?.data || {};
      const items = Array.isArray(data.items) ? data.items : [];

      setJobs(items);
      setPage(data.page || p);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.log("Fetch jobs error:", e?.message);
      setJobs([]);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1, "");
  }, []);

  return (
    <div style={{ padding: 16, paddingBottom: 90, background: "#f6f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search job or city..."
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 16,
            border: "1px solid #ddd",
            outline: "none",
            background: "#fff",
          }}
        />

        <button
          onClick={() => fetchJobs(1, q)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 14,
            borderRadius: 16,
            border: "1px solid #ddd",
            background: "#eee",
            fontWeight: 700,
          }}
        >
          Search
        </button>

        {loading ? (
          <div style={{ marginTop: 20, fontWeight: 700 }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{ marginTop: 20, fontWeight: 800, fontSize: 24 }}>No jobs found</div>
        ) : (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map((job) => (
              <button
                key={job._id}
                onClick={() => setSelectedJob(job)}
                style={{
                  textAlign: "left",
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid #eee",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800 }}>{job.jobRole || "Job"}</div>
                <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
                  {job.city || "-"} • {job.companyName || "-"}
                </div>
                <div style={{ marginTop: 8, color: "#777", fontSize: 13 }}>
                  {(job.description || "").slice(0, 120)}{job.description?.length > 120 ? "..." : ""}
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 18, display: "flex", gap: 14, justifyContent: "center", alignItems: "center" }}>
          <button
            disabled={page <= 1 || loading}
            onClick={() => fetchJobs(page - 1, q)}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid #ccc",
              background: "#fff",
              opacity: page <= 1 ? 0.4 : 1,
            }}
          >
            Prev
          </button>

          <div style={{ fontWeight: 800 }}>
            Page {page} / {totalPages}
          </div>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => fetchJobs(page + 1, q)}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid #ccc",
              background: "#fff",
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            Next
          </button>
        </div>
      </div>

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}