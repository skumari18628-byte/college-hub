import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { newId } from "../utils";

const isSafe = (url) => /^https?:\/\//i.test(url || "");
const isMap = (url) => /^https:\/\/www\.google\.com\/maps\/embed/i.test(url || "");

export default function Contact() {
  const { college, setContent } = useSite();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  const set = (key, value) => setForm({ ...form, [key]: value });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setStatus({ text: "Please enter your name and message.", ok: false });
      return;
    }
    if (!form.email.includes("@")) {
      setStatus({ text: "Please enter a valid email address.", ok: false });
      return;
    }
    setContent((prev) => ({
      ...prev,
      messages: [
        { id: newId(), ...form, date: new Date().toLocaleString("en-IN") },
        ...prev.messages,
      ],
    }));
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setStatus({ text: "Thank you! Your message has been sent.", ok: true });
  }

  const departments = (college.departments || []).filter((d) => d.name);
  const socials = (college.socials || []).filter((s) => s.name && isSafe(s.url));

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Contact Us</h1>
      </section>

      <section className="section">
        <div className="grid">
          <div className="card">
            <h3>Address</h3>
            <p>{college.address}</p>
          </div>
          <div className="card">
            <h3>Phone</h3>
            <p>{college.phone}</p>
          </div>
          <div className="card">
            <h3>Email</h3>
            <p>{college.email}</p>
          </div>
          <div className="card">
            <h3>Office Timings</h3>
            <p>{college.officeTimings}</p>
          </div>
        </div>
      </section>

      {departments.length > 0 && (
        <section className="section dark">
          <h2>Department Contacts</h2>
          <div className="grid">
            {departments.map((d, i) => (
              <div key={i} className="card">
                <h3>{d.name}</h3>
                {d.phone && <p>📞 {d.phone}</p>}
                {d.email && <p>✉️ {d.email}</p>}
                {!d.phone && !d.email && <p>Please contact the main office.</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {isMap(college.mapUrl) && (
        <section className="section">
          <h2>Find Us</h2>
          <iframe
            className="map-frame"
            src={college.mapUrl}
            title="College map"
            loading="lazy"
          />
        </section>
      )}

      {socials.length > 0 && (
        <section className="section">
          <h2>Follow Us</h2>
          <div className="chip-row">
            {socials.map((s, i) => (
              <a key={i} className="chip" href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section dark">
        <h2>Send Us a Message</h2>
        <form className="admin-panel contact-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Your name</span>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="text" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </label>
          <label className="field">
            <span>Phone (optional)</span>
            <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </label>
          <label className="field">
            <span>Subject</span>
            <input type="text" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea rows="5" value={form.message} onChange={(e) => set("message", e.target.value)} />
          </label>
          {status && <p className={status.ok ? "success" : "error"}>{status.text}</p>}
          <button className="btn" type="submit">
            Send Message
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}