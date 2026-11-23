import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import CourseSemesters from "./pages/CourseSemesters";
import SubjectMaterials from "./pages/SubjectMaterials";
import CourseMaterial from "./pages/CourseMaterial";
import FeeStructure from "./pages/FeeStructure";
import Placements from "./pages/Placements";
import Announcements from "./pages/Announcements";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import SubjectPage from "./pages/SubjectPage";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomPage from "./pages/CustomPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/academics" element={<Academics />} />
      <Route path="/academics/:courseId" element={<CourseSemesters base="academics" showInfo={true} />} />
      <Route path="/academics/:courseId/:subjectId" element={<SubjectMaterials base="academics" />} />

      <Route path="/course-material" element={<CourseMaterial />} />
      <Route path="/course-material/:courseId" element={<CourseSemesters base="course-material" showInfo={false} />} />
      <Route path="/course-material/:courseId/:subjectId" element={<SubjectMaterials base="course-material" />} />

      <Route path="/fee-structure" element={<FeeStructure />} />
      <Route path="/fee-structure/:courseId" element={<FeeStructure />} />
      <Route path="/placements" element={<Placements />} />

      <Route path="/announcements" element={<Announcements />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/student/subject/:subjectId" element={<SubjectPage />} />
      <Route path="/faculty-login" element={<FacultyLogin />} />
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/page/:slug" element={<CustomPage />} />
    </Routes>
  );
}