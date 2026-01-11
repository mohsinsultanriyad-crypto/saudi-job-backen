import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobCard from "../components/JobCard";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    try {
      const { data } = await getJobs();
      setJobs(data.items); // ✅ FIXED
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ paddingBottom: 60 }}>
      {jobs.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>No jobs found</h3>
      ) : (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
}
