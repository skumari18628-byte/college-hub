import { Link } from "react-router-dom";
import { programs } from "../subjectsData";

function Block({ title, note, list, className, basePath }) {
  return (
    <div className={`level-block ${className}`}>
      <h2>{title}</h2>
      <p className="level-note">{note}</p>
      <div className="grid">
        {list.map((p) => (
          <Link key={p.id} className="card" to={`${basePath}/${p.id}`}>
            <h3>{p.name}</h3>
            <p>{p.full}</p>
            <p>{p.semesters} semesters →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LevelBlocks({ basePath }) {
  const ug = programs.filter((p) => p.level === "UG");
  const pg = programs.filter((p) => p.level === "PG");
  return (
    <>
      <Block
        title="Undergraduate (UG) Courses"
        note="Bachelor's degree programmes"
        list={ug}
        className="ug"
        basePath={basePath}
      />
      <Block
        title="Postgraduate (PG) Courses"
        note="Master's degree programmes"
        list={pg}
        className="pg"
        basePath={basePath}
      />
    </>
  );
}