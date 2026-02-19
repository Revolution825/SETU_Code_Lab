import * as TestCaseModel from "../models/testCase.model";
import { TestCase } from "../types/testCase";

export async function getAllTestCasesForProblem(problem_id: string): Promise<TestCase[]> {
  const testCases = await TestCaseModel.fetchTestCases(problem_id);
  return testCases;
};

export async function getTestCaseResultsForSubmission(submission_id: string) {
  const testCaseResults = await TestCaseModel.fetchTestCaseResults(submission_id);
  return testCaseResults;
}