import { Request, Response } from "express";
import {
  getAllCourseProblems,
  getAllMyProblems,
  getAllAvailableProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getSubmissionProblems,
  getProblemLanguageData,
} from "../services/problem.service";

export const getCourseProblems = async (req: Request, res: Response) => {
  try {
    const selectedCourseId = req.body.selectedCourse;
    const problems = await getAllCourseProblems(selectedCourseId);
    res.json(problems);
  } catch (error: any) {
    console.error("Error fetching problems:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProblems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const problems = await getAllMyProblems(userId);
    res.json(problems);
  } catch (error: any) {
    console.error("Error fetching user's problems:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableProblems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const problems = await getAllAvailableProblems(userId);
    res.json(problems);
  } catch (error: any) {
    console.error("Error fetching available problems:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProblemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      problem_title,
      problem_description,
      difficulty,
      language_entries,
      testCases,
    } = req.body;

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one test case is required" });
    }

    const problem = await createProblem(
      userId,
      problem_title,
      problem_description,
      difficulty,
      language_entries,
      testCases,
    );
    res.status(201).json({ problem_id: problem.problem_id });
  } catch (error: any) {
    console.error("Error creating new problem:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProblemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      problem_id,
      problem_title,
      problem_description,
      difficulty,
      language_entries,
      testCases,
    } = req.body;
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one test case is required" });
    }

    const problem = await updateProblem(
      problem_id,
      problem_title,
      problem_description,
      difficulty,
      language_entries,
      testCases,
    );
    res.status(201).json({ problem: problem.problem_id });
  } catch (error: any) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProblemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const problem_id = req.body.problem_id;
    const problem = await deleteProblem(problem_id);
    res.status(201).json({ problem: problem });
  } catch (error: any) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSubmittedProblems = async (req: Request, res: Response) => {
  try {
    const problem_ids = req.body.problem_ids;
    const problems = await getSubmissionProblems(problem_ids);
    res.status(200).json(problems);
  } catch (error: any) {
    console.error("Error fetching submitted problem:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProblemLanguages = async (req: Request, res: Response) => {
  try {
    const problem_id = parseInt(req.query.problem_id as string);
    const languageData = await getProblemLanguageData(problem_id);
    res.status(200).json(languageData);
  } catch (error: any) {
    console.error("Error fetching problem language data:", error);
    res.status(500).json({ message: error.message });
  }
};
