import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      setError("Please enter your Student ID and password.");
      return;
    }
          sessionStorage.setItem("studentLoggedIn", "yes");
    navigate("/student-dashboard");
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <p className="auth-sub">Government Arts College · College Hub</p>

        <label>Student ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter your Student ID"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit">
          Login
        </button>
        <Link className="back-link" to="/">
          ← Back to Home
        </Link>
      </form>
    </div>
  );
}