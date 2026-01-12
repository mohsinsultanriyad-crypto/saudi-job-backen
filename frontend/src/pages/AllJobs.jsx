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

  async function fetchJobs(p = page, search = q) {
    try {
      setLoading(true);

      // ✅ IMPORTANT: backend returns { items, page, totalPages, total }
      const res = await getJobs({ page: p, limit, q: search });

      const data = res?.data || {};
      const items = Array.isArray(data.items) ? data.items : [];

      setJobs(items);
      setPage(data.page || p);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.log("Fetch Jobs Error:", err?.message);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchJobs(1, q);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Search */}
        <input
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base outline-none"
          placeholder="Search job or city..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="mt-3 w-full rounded-2xl bg-gray-100 py-3 font-semibold"
        >
          Search
        </button>

        {/* Status */}
        {loading ? (
          <div className="mt-6 text-lg font-semibold">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="mt-6 text-2xl font-bold">No jobs found</div>
        ) : (
          <div className="mt-5 space-y-3">
            {jobs.map((job) => (
              <button
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className="w-full text-left rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
              >
                <div className="text-lg font-bold">{job.jobRole || "Job"}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {job.city || ""} • {job.companyName || ""}
                </div>
                <div className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {job.description || ""}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            className="rounded-xl border px-5 py-2 disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => fetchJobs(page - 1, q)}
          >
            Prev
          </button>

          <div className="font-semibold">
            Page {page} / {totalPages}
          </div>

          <button
            className="rounded-xl border px-5 py-2 disabled:opacity-40"
            disabled={page >= totalPages || loading}
            onClick={() => fetchJobs(page + 1, q)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}