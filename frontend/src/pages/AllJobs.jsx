import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";

export default function AllJobs() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load(p = page, search = q) {
    try {
      setLoading(true);
      setErr("");

      const res = await getJobs({ page: p, limit: 30, q: search });

      // ✅ IMPORTANT: backend returns { items, page, totalPages, total }
      const data = res?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || p);
    } catch (e) {
      console.error("GET /jobs failed:", e);
      setErr(e?.response?.data?.message || e.message || "Failed to load jobs");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => load(1, q);

  return (
    <div style={{ padding: 16 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search job or city..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #ddd",
          marginBottom: 12,
        }}
      />

      <button
        onClick={onSearch}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "none",
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        Search
      </button>

      {loading && <div>Loading...</div>}
      {!!err && <div style={{ color: "red" }}>{err}</div>}

      {!loading && items.length === 0 && !err && (
        <h3>No jobs found</h3>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              padding: 12,
              background: "#fff",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {job.jobRole || "Job"}
            </div>
            <div style={{ opacity: 0.8 }}>
              {job.city || ""} {job.companyName ? `• ${job.companyName}` : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              {job.description || ""}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>
              {job.name ? `Posted by: ${job.name}` : ""}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <button
          disabled={page <= 1 || loading}
          onClick={() => load(page - 1, q)}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Prev
        </button>

        <div>
          Page {page} / {totalPages}
        </div>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => load(page + 1, q)}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}