import { useEffect, useState } from "react";
import "./viewProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "../navBar.component";
import { useAuth } from "../authContext";
import type { Problem } from "../types/problem";
import type { Course } from "../types/course";
import SideBar from "../sidebar.component";

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(1);
  const { user } = useAuth();
  const [userName, setUserName] = useState<String>("");
  const [search, setSearch] = useState("");
  const filteredProblems = problems.filter((problem) =>
    problem.problem_title.toLowerCase().includes(search.toLowerCase())
  );

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  function getGreeting(hour: number) {
    if (hour >= 0 && hour < 5) {
      return "Good Night";
    } else if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

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
    if (selectedCourse) {
      fetchCourseProblems();
    }
  }, [selectedCourse]);

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

  useEffect(() => {
    async function fetchUserName() {
      const res = await fetch(`/api/fetchUser?userId=` + user?.user_id, {
        method: "GET",
        credentials: "include"
      });
      if (res.ok) {
        const user = await res.json();
        setUserName(user.user_name);
      } else {
        const errorData = await res.json();
        console.error("Error fetching userName:", errorData.message);
      }
    }
    fetchUserName();
  }, [])

  return (
    <div className="main">
      <NavBar />
      <SideBar user={user} courses={courses} selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} />
      <div className="problemsBody">
        <p className="greetingMessage">{getGreeting(currentHour)} {userName}</p>
        <img src="search.svg" alt="search icon" className="searchIcon" />
        <input
          className="searchBar"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Search Problems..."}
        />
        <ul className="problemList">
          {Array.isArray(filteredProblems)
            ? filteredProblems.map((p) => <button
              className="problem"
              key={p.problem_id}
              onClick={() => problemClick(p)}>
              {filteredProblems.indexOf(p) + 1}. {p.problem_title}
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