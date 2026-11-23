import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";
import { FEEDBACK_CATEGORIES, newId } from "../utils";

export default function Feedback() {
  const { feedback, setContent } = useSite();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student");
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES[0]);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      setStatus({ text: "Please write your feedback.", ok: false });
      return;
    }
    setContent((prev) => ({
      ...prev,
      feedback: [
        {
          id: newId(),
          mine: true,
          name: name.trim(),
          role,
          category,
          rating: Number(rating),
          message: message.trim(),
          date: new Date().toLocaleDateString("en-IN"),
          status: "New",
          reply: "",
        },
        ...prev.feedback,
      ],
    }));
    setName("");
    setMessage("");
    setRating(5);
    setStatus({ text: "Thank you! Your feedback has been sent.", ok: true });
  }

  const mine = feedback.filter((f) => f.mine);

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Feedback</h1>
        <p className="banner-sub">We would love to hear from you</p>
      </section>

      <section className="section">
        <form className="admin-panel" onSubmit={handleSubmit}>
          <label className="field">
            <span>What is your feedback about?</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {FEEDBACK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Your name (optional)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label className="field">
            <span>You are a</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Student</option>
              <option>Parent</option>
              <option>Faculty</option>
              <option>Visitor</option>
            </select>
          </label>

          <label className="field">
            <span>Rating</span>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>

          <label className="field">
            <span>Your feedback</span>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your feedback here"
            />
          </label>

          {status && <p className={status.ok ? "success" : "error"}>{status.text}</p>}

          <button className="btn" type="submit">
            Send Feedback
          </button>
        </form>
      </section>

      {mine.length > 0 && (
        <section className="section dark">
          <h2>Your Feedback</h2>
          <div className="grid">
            {mine.map((f) => (
              <div key={f.id} className="card">
                <span className="tag">{f.category}</span>{" "}
                <span className={f.status === "Resolved" ? "status approved" : "status pending"}>
                  {f.status}
                </span>
                <p className="date-line">{f.date}</p>
                <p>{f.message}</p>
                {f.reply && (
                  <p>
                    <strong>Reply from the college:</strong> {f.reply}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}