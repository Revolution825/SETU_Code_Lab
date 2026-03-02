import { fetchLeaderboardEntries } from "../models/leaderboard.model";

export const fetchLeaderboardService = async (
    dateRange: string,
    filterBy: string,
    courseId: string
) => {
    try {
        const now = new Date();
        let dateFrom: Date | null = null;

        if (dateRange === "lastWeek") {
            dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        else if (dateRange === "lastMonth") {
            dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        else if (dateRange === "lastYear") {
            dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
        else if (dateRange !== "allTime") {
            throw new Error("Invalid date range");
        }

        return await fetchLeaderboardEntries(courseId, dateFrom, filterBy);

    } catch (error) {
        console.error("Error inside fetchLeaderboardService:", error);
        throw error;
    }
};