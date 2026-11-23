import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite, slugify } from "../SiteContext";
import { programs, allProgramSubjects, TYPE_LABELS } from "../subjectsData";

function Group({ title, children }) {
  return (
    <div className="material-group">
      <h3>{title}</h3>
      <ul className="material-list">{children}</ul>
    </div>
  );
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const urlQ = params.get("q") || "";
  const { announcements, materials, placements, customPages } = useSite();
  const q = urlQ.trim().toLowerCase();

  function onSubmit(e) {
    e.preventDefault();
    const v = String(new FormData(e.currentTarget).get("q") || "").trim();
    setParams(v ? { q: v } : {});
  }

  const match = (...texts) => texts.some((t) => (t || "").toLowerCase().includes(q));

  const courses = q ? programs.filter((p) => match(p.name, p.full)) : [];
  const subjects = q ? allProgramSubjects.filter((s) => match(s.name)).slice(0, 30) : [];
  const files = q ? materials.filter((m) => match(m.title, m.category)).slice(0, 20) : [];
  const notices = q ? announcements.filter((a) => match(a.title, a.details, a.category)) : [];
  const jobs = q ? placements.openings.filter((o) => match(o.company, o.role, o.details)) : [];
  const pages = q ? customPages.filter((p) => p.title && match(p.title, p.body)) : [];
  const total =
    courses.length + subjects.length + files.length + notices.length + jobs.length + pages.length;

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Search</h1>
      </section>

      <section className="section">
        <form key={urlQ} className="search-form" onSubmit={onSubmit}>
          <input name="q" type="text" defaultValue={urlQ} placeholder="Search courses, subjects, notes, notices..." />
          <button className="btn small" type="submit">
            Search
          </button>
        </form>

        {!q && <p className="empty">Type something to search the whole website.</p>}
        {q && total === 0 && (
          <p className="empty">No results found for "{urlQ}". Try a different word.</p>
        )}

        {courses.length > 0 && (
          <Group title="Courses">
            {courses.map((p) => (
              <li key={p.id}>
                <span>
                  <strong>{p.name}</strong> · {p.full}
                </span>
                <Link className="btn small" to={`/academics/${p.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </Group>
        )}

        {subjects.length > 0 && (
          <Group title="Subjects">
            {subjects.map((s) => (
              <li key={s.id}>
                <span>
                  <strong>{s.name}</strong>
                  <br />
                  {s.programName} · Semester {s.semester}
                </span>
                <Link className="btn small" to={`/course-material/${s.programId}/${s.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </Group>
        )}

        {files.length > 0 && (
          <Group title="Course materials">
            {files.map((m, i) => {
              const s = allProgramSubjects.find((x) => x.id === m.subjectId);
              return (
                <li key={i}>
                  <span>
                    <strong>{m.title}</strong>
                    <br />
                    {TYPE_LABELS[m.type] || m.type}
                    {s ? ` · ${s.programName} · ${s.name}` : ""}
                  </span>
                  {s && (
                    <Link className="btn small" to={`/course-material/${s.programId}/${s.id}`}>
                      Open subject
                    </Link>
                  )}
                </li>
              );
            })}
          </Group>
        )}

        {notices.length > 0 && (
          <Group title="Announcements">
            {notices.map((a, i) => (
              <li key={i}>
                <span>
                  <strong>{a.title}</strong>
                  <br />
                  {a.category || "General Notices"} · {a.date}
                </span>
                <Link className="btn small" to="/announcements">
                  View
                </Link>
              </li>
            ))}
          </Group>
        )}

        {jobs.length > 0 && (
          <Group title="Placements">
            {jobs.map((o, i) => (
              <li key={i}>
                <span>
                  <strong>{o.company}</strong> · {o.role}
                </span>
                <Link className="btn small" to="/placements">
                  View
                </Link>
              </li>
            ))}
          </Group>
        )}

        {pages.length > 0 && (
          <Group title="Pages">
            {pages.map((p, i) => (
              <li key={i}>
                <span>
                  <strong>{p.title}</strong>
                </span>
                <Link className="btn small" to={`/page/${slugify(p.title)}`}>
                  Open
                </Link>
              </li>
            ))}
          </Group>
        )}
      </section>

      <Footer />
    </>
  );
}