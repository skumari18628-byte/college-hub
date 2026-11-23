import { useState } from "react";
import { Navigate } from "react-router-dom";
import PortalHeader from "../components/PortalHeader";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import {
  programs,
  allProgramSubjects,
  CATEGORIES,
  TYPE_LABELS,
} from "../subjectsData";
import { newId } from "../utils";

const TYPES = ["Notes", "Question Papers", "Videos"];
const TABS = [
  ["profile", "My Profile"],
  ["assigned", "Assigned Subjects"],
  ["upload", "Upload Material"],
  ["uploads", "Upload History"],
  ["announcements", "Announcements"],
];
const STATUS_LABEL = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};
const programsWithSubjects = programs.filter(
  (p) => Object.keys(p.subjects).length > 0
);

function Input({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function FacultyDashboard() {
  const { allMaterials, announcements, facultyProfile: fp, setContent } = useSite();
  const [tab, setTab] = useState("profile");
  const [programId, setProgramId] = useState(programsWithSubjects[0].id);
  const [semester, setSemester] = useState(1);
  const [subjectId, setSubjectId] = useState(programsWithSubjects[0].subjects[1][0].id);
  const [type, setType] = useState("Notes");
  const [category, setCategory] = useState(CATEGORIES["Notes"][0]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: "", link: "", category: "" });

  if (sessionStorage.getItem("facultyLoggedIn") !== "yes") {
    return <Navigate to="/faculty-login" replace />;
  }

  const program = programs.find((p) => p.id === programId);
  const subjectList = program.subjects[semester] || [];

  const setProfile = (key, value) =>
    setContent((prev) => ({
      ...prev,
      facultyProfile: { ...prev.facultyProfile, [key]: value },
    }));

  function changeProgram(id) {
    const p = programs.find((x) => x.id === id);
    setProgramId(id);
    setSemester(1);
    setSubjectId((p.subjects[1] || [])[0]?.id || "");
  }

  function changeSemester(value) {
    const n = Number(value);
    setSemester(n);
    setSubjectId((program.subjects[n] || [])[0]?.id || "");
  }

  function changeType(t) {
    setType(t);
    setCategory(CATEGORIES[t][0]);
  }

  function addAssigned() {
    if (!subjectId || fp.assigned.includes(subjectId)) return;
    setProfile("assigned", [...fp.assigned, subjectId]);
  }

  function addMaterial() {
    if (!subjectId) {
      setStatus({ text: "This semester has no subjects yet.", ok: false });
      return;
    }
    if (!title.trim()) {
      setStatus({ text: "Please enter a title.", ok: false });
      return;
    }
    if (!/^https?:\/\//i.test(link.trim())) {
      setStatus({ text: "The link must start with http:// or https://", ok: false });
      return;
    }
    setContent((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: newId(),
          subjectId,
          type,
          category,
          title: title.trim(),
          link: link.trim(),
          status: "pending",
          uploadedBy: fp.name || "Faculty",
          date: new Date().toLocaleDateString("en-IN"),
        },
      ],
    }));
    setTitle("");
    setLink("");
    setStatus({ text: "Uploaded! It will appear for students after the Admin approves it.", ok: true });
  }

  function removeMaterial(index) {
    if (!window.confirm("Delete this upload?")) return;
    setContent((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  }

  function startEdit(index, m) {
    setEditing(index);
    setDraft({ title: m.title, link: m.link, category: m.category || CATEGORIES[m.type][0] });
  }

  function saveEdit(index) {
    if (!draft.title.trim() || !/^https?:\/\//i.test(draft.link.trim())) {
      window.alert("Enter a title and a link starting with http:// or https://");
      return;
    }
    setContent((prev) => ({
      ...prev,
      materials: prev.materials.map((m, i) =>
        i === index
          ? { ...m, title: draft.title.trim(), link: draft.link.trim(), category: draft.category, status: "pending" }
          : m
      ),
    }));
    setEditing(null);
  }

  const picker = (
    <>
      <label className="field">
        <span>Course</span>
        <select value={programId} onChange={(e) => changeProgram(e.target.value)}>
          {programsWithSubjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.full}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Semester</span>
        <select value={semester} onChange={(e) => changeSemester(e.target.value)}>
          {Array.from({ length: program.semesters }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Subject</span>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjectList.length === 0 && <option value="">No subjects yet</option>}
          {subjectList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  return (
    <>
      <PortalHeader title="Faculty Portal" sessionKey="facultyLoggedIn" />

      <main className="section">
        <h2>Welcome{fp.name ? `, ${fp.name}` : ", Faculty"}</h2>

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

        {tab === "profile" && (
          <div className="admin-panel">
            <h3>My Profile</h3>
            <Input label="Full name" value={fp.name} onChange={(v) => setProfile("name", v)} />
            <Input label="Faculty ID" value={fp.staffId} onChange={(v) => setProfile("staffId", v)} />
            <Input label="Department" value={fp.department} onChange={(v) => setProfile("department", v)} />
            <Input label="Designation" value={fp.designation} onChange={(v) => setProfile("designation", v)} />
            <Input label="Phone number" value={fp.phone} onChange={(v) => setProfile("phone", v)} />
            <Input label="Official email" value={fp.email} onChange={(v) => setProfile("email", v)} />
          </div>
        )}

        {tab === "assigned" && (
          <div className="admin-panel">
            <h3>Assigned courses and subjects</h3>
            <p className="hint">
              Choose the subjects you teach. In the final system the Admin
              assigns these.
            </p>
            {picker}
            <button className="btn small" onClick={addAssigned}>
              + Add subject
            </button>
            {fp.assigned.length === 0 ? (
              <p className="empty">No subjects assigned yet.</p>
            ) : (
              <ul className="material-list" style={{ marginTop: 16 }}>
                {fp.assigned.map((id) => {
                  const s = allProgramSubjects.find((x) => x.id === id);
                  return (
                    <li key={id}>
                      <span>
                        <strong>{s ? s.name : id}</strong>
                        <br />
                        {s ? `${s.programName} · Semester ${s.semester}` : ""}
                      </span>
                      <button
                        className="btn small danger"
                        onClick={() => setProfile("assigned", fp.assigned.filter((x) => x !== id))}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === "upload" && (
          <div className="admin-panel">
            <h3>Upload study material</h3>
            <p className="hint">
              Paste a link to your notes, question paper or video (Google Drive
              or YouTube). New uploads need Admin approval before students see
              them.
            </p>
            {picker}
            <label className="field">
              <span>Type</span>
              <select value={type} onChange={(e) => changeType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES[type].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Title" value={title} onChange={setTitle} />
            <Input label="Link (https://...)" value={link} onChange={setLink} />
            {status && <p className={status.ok ? "success" : "error"}>{status.text}</p>}
            <button className="btn small" onClick={addMaterial}>
              + Upload
            </button>
          </div>
        )}

        {tab === "uploads" &&
          (allMaterials.length === 0 ? (
            <p className="empty">You have not uploaded anything yet.</p>
          ) : (
            <ul className="material-list">
              {allMaterials.map((m, index) => {
                const s = allProgramSubjects.find((x) => x.id === m.subjectId);
                const st = m.status || "approved";
                return (
                  <li key={index} style={{ display: "block" }}>
                    <div className="material-row">
                      <span>
                        <strong>{m.title}</strong>{" "}
                        <span className={`status ${st}`}>{STATUS_LABEL[st]}</span>
                        <br />
                        {s ? `${s.programName} · Sem ${s.semester} · ${s.name}` : "Unknown subject"}
                        <br />
                        {TYPE_LABELS[m.type] || m.type}
                        {m.category ? ` · ${m.category}` : ""}
                        {m.date ? ` · ${m.date}` : ""}
                      </span>
                      <span>
                        <button className="btn small" onClick={() => startEdit(index, m)}>
                          Edit
                        </button>{" "}
                        <button className="btn small danger" onClick={() => removeMaterial(index)}>
                          Delete
                        </button>
                      </span>
                    </div>
                    {editing === index && (
                      <div className="list-item" style={{ marginTop: 12 }}>
                        <Input label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                        <Input label="Link" value={draft.link} onChange={(v) => setDraft({ ...draft, link: v })} />
                        <label className="field">
                          <span>Category</span>
                          <select
                            value={draft.category}
                            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                          >
                            {CATEGORIES[m.type].map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p className="hint">Saving an edit sends it for approval again.</p>
                        <button className="btn small" onClick={() => saveEdit(index)}>
                          Save
                        </button>{" "}
                        <button className="btn small danger" onClick={() => setEditing(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}

        {tab === "announcements" &&
          (announcements.length === 0 ? (
            <p className="empty">No announcements right now.</p>
          ) : (
            <ul className="announce-list">
              {announcements.map((a, i) => (
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
          ))}
      </main>

      <Footer />
    </>
  );
}