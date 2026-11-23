import { useState } from "react";
import { useSite } from "../SiteContext";
import { FONTS, resizeImage } from "../utils";

function Text({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

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

  async function pickImage(key, file, maxWidth, type) {
    if (!file) return;
    try {
      set(key, await resizeImage(file, maxWidth, 0.75, type));
      setMsg(null);
    } catch (e) {
      setMsg({ text: e.message, ok: false });
    }
  }

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
        Publish at the bottom.
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
      <Text label="Website title" value={d.siteTitle} onChange={(v) => set("siteTitle", v)} />
      <Text label="Logo text (shown when there is no logo image)" value={d.logoText} onChange={(v) => set("logoText", v)} />
      <label className="field">
        <span>Logo image (optional, a PNG works best)</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => pickImage("logoImage", e.target.files[0], 400, "image/png")}
        />
      </label>
      {d.logoImage && (
        <>
          <img className="thumb" src={d.logoImage} alt="Logo preview" />
          <button className="btn small danger" onClick={() => set("logoImage", "")}>
            Remove logo image
          </button>
        </>
      )}
      <Text
        label="Footer text (leave empty for the default)"
        value={d.footerText}
        onChange={(v) => set("footerText", v)}
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

      <h3>Home page picture</h3>
      <p className="hint">
        The big picture at the top of the Home page. A wide photo works best.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => pickImage("heroImage", e.target.files[0], 1600, "image/jpeg")}
      />
      {d.heroImage && (
        <>
          <img className="thumb" src={d.heroImage} alt="Home picture preview" style={{ marginTop: 10 }} />
          <button className="btn small danger" onClick={() => set("heroImage", "")}>
            Remove picture (use the default)
          </button>
        </>
      )}

      <h3>Navigation tabs</h3>
      <p className="hint">
        Rename, hide, reorder, add or remove tabs. The Login button always stays
        at the end. To add a brand-new page with its own text, use "Add a new
        page / tab" in the dropdown instead.
      </p>
      {nav.map((t, i) => (
        <div key={i} className="list-item nav-row">
          <Text label="Tab name" value={t.label} onChange={(v) => updateTab(i, { label: v })} />
          <Text label="Opens (path, e.g. /about)" value={t.to} onChange={(v) => updateTab(i, { to: v })} />
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