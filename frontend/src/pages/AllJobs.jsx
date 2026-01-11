import { useEffect, useState } from "react";
import { getJobs } from "../services/jobApi";
import JobCard from "../components/JobCard";
import JobDetailsModal from "../components/JobDetailsModal";
import { addViewedJob } from "../utils/viewedStore";
import AdBanner from "../components/AdBanner";

export default function AllJobs() {
  const [jobs,setJobs] = useState([]);
  const [selected,setSelected] = useState(null);

  useEffect(()=>{
    load();
  },[]);

  async function load(){
    const res = await getJobs();
    setJobs(res.data);
  }

  return (
    <div style={{padding:14}}>

      <h2 style={{marginBottom:10}}>Explore Jobs</h2>

      <AdBanner/>

      <div style={{marginTop:14,display:"grid",gap:12}}>
        {jobs.map(job=>(
          <JobCard
            key={job._id}
            job={job}
            onOpen={()=>{
              setSelected(job);
              addViewedJob(job);
            }}
          />
        ))}
      </div>

      {selected &&
        <JobDetailsModal
          job={selected}
          onClose={()=>setSelected(null)}
        />
      }
    </div>
  );
}
