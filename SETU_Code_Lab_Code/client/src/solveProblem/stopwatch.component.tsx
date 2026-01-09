import { forwardRef, useImperativeHandle, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import "./stopwatch.scss";

export type StopwatchHandle = {
    getTotalSeconds: () => number;
};

const Stopwatch = forwardRef<StopwatchHandle>((props, ref) => {
    const [image, setImage] = useState(<img className="stopPlayIcon" src="/pauseButton.svg" alt="start/stop" />);

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
    } = useStopwatch({ autoStart: true });

    useImperativeHandle(ref, () => ({
        getTotalSeconds: () => totalSeconds,
    }));

    const startStop = () => {
        if (isRunning) {
            pause();
            setImage(<img className="stopPlayIcon" src="/playButton.svg" alt="start/stop" />)
        } else {
            start();
            setImage(<img className="stopPlayIcon" src="/pauseButton.svg" alt="start/stop" />);
        }
    };

    return (
        <div className="stopwatch">
            <button onClick={startStop}>
                {image}
            </button>
            <div className="digits">
                <span>{hours.toString().padStart(2, "0")}</span>:
                <span>{minutes.toString().padStart(2, "0")}</span>:
                <span>{seconds.toString().padStart(2, "0")}</span>
            </div>
        </div>
    );
});

export default Stopwatch;