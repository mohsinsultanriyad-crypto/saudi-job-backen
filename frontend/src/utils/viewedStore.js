const KEY = "SAUDI_JOB_VIEWED";

export function getViewedJobs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addViewedJob(job) {
  const list = getViewedJobs();
  const exists = list.some((j) => j._id === job._id);
  if (!exists) {
    list.unshift(job);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
  }
}

export function removeViewedJob(id) {
  const list = getViewedJobs().filter((j) => j._id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
