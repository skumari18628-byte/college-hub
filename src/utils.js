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

// Website settings that the Admin can customize (used for change history)
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
};

export const IMAGE_KEYS = ["logoImage", "heroImage"];

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// A material is shown to students only when approved
export const isApproved = (m) => !m.status || m.status === "approved";

// An announcement is shown when published and its schedule date has arrived
export const isLive = (a) =>
  a.published !== false && (!a.publishOn || a.publishOn <= todayISO());

export const matKey = (m) => m.id || `${m.subjectId}|${m.title}`;

const num = (v) => Number(v) || 0;
export const feeTotal = (f) =>
  num(f.tuition) + num(f.admission) + num(f.exam) + num(f.lab) + num(f.other);

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