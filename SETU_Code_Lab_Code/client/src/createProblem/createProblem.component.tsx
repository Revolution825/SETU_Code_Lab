import NavBar from "../viewProblems/navBar.component";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import TestCaseForm from "./testCaseForm.component";
import "./createProblem.scss";
import { useAuth } from "../authContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";
import { useState } from "react";

export default function CreateProblem() {
  interface TestCase {
    sampleInput: string;
    expectedOutput: string;
  }
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const problem: Problem = location.state;
  // const problemId = problem?.problem_id;
  const [title, setTitle] = useState(problem?.problem_title ?? "");
  const [difficulty, setDifficulty] = useState(problem?.difficulty ?? 1);
  const [description, setDescription] = useState(problem?.problem_description ?? "");
  const [placeholderCode, setPlaceholderCode] = useState(problem?.placeholder_code ?? "");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const handleSubmit = async () => {

    try {
      const res = await fetch('/api/createNewProblem', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem_title: title,
          problem_description: description,
          difficulty: difficulty,
          placeholder_code: placeholderCode,
          testCases: testCases
        })
      });
      const response = await res.json()
      console.log("Response: ", response);

      if (!res.ok) {
        throw new Error("Failed to create problem");
      }
      navigate("/manageProblems");
    } catch (error: any) {
      console.error("Error creating problem :", error.message);
    }
  }

  const descriptionPlaceholder = `eg. (markdown formatting is supported)

## Palindrome Number

Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

---

### Example 1

**Input:**

x = 121

**Output:**

true

**Explanation:**

\`121\` reads as \`121\` from left to right and from right to left...`;
  const placeholderCodePlaceholder = `eg.
public static boolean isPalindrome(int x) {
    *student code goes here*
}`

  return (
    <div>
      <NavBar />
      {user?.role == "lecturer" ? <LecturerSideBar /> : null}
      <div >
        <form className="createProblemForm"
          onSubmit={
            (e) => {
              e.preventDefault()
              handleSubmit()
            }}>
          <div className="formContent">
            <div className="createProblemContent formBackground">
              <div className="createProblemHeader">
                Create New Problem
              </div>

              <div className="createProblemInput">
                <label>
                  Title:
                </label>
                <input
                  className="inputBox topRounded"
                  type="text"
                  maxLength={100}
                  placeholder="eg. Palindrome Number..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required />
              </div>
              <div className="createProblemInput">
                <label>
                  Difficulty:
                </label>
                <input
                  className="inputBox bottomRounded"
                  type="number"
                  placeholder="eg. 0-5..."
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  min="1"
                  max="5"
                  maxLength={1}
                  required />
              </div>
              <label className="createProblemInput">
                Description:
              </label>
              <div className="createProblemInput">
                <textarea
                  className="textAreaInput problemDescriptionInput bottomRounded topRounded"
                  placeholder={descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required />
              </div>
            </div>
          </div>
          <div className="formContent">
            <div className="placeholderCodeContentBox formBackground" style={{ marginRight: 24 }}>
              <div className="createProblemHeader">
                Placeholder Code
              </div>
              <div className="createProblemInput">
                <textarea
                  className="textAreaInput placeholderCodeInput bottomRounded topRounded"
                  placeholder={placeholderCodePlaceholder}
                  value={placeholderCode}
                  onChange={(e) => setPlaceholderCode(e.target.value)}
                  required />
              </div>
            </div>
            <TestCaseForm
              testCases={testCases}
              setTestCases={setTestCases}
            />
            <div className="submitButtonDiv">
              <button type="submit" className="submitProblemButton">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}