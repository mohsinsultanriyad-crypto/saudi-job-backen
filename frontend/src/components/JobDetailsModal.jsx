import React, { useMemo, useState } from "react";
import { deleteJob } from "../services/jobApi";

// Optional helpers (agar tumhare project me exist karte hain)
// Agar ye files nahi hain to in imports ko hata dena
// import { normalizeSaudiPhone, whatsappLink } from "../utils/phone";
// import { formatDate } from "../utils/date";

export default function JobDetailsModal({ open, onClose, job, onDeleted }) {
  const [email, setEmail] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");

  const createdAtText = useMemo(() => {
    if (!job?.createdAt) return "";
    try {
      return new Date(job.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [job?.createdAt]);

  if (!open || !job) return null;

  async function handleDelete() {
    setError("");
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    if (!email.trim()) {
      setError("Delete ke liye Email required hai.");
      return;
    }

    try {
      setLoadingDelete(true);
      await deleteJob(job._id, email.trim());

      // parent ko inform
      if (typeof onDeleted === "function") onDeleted(job._id);

      // close modal
      if (typeof onClose === "function") onClose();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Delete failed. Please try again.";
      setError(msg);
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{job.jobRole || "Job Details"}</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <Row label="Company" value={job.companyName} />
          <Row label="Name" value={job.name} />
          <Row label="City" value={job.city} />
          <Row label="Phone" value={job.phone} />
          <Row label="Email" value={job.email} />

          {createdAtText ? <Row label="Posted" value={createdAtText} /> : null}

          <div style={{ marginTop: 12 }}>
            <div style={styles.label}>Description</div>
            <div style={styles.desc}>
              {job.description ? job.description : "—"}
            </div>
          </div>

          <hr style={styles.hr} />

          <div style={styles.deleteBox}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Delete (Email verification)
            </div>

            <input
              style={styles.input}
              type="email"
              placeholder="Enter the same email used while posting"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error ? <div style={styles.error}>{error}</div> : null}

            <button
              style={{
                ...styles.deleteBtn,
                opacity: loadingDelete ? 0.7 : 1,
                cursor: loadingDelete ? "not-allowed" : "pointer",
              }}
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Delete Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value ? value : "—"}</div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: "min(720px, 100%)",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
  },
  title: { margin: 0, fontSize: 18 },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },
  body: { padding: 16 },
  row: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 10,
    padding: "6px 0",
  },
  label: { color: "#666", fontSize: 13 },
  value: { color: "#111", fontSize: 14, wordBreak: "break-word" },
  desc: {
    marginTop: 6,
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 10,
    background: "#fafafa",
    whiteSpace: "pre-wrap",
    lineHeight: 1.4,
  },
  hr: { border: "none", borderTop: "1px solid #eee", margin: "16px 0" },
  deleteBox: {
    padding: 12,
    border: "1px solid #ffe1e1",
    background: "#fff7f7",
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    marginTop: 8,
  },
  error: {
    marginTop: 8,
    color: "#b00020",
    fontSize: 13,
  },
  deleteBtn: {
    marginTop: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "#e53935",
    color: "#fff",
    fontWeight: 700,
  },
};
