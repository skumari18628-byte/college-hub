import { useSite } from "../SiteContext";

export default function Footer() {
  const { college, site } = useSite();
  return (
    <footer className="footer">
      <p>
        {site.footerText ||
          `© 2026 ${college.name} · ${college.tagline}`}
      </p>
    </footer>
  );
}