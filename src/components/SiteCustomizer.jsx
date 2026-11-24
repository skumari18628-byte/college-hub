import { useState } from "react";
import { useSite } from "../SiteContext";
import { FONTS, newId } from "../utils";
import ImageField from "./ImageField";
import { Field } from "./AdminFields";

function Color({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="color-input"
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function SiteCustomizer() {
  const { site, siteDraft: d, college, setContent, publishSite, discardDraft } = useSite();
  const [msg, setMsg] = useState(null);

  const set = (key, value) =>
    setContent((prev) => ({
      ...prev,
      siteDraft: { ...prev.siteDraft, [key]: value },
    }));
  const changed = JSON.stringify(site) !== JSON.stringify(d);

  const nav = d.nav;
  const setNav = (items) => set("nav", items);
  const updateTab = (i, patch) =>
    setNav(nav.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const moveTab = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= nav.length) return;
    const copy = [...nav];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setNav(copy);
  };
  const removeTab = (i) => {
    if (window.confirm("Remove this tab from the navigation bar?")) {
      setNav(nav.filter((_, idx) => idx !== i));
    }
  };

  const secs = d.homeSections;
  const setSecs = (items) => set("homeSections", items);
  const updateSec = (i, patch) =>
    setSecs(secs.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const moveSec = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= secs.length) return;
    const copy = [...secs];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setSecs(copy);
  };
  const removeSec = (i) => {
    if (window.confirm("Remove this section from the Home page?")) {
      setSecs(secs.filter((_, idx) => idx !== i));
    }
  };
  const addSec = () =>
    setSecs([
      ...secs,
      {
        id: `custom-${newId()}`,
        custom: true,
        label: "New section",
        title: "New section",
        body: "",
        image: "",
        visible: true,
      },
    ]);

  function publish() {
    const bad = d.nav.find((n) => !n.label.trim() || !n.to.startsWith("/"));
    if (bad) {
      setMsg({ text: "Every tab needs a name and a path that starts with /", ok: false });
      return;
    }
    publishSite();
    setMsg({ text: "Published! The website now shows these changes.", ok: true });
  }

  function discard() {
    if (window.confirm("Discard all unpublished changes?")) {
      discardDraft();
      setMsg(null);
    }
  }

  const previewStyle = {
    "--maroon": d.maroon,
    "--charcoal": d.charcoal,
    "--cream": d.cream,
    "--gold": d.gold,
    "--hero-image": d.heroImage ? `url("${d.heroImage}")` : 'url("/college.jpg")',
    fontFamily: (FONTS[d.font] || FONTS.elegant).css,
  };

  return (
    <div>
      <p className="hint">
        Your edits are kept as a draft. Visitors only see them after you click
        Publish at the bottom. Pictures are stored in this browser, so keep them
        small.
      </p>

      <h3>Preview</h3>
      <div
        className={d.buttonStyle === "square" ? "preview-box btn-square" : "preview-box"}
        style={previewStyle}
      >
        <div className="navbar">
          <div className="brand">
            {d.logoImage ? (
              <img className="brand-img" src={d.logoImage} alt="Logo" />
            ) : (
              <span className="brand-mark">{d.logoText}</span>
            )}
            <span>{d.siteTitle}</span>
          </div>
          <div className="nav-links">
            {d.nav
              .filter((t) => !t.hidden)
              .slice(0, 5)
              .map((t, i) => (
                <a key={i}>{t.label}</a>
              ))}
          </div>
        </div>
        <div className="hero-photo">
          <h1>{college.name}</h1>
          <p className="tagline">{college.tagline}</p>
          <span className="btn">Login to your portal</span>
        </div>
        <div className="preview-body">
          <div className="card">
            <h3>Sample card</h3>
            <p>This is how cards and buttons will look.</p>
            <span className="btn small">Button</span>
          </div>
        </div>
        <div className="footer preview-footer">
          {d.footerText || `© 2026 ${college.name} · ${college.tagline}`}
        </div>
      </div>

      <h3>Identity</h3>
      <Field label="Website title" value={d.siteTitle} onChange={(v) => set("siteTitle", v)} />
      <Field label="Logo text (shown when there is no logo image)" value={d.logoText} onChange={(v) => set("logoText", v)} />
      <ImageField
        label="Logo image (optional, a PNG works best)"
        value={d.logoImage}
        onChange={(v) => set("logoImage", v)}
        maxWidth={400}
        type="image/png"
      />
      <Field
        label="Footer text (leave empty for the default)"
        value={d.footerText}
        onChange={(v) => set("footerText", v)}
      />

      <h3>College picture (top of the Home page)</h3>
      <ImageField
        label="A wide photo of the college works best"
        value={d.heroImage}
        onChange={(v) => set("heroImage", v)}
        maxWidth={1600}
      />

      <h3>Colours</h3>
      <div className="color-row">
        <Color label="Primary (dark maroon)" value={d.maroon} onChange={(v) => set("maroon", v)} />
        <Color label="Dark background" value={d.charcoal} onChange={(v) => set("charcoal", v)} />
        <Color label="Light / text" value={d.cream} onChange={(v) => set("cream", v)} />
        <Color label="Accent (gold)" value={d.gold} onChange={(v) => set("gold", v)} />
      </div>

      <h3>Font and buttons</h3>
      <label className="field">
        <span>Font</span>
        <select value={d.font} onChange={(e) => set("font", e.target.value)}>
          {Object.entries(FONTS).map(([key, f]) => (
            <option key={key} value={key}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Button style</span>
        <select value={d.buttonStyle} onChange={(e) => set("buttonStyle", e.target.value)}>
          <option value="rounded">Rounded</option>
          <option value="square">Square</option>
        </select>
      </label>

      <h3>Home page sections</h3>
      <p className="hint">
        Show, hide and reorder the sections of the Home page, or add your own
        section with a title, text and picture.
      </p>
      {secs.map((s, i) => (
        <div key={s.id} className="list-item nav-row">
          {s.custom ? (
            <>
              <Field label="Section title" value={s.title} onChange={(v) => updateSec(i, { title: v, label: v })} />
              <Field label="Text" long value={s.body} onChange={(v) => updateSec(i, { body: v })} />
              <ImageField label="Picture (optional)" value={s.image} maxWidth={900} onChange={(v) => updateSec(i, { image: v })} />
            </>
          ) : (
            <p>
              <strong>{s.label}</strong>
            </p>
          )}
          <label className="check">
            <input
              type="checkbox"
              checked={s.visible}
              onChange={(e) => updateSec(i, { visible: e.target.checked })}
            />
            Show this section
          </label>
          <div>
            <button className="btn small" onClick={() => moveSec(i, -1)}>↑ Up</button>{" "}
            <button className="btn small" onClick={() => moveSec(i, 1)}>↓ Down</button>
            {s.custom && (
              <>
                {" "}
                <button className="btn small danger" onClick={() => removeSec(i)}>Remove</button>
              </>
            )}
          </div>
        </div>
      ))}
      <button className="btn small" onClick={addSec}>
        + Add a section
      </button>

      <h3>Navigation tabs</h3>
      <p className="hint">
        Rename, hide, reorder, add or remove tabs. The Login button always stays
        at the end. To add a brand-new page with its own text, use "Add a new
        page / tab" in the dropdown instead.
      </p>
      {nav.map((t, i) => (
        <div key={i} className="list-item nav-row">
          <Field label="Tab name" value={t.label} onChange={(v) => updateTab(i, { label: v })} />
          <Field label="Opens (path, e.g. /about)" value={t.to} onChange={(v) => updateTab(i, { to: v })} />
          <label className="check">
            <input
              type="checkbox"
              checked={!t.hidden}
              onChange={(e) => updateTab(i, { hidden: !e.target.checked })}
            />
            Show this tab
          </label>
          <div>
            <button className="btn small" onClick={() => moveTab(i, -1)}>↑ Up</button>{" "}
            <button className="btn small" onClick={() => moveTab(i, 1)}>↓ Down</button>{" "}
            <button className="btn small danger" onClick={() => removeTab(i)}>Remove</button>
          </div>
        </div>
      ))}
      <button
        className="btn small"
        onClick={() => setNav([...nav, { label: "New tab", to: "/", hidden: false }])}
      >
        + Add a tab
      </button>

      <div className="sticky-bar">
        <button className="btn small" onClick={publish} disabled={!changed}>
          Publish changes
        </button>
        <button className="btn small danger" onClick={discard} disabled={!changed}>
          Discard draft
        </button>
        <span className={changed ? "status pending" : "status approved"}>
          {changed ? "Unpublished changes" : "Everything is published"}
        </span>
        {msg && <span className={msg.ok ? "success" : "error"}>{msg.text}</span>}
      </div>
    </div>
  );
}