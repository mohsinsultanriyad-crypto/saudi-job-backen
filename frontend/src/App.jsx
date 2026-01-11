import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

import AllJobs from "./pages/AllJobs";
import PostJob from "./pages/PostJob";
import ViewedJobs from "./pages/ViewedJobs";
import Notifications from "./pages/Notifications";

import { getJobs } from "./services/jobApi";
import { getNotifyRoles, addSeenId, getSeenIds } from "./utils/notifyStore";

export default function App() {
  // ✅ Global role-notification (app open hone par)
  useEffect(() => {
    // permission request (browser)
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const timer = setInterval(async () => {
      try {
        const roles = getNotifyRoles();
        if (!roles.length) return;

        const seen = new Set(getSeenIds());
        const res = await getJobs();
        const jobs = res.data || [];

        for (const job of jobs.slice(0, 15)) {
          if (!job?._id) continue;
          if (seen.has(job._id)) continue;

          const roleLower = (job.jobRole || "").toLowerCase();
          const match = roles.some((r) => r.toLowerCase() === roleLower);

          // mark seen
          addSeenId(job._id);

          if (match) {
            const title = `New Job: ${job.jobRole}`;
            const body = `${job.city} • Posted by ${job.companyName || job.name}`;

            // Notification API (if allowed), else alert
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(title, { body });
            } else {
              alert(`${title}\n${body}`);
            }
            break;
          }
        }
      } catch {
        // ignore
      }
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<AllJobs />} />
        <Route path="/post" element={<PostJob />} />
        <Route path="/viewed" element={<ViewedJobs />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}
