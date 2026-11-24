import { useState } from "react";
import { useSite } from "../SiteContext";
import { programs, allProgramSubjects } from "../subjectsData";
import { newId } from "../utils";
import { Field } from "./AdminFields";
import ImageField from "./ImageField";

function SubjectPicker({ onAdd }) {
  const [pid, setPid] = useState("");
  const [sem, setSem] = useState(1);
  const [sid, setSid] = useState("");
  const program = programs.find((p) => p.id === pid) || programs[0];
  if (!program) return <p className="hint">Add a course first.</p>;
  const list = program.subjects[sem] || [];
  const chosen = list.some((s) => s.id === sid) ? sid : list[0] ? list[0].id : "";

  return (
    <div className="picker">
      <select
        value={program.id}
        onChange={(e) => {
          setPid(e.target.value);
          setSem(1);
          setSid("");
        }}
      >
        {programs.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        value={sem}
        onChange={(e) => {
          setSem(Number(e.target.value));
          setSid("");
        }}
      >
        {Array.from({ length: program.semesters }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            Semester {n}
          </option>
        ))}
      </select>
      <select value={chosen} onChange={(e) => setSid(e.target.value)}>
        {list.length === 0 && <option value="">No subjects</option>}
        {list.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <button className="btn small" disabled={!chosen} onClick={() => onAdd(chosen)}>
        + Assign subject
      </button>
    </div>
  );
}

export default function FacultyManager() {
  const { faculty, setContent } = useSite();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");

  const setList = (updater) =>
    setContent((prev) => ({ ...prev, faculty: updater(prev.faculty) }));
  const update = (id, patch) =>
    setList((list) => list.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const add = () =>
    setList((list) => [
      {
        id: newId(),
        name: "",
        facultyId: "",
        department: "",
        designation: "",
        phone: "",
        email: "",
        status: "Active",
        courses: [],
        subjects: [],
        photo: "",
      },
      ...list,
    ]);
  const remove = (id) => {
    if (window.confirm("Delete this faculty member?")) {
      setList((list) => list.filter((f) => f.id !== id));
    }
  };
  const toggleCourse = (f, cid) =>
    update(f.id, {
      courses: f.courses.includes(cid)
        ? f.courses.filter((x) => x !== cid)
        : [...f.courses, cid],
    });

  const active = faculty.filter((f) => f.status !== "Inactive").length;
  const text = q.trim().toLowerCase();

  return (
    <div>
      <p className="hint">
        Only the Admin can add faculty. {faculty.length} in total, {active} active.
        Active faculty appear on the pages of the courses they are assigned to.
        Login accounts and passwords will come from the backend.
      </p>

      <button className="btn small" onClick={add}>
        + Add faculty
      </button>

      <div className="grid" style={{ marginTop: 16 }}>
        <label className="field">
          <span>Search by name or ID</span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={st} onChange={(e) => setSt(e.target.value)}>
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
      </div>

      {faculty.length === 0 && <p className="hint">No faculty added yet.</p>}

      {faculty.map((f) => {
        const status = f.status || "Active";
        if (st !== "all" && status !== st) return null;
        if (text && !(f.name + " " + f.facultyId).toLowerCase().includes(text)) return null;
        const duplicate =
          f.facultyId && faculty.some((x) => x.id !== f.id && x.facultyId === f.facultyId);
        return (
          <div key={f.id} className="list-item">
            <p>
              <strong>{f.name || "New faculty member"}</strong>{" "}
              <span className={status === "Active" ? "status approved" : "status rejected"}>
                {status}
              </span>
            </p>
            <Field label="Full name" value={f.name} onChange={(v) => update(f.id, { name: v })} />
            <Field label="Faculty ID" value={f.facultyId} onChange={(v) => update(f.id, { facultyId: v })} />
            {duplicate && <p className="error">This Faculty ID is already used.</p>}
            <Field label="Department" value={f.department} onChange={(v) => update(f.id, { department: v })} />
            <Field label="Designation" value={f.designation} onChange={(v) => update(f.id, { designation: v })} />
            <Field label="Phone number" value={f.phone} onChange={(v) => update(f.id, { phone: v })} />
            <Field label="Official email" value={f.email} onChange={(v) => update(f.id, { email: v })} />
            <ImageField
              label="Photo (optional)"
              value={f.photo}
              maxWidth={400}
              onChange={(v) => update(f.id, { photo: v })}
            />

            <p>
              <strong>Assigned courses</strong>
            </p>
            {programs.map((p) => (
              <label key={p.id} className="check">
                <input
                  type="checkbox"
                  checked={f.courses.includes(p.id)}
                  onChange={() => toggleCourse(f, p.id)}
                />
                {p.name}
              </label>
            ))}

            <p>
              <strong>Assigned subjects</strong>
            </p>
            <SubjectPicker
              onAdd={(sid) =>
                f.subjects.includes(sid) || update(f.id, { subjects: [...f.subjects, sid] })
              }
            />
            {f.subjects.length > 0 && (
              <ul className="material-list">
                {f.subjects.map((sid) => {
                  const s = allProgramSubjects.find((x) => x.id === sid);
                  return (
                    <li key={sid}>
                      <span>
                        {s ? `${s.programName} · Sem ${s.semester} · ${s.name}` : "Removed subject"}
                      </span>
                      <button
                        className="btn small danger"
                        onClick={() => update(f.id, { subjects: f.subjects.filter((x) => x !== sid) })}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              className="btn small"
              onClick={() => update(f.id, { status: status === "Active" ? "Inactive" : "Active" })}
            >
              {status === "Active" ? "Deactivate account" : "Activate account"}
            </button>{" "}
            <button className="btn small danger" onClick={() => remove(f.id)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}