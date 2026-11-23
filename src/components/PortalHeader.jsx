import { Link, useNavigate } from "react-router-dom";

export default function PortalHeader({ title, sessionKey }) {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem(sessionKey);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark">CH</span>
        <span>{title}</span>
      </div>
      <nav className="nav-links">
        <Link to="/">Website</Link>
        <button className="link-btn" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}