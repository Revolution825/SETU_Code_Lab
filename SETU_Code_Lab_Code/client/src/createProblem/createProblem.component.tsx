import NavBar from "../navBar.component";
import LecturerSideBar from "../lecturerSideBar.component";
import TestCaseForm from "./testCaseForm.component";
import "./createProblem.scss";
import { useAuth } from "../authContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";
import type { TestCase } from "../types/TestCase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CodeEditor from "../solveProblem/codeEditor.component";

export default function CreateProblem() {

  const descriptionPlaceholder = `eg. (markdown formatting is supported)

Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

---

### Example 1

**Input:**

x = 121

**Output:**

true

**Explanation:**

\`121\` reads as \`121\` from left to right and from right to left...`;
  const placeholderCodePlaceholder = `
// **EXAMPLE**
// public static boolean isPalindrome(int x) {
//     **student code goes here**
// }`

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const problem: Problem = location.state;
  const [title, setTitle] = useState(problem?.problem_title ?? "");
  const [difficulty, setDifficulty] = useState(problem?.difficulty ?? 1);
  const [description, setDescription] = useState(problem?.problem_description ?? "");
  const [placeholderCode, setPlaceholderCode] = useState(problem?.placeholder_code ?? placeholderCodePlaceholder);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const updateProblem = async (preparedTestCases: TestCase[]) => {
    try {
      const res = await fetch('/api/updateProblem', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem_id: problem?.problem_id,
          problem_title: title,
          problem_description: description,
          difficulty: difficulty,
          placeholder_code: placeholderCode,
          testCases: preparedTestCases
        })
      });

      if (!res.ok) {
        toast.error("Failed to update problem. Please try again.");
        throw new Error("Failed to update problem");
      }
      toast.success("Problem updated successfully");
      navigate("/manageProblems");
    } catch (error: any) {
      toast.error("Failed to update problem. Please try again.");
      console.error("Error updating problem :", error.message);
    }
  }

  const createNewProblem = async (preparedTestCases: TestCase[]) => {
    try {
      const res = await fetch('/api/createNewProblem', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem_id: problem?.problem_id,
          problem_title: title,
          problem_description: description,
          difficulty: difficulty,
          placeholder_code: placeholderCode,
          testCases: preparedTestCases
        })
      });

      if (!res.ok) {
        toast.error("Failed to create problem. Please try again.");
        throw new Error("Failed to create problem");
      }
      toast.success("Problem created successfully")
      navigate("/manageProblems");
    } catch (error: any) {
      toast.error("Failed to create problem. Please try again.");
      console.error("Error creating problem :", error.message);
    }
  }

  function isValidJSON(str: string) {
    try {
      return JSON.parse(str);
    } catch {
      toast.error("Invalid JSON in test cases");
      throw new Error("Invalid JSON in test cases");
    }
  }

  const handleSubmit = async () => {
    const preparedTestCases = testCases.map(testCase => {
      let id, input, output, deleted;
      try {
        id = testCase?.test_case_id;
        input = isValidJSON(testCase.input_value);
        output = isValidJSON(testCase.expected_value);
        deleted = testCase.deleted;
        return { test_case_id: id, input_value: input, expected_value: output, deleted: deleted }
      } catch (error: any) {
        throw new Error(error.message);
      }
    });
    try {
      if (testCases.length < 1) {
        toast.error("You must add at least one test case");
        throw new Error("At least one test case must be added");
      }
      const signatureRegex = /public\s+static\s+([\w<>\[\], ?]+)\s+(\w+)\s*\(([^)]*)\)/;
      const match = placeholderCode.match(signatureRegex);
      if (!match) {
        toast.error("Invalid method signiture for placeholder code");
        throw new Error("Invalid method signiture for placeholder code");
      }
      if (problem?.problem_id) {
        updateProblem(preparedTestCases)
      } else {
        createNewProblem(preparedTestCases)
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (!problem?.problem_id) return;
    async function fetchTestCases() {
      const res = await fetch('api/testCases?problem_id=' + problem.problem_id, {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching test cases:", errorData.message);
        return;
      }
      const dbTestCases = await res.json();
      const formFriendlyTestCases = dbTestCases.map((tc: any) => ({
        test_case_id: tc.test_case_id,
        input_value: JSON.stringify(tc.input_value),
        expected_value: JSON.stringify(tc.expected_value),
      }));
      setTestCases(formFriendlyTestCases);
    }
    fetchTestCases();
  }, [problem?.problem_id]);

  return (
    <div>
      <NavBar />
      {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
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
              <div className="placeholderCodeEditor">
                <CodeEditor value={placeholderCode} onChange={(e) => setPlaceholderCode(e)} />
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