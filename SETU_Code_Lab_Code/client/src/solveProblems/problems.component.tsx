import { useEffect, useState } from "react";
import "./viewProblems.scss";
import { useNavigate } from "react-router-dom";
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
      <div className="navBar">
        <img className="logo" src="/logo.svg" alt="Logo" />
        <h3>
          SETU Code Lab
        </h3>
        <button className="profileButton">
          <img src="/profileIcon.svg" alt="profileIcon" />
        </button>
      </div>
      <div className="problems">
        <ul>
          {Array.isArray(problems)
            ? problems.map((p) => <button className="problem" key={p.problem_id}>
            {p.problem_id}. {p.problem_title} 
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
        <button onClick={handleClick}>
          Log out
        </button>
      </div>
    </div>
  );
}