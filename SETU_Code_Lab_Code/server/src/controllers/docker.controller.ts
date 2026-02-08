import { Request, Response } from "express";
import { startContainer } from "../services/docker.service";

export async function startContainerHandler(req: Request, res: Response) {
    const { image, placeholder_code, code, testCase } = req.body;
    try {
        const output = await startContainer(image, placeholder_code, code, testCase);
        res.status(200).json({ message: "Container started", output: output });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}