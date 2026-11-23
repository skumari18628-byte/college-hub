import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LevelBlocks from "../components/LevelBlocks";

export default function Academics() {
  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Academics</h1>
        <p className="banner-sub">Choose a course to see its details, semesters and subjects</p>
      </section>
      <section className="section">
        <LevelBlocks basePath="/academics" />
      </section>
      <Footer />
    </>
  );
}