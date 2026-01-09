import { useState, type JSX } from "react";
import { useStopwatch } from "react-timer-hook";

export default function Stopwatch() {
    const [image, setImage] = useState(<img style={{ height: "14px", width: "14px" }} src="" alt="start/stop" />);
    const {
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
    } = useStopwatch({ autoStart: true });

    const startStop = () => {
        if (isRunning) {
            pause();
            setImage(<img style={{ height: "14px", width: "14px" }} src="/playButton.svg" alt="start/stop" />)
        } else {
            start();
            setImage(<img style={{ height: "14px", width: "14px" }} src="" alt="start/stop" />);
        }
    }
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#2b2a33",
                borderRadius: "8px",
                marginRight: "12px",
            }}
        >
            <button onClick={startStop}>
                {image}
            </button>
            <div
                style={{
                    padding: "0 12px",
                    fontFamily: "monospace",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "0px"
                }}
            >
                <span>{hours.toString().padStart(2, "0")}</span>:
                <span>{minutes.toString().padStart(2, "0")}</span>:
                <span>{seconds.toString().padStart(2, "0")}</span>
            </div>
        </div>
    );
}