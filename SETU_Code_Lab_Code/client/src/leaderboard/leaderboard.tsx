import NavBar from "../navBar.component";
import "./leaderboard.scss";
import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import type { LeaderboardEntry } from "../types/leaderboard";
import { useAuth } from "../authContext";
import { api } from "../sharedUtils";


export default function Leaderboard() {
    const { user } = useAuth();
    const [dateRange, setDateRange] = useState("allTime");
    const [filterBy, setFilterBy] = useState("score");
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number>(1);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        async function fetchCourses() {
            const res = await api.get('/api/fetchCourses');
            if (res.ok) {
                setCourses(await res.json());
            } else {
                const errorData = await res.json();
                console.error("Error fetching courses: ", errorData.message);
            }
        }
        fetchCourses();
    }, [])

    useEffect(() => {
        async function fetchLeaderboard() {
            const res = await api.get(`/api/fetchLeaderboard?dateRange=${dateRange}&filterBy=${filterBy}&courseId=${selectedCourse}`);
            if (res.ok) {
                setLeaderboardEntries(await res.json());
            } else {
                const errorData = await res.json();
                console.error("Error fetching leaderboard entries: ", errorData.message);
            }
        }
        fetchLeaderboard();
    }, [dateRange, filterBy, selectedCourse])

    return (
        <div>
            <NavBar />
            <div className="leaderboardScreenBody">
                <div className="leaderboardCard">
                    <div className="leaderboardCardHeader">
                        <p>Leaderboard</p>
                    </div>
                    <div className="leaderboardWrapper">
                        {
                            leaderboardEntries.length > 0 ? <table className="leaderboard">
                                <thead>
                                    <tr>
                                        <th className="leaderboardHeadings">Student</th>
                                        <th className="leaderboardHeadings">Current Streak</th>
                                        <th className="leaderboardHeadings">Total Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        leaderboardEntries.map((entry, index) => (
                                            <tr key={entry.user_id} className={entry.user_id === user?.user_id ? "highlighted leaderboardEntry" : "leaderboardEntry"}>
                                                <td className="roundedLeft">{index + 1}. {entry.user_name}</td>
                                                <td>{entry.current_streak}</td>
                                                <td className="roundedRight">{entry.total_points}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> :
                                <div className="noUsersFoundMessage">
                                    <p >No Records Found :(</p>
                                </div>
                        }

                    </div>
                </div>
                <div className="leaderboardSidebar">
                    <div className="leaderboardSetting borderBottom">
                        <p className="leaderboardSettingHeading">DATE RANGE:</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="dateRange"
                                            value="allTime"
                                            checked={dateRange === "allTime"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            All Time
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="dateRange"
                                            value="lastYear"
                                            checked={dateRange === "lastYear"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            Last Year
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="dateRange"
                                            value="lastMonth"
                                            checked={dateRange === "lastMonth"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            Last Month
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="dateRange"
                                            value="lastWeek"
                                            checked={dateRange === "lastWeek"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            Last Week
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="leaderboardSetting borderBottom">
                        <p className="leaderboardSettingHeading">COURSES:</p>
                        <table>
                            <tbody>
                                {
                                    courses.map(course => (
                                        <tr key={course.course_id}>

                                            <td className="radioButton">
                                                <input
                                                    type="radio"
                                                    name="course"
                                                    value={course.course_id}
                                                    checked={selectedCourse === course.course_id}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedCourse(Number(e.target.value))}
                                                />
                                            </td>
                                            <td>
                                                <label>
                                                    {course.course_title}
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="leaderboardSetting borderBottom">
                        <p className="leaderboardSettingHeading">FILTER BY:</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="filterBy"
                                            value="score"
                                            checked={filterBy === "score"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterBy(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            Score
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="radioButton">
                                        <input
                                            type="radio"
                                            name="filterBy"
                                            value="currentStreak"
                                            checked={filterBy === "currentStreak"}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterBy(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <label>
                                            Current Streak
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}