import { useLocation, useNavigate } from "react-router-dom";
import type { Problem } from "../viewProblems/problemList.component";
import NavBar from "../viewProblems/navBar.component";
import "./solveProblem.scss";
import "react-resizable/css/styles.css";
import { ResizableBox } from 'react-resizable';
import { useEffect, useState } from "react";
import CodeEditor from "./codeEditor.component";
import Stopwatch from "./stopwatch.component";

export interface TestCase {
  test_case_id: number;
  problem_id: number;
  input_value: any;
  expected_value: any;
  passed: boolean;
}

export interface TestCaseResult {
  test_case_id: number;
  passed: boolean;
  actual_output: string;
  runtime_ms: number;
}

export default function Problem() {
  const navigate = useNavigate();
  const location = useLocation();
  const problem: Problem = location.state;

  const [leftWidth, setLeftWidth] = useState(window.innerWidth * 0.5);
  const topHeight = window.innerHeight - 104;
  const [rightHeight, setRightHeight] = useState(topHeight - 332)
  const HIDE_TEXT_AT = 120;

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
  const [code, setCode] = useState(
    problem.placeholder_code ?? ""
  );
  const image = "java-sandbox";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    async function fetchTestCases() {
      const res = await fetch('api/testCases?problem_id=' + problem.problem_id, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (res.ok) {
        setTestCases(await res.json());
      } else {
        console.log("Data", res.json());
        const errorData = await res.json();
        console.error("Error fetching test cases: ", errorData.message);
      }
    }
    fetchTestCases();
  }, []);

  const handleRun = async () => {
    for (const testCase of testCases) {
      await runTestCase(testCase);
    }
  };

  async function runTestCase(testCase: TestCase) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('docker/start', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          image: image,
          code: code,
          testCase: testCase
        })
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("non-json response: ", text);
        throw new Error("Server returned invalid JSON");
      }
      if (res.ok) {
        const testCaseResult: TestCaseResult = data.output;
        setTestCaseResults(prev => {
          const exists = prev.some(tc => tc.test_case_id === testCase.test_case_id);

          if (exists) {
            return prev.map(tc =>
              tc.test_case_id === testCase.test_case_id
                ? { ...tc, ...testCaseResult }
                : tc
            );
          } else {
            return [...prev, testCaseResult];
          }
        });
      } else {
        console.log("Data", data);
        console.error("Error running code: ", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async () => {

  }

  console.log("test cases: ", testCases);

  return (
    <div>
      <NavBar />
      <div className="overallPane">
        <div className="problemDescription">
          <ResizableBox
            className="pane"
            width={leftWidth}
            height={topHeight}
            minConstraints={[12, topHeight]}
            maxConstraints={[window.innerWidth * 0.5, topHeight]}
            onResizeStop={(_, { size }) => setLeftWidth(size.width)}
            resizeHandles={["e"]}
          >
            <div className="paneContent">
              {leftWidth > HIDE_TEXT_AT && (
                <>
                  <div className="paneTitle">
                    {problem.problem_title} | {problem.user_name}
                  </div>
                  <div className="descriptionContent">
                    {problem.problem_description}
                  </div>
                </>
              )}
            </div>
          </ResizableBox>
        </div>
        <div className="rightPane">
          <ResizableBox
            className="pane"
            width={Infinity}
            height={rightHeight}
            minConstraints={[window.innerWidth * 0.5, 12]}
            maxConstraints={[Infinity, topHeight - 116]}
            onResizeStop={(_, { size }) => setRightHeight(size.height)}
            resizeHandles={["s"]}
          >
            <div className="paneContent">
              {rightHeight > HIDE_TEXT_AT && (
                <>
                  <div className="paneTitle">
                    Code editor
                    <div className="submissionButtons">
                      <Stopwatch />
                      <button
                        className="runButton"
                        onClick={handleRun}
                      >
                        Run
                      </button>
                      <button
                        className="submitButton"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="editorContainer">
                    <CodeEditor
                      value={code ?? ""}
                      onChange={setCode}
                    />
                  </div>
                </>
              )}
            </div>
          </ResizableBox>
          <div className="testCasesPane">
            <div className="pane">
              <div className="paneContent">
                <div className="paneTitle">
                  Test cases
                </div>
                <div className="testCases">
                  {Array.isArray(testCases) && testCases.length > 0 ? (
                    testCases.map((testCase, idx) => {
                      const result = testCaseResults.find(
                        (r) => r.test_case_id === testCase.test_case_id
                      );

                      return (
                        <div className="testCase" key={testCase.test_case_id}>
                          <h3>
                            Test Case {idx + 1}{" "}
                          </h3>
                          {result?.passed != null
                            ? <p><strong>Status: </strong><span style={{ color: result.passed ? "green" : "red" }}>
                              {result?.passed === true
                                ? "Pass"
                                : "Fail"}</span></p>
                            : ""}
                          <p><strong>Input:</strong> {JSON.stringify(testCase.input_value)}</p>
                          <p><strong>Expected:</strong> {JSON.stringify(testCase.expected_value)}</p>
                          {result && (
                            <>
                              <strong>Output:</strong>
                              <pre
                                style={{ color: result.passed ? "green" : "red" }}
                                className="testOutput"
                              >
                                <p>{result.actual_output}</p>
                              </pre>
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>No Test Cases Found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}