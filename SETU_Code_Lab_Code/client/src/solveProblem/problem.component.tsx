import { useLocation, useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";
import NavBar from "../viewProblems/navBar.component";
import "./solveProblem.scss";
import "react-resizable/css/styles.css";
import { ResizableBox } from 'react-resizable';
import { useEffect, useRef, useState } from "react";
import CodeEditor from "./codeEditor.component";
import Stopwatch, { type StopwatchHandle } from "./stopwatch.component";
import MarkdownPreview from "@uiw/react-markdown-preview";
import SubmissionAlert from "./submissionAlert.component";
import type { TestCase } from "../types/TestCase";
import type { TestCaseResult } from "../types/TestCaseResult";
import toast from "react-hot-toast";
import { useAntiCheat } from "../antiCheat";

export default function Problem() {
  const { shouldAutoSubmit } = useAntiCheat();
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
  const [isRunning, setIsRunning] = useState(false);
  const stopwatchRef = useRef<StopwatchHandle | null>(null);
  const image = "java-sandbox";

  const [showSubmissionAlert, setShowSubmissionAlert] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState<{
    overall_status: boolean,
    testCaseResults: TestCaseResult[],
    time_taken: number
  } | null>(null);

  useEffect(() => {
    async function fetchTestCases() {
      const res = await fetch('api/testCases?problem_id=' + problem.problem_id, {
        method: "GET",
        credentials: "include"
      });
      if (res.ok) {
        setTestCases(await res.json());
      } else {
        console.log("Data", res.json());
        const errorData = await res.json();
        toast.error("Error fetching test cases");
        console.error("Error fetching test cases: ", errorData.message);
      }
    }
    fetchTestCases();

  }, []);

  useEffect(() => {
    if (shouldAutoSubmit) {
      handleSubmit();
    }
  }, [shouldAutoSubmit]);

  const handleRun = async (): Promise<TestCaseResult[]> => {
    const results: TestCaseResult[] = [];
    for (const testCase of testCases) {
      const result = await runTestCase(testCase);
      if (!result) {
        throw new Error("Failed to get result for test case ID: " + testCase.test_case_id);
      }
      results.push(result);
    }
    return results;
  };

  async function runTestCase(testCase: TestCase): Promise<TestCaseResult | null> {
    try {
      const res = await fetch('docker/start', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: image,
          code: code,
          testCase: testCase
        })
      });

      const data = await res.json();
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
        return testCaseResult;
      } else {
        toast.error("Error running code");
        console.error("Error running code: ", data.message);
        return null;
      }
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  const handleSubmit = async () => {
    if (!stopwatchRef.current) return;
    try {
      const timeTaken = stopwatchRef.current.getTotalSeconds();
      const submittedCode = code;
      setIsRunning(true);
      const results = await handleRun();
      setIsRunning(false);
      if (results.length !== testCases.length) {
        toast.error("Error: not all test cases ran, please try again");
        return;
      }
      const overallStatus = results.every(tc => tc.passed);
      const res = await fetch('/api/submission', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem_id: problem.problem_id,
          submitted_code: submittedCode,
          overall_status: overallStatus,
          time_taken: timeTaken,
          testCaseResults: results
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Submission successful");
        console.log("Submission successful: ", data);
        setSubmissionSummary({
          overall_status: overallStatus,
          testCaseResults: results,
          time_taken: timeTaken
        });
        setShowSubmissionAlert(true);
      } else {
        setIsRunning(false);
        toast.error("Error submitting code");
        console.error("Error submitting code: ", data);
      }
    } catch (error: any) {
      setIsRunning(false);
      toast.error("Error: test cases could not be executed");
      console.error(error.message);
    }
  }

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
                  <div className="warning"><img className="warningIcon" src="warning.svg" alt="WARNING" /> Leaving this tab before fully completing the problem will automatically submit your current work</div>
                  <div className="descriptionContent">
                    <MarkdownPreview
                      source={problem.problem_description}
                      style={{
                        backgroundColor: "transparent",
                        fontFamily: 'Inter Tight, sans-serif',
                        color: '#dedede',
                      }}
                    />
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
            minConstraints={[window.innerWidth * 0.5, 51]}
            maxConstraints={[Infinity, topHeight - 116]}
            onResizeStop={(_, { size }) => setRightHeight(size.height)}
            resizeHandles={["s"]}
          >
            <div className="paneContent">
              <div className="paneTitle">
                Code editor
                <div className="submissionButtons">
                  <Stopwatch ref={stopwatchRef} />
                  <button
                    className="runButton"
                    onClick={handleRun}
                    disabled={isRunning}
                  >
                    Run
                  </button>
                  <button
                    className="submitButton"
                    onClick={handleSubmit}
                    disabled={isRunning}
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
                    testCases.slice(0, 4).map((testCase, idx) => {
                      const result = testCaseResults.find(
                        (r) => r.test_case_id === testCase.test_case_id
                      );
                      console.log("result ", result);
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
                    <p style={{ marginLeft: "12px" }}>No Test Cases Found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {submissionSummary && (
        <SubmissionAlert
          isOpen={showSubmissionAlert}
          summary={submissionSummary}
          onClose={() => {
            setShowSubmissionAlert(false);
            navigate("/problems");
          }}
        />
      )}
    </div>
  )
}