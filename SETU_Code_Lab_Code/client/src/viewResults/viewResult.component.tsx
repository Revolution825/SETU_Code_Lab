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
import { api, getParamNames, jsonToParamValues } from "../sharedUtils";
import FadeLoader from "react-spinners/FadeLoader";
import type { ProblemLanguage } from "../types/ProblemLanguage";

export default function ViewResult() {
  const { user } = useAuth();
  const location = useLocation();
  const data = location.state;
  const submission: Submission = data.submission;
  const student: User = data.student;
  const problem: Problem = data.problem;
  const [dataLoading, setDataLoading] = useState(true);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [problemLanguages, setProblemLanguages] = useState<ProblemLanguage[]>(
    [],
  );
  const submittedAt = new Date(submission.submitted_at);
  const submittedAtFormatted = new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(submittedAt);

  useEffect(() => {
    async function fetchData() {
      const [tcResultsRes, tcRes, langRes] = await Promise.all([
        api.get(
          "/api/testCaseResults?submission_id=" + submission.submission_id,
        ),
        api.get("api/testCases?problem_id=" + problem.problem_id),
        api.get("api/problemLanguages?problem_id=" + problem.problem_id),
      ]);

      if (tcResultsRes.ok) {
        setTestCaseResults(await tcResultsRes.json());
      } else {
        const errorData = await tcResultsRes.json();
        toast.error("Error fetching test case results");
        console.error("Error fetching test case results: ", errorData.message);
      }

      if (tcRes.ok) {
        setTestCases(await tcRes.json());
      } else {
        const errorData = await tcRes.json();
        toast.error("Error fetching test cases");
        console.error("Error fetching test cases: ", errorData.message);
      }

      if (langRes.ok) {
        const languages: ProblemLanguage[] = await langRes.json();
        setProblemLanguages(languages);
      } else {
        const errorData = await langRes.json();
        toast.error("Error fetching languages");
        console.error("Error fetching languages: ", errorData.message);
      }

      setDataLoading(false);
    }
    fetchData();
  }, []);

  const totalPointsAwarded = submission.points_awarded;
  const speedBonus =
    submission.time_taken < 1800
      ? 100
      : submission.time_taken < 3600
        ? 50
        : submission.time_taken < 5400
          ? 25
          : 0;
  const basePointsAwarded = totalPointsAwarded - speedBonus;

  const primaryEntry =
    problemLanguages.find((e) => e.language === "java") ?? problemLanguages[0];
  const paramNames = primaryEntry ? getParamNames(primaryEntry) : [];

  return (
    <div>
      <NavBar />
      {user?.role == "lecturer" ? (
        <div className="sideBar">
          <LecturerSideBar />
        </div>
      ) : null}
      <div className="resultScreenBody">
        <div
          className="resultBody"
          style={
            user?.role === "lecturer"
              ? { marginLeft: "212px" }
              : { marginLeft: "24px" }
          }
        >
          <div className="resultHeader">
            <p>
              {student.user_name} - {problem.problem_title}
            </p>
          </div>
          <div className="resultsContent">
            <table>
              <tbody>
                <tr>
                  <td>Submitted: </td>
                  <td>
                    <p className="resultData">{submittedAtFormatted}</p>
                  </td>
                  <td>Points Awarded: </td>
                  <td>
                    <p className="resultData">{basePointsAwarded}</p>
                  </td>
                </tr>
                <tr>
                  <td>Overall Status: </td>
                  <td>
                    {submission.overall_status ? (
                      <p className="resultData" style={{ color: "green" }}>
                        Pass
                      </p>
                    ) : (
                      <p className="resultData" style={{ color: "red" }}>
                        Fail
                      </p>
                    )}
                  </td>
                  <td>Speed Bonus: </td>
                  <td>
                    <p className="resultData">{speedBonus}</p>
                  </td>
                </tr>
                <tr>
                  <td>Time Taken: </td>
                  <td>
                    <p className="resultData">
                      {formatTime(submission.time_taken)}
                    </p>
                  </td>
                  <td>Total Points: </td>
                  <td>
                    <p className="resultData">{totalPointsAwarded}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Submitted Code: </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="submittedCode">
              <CodeEditor
                language={submission.language}
                value={submission.submitted_code.toString()}
                onChange={() => null}
                editable={false}
              />
            </div>
          </div>
        </div>
        <div className="resultBody">
          <div className="resultHeader">
            <p>Test Case Results</p>
          </div>
          <div className="resultContent">
            <p style={{ fontSize: "18px" }}>
              {testCaseResults.filter((tcr) => tcr.passed).length}/
              {testCaseResults.length} Test cases passed
            </p>
            <div className="testCaseResultTable">
              {testCaseResults.map((testCaseResult, index) => {
                return (
                  <div className="testCaseResult" key={index}>
                    <table>
                      <tbody>
                        <tr>
                          <td className="resultHeading">Input:</td>
                          <td>
                            <p className="resultData">
                              {jsonToParamValues(
                                JSON.stringify(testCases[index]?.input_value),
                                paramNames,
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="resultHeading">Expected Output:</td>
                          <td>
                            <p className="resultData">
                              {JSON.stringify(testCases[index]?.expected_value)}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="resultHeading">Actual Output:</td>
                          <td>
                            <p className="resultData">
                              {testCaseResult.actual_output}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="resultHeading">Result:</td>
                          <td>
                            {testCaseResult.passed ? (
                              <p
                                className="resultData"
                                style={{ color: "green" }}
                              >
                                Pass
                              </p>
                            ) : (
                              <p
                                className="resultData"
                                style={{ color: "red" }}
                              >
                                Fail
                              </p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="resultHeading">Runtime:</td>
                          <td>
                            <p className="resultData">
                              {testCaseResult.runtime_ms}ms
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {dataLoading && (
        <div className="spinner">
          <FadeLoader color="#dedede" />
          <p style={{ margin: 24 }}>Hang tight, Loading Result...</p>
        </div>
      )}
    </div>
  );
}
