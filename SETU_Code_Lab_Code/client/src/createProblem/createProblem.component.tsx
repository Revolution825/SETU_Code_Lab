import NavBar from "../viewProblems/navBar.component";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import TestCaseForm from "./testCaseForm.component";
import "./createProblem.scss";
import { useAuth } from "../authContext";

export default function CreateProblem() {
  const { user } = useAuth();
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
        <form className="createProblemForm">
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
                  required />
              </div>
            </div>
            <div>
              <TestCaseForm />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}