import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { programs } from "../subjectsData";

export default function CourseSemesters({ base = "academics", showInfo = true }) {
  const { courseId } = useParams();
  const [semester, setSemester] = useState(1);
  const program = programs.find((p) => p.id === courseId);

  if (!program) {
    return (
      <>
        <Navbar />
        <section className="section">
          <h2>Course not found</h2>
          <Link className="back-link-inline" to={`/${base}`}>
            ← Back
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const semesterNumbers = Array.from({ length: program.semesters }, (_, i) => i + 1);
  const subjects = program.subjects[semester] || [];
  const backLink = (
    <Link className="back-link-inline" to={`/${base}`}>
      ← All courses
    </Link>
  );

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>{program.name}</h1>
        <p className="banner-sub">{program.full}</p>
      </section>

      {showInfo && (
        <section className="section">
          {backLink}
          <h2>About the Course</h2>
          <p className="lead">{program.description}</p>
          <div className="facts">
            <div className="fact">
              <strong>Duration</strong>
              <span>{program.duration}</span>
            </div>
            <div className="fact">
              <strong>Eligibility</strong>
              <span>{program.eligibility}</span>
            </div>
            <div className="fact">
              <strong>Medium</strong>
              <span>English</span>
            </div>
            <div className="fact">
              <strong>Level</strong>
              <span>{program.level === "UG" ? "Undergraduate" : "Postgraduate"}</span>
            </div>
          </div>
        </section>
      )}

      <section className="section dark">
        {!showInfo && backLink}
        <h2>Semesters and Subjects</h2>
        <div className="tabs">
          {semesterNumbers.map((n) => (
            <button
              key={n}
              className={n === semester ? "tab active" : "tab"}
              onClick={() => setSemester(n)}
            >
              Semester {n}
            </button>
          ))}
        </div>

        <h3 className="sem-heading">Semester {semester}</h3>
        {subjects.length === 0 ? (
          <p className="empty">Subjects for this semester will be added soon.</p>
        ) : (
          <div className="grid">
            {subjects.map((s) => (
              <Link
                key={s.id}
                className="card"
                to={`/${base}/${program.id}/${s.id}`}
              >
                <h3>{s.name}</h3>
                <p>Notes, question papers and lecture videos →</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {showInfo && (
        <>
          <section className="section">
            <h2>Career Opportunities</h2>
            <ul className="career-list">
              {program.careers.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="section dark">
            <h2>Faculty</h2>
            <p className="lead">
              Faculty details for this course will be published here by the Admin.
            </p>
          </section>
        </>
      )}

      <Footer />
    </>
  );
}