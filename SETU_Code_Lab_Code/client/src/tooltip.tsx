import React, { useRef, useState } from "react";

interface Props {
    text: string;
    children: React.ReactNode;
}

export default function ToolTip({ text, children }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    const handleMouseEnter = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setCoords({ top: rect.top - 36, left: rect.left + 6 + rect.width / 2 });
        }
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (!e.relatedTarget || !ref.current?.contains(e.relatedTarget as Node)) {
            setCoords(null);
        }
    };

    return (
        <div ref={ref} className="tooltipContainer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {coords && (
                <div className="tooltipBox" style={{ top: coords.top, left: coords.left }}>
                    {text}
                </div>
            )}
        </div>
    );
}