import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (user.trim() === "admin" && password === "admin123") {
      sessionStorage.setItem("adminLoggedIn", "yes");
      navigate("/admin-dashboard");
    } else {
      setError("Wrong username or password.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <p className="auth-sub">Demo login: admin / admin123</p>

        <label>Username</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
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