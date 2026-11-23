import { useSite } from "../SiteContext";

function show(v) {
  if (Array.isArray(v)) {
    return v.map((x) => x.label + (x.hidden ? " (hidden)" : "")).join(", ");
  }
  if (v === "" || v == null) return "(empty)";
  return String(v);
}

export default function ChangeHistory() {
  const { siteHistory, restoreVersion } = useSite();

  function restore(id) {
    if (window.confirm("Restore the earlier values from this change? This will be recorded as a new change.")) {
      restoreVersion(id);
    }
  }

  return (
    <div>
      <p className="hint">
        Every time website customization is published, the old and new values
        are recorded here. Restoring brings back the earlier text, colours,
        fonts and tabs. Images are not restored, so upload them again if needed.
      </p>

      {siteHistory.length === 0 && <p className="hint">No changes have been published yet.</p>}

      {siteHistory.map((e) => (
        <div key={e.id} className="list-item">
          <p>
            <strong>{e.date}</strong> · by {e.admin}{" "}
            <span className={e.status === "Published" ? "status approved" : "status pending"}>
              {e.status}
            </span>
          </p>
          {e.changes.map((c, i) => (
            <p key={i} className="change-line">
              <strong>{c.label}:</strong> {show(c.from)} → {show(c.to)}
            </p>
          ))}
          <button className="btn small" onClick={() => restore(e.id)}>
            Restore the previous values
          </button>
        </div>
      ))}
    </div>
  );
}