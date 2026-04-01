import type { TestCaseResult } from "../types/TestCaseResult";
import type { Badge } from "../types/badge";
import "./submissionAlert.scss";

interface submissionAlertProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    overall_status: boolean;
    testCaseResults: TestCaseResult[];
    time_taken: number;
    points_awarded: number;
  };
  newBadges?: Badge[];
}

export function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function submissionAlert({
  isOpen,
  onClose,
  summary,
  newBadges = [],
}: Readonly<submissionAlertProps>) {
  if (!isOpen) return null;
  const numberTestCasesPassed = summary.testCaseResults.filter(
    (testCase) => testCase.passed,
  ).length;
  const percentage =
    (numberTestCasesPassed / summary.testCaseResults.length) * 100;
  return (
    <div className="overlay">
      <div className="alertBox">
        <div className="alertBoxTitle">
          <h3>Submission</h3>
        </div>
        <div className="alertBoxRow">
          <span>Status: </span>
          <span className={summary.overall_status ? "pass" : "fail"}>
            {summary.overall_status ? "Pass" : "Fail"}
          </span>
        </div>
        <div className="alertBoxRow">
          <span>Result: </span>
          <span className={summary.overall_status ? "pass" : "fail"}>
            {percentage}%
          </span>
        </div>
        <div className="alertBoxRow">
          <span>Time Taken: </span>
          <span>{formatTime(summary.time_taken)}</span>
        </div>
        <div className="alertBoxRow">
          <span>Execution Time: </span>
          <span>
            {Math.max(...summary.testCaseResults.map((t) => t.runtime_ms))} ms
          </span>
        </div>
        <div className="alertBoxRow">
          <span>Points Awarded: </span>
          <span>{summary.points_awarded}</span>
        </div>

        {newBadges.length > 0 && (
          <div className="badgesEarned">
            <h4>Badges Earned!</h4>
            <div className="badgeList">
              {newBadges.map((badge) => (
                <div key={badge.badge_id} className="badgeItem">
                  <img src={`${badge.icon}`} alt={badge.badge_name} />
                  <div className="badgeInfo">
                    <span className="badgeName">{badge.badge_name}</span>
                    <span className="badgeDesc">{badge.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="buttonContainer">
          <button className="dismissButton" onClick={onClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
