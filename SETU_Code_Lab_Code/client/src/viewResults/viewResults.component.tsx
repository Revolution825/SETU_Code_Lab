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

    const problemAverages = problems.map(problem => {
        let total = 0;
        let count = 0;

        students.forEach(student => {
            const sub = submissionMap.get(
                `${student.user_id}-${problem.problem_id}`
            );

            if (sub?.percentage !== undefined && sub.percentage !== null) {
                total += sub.percentage;
                count++;
            }
        });

        return count > 0 ? Math.round(total / count) : null;
    });

    const overallAverage = problemAverages.filter(a => a !== null).length > 0
        ? Math.round(
            problemAverages
                .filter(a => a !== null)
                .reduce((a, b) => a + (b as number), 0) /
            problemAverages.filter(a => a !== null).length
        )
        : null;

    function downloadCSV() {
        const headers = [
            "Student",
            ...problems.map(problem => problem.problem_title),
            "Total"
        ];
        const rows: string[][] = [];
        students.forEach(student => {
            let total = 0;
            let count = 0;

            const row: string[] = [];
            row.push(student.user_name);
            problems.forEach(problem => {
                const sub = submissionMap.get(`${student.user_id}-${problem.problem_id}`);

                const percentage = sub?.percentage ?? null;

                if (percentage !== null) {
                    total += percentage;
                    count++;
                    row.push(`${percentage}`);
                } else {
                    row.push("");
                }
            })
            const avg = count > 0 ? Math.round(total / count) : "";
            row.push(String(avg));
            rows.push(row);
        })
        const avgRow: string[] = ["Average"];
        problems.forEach(problem => {
            let total = 0;
            let count = 0;

            students.forEach(student => {
                const sub = submissionMap.get(
                    `${student.user_id}-${problem.problem_id}`
                );
                if (sub?.percentage !== null && sub?.percentage !== undefined) {
                    total += sub.percentage;
                    count++;
                }
            });
            avgRow.push(count > 0 ? String(Math.round(total / count)) : "");
        });
        avgRow.push(overallAverage !== null ? String(overallAverage) : "");
        rows.push(avgRow);

        const csvData = [headers, ...rows].map(
            row => row.map(
                value => `"${String(value).replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n");

        const blob = new Blob(["\uFEFF", csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${course.course_title}_results.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="resultsBody">
                <div className="resultsHeader">
                    <p>{course.course_title} - Results</p>
                </div>
                <div className="resultsContent">
                    <div className="tableWrapper">
                        <table className="resultsTable">
                            <thead>
                                <tr>
                                    <th className="firstResultTableHeading">Student</th>
                                    {problems.map((p) => (
                                        <th className="resultColumn" key={p.problem_id}>{p.problem_title}</th>
                                    ))}
                                    <th className="lastResultTableHeading stickyRight">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => {
                                    let total = 0;
                                    let count = 0;

                                    return (
                                        <tr className="resultsRow" key={student.user_id}>
                                            <td className="resultColumn">{index + 1}. {student.user_name}</td>
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
                                                        className="resultColumn"
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
                                            <td className="totalResultColumn stickyRight" style={{
                                                fontWeight: "bold",
                                                color:
                                                    count > 0 ?
                                                        Math.round(total / count) === null
                                                            ? "grey"
                                                            : Math.round(total / count) >= 80
                                                                ? "green"
                                                                : Math.round(total / count) >= 50
                                                                    ? "orange"
                                                                    : "red"
                                                        : "grey"
                                            }}>
                                                {count > 0 ? `${Math.round(total / count)}%` : "-"}
                                            </td>
                                        </tr>
                                    );
                                }
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td style={{ fontWeight: "bold", paddingLeft: 12 }}>
                                        Average
                                    </td>
                                    {problemAverages.map((avg, index) => (
                                        <td
                                            key={index}
                                            className="resultColumn"
                                            style={{
                                                fontWeight: "bold",
                                                color:
                                                    avg === null
                                                        ? "grey"
                                                        : avg >= 80
                                                            ? "green"
                                                            : avg >= 50
                                                                ? "orange"
                                                                : "red",
                                            }}
                                        >
                                            {avg !== null ? `${avg}%` : "-"}
                                        </td>
                                    ))}
                                    <td className="totalResultColumn stickyRight" style={{
                                        fontWeight: "bold", color:
                                            overallAverage === null
                                                ? "grey"
                                                : overallAverage >= 80
                                                    ? "green"
                                                    : overallAverage >= 50
                                                        ? "orange"
                                                        : "red"
                                    }}>
                                        {overallAverage !== null ? `${overallAverage}%` : "-"}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <button onClick={downloadCSV} className="downloadButton">Download Results.csv</button>
                </div>
            </div>
        </div>
    );
}