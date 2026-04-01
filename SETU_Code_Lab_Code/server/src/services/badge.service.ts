import * as badgeModel from "../models/badge.model";
import * as submissionModel from "../models/submission.model";
import * as userModel from "../models/user.model";
import { Badge } from "../types/badge";
import { Submission } from "../types/submission";
import { User } from "../types/user";

export const getUserBadges = async (userId: number) => {
  const badges = await badgeModel.fetchUserBadges(userId);
  return badges;
};

export const checkAndAwardBadges = async (userId: number) => {
  const submissions: Submission[] =
    await submissionModel.getSubmissionsForUser(userId);
  const userDetails: User = await userModel.fetchUserData(userId);

  const uniqueSolvedProblems = [
    ...new Set(
      submissions
        .filter((s) => s.overall_status === true)
        .map((s) => s.problem_id),
    ),
  ];

  const earned = [];
  if (uniqueSolvedProblems.length >= 1) earned.push(1);
  if (userDetails.current_streak >= 3) earned.push(2);
  if (uniqueSolvedProblems.length >= 5) earned.push(3);

  const newBadges: Badge[] = [];
  for (const badge_id of earned) {
    const awarded = await badgeModel.awardBadgeIfNotExists(userId, badge_id);
    if (awarded) {
      newBadges.push(awarded);
    }
  }
  return newBadges;
};
