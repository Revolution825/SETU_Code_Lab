import { useLocation, useNavigate } from "react-router-dom";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
import { useAuth } from "../authContext";
import "./createClass.scss";
import { useEffect, useState } from "react";
import type { Problem } from "../types/problem";
import type { Course } from "../types/course";
import toast from "react-hot-toast";

export default function CreateClass() {
    const navigate = useNavigate();
    const location = useLocation();
    const course: Course = location.state;
    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
    const [students, setStudents] = useState<{ student_id: number, student_name: string }[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [title, setTitle] = useState(course?.course_title ?? "");
    const [description, setDescription] = useState(course?.course_description ?? "");
    const { user } = useAuth();

    const toggleProblem = (problem_id: number) => {
        setSelectedProblems(prev =>
            prev.includes(problem_id)
                ? prev.filter(id => id !== problem_id)
                : [...prev, problem_id]
        );
    };

    const toggleStudents = (student_id: number) => {
        setSelectedStudents(prev =>
            prev.includes(student_id)
                ? prev.filter(id => id !== student_id)
                : [...prev, student_id]
        );
    };

    useEffect(() => {
        async function fetchAllData() {
            try {

                const problemsRes = await fetch('/api/myProblems', { method: 'GET', credentials: 'include' });
                const problemsData = problemsRes.ok ? await problemsRes.json() : [];
                setProblems(problemsData);
                console.log("Fetched problems:", problemsData);

                const studentsRes = await fetch('/api/students', { method: 'GET', credentials: 'include' });
                const studentsData = studentsRes.ok ? await studentsRes.json() : [];
                setStudents(studentsData);
                console.log("Fetched students:", studentsData);

                if (course?.course_id) {
                    const assocRes = await fetch('/api/problemStudentId', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ course_id: course.course_id })
                    });
                    if (assocRes.ok) {
                        const assocData = await assocRes.json();
                        console.log("Fetched course associations:", assocData);

                        const problemIds = assocData.problemIds?.map((p: { problem_id: number }) => p.problem_id) ?? [];
                        const studentIds = assocData.studentIds?.map((s: { user_id: number }) => s.user_id) ?? [];

                        setSelectedProblems(
                            problemsData.map((p: { problem_id: number }) => p.problem_id)
                                .filter((id: any) => problemIds.includes(id))
                        );

                        setSelectedStudents(
                            studentsData.map((s: { student_id: number }) => s.student_id)
                                .filter((id: any) => studentIds.includes(id))
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        }

        fetchAllData();
    }, [course?.course_id]);

    const handleSubmit = async () => {
        if (course?.course_id) {
            updateCourse();
        } else {
            createNewCourse();
        }
    }

    const createNewCourse = async () => {
        try {
            const res = await fetch('/api/createCourse', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    course_title: title,
                    course_description: description,
                    problem_ids: selectedProblems,
                    student_ids: selectedStudents
                })
            });
            if (!res.ok) {
                toast.error("Failed to create course. Please try again.");
                throw new Error("Failed to create course");
            }
            toast.success("Course created successfully")
            navigate("/manageClasses");
        } catch (error: any) {
            toast.error("Failed to create course. Please try again.");
            console.error("Error creating course :", error.message);
        }
    }

    const updateCourse = async () => {
        try {
            const res = await fetch('/api/updateCourse', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    course_id: course?.course_id,
                    course_title: title,
                    course_description: description,
                    problem_ids: selectedProblems,
                    student_ids: selectedStudents
                })
            });
            if (!res.ok) {
                toast.error("Failed to update course. Please try again.");
                throw new Error("Failed to update course");
            }
            toast.success("Course updated successfully")
            navigate("/manageClasses");
        } catch (error: any) {
            toast.error("Failed to update course. Please try again.");
            console.error("Error updating course :", error.message);
        }
    }

    return (
        <>
            <div>
                <NavBar />
                {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            </div>
            <div>
                <form onSubmit={
                    (e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="createCourseForm">
                    <div className="createCourseContent">
                        <div className="createCourseFormBackground">
                            <div className="createProblemHeader">
                                Create New Course
                            </div>

                            <div className="createCourseInput">
                                <label>
                                    Title:
                                </label>
                                <input
                                    className="inputBoxExtended topRounded bottomRounded"
                                    type="text"
                                    maxLength={100}
                                    value={title}
                                    placeholder="eg. Y2 Software Development..."
                                    onChange={(e) => setTitle(e.target.value)}
                                    required />
                            </div>
                            <div className="createCourseInput">
                                <label>
                                    Description:
                                </label>
                                <input
                                    className="inputBoxExtended topRounded bottomRounded"
                                    type="text"
                                    maxLength={1000}
                                    value={description}
                                    placeholder="eg. This course contains simple Java problems targeted at Y2 Software Development students..."
                                    onChange={(e) => setDescription(e.target.value)}
                                    required />
                            </div>

                        </div>
                        <div className="selectionContainer">
                            <div className="problemSelection">
                                <div className="createProblemHeader">
                                    Select Problems
                                </div>
                                <div className="problemSelectionList">
                                    {problems.map(problem => (
                                        <label key={problem.problem_id} className="problemItem">
                                            <input
                                                type="checkbox"
                                                checked={selectedProblems.includes(problem.problem_id)}
                                                onChange={() => toggleProblem(problem.problem_id)}
                                            />
                                            {problem.problem_title}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="studentSelection">
                                <div className="createProblemHeader">
                                    Select Students
                                </div>
                                <div className="problemSelectionList">
                                    {students.map(student => (
                                        <label key={student.student_id} className="problemItem">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.student_id)}
                                                onChange={() => toggleStudents(student.student_id)}
                                            />
                                            {student.student_name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="submitButtonDiv">
                            <button type="submit" className="submitCourseButton">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}