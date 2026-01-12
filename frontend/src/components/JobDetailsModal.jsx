export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{job.jobRole || "Job Details"}</div>
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2 font-semibold"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="font-semibold">City:</span> {job.city || "-"}
          </div>
          <div>
            <span className="font-semibold">Company:</span> {job.companyName || "-"}
          </div>
          <div>
            <span className="font-semibold">Name:</span> {job.name || "-"}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {job.phone || "-"}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {job.email || "-"}
          </div>

          <div className="pt-2">
            <div className="font-semibold">Description</div>
            <div className="mt-1 whitespace-pre-wrap text-gray-700">
              {job.description || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}