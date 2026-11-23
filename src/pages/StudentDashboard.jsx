import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PortalHeader from "../components/PortalHeader";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { programs, allProgramSubjects, TYPE_LABELS } from "../subjectsData";
import { matKey, feeTotal } from "../utils";

const TABS = [
  ["overview", "My Profile"],
  ["materials", "Course Materials"],
  ["recent", "Recently Uploaded"],
  ["saved", "Saved Materials"],
  ["notifications", "Notifications"],
  ["announcements", "Announcements"],
  ["calendar", "Academic Calendar"],
  ["fees", "Fee Structure"],
  ["placements", "Placements"],
  ["feedback", "Feedback"],
  ["downloads", "Download History"],
];

const rupee = (n) => `₹ ${(Number(n) || 0).toLocaleString("en-IN")}`;
const isSafe = (url) => /^https?:\/\//i.test(url || "");

function MaterialRow({ m }) {
  const s = allProgramSubjects.find((x) => x.id === m.subjectId);
  return (
    <li>
      <span>
        <strong>{m.title}</strong>
        <br />
        {s ? `${s.programName} · Sem ${s.semester} · ${s.name}` : ""}
        <br />
        {TYPE_LABELS[m.type] || m.type}
        {m.category ? ` · ${m.category}` : ""}
      </span>
      {s && (
        <Link className="btn small" to={`/course-material/${s.programId}/${s.id}`}>
          Open subject
        </Link>
      )}
    </li>
  );
}

export default function StudentDashboard() {
  const {
    studentProfile: p,
    materials,
    saved,
    downloadLog,
    announcements,
    calendar,
    fees,
    placements,
    setContent,
  } = useSite();
  const [tab, setTab] = useState("overview");

  if (sessionStorage.getItem("studentLoggedIn") !== "yes") {
    return <Navigate to="/student-login" replace />;
  }

  const program = programs.find((x) => x.id === p.course) || programs[0];
  const sem = Number(p.semester) || 1;
  const subjects = program.subjects[sem] || [];

  const setProfile = (key, value) =>
    setContent((prev) => ({
      ...prev,
      studentProfile: { ...prev.studentProfile, [key]: value },
    }));

  const recent = [...materials].reverse().slice(0, 8);
  const savedItems = materials.filter((m) => saved.includes(matKey(m)));
  const urgent = announcements.filter((a) => a.category === "Urgent Announcements");
  const myFee = fees
    .filter((f) => f.courseId === program.id && f.published && Number(f.semester) === sem)
    .sort((a, b) => (b.academicYear || "").localeCompare(a.academicYear || ""))[0];

  return (
    <>
      <PortalHeader title="Student Portal" sessionKey="studentLoggedIn" />

      <main className="section">
        <h2>Welcome{p.name ? `, ${p.name}` : ", Student"}</h2>
        <p className="lead">
          {program.name} · Semester {sem}
        </p>

        <div className="tabs">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              className={id === tab ? "tab active" : "tab"}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="admin-panel">
            <h3>My Profile</h3>
            <label className="field">
              <span>Full name</span>
              <input type="text" value={p.name} onChange={(e) => setProfile("name", e.target.value)} />
            </label>
            <label className="field">
              <span>Registration number</span>
              <input type="text" value={p.regNo} onChange={(e) => setProfile("regNo", e.target.value)} />
            </label>
            <label className="field">
              <span>Course</span>
              <select
                value={p.course}
                onChange={(e) => {
                  setProfile("course", e.target.value);
                  setProfile("semester", "1");
                }}
              >
                {programs.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} - {x.full}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Semester</span>
              <select value={p.semester} onChange={(e) => setProfile("semester", e.target.value)}>
                {Array.from({ length: program.semesters }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    Semester {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Email</span>
              <input type="text" value={p.email} onChange={(e) => setProfile("email", e.target.value)} />
            </label>
            <label className="field">
              <span>Phone</span>
              <input type="text" value={p.phone} onChange={(e) => setProfile("phone", e.target.value)} />
            </label>
            <h3>Course and Semester</h3>
            <p>
              <strong>{program.full}</strong> · {program.duration}
            </p>
            <p>
              Semester {sem} has {subjects.length} subject{subjects.length === 1 ? "" : "s"}.
            </p>
          </div>
        )}

        {tab === "materials" && (
          <>
            <h3 className="plain-h3">
              {program.name} · Semester {sem} subjects
            </h3>
            {subjects.length === 0 ? (
              <p className="empty">Subjects for this semester will be added soon.</p>
            ) : (
              <div className="grid">
                {subjects.map((s) => (
                  <Link key={s.id} className="card" to={`/course-material/${program.id}/${s.id}`}>
                    <h3>{s.name}</h3>
                    <p>Notes, question papers and lecture videos →</p>
                  </Link>
                ))}
              </div>
            )}
            <Link className="btn small" to="/course-material">
              Browse all courses
            </Link>
          </>
        )}

        {tab === "recent" &&
          (recent.length === 0 ? (
            <p className="empty">No resources have been uploaded yet.</p>
          ) : (
            <ul className="material-list">
              {recent.map((m, i) => (
                <MaterialRow key={i} m={m} />
              ))}
            </ul>
          ))}

        {tab === "saved" &&
          (savedItems.length === 0 ? (
            <p className="empty">
              You have not saved anything yet. Use the Save button on a subject
              page to keep materials here.
            </p>
          ) : (
            <ul className="material-list">
              {savedItems.map((m, i) => (
                <MaterialRow key={i} m={m} />
              ))}
            </ul>
          ))}

        {tab === "notifications" && (
          <>
            {urgent.map((a, i) => (
              <div key={i} className="card urgent" style={{ marginBottom: 12 }}>
                <span className="tag">Urgent</span>
                <h3>{a.title}</h3>
                <p>{a.details}</p>
              </div>
            ))}
            {recent.slice(0, 5).map((m, i) => (
              <div key={i} className="card" style={{ marginBottom: 12 }}>
                <h3>New material added</h3>
                <p>{m.title}</p>
              </div>
            ))}
            {urgent.length === 0 && recent.length === 0 && (
              <p className="empty">You have no new notifications.</p>
            )}
          </>
        )}

        {tab === "announcements" && (
          <>
            {announcements.length === 0 ? (
              <p className="empty">No announcements right now.</p>
            ) : (
              <ul className="announce-list">
                {announcements.slice(0, 8).map((a, i) => (
                  <li key={i}>
                    <span className="date">{a.date}</span>
                    <span>
                      <strong>{a.title}</strong>
                      <br />
                      {a.category || "General Notices"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link className="btn small" to="/announcements">
              All announcements
            </Link>
          </>
        )}

        {tab === "calendar" &&
          (calendar.length === 0 ? (
            <p className="empty">The academic calendar will be published soon.</p>
          ) : (
            <ul className="announce-list">
              {calendar.map((c, i) => (
                <li key={i}>
                  <span className="date">{c.date}</span>
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          ))}

        {tab === "fees" && (
          <>
            {myFee ? (
              <div className="card" style={{ maxWidth: 420 }}>
                <h3>
                  {program.name} · Semester {sem}
                </h3>
                <table className="fee-table">
                  <tbody>
                    <tr><td>Tuition fee</td><td>{rupee(myFee.tuition)}</td></tr>
                    <tr><td>Admission fee</td><td>{Number(myFee.admission) > 0 ? rupee(myFee.admission) : "Not applicable"}</td></tr>
                    <tr><td>Examination fee</td><td>{rupee(myFee.exam)}</td></tr>
                    <tr><td>Laboratory fee</td><td>{Number(myFee.lab) > 0 ? rupee(myFee.lab) : "Not applicable"}</td></tr>
                    <tr><td>Other charges</td><td>{Number(myFee.other) > 0 ? rupee(myFee.other) : "Not applicable"}</td></tr>
                    <tr className="total"><td>Total semester fee</td><td>{rupee(feeTotal(myFee))}</td></tr>
                    <tr><td>Academic year</td><td>{myFee.academicYear}</td></tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty">
                The fee structure for your course and semester has not been
                published yet.
              </p>
            )}
            <Link className="btn small" to={`/fee-structure/${program.id}`}>
              Full fee structure
            </Link>
          </>
        )}

        {tab === "placements" && (
          <>
            {placements.openings.length === 0 ? (
              <p className="empty">No placement openings right now.</p>
            ) : (
              <div className="grid">
                {placements.openings.slice(0, 6).map((o, i) => (
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
          </>
        )}

        {tab === "feedback" && (
          <>
            <p className="lead">
              Tell us what is working well and what we can improve.
            </p>
            <Link className="btn" to="/feedback">
              Give Feedback
            </Link>
          </>
        )}

        {tab === "downloads" &&
          (downloadLog.length === 0 ? (
            <p className="empty">
              Materials you open or download will be listed here.
            </p>
          ) : (
            <ul className="material-list">
              {downloadLog.map((d, i) => (
                <li key={i}>
                  <span>
                    <strong>{d.title}</strong>
                    <br />
                    {TYPE_LABELS[d.type] || d.type} · {d.date}
                  </span>
                </li>
              ))}
            </ul>
          ))}
      </main>

      <Footer />
    </>
  );
}