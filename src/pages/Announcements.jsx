import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { ANNOUNCEMENT_CATEGORIES } from "../utils";

const URGENT = "Urgent Announcements";

export default function Announcements() {
  const { announcements } = useSite();
  const [cat, setCat] = useState("All");

  const list = announcements
    .filter((a) => cat === "All" || (a.category || "General Notices") === cat)
    .sort((a, b) => (b.category === URGENT) - (a.category === URGENT));

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Announcements</h1>
        <p className="banner-sub">Notices, events and important updates</p>
      </section>

      <section className="section">
        <div className="tabs">
          {["All", ...ANNOUNCEMENT_CATEGORIES].map((c) => (
            <button
              key={c}
              className={c === cat ? "tab active" : "tab"}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="empty">No announcements in this category right now.</p>
        ) : (
          <div className="announce-stack">
            {list.map((a, i) => (
              <div
                key={i}
                className={a.category === URGENT ? "card urgent" : "card"}
              >
                <span className="tag">{a.category || "General Notices"}</span>
                <h3>{a.title}</h3>
                <p className="date-line">{a.date}</p>
                {a.details && <p>{a.details}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}