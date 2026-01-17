import type { TestCaseResult } from "./problem.component";
import "./submissionAlert.scss";

interface submissionAlertProps {
    isOpen: boolean;
    onClose: () => void;
    summary: {
        overall_status: boolean;
        testCaseResults: TestCaseResult[];
        time_taken: number;
    };
}

export default function submissionAlert({
    isOpen,
    onClose,
    summary
}: Readonly<submissionAlertProps>) {
    if (!isOpen) return null;
    const numberTestCasesPassed = summary.testCaseResults.filter(
        (testCase) => testCase.passed
    ).length;
    const percentage = (numberTestCasesPassed / summary.testCaseResults.length) * 100;
    function formatTime(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }
    return (
        <div className="overlay">
            <div className="alertBox">
                <div className="alertBoxTitle">
                    <h3>Submission</h3>
                </div>
                <div>
                    <div className="alertBoxRow">
                        <span>Status: </span>
                        <span
                            className={
                                summary.overall_status
                                    ? "pass"
                                    : "fail"
                            }
                        >
                            {summary.overall_status ? "Pass" : "Fail"}
                        </span>
                    </div>
                </div>
                <div className="alertBoxRow">
                    <span>Result: </span>
                    <span
                        className={
                            summary.overall_status
                                ? "pass"
                                : "fail"
                        }
                    >
                        {percentage}%
                    </span>
                </div>
                <div className="alertBoxRow">
                    <span>Time Taken: </span>
                    <span>{formatTime(summary.time_taken)}</span>
                </div>
                <div className="alertBoxRow">
                    <span>Execution Time: </span>
                    <span>{Math.max(
                        ...summary.testCaseResults.map((testCaseResult) => testCaseResult.runtime_ms)
                    )} ms</span>
                </div>
                <div className="buttonContainer">
                    <button
                        className="dismissButton"
                        onClick={onClose}>Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}