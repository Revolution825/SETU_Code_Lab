import { forwardRef, useImperativeHandle} from "react";
import { useStopwatch } from "react-timer-hook";
import "./stopwatch.scss";

export type StopwatchHandle = {
    getTotalSeconds: () => number;
};

const Stopwatch = forwardRef<StopwatchHandle>((_props, ref) => {

    const {
        totalSeconds,
        seconds,
        minutes,
        hours
    } = useStopwatch({ autoStart: true });

    useImperativeHandle(ref, () => ({
        getTotalSeconds: () => totalSeconds,
    }));

    return (
        <div className="stopwatch">
            <div className="digits">
                <span>{hours.toString().padStart(2, "0")}</span>:
                <span>{minutes.toString().padStart(2, "0")}</span>:
                <span>{seconds.toString().padStart(2, "0")}</span>
            </div>
        </div>
    );
});

export default Stopwatch;