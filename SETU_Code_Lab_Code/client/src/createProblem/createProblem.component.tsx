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
import { api, getParamNames, jsonToParamValues } from "../sharedUtils";
import type { ProblemLanguage } from "../types/ProblemLanguage";
import FadeLoader from "react-spinners/FadeLoader";
import ToolTip from "../tooltip";

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
  const javaPlaceholderCodePlaceholder = `
// **EXAMPLE**
// public static boolean isPalindrome(int x) {
//     **student code goes here**
// }`;

  const pythonPlaceholderCodePlaceholder = `
# def isPalindrome(x: int) -> bool:
    # student code goes here
`;

  const SUPPORTED_LANGUAGES = ["java", "python"] as const;
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const problem: Problem = location.state;
  const [problemLanguageLoading, setProblemLanguageLoading] = problem
    ? useState(true)
    : useState(false);
  const [testCasesLoading, setTestCasesLoading] = problem
    ? useState(true)
    : useState(false);
  const [title, setTitle] = useState(problem?.problem_title ?? "");
  const [difficulty, setDifficulty] = useState(problem?.difficulty ?? 1);
  const [description, setDescription] = useState(
    problem?.problem_description ?? "",
  );
  const [language_entries, setLanguageEntries] = useState<ProblemLanguage[]>([
    { language: "java", placeholder_code: javaPlaceholderCodePlaceholder },
  ]);
  const [activeLanguageTab, setActiveLanguageTab] = useState<string>("java");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const addLanguage = (language: string) => {
    if (language_entries.some((e) => e.language === language)) return;
    setLanguageEntries((prev) => [
      ...prev,
      {
        language: language as any,
        placeholder_code:
          language === "java"
            ? javaPlaceholderCodePlaceholder
            : pythonPlaceholderCodePlaceholder,
      },
    ]);
    setActiveLanguageTab(language);
  };

  const removeLanguage = (language: string) => {
    if (language_entries.length === 1) {
      toast.error("At least one language is required");
      return;
    }
    setLanguageEntries((prev) => prev.filter((e) => e.language !== language));
    setActiveLanguageTab(language_entries[0].language);
  };

  const updatePlaceholderCode = (language: string, code: string) => {
    setLanguageEntries((prev) =>
      prev.map((e) =>
        e.language === language ? { ...e, placeholder_code: code } : e,
      ),
    );
  };

  const updateProblem = async (preparedTestCases: TestCase[]) => {
    try {
      const res = await api.post("/api/updateProblem", {
        problem_id: problem?.problem_id,
        problem_title: title,
        problem_description: description,
        difficulty: difficulty,
        language_entries: language_entries,
        testCases: preparedTestCases,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      toast.success("Problem updated successfully");
      navigate("/manageProblems");
    } catch (error: any) {
      toast.error("Failed to update problem : " + error.message);
      console.error("Error updating problem :", error.message);
    }
  };

  const createNewProblem = async (preparedTestCases: TestCase[]) => {
    try {
      const res = await api.post("/api/createNewProblem", {
        problem_id: problem?.problem_id,
        problem_title: title,
        problem_description: description,
        difficulty: difficulty,
        language_entries: language_entries,
        testCases: preparedTestCases,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      toast.success("Problem created successfully");
      navigate("/manageProblems");
    } catch (error: any) {
      toast.error("Failed to create problem : " + error.message);
      console.error("Error creating problem :", error.message);
    }
  };

  const handleSubmit = async () => {
    const preparedTestCases = testCases.map((testCase) => {
      let id, input, output, deleted;
      try {
        id = testCase?.test_case_id;
        input = testCase.input_value;
        output = testCase.expected_value;
        deleted = testCase.deleted;
        return {
          test_case_id: id,
          input_value: input,
          expected_value: output,
          deleted: deleted,
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    });
    try {
      if (testCases.length < 1) {
        toast.error("You must add at least one test case");
        throw new Error("At least one test case must be added");
      }

      if (language_entries.length < 1) {
        toast.error("You must add at least one language");
        throw new Error("At least one language entry must be added");
      }

      const javaRegex =
        /public\s+static\s+([\w<>\[\], ?]+)\s+(\w+)\s*\(([^)]*)\)/;
      const pythonRegex = /def\s+\w+\s*\(([^)]*)\)/;

      for (const entry of language_entries) {
        const regex = entry.language === "java" ? javaRegex : pythonRegex;
        if (!entry.placeholder_code.match(regex)) {
          toast.error(
            `Invalid method signature for ${entry.language} placeholder code`,
          );
          throw new Error(
            `Invalid method signature for ${entry.language} placeholder code`,
          );
        }
      }
      if (problem?.problem_id) {
        updateProblem(preparedTestCases);
      } else {
        createNewProblem(preparedTestCases);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!problem?.problem_id) return;
    async function fetchData() {
      const [langRes, tcRes] = await Promise.all([
        api.get("api/problemLanguages?problem_id=" + problem.problem_id),
        api.get("api/testCases?problem_id=" + problem.problem_id),
      ]);
      const languages: ProblemLanguage[] = await langRes.json();
      const dbTestCases = await tcRes.json();
      setLanguageEntries(languages);
      setActiveLanguageTab(languages[0].language);
      const primaryEntry =
        languages.find((e) => e.language === "java") ?? languages[0];
      const paramNames = getParamNames(primaryEntry);
      const formFriendlyTestCases = dbTestCases.map((tc: any) => ({
        test_case_id: tc.test_case_id,
        input_value: jsonToParamValues(
          JSON.stringify(tc.input_value),
          paramNames,
        ),
        expected_value: JSON.stringify(tc.expected_value),
      }));
      setTestCases(formFriendlyTestCases);
      setProblemLanguageLoading(false);
      setTestCasesLoading(false);
    }
    fetchData();
  }, [problem?.problem_id]);

  return (
    <div>
      <NavBar />
      {user?.role == "lecturer" ? (
        <div className="sideBar">
          <LecturerSideBar />
        </div>
      ) : null}
      <div>
        <form
          className="createProblemForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="formContent">
            <div className="createProblemContent formBackground">
              <div className="createProblemHeader">Create New Problem</div>

              <div className="createProblemInput">
                <label>Title:</label>
                <input
                  className="inputBox topRounded"
                  type="text"
                  maxLength={100}
                  placeholder="eg. Palindrome Number..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="createProblemInput">
                <label>Difficulty:</label>
                <input
                  className="inputBox bottomRounded"
                  type="number"
                  placeholder="eg. 0-5..."
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  min="1"
                  max="5"
                  maxLength={1}
                  required
                />
              </div>
              <label className="createProblemInput">Description:</label>
              <div className="createProblemInput">
                <textarea
                  className="textAreaInput problemDescriptionInput bottomRounded topRounded"
                  placeholder={descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="formContent">
            <div
              className="placeholderCodeContentBox formBackground"
              style={{ marginRight: 24 }}
            >
              <div className="createProblemHeader">
                <div style={{ marginRight: "12px" }}>Placeholder Code</div>
                <div className="languageTabs">
                  {language_entries.map((entry) => (
                    <div
                      key={entry.language}
                      className={`languageTab ${activeLanguageTab === entry.language ? "active" : ""}`}
                      onClick={() => setActiveLanguageTab(entry.language)}
                    >
                      {entry.language}
                      {language_entries.length > 1 && (
                        <span
                          className="removeLanguage"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLanguage(entry.language);
                          }}
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  ))}
                  <ToolTip text="parameter names must be the same across languages">
                    {SUPPORTED_LANGUAGES.filter(
                      (l) => !language_entries.some((e) => e.language === l),
                    ).length > 0 && (
                      <select
                        className="addLanguageSelect"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) addLanguage(e.target.value);
                        }}
                      >
                        <option value="">+ Add language</option>
                        {SUPPORTED_LANGUAGES.filter(
                          (l) =>
                            !language_entries.some((e) => e.language === l),
                        ).map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    )}
                  </ToolTip>
                </div>
              </div>

              {language_entries.map((entry) => (
                <div
                  key={entry.language}
                  className="placeholderCodeEditor"
                  style={{
                    display:
                      activeLanguageTab === entry.language ? "block" : "none",
                  }}
                >
                  <CodeEditor
                    value={entry.placeholder_code}
                    language={entry.language}
                    onChange={(val) =>
                      updatePlaceholderCode(entry.language, val)
                    }
                  />
                </div>
              ))}
            </div>
            <TestCaseForm testCases={testCases} setTestCases={setTestCases} />
            <div className="submitButtonDiv">
              <button type="submit" className="submitProblemButton">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      {(problemLanguageLoading || testCasesLoading) && (
        <div className="spinner">
          <FadeLoader color="#dedede" />
          <p style={{ margin: 24 }}>Hang tight, Loading Problem Details...</p>
        </div>
      )}
    </div>
  );
}
