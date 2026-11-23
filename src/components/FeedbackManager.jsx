import { useState } from "react";
import { useSite } from "../SiteContext";
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from "../utils";

export default function FeedbackManager() {
  const { feedback, setContent } = useSite();
  const [cat, setCat] = useState("all");
  const [st, setSt] = useState("all");

  const statusOf = (f) => f.status || "New";
  const catOf = (f) => f.category || "General suggestion";

  const update = (i, patch) =>
    setContent((prev) => ({
      ...prev,
      feedback: prev.feedback.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    }));

  const remove = (i) => {
    if (window.confirm("Delete this feedback?")) {
      setContent((prev) => ({
        ...prev,
        feedback: prev.feedback.filter((_, idx) => idx !== i),
      }));
    }
  };

  const countNew = feedback.filter((f) => statusOf(f) === "New").length;

  return (
    <div>
      <p className="hint">
        {feedback.length} in total · {countNew} new. Write a reply and set the
        status to track each item.
      </p>

      <label className="field" style={{ maxWidth: 360 }}>
        <span>Category</span>
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {FEEDBACK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="field" style={{ maxWidth: 360 }}>
        <span>Status</span>
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="all">All</option>
          {FEEDBACK_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {feedback.length === 0 && <p className="hint">No feedback yet.</p>}

      {feedback.map((f, i) => {
        if (cat !== "all" && catOf(f) !== cat) return null;
        if (st !== "all" && statusOf(f) !== st) return null;
        return (
          <div key={f.id || i} className="list-item">
            <p>
              <span className="tag">{catOf(f)}</span>
            </p>
            <p>
              <strong>{f.name || "Anonymous"}</strong> ({f.role}) · {f.date}
            </p>
            <p>
              Rating: {"★".repeat(f.rating)}
              {"☆".repeat(5 - f.rating)}
            </p>
            <p>{f.message}</p>

            <label className="field">
              <span>Status</span>
              <select value={statusOf(f)} onChange={(e) => update(i, { status: e.target.value })}>
                {FEEDBACK_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Your reply (the sender can see it on the Feedback page)</span>
              <textarea
                rows="3"
                value={f.reply || ""}
                onChange={(e) => update(i, { reply: e.target.value })}
              />
            </label>
            <button className="btn small danger" onClick={() => remove(i)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
