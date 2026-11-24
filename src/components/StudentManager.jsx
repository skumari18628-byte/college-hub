import { useState } from "react";
import { useSite } from "../SiteContext";
import { programs } from "../subjectsData";
import { newId } from "../utils";
import { Field } from "./AdminFields";

export default function StudentManager() {
  const { students, setContent } = useSite();
  const [q, setQ] = useState("");
  const [course, setCourse] = useState("all");
  const [st, setSt] = useState("all");

  const setList = (updater) =>
    setContent((prev) => ({ ...prev, students: updater(prev.students) }));
  const update = (id, patch) =>
    setList((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const add = () =>
    setList((list) => [
      {
        id: newId(),
        name: "",
        regNo: "",
        course: programs[0] ? programs[0].id : "",
        semester: "1",
        email: "",
        phone: "",
        status: "Active",
      },
      ...list,
    ]);
  const remove = (id) => {
    if (window.confirm("Delete this student?")) {
      setList((list) => list.filter((s) => s.id !== id));
    }
  };

  const active = students.filter((s) => s.status !== "Inactive").length;
  const text = q.trim().toLowerCase();

  return (
    <div>
      <p className="hint">
        {students.length} students in total, {active} active. Login accounts,
        passwords and verification will come from the backend.
      </p>

      <button className="btn small" onClick={add}>
        + Add student
      </button>

      <div className="grid" style={{ marginTop: 16 }}>
        <label className="field">
          <span>Search by name or registration number</span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="field">
          <span>Course</span>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="all">All courses</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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

      {students.length === 0 && <p className="hint">No students added yet.</p>}

      {students.map((s) => {
        const status = s.status || "Active";
        if (course !== "all" && s.course !== course) return null;
        if (st !== "all" && status !== st) return null;
        if (text && !(s.name + " " + s.regNo).toLowerCase().includes(text)) return null;
        const program = programs.find((p) => p.id === s.course);
        const duplicate =
          s.regNo && students.some((x) => x.id !== s.id && x.regNo === s.regNo);
        return (
          <div key={s.id} className="list-item">
            <p>
              <strong>{s.name || "New student"}</strong>{" "}
              <span className={status === "Active" ? "status approved" : "status rejected"}>
                {status}
              </span>
            </p>
            <Field label="Full name" value={s.name} onChange={(v) => update(s.id, { name: v })} />
            <Field label="Registration number" value={s.regNo} onChange={(v) => update(s.id, { regNo: v })} />
            {duplicate && <p className="error">This registration number is already used.</p>}
            <label className="field">
              <span>Course</span>
              <select
                value={s.course}
                onChange={(e) => update(s.id, { course: e.target.value, semester: "1" })}
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.full}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Semester</span>
              <select value={s.semester} onChange={(e) => update(s.id, { semester: e.target.value })}>
                {Array.from({ length: program ? program.semesters : 6 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    Semester {n}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Email" value={s.email} onChange={(v) => update(s.id, { email: v })} />
            <Field label="Phone" value={s.phone} onChange={(v) => update(s.id, { phone: v })} />
            <button
              className="btn small"
              onClick={() => update(s.id, { status: status === "Active" ? "Inactive" : "Active" })}
            >
              {status === "Active" ? "Deactivate" : "Activate"}
            </button>{" "}
            <button className="btn small danger" onClick={() => remove(s.id)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}