import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { programs } from "../subjectsData";

const quickLinks = [
  { icon: "📚", label: "Course Material", text: "Notes, papers and videos", to: "/course-material" },
  { icon: "💰", label: "Fee Structure", text: "Fees by course and semester", to: "/fee-structure" },
  { icon: "📢", label: "Announcements", text: "Latest college notices", to: "/announcements" },
  { icon: "💼", label: "Placements", text: "Jobs and internships", to: "/placements" },
  { icon: "💬", label: "Feedback", text: "Share your thoughts", to: "/feedback" },
  { icon: "🔐", label: "Login", text: "Student, Faculty and Admin", to: "/login" },
];

const isSafe = (url) => /^https?:\/\//i.test(url || "");

export default function Home() {
  const { site, college, principal, announcements, placements } = useSite();
  const [failedSrc, setFailedSrc] = useState("");

  const ug = programs.filter((p) => p.level === "UG");
  const pg = programs.filter((p) => p.level === "PG");
  const latest = announcements.slice(0, 3);
  const openings = placements.openings.slice(0, 3);
  const photoSrc = principal.image || "/principal.jpg";

  const hero = (
    <section key="hero" className="hero-photo">
      <p className="eyebrow">Welcome to</p>
      <h1>{college.name}</h1>
      <p className="tagline">{college.tagline}</p>
      <p className="hero-intro">{college.intro}</p>
      <Link className="btn" to="/login">
        Login to your portal
      </Link>
    </section>
  );

  const blocks = {
    principal: (cls) => (
      <section key="principal" className={cls}>
        <h2>From the Principal</h2>
        <div className="principal">
          <div className="principal-photo">
            {failedSrc !== photoSrc ? (
              <img
                src={photoSrc}
                alt={principal.name}
                onError={() => setFailedSrc(photoSrc)}
              />
            ) : (
              <span>Photo</span>
            )}
          </div>
          <div className="principal-text">
            <p className="lead">{principal.message}</p>
            <p className="principal-name">{principal.name}</p>
            <p className="principal-title">{principal.title}</p>
          </div>
        </div>
      </section>
    ),

    about: (cls) => (
      <section key="about" className={cls}>
        <h2>About the College</h2>
        <p className="lead">{college.about}</p>
        <div className="stats">
          {college.stats.map((s, i) => (
            <div key={i} className="stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <Link className="btn small" to="/about">
          Read more
        </Link>
      </section>
    ),

    quick: (cls) => (
      <section key="quick" className={cls}>
        <h2>Quick Access</h2>
        <div className="grid">
          {quickLinks.map((q) => (
            <Link key={q.label} className="card quick" to={q.to}>
              <span className="quick-icon">{q.icon}</span>
              <h3>{q.label}</h3>
              <p>{q.text}</p>
            </Link>
          ))}
        </div>
      </section>
    ),

    programmes: (cls) => (
      <section key="programmes" className={cls}>
        <h2>Academic Programmes</h2>
        <h3 className="sem-heading">Undergraduate (UG)</h3>
        <div className="chip-row">
          {ug.map((p) => (
            <Link key={p.id} className="chip" to={`/academics/${p.id}`}>
              {p.name}
            </Link>
          ))}
        </div>
        <h3 className="sem-heading">Postgraduate (PG)</h3>
        <div className="chip-row">
          {pg.map((p) => (
            <Link key={p.id} className="chip" to={`/academics/${p.id}`}>
              {p.name}
            </Link>
          ))}
        </div>
        <Link className="btn small" to="/academics">
          View all programmes
        </Link>
      </section>
    ),

    announcements: (cls) => (
      <section key="announcements" className={cls}>
        <h2>Latest Announcements</h2>
        {latest.length === 0 ? (
          <p className="empty">No announcements right now.</p>
        ) : (
          <ul className="announce-list">
            {latest.map((a, i) => (
              <li key={i}>
                <span className="date">{a.date}</span>
                <span>{a.title}</span>
              </li>
            ))}
          </ul>
        )}
        <Link className="btn small" to="/announcements">
          All announcements
        </Link>
      </section>
    ),

    placements: (cls) => (
      <section key="placements" className={cls}>
        <h2>Placement Opportunities</h2>
        {openings.length === 0 ? (
          <p className="empty">
            New jobs, internships and campus drives will be listed here.
          </p>
        ) : (
          <div className="grid">
            {openings.map((o, i) => (
              <div key={i} className="card">
                <span className="tag">{o.type || "Opening"}</span>
                <h3>{o.company}</h3>
                <p><strong>{o.role}</strong></p>
                {o.deadline && <p>Apply by: {o.deadline}</p>}
                {isSafe(o.applyLink) && (
                  <a className="btn small" href={o.applyLink} target="_blank" rel="noreferrer">
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <Link className="btn small" to="/placements">
          Go to Placements
        </Link>
      </section>
    ),

    highlights: (cls) => (
      <section key="highlights" className={cls}>
        <h2>Campus Highlights</h2>
        <div className="grid">
          {college.facilities.slice(0, 6).map((f, i) => (
            <div key={i} className="card">
              {f.image && <img className="card-img" src={f.image} alt={f.title} />}
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    ),

    contact: (cls) => (
      <section key="contact" className={cls}>
        <h2>Contact Us</h2>
        <div className="contact-lines">
          <p>📍 {college.address}</p>
          <p>✉️ {college.email}</p>
          <p>📞 {college.phone}</p>
        </div>
        <Link className="btn small" to="/contact">
          Contact page
        </Link>
      </section>
    ),
  };

  let n = 0;

  return (
    <>
      <Navbar />
      {site.homeSections
        .filter((s) => s.visible)
        .map((s) => {
          if (s.id === "hero") return hero;
          const cls = n++ % 2 === 0 ? "section" : "section dark";
          if (s.custom) {
            return (
              <section key={s.id} className={cls}>
                {s.title && <h2>{s.title}</h2>}
                {s.image && <img className="section-img" src={s.image} alt={s.title} />}
                {(s.body || "")
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((l, i) => (
                    <p key={i} className="lead">
                      {l}
                    </p>
                  ))}
              </section>
            );
          }
          return blocks[s.id] ? blocks[s.id](cls) : null;
        })}
      <Footer />
    </>
  );
}