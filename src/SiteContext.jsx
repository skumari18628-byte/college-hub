/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import * as defaults from "./collegeData";
import {
  isApproved,
  isLive,
  newId,
  FONTS,
  IMAGE_KEYS,
  SITE_FIELDS,
} from "./utils";

const STORAGE_KEY = "collegeHubContent";

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

function diffSite(a, b) {
  return Object.keys(SITE_FIELDS)
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => ({
      key: k,
      label: SITE_FIELDS[k],
      from: IMAGE_KEYS.includes(k) ? (a[k] ? "(image)" : "(none)") : a[k],
      to: IMAGE_KEYS.includes(k) ? (b[k] ? "(image)" : "(none)") : b[k],
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
          site,
          siteDraft: { ...site, ...saved.siteDraft },
          siteHistory: saved.siteHistory || [],
        };
      }
    } catch {
      // ignore and use defaults
    }
    return defaultContent;
  });

  // Save everything in the browser
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // ignore
    }
  }, [content]);

  // Apply the published colours, font, buttons, picture and title
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
    setContent(defaultContent);
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
        if (!IMAGE_KEYS.includes(c.key)) restored[c.key] = c.from;
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
    // public pages only see live announcements and approved materials
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