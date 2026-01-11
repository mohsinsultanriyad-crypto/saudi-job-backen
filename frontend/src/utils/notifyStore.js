const KEY_ROLES = "saudi_job_notify_roles";
const KEY_SEEN = "saudi_job_seen_ids";

export function getNotifyRoles() {
  try {
    return JSON.parse(localStorage.getItem(KEY_ROLES) || "[]");
  } catch {
    return [];
  }
}

export function setNotifyRoles(roles) {
  localStorage.setItem(KEY_ROLES, JSON.stringify(roles));
}

export function getSeenIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SEEN) || "[]");
  } catch {
    return [];
  }
}

export function addSeenId(id) {
  const seen = getSeenIds();
  if (!seen.includes(id)) {
    seen.push(id);
    localStorage.setItem(KEY_SEEN, JSON.stringify(seen));
  }
}
