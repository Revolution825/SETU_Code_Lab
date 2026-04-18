import { useEffect, useState } from "react";

export const useAntiCheat = (submitted: boolean) => {
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const preventContext = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        alert("Warning: Copy/Paste is disabled");
      }
    };

    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        setShouldAutoSubmit(true);
        alert("You left the tab. Your work has been automatically submitted.");
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      alert("Warning: Drag and drop is disabled");
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragover", handleDragOver, true);
    document.addEventListener("drop", handleDrop, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("dragenter", prevent, true);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragover", handleDragOver, true);
      document.removeEventListener("drop", handleDrop, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("dragenter", prevent, true);
    };
  }, [submitted]);
  return { shouldAutoSubmit, setShouldAutoSubmit };
};
