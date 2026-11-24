import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LevelBlocks from "../components/LevelBlocks";
import { useSite } from "../SiteContext";
import { allProgramSubjects, TYPE_LABELS } from "../subjectsData";

export default function CourseMaterial() {
  const { recentlyViewed } = useSite();

  const recent = recentlyViewed
    .slice(0, 6)
    .map((r) => {
      const s = allProgramSubjects.find((x) => x.id === r.subjectId);
      return s ? { ...r, s } : null;
    })
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Course Material</h1>
        <p className="banner-sub">
          Course → Semester → Subject → Notes, Question Papers and Lecture Videos
        </p>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <h2>Recently Viewed</h2>
          <ul className="material-list">
            {recent.map((r) => (
              <li key={r.key}>
                <span>
                  <strong>{r.title}</strong>
                  <br />
                  {TYPE_LABELS[r.type] || r.type} · {r.s.programName} · {r.s.name}
                </span>
                <Link className="btn small" to={`/course-material/${r.s.programId}/${r.s.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section">
        <LevelBlocks basePath="/course-material" />
      </section>
      <Footer />
    </>
  );
}