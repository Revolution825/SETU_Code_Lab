import { useEffect, useState } from "react";
import "./viewProblems.scss";
import "./manageProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar.component";
import LecturerSideBar from "./lecturerSideBar.component";
import { useAuth } from "../authContext";
import type { Problem } from "../types/problem";

export default function ManageProblems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const { user } = useAuth();

    function problemClick(problem: Problem) {
        navigate("/createProblem", { state: problem });
    }

    function createProblemClick() {
        navigate("/createProblem");
    }

    useEffect(() => {
        async function fetchProblems() {
            const res = await fetch('/api/myProblems', {
                method: "GET",
                credentials: "include"
            });
            if (res.ok) {
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
            <NavBar />
            {user?.role == "lecturer" ? <LecturerSideBar /> : null}
            <div className="manageProblemsBody">
                <div className="manageProblems">
                    <ul>
                        {Array.isArray(problems)
                            ? problems.map((p) =>
                                <li className="manageProblemsRow" key={p.problem_id}>
                                    <button
                                        className="problem"
                                        key={p.problem_id}
                                        onClick={() => problemClick(p)}>
                                        {problems.indexOf(p) + 1}. {p.problem_title}
                                        <span className="problemListItem">| {p.user_name}</span>
                                        <span className="stars">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <img
                                                    key={i}
                                                    className="star"
                                                    src={i < p.difficulty ? "/filledStar.svg" : "/emptyStar.svg"}
                                                    alt="star" />
                                            ))}
                                        </span>
                                    </button>
                                    <button className="manageProblemButton">
                                        <img className="manageIcons" src="editIcon.svg" alt="edit" />
                                    </button>
                                    <button className="manageProblemButton">
                                        <img className="manageIcons" src="binIcon.svg" alt="delete" />
                                    </button>
                                </li>)
                            : <li>No problems found</li>}
                    </ul>
                </div>
                <div>
                    <button onClick={createProblemClick} className="createNew">
                        <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Create New Problem
                    </button>
                </div>
            </div>
        </div>
    );
}