import { Request, Response } from "express";
import { startContainer } from "../services/docker.service";

export async function startContainerHandler(req: Request, res: Response) {
  const { placeholder_code, code, testCase, language } = req.body;
  const image = language === "java"
    ? process.env.JAVA_EXECUTION_IMAGE!
    : process.env.PYTHON_EXECUTION_IMAGE!;
  try {
    const output = await startContainer(
      image,
      placeholder_code,
      code,
      testCase,
      language,
    );
    res.status(200).json({ message: "Container started", output: output });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
