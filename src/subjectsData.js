const slug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const sem = (n, names, prefix = "") =>
  names.map((name) => ({
    id: prefix ? `${prefix}-${slug(name)}-s${n}` : `${slug(name)}-s${n}`,
    name,
  }));

// What each material type can contain (from the blueprint)
export const CATEGORIES = {
  Notes: ["PDF notes", "Unit-wise notes", "PPT", "Assignment", "Practical notes"],
  "Question Papers": ["Previous year paper", "Model paper", "Internal exam paper"],
  Videos: ["Recorded lecture", "Topic-wise video"],
};

export const TYPE_LABELS = {
  Notes: "Notes",
  "Question Papers": "Question Papers",
  Videos: "Lecture Videos",
};

/* ===================== BCA (BCU, SEP 2024-25) ===================== */
export const subjectsBySemester = {
  1: sem(1, [
    "Discrete Structure",
    "Problem Solving Technique",
    "Computer Architecture",
    "Problem Solving Technique Lab",
    "Computer Architecture Lab",
    "Office Automation Tools",
    "Language L1",
    "Language L2",
    "The Constitution of India",
  ]),
  2: sem(2, [
    "Data Structure",
    "Object Oriented Programming using Java",
    "Operating Systems",
    "Data Structure Lab",
    "Object Oriented Programming Lab (Java)",
    "Linux and Shell Programming Lab",
    "Language L1",
    "Language L2",
    "Environmental Studies",
  ]),
  3: sem(3, [
    "Database Management System",
    "Probability and Statistics",
    "Artificial Intelligence",
    "Database Management System Lab",
    "Artificial Intelligence Lab using Python",
    "Elective I: Web Programming - I",
    "Language L1",
    "Language L2",
  ]),
  4: sem(4, [
    "Computer Networks",
    "Design and Analysis of Algorithms",
    "Software Engineering",
    "Computer Networks Lab",
    "Design and Analysis of Algorithms Lab",
    "Elective II: Web Programming - II",
    "Language L1",
    "Language L2",
    "Office Management Tools",
  ]),
  5: sem(5, [
    "Frontend Design",
    "Backend Development",
    "Cloud Computing",
    "Frontend Design Lab",
    "Backend Development Lab",
    "Quantitative Techniques",
  ]),
  6: sem(6, [
    "Software Project Management",
    "Mobile Application Development",
    "Project Work",
    "Soft Skills",
  ]),
};

// BCA only (used by the Student Portal)
export const allSubjects = Object.entries(subjectsBySemester).flatMap(
  ([semester, list]) => list.map((s) => ({ ...s, semester: Number(semester) }))
);

/* ===================== B.Com (Regular) ===================== */
const bcomSubjects = {
  1: sem(1, [
    "Language - I",
    "Language - II (English)",
    "Financial Accounting",
    "Principles of Marketing",
    "Business Environment",
    "Indian Financial System",
    "Constitutional Values - 1",
  ], "bcom"),
  2: sem(2, [
    "Language - I",
    "Language - II (English)",
    "Advanced Financial Accounting",
    "Human Resource Management",
    "Business Regulations",
    "Corporate Administration (option a)",
    "Quantitative Aptitude (option b)",
    "Constitutional Values - 2",
  ], "bcom"),
  3: sem(3, [
    "Language - I",
    "Language - II (English)",
    "Corporate Accounting",
    "Quantitative Analysis for Business Decisions - I",
    "Cost Accounting",
    "Elective I: Consumer Behaviour",
    "Elective I: Human Resource Development",
    "Elective I: Accounting Information System",
    "Entrepreneurship Skills",
  ], "bcom"),
  4: sem(4, [
    "Language - I",
    "Language - II (English)",
    "Advanced Corporate Accounting",
    "Quantitative Analysis for Business Decisions - II",
    "Costing Methods",
    "Elective II: Brand Management",
    "Elective II: Negotiations and Conflict Management",
    "Elective II: Artificial Intelligence in Business",
    "Banking Practice",
  ], "bcom"),
  5: sem(5, [
    "Advanced Accounting",
    "Financial Management",
    "Income Tax - I",
    "Goods and Services Tax",
    "Research Methodology",
    "Survey Project",
  ], "bcom"),
  6: sem(6, [
    "Indian Accounting Standards",
    "Management Accounting",
    "Income Tax - II",
    "International Business Environment",
    "Auditing",
    "Internship",
  ], "bcom"),
};

/* ===================== BBA (Regular) ===================== */
const bbaSubjects = {
  1: sem(1, [
    "Language - I",
    "Language - II (English)",
    "Principles of Management",
    "Market Analysis for Business Decisions",
    "Statistics for Business Decisions - I",
    "Financial Accounting",
    "Constitutional Values - 1",
  ], "bba"),
  2: sem(2, [
    "Language - I",
    "Language - II (English)",
    "Human Resource Management Practices",
    "Indian Financial System",
    "Statistics for Business Decisions - II",
    "Corporate Accounting",
    "Constitutional Values - 2",
  ], "bba"),
  3: sem(3, [
    "Language - I",
    "Language - II (English)",
    "Principles of Marketing",
    "Organizational Behaviour",
    "Entrepreneurship and Start-up Eco System",
    "Fundamentals of Cost Accounting",
    "Business Communication Skills",
  ], "bba"),
  4: sem(4, [
    "Language - I",
    "Language - II (English)",
    "Banking Law and Practice",
    "Business Regulations",
    "Goods and Services Tax",
    "Financial Management",
    "Technology for Business",
  ], "bba"),
  5: sem(5, [
    "Income Tax Law and Practice - I",
    "Management Accounting",
    "Elective: Consumer Behaviour (Marketing)",
    "Elective: Performance and Compensation Management (HR)",
    "Elective: Advanced Financial Management (Finance)",
    "Elective: Business Analytics",
    "Research Methodology",
    "Survey Project",
  ], "bba"),
  6: sem(6, [
    "Income Tax Law and Practice - II",
    "International Business",
    "Strategic Management",
    "Elective: Brand Management (Marketing)",
    "Elective: Organizational Change and Development (HR)",
    "Elective: Security Analysis and Investment Management (Finance)",
    "Elective: Marketing and Financial Analytics",
    "Internship",
  ], "bba"),
};

/* ===================== M.Com ===================== */
const mcomSubjects = {
  1: sem(1, [
    "Global Business Environment",
    "Monetary System",
    "Principles of Business Decision",
    "Technology in Business",
    "Advanced Financial Management and Practices",
    "Knowledge Management and Innovation",
    "Business Models for Startups (Soft Core)",
  ], "mcom"),
  2: sem(2, [
    "Contemporary Indian Banking",
    "Risk Management and Derivatives",
    "Advanced Research Methodology (Practical)",
    "Digital Marketing",
    "Venture Creation and Development",
    "Indian Ethos and Leadership",
    "Financial Modelling for Business (Soft Core)",
  ], "mcom"),
  4: sem(4, [
    "Analytics in Commerce and Business",
    "Forensic Accounting and Auditing",
    "International Accounting",
    "Strategic Cost Management - II",
    "Goods and Services Tax",
    "Strategic Financial Management",
    "Dissertation / Project",
  ], "mcom"),
};

/* ===================== MBA ===================== */
const mbaSubjects = {
  1: sem(1, [
    "Management and Organizational Behaviour",
    "Managerial Accounting",
    "Business Planning and Regulations",
    "Economics for Business Decisions",
    "Business Statistics",
    "Marketing Management",
    "Employability Skill Development - I",
  ], "mba"),
  2: sem(2, [
    "Entrepreneurship and Start-ups Management",
    "Business Research Methods",
    "Managing Human Resources",
    "Business Analytics",
    "Financial Management",
    "Production and Operations Research",
    "Employability Skill Development - II",
  ], "mba"),
  3: sem(3, [
    "Strategic Management and Business Ethics",
    "Finance: Investment Analysis and Portfolio Management",
    "Finance: Corporate Taxation for Managers",
    "Finance: Corporate Valuation and Financial Modelling",
    "Marketing: Rural and Green Marketing",
    "Marketing: Business and Social Marketing",
    "Marketing: Consumer Behaviour and Neuromarketing",
    "HR: Performance Management and Competency Mapping",
    "HR: Talent Management and Employee Engagement",
    "HR: Learning and Development",
    "Entrepreneurship: Ideation, Design Thinking and Innovation",
    "Entrepreneurship: Management of SMEs and Family Business",
    "Entrepreneurship: Corporate Entrepreneurship and New Venture Creation",
    "Operations: Advanced Production System",
    "Operations: Agile and Lean Manufacturing",
    "Operations: Enterprise Resource Planning",
    "Analytics: Business Intelligence",
    "Analytics: Predictive Analytics using R",
    "Analytics: Data Warehousing and Data Mining",
    "Open Elective",
    "Industry Internship Project (4 weeks)",
  ], "mba"),
  4: sem(4, [
    "International Business",
    "Finance: Project Management and Analysis",
    "Finance: International Financial Management",
    "Finance: Derivatives and Risk Management",
    "Marketing: Sales and Distribution Management and Retailing",
    "Marketing: Services Marketing and Customer Relationship Management",
    "Marketing: Integrated Marketing Communication and Digital Marketing",
    "HR: Global HRM",
    "HR: Strategic HRM",
    "HR: Industrial Relations and HR Audit",
    "Entrepreneurship: Technology for New Ventures",
    "Entrepreneurship: Scaling Up and Sustainability of Start-Ups",
    "Entrepreneurship: Entrepreneurial Finance",
    "Operations: Resource Optimization and Project Risk Management",
    "Operations: Supply Chain Management",
    "Operations: Total Quality Management",
    "Analytics: Big Data Analytics",
    "Analytics: Data Visualization and Business Reporting using Tableau",
    "Analytics: Emerging Technologies and Future Skills for Business Leaders",
    "Dissertation / Master Thesis",
  ], "mba"),
};

/* ===================== All programmes ===================== */
export const programs = [
  {
    id: "bcom",
    name: "B.Com",
    full: "Bachelor of Commerce (Regular)",
    level: "UG",
    semesters: 6,
    duration: "3 years (6 semesters)",
    eligibility: "Completed the two-year Pre-University course of Karnataka State (or 10+2 / equivalent).",
    description:
      "A three-year commerce degree that builds strong foundations in accounting, finance, marketing, human resources, taxation and business law. It prepares students for careers in business and finance, for professional courses and for competitive examinations.",
    careers: [
      "Accountant, auditor or tax consultant",
      "Banking, insurance and financial services",
      "Chartered Accountancy (CA), Cost and Management Accountancy (CMA) and Company Secretary (CS)",
      "Marketing and HR roles in the corporate sector",
      "UPSC, KPSC, banking and other competitive exams",
      "Higher studies such as M.Com or MBA, and entrepreneurship",
    ],
    subjects: bcomSubjects,
  },
  {
    id: "bca",
    name: "BCA",
    full: "Bachelor of Computer Applications",
    level: "UG",
    semesters: 6,
    duration: "3 years (6 semesters)",
    eligibility: "Completed 2nd PUC / 10+2 or equivalent (check the college prospectus for subject requirements).",
    description:
      "A three-year programme in computer science and applications covering programming, data structures, databases, networks, software engineering, cloud computing and full-stack development, with lab work in most semesters.",
    careers: [
      "Software and web developer",
      "Full-stack and mobile application developer",
      "Database and cloud support roles",
      "Data and AI related roles",
      "Higher studies such as MCA or M.Sc",
      "IT services, start-ups and entrepreneurship",
    ],
    subjects: subjectsBySemester,
  },
  {
    id: "bba",
    name: "BBA",
    full: "Bachelor of Business Administration (Regular)",
    level: "UG",
    semesters: 6,
    duration: "3 years (6 semesters)",
    eligibility: "Completed the two-year Pre-University course of Karnataka State (or 10+2 / equivalent).",
    description:
      "A three-year management degree covering principles of management, marketing, finance, accounting, statistics, organizational behaviour and entrepreneurship, with electives in marketing, HR, finance and business analytics.",
    careers: [
      "Management trainee and business executive",
      "Marketing, sales and brand roles",
      "HR and finance associate roles",
      "Business analyst and financial analyst",
      "Higher studies such as MBA",
      "Start-ups and family businesses",
    ],
    subjects: bbaSubjects,
  },
  {
    id: "ba",
    name: "BA",
    full: "Bachelor of Arts",
    level: "UG",
    semesters: 6,
    duration: "3 years (6 semesters)",
    eligibility: "Completed the two-year Pre-University course of Karnataka State (or 10+2 / equivalent).",
    description:
      "A three-year arts degree in humanities and social science disciplines such as History, Economics, Political Science, Sociology, English and Kannada.",
    careers: [
      "Civil services and other competitive exams",
      "Teaching and academia",
      "Journalism, media and communication",
      "Public administration and social sector",
      "Higher studies such as MA, B.Ed or law",
    ],
    subjects: {},
  },
  {
    id: "mcom",
    name: "M.Com",
    full: "Master of Commerce",
    level: "PG",
    semesters: 4,
    duration: "2 years (4 semesters)",
    eligibility: "Bachelor's degree in commerce or management (B.Com / BBA) with the minimum aggregate marks set by the university.",
    description:
      "A two-year postgraduate programme that deepens knowledge of finance, banking, accounting, taxation, research methods and business analytics, ending with a dissertation or project.",
    careers: [
      "Senior accounting, finance and banking roles",
      "Financial analyst and tax consultant",
      "Forensic accounting and auditing",
      "Teaching and research (lecturer, NET, Ph.D.)",
      "Entrepreneurship and consultancy",
    ],
    subjects: mcomSubjects,
  },
  {
    id: "mba",
    name: "MBA",
    full: "Master of Business Administration",
    level: "PG",
    semesters: 4,
    duration: "2 years (4 semesters)",
    eligibility: "A bachelor's degree in any discipline with at least 50% aggregate marks (relaxation for reserved categories). Admission is through the entrance test and counselling set by the state.",
    description:
      "A two-year management programme with core subjects in the first two semesters, followed by dual specialisation electives in finance, marketing, human resources, entrepreneurship, operations and business analytics, an industry internship and a master thesis.",
    careers: [
      "Manager in banks, insurance and the IT sector",
      "Roles in finance, HR, marketing and operations",
      "Business analyst and management consultant",
      "Tax consultant, finance manager and fund manager",
      "Entrepreneur and start-up founder",
      "Trainer and academician",
    ],
    subjects: mbaSubjects,
  },
  {
    id: "ma",
    name: "MA",
    full: "Master of Arts",
    level: "PG",
    semesters: 4,
    duration: "2 years (4 semesters)",
    eligibility: "Bachelor's degree in a relevant discipline with the minimum aggregate marks set by the university.",
    description:
      "A two-year postgraduate programme in an arts or humanities discipline, building advanced subject knowledge and research skills.",
    careers: [
      "Teaching and research (lecturer, NET, Ph.D.)",
      "Civil services and public administration",
      "Journalism, media and publishing",
      "Social sector, policy and research organisations",
    ],
    subjects: {},
  },
];

// Every subject of every programme (used by the Faculty Portal)
export const allProgramSubjects = programs.flatMap((p) =>
  Object.entries(p.subjects).flatMap(([semester, list]) =>
    list.map((s) => ({
      ...s,
      semester: Number(semester),
      programId: p.id,
      programName: p.name,
    }))
  )
);