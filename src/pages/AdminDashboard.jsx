import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSite } from "../SiteContext";
import SiteCustomizer from "../components/SiteCustomizer";
import ChangeHistory from "../components/ChangeHistory";
import FeedbackManager from "../components/FeedbackManager";
import FacultyManager from "../components/FacultyManager";
import StudentManager from "../components/StudentManager";
import CourseManager from "../components/CourseManager";
import ImageField from "../components/ImageField";
import { Field, ListEditor } from "../components/AdminFields";
import { programs, allProgramSubjects, TYPE_LABELS } from "../subjectsData";
import { ANNOUNCEMENT_CATEGORIES, todayISO, feeTotal } from "../utils";

function AnnouncementEditor({ items, onChange }) {
  const update = (i, key, value) =>
    onChange(items.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)));

  function remove(i) {
    if (window.confirm("Delete this announcement?")) {
      onChange(items.filter((_, idx) => idx !== i));
    }
  }

  function add() {
    onChange([
      {
        date: new Date().toLocaleDateString("en-IN"),
        title: "",
        category: ANNOUNCEMENT_CATEGORIES[0],
        details: "",
        publishOn: "",
        published: false,
      },
      ...items,
    ]);
  }

  const statusText = (a) =>
    a.published === false
      ? "Draft (hidden from the website)"
      : a.publishOn && a.publishOn > todayISO()
      ? `Scheduled: will appear on ${a.publishOn}`
      : "Live on the website";

  return (
    <div>
      <p className="hint">
        New announcements start as drafts. Tick Published to show one on the
        website. To schedule, pick a "Show from" date and it appears
        automatically from that day.
      </p>
      <button className="btn small" onClick={add}>
        + New announcement
      </button>
      {items.map((a, i) => (
        <div key={i} className="list-item" style={{ marginTop: 16 }}>
          <label className="field">
            <span>Category</span>
            <select
              value={a.category || ANNOUNCEMENT_CATEGORIES[0]}
              onChange={(e) => update(i, "category", e.target.value)}
            >
              {ANNOUNCEMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <Field label="Title" value={a.title} onChange={(v) => update(i, "title", v)} />
          <Field label="Date shown on the website" value={a.date} onChange={(v) => update(i, "date", v)} />
          <Field label="Details" long value={a.details} onChange={(v) => update(i, "details", v)} />
          <label className="field">
            <span>Show from (optional schedule date)</span>
            <input
              type="date"
              value={a.publishOn || ""}
              onChange={(e) => update(i, "publishOn", e.target.value)}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={a.published !== false}
              onChange={(e) => update(i, "published", e.target.checked)}
            />
            Published
          </label>
          <p className="hint">Status: {statusText(a)}</p>
          <button className="btn small danger" onClick={() => remove(i)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function Approvals({ materials, onChange }) {
  const [filter, setFilter] = useState("pending");
  const statusOf = (m) => m.status || "approved";
  const setStatus = (i, status) =>
    onChange(materials.map((m, idx) => (idx === i ? { ...m, status } : m)));
  const remove = (i) => {
    if (window.confirm("Delete this resource permanently?")) {
      onChange(materials.filter((_, idx) => idx !== i));
    }
  };
  const shown = materials.filter((m) => filter === "all" || statusOf(m) === filter);

  return (
    <div>
      <label className="field" style={{ maxWidth: 300 }}>
        <span>Show</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </label>

      {shown.length === 0 && <p className="hint">Nothing to show here.</p>}

      {materials.map((m, i) => {
        if (filter !== "all" && statusOf(m) !== filter) return null;
        const s = allProgramSubjects.find((x) => x.id === m.subjectId);
        return (
          <div key={i} className="list-item">
            <p>
              <strong>{m.title}</strong>{" "}
              <span className={`status ${statusOf(m)}`}>{statusOf(m)}</span>
            </p>
            <p>
              {s ? `${s.programName} · Sem ${s.semester} · ${s.name}` : "Unknown subject"}
            </p>
            <p>
              {TYPE_LABELS[m.type] || m.type}
              {m.category ? ` · ${m.category}` : ""}
              {m.uploadedBy ? ` · by ${m.uploadedBy}` : ""}
              {m.date ? ` · ${m.date}` : ""}
            </p>
            <p>
              <a href={m.link} target="_blank" rel="noreferrer">
                Check the link
              </a>
            </p>
            {statusOf(m) !== "approved" && (
              <>
                <button className="btn small" onClick={() => setStatus(i, "approved")}>
                  Approve
                </button>{" "}
              </>
            )}
            {statusOf(m) !== "rejected" && (
              <>
                <button className="btn small" onClick={() => setStatus(i, "rejected")}>
                  Reject
                </button>{" "}
              </>
            )}
            <button className="btn small danger" onClick={() => remove(i)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FeeEditor({ fees, onChange }) {
  const [filter, setFilter] = useState("all");

  const update = (index, key, value) =>
    onChange(fees.map((f, i) => (i === index ? { ...f, [key]: value } : f)));

  function remove(index) {
    if (window.confirm("Delete this fee structure?")) {
      onChange(fees.filter((_, i) => i !== index));
    }
  }

  function add() {
    onChange([
      ...fees,
      {
        courseId: filter === "all" ? (programs[0] ? programs[0].id : "") : filter,
        semester: "1",
        academicYear: "",
        tuition: "",
        admission: "",
        exam: "",
        lab: "",
        other: "",
        published: false,
      },
    ]);
  }

  function copyToNewYear(index) {
    onChange([...fees, { ...fees[index], academicYear: "", published: false }]);
  }

  return (
    <div>
      <p className="hint">
        Enter the official amounts in rupees (numbers only). A fee structure is
        shown on the website only when Published is ticked. To add a new
        academic year, use Copy to new academic year and change the year and
        amounts.
      </p>

      <label className="field" style={{ maxWidth: 400 }}>
        <span>Show course</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All courses</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      {fees.map((f, i) =>
        filter !== "all" && f.courseId !== filter ? null : (
          <div key={i} className="list-item">
            <label className="field">
              <span>Course</span>
              <select value={f.courseId} onChange={(e) => update(i, "courseId", e.target.value)}>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.full}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Semester</span>
              <select value={f.semester} onChange={(e) => update(i, "semester", e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={String(n)}>
                    Semester {n}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Academic year (e.g. 2026-27)" value={f.academicYear} onChange={(v) => update(i, "academicYear", v)} />
            <Field label="Tuition fee" value={f.tuition} onChange={(v) => update(i, "tuition", v)} />
            <Field label="Admission fee (leave empty if not applicable)" value={f.admission} onChange={(v) => update(i, "admission", v)} />
            <Field label="Examination fee" value={f.exam} onChange={(v) => update(i, "exam", v)} />
            <Field label="Laboratory fee (leave empty if not applicable)" value={f.lab} onChange={(v) => update(i, "lab", v)} />
            <Field label="Other charges" value={f.other} onChange={(v) => update(i, "other", v)} />
            <p>
              <strong>Total semester fee: ₹ {feeTotal(f).toLocaleString("en-IN")}</strong>
            </p>
            <label className="check">
              <input
                type="checkbox"
                checked={!!f.published}
                onChange={(e) => update(i, "published", e.target.checked)}
              />
              Published (visible on the website)
            </label>
            <button className="btn small" onClick={() => copyToNewYear(i)}>
              Copy to new academic year
            </button>{" "}
            <button className="btn small danger" onClick={() => remove(i)}>
              Delete
            </button>
          </div>
        )
      )}

      <button className="btn small" onClick={add}>
        + Add fee structure
      </button>
    </div>
  );
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "website", label: "Website customization (logo, colours, tabs, home sections)" },
  { id: "history", label: "Change history" },
  { id: "courses", label: "Courses, semesters and subjects" },
  { id: "faculty", label: "Faculty management" },
  { id: "students", label: "Student management" },
  { id: "home", label: "Home page: college name and welcome" },
  { id: "principal", label: "Principal (with photo)" },
  { id: "about", label: "About page (with pictures)" },
  { id: "announcements", label: "Announcements" },
  { id: "calendar", label: "Academic calendar" },
  { id: "fees", label: "Fee structure" },
  { id: "placements", label: "Placements" },
  { id: "approvals", label: "Resource approvals" },
  { id: "contact", label: "Contact details" },
  { id: "messages", label: "Contact messages" },
  { id: "pages", label: "Add a new page / tab" },
  { id: "feedback", label: "Feedback management" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    college,
    principal,
    allAnnouncements,
    calendar,
    customPages,
    feedback,
    messages,
    fees,
    placements,
    allMaterials,
    faculty,
    students,
    setContent,
    resetContent,
  } = useSite();
  const [section, setSection] = useState("overview");

  if (sessionStorage.getItem("adminLoggedIn") !== "yes") {
    return <Navigate to="/admin-login" replace />;
  }

  const setCollege = (key, value) =>
    setContent((prev) => ({ ...prev, college: { ...prev.college, [key]: value } }));
  const setPrincipal = (key, value) =>
    setContent((prev) => ({ ...prev, principal: { ...prev.principal, [key]: value } }));
  const setList = (name, items) => setContent((prev) => ({ ...prev, [name]: items }));
  const setPlacements = (key, value) =>
    setContent((prev) => ({ ...prev, placements: { ...prev.placements, [key]: value } }));
  const setPlacementInfo = (key, value) =>
    setContent((prev) => ({
      ...prev,
      placements: { ...prev.placements, info: { ...prev.placements.info, [key]: value } },
    }));

  const pending = allMaterials.filter((m) => m.status === "pending").length;
  const newFeedback = feedback.filter((f) => (f.status || "New") === "New").length;
  const activeFaculty = faculty.filter((f) => f.status !== "Inactive").length;
  const activeStudents = students.filter((s) => s.status !== "Inactive").length;
  const cardFields = [
    { key: "title", label: "Title" },
    { key: "text", label: "Text", long: true },
    { key: "image", label: "Picture (optional)", image: true },
  ];

  function logout() {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  }

  function reset() {
    if (window.confirm("Reset ALL website content back to the original? This cannot be undone.")) {
      resetContent();
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="brand">
          <span className="brand-mark">CH</span>
          <span>Admin Portal</span>
        </div>
        <nav className="nav-links">
          <Link to="/" target="_blank">
            View Website
          </Link>
          <button className="link-btn" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="section admin">
        <h2>Manage Website</h2>
        <p className="lead">
          Choose what you want to change or add. Content changes save
          automatically. Website customization needs Publish. Pictures are kept
          in this browser, so keep them small.
        </p>

        <label className="field" style={{ maxWidth: 500, marginTop: 20 }}>
          <span>What do you want to change or add?</span>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
                {s.id === "approvals" && pending > 0 ? ` (${pending} pending)` : ""}
                {s.id === "feedback" && newFeedback > 0 ? ` (${newFeedback} new)` : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-panel">
          {section === "overview" && (
            <>
              <h3>Overview</h3>
              <div className="facts">
                {[
                  ["Students", `${activeStudents} active of ${students.length}`],
                  ["Faculty", `${activeFaculty} active of ${faculty.length}`],
                  ["Courses", programs.length],
                  ["Uploaded resources", allMaterials.length],
                  ["Pending approvals", pending],
                  ["Announcements", allAnnouncements.length],
                  ["Placement openings", placements.openings.length],
                  ["Feedback received", feedback.length],
                  ["New feedback", newFeedback],
                  ["Contact messages", messages.length],
                ].map(([label, value]) => (
                  <div key={label} className="fact">
                    <strong>{label}</strong>
                    <span className="big">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "website" && (
            <>
              <h3>Website customization</h3>
              <SiteCustomizer />
            </>
          )}

          {section === "history" && (
            <>
              <h3>Change history</h3>
              <ChangeHistory />
            </>
          )}

          {section === "courses" && (
            <>
              <h3>Courses, semesters and subjects</h3>
              <CourseManager />
            </>
          )}

          {section === "faculty" && (
            <>
              <h3>Faculty management</h3>
              <FacultyManager />
            </>
          )}

          {section === "students" && (
            <>
              <h3>Student management</h3>
              <StudentManager />
            </>
          )}

          {section === "home" && (
            <>
              <h3>Home page</h3>
              <p className="hint">
                To change the big college picture, logo, colours or the order of
                Home page sections, use "Website customization".
              </p>
              <Field label="College name" value={college.name} onChange={(v) => setCollege("name", v)} />
              <Field label="Tagline" value={college.tagline} onChange={(v) => setCollege("tagline", v)} />
              <Field label="Welcome text" long value={college.intro} onChange={(v) => setCollege("intro", v)} />
            </>
          )}

          {section === "principal" && (
            <>
              <h3>Principal</h3>
              <ImageField
                label="Principal's photo"
                value={principal.image}
                maxWidth={500}
                onChange={(v) => setPrincipal("image", v)}
              />
              <Field label="Name" value={principal.name} onChange={(v) => setPrincipal("name", v)} />
              <Field label="Title" value={principal.title} onChange={(v) => setPrincipal("title", v)} />
              <Field label="Message" long value={principal.message} onChange={(v) => setPrincipal("message", v)} />
            </>
          )}

          {section === "about" && (
            <>
              <h3>Our Story</h3>
              <ImageField
                label="College picture for the About page"
                value={college.aboutImage}
                maxWidth={1000}
                onChange={(v) => setCollege("aboutImage", v)}
              />
              <Field label="Introduction" long value={college.about} onChange={(v) => setCollege("about", v)} />
              <Field label="History" long value={college.history} onChange={(v) => setCollege("history", v)} />
              <h3>Vision and Mission</h3>
              <Field label="Vision" long value={college.vision} onChange={(v) => setCollege("vision", v)} />
              <Field label="Mission" long value={college.mission} onChange={(v) => setCollege("mission", v)} />
              <h3>Core Values</h3>
              <ListEditor items={college.values || []} fields={cardFields} onChange={(items) => setCollege("values", items)} addLabel="Add a value" />
              <h3>Infrastructure and Facilities</h3>
              <ListEditor items={college.facilities || []} fields={cardFields} onChange={(items) => setCollege("facilities", items)} addLabel="Add a facility" />
              <h3>Achievements</h3>
              <ListEditor items={college.achievements || []} fields={cardFields} onChange={(items) => setCollege("achievements", items)} addLabel="Add an achievement" />
              <h3>Clubs and Committees</h3>
              <ListEditor items={college.clubs || []} fields={cardFields} onChange={(items) => setCollege("clubs", items)} addLabel="Add a club or committee" />
              <h3>College Activities</h3>
              <ListEditor items={college.activities || []} fields={cardFields} onChange={(items) => setCollege("activities", items)} addLabel="Add an activity" />
              <h3>Numbers</h3>
              <ListEditor
                items={college.stats || []}
                fields={[{ key: "value", label: "Number (e.g. 500+)" }, { key: "label", label: "Label" }]}
                onChange={(items) => setCollege("stats", items)}
                addLabel="Add a number"
              />
            </>
          )}

          {section === "announcements" && (
            <>
              <h3>Announcements</h3>
              <AnnouncementEditor
                items={allAnnouncements}
                onChange={(items) => setList("announcements", items)}
              />
            </>
          )}

          {section === "calendar" && (
            <>
              <h3>Academic calendar</h3>
              <p className="hint">
                Add exam schedules, holidays and important dates. Students see
                these in their dashboard.
              </p>
              <ListEditor
                items={calendar}
                fields={[{ key: "date", label: "Date (e.g. 15 Dec 2026)" }, { key: "title", label: "Event" }]}
                onChange={(items) => setList("calendar", items)}
                addLabel="Add a calendar event"
              />
            </>
          )}

          {section === "fees" && (
            <>
              <h3>Fee structure</h3>
              <FeeEditor fees={fees} onChange={(items) => setList("fees", items)} />
            </>
          )}

          {section === "placements" && (
            <>
              <h3>Openings (jobs, internships, campus recruitment)</h3>
              <p className="hint">For Type, write Job, Internship or Campus Recruitment.</p>
              <ListEditor
                items={placements.openings}
                fields={[
                  { key: "company", label: "Company" },
                  { key: "role", label: "Role / position" },
                  { key: "type", label: "Type" },
                  { key: "eligibility", label: "Eligibility criteria" },
                  { key: "salary", label: "Salary details" },
                  { key: "deadline", label: "Application deadline" },
                  { key: "applyLink", label: "Apply Now link (https://...)" },
                  { key: "details", label: "Details", long: true },
                ]}
                onChange={(items) => setPlacements("openings", items)}
                addLabel="Add an opening"
              />
              <h3>Placement statistics</h3>
              <ListEditor
                items={placements.stats}
                fields={[{ key: "value", label: "Number (e.g. 85%)" }, { key: "label", label: "Label" }]}
                onChange={(items) => setPlacements("stats", items)}
                addLabel="Add a statistic"
              />
              <h3>Guidance text</h3>
              <p className="hint">Press Enter to start a new line.</p>
              <Field label="Career guidance" long value={placements.info.guidance} onChange={(v) => setPlacementInfo("guidance", v)} />
              <Field label="Resume preparation" long value={placements.info.resume} onChange={(v) => setPlacementInfo("resume", v)} />
              <Field label="Interview preparation" long value={placements.info.interview} onChange={(v) => setPlacementInfo("interview", v)} />
            </>
          )}

          {section === "approvals" && (
            <>
              <h3>Resource approvals</h3>
              <p className="hint">
                Faculty uploads appear to students only after you approve them.
              </p>
              <Approvals materials={allMaterials} onChange={(items) => setList("materials", items)} />
            </>
          )}

          {section === "contact" && (
            <>
              <h3>Contact details</h3>
              <Field label="Address" value={college.address} onChange={(v) => setCollege("address", v)} />
              <Field label="Phone" value={college.phone} onChange={(v) => setCollege("phone", v)} />
              <Field label="Email" value={college.email} onChange={(v) => setCollege("email", v)} />
              <Field label="Office timings" value={college.officeTimings} onChange={(v) => setCollege("officeTimings", v)} />
              <h3>Map</h3>
              <p className="hint">
                In Google Maps, search your college, click Share, then Embed a
                map, and copy only the address inside src="..." (it starts with
                https://www.google.com/maps/embed).
              </p>
              <Field label="Map embed link" value={college.mapUrl} onChange={(v) => setCollege("mapUrl", v)} />
              <h3>Department contacts</h3>
              <ListEditor
                items={college.departments || []}
                fields={[{ key: "name", label: "Department" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }]}
                onChange={(items) => setCollege("departments", items)}
                addLabel="Add a department"
              />
              <h3>Social media links</h3>
              <ListEditor
                items={college.socials || []}
                fields={[{ key: "name", label: "Name (e.g. Instagram)" }, { key: "url", label: "Link (https://...)" }]}
                onChange={(items) => setCollege("socials", items)}
                addLabel="Add a social link"
              />
            </>
          )}

          {section === "messages" && (
            <>
              <h3>Contact messages</h3>
              {messages.length === 0 ? (
                <p className="hint">No messages yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="list-item">
                    <p>
                      <strong>{m.name}</strong> · {m.email}
                      {m.phone ? ` · ${m.phone}` : ""} · {m.date}
                    </p>
                    {m.subject && <p><strong>{m.subject}</strong></p>}
                    <p>{m.message}</p>
                    <button
                      className="btn small danger"
                      onClick={() => setList("messages", messages.filter((_, idx) => idx !== i))}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {section === "pages" && (
            <>
              <h3>New pages</h3>
              <p className="hint">
                Each page you add gets its own tab in the navigation bar. Press
                Enter in the text box to start a new paragraph.
              </p>
              <ListEditor
                items={customPages}
                fields={[
                  { key: "title", label: "Page title (shown on the tab)" },
                  { key: "image", label: "Picture (optional)", image: true },
                  { key: "body", label: "Page text", long: true },
                ]}
                onChange={(items) => setList("customPages", items)}
                addLabel="Add a new page"
              />
            </>
          )}

          {section === "feedback" && (
            <>
              <h3>Feedback management</h3>
              <FeedbackManager />
            </>
          )}
        </div>

        <button className="btn small danger" onClick={reset}>
          Reset website to original
        </button>
      </main>
    </>
  );
}