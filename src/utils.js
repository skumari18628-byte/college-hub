export const ANNOUNCEMENT_CATEGORIES = [
  "General Notices",
  "Examination",
  "Internal Assessment",
  "Events",
  "Holidays",
  "Admissions",
  "Scholarships",
  "Placements",
  "Department Notices",
  "Urgent Announcements",
];

export const FEEDBACK_CATEGORIES = [
  "Website feedback",
  "Course material request",
  "Technical complaint",
  "College facility feedback",
  "Placement suggestion",
  "General suggestion",
];

export const FEEDBACK_STATUS = ["New", "In review", "Resolved"];

export const FONTS = {
  elegant: { label: "Elegant serif", css: 'Georgia, "Times New Roman", serif' },
  classic: { label: "Classic serif", css: '"Palatino Linotype", Palatino, "Book Antiqua", serif' },
  modern: { label: "Modern sans-serif", css: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  friendly: { label: "Friendly sans-serif", css: '"Trebuchet MS", Verdana, sans-serif' },
};

export const SITE_FIELDS = {
  siteTitle: "Website title",
  logoText: "Logo text",
  logoImage: "Logo image",
  heroImage: "Home page picture",
  footerText: "Footer text",
  maroon: "Primary colour",
  charcoal: "Dark colour",
  cream: "Light colour",
  gold: "Accent colour",
  font: "Font",
  buttonStyle: "Button style",
  nav: "Navigation tabs",
  homeSections: "Home page sections",
};

export const IMAGE_KEYS = ["logoImage", "heroImage"];
// These are recorded in the history but not brought back by Restore
export const RESTORE_SKIP = ["logoImage", "heroImage", "homeSections"];

export const DEFAULT_HOME_SECTIONS = [
  { id: "hero", label: "College picture and welcome", visible: true },
  { id: "principal", label: "From the Principal", visible: true },
  { id: "about", label: "About the College", visible: true },
  { id: "quick", label: "Quick access cards", visible: true },
  { id: "programmes", label: "Academic programmes", visible: true },
  { id: "announcements", label: "Latest announcements", visible: true },
  { id: "placements", label: "Placement opportunities", visible: true },
  { id: "highlights", label: "Campus highlights", visible: true },
  { id: "contact", label: "Contact information", visible: true },
];

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const isApproved = (m) => !m.status || m.status === "approved";

export const isLive = (a) =>
  a.published !== false && (!a.publishOn || a.publishOn <= todayISO());

export const matKey = (m) => m.id || `${m.subjectId}|${m.title}`;

const num = (v) => Number(v) || 0;
export const feeTotal = (f) =>
  num(f.tuition) + num(f.admission) + num(f.exam) + num(f.lab) + num(f.other);

export function youtubeEmbed(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export function toPreviewUrl(url) {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

export function toDownloadUrl(url) {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : url;
}

// Shrinks an uploaded picture so it fits in browser storage
export function resizeImage(file, maxWidth = 1600, quality = 0.75, type = "image/jpeg") {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not open the image."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(type, quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}