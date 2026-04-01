export interface Badge {
  badge_id: number;
  badge_name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  user_id: number;
  badge_id: number;
  earned_at: string;
}