import { Request, Response } from "express";
import * as dockerService from "../services/docker.service";

export async function startContainerHandler(req:Request, res:Response) {
    const { image, code, input } = req.body;
    try {
        const output = await dockerService.startContainer(image, code, input);
        res.status(200).json({message:"Container started", output:output});
    } catch (err:any) {
        res.status(500).json({message:err.message})
    }
}