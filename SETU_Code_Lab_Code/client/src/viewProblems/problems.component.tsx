import { useEffect, useState } from "react";
import "./viewProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar.component";
export interface Problem {
  problem_id: number;
  user_id: number;
  problem_title: string;
  problem_description: string;
  user_name: string;
  difficulty: number;
}

export default function Problems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    
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
      <NavBar/>
      <div className="problems">
        <ul>
          {Array.isArray(problems)
            ? problems.map((p) => <button className="problem" key={p.problem_id}>
            {problems.indexOf(p)+1}. {p.problem_title} 
            <span className="problemListItem">| {p.user_name}</span>
            <span className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                className="star"
                src={i < p.difficulty ? "/filledStar.svg" : "/emptyStar.svg"}
                alt="star"
              />
            ))}
            </span>
          </button>)
          : <li>No problems found</li>}
        </ul>
      </div>
    </div>
  );
}