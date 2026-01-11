import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobCard from "../components/JobCard";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      const res = await getJobs({ page, q: search });

      // ✅ Backend response fix
      setJobs(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error("Failed loading jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [page, search]);

  return (
    <div style={{ padding: "15px" }}>

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search job or city..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* ⏳ Loading */}
      {loading && <p>Loading jobs...</p>}

      {/* ❌ No Jobs */}
      {!loading && jobs.length === 0 && <p>No jobs found</p>}

      {/* ✅ Job List */}
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}

      {/* 📄 Pagination */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

    </div>
  );
        }
