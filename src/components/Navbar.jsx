import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSite, slugify } from "../SiteContext";

export default function Navbar() {
  const { site, customPages } = useSite();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const main = site.nav.filter((l) => !l.hidden);
  const extra = customPages
    .filter((p) => p.title.trim())
    .map((p) => ({ label: p.title, to: `/page/${slugify(p.title)}` }));
  const links = [...main, ...extra, { label: "Login", to: "/login" }];

  function search(e) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    setOpen(false);
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        {site.logoImage ? (
          <img className="brand-img" src={site.logoImage} alt="Logo" />
        ) : (
          <span className="brand-mark">{site.logoText}</span>
        )}
        <span>{site.siteTitle}</span>
      </Link>

      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <nav className={open ? "nav-links collapsible open" : "nav-links collapsible"}>
        {links.map((link) => (
          <NavLink
            key={link.label + link.to}
            to={link.to}
            end={link.to === "/"}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <form className="nav-search" onSubmit={search}>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search the website"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>
      </nav>
    </header>
  );
}