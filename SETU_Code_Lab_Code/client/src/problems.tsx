import { useEffect, useState } from "react";

function Problems() {

    const [problems, setProblems] = useState<any[]>([]);
    
    useEffect(() => {
    async function fetchProblems() {
        const res = await fetch('/api/problems');
        setProblems(await res.json());
    }
    fetchProblems();
}, []);



console.log("problems : ", problems);

  return (
    <div>
      <h1>Problems Page</h1>
      <ul>
  {Array.isArray(problems)
    ? problems.map((p) => <li key={p.problem_id}>
        {p.problem_title}
            <p>
                {p.problem_description}
            </p>
        </li>)
    : <li>No problems found</li>}
      </ul>
    </div>
  );
}
export default Problems;