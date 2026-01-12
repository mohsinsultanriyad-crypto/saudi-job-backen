
export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div style={{ width: "100%", maxWidth: 720, background: "#fff", borderRadius: 24, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{job.jobRole || "Job Details"}</div>
          <button
            onClick={onClose}
            style={{ padding: "10px 14px", borderRadius: 14, border: "1px solid #ddd", background: "#f3f3f3" }}
          >
            Close
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
          <div><b>City:</b> {job.city || "-"}</div>
          <div><b>Company:</b> {job.companyName || "-"}</div>
          <div><b>Name:</b> {job.name || "-"}</div>
          <div><b>Phone:</b> {job.phone || "-"}</div>
          <div><b>Email:</b> {job.email || "-"}</div>

          <div style={{ marginTop: 10 }}>
            <b>Description:</b>
            <div style={{ marginTop: 6, whiteSpace: "pre-wrap", color: "#444" }}>
              {job.description || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}