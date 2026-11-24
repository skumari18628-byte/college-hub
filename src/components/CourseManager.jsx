import { useState } from "react";
import { useSite } from "../SiteContext";
import { newId } from "../utils";
import { Field } from "./AdminFields";
import ImageField from "./ImageField";

export default function CourseManager() {
  const { curriculum, setContent } = useSite();
  const [selId, setSelId] = useState("");
  const [sem, setSem] = useState(1);

  const course = curriculum.find((c) => c.id === selId) || curriculum[0];

  const setCurriculum = (updater) =>
    setContent((prev) => ({ ...prev, curriculum: updater(prev.curriculum) }));
  const update = (id, patch) =>
    setCurriculum((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  function addCourse() {
    const id = `c${Date.now().toString(36)}`;
    setCurriculum((list) => [
      ...list,
      {
        id,
        name: "New course",
        full: "New course",
        level: "UG",
        semesters: 6,
        duration: "3 years (6 semesters)",
        eligibility: "",
        description: "",
        careers: [],
        image: "",
        subjects: {},
      },
    ]);
    setSelId(id);
    setSem(1);
  }

  function removeCourse() {
    if (
      window.confirm(
        `Delete ${course.name}? Its subjects will disappear from the website. Materials and fees already added for it will no longer be shown.`
      )
    ) {
      setCurriculum((list) => list.filter((c) => c.id !== course.id));
      setSelId("");
    }
  }

  if (!course) {
    return (
      <div>
        <p className="hint">There are no courses yet.</p>
        <button className="btn small" onClick={addCourse}>
          + Add a course
        </button>
      </div>
    );
  }

  const semNow = Math.min(sem, course.semesters);
  const subjects = course.subjects[semNow] || [];
  const setSubjects = (list) =>
    update(course.id, { subjects: { ...course.subjects, [semNow]: list } });

  return (
    <div>
      <p className="hint">
        Choose a course to edit its details, number of semesters and subjects.
        Changes appear on the whole website straight away.
      </p>

      <label className="field" style={{ maxWidth: 420 }}>
        <span>Course</span>
        <select value={course.id} onChange={(e) => { setSelId(e.target.value); setSem(1); }}>
          {curriculum.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.level})
            </option>
          ))}
        </select>
      </label>
      <button className="btn small" onClick={addCourse}>
        + Add a course
      </button>

      <h3>Course details</h3>
      <Field label="Short name (e.g. BCA)" value={course.name} onChange={(v) => update(course.id, { name: v })} />
      <Field label="Full name" value={course.full} onChange={(v) => update(course.id, { full: v })} />
      <label className="field">
        <span>Level</span>
        <select value={course.level} onChange={(e) => update(course.id, { level: e.target.value })}>
          <option value="UG">Undergraduate (UG)</option>
          <option value="PG">Postgraduate (PG)</option>
        </select>
      </label>
      <label className="field">
        <span>Number of semesters</span>
        <select
          value={course.semesters}
          onChange={(e) => update(course.id, { semesters: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <Field label="Duration" value={course.duration} onChange={(v) => update(course.id, { duration: v })} />
      <Field label="Eligibility" long value={course.eligibility} onChange={(v) => update(course.id, { eligibility: v })} />
      <Field label="Description" long value={course.description} onChange={(v) => update(course.id, { description: v })} />
      <label className="field">
        <span>Career opportunities (one per line)</span>
        <textarea
          rows="5"
          value={(course.careers || []).join("\n")}
          onChange={(e) => update(course.id, { careers: e.target.value.split("\n") })}
        />
      </label>
      <ImageField
        label="Course banner picture (optional)"
        value={course.image}
        maxWidth={1000}
        onChange={(v) => update(course.id, { image: v })}
      />

      <h3>Subjects</h3>
      <label className="field" style={{ maxWidth: 300 }}>
        <span>Semester</span>
        <select value={semNow} onChange={(e) => setSem(Number(e.target.value))}>
          {Array.from({ length: course.semesters }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>
      </label>

      {subjects.length === 0 && <p className="hint">No subjects in this semester yet.</p>}
      {subjects.map((s, i) => (
        <div key={s.id} className="list-item">
          <Field
            label={`Subject ${i + 1}`}
            value={s.name}
            onChange={(v) => setSubjects(subjects.map((x) => (x.id === s.id ? { ...x, name: v } : x)))}
          />
          <button
            className="btn small danger"
            onClick={() => {
              if (window.confirm("Remove this subject?")) {
                setSubjects(subjects.filter((x) => x.id !== s.id));
              }
            }}
          >
            Remove subject
          </button>
        </div>
      ))}
      <button
        className="btn small"
        onClick={() => setSubjects([...subjects, { id: `${course.id}-${newId()}`, name: "" }])}
      >
        + Add a subject
      </button>

      <p style={{ marginTop: 24 }}>
        <button className="btn small danger" onClick={removeCourse}>
          Delete this course
        </button>
      </p>
    </div>
  );
}