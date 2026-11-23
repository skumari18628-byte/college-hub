import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";

const isSafe = (url) => /^https?:\/\//i.test(url || "");
const paragraphs = (text) => (text || "").split("\n").filter((l) => l.trim());

export default function Placements() {
  const { placements } = useSite();
  const { info, openings, stats } = placements;

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Placements</h1>
        <p className="banner-sub">Jobs, internships and campus recruitment</p>
      </section>

      <section className="section">
        <h2>Placement Opportunities</h2>
        {openings.length === 0 ? (
          <p className="empty">
            No openings are listed right now. New jobs, internships and campus
            drives will appear here.
          </p>
        ) : (
          <div className="grid">
            {openings.map((o, i) => (
              <div key={i} className="card">
                <span className="tag">{o.type || "Opening"}</span>
                <h3>{o.company}</h3>
                <p><strong>{o.role}</strong></p>
                {o.eligibility && <p>Eligibility: {o.eligibility}</p>}
                {o.salary && <p>Salary: {o.salary}</p>}
                {o.deadline && <p>Apply by: {o.deadline}</p>}
                {o.details && <p>{o.details}</p>}
                {isSafe(o.applyLink) && (
                  <a className="btn small" href={o.applyLink} target="_blank" rel="noreferrer">
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {stats.length > 0 && (
        <section className="section dark">
          <h2>Placement Statistics</h2>
          <div className="stats">
            {stats.map((s, i) => (
              <div key={i} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Career Guidance</h2>
        <div className="grid">
          <div className="card">
            <h3>Career Guidance</h3>
            {paragraphs(info.guidance).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="card">
            <h3>Resume Preparation</h3>
            {paragraphs(info.resume).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="card">
            <h3>Interview Preparation</h3>
            {paragraphs(info.interview).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}