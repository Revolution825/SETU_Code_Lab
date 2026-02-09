import { useEffect, useState } from "react";
import "./viewProblems.scss";
import "./manageProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar.component";
import LecturerSideBar from "./lecturerSideBar.component";
import { useAuth } from "../authContext";
import type { Problem } from "../types/problem";
import toast from "react-hot-toast";

export default function ManageProblems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const { user } = useAuth();

    function problemClick(problem: Problem) {
        navigate("/problem", { state: problem })
    }

    function editProblemClick(problem: Problem) {
        navigate("/createProblem", { state: problem });
    }

    function createProblemClick() {
        navigate("/createProblem");
    }

    const deleteProblemClick = async (problem_id: number) => {
        let userConfirmed = confirm("Are you sure you want to delete this problem and all of it's associated test cases?");
        if (userConfirmed) {
            try {
                const res = await fetch('/api/deleteProblem', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        problem_id: problem_id
                    })
                });
                if (!res.ok) {
                    toast.error("Failed to delete problem. Please try again.");
                    throw new Error("Failed to delete problem");
                }
                toast.success("Problem deleted successfully");
                navigate("/manageProblems");
                setProblems(prev =>
                    prev.filter(p => p.problem_id !== problem_id)
                );
            } catch (error: any) {
                toast.error("Failed to delete problem. Please try again.");
                console.error("Error updating problem :", error.message);
            }
        }
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

    return (
        <div className="main">
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="manageProblemsBody">
                <div>
                    <button onClick={createProblemClick} className="createNew">
                        <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Create New Problem
                    </button>
                </div>
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
                                    <button onClick={() => editProblemClick(p)} className="manageProblemButton">
                                        <img className="manageIcons" src="editIcon.svg" alt="edit" />
                                    </button>
                                    <button onClick={() => deleteProblemClick(p.problem_id)} className="manageProblemButton">
                                        <img className="manageIcons" src="binIcon.svg" alt="delete" />
                                    </button>
                                </li>)
                            : <li>No problems found</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}