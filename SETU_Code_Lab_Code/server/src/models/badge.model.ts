import { pool } from "../infrastructure/database";
import { Badge } from "../types/badge";

export const fetchUserBadges = async (user_id: number) => {
  const result = await pool.query(
    "SELECT b.* FROM badge b JOIN user_badge ub ON b.badge_id = ub.badge_id WHERE ub.user_id = $1",
    [user_id],
  );
  return result.rows;
};

export const awardBadgeIfNotExists = async (
  user_id: number,
  badge_id: number,
): Promise<Badge | null> => {
  const result = await pool.query(
    `INSERT INTO user_badge (user_id, badge_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING badge_id`,
    [user_id, badge_id],
  );

  if (result.rowCount === 0) return null;

  const badge = await pool.query(`SELECT * FROM badge WHERE badge_id = $1`, [
    badge_id,
  ]);
  return badge.rows[0];
};
