import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LevelBlocks from "../components/LevelBlocks";
import { useSite } from "../SiteContext";
import { programs } from "../subjectsData";

const num = (v) => Number(v) || 0;
const rupee = (n) => `₹ ${num(n).toLocaleString("en-IN")}`;
const total = (f) =>
  num(f.tuition) + num(f.admission) + num(f.exam) + num(f.lab) + num(f.other);

export default function FeeStructure() {
  const { courseId } = useParams();
  const { fees } = useSite();
  const [year, setYear] = useState("");

  if (!courseId) {
    return (
      <>
        <Navbar />
        <section className="page-banner">
          <h1>Fee Structure</h1>
          <p className="banner-sub">Choose a course to see its fees for each semester</p>
        </section>
        <section className="section">
          <LevelBlocks basePath="/fee-structure" />
        </section>
        <Footer />
      </>
    );
  }

  const program = programs.find((p) => p.id === courseId);
  if (!program) {
    return (
      <>
        <Navbar />
        <section className="section">
          <h2>Course not found</h2>
          <Link className="back-link-inline" to="/fee-structure">
            ← Back
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const published = fees.filter((f) => f.courseId === courseId && f.published);
  const years = [...new Set(published.map((f) => f.academicYear))].sort().reverse();
  const activeYear = years.includes(year) ? year : years[0];
  const rows = published
    .filter((f) => f.academicYear === activeYear)
    .sort((a, b) => num(a.semester) - num(b.semester));

  const optional = (v) => (num(v) > 0 ? rupee(v) : "Not applicable");

  return (
    <>
      <Navbar />
      <section className="page-banner">
        <h1>{program.name} Fee Structure</h1>
        <p className="banner-sub">{program.full}</p>
      </section>

      <section className="section">
        <Link className="back-link-inline" to="/fee-structure">
          ← All courses
        </Link>

        {rows.length === 0 ? (
          <p className="empty">
            The fee structure for this course will be published soon. Please
            contact the college office for details.
          </p>
        ) : (
          <>
            <label className="field" style={{ maxWidth: 300 }}>
              <span>Academic year</span>
              <select value={activeYear} onChange={(e) => setYear(e.target.value)}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid">
              {rows.map((f, i) => (
                <div key={i} className="card">
                  <h3>Semester {f.semester}</h3>
                  <table className="fee-table">
                    <tbody>
                      <tr><td>Tuition fee</td><td>{rupee(f.tuition)}</td></tr>
                      <tr><td>Admission fee</td><td>{optional(f.admission)}</td></tr>
                      <tr><td>Examination fee</td><td>{rupee(f.exam)}</td></tr>
                      <tr><td>Laboratory fee</td><td>{optional(f.lab)}</td></tr>
                      <tr><td>Other charges</td><td>{optional(f.other)}</td></tr>
                      <tr className="total"><td>Total semester fee</td><td>{rupee(total(f))}</td></tr>
                      <tr><td>Academic year</td><td>{f.academicYear}</td></tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <p className="fee-note">
              Fees are as published by the college office. Please confirm with
              the office before making any payment.
            </p>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}