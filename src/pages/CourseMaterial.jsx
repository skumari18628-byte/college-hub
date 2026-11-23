import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LevelBlocks from "../components/LevelBlocks";

export default function CourseMaterial() {
  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>Course Material</h1>
        <p className="banner-sub">
          Course → Semester → Subject → Notes, Question Papers and Lecture Videos
        </p>
      </section>
      <section className="section">
        <LevelBlocks basePath="/course-material" />
      </section>
      <Footer />
    </>
  );
}