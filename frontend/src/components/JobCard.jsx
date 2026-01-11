export default function JobCard({ job, onOpen }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: 14,
      boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
      border: "1px solid #eef1f0"
    }}>

      <div style={{fontSize:18,fontWeight:800}}>
        {job.jobRole}
      </div>

      <div style={{marginTop:6,color:"#16a34a",fontWeight:700}}>
        📍 {job.city}
      </div>

      <div style={{marginTop:6,color:"#6b7280"}}>
        Posted by: <b>{job.companyName || job.name}</b>
      </div>

      <div style={{textAlign:"right",marginTop:10}}>
        <button
          onClick={onOpen}
          style={{
            border:0,
            background:"transparent",
            color:"#16a34a",
            fontWeight:800
          }}>
          View Details →
        </button>
      </div>
    </div>
  );
}
