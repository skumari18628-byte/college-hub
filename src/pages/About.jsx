import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";

function CardGrid({ items, empty }) {
  if (!items || items.length === 0) return <p className="empty">{empty}</p>;
  return (
    <div className="grid">
      {items.map((it, i) => (
        <div key={i} className="card">
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const { college, principal } = useSite();

  return (
    <>
      <Navbar />

      <section className="page-banner">
        <h1>About Us</h1>
        <p className="banner-sub">{college.tagline}</p>
      </section>

      <section className="section">
        <h2>Our Story</h2>
        <div className="about-text">
          <p className="lead">{college.about}</p>
          <p>{college.history}</p>
        </div>
        <div className="stats">
          {college.stats.map((s, i) => (
            <div key={i} className="stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section dark">
        <h2>Principal's Message</h2>
        <p className="lead">{principal.message}</p>
        <p className="principal-name" style={{ color: "var(--gold)" }}>{principal.name}</p>
        <p>{principal.title}</p>
      </section>

      <section className="section">
        <h2>Vision and Mission</h2>
        <div className="grid">
          <div className="card">
            <h3>Our Vision</h3>
            <p>{college.vision}</p>
          </div>
          <div className="card">
            <h3>Our Mission</h3>
            <p>{college.mission}</p>
          </div>
        </div>
      </section>

      <section className="section dark">
        <h2>Our Core Values</h2>
        <CardGrid items={college.values} empty="Coming soon." />
      </section>

      <section className="section">
        <h2>Infrastructure and Facilities</h2>
        <CardGrid items={college.facilities} empty="Coming soon." />
      </section>

      <section className="section dark">
        <h2>Achievements</h2>
        <CardGrid
          items={college.achievements}
          empty="Our achievements will be listed here soon."
        />
      </section>

      <section className="section">
        <h2>Clubs and Committees</h2>
        <CardGrid items={college.clubs} empty="Coming soon." />
      </section>

      <section className="section dark">
        <h2>College Activities</h2>
        <CardGrid items={college.activities} empty="Coming soon." />
      </section>

      <section className="section center">
        <h2>Be a Part of Our Family</h2>
        <p className="lead">
          Explore our courses, read the latest announcements, or get in touch.
          We would love to hear from you.
        </p>
        <div className="cta-buttons">
          <Link className="btn" to="/academics">
            View Courses
          </Link>
          <Link className="btn" to="/contact">
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}