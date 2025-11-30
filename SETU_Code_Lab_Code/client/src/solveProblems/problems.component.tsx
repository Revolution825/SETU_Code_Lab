import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Problems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<any[]>([]);

    const handleClick = () => {
      localStorage.removeItem("token");
      navigate("/");
    }
    
    useEffect(() => {
      const token = localStorage.getItem("token");
      if(!token) {
        navigate("/");
        return;
      }
    
      async function fetchProblems() {
        const res = await fetch('/api/problems', {
          headers: {
          "Authorization": `Bearer ${token}`,
            },
        });
        if(res.ok){
          setProblems(await res.json());
        } else {
          const errorData = await res.json();
          console.error("Error fetching problems:", errorData.message);
        }
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
      <button onClick={handleClick}>
        Log out
      </button>
    </div>
  );
}