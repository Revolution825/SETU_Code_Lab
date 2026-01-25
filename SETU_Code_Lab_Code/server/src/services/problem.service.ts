import * as ProblemModel from "../models/problem.model";

export const getAllProblems = async () => {
  const problems = await ProblemModel.fetchProblems();
  return problems;
};

export const getAllMyProblems = async (userId: number) => {
  const problems = await ProblemModel.fetchProblemsByUserId(userId);
  return problems;
}
