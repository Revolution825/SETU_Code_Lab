import { useLocation } from "react-router-dom";
import { useAuth } from "../authContext";
import LecturerSideBar from "../lecturerSideBar.component";
import NavBar from "../navBar.component";
import "./viewResults.scss";
import "./viewResult.scss";
import { useEffect, useState } from "react";
import type { Submission } from "../types/Submission";
import type { User } from "../types/user";
import type { Problem } from "../types/problem";
import { formatTime } from "../solveProblem/submissionAlert.component";
import type { TestCaseResult } from "../types/TestCaseResult";
import type { TestCase } from "../types/TestCase";
import toast from "react-hot-toast";
import CodeEditor from "../solveProblem/codeEditor.component";

export default function ViewResult() {
    const { user } = useAuth();
    const location = useLocation();
    const data = location.state;
    const submission: Submission = data.submission;
    const student: User = data.student;
    const problem: Problem = data.problem;
    const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const submittedAt = new Date(submission.submitted_at);
    const submittedAtFormatted = new Intl.DateTimeFormat("en-IE", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(submittedAt);

    useEffect(() => {
        async function fetchData() {
            const testCaseResults = await fetch('/api/testCaseResults?submission_id=' + submission.submission_id, {
                method: "GET",
                credentials: "include",
            });
            if (testCaseResults.ok) {
                setTestCaseResults(await testCaseResults.json());
            } else {
                const errorData = await testCaseResults.json();
                toast.error("Error fetching test case results");
                console.error("Error fetching test case results: ", errorData.message);
            }

            const res = await fetch('api/testCases?problem_id=' + problem.problem_id, {
                method: "GET",
                credentials: "include"
            });
            console.log("res", res);
            if (res.ok) {
                setTestCases(await res.json());
            } else {
                const errorData = await res.json();
                toast.error("Error fetching test cases");
                console.error("Error fetching test cases: ", errorData.message);
            }
        }
        fetchData();
    }, []);

    const totalPointsAwarded = submission.points_awarded;
    const speedBonus = submission.time_taken < 1800 ? 100 : submission.time_taken < 3600 ? 50 : submission.time_taken < 5400 ? 25 : 0;
    const basePointsAwarded = totalPointsAwarded - speedBonus;

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="resultScreenBody">
                <div className="resultBody" style={user?.role === "lecturer" ? { marginLeft: "212px" } : { marginLeft: "24px" }}>
                    <div className="resultHeader">
                        <p>{student.user_name} - {problem.problem_title}</p>
                    </div>
                    <div className="resultsContent">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Submitted: </td>
                                    <td><p className="resultData">{submittedAtFormatted}</p></td>
                                    <td>Points Awarded: </td>
                                    <td><p className="resultData">{basePointsAwarded}</p></td>
                                </tr>
                                <tr>
                                    <td>Overall Status: </td>
                                    <td>{submission.overall_status ? <p className="resultData" style={{ color: "green" }}>Pass</p> : <p className="resultData" style={{ color: "red" }}>Fail</p>}</td>
                                    <td>Speed Bonus: </td>
                                    <td><p className="resultData">{speedBonus}</p></td>
                                </tr>
                                <tr>
                                    <td>Time Taken: </td>
                                    <td><p className="resultData">{formatTime(submission.time_taken)}</p></td>
                                    <td>Total Points: </td>
                                    <td><p className="resultData">{totalPointsAwarded}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Submitted Code: </p></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="submittedCode">
                            <CodeEditor
                                value={submission.submitted_code.toString()}
                                onChange={() => null}
                            />
                        </div>
                    </div>
                </div>
                <div className="resultBody">
                    <div className="resultHeader">
                        <p>Test Case Results</p>
                    </div>
                    <div className="resultsContent">
                        <p style={{ fontSize: "18px" }}>{testCaseResults.filter(tcr => tcr.passed).length}/{testCaseResults.length} Test cases passed</p>
                        <div className="testCaseResultTable">
                            {
                                testCaseResults.map((testCaseResult, index) => {
                                    return (
                                        <div className="testCaseResult" key={index}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="resultHeading">
                                                            Input:
                                                        </td>
                                                        <td>
                                                            <p className="resultData">{JSON.stringify(testCases[index]?.input_value)}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="resultHeading">
                                                            Expected Output:
                                                        </td>
                                                        <td>
                                                            <p className="resultData">{JSON.stringify(testCases[index]?.expected_value)}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="resultHeading">
                                                            Actual Output:
                                                        </td>
                                                        <td>
                                                            <p className="resultData">{testCaseResult.actual_output}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="resultHeading">
                                                            Result:
                                                        </td>
                                                        <td>
                                                            {testCaseResult.passed ? <p className="resultData" style={{ color: "green" }}>Pass</p> : <p className="resultData" style={{ color: "red" }}>Fail</p>}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="resultHeading">
                                                            Runtime:
                                                        </td>
                                                        <td>
                                                            <p className="resultData">{testCaseResult.runtime_ms}ms</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}