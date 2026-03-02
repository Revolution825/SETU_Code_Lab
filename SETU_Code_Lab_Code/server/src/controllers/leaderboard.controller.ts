import { Request, Response } from "express";
import { fetchLeaderboardService } from "../services/leaderboard.service";

export const fetchLeaderboard = async (req: Request, res: Response) => {
    const { dateRange, filterBy, courseId } = req.query;

    if (!dateRange || !filterBy || !courseId) {
        res.status(400).json({ error: "Missing required query parameters" });
        return;
    }

    try {
        const leaderboard = await fetchLeaderboardService(
            dateRange as string,
            filterBy as string,
            courseId as string
        );
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}