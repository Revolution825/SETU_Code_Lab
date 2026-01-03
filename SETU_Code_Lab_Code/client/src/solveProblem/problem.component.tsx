import { useLocation } from "react-router-dom";
import type { Problem } from "../viewProblems/problemList.component";
import NavBar from "../viewProblems/navBar.component";
import "./solveProblem.scss";
import "react-resizable/css/styles.css";
import { ResizableBox } from 'react-resizable';
import { useState } from "react";
import CodeEditor from "./codeEditor.component";

export default function Problem() {
  const location = useLocation();
  const problem:Problem = location.state;
  
  const [leftWidth, setLeftWidth] = useState(window.innerWidth * 0.5);
  const topHeight = window.innerHeight - 104;
  const [rightHeight, setRightHeight] = useState(topHeight - 116)

  const [code, setCode] = useState(
    problem.placeholder_code
  )

  const HIDE_TEXT_AT = 120;

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
                            </div>
                            <div className="editorContainer">
                            <CodeEditor 
                              value={code}
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
                        <div className="descriptionContent">
                          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque possimus vitae reprehenderit blanditiis debitis nihil, natus aliquid perspiciatis ex officiis doloribus ea iste reiciendis dolores quia in impedit error eius? 
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quaerat nemo accusamus! Veniam, sequi porro! Facilis similique quidem sit possimus molestiae neque quia, fugit illo? Quo voluptate quam vero tenetur? 
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit, id? Repellendus deserunt voluptas omnis fugit earum. Similique perspiciatis doloribus, asperiores, sint numquam voluptatem deserunt laudantium, in harum voluptas culpa ipsum?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    )
}