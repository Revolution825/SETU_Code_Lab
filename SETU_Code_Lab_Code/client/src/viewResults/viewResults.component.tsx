import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
import type { Course } from "../types/course";
import "./viewResults.scss";
import { useEffect, useState } from "react";
import type { Problem } from "../types/problem";
import type { User } from "../types/user";
import type { Submission } from "../types/Submission";

export default function ViewResults() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const course: Course = location.state;
    const [problems, setProblems] = useState<Problem[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const submissionMap = new Map<string, Submission>();
    submissions.forEach(submission => {
        submissionMap.set(`${submission.user_id}-${submission.problem_id}`, submission);
    });

    useEffect(() => {
        async function fetchData() {
            const problems = await fetch('/api/problems', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedCourse: course.course_id })
            });
            const problemsData = problems.ok ? await problems.json() : [];
            setProblems(problemsData);
            const students = await fetch('/api/studentsOnCourse', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course_id: course.course_id })
            });
            const studentData = students.ok ? await students.json() : [];
            setStudents(studentData);
            const submissionsRes = await fetch('/api/submissionsForCourse', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ student_ids: studentData.map((s: User) => s.user_id), problem_ids: problemsData.map((p: Problem) => p.problem_id), created_at: course.created_at })
            });
            const submissionsData = submissionsRes.ok ? await submissionsRes.json() : [];
            setSubmissions(submissionsData);

        }
        fetchData();
    }, [course.course_id]);

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="resultsBody">
                <div className="resultsHeader">
                    <p>{course.course_title} - Results</p>
                </div>
                <div className="resultsContent">
                    <table className="resultsTable">
                        <thead>
                            <tr>
                                <th>Student</th>
                                {problems.map((p) => (
                                    <th key={p.problem_id}>{p.problem_title}</th>
                                ))}
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => {
                                let total = 0;
                                let count = 0;

                                return (
                                    <tr key={student.user_id}>
                                        <td>{index + 1}. {student.user_name}</td>
                                        {problems.map(problem => {
                                            const sub = submissionMap.get(
                                                `${student.user_id}-${problem.problem_id}`
                                            );

                                            const percentage = sub?.percentage ?? null;

                                            if (percentage !== null) {
                                                total += percentage;
                                                count++;
                                            }

                                            return (
                                                <td
                                                    key={problem.problem_id}
                                                    style={{
                                                        color:
                                                            percentage === null
                                                                ? "grey"
                                                                : percentage >= 80
                                                                    ? "green"
                                                                    : percentage >= 50
                                                                        ? "orange"
                                                                        : "red",
                                                    }}
                                                >
                                                    {percentage !== null ? `${percentage}%` : "-"}
                                                </td>
                                            );
                                        })}
                                        <td style={{ fontWeight: "bold", color: "green" }}>
                                            {count > 0 ? `${Math.round(total / count)}%` : "-"}
                                        </td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                    <button className="downloadButton">Download Results.csv</button>
                </div>
            </div>
        </div>
    );
}