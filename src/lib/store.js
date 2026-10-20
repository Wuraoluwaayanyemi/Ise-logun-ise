import { useSyncExternalStore } from "react";

const KEY = "opportunity-data-v1";

export const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const seed = {
  profile: {
    name: "Alex",
    major: "Computer Science",
    gradYear: "2027",
    skills: ["Python", "JavaScript", "React", "SQL"],
    resumeName: "",
    resumeUrl: "",
    resumeSummary: "",
    resumeExperience: "",
    resumeEducation: "",
    resumeProjects: "",
    resumeCertification: "",
    resumeReferences: "",
    setupComplete: false,
  },
  applications: [
    { id: "a1", company: "Google", title: "SWE Intern", url: "", location: "Dublin, IE", salary: "", status: "pending", dateApplied: "2026-09-15", deadline: "2026-10-30", description: "", notes: "Referral from a classmate." },
    { id: "a2", company: "Microsoft", title: "Cloud Engineering Intern", url: "", location: "Dublin, IE", salary: "", status: "interview", dateApplied: "2026-09-12", deadline: "2026-10-15", description: "", notes: "" },
    { id: "a3", company: "Stripe", title: "Backend Intern", url: "", location: "Remote", salary: "", status: "rejected", dateApplied: "2026-09-02", deadline: "", description: "", notes: "" },
    { id: "a4", company: "Intercom", title: "Product Engineering Intern", url: "", location: "Dublin, IE", salary: "", status: "offer", dateApplied: "2026-08-28", deadline: "", description: "", notes: "Offer deadline Oct 20." },
  ],
  reviews: [
    { id: "r1", company: "Google", role: "SWE Intern", roleLevel: "Intern", outcome: "offer", difficulty: 4, culture: 5, speed: 3, process: "Online assessment, then two 45-minute technical interviews focused on data structures.", timeline: "5 weeks", year: "2025", comments: "Friendly interviewers, practice LeetCode mediums.", anonymous: true, author: "", votes: 12, createdAt: "2025-11-02" },
    { id: "r2", company: "Microsoft", role: "Cloud Engineering Intern", roleLevel: "Intern", outcome: "rejected", difficulty: 3, culture: 4, speed: 4, process: "One recorded video interview and a final round with three back-to-back interviews.", timeline: "3 weeks", year: "2025", comments: "", anonymous: false, author: "Sam", votes: 5, createdAt: "2025-10-18" },
    { id: "r3", company: "Intercom", role: "Product Engineering Intern", roleLevel: "Intern", outcome: "offer", difficulty: 3, culture: 5, speed: 5, process: "Take-home project, then a pairing session discussing it.", timeline: "2 weeks", year: "2026", comments: "Super quick feedback after each stage.", anonymous: true, author: "", votes: 8, createdAt: "2026-03-10" },
  ],
};

let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    const stored = raw ? JSON.parse(raw) : seed;
    state = { ...stored, profile: { ...seed.profile, ...stored.profile } };
  } catch {
    state = seed;
  }
  return state;
}

function save(next) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore() {
  return useSyncExternalStore(subscribe, load, () => seed);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const actions = {
  addApplication(app) {
    const id = uid();
    const s = load();
    save({ ...s, applications: [{ ...app, id }, ...s.applications] });
    return id;
  },
  updateApplication(id, patch) {
    const s = load();
    save({ ...s, applications: s.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  },
  deleteApplication(id) {
    const s = load();
    save({ ...s, applications: s.applications.filter((a) => a.id !== id) });
  },
  addReview(review) {
    const s = load();
    save({ ...s, reviews: [{ ...review, id: uid(), votes: 0, createdAt: today() }, ...s.reviews] });
  },
  voteReview(id, delta) {
    const s = load();
    save({ ...s, reviews: s.reviews.map((r) => (r.id === id ? { ...r, votes: r.votes + delta } : r)) });
  },
  updateProfile(patch) {
    const s = load();
    save({ ...s, profile: { ...s.profile, ...patch } });
  },
  resetAll() {
    save(seed);
  },
};

export function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${day}, ${y}`;
}

export function avg(list, key) {
  if (!list.length) return 0;
  return list.reduce((t, r) => t + Number(r[key] || 0), 0) / list.length;
}

export function getStats(apps) {
  const count = (st) => apps.filter((a) => a.status === st).length;
  const total = apps.length;
  const positive = count("interview") + count("offer");
  return {
    total,
    pending: count("pending"),
    interview: count("interview"),
    offer: count("offer"),
    rejected: count("rejected"),
    inProgress: count("pending") + count("interview"),
    successRate: total ? Math.round((positive / total) * 100) : 0,
  };
}
