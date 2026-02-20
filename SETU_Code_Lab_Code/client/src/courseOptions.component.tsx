import "./sidebar.scss";
import type { Course } from "./types/course";
import { useState } from "react";

type CourseOptionProps = {
    courses: Course[];
    selectedCourse: number;
    onSelectCourse: (courseId: number) => void
}

export default function CourseOptions({
    courses,
    selectedCourse,
    onSelectCourse
}: CourseOptionProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebarDropdown">
            <div className="titleWrapper">
                <button
                    className="dropdownTitle"
                    onClick={() => setOpen(prev => !prev)}>
                    Courses <img className={open ? "arrow open" : "arrow"} src="/dropdown.svg" alt="dropdown" />
                </button>
            </div>
            {open && (
                <ul className="dropdownList">
                    {Array.isArray(courses)
                        ? courses.map((c) => (
                            <li key={c.course_id}>
                                <button
                                    className={`option ${selectedCourse === c.course_id ? "active" : ""}`}
                                    onClick={() => onSelectCourse(c.course_id)}
                                    style={{
                                        color:
                                            selectedCourse === c.course_id
                                                ? "#626262"
                                                : "#dedede"
                                    }}
                                    key={c.course_id}>
                                    {c.course_title}
                                </button></li>
                        ))
                        : <li>No courses found</li>}
                </ul>
            )
            }
        </div>
    );
}