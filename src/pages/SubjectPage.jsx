import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PortalHeader from "../components/PortalHeader";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { allSubjects } from "../subjectsData";

const TYPES = ["Notes", "Question Papers", "Videos"];

export default function SubjectPage() {
  const { subjectId } = useParams();
  const { materials } = useSite();
  const [type, setType] = useState("Notes");

  if (sessionStorage.getItem("studentLoggedIn") !== "yes") {
    return <Navigate to="/student-login" replace />;
  }

  const subject = allSubjects.find((s) => s.id === subjectId);
  if (!subject) {
    return <Navigate to="/student-dashboard" replace />;
  }

  const items = materials.filter(
    (m) => m.subjectId === subjectId && m.type === type
  );

  return (
    <>
      <PortalHeader title="Student Portal" sessionKey="studentLoggedIn" />

      <main className="section">
        <Link className="back-link-inline" to="/student-dashboard">
          ← Back to subjects
        </Link>
        <h2>{subject.name}</h2>
        <p className="lead">Semester {subject.semester}</p>

        <div className="tabs">
          {TYPES.map((t) => (
            <button
              key={t}
              className={t === type ? "tab active" : "tab"}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="empty">
            Nothing here yet. Your faculty will add {type.toLowerCase()} soon.
          </p>
        ) : (
          <ul className="material-list">
            {items.map((m, i) => (
              <li key={i}>
                <span>{m.title}</span>
                {/^https?:\/\//i.test(m.link) && (
                  <a className="btn small" href={m.link} target="_blank" rel="noreferrer">
                    {type === "Videos" ? "Watch" : "Open"}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </>
  );
}