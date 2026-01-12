import * as TestCaseModel from "../models/testCase.model";
import { TestCase } from "../types/testCase";

export async function getAllTestCasesForProblem(problem_id: string): Promise<TestCase[]> {
  const testCases = await TestCaseModel.fetchTestCases(problem_id);
  return testCases;
};