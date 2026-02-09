import { useNavigate } from "react-router-dom";
import "./lecturerSideBar.scss"
import type { Course } from "../types/course";

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
    const navigate = useNavigate();

    return (
        <div>
            <h3 className="title">Courses</h3>
            <ul>
                {Array.isArray(courses)
                    ? courses.map((c) => (
                        <button
                            className="option"
                            onClick={() => onSelectCourse(c.course_id)}
                            style={{
                                color:
                                    selectedCourse === c.course_id
                                        ? "#626262"
                                        : "#dedede"
                            }}
                            key={c.course_id}>
                            {c.course_title}
                        </button>
                    ))
                    : <li>No courses found</li>}
            </ul>
        </div>
    );
}