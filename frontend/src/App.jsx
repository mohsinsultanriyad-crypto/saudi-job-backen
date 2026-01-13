import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addView, createJob, deleteJob, fetchJobs, updateJob } from "./services/api";

const cities = [
  "Riyadh","Jeddah","Dammam","Khobar","Jubail","Mecca","Medina","Taif",
  "Tabuk","Hail","Abha","Jazan","Najran","Al Ahsa"
];

const roles = [
  "Helper",
  "Multi Welder",
  "Pipe Fitter",
  "Electrician",
  "Plumber",
  "Painter",
  "Scaffolder",
  "Safety Officer",
  "Supervisor",
  "Driver"
];

const LS_VIEWED = "sj_viewed";
const LS_NOTIF_PREF = "sj_alert_pref";
const LS_NOTIF_LIST = "sj_alert_list";

function cn(...xs) { return xs.filter(Boolean).join(" "); }

function normalizePhoneForWA(phoneRaw) {
  const p = String(phoneRaw || "").trim().replace(/\s+/g, "");
  if (!p) return "";
  if (p.startsWith("0") && p.length === 10) return "966" + p.slice(1);
  if (p.startsWith("+")) return p.slice(1);
  return p;
}

function makeWhatsAppLink(job) {
  const phone = normalizePhoneForWA(job.phone);
  const text = `Hello, I am interested in ${job.jobRole} job in ${job.city}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function Header() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-extrabold">
          S
        </div>
        <div className="leading-tight">
          <div className="text-lg font-extrabold">
            SAUDI <span className="text-green-600">JOB</span>{" "}
            <span className="text-xs font-semibold text-gray-400 tracking-widest">
              KINGDOM OF SAUDI ARABIA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab, alertCount }) {
  const Item = ({ id, label, badge }) => (
    <button
      onClick={() => setTab(id)}
      className={cn(
        "flex-1 py-3 flex flex-col items-center gap-1 relative",
        tab === id ? "text-green-600" : "text-gray-400"
      )}
    >
      <div className="text-xs font-extrabold tracking-wide">{label}</div>
      {badge > 0 && (
        <div className="absolute top-2 right-6 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
          {badge}
        </div>
      )}
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-md mx-auto flex">
        <Item id="all" label="ALL JOBS" badge={0} />
        <Item id="post" label="POST JOB" badge={0} />
        <Item id="alerts" label="ALERTS" badge={alertCount} />
        <Item id="viewed" label="VIEWED" badge={0} />
      </div>
    </div>
  );
}

function Field({ label, children, tall }) {
  return (
    <div>
      <div className="text-xs font-extrabold text-gray-300 tracking-widest">
        {label}
      </div>
      <div className={cn(
        "mt-2 bg-gray-50 border rounded-2xl px-4 flex items-center gap-2",
        tall ? "py-4" : "py-3"
      )}>
        {children}
      </div>
    </div>
  );
}

function JobCard({ job, urgentActive, onOpen }) {
  const date = useMemo(() => {
    try {
      const d = new Date(job.createdAt);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return ""; }
  }, [job.createdAt]);

  return (
    <button
      onClick={() => onOpen(job)}
      className={cn(
        "w-full text-left rounded-2xl border shadow-sm p-4 hover:shadow transition",
        urgentActive ? "border-red-300 bg-red-50" : "bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xl font-extrabold">{job.jobRole}</div>
        <div className="flex items-center gap-2">
          {urgentActive && (
            <div className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-extrabold">
              URGENT
            </div>
          )}
          <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 font-bold">
            {date}
          </div>
        </div>
      </div>

      <div className="mt-2 text-gray-600 font-bold">City: {job.city}</div>
      <div className="mt-1 text-gray-500">Posted by: {job.companyName || job.name}</div>

      <div className="mt-2 text-gray-400 text-sm font-bold">
        Views: {job.views || 0}
      </div>

      <div className="mt-3 text-green-600 font-extrabold text-sm text-right">
        View Details
      </div>
    </button>
  );
}

function DetailsModal({ open, job, urgentActive, onClose, onEdit, onDelete }) {
  if (!open || !job) return null;

  const waLink = makeWhatsAppLink(job);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">Job Details</div>
          <button onClick={onClose} className="text-2xl text-gray-400">×</button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-3xl font-extrabold">{job.jobRole}</div>
          {urgentActive && (
            <div className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-extrabold">
              URGENT (24H)
            </div>
          )}
        </div>

        <div className="mt-2 inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1 rounded-full text-green-700 font-bold">
          {job.city}
        </div>

        <div className="mt-3 text-gray-400 text-sm font-bold">
          Views: {job.views || 0}
        </div>

        <div className="mt-5">
          <div className="text-gray-400 font-extrabold tracking-widest text-sm">
            DESCRIPTION
          </div>
          <div className="mt-2 text-gray-700">{job.description}</div>
        </div>

        <div className="mt-5 bg-gray-50 border rounded-2xl p-4">
          <div className="font-extrabold text-gray-700">Contact</div>

          <div className="mt-3 space-y-2 text-gray-700">
            <div><span className="text-gray-400 font-extrabold">Posted by:</span> {job.companyName || job.name}</div>
            <div><span className="text-gray-400 font-extrabold">Phone:</span> {job.phone}</div>
            <div><span className="text-gray-400 font-extrabold">Email:</span> {job.email}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={onEdit}
            className="w-full bg-gray-50 border text-gray-800 font-extrabold py-3 rounded-2xl"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="w-full bg-red-50 border border-red-100 text-red-600 font-extrabold py-3 rounded-2xl"
          >
            Remove
          </button>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block w-full text-center bg-green-600 text-white font-extrabold py-4 rounded-2xl"
        >
          Apply on WhatsApp
        </a>

        <a
          href={`tel:${job.phone}`}
          className="mt-3 block w-full text-center bg-green-50 border border-green-100 text-green-700 font-extrabold py-4 rounded-2xl"
        >
          Call Now
        </a>
      </motion.div>
    </div>
  );
}

function EditModal({ open, job, onClose, onSave }) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (open && job) {
      setEmail("");
      setForm({
        name: job.name || "",
        companyName: job.companyName || "",
        phone: job.phone || "",
        city: job.city || "Riyadh",
        jobRole: job.jobRole || "Helper",
        description: job.description || "",
        isUrgent: !!job.isUrgent
      });
    }
  }, [open, job]);

  if (!open || !job || !form) return null;

  async function handleSave() {
    if (!email.trim()) return alert("Email is required (same posting email).");
    if (!form.name || !form.phone || !form.city || !form.jobRole || !form.description) {
      return alert("Please fill all fields.");
    }
    try {
      setSaving(true);
      await onSave(email.trim(), form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">Edit Job</div>
          <button onClick={onClose} className="text-2xl text-gray-400">×</button>
        </div>

        <div className="mt-4">
          <Field label="EMAIL (VERIFY)">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Same email used in posting"
              className="w-full outline-none bg-transparent font-semibold"
            />
          </Field>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-red-600">Urgent Hiring</div>
              <div className="text-xs text-gray-500 font-semibold">
                24 hours top and highlight
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
              className="h-6 w-6"
            />
          </div>

          <Field label="FULL NAME">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full outline-none bg-transparent font-semibold"
            />
          </Field>

          <Field label="COMPANY NAME (OPTIONAL)">
            <input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full outline-none bg-transparent font-semibold"
            />
          </Field>

          <Field label="PHONE">
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full outline-none bg-transparent font-semibold"
            />
          </Field>

          <Field label="CITY">
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full outline-none bg-transparent font-bold"
            >
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="JOB ROLE">
            <select
              value={form.jobRole}
              onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
              className="w-full outline-none bg-transparent font-bold"
            >
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="DESCRIPTION" tall>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full outline-none bg-transparent h-28 resize-none font-semibold"
            />
          </Field>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 text-white font-extrabold py-4 rounded-2xl shadow-lg disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterRole, setFilterRole] = useState("All");

  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_VIEWED) || "[]"); }
    catch { return []; }
  });

  const [alertPref, setAlertPref] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_NOTIF_PREF) || JSON.stringify({ roles: ["Helper"] })); }
    catch { return { roles: ["Helper"] }; }
  });

  const [alertList, setAlertList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_NOTIF_LIST) || "[]"); }
    catch { return []; }
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [posting, setPosting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Riyadh");
  const [jobRole, setJobRole] = useState("Helper");
  const [description, setDescription] = useState("");

  function urgentActive(job) {
    if (!job?.isUrgent) return false;
    if (!job?.urgentUntil) return false;
    return new Date(job.urgentUntil).getTime() > Date.now();
  }

  async function loadJobs() {
    try {
      setLoading(true);
      const data = await fetchJobs();
      const list = Array.isArray(data) ? data : [];
      setJobs(list);
      buildAlerts(list);
    } catch (e) {
      console.error(e);
      alert("Jobs could not be loaded. Check API URL.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
    const t = setInterval(loadJobs, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { localStorage.setItem(LS_NOTIF_PREF, JSON.stringify(alertPref)); }, [alertPref]);
  useEffect(() => { localStorage.setItem(LS_NOTIF_LIST, JSON.stringify(alertList)); }, [alertList]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = jobs;
    if (filterCity !== "All") list = list.filter(j => j.city === filterCity);
    if (filterRole !== "All") list = list.filter(j => j.jobRole === filterRole);

    if (!q) return list;
    return list.filter(j =>
      (j.jobRole || "").toLowerCase().includes(q) ||
      (j.city || "").toLowerCase().includes(q) ||
      (j.companyName || "").toLowerCase().includes(q)
    );
  }, [jobs, query, filterCity, filterRole]);

  async function openJob(job) {
    try {
      setSelectedJob(job);
      setDetailsOpen(true);

      if (job?._id) await addView(job._id);

      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, views: (j.views || 0) + 1 } : j));
      setSelectedJob(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);

      setViewed(prev => {
        const exists = prev.some(x => x._id === job._id);
        const next = exists ? prev : [job, ...prev].slice(0, 200);
        localStorage.setItem(LS_VIEWED, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  }

  function closeDetails() {
    setDetailsOpen(false);
    setSelectedJob(null);
  }

  async function handlePost() {
    if (!name || !phone || !email || !city || !jobRole || !description) {
      alert("Please fill all fields.");
      return;
    }
    try {
      setPosting(true);
      await createJob({ name, companyName, phone, email, city, jobRole, description, isUrgent });

      setIsUrgent(false);
      setName("");
      setCompanyName("");
      setPhone("");
      setEmail("");
      setCity("Riyadh");
      setJobRole("Helper");
      setDescription("");

      alert("Job posted successfully.");
      setTab("all");
      await loadJobs();
    } catch (e) {
      console.error(e);
      alert("Post failed. Please check email format.");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete() {
    if (!selectedJob) return;
    const em = prompt("Enter email to confirm delete (same posting email):");
    if (!em) return;

    try {
      await deleteJob(selectedJob._id, em.trim());
      alert("Job deleted.");
      closeDetails();
      await loadJobs();
    } catch (e) {
      console.error(e);
      alert("Delete failed. Email mismatch or error.");
    }
  }

  async function handleEditSave(emailVerify, payload) {
    try {
      const updated = await updateJob(selectedJob._id, emailVerify, payload);
      setEditOpen(false);
      setSelectedJob(updated);
      await loadJobs();
      alert("Job updated.");
    } catch (e) {
      console.error(e);
      alert("Update failed. Email mismatch or error.");
    }
  }

  function buildAlerts(jobList) {
    const wanted = (alertPref?.roles || []).map(x => String(x).toLowerCase());
    if (!wanted.length) return;

    const existingIds = new Set((alertList || []).map(n => n.jobId));
    const newItems = [];

    for (const j of jobList) {
      const role = String(j.jobRole || "").toLowerCase();
      const match = wanted.some(w => role.includes(w));
      if (!match) continue;
      if (existingIds.has(j._id)) continue;

      newItems.push({
        id: `${Date.now()}_${j._id}`,
        jobId: j._id,
        jobSnapshot: j,
        createdAt: new Date().toISOString()
      });
    }

    if (newItems.length) {
      setAlertList(prev => [...newItems, ...prev].slice(0, 300));
    }
  }

  const alertCount = alertList.length;

  function clearAlerts() {
    if (!confirm("Clear all alerts?")) return;
    setAlertList([]);
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <div className="max-w-md mx-auto px-4 py-5">
        {tab === "all" && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold">Explore Jobs</div>
              <button
                onClick={loadJobs}
                className="h-12 w-12 rounded-full border bg-white flex items-center justify-center font-extrabold"
                title="Refresh"
              >
                R
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <div className="flex-1 bg-gray-50 border rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-gray-400 font-extrabold">Search</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Role, city, company"
                  className="bg-transparent outline-none w-full font-semibold"
                />
              </div>
              <div className="w-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center font-extrabold text-green-700">
                F
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 border rounded-2xl px-3 py-2">
                <div className="text-[10px] font-extrabold text-gray-300 tracking-widest">CITY</div>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-transparent outline-none font-bold text-gray-700"
                >
                  <option>All</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="bg-gray-50 border rounded-2xl px-3 py-2">
                <div className="text-[10px] font-extrabold text-gray-300 tracking-widest">ROLE</div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full bg-transparent outline-none font-bold text-gray-700"
                >
                  <option>All</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 border rounded-2xl py-6 text-center text-gray-400 font-extrabold">
              ADVERTISEMENT PLACEHOLDER
            </div>

            <div className="mt-5 space-y-4">
              {loading && <div className="text-gray-400 font-extrabold">Loading...</div>}
              {!loading && filteredJobs.length === 0 && (
                <div className="text-gray-400 font-extrabold">No jobs found.</div>
              )}

              {filteredJobs.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  urgentActive={urgentActive(job)}
                  onOpen={openJob}
                />
              ))}
            </div>
          </>
        )}

        {tab === "post" && (
          <>
            <div className="text-3xl font-extrabold">Post a Job</div>
            <div className="text-gray-500 font-semibold mt-1">
              Hire talent across the Kingdom
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-red-600">Urgent Hiring</div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Top and highlighted for 24 hours
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-6 w-6"
                />
              </div>

              <Field label="FULL NAME">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full outline-none bg-transparent font-semibold"
                />
              </Field>

              <Field label="COMPANY NAME (OPTIONAL)">
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="w-full outline-none bg-transparent font-semibold"
                />
              </Field>

              <Field label="PHONE NUMBER">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full outline-none bg-transparent font-semibold"
                />
              </Field>

              <Field label="EMAIL (FOR EDIT / DELETE)">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full outline-none bg-transparent font-semibold"
                />
              </Field>

              <Field label="CITY">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full outline-none bg-transparent font-bold"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="JOB ROLE">
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full outline-none bg-transparent font-bold"
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>

              <Field label="JOB DESCRIPTION" tall>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write job details"
                  className="w-full outline-none bg-transparent h-28 resize-none font-semibold"
                />
              </Field>

              <button
                onClick={handlePost}
                disabled={posting}
                className="mt-2 w-full bg-green-600 text-white font-extrabold py-4 rounded-2xl shadow-lg disabled:opacity-60"
              >
                {posting ? "Publishing..." : "Publish Job"}
              </button>

              <div className="text-xs text-gray-400 font-semibold">
                Jobs are auto-removed after 7 days.
              </div>
            </div>
          </>
        )}

        {tab === "alerts" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-extrabold">Alerts</div>
                <div className="text-gray-500 font-semibold mt-1">
                  Select roles to receive alerts
                </div>
              </div>
              <button
                onClick={clearAlerts}
                className="h-11 px-4 rounded-2xl bg-gray-50 border font-extrabold text-gray-700"
              >
                Clear
              </button>
            </div>

            <div className="mt-5 bg-gray-50 border rounded-2xl p-4">
              <div className="text-xs font-extrabold text-gray-300 tracking-widest">
                ROLES (MULTI SELECT)
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {roles.map((r) => {
                  const active = (alertPref.roles || []).includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        const cur = alertPref.roles || [];
                        const next = active ? cur.filter(x => x !== r) : [...cur, r];
                        setAlertPref({ roles: next });
                      }}
                      className={cn(
                        "px-3 py-2 rounded-full border text-sm font-extrabold",
                        active ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600"
                      )}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-gray-400 font-semibold">
                The app refreshes every 20 seconds to detect new jobs.
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {alertList.length === 0 && (
                <div className="text-gray-400 font-extrabold">
                  No alerts yet.
                </div>
              )}

              {alertList.map((n) => {
                const j = jobs.find(x => x._id === n.jobId) || n.jobSnapshot;
                return (
                  <JobCard
                    key={n.id}
                    job={j}
                    urgentActive={urgentActive(j)}
                    onOpen={openJob}
                  />
                );
              })}
            </div>
          </>
        )}

        {tab === "viewed" && (
          <>
            <div className="text-3xl font-extrabold">Viewed Jobs</div>
            <div className="text-gray-500 font-semibold mt-1">
              Stored on this device
            </div>

            <div className="mt-6 space-y-4">
              {viewed.length === 0 && (
                <div className="text-gray-400 font-extrabold">
                  No viewed jobs yet.
                </div>
              )}

              {viewed.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  urgentActive={urgentActive(job)}
                  onOpen={openJob}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        <DetailsModal
          open={detailsOpen}
          job={selectedJob}
          urgentActive={urgentActive(selectedJob)}
          onClose={closeDetails}
          onEdit={() => setEditOpen(true)}
          onDelete={handleDelete}
        />
      </AnimatePresence>

      <AnimatePresence>
        <EditModal
          open={editOpen}
          job={selectedJob}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
        />
      </AnimatePresence>

      <BottomNav tab={tab} setTab={setTab} alertCount={alertCount} />
    </div>
  );
}