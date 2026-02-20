import { useNavigate } from "react-router-dom";
import LecturerSideBar from "../lecturerSideBar.component";
import NavBar from "../navBar.component";
import { useAuth } from "../authContext";
import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import "../viewProblems/manageProblems.scss";
import "../viewProblems/viewProblems.scss";
import toast from "react-hot-toast";
export default function ManageClasses() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

    function courseClick(course: Course) {
        navigate("/viewResults", { state: course });
    }

    function createCourseClick() {
        navigate("/createClass");
    }

    function editCourseClick(course: Course) {
        navigate("/createClass", { state: course });
    }

    const deleteCourseClick = async (course_id: number) => {
        let userConfirmed = confirm("Are you sure you want to delete this course permanently?");
        if (userConfirmed) {
            try {
                const res = await fetch('/api/deleteCourse', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        course_id: course_id
                    })
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error deleting course:", errorData.message);
                    throw new Error("Failed to delete course");
                }
                setCourses(prev =>
                    prev.filter(c => c.course_id !== course_id)
                );
                toast.success("Course deleted successfully");
            } catch (error: any) {
                toast.error("Failed to delete course. Please try again.");
                console.error("Error deleting course:", error.message);
            }
        }
    }

    useEffect(() => {
        async function fetchCourses() {
            const res = await fetch('/api/myCourses', {
                method: "GET",
                credentials: "include"
            });
            if (res.ok) {
                setCourses(await res.json());
            } else {
                const errorData = await res.json();
                console.error("Error fetching courses:", errorData.message);
            }
        }
        fetchCourses();
    }, []);

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="manageProblemsBody">
                <div>
                    <button onClick={createCourseClick} className="createNew">
                        <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Create New Course
                    </button>
                </div>
                <div className="manageProblems">
                    <ul>
                        {Array.isArray(courses)
                            ? courses.map((c) =>
                                <li className="manageProblemsRow" key={c.course_id}>
                                    <button
                                        style={{ height: 55 }}
                                        className="problem"
                                        key={c.course_id}
                                        onClick={() => courseClick(c)}
                                    >
                                        {courses.indexOf(c) + 1}. {c.course_title}
                                    </button>
                                    <button className="manageProblemButton" onClick={() => editCourseClick(c)}>
                                        <img className="manageIcons" src="editIcon.svg" alt="edit" />
                                    </button>
                                    <button className="manageProblemButton" onClick={() => deleteCourseClick(c.course_id)}>
                                        <img className="manageIcons" src="binIcon.svg" alt="delete" />
                                    </button>
                                </li>)
                            : <li>No problems found</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}