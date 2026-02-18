import { useLocation } from "react-router-dom";
import { useAuth } from "../authContext";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
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

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="resultScreenBody">
                <div className="resultBody" style={{ marginLeft: 212 }}>
                    <div className="resultHeader">
                        <p>{student.user_name} - {problem.problem_title}</p>
                    </div>
                    <div className="resultsContent">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Submitted: </td>
                                    <td><p>{submittedAtFormatted}</p></td>
                                </tr>
                                <tr>
                                    <td>Overall Status: </td>
                                    <td>{submission.overall_status ? <p style={{ color: "green" }}>Pass</p> : <p style={{ color: "red" }}>Fail</p>}</td>
                                </tr>
                                <tr>
                                    <td>Time Taken: </td>
                                    <td><p>{formatTime(submission.time_taken)}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Submitted Code: </p></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <textarea
                                className="submittedCode"
                                value={submission.submitted_code.toString()}
                                onChange={() => null}
                                spellCheck={false}
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
                        {
                            testCaseResults.map((testCaseResult, index) => {
                                return (
                                    <div className="testCaseResult" key={index}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        Input:
                                                    </td>
                                                    <td>
                                                        <p className="resultData">{JSON.stringify(testCases[index]?.input_value)}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Expected Output:
                                                    </td>
                                                    <td>
                                                        <p className="resultData">{JSON.stringify(testCases[index]?.expected_value)}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Actual Output:
                                                    </td>
                                                    <td>
                                                        <p className="resultData">{testCaseResult.actual_output}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Result:
                                                    </td>
                                                    <td>
                                                        {testCaseResult.passed ? <p className="resultData" style={{ color: "green" }}>Pass</p> : <p className="resultData" style={{ color: "red" }}>Fail</p>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
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
    );
}