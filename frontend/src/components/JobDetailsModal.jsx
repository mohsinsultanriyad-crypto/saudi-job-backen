import { useState } from "react";
import { deleteJob, updateJob } from "../services/jobApi";
import { normalizeSaudiPhone, whatsappLink } from "../utils/phone";
import { formatDate } from "../utils/date";

export default function JobDetailsModal({ job, onClose, onChanged }) {
  const [mode, setMode] = useState("view"); // view | edit
  const [emailVerify, setEmailVerify] = useState("");
  const [loading, setLoading] = useState(false);

  // edit fields
  const [name, setName] = useState(job.name || "");
  const [companyName, setCompanyName] = useState(job.companyName || "");
  const [phone, setPhone] = useState(job.phone || "");
  const [city, setCity] = useState(job.city || "");
  const [jobRole, setJobRole] = useState(job.jobRole || "");
  const [description, setDescription] = useState(job.description || "");

  const callNow = () => {
    const p = normalizeSaudiPhone(phone);
    window.location.href = `tel:${p}`;
  };

  const whatsappNow = () => {
    const text = `Hi, I'm interested in your job:\nRole: ${jobRole}\nCity: ${city}\nPosted by: ${companyName || name}`;
    window.open(whatsappLink(phone, text), "_blank");
  };

  const handleDelete = async () => {
    if (!emailVerify.trim()) return alert("Enter email for verification.");
    try {
      setLoading(true);
      await deleteJob(job._id, emailVerify.trim());
      alert("Job deleted ✅");
      onChanged?.("deleted");
      onClose();
    } catch (e) {
      console.error(e);
      alert("Delete failed ❌ (email mismatch?)");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!emailVerify.trim()) return alert("Enter email for verification.");
    try {
      setLoading(true);
      await updateJob(job._id, {
        email: emailVerify.trim(),
        name,
        companyName,
        phone,
        city,
        jobRole,
        description,
      });
      alert("Job updated ✅");
      onChanged?.("updated");
      setMode("view");
    } catch (e) {
      console.error(e);
      alert("Update failed ❌ (email mismatch?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>{jobRole}</div>
            <div style={{ marginTop: 4, color: "#6b7280", fontWeight: 700 }}>📍 {city}</div>
            <div style={{ marginTop: 6, color: "#6b7280" }}>
              Posted: <b>{companyName || name}</b>
            </div>
            <div style={{ marginTop: 6, color: "#6b7280" }}>
              Date: <b>{formatDate(job.createdAt)}</b>
            </div>
          </div>

          <button onClick={onClose} style={xBtn}>✕</button>
        </div>

        {mode === "view" ? (
          <>
            <div style={{ marginTop: 12, color: "#111827", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {description}
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <div style={infoRow}><span style={label}>Name</span><span style={val}>{job.name}</span></div>
              <div style={infoRow}><span style={label}>Company</span><span style={val}>{job.companyName || "-"}</span></div>
              <div style={infoRow}><span style={label}>Phone</span><span style={val}>{job.phone}</span></div>
              <div style={infoRow}><span style={label}>Email</span><span style={val}>{job.email}</span></div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={btnGreen} onClick={callNow}>📞 Call</button>
              <button style={btnDark} onClick={whatsappNow}>💬 WhatsApp</button>
            </div>

            <div style={{ marginTop: 14, borderTop: "1px solid #eef1f0", paddingTop: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Edit / Delete (Email verify)</div>
              <input
                style={inp}
                placeholder="Enter your email (same used while posting)"
                value={emailVerify}
                onChange={(e) => setEmailVerify(e.target.value)}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button style={btnOutline} onClick={() => setMode("edit")}>✏️ Edit</button>
                <button style={btnRed} onClick={handleDelete} disabled={loading}>
                  {loading ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: 12, fontWeight: 900 }}>Edit Job</div>

            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <input style={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <input style={inp} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
              <input style={inp} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              <input style={inp} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
              <input style={inp} value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="Job Role" />
              <textarea style={{ ...inp, height: 120 }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            </div>

            <div style={{ marginTop: 10, fontWeight: 800 }}>Email verify</div>
            <input style={inp} value={emailVerify} onChange={(e) => setEmailVerify(e.target.value)} placeholder="Email" />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button style={btnOutline} onClick={() => setMode("view")}>← Back</button>
              <button style={btnGreen} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  zIndex: 50,
};

const modal = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
};

const xBtn = {
  border: 0,
  background: "#f3f4f6",
  width: 40,
  height: 40,
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 900,
};

const inp = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  outline: "none",
  background: "#fff",
  color: "#111827",
  fontSize: 14,
};

const btnGreen = {
  padding: "12px 14px",
  borderRadius: 14,
  border: 0,
  background: "#1c8b3c",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const btnDark = {
  padding: "12px 14px",
  borderRadius: 14,
  border: 0,
  background: "#111827",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const btnRed = {
  padding: "12px 14px",
  borderRadius: 14,
  border: 0,
  background: "#ef4444",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const btnOutline = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  fontWeight: 900,
  cursor: "pointer",
};

const infoRow = { display: "flex", justifyContent: "space-between", gap: 10 };
const label = { color: "#6b7280", fontWeight: 800 };
const val = { color: "#111827", fontWeight: 900 };
