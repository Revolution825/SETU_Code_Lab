import { useLocation, useNavigate } from "react-router-dom";
import type { Problem } from "../viewProblems/problemList.component";
import NavBar from "../viewProblems/navBar.component";
import "./solveProblem.scss";
import "react-resizable/css/styles.css";
import { ResizableBox } from 'react-resizable';
import { useEffect, useState } from "react";
import CodeEditor from "./codeEditor.component";

export interface TestCase {
  test_case_id: number;
  problem_id: number;
  input_value: string;
  expected_value:string;
}

export default function Problem() {
  const navigate = useNavigate();
  const location = useLocation();
  const problem:Problem = location.state;

  const [leftWidth, setLeftWidth] = useState(window.innerWidth * 0.5);
  const topHeight = window.innerHeight - 104;
  const [rightHeight, setRightHeight] = useState(topHeight - 116)
  const HIDE_TEXT_AT = 120;

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [code, setCode] = useState(
    problem?.placeholder_code
  )

  useEffect(() => {
    const token = localStorage.getItem("token");
      if(!token) {
        navigate("/");
        return;
      }

    async function fetchTestCases() {
      const res = await fetch('api/testCases?problem_id='+ problem.problem_id, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if(res.ok) {
        setTestCases(await res.json());
      } else {
        console.log("Data", res.json());
        const errorData = await res.json();
        console.error("Error fetching test cases: ", errorData.message);
      }
    }
    fetchTestCases();
  }, [])

  console.log("test cases: ", testCases)

    return (
        <div>
            <NavBar/>
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
                                <button className="runButton">Run</button>
                                <button className="submitButton">Submit</button>
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
                          {Array.isArray(testCases)
                          ? testCases.map((testCase) =>
                            <div className="testCase" key={testCase.test_case_id}>
                                <p>
                                  Input: {testCase.input_value}
                                </p>
                                <p>
                                  Expected: {testCase.expected_value}
                                </p>
                              </div>
                          )
                        : <p>No Test Cases Found</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    )
}