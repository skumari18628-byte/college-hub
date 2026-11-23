import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite } from "../SiteContext";

export default function Login() {
  const { portals } = useSite();
  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Login Access</h1>
      </section>
      <section className="section">
        <div className="grid">
          {portals.map((p) => (
            <div key={p.name} className="card">
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              {p.path ? (
                <Link className="btn small" to={p.path}>
                  Login
                </Link>
              ) : (
                <button className="btn small" disabled>
                  Coming soon
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}