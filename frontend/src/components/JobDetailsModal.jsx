import { useState } from "react";
import { deleteJob } from "../services/jobApi";
import { normalizeSaudiPhone, whatsappLink } from "../utils/phone";
import { formatDate } from "../utils/date";

export default function JobDetailsModal({ job, onClose, onDeleted }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job) return null;

  async function handleDelete() {
    if (!email) {
      alert("Enter email for delete verification");
      return;
    }
    try {
      setLoading(true);
      await deleteJob(job._id, email);
      alert("Job deleted");
      onDeleted();
      onClose();
    } catch (e) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const phone = normalizeSaudiPhone(job.phone);
  const waLink = whatsappLink(phone);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5">

        <h2 className="text-xl font-bold mb-2">{job.jobRole}</h2>
        <p className="text-sm text-gray-500 mb-3">
          {job.companyName} • {job.city}
        </p>

        <p className="mb-3">{job.description}</p>

        <p className="text-sm text-gray-500">
          Posted: {formatDate(job.createdAt)}
        </p>

        <div className="flex gap-3 mt-4">
          <a
            href={`tel:${phone}`}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Call
          </a>

          <a
            href={waLink}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-4">
          <input
            type="email"
            placeholder="Email for delete verify"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full px-3 py-2 rounded mb-2"
          />

          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white w-full py-2 rounded"
          >
            {loading ? "Deleting..." : "Delete Job"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-600 w-full"
        >
          Close
        </button>

      </div>
    </div>
  );
}
