import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobDetailsModal from "../components/JobDetailsModal";
import { addViewedJob } from "../utils/viewedStore";
import { formatDate } from "../utils/date";
import Header from "../components/Header";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 30;
  const [hasMore, setHasMore] = useState(false);

  const load = async (pageToLoad = 1, append = false) => {
    setLoading(true);
    try {
      const res = await getJobs({ page: pageToLoad, limit, q: query });

      const items = res.data.items || [];
      setJobs((prev) => (append ? [...prev, ...items] : items));

      const currentPage = res.data.page || pageToLoad;
      const totalPages = res.data.totalPages || 1;

      setPage(currentPage);
      setHasMore(totalPages > currentPage);
    } catch (e) {
      console.error(e);
      alert("Backend not reachable. Check server / deploy URL.");
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => load(1, false), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => jobs, [jobs]);

  return (
    <div style={pageWrap}>
      {/* ✅ Header Added */}
      <Header />

      <div style={topRow}>
        <h1 style={h1}>Explore Jobs</h1>
        <button onClick={() => load(1, false)} style={iconBtn} title="Refresh">
          ↻
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={searchBox}>
          <span style={{ marginRight: 8, color: "#94a3b8" }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role / city / company..."
            style={searchInput}
          />
        </div>
      </div>

      {loading && (
        <p style={{ marginTop: 14, color: "#6b7280", fontWeight: 700 }}>
          Loading...
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <p style={{ marginTop: 14, color: "#6b7280", fontWeight: 700 }}>
          No job available
        </p>
      )}

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {filtered.map((job) => (
          <div key={job._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={role}>{job.jobRole}</div>

                <div style={metaRow}>
                  <span style={pill}>📍 {job.city}</span>
                  <span style={pill}>🗓 {formatDate(job.createdAt)}</span>
                </div>

                <div style={postedBy}>
                  Posted by:{" "}
                  <b style={{ color: "#111827" }}>
                    {job.companyName || job.name}
                  </b>
                </div>
              </div>

              <button
                style={viewBtn}
                onClick={() => {
                  setSelected(job);
                  addViewedJob(job);
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          style={loadMore}
          disabled={loading}
          onClick={() => load(page + 1, true)}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {selected && (
        <JobDetailsModal
          job={selected}
          onClose={() => setSelected(null)}
          onChanged={() => load(1, false)}
        />
      )}
    </div>
  );
}

/* ✅ Styles */
const pageWrap = {
  padding: 16,
  paddingBottom: 90,
  minHeight: "100vh",
  background: "#ffffff",
};

const topRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 10,
};

const h1 = { margin: 0, fontSize: 30, fontWeight: 950, color: "#0f172a" };

const iconBtn = {
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  borderRadius: 14,
  width: 44,
  height: 44,
  fontSize: 18,
  cursor: "pointer",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: "10px 12px",
  background: "#f8fafc",
};

const searchInput = {
  border: 0,
  outline: 0,
  width: "100%",
  background: "transparent",
  fontSize: 14,
};

const card = {
  border: "1px solid #eef2f7",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const role = {
  fontWeight: 950,
  fontSize: 18,
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const metaRow = { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" };

const pill = {
  fontSize: 12,
  fontWeight: 900,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#0f172a",
};

const postedBy = {
  marginTop: 10,
  color: "#64748b",
  fontWeight: 800,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

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

const loadMore = {
  marginTop: 14,
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};