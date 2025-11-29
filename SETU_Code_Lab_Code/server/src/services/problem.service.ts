import * as ProblemModel from "../models/problem.model";

export const getAllProblems = async () => {
  const problems = await ProblemModel.fetchProblems();
  return problems;
};
