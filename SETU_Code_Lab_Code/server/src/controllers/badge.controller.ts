import { Request, Response } from "express";
import * as badgeService from "../services/badge.service";

export const fetchUserBadges = async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const badges = await badgeService.getUserBadges(userId);
    res.json(badges);
  } catch (error: any) {
    console.error("Error fetching user's badges:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
