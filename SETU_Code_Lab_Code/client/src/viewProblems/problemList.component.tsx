import { useEffect, useState } from "react";
import "./viewProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar.component";
import LecturerSideBar from "./lecturerSideBar.component";
import { useAuth } from "../authContext";
import type { Problem } from "../types/problem";
import type { Course } from "../types/course";

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Number>(1);
  const { user } = useAuth();

  function problemClick(problem: Problem) {
    navigate("/problem", { state: problem });
  }

  useEffect(() => {
    async function fetchCourseProblems() {
      const res = await fetch('/api/problems', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          selectedCourse: selectedCourse
        })
      });
      if (res.ok) {
        setProblems(await res.json());
      } else {
        const errorData = await res.json();
        console.error("Error fetching problems:", errorData.message);
      }
    }
    fetchCourseProblems();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch('/api/fetchCourses', {
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

  console.log("problems : ", problems);

  return (
    <div className="main">
      <NavBar />
      {
        user?.role == "lecturer"
          ? <LecturerSideBar />
          :
          <div className="sideBar">
            <h3 className="title">Your Courses</h3>
            <ul>
              {Array.isArray(courses)
                ? courses.map((c) => (
                  <button
                    className="option"
                    key={c.course_id}>
                    {c.course_title}
                  </button>
                ))
                : <li>No courses found</li>}
            </ul>
          </div>
      }
      <div>
        <ul className="problemList">
          {Array.isArray(problems)
            ? problems.map((p) => <button
              className="problem"
              key={p.problem_id}
              onClick={() => problemClick(p)}>
              {problems.indexOf(p) + 1}. {p.problem_title}
              <span className="problemListItem">| {p.user_name}</span>
              <span className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    className="star"
                    src={i < p.difficulty ? "/filledStar.svg" : "/emptyStar.svg"}
                    alt="star"
                  />
                ))}
              </span>
            </button>)
            : <li>No problems found</li>}
        </ul>
      </div>
    </div>
  );
}