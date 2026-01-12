import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobCard from "../components/JobCard";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);

  async function load() {
    try {
      const { data } = await getJobs();
      setJobs(data.items || []); // safe
    } catch (e) {
      console.error("Load failed", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ paddingBottom: 60 }}>
      {jobs.length === 0 ? (
        <h3 style={{ textAlign: "center", marginTop: 30 }}>
          No jobs found
        </h3>
      ) : (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
}