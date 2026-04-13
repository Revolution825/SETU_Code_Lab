import * as ProblemModel from "../models/problem.model";
import * as TestCaseModel from "../models/testCase.model";
import { pool } from "../infrastructure/database";
import type { TestCase } from "../types/testCase";
import { splitParams, getParamNames } from "./sharedUtils";
import { ProblemLanguage } from "../types/problemLanguage";
import { startContainer } from "./docker.service";

function injectJavaCode(code: String, placeholder: String) {
  const index = placeholder.lastIndexOf("}");
  return (
    placeholder.slice(0, index) +
    `\n    return ${code};\n` +
    placeholder.slice(index)
  );
}

function injectPythonCode(code: String, placeholder: String) {
  return placeholder + `\n    return ${code}\n`;
}

export const getAllCourseProblems = async (selectedCourseId: Number) => {
  const problems = await ProblemModel.fetchCourseProblems(selectedCourseId);
  return problems;
};

export const getAllMyProblems = async (userId: number) => {
  const problems = await ProblemModel.fetchProblemsByUserId(userId);
  return problems;
};

export const getAllAvailableProblems = async (userId: number) => {
  const problems = await ProblemModel.getAllAvailableProblems(userId);
  return problems;
};

export const createProblem = async (
  user_id: number,
  problem_title: string,
  problem_description: string,
  difficulty: string,
  language_entries: ProblemLanguage[],
  testCases: TestCase[],
) => {
  const client = await pool.connect();
  try {
    const points = parseInt(difficulty) * 100;

    for (const entry of language_entries) {
      const paramNames = getParamNames(entry);

      for (const testCase of testCases) {
        const inputValues = splitParams(testCase.input_value);
        if (inputValues.length !== paramNames.length) {
          throw new Error(
            "Language " +
              entry.language +
              " has " +
              paramNames.length +
              " parameter(s) but test case has " +
              inputValues.length +
              " input value(s).",
          );
        }
        const image =
          entry.language === "java"
            ? process.env.JAVA_EXECUTION_IMAGE!
            : process.env.PYTHON_EXECUTION_IMAGE!;

        const inputValuesJson: Record<string, any> = {};
        paramNames.forEach((name, i) => {
          inputValuesJson[name] = JSON.parse(inputValues[i].trim());
        });

        const code =
          entry.language === "java"
            ? injectJavaCode(testCase.expected_value, entry.placeholder_code)
            : injectPythonCode(testCase.expected_value, entry.placeholder_code);

        const output = await startContainer(
          image,
          entry.placeholder_code,
          code,
          {
            ...testCase,
            input_value: inputValuesJson as any,
            expected_value: JSON.parse(testCase.expected_value),
          },
          entry.language,
        );

        if (!output.passed) {
          throw new Error(
            `Test failed for ${entry.language} : ${output.actual_output}`,
          );
        }
      }
    }

    const parameterCounts = language_entries.map(
      (e) => getParamNames(e).length,
    );
    if (new Set(parameterCounts).size > 1) {
      throw new Error(
        "All language entries must have the same number of parameters.",
      );
    }

    await client.query("BEGIN");
    const problem = await ProblemModel.insertProblem(
      client,
      user_id,
      problem_title,
      problem_description,
      difficulty,
      points,
    );

    for (const entry of language_entries) {
      await ProblemModel.insertProblemLanguage(
        client,
        problem.problem_id,
        entry.language,
        entry.placeholder_code,
      );
    }

    const primaryEntry =
      language_entries.find((e) => e.language === "java") ??
      language_entries[0];
    const paramNames = getParamNames(primaryEntry);
    const problem_id = problem.problem_id;
    for (const testCase of testCases) {
      const inputValues = splitParams(testCase.input_value);
      if (inputValues.length !== paramNames.length) {
        throw new Error(
          "Number of input values does not match number of parameters in placeholder code.",
        );
      }
      const inputValuesJson: Record<string, any> = {};
      paramNames.forEach((name, i) => {
        inputValuesJson[name] = JSON.parse(inputValues[i].trim());
      });
      testCase.input_value = JSON.stringify(inputValuesJson);
      await TestCaseModel.createTestCase(client, problem_id, testCase);
    }

    await client.query("COMMIT");
    return problem;
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error inside createProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
};

export const updateProblem = async (
  problem_id: number,
  problem_title: string,
  problem_description: string,
  difficulty: number,
  language_entries: ProblemLanguage[],
  testCases: TestCase[],
) => {
  const client = await pool.connect();
  try {
    const points = difficulty * 100;

    for (const entry of language_entries) {
      const paramNames = getParamNames(entry);
      for (const testCase of testCases) {
        if (testCase.deleted) continue;
        const inputValues = splitParams(testCase.input_value);
        if (inputValues.length !== paramNames.length) {
          throw new Error(
            "Language " +
              entry.language +
              " has " +
              paramNames.length +
              " parameter(s) but test case has " +
              inputValues.length +
              " input value(s).",
          );
        }
        const image =
          entry.language === "java"
            ? process.env.JAVA_EXECUTION_IMAGE!
            : process.env.PYTHON_EXECUTION_IMAGE!;

        const inputValuesJson: Record<string, any> = {};
        paramNames.forEach((name, i) => {
          inputValuesJson[name] = JSON.parse(inputValues[i].trim());
        });

        const code =
          entry.language === "java"
            ? injectJavaCode(testCase.expected_value, entry.placeholder_code)
            : injectPythonCode(testCase.expected_value, entry.placeholder_code);

        const output = await startContainer(
          image,
          entry.placeholder_code,
          code,
          {
            ...testCase,
            input_value: inputValuesJson as any,
            expected_value: JSON.parse(testCase.expected_value),
          },
          entry.language,
        );

        if (!output.passed) {
          throw new Error(
            `Test failed for ${entry.language} : ${output.actual_output}`,
          );
        }
      }
    }

    const parameterCounts = language_entries.map(
      (e) => getParamNames(e).length,
    );
    if (new Set(parameterCounts).size > 1) {
      throw new Error(
        "All language entries must have the same number of parameters.",
      );
    }

    await client.query("BEGIN");
    const problem = await ProblemModel.updateProblem(
      client,
      problem_id,
      problem_title,
      problem_description,
      difficulty,
      points,
    );

    await ProblemModel.deleteProblemLanguages(client, problem_id);
    for (const entry of language_entries) {
      await ProblemModel.insertProblemLanguage(
        client,
        problem_id,
        entry.language,
        entry.placeholder_code,
      );
    }

    const primaryEntry =
      language_entries.find((e) => e.language === "java") ??
      language_entries[0];
    const paramNames = getParamNames(primaryEntry);

    for (const testCase of testCases) {
      if (testCase.deleted) {
        if (testCase.test_case_id) {
          await TestCaseModel.deleteTestCase(client, testCase.test_case_id);
        }
        continue;
      } else if (testCase.test_case_id) {
        if (testCase.input_value == null || testCase.expected_value == null) {
          throw new Error("Invalid test case data");
        }
        const inputValues = splitParams(testCase.input_value);
        if (inputValues.length !== paramNames.length) {
          throw new Error(
            "Number of input values does not match number of parameters in placeholder code.",
          );
        }
        const inputValuesJson: Record<string, any> = {};
        paramNames.forEach((name, i) => {
          inputValuesJson[name] = JSON.parse(inputValues[i].trim());
        });
        testCase.input_value = JSON.stringify(inputValuesJson);
        await TestCaseModel.updateTestCase(client, testCase);
      } else {
        if (!problem_id) {
          throw new Error("Cannot create test case without problem_id");
        }
        if (testCase.input_value == null || testCase.expected_value == null) {
          throw new Error("Invalid test case data");
        }
        const inputValues = splitParams(testCase.input_value);
        const inputValuesJson: Record<string, any> = {};
        paramNames.forEach((name, i) => {
          inputValuesJson[name] = JSON.parse(inputValues[i].trim());
        });
        testCase.input_value = JSON.stringify(inputValuesJson);
        await TestCaseModel.createTestCase(client, problem_id, testCase);
      }
    }

    await client.query("COMMIT");
    return problem;
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error inside updateProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
};

export const deleteProblem = async (problem_id: number) => {
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    const problem = await ProblemModel.deleteProblem(client, problem_id);
    await client.query("COMMIT");
    return problem;
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error inside updateProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
};

export const getSubmissionProblems = async (problem_ids: number[]) => {
  const problem = await ProblemModel.getProblemsByIds(problem_ids);
  return problem;
};

export const getProblemLanguageData = async (problem_id: number) => {
  const languageData = await ProblemModel.getProblemLanguageData(problem_id);
  return languageData;
};
