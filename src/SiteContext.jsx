/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import * as defaults from "./collegeData";
import { programs, allProgramSubjects } from "./subjectsData";
import { defaultPrograms } from "./defaultCurriculum";
import {
  isApproved,
  isLive,
  newId,
  FONTS,
  IMAGE_KEYS,
  RESTORE_SKIP,
  SITE_FIELDS,
  DEFAULT_HOME_SECTIONS,
} from "./utils";

const STORAGE_KEY = "collegeHubContent";
const clone = (x) => JSON.parse(JSON.stringify(x));

// Makes the whole site use the courses and subjects chosen in the Admin
function applyCurriculum(list) {
  programs.length = 0;
  list.forEach((p) => programs.push(p));
  allProgramSubjects.length = 0;
  list.forEach((p) =>
    Object.entries(p.subjects || {}).forEach(([semester, subs]) =>
      subs.forEach((s) =>
        allProgramSubjects.push({
          ...s,
          semester: Number(semester),
          programId: p.id,
          programName: p.name,
        })
      )
    )
  );
}

const defaultSite = {
  siteTitle: "College Hub",
  logoText: "CH",
  logoImage: "",
  heroImage: "",
  footerText: "",
  maroon: "#6b0f1a",
  charcoal: "#1e1b1c",
  cream: "#f6efe0",
  gold: "#c9a227",
  font: "elegant",
  buttonStyle: "rounded",
  nav: defaults.navLinks
    .filter((l) => l.to !== "/login")
    .map((l) => ({ ...l, hidden: false })),
  homeSections: DEFAULT_HOME_SECTIONS,
};

const defaultContent = {
  college: defaults.college,
  principal: defaults.principal,
  courses: defaults.courses,
  announcements: defaults.announcements,
  calendar: defaults.calendar,
  customPages: [],
  materials: [],
  feedback: [],
  messages: [],
  fees: [],
  saved: [],
  downloadLog: [],
  recentlyViewed: [],
  faculty: [],
  students: [],
  placements: defaults.placements,
  studentProfile: { name: "", regNo: "", course: "bca", semester: "1", email: "", phone: "" },
  facultyProfile: { name: "", staffId: "", department: "", designation: "", phone: "", email: "", assigned: [] },
  site: defaultSite,
  siteDraft: defaultSite,
  siteHistory: [],
};

const SiteContext = createContext(null);

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const display = (obj, k) => {
  if (k === "homeSections") {
    return (obj[k] || []).map((s) => ({ label: s.label, hidden: !s.visible }));
  }
  if (IMAGE_KEYS.includes(k)) return obj[k] ? "(image)" : "(none)";
  return obj[k];
};

function diffSite(a, b) {
  return Object.keys(SITE_FIELDS)
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => ({
      key: k,
      label: SITE_FIELDS[k],
      from: display(a, k),
      to: display(b, k),
    }));
}

export function SiteProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        const site = { ...defaultSite, ...saved.site };
        return {
          ...defaultContent,
          ...saved,
          college: { ...defaultContent.college, ...saved.college },
          principal: { ...defaultContent.principal, ...saved.principal },
          placements: { ...defaultContent.placements, ...saved.placements },
          studentProfile: { ...defaultContent.studentProfile, ...saved.studentProfile },
          facultyProfile: { ...defaultContent.facultyProfile, ...saved.facultyProfile },
          curriculum: saved.curriculum || clone(defaultPrograms),
          site,
          siteDraft: { ...site, ...saved.siteDraft },
          siteHistory: saved.siteHistory || [],
        };
      }
    } catch {
      // ignore and use defaults
    }
    return { ...defaultContent, curriculum: clone(defaultPrograms) };
  });

  // Courses and subjects chosen in the Admin are used by every page
  applyCurriculum(content.curriculum);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // browser storage is full
    }
  }, [content]);

  useEffect(() => {
    const s = content.site;
    const root = document.documentElement.style;
    root.setProperty("--maroon", s.maroon);
    root.setProperty("--charcoal", s.charcoal);
    root.setProperty("--cream", s.cream);
    root.setProperty("--gold", s.gold);
    root.setProperty(
      "--hero-image",
      s.heroImage ? `url("${s.heroImage}")` : 'url("/college.jpg")'
    );
    document.body.style.fontFamily = (FONTS[s.font] || FONTS.elegant).css;
    document.body.classList.toggle("btn-square", s.buttonStyle === "square");
    document.title = `${s.siteTitle} · ${content.college.name}`;
  }, [content.site, content.college.name]);

  function resetContent() {
    setContent({ ...defaultContent, curriculum: clone(defaultPrograms) });
  }

  function publishSite() {
    setContent((prev) => {
      const changes = diffSite(prev.site, prev.siteDraft);
      if (changes.length === 0) return prev;
      const entry = {
        id: newId(),
        date: new Date().toLocaleString("en-IN"),
        admin: "admin",
        status: "Published",
        changes,
      };
      return {
        ...prev,
        site: prev.siteDraft,
        siteHistory: [entry, ...prev.siteHistory].slice(0, 50),
      };
    });
  }

  function discardDraft() {
    setContent((prev) => ({ ...prev, siteDraft: prev.site }));
  }

  function restoreVersion(id) {
    setContent((prev) => {
      const entry = prev.siteHistory.find((e) => e.id === id);
      if (!entry) return prev;
      const restored = { ...prev.site };
      entry.changes.forEach((c) => {
        if (!RESTORE_SKIP.includes(c.key)) restored[c.key] = c.from;
      });
      const changes = diffSite(prev.site, restored);
      if (changes.length === 0) return prev;
      const newEntry = {
        id: newId(),
        date: new Date().toLocaleString("en-IN"),
        admin: "admin",
        status: "Restored",
        changes,
      };
      return {
        ...prev,
        site: restored,
        siteDraft: restored,
        siteHistory: [newEntry, ...prev.siteHistory].slice(0, 50),
      };
    });
  }

  const value = {
    ...content,
    announcements: content.announcements.filter(isLive),
    allAnnouncements: content.announcements,
    materials: content.materials.filter(isApproved),
    allMaterials: content.materials,
    setContent,
    resetContent,
    publishSite,
    discardDraft,
    restoreVersion,
    portals: defaults.portals,
    baseNav: defaults.navLinks,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}