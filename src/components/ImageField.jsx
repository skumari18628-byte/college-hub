import { useState } from "react";
import { resizeImage } from "../utils";

export default function ImageField({ label, value, onChange, maxWidth = 800, type = "image/jpeg" }) {
  const [err, setErr] = useState("");

  async function pick(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      onChange(await resizeImage(file, maxWidth, 0.7, type));
      setErr("");
    } catch (x) {
      setErr(x.message);
    }
    e.target.value = "";
  }

  return (
    <div className="field image-field">
      <span>{label}</span>
      {value && <img className="thumb" src={value} alt="" />}
      <input type="file" accept="image/*" onChange={pick} />
      {value && (
        <button type="button" className="btn small danger" onClick={() => onChange("")}>
          Remove picture
        </button>
      )}
      {err && <span className="error">{err}</span>}
    </div>
  );
}