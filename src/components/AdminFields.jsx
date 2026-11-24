import ImageField from "./ImageField";

export function Field({ label, value, onChange, long }) {
  return (
    <label className="field">
      <span>{label}</span>
      {long ? (
        <textarea rows="5" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function ListEditor({ items, fields, onChange, addLabel }) {
  function update(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    const blank = {};
    fields.forEach((f) => (blank[f.key] = ""));
    onChange([...items, blank]);
  }

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="list-item">
          {fields.map((f) =>
            f.image ? (
              <ImageField
                key={f.key}
                label={f.label}
                value={item[f.key] || ""}
                maxWidth={600}
                onChange={(v) => update(i, f.key, v)}
              />
            ) : (
              <Field
                key={f.key}
                label={f.label}
                long={f.long}
                value={item[f.key]}
                onChange={(v) => update(i, f.key, v)}
              />
            )
          )}
          <button className="btn small danger" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn small" onClick={add}>
        + {addLabel}
      </button>
    </div>
  );
}