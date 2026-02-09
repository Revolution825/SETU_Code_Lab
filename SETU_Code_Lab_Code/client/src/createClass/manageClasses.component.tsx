import { useNavigate } from "react-router-dom";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
import { useAuth } from "../authContext";
import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import "../viewProblems/manageProblems.scss";
import "../viewProblems/viewProblems.scss";
export default function ManageClasses() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

    function createCourseClick() {
        navigate("/createClass");
    }

    function editCourseClick(course: Course) {
        navigate("/createClass", { state: course });
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
                                    >
                                        {courses.indexOf(c) + 1}. {c.course_title}
                                    </button>
                                    <button className="manageProblemButton" onClick={() => editCourseClick(c)}>
                                        <img className="manageIcons" src="editIcon.svg" alt="edit" />
                                    </button>
                                    <button className="manageProblemButton">
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