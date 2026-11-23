import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSite, slugify } from "../SiteContext";

export default function CustomPage() {
  const { slug } = useParams();
  const { customPages } = useSite();
  const page = customPages.find((p) => slugify(p.title) === slug);

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>{page ? page.title : "Page not found"}</h1>
      </section>
      <section className="section">
        <div className="about-text">
          {page ? (
            page.body
              .split("\n")
              .filter((line) => line.trim())
              .map((line, i) => <p key={i}>{line}</p>)
          ) : (
            <p>Sorry, this page does not exist.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}