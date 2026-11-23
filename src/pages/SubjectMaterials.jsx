import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { programs, CATEGORIES, TYPE_LABELS } from "../subjectsData";
import { matKey } from "../utils";

const OPTIONS = [
  { type: "Notes", icon: "📘", hint: "PDFs, unit-wise notes, PPTs, assignments, practical notes" },
  { type: "Question Papers", icon: "📝", hint: "Previous-year, model and internal papers" },
  { type: "Videos", icon: "🎬", hint: "Recorded lectures and topic-wise videos" },
];

function youtubeEmbed(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

const isSafe = (url) => /^https?:\/\//i.test(url);

export default function SubjectMaterials({ base = "academics" }) {
  const { courseId, subjectId } = useParams();
  const { materials, saved, setContent } = useSite();
  const [type, setType] = useState(null);

  const program = programs.find((p) => p.id === courseId);
  const subject = program
    ? Object.entries(program.subjects)
        .flatMap(([semester, list]) =>
          list.map((s) => ({ ...s, semester: Number(semester) }))
        )
        .find((s) => s.id === subjectId)
    : null;

  function toggleSave(m) {
    const k = matKey(m);
    setContent((prev) => ({
      ...prev,
      saved: prev.saved.includes(k)
        ? prev.saved.filter((x) => x !== k)
        : [...prev.saved, k],
    }));
  }

  function logOpen(m) {
    setContent((prev) => ({
      ...prev,
      downloadLog: [
        {
          key: matKey(m),
          title: m.title,
          subjectId: m.subjectId,
          type: m.type,
          date: new Date().toLocaleString("en-IN"),
        },
        ...prev.downloadLog,
      ].slice(0, 50),
    }));
  }

  if (!program || !subject) {
    return (
      <>
        <Navbar />
        <section className="section">
          <h2>Subject not found</h2>
          <Link className="back-link-inline" to={`/${base}`}>
            ← Back
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const forSubject = materials.filter((m) => m.subjectId === subjectId);
  const items = type ? forSubject.filter((m) => m.type === type) : [];

  let groups = [];
  if (type) {
    groups = CATEGORIES[type]
      .map((cat) => ({ cat, list: items.filter((m) => m.category === cat) }))
      .filter((g) => g.list.length > 0);
    const other = items.filter((m) => !CATEGORIES[type].includes(m.category));
    if (other.length > 0) groups.push({ cat: "Other", list: other });
  }

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>{subject.name}</h1>
        <p className="banner-sub">
          {program.name} · Semester {subject.semester}
        </p>
      </section>

      <section className="section">
        <Link className="back-link-inline" to={`/${base}/${program.id}`}>
          ← Back to {program.name} semesters
        </Link>

        <h2>What do you need?</h2>
        <div className="grid">
          {OPTIONS.map((o) => {
            const count = forSubject.filter((m) => m.type === o.type).length;
            return (
              <button
                key={o.type}
                className={type === o.type ? "card option active" : "card option"}
                onClick={() => setType(o.type)}
              >
                <span className="option-icon">{o.icon}</span>
                <span className="option-title">{TYPE_LABELS[o.type]}</span>
                <span className="option-hint">{o.hint}</span>
                <span>{count} available</span>
              </button>
            );
          })}
        </div>

        {type && (
          <div style={{ marginTop: 30 }}>
            <h2>{TYPE_LABELS[type]}</h2>
            {groups.length === 0 ? (
              <p className="empty">
                No {TYPE_LABELS[type].toLowerCase()} are available for this
                subject yet. They will appear here as soon as they are uploaded
                and approved.
              </p>
            ) : (
              groups.map((g) => (
                <div key={g.cat} className="material-group">
                  <h3>{g.cat}</h3>
                  <ul className="material-list">
                    {g.list.map((m, i) => {
                      const embed = type === "Videos" ? youtubeEmbed(m.link) : null;
                      return (
                        <li key={i} style={{ display: "block" }}>
                          <div className="material-row">
                            <span>{m.title}</span>
                            <span>
                              {isSafe(m.link) && !embed && (
                                <a
                                  className="btn small"
                                  href={m.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => logOpen(m)}
                                >
                                  {type === "Videos" ? "Watch" : "Open / Download"}
                                </a>
                              )}{" "}
                              <button className="btn small" onClick={() => toggleSave(m)}>
                                {saved.includes(matKey(m)) ? "★ Saved" : "☆ Save"}
                              </button>
                            </span>
                          </div>
                          {embed && (
                            <iframe
                              className="video-frame"
                              src={embed}
                              title={m.title}
                              allowFullScreen
                              loading="lazy"
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}