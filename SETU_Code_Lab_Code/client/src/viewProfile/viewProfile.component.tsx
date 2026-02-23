import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import LecturerSideBar from "../lecturerSideBar.component";
import NavBar from "../navBar.component";
import { useEffect, useState } from "react";
import "./viewProfile.scss";
import type { User } from "../types/user";
import type { Submission } from "../types/Submission";
import type { Problem } from "../types/problem";
import toast from "react-hot-toast";


export default function ViewProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const otherUser = location.state as User | undefined;
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [problems, setSubmittedProblems] = useState<Problem[]>([]);

    async function deleteAccount() {
        let userConfirmed = confirm("Are you sure you want to delete your account and all of its associated data, this action is irrevesible!");
        if (userConfirmed) {
            const deletedAccount = await fetch('/api/deleteAccount', {
                method: "DELETE",
                credentials: "include"
            });
            if (deletedAccount.ok) {
                toast.success("Account deleted successfully");
                navigate("/");
            } else {
                const errorData = await deletedAccount.json();
                toast.error("Error deleting account: " + errorData.message);
                console.error("Error deleting account: ", errorData.message);
            }
        }
    }

    function submissionClicked(submission: Submission, student: User | undefined, problem: Problem | undefined) {
        if (submission) {
            navigate("/viewResult", { state: { submission, student, problem } });
        } else {
            toast.error("Submission not found");
        }
    }

    useEffect(() => {
        let activeUserId: number;

        if (otherUser) {
            activeUserId = otherUser.user_id;
        } else if (user) {
            activeUserId = user.user_id;
        } else {
            navigate("/problems");
            return;
        }

        async function fetchData() {
            const userRes = await fetch(
                `/api/fetchUser?userId=` + activeUserId,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (userRes.ok) {
                const fullUser: User = await userRes.json();
                setUserData(fullUser);
            } else {
                const errorData = await userRes.json();
                console.error("Error fetching user: ", errorData.message);
                return;
            }

            let submissionsData: Submission[] = [];

            const submissionsRes = await fetch(
                `/api/fetchSubmissions?userId=${activeUserId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (submissionsRes.ok) {
                submissionsData = await submissionsRes.json();
                setSubmissions(submissionsData);
            } else {
                const errorData = await submissionsRes.json();
                console.error("Error fetching submissions: ", errorData.message);
            }

            const problemIds = submissionsData.map(s => s.problem_id);

            if (problemIds.length === 0) {
                setSubmittedProblems([]);
                return;
            }

            const problemsRes = await fetch('/api/fetchSubmittedProblems', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ problem_ids: problemIds })
            });

            if (problemsRes.ok) {
                setSubmittedProblems(await problemsRes.json());
            } else {
                const errorData = await problemsRes.json();
                console.error("Error fetching submitted problems: ", errorData.message);
            }
        }

        fetchData();
    }, [otherUser, user, navigate]);

    console.log("userData", userData);

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="profileScreenBody">
                <div className="profileCard" style={user?.role == "lecturer" ? { marginLeft: 212 } : { marginLeft: 24 }}>
                    <div className="profileContent">
                        <img src="/profileIcon.svg" alt="profileIcon" className="avatar" />
                        <p className="userName">{userData?.user_name}</p>
                        <p className="userRole">{userData?.role == "lecturer" ? "Lecturer" : "Student"}</p>
                    </div>
                    <div className="profileStats">
                        <table>
                            <tbody>
                                <tr>
                                    <td><p>Problems completed: </p></td>
                                    <td className="profileStats">{problems.length}</td>
                                </tr>
                                <tr>
                                    <td><p>Longest Streak: </p></td>
                                    <td className="profileStats">TODO</td>
                                </tr>
                                <tr>
                                    <td><p>Rank: </p></td>
                                    <td className="profileStats">TODO</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="deleteAccountButton" onClick={deleteAccount}>Delete Account</button>
                    </div>

                </div>
                <div className="resultBody">
                    <div className="resultHeader">
                        <p>Submission History</p>
                    </div>
                    <div className="resultsContent">
                        {submissions.length > 1 ?
                            <table className="submissionTable">
                                <thead>
                                    <tr>
                                        <th className="profileTableHeading">
                                            Problem:
                                        </th>
                                        <th className="profileTableHeading">
                                            Overall Status:
                                        </th>
                                        <th className="profileTableHeading">
                                            Submitted at:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        submissions.map((submission) => {
                                            const submittedAt = new Date(submission.submitted_at)
                                            const submittedAtFormatted = new Intl.DateTimeFormat("en-IE", {
                                                dateStyle: "medium",
                                                timeStyle: "short"
                                            }).format(submittedAt);
                                            return (
                                                <tr onClick={() => submissionClicked(submission, userData, problems.find(p => (p.problem_id === submission.problem_id)))} className="submissionRow" key={submission.submission_id}>
                                                    <td style={{ padding: "0px" }}>
                                                        <div className="submissionCell start">
                                                            {problems.find(p => p.problem_id === submission.problem_id)?.problem_title}
                                                        </div>
                                                    </td>
                                                    <td style={submission.overall_status ? { color: "green", padding: "0px" } : { color: "red", padding: "0px" }}>
                                                        <div className="submissionCell middle">
                                                            {submission.overall_status ? "Pass" : "Fail"}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "0px", width: "100%" }}>
                                                        <div className="submissionCell end">{submittedAtFormatted}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            : <p style={{ textAlign: "center", height: "600px", alignContent: "center", fontSize: "20px" }}>This user has not made any submsisions yet :(</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}