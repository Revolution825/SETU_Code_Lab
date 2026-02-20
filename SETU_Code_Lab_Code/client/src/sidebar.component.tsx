import "./sidebar.scss";
import type { Course } from "./types/course";
import type { User } from "./types/user";
import CourseOptions from "./courseOptions.component";
import LecturerSideBar from "./lecturerSideBar.component";

type SideBarProps = {
    user: User | null;
    courses: Course[];
    selectedCourse: number;
    onSelectCourse: (courseId: number) => void;
}

export default function SideBar({
    user,
    courses,
    selectedCourse,
    onSelectCourse
}: SideBarProps) {
    return (
        <div className="sideBar">
            <CourseOptions
                courses={courses}
                selectedCourse={selectedCourse}
                onSelectCourse={onSelectCourse}
            />
            {user?.role === "lecturer" ? <LecturerSideBar /> : null}
        </div>
    );
}