import { useEffect, useState } from "react";
import "./viewProblems.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "../navBar.component";
import { useAuth } from "../authContext";
import type { Problem } from "../types/problem";
import type { Course } from "../types/course";
import SideBar from "../sidebar.component";
import type { Submission } from "../types/Submission";
import { api } from "../sharedUtils";

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(1);
  const { user } = useAuth();
  const [userName, setUserName] = useState<String>("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.problem_title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficulty === "all" ? true
        : difficulty === "easy" ? problem.difficulty <= 2
          : difficulty === "medium" ? problem.difficulty === 3
            : problem.difficulty >= 4;
    return matchesSearch && matchesDifficulty;
  }
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
      const res = await api.post('/api/problems', {
        selectedCourse: selectedCourse
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
      const res = await api.get('/api/fetchCourses');
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
      const res = await api.get(`/api/fetchUser?userId=` + user?.user_id);
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

  useEffect(() => {
    async function fetchSubmissions() {
      const res = await api.get(`/api/fetchSubmissions?userId=${user?.user_id}`);

      if (res.ok) {
        const submissions = await res.json();
        setSubmissions(submissions);
      } else {
        const errorData = await res.json();
        console.error("Error fetching submissions: ", errorData.message);
        return;
      }
    }
    fetchSubmissions()
  }, [])

  return (
    <div className="main">
      <NavBar />
      <SideBar user={user} courses={courses} selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} />
      <div className="problemsBody">
        <p className="greetingMessage">{getGreeting(currentHour)} {userName}</p>
        <div className="filteringOptions">
          <img src="search.svg" alt="search icon" className="searchIcon" />
          <input
            className="searchBar"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search Problems..."}
          />
          <div className="difficultyFilter">
            <p style={{ marginRight: "24px", marginTop: "0px", marginBottom: "0px" }}>Filter: </p>
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                className={`difficultyButton ${difficulty === d ? "active" : ""}`}
                onClick={() => setDifficulty(d as "all" | "easy" | "medium" | "hard")}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ul className="problemList">
          {Array.isArray(filteredProblems)
            ? filteredProblems.map((p) => {

              const isCompleted = submissions.find((s) => s.user_id === user?.user_id && p.problem_id === s.problem_id);

              return (
                <button
                  className="problem"
                  key={p.problem_id}
                  onClick={() => problemClick(p)}>
                  <img src="tick.svg" alt="tick" className="completedTick" style={{ visibility: isCompleted ? 'visible' : 'hidden' }} />
                  {
                    filteredProblems.indexOf(p) + 1}. {p.problem_title}
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
                </button>);
            })
            : <li>No problems found</li>}
        </ul>
      </div>
    </div>
  );
}